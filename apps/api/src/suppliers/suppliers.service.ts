import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { TenantPrismaService } from '../core/prisma/tenant-prisma.service';
import { CreateSupplierDto, UpdateSupplierDto, LinkSupplierProductDto } from './dto/supplier.dto';

@Injectable()
export class SuppliersService {
  async list(prisma: TenantPrismaService, includeInactive = false) {
    return prisma.supplier.findMany({
      where: includeInactive ? {} : { isActive: true },
      include: {
        products: { include: { product: { select: { id: true, name: true, sku: true, unit: true } } } },
        _count: { select: { purchaseOrders: true, saleOrders: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(prisma: TenantPrismaService, id: string) {
    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: {
        products: { include: { product: { select: { id: true, name: true, sku: true, unit: true, salePrice: true } } } },
        purchaseOrders: { take: 10, orderBy: { createdAt: 'desc' }, include: { items: { include: { product: true } } } },
        saleOrders: { take: 10, orderBy: { createdAt: 'desc' } },
      },
    });
    if (!supplier) throw new NotFoundException('Fornecedor não encontrado');
    return supplier;
  }

  async create(prisma: TenantPrismaService, dto: CreateSupplierDto) {
    const existing = await prisma.supplier.findUnique({ where: { name: dto.name } });
    if (existing) throw new ConflictException('Já existe um fornecedor com este nome');
    return prisma.supplier.create({ data: dto });
  }

  async update(prisma: TenantPrismaService, id: string, dto: UpdateSupplierDto) {
    await this.findOne(prisma, id);
    return prisma.supplier.update({ where: { id }, data: dto });
  }

  async linkProduct(prisma: TenantPrismaService, supplierId: string, dto: LinkSupplierProductDto) {
    await this.findOne(prisma, supplierId);
    return prisma.supplierProduct.upsert({
      where: { supplierId_productId: { supplierId, productId: dto.productId } },
      create: { supplierId, productId: dto.productId, supplierSku: dto.supplierSku, lastPrice: dto.unitPrice, notes: dto.notes },
      update: { supplierSku: dto.supplierSku, lastPrice: dto.unitPrice, notes: dto.notes },
    });
  }

  async unlinkProduct(prisma: TenantPrismaService, supplierId: string, productId: string) {
    return prisma.supplierProduct.delete({
      where: { supplierId_productId: { supplierId, productId } },
    });
  }

  async getSupplierProducts(prisma: TenantPrismaService, supplierId: string) {
    return prisma.supplierProduct.findMany({
      where: { supplierId },
      include: { product: { select: { id: true, name: true, sku: true, unit: true, salePrice: true, costPrice: true } } },
    });
  }
}
