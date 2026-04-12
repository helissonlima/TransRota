import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { TenantPrismaService } from '../core/prisma/tenant-prisma.service';
import { CreateProductDto, UpdateProductDto, CreateCategoryDto } from './dto/product.dto';
import { UpsertBOMDto } from './dto/bom.dto';

@Injectable()
export class ProductsService {
  // ------------------- Categories -------------------

  async listCategories(prisma: TenantPrismaService) {
    return prisma.productCategory.findMany({ orderBy: { name: 'asc' } });
  }

  async createCategory(prisma: TenantPrismaService, dto: CreateCategoryDto) {
    return prisma.productCategory.create({ data: dto });
  }

  async deleteCategory(prisma: TenantPrismaService, id: string) {
    await prisma.productCategory.delete({ where: { id } });
    return { ok: true };
  }

  // ------------------- Products -------------------

  async list(prisma: TenantPrismaService, type?: string, categoryId?: string, search?: string) {
    return prisma.product.findMany({
      where: {
        isActive: true,
        ...(type && { type: type as any }),
        ...(categoryId && { categoryId }),
        ...(search && { name: { contains: search, mode: 'insensitive' } }),
      },
      include: {
        category: { select: { id: true, name: true, color: true } },
        stockItems: { select: { quantity: true, locationId: true } },
        bom: { select: { id: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(prisma: TenantPrismaService, id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        stockItems: { include: { location: true } },
        bom: { include: { items: { include: { component: { select: { id: true, name: true, sku: true, unit: true } } } } } },
      },
    });
    if (!product) throw new NotFoundException('Produto não encontrado');
    return product;
  }

  async create(prisma: TenantPrismaService, dto: CreateProductDto) {
    const existing = await prisma.product.findUnique({ where: { sku: dto.sku } });
    if (existing) throw new ConflictException('SKU já cadastrado');
    return prisma.product.create({ data: { ...dto } });
  }

  async update(prisma: TenantPrismaService, id: string, dto: UpdateProductDto) {
    await this._findOrThrow(prisma, id);
    return prisma.product.update({ where: { id }, data: { ...dto } });
  }

  async remove(prisma: TenantPrismaService, id: string) {
    await this._findOrThrow(prisma, id);
    await prisma.product.update({ where: { id }, data: { isActive: false } });
    return { ok: true };
  }

  // ------------------- BOM -------------------

  async getBOM(prisma: TenantPrismaService, productId: string) {
    await this._findOrThrow(prisma, productId);
    return prisma.bOM.findUnique({
      where: { productId },
      include: { items: { include: { component: { select: { id: true, name: true, sku: true, unit: true, costPrice: true } } } } },
    });
  }

  async upsertBOM(prisma: TenantPrismaService, productId: string, dto: UpsertBOMDto) {
    const product = await this._findOrThrow(prisma, productId);
    if (product.type === 'RAW_MATERIAL') throw new BadRequestException('Matéria-prima não pode ter BOM');

    // Valida componentes
    for (const item of dto.items) {
      const comp = await prisma.product.findUnique({ where: { id: item.componentId } });
      if (!comp) throw new NotFoundException(`Componente ${item.componentId} não encontrado`);
      if (item.componentId === productId) throw new BadRequestException('Um produto não pode ser componente de si mesmo');
    }

    const existing = await prisma.bOM.findUnique({ where: { productId } });

    if (existing) {
      // Remove itens antigos e recria
      await prisma.bOMItem.deleteMany({ where: { bomId: existing.id } });
      return prisma.bOM.update({
        where: { productId },
        data: {
          yield: dto.yield ?? 1,
          notes: dto.notes,
          items: {
            create: dto.items.map((i) => ({
              componentId: i.componentId,
              quantity: i.quantity,
              unit: (i.unit as any) ?? 'UN',
              lossPercent: i.lossPercent ?? 0,
              notes: i.notes,
            })),
          },
        },
        include: { items: { include: { component: { select: { id: true, name: true, sku: true, unit: true } } } } },
      });
    } else {
      return prisma.bOM.create({
        data: {
          productId,
          yield: dto.yield ?? 1,
          notes: dto.notes,
          items: {
            create: dto.items.map((i) => ({
              componentId: i.componentId,
              quantity: i.quantity,
              unit: (i.unit as any) ?? 'UN',
              lossPercent: i.lossPercent ?? 0,
              notes: i.notes,
            })),
          },
        },
        include: { items: { include: { component: { select: { id: true, name: true, sku: true, unit: true } } } } },
      });
    }
  }

  private async _findOrThrow(prisma: TenantPrismaService, id: string) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Produto não encontrado');
    return product;
  }
}
