import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { TenantPrismaService } from '../core/prisma/tenant-prisma.service';
import { CreateSaleOrderDto } from './dto/sale.dto';

@Injectable()
export class SalesService {
  private async generateOrderNumber(prisma: TenantPrismaService): Promise<string> {
    const count = await prisma.saleOrder.count();
    return `PV-${String(count + 1).padStart(5, '0')}`;
  }

  async list(prisma: TenantPrismaService, status?: string, sellerId?: string, supplierId?: string) {
    return prisma.saleOrder.findMany({
      where: {
        ...(status && { status: status as any }),
        ...(sellerId && { sellerId }),
        ...(supplierId && { supplierId }),
      },
      include: {
        items: { include: { product: { select: { id: true, name: true, sku: true, unit: true } } } },
        seller: { select: { id: true, name: true } },
        supplier: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(prisma: TenantPrismaService, id: string) {
    const order = await prisma.saleOrder.findUnique({
      where: { id },
      include: {
        items: { include: { product: { select: { id: true, name: true, sku: true, unit: true } } } },
        seller: { select: { id: true, name: true } },
        supplier: { select: { id: true, name: true } },
      },
    });
    if (!order) throw new NotFoundException('Pedido de venda não encontrado');
    return order;
  }

  async create(prisma: TenantPrismaService, dto: CreateSaleOrderDto) {
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

    const discount = 0;
    const total = subtotal - discount;

    return prisma.saleOrder.create({
      data: {
        number,
        clientName: dto.clientName,
        clientDoc: dto.clientDoc,
        clientEmail: dto.clientEmail,
        clientPhone: dto.clientPhone,
        clientAddress: dto.clientAddress,
        sellerId: dto.sellerId,
        supplierId: dto.supplierId,
        isPriceLocked: dto.isPriceLocked ?? false,
        isSafra: dto.isSafra ?? false,
        safra: dto.safra,
        invoiceNumber: dto.invoiceNumber,
        paymentMethod: dto.paymentMethod,
        notes: dto.notes,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        subtotal,
        discount,
        total,
        items: { create: processedItems },
      },
      include: {
        items: { include: { product: { select: { id: true, name: true, sku: true, unit: true } } } },
        seller: { select: { id: true, name: true } },
        supplier: { select: { id: true, name: true } },
      },
    });
  }

  async confirm(prisma: TenantPrismaService, id: string) {
    const order = await this.findOne(prisma, id);
    if (order.status !== 'DRAFT') throw new BadRequestException('Apenas pedidos DRAFT podem ser confirmados');
    return prisma.saleOrder.update({ where: { id }, data: { status: 'CONFIRMED' } });
  }

  async deliver(prisma: TenantPrismaService, id: string) {
    const order = await prisma.saleOrder.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!order) throw new NotFoundException('Pedido não encontrado');
    if (order.status !== 'CONFIRMED') throw new BadRequestException('Apenas pedidos CONFIRMED podem ser entregues');

    await prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        const stock = await tx.stockItem.findFirst({ where: { productId: item.productId } });
        if (!stock || stock.quantity.toNumber() < item.quantity.toNumber()) {
          throw new BadRequestException(`Estoque insuficiente para entrega do produto ${item.productId}`);
        }
        await tx.stockItem.update({
          where: { id: stock.id },
          data: { quantity: stock.quantity.toNumber() - item.quantity.toNumber() },
        });
        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            type: 'SALE_OUT',
            quantity: item.quantity,
            unitCost: item.unitPrice,
            totalCost: item.total,
            referenceId: id,
            referenceType: 'SALE_ORDER',
            reason: `Venda ${order.number}`,
          },
        });
      }
      await tx.saleOrder.update({ where: { id }, data: { status: 'DELIVERED', deliveryStatus: 'DELIVERED', deliveredAt: new Date() } });
    });

    return this.findOne(prisma, id);
  }

  async updateDeliveryStatus(prisma: TenantPrismaService, id: string, deliveryStatus: string, notes?: string) {
    const order = await this.findOne(prisma, id);
    const data: any = { deliveryStatus: deliveryStatus as any };
    if (notes) data.notes = notes;
    if (deliveryStatus === 'DELIVERED') data.deliveredAt = new Date();
    return prisma.saleOrder.update({ where: { id }, data });
  }

  async cancel(prisma: TenantPrismaService, id: string) {
    const order = await this.findOne(prisma, id);
    if (order.status === 'DELIVERED') throw new BadRequestException('Pedidos entregues não podem ser cancelados');
    return prisma.saleOrder.update({ where: { id }, data: { status: 'CANCELLED' } });
  }

  async dashboard(prisma: TenantPrismaService) {
    const [total, pending, delivered, cancelled, revenue, byStatus, bySeller] = await Promise.all([
      prisma.saleOrder.count(),
      prisma.saleOrder.count({ where: { status: { in: ['DRAFT', 'CONFIRMED'] } } }),
      prisma.saleOrder.count({ where: { status: 'DELIVERED' } }),
      prisma.saleOrder.count({ where: { status: 'CANCELLED' } }),
      prisma.saleOrder.aggregate({ _sum: { total: true }, where: { status: { not: 'CANCELLED' } } }),
      prisma.saleOrder.groupBy({ by: ['deliveryStatus'], _count: true }),
      prisma.saleOrder.groupBy({ by: ['sellerId'], _count: true, _sum: { total: true }, where: { status: { not: 'CANCELLED' } } }),
    ]);
    return {
      total, pending, delivered, cancelled,
      totalRevenue: revenue._sum.total ?? 0,
      byDeliveryStatus: byStatus,
      bySeller,
    };
  }

  async listBySeller(prisma: TenantPrismaService, sellerId: string) {
    return prisma.saleOrder.findMany({
      where: { sellerId },
      include: {
        items: { include: { product: { select: { id: true, name: true, sku: true, unit: true } } } },
        seller: { select: { id: true, name: true } },
        supplier: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
