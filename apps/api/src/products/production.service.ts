import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { TenantPrismaService } from '../core/prisma/tenant-prisma.service';
import { CreateProductionOrderDto } from './dto/production.dto';

@Injectable()
export class ProductionService {
  private async generateOrderNumber(prisma: TenantPrismaService): Promise<string> {
    const count = await prisma.productionOrder.count();
    return `OP-${String(count + 1).padStart(5, '0')}`;
  }

  async list(prisma: TenantPrismaService, status?: string) {
    return prisma.productionOrder.findMany({
      where: { ...(status && { status: status as any }) },
      include: {
        product: { select: { id: true, name: true, sku: true, unit: true } },
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(prisma: TenantPrismaService, id: string) {
    const order = await prisma.productionOrder.findUnique({
      where: { id },
      include: {
        product: { select: { id: true, name: true, sku: true, unit: true } },
        items: true,
      },
    });
    if (!order) throw new NotFoundException('Ordem de produção não encontrada');
    return order;
  }

  async create(prisma: TenantPrismaService, dto: CreateProductionOrderDto) {
    const product = await prisma.product.findUnique({
      where: { id: dto.productId },
      include: { bom: { include: { items: { include: { component: true } } } } },
    });
    if (!product) throw new NotFoundException('Produto não encontrado');
    if (!product.bom) throw new BadRequestException('Produto não possui ficha técnica (BOM)');

    const number = await this.generateOrderNumber(prisma);
    const bomYield = product.bom.yield.toNumber();

    // Calcula quantidade necessária de cada componente
    const orderItems = product.bom.items.map((item) => {
      const baseQty = (item.quantity.toNumber() * dto.quantity) / bomYield;
      const withLoss = baseQty * (1 + item.lossPercent.toNumber() / 100);
      return {
        componentName: item.component.name,
        requiredQty: Math.ceil(withLoss * 1000) / 1000, // arredonda para 3 casas
        consumedQty: 0,
      };
    });

    return prisma.productionOrder.create({
      data: {
        number,
        productId: dto.productId,
        quantity: dto.quantity,
        notes: dto.notes,
        items: { create: orderItems },
      },
      include: {
        product: { select: { id: true, name: true, sku: true, unit: true } },
        items: true,
      },
    });
  }

  async start(prisma: TenantPrismaService, id: string) {
    const order = await this.findOne(prisma, id);
    if (order.status !== 'DRAFT' && order.status !== 'CONFIRMED') {
      throw new BadRequestException('Apenas ordens DRAFT ou CONFIRMED podem ser iniciadas');
    }
    return prisma.productionOrder.update({
      where: { id },
      data: { status: 'IN_PROGRESS', startedAt: new Date() },
    });
  }

  async complete(prisma: TenantPrismaService, id: string) {
    const order = await prisma.productionOrder.findUnique({
      where: { id },
      include: {
        product: { include: { bom: { include: { items: { include: { component: true } } } } } },
        items: true,
      },
    });
    if (!order) throw new NotFoundException('Ordem de produção não encontrada');
    if (order.status !== 'IN_PROGRESS') {
      throw new BadRequestException('Apenas ordens IN_PROGRESS podem ser concluídas');
    }

    const bomYield = order.product.bom?.yield.toNumber() ?? 1;

    // Baixa os componentes do estoque e dá entrada no produto acabado
    await prisma.$transaction(async (tx) => {
      // Saída de matéria-prima
      if (order.product.bom) {
        for (const bomItem of order.product.bom.items) {
          const baseQty = (bomItem.quantity.toNumber() * order.quantity.toNumber()) / bomYield;
          const toConsume = baseQty * (1 + bomItem.lossPercent.toNumber() / 100);

          const stock = await tx.stockItem.findFirst({
            where: { productId: bomItem.componentId },
          });
          if (!stock || stock.quantity.toNumber() < toConsume) {
            throw new BadRequestException(
              `Estoque insuficiente de ${bomItem.component.name} (disponível: ${stock?.quantity ?? 0}, necessário: ${toConsume.toFixed(3)})`,
            );
          }

          await tx.stockItem.update({
            where: { id: stock.id },
            data: { quantity: stock.quantity.toNumber() - toConsume },
          });

          await tx.stockMovement.create({
            data: {
              productId: bomItem.componentId,
              type: 'PRODUCTION_OUT',
              quantity: toConsume,
              referenceId: id,
              referenceType: 'PRODUCTION_ORDER',
              reason: `Consumido na OP ${order.number}`,
            },
          });
        }
      }

      // Entrada do produto acabado
      const finishedStock = await tx.stockItem.findFirst({ where: { productId: order.productId, locationId: null } });
      if (finishedStock) {
        await tx.stockItem.update({
          where: { id: finishedStock.id },
          data: { quantity: finishedStock.quantity.toNumber() + order.quantity.toNumber() },
        });
      } else {
        await tx.stockItem.create({ data: { productId: order.productId, quantity: order.quantity } });
      }

      await tx.stockMovement.create({
        data: {
          productId: order.productId,
          type: 'PRODUCTION_IN',
          quantity: order.quantity,
          referenceId: id,
          referenceType: 'PRODUCTION_ORDER',
          reason: `Produzido na OP ${order.number}`,
        },
      });

      await tx.productionOrder.update({
        where: { id },
        data: { status: 'COMPLETED', completedAt: new Date() },
      });
    });

    return this.findOne(prisma, id);
  }

  async cancel(prisma: TenantPrismaService, id: string) {
    const order = await this.findOne(prisma, id);
    if (order.status === 'COMPLETED') throw new BadRequestException('Ordens concluídas não podem ser canceladas');
    return prisma.productionOrder.update({ where: { id }, data: { status: 'CANCELLED' } });
  }
}
