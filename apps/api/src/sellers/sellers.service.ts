import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { TenantPrismaService } from '../core/prisma/tenant-prisma.service';
import { CreateSellerDto, UpdateSellerDto } from './dto/seller.dto';

@Injectable()
export class SellersService {
  async list(prisma: TenantPrismaService, includeInactive = false) {
    return prisma.seller.findMany({
      where: includeInactive ? {} : { isActive: true },
      include: { _count: { select: { saleOrders: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(prisma: TenantPrismaService, id: string) {
    const seller = await prisma.seller.findUnique({
      where: { id },
      include: {
        saleOrders: { take: 20, orderBy: { createdAt: 'desc' }, select: { id: true, number: true, clientName: true, total: true, status: true, createdAt: true } },
        _count: { select: { saleOrders: true } },
      },
    });
    if (!seller) throw new NotFoundException('Vendedor não encontrado');
    return seller;
  }

  async create(prisma: TenantPrismaService, dto: CreateSellerDto) {
    const existing = await prisma.seller.findUnique({ where: { name: dto.name } });
    if (existing) throw new ConflictException('Já existe um vendedor com este nome');
    return prisma.seller.create({ data: dto });
  }

  async update(prisma: TenantPrismaService, id: string, dto: UpdateSellerDto) {
    await this.findOne(prisma, id);
    return prisma.seller.update({ where: { id }, data: dto });
  }

  async dashboard(prisma: TenantPrismaService) {
    const sellers = await prisma.seller.findMany({
      where: { isActive: true },
      include: {
        saleOrders: {
          where: { status: { not: 'CANCELLED' } },
          select: { total: true, status: true },
        },
      },
    });
    return sellers.map(s => ({
      id: s.id,
      name: s.name,
      totalOrders: s.saleOrders.length,
      totalRevenue: s.saleOrders.reduce((sum, o) => sum + Number(o.total), 0),
      deliveredOrders: s.saleOrders.filter(o => o.status === 'DELIVERED').length,
    }));
  }
}
