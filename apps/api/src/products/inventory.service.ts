import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { TenantPrismaService } from '../core/prisma/tenant-prisma.service';
import { CreateStockMovementDto } from './dto/inventory.dto';

@Injectable()
export class InventoryService {
  async getCurrentStock(prisma: TenantPrismaService, productId?: string, locationId?: string) {
    return prisma.stockItem.findMany({
      where: {
        ...(productId && { productId }),
        ...(locationId && { locationId }),
      },
      include: {
        product: { select: { id: true, name: true, sku: true, unit: true, minStock: true, maxStock: true, type: true } },
        location: { select: { id: true, name: true } },
      },
      orderBy: { product: { name: 'asc' } },
    });
  }

  async getLowStockAlerts(prisma: TenantPrismaService) {
    const items = await prisma.stockItem.findMany({
      include: {
        product: { select: { id: true, name: true, sku: true, unit: true, minStock: true } },
        location: { select: { id: true, name: true } },
      },
    });
    return items.filter(
      (item) => item.product.minStock && item.quantity.toNumber() <= item.product.minStock.toNumber(),
    );
  }

  async createMovement(prisma: TenantPrismaService, dto: CreateStockMovementDto, performedById?: string) {
    const product = await prisma.product.findUnique({ where: { id: dto.productId } });
    if (!product) throw new NotFoundException('Produto não encontrado');
    if (product.type === 'SERVICE') throw new BadRequestException('Serviços não possuem controle de estoque');

    const totalCost = dto.unitCost ? dto.unitCost * dto.quantity : undefined;

    // Registra o movimento
    const movement = await prisma.stockMovement.create({
      data: {
        productId: dto.productId,
        type: dto.type as any,
        quantity: dto.quantity,
        unitCost: dto.unitCost,
        totalCost,
        locationId: dto.locationId,
        reason: dto.reason,
        referenceId: dto.referenceId,
        referenceType: 'MANUAL',
        performedById,
      },
    });

    // Atualiza quantidade no StockItem
    const isExit = ['EXIT', 'PRODUCTION_OUT', 'SALE_OUT', 'TRANSFER_OUT', 'LOSS'].includes(dto.type);
    const delta = isExit ? -dto.quantity : dto.quantity;

    const existing = await prisma.stockItem.findFirst({
      where: { productId: dto.productId, locationId: dto.locationId ?? null },
    });

    if (existing) {
      const newQty = existing.quantity.toNumber() + delta;
      if (newQty < 0) throw new BadRequestException('Estoque insuficiente para esta operação');
      await prisma.stockItem.update({
        where: { id: existing.id },
        data: { quantity: newQty },
      });
    } else {
      if (delta < 0) throw new BadRequestException('Estoque insuficiente para esta operação');
      await prisma.stockItem.create({
        data: { productId: dto.productId, locationId: dto.locationId ?? null, quantity: delta },
      });
    }

    return movement;
  }

  async listMovements(prisma: TenantPrismaService, productId?: string, type?: string, limit = 100) {
    return prisma.stockMovement.findMany({
      where: {
        ...(productId && { productId }),
        ...(type && { type: type as any }),
      },
      include: { product: { select: { id: true, name: true, sku: true, unit: true } } },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async listLocations(prisma: TenantPrismaService) {
    return prisma.stockLocation.findMany({ orderBy: { name: 'asc' } });
  }

  async createLocation(prisma: TenantPrismaService, name: string, description?: string) {
    return prisma.stockLocation.create({ data: { name, description } });
  }
}
