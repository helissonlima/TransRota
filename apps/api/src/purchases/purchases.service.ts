import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { TenantPrismaService } from '../core/prisma/tenant-prisma.service';
import { CreatePurchaseOrderDto, ReceivePurchaseDto } from './dto/purchase.dto';

@Injectable()
export class PurchasesService {
  private async generateOrderNumber(prisma: TenantPrismaService): Promise<string> {
    const count = await prisma.purchaseOrder.count();
    return `OC-${String(count + 1).padStart(5, '0')}`;
  }

  async list(prisma: TenantPrismaService, status?: string, supplierId?: string) {
    return prisma.purchaseOrder.findMany({
      where: {
        ...(status && { status: status as any }),
        ...(supplierId && { supplierId }),
      },
      include: {
        supplier: { select: { id: true, name: true } },
        items: { include: { product: { select: { id: true, name: true, sku: true, unit: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(prisma: TenantPrismaService, id: string) {
    const order = await prisma.purchaseOrder.findUnique({
      where: { id },
      include: {
        supplier: true,
        items: { include: { product: { select: { id: true, name: true, sku: true, unit: true } } } },
      },
    });
    if (!order) throw new NotFoundException('Ordem de compra não encontrada');
    return order;
  }

  async create(prisma: TenantPrismaService, dto: CreatePurchaseOrderDto) {
    const supplier = await prisma.supplier.findUnique({ where: { id: dto.supplierId } });
    if (!supplier) throw new NotFoundException('Fornecedor não encontrado');

    const number = await this.generateOrderNumber(prisma);
    let subtotal = 0;

    const processedItems = await Promise.all(
      dto.items.map(async (item) => {
        const product = await prisma.product.findUnique({ where: { id: item.productId } });
        if (!product) throw new NotFoundException(`Produto ${item.productId} não encontrado`);
        const lineDiscount = item.discount ?? 0;
        const total = item.quantity * item.unitPrice - lineDiscount;
        subtotal += total;
        return { ...item, discount: lineDiscount, total };
      }),
    );

    return prisma.purchaseOrder.create({
      data: {
        number,
        supplierId: dto.supplierId,
        invoiceNumber: dto.invoiceNumber,
        isPriceLocked: dto.isPriceLocked ?? false,
        isSafra: dto.isSafra ?? false,
        safra: dto.safra,
        notes: dto.notes,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        subtotal,
        discount: 0,
        total: subtotal,
        items: { create: processedItems },
      },
      include: {
        supplier: { select: { id: true, name: true } },
        items: { include: { product: { select: { id: true, name: true, sku: true, unit: true } } } },
      },
    });
  }

  async confirm(prisma: TenantPrismaService, id: string) {
    const order = await this.findOne(prisma, id);
    if (order.status !== 'DRAFT') throw new BadRequestException('Apenas ordens DRAFT podem ser confirmadas');
    return prisma.purchaseOrder.update({ where: { id }, data: { status: 'CONFIRMED' } });
  }

  async receive(prisma: TenantPrismaService, id: string, dto: ReceivePurchaseDto) {
    const order = await prisma.purchaseOrder.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!order) throw new NotFoundException('Ordem não encontrada');
    if (!['CONFIRMED', 'PARTIALLY_RECEIVED'].includes(order.status))
      throw new BadRequestException('Apenas ordens CONFIRMED ou PARTIALLY_RECEIVED podem receber itens');

    await prisma.$transaction(async (tx) => {
      let allReceived = true;
      for (const receiveItem of dto.items) {
        const orderItem = order.items.find(i => i.id === receiveItem.itemId);
        if (!orderItem) throw new NotFoundException(`Item ${receiveItem.itemId} não encontrado`);

        const newReceivedQty = orderItem.receivedQty.toNumber() + receiveItem.receivedQty;
        if (newReceivedQty > orderItem.quantity.toNumber())
          throw new BadRequestException(`Quantidade recebida excede a quantidade do pedido`);

        await tx.purchaseOrderItem.update({
          where: { id: receiveItem.itemId },
          data: { receivedQty: newReceivedQty },
        });

        // Dar entrada no estoque
        const existing = await tx.stockItem.findFirst({
          where: { productId: orderItem.productId, locationId: null },
        });
        if (existing) {
          await tx.stockItem.update({
            where: { id: existing.id },
            data: { quantity: existing.quantity.toNumber() + receiveItem.receivedQty },
          });
        } else {
          await tx.stockItem.create({
            data: { productId: orderItem.productId, quantity: receiveItem.receivedQty },
          });
        }

        await tx.stockMovement.create({
          data: {
            productId: orderItem.productId,
            type: 'ENTRY',
            quantity: receiveItem.receivedQty,
            unitCost: orderItem.unitPrice,
            totalCost: orderItem.unitPrice.toNumber() * receiveItem.receivedQty,
            referenceId: id,
            referenceType: 'PURCHASE_ORDER',
            reason: `Recebimento OC ${order.number}`,
          },
        });

        if (newReceivedQty < orderItem.quantity.toNumber()) allReceived = false;
      }

      // Check remaining items
      const updatedItems = await tx.purchaseOrderItem.findMany({ where: { purchaseOrderId: id } });
      const stillPending = updatedItems.some(i => i.receivedQty.toNumber() < i.quantity.toNumber());

      await tx.purchaseOrder.update({
        where: { id },
        data: {
          status: stillPending ? 'PARTIALLY_RECEIVED' : 'RECEIVED',
          receivedAt: stillPending ? undefined : new Date(),
        },
      });
    });

    return this.findOne(prisma, id);
  }

  async cancel(prisma: TenantPrismaService, id: string) {
    const order = await this.findOne(prisma, id);
    if (order.status === 'RECEIVED') throw new BadRequestException('Ordens recebidas não podem ser canceladas');
    return prisma.purchaseOrder.update({ where: { id }, data: { status: 'CANCELLED' } });
  }

  async dashboard(prisma: TenantPrismaService) {
    const [total, pending, received, totalValue] = await Promise.all([
      prisma.purchaseOrder.count(),
      prisma.purchaseOrder.count({ where: { status: { in: ['DRAFT', 'CONFIRMED'] } } }),
      prisma.purchaseOrder.count({ where: { status: 'RECEIVED' } }),
      prisma.purchaseOrder.aggregate({ _sum: { total: true }, where: { status: { not: 'CANCELLED' } } }),
    ]);
    return { total, pending, received, totalValue: totalValue._sum.total ?? 0 };
  }
}
