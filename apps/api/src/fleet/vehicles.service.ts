import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { TenantPrismaService } from '../core/prisma/tenant-prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  async create(prisma: TenantPrismaService, dto: CreateVehicleDto) {
    const existing = await prisma.vehicle.findUnique({ where: { plate: dto.plate } });
    if (existing) throw new ConflictException('Placa já cadastrada');

    return prisma.vehicle.create({ data: dto });
  }

  async findAll(
    prisma: TenantPrismaService,
    branchId?: string,
    status?: string,
  ) {
    return prisma.vehicle.findMany({
      where: {
        isActive: true,
        ...(branchId ? { branchId } : {}),
        ...(status ? { status: status as any } : {}),
      },
      include: {
        branch: { select: { name: true } },
        _count: { select: { routes: true, maintenanceRecords: true } },
      },
      orderBy: { plate: 'asc' },
    });
  }

  async findOne(prisma: TenantPrismaService, id: string) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: {
        branch: { select: { name: true } },
        maintenanceRecords: { orderBy: { performedAt: 'desc' }, take: 5 },
        fuelRecords: { orderBy: { performedAt: 'desc' }, take: 5 },
      },
    });
    if (!vehicle) throw new NotFoundException('Veículo não encontrado');
    return vehicle;
  }

  async update(prisma: TenantPrismaService, id: string, dto: UpdateVehicleDto) {
    await this.findOne(prisma, id);
    return prisma.vehicle.update({ where: { id }, data: dto });
  }

  async updateStatus(prisma: TenantPrismaService, id: string, status: string) {
    await this.findOne(prisma, id);
    return prisma.vehicle.update({ where: { id }, data: { status: status as any } });
  }

  async deactivate(prisma: TenantPrismaService, id: string) {
    await this.findOne(prisma, id);
    await prisma.vehicle.update({ where: { id }, data: { isActive: false } });
  }

  async getAlerts(prisma: TenantPrismaService) {
    const now = new Date();
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    return prisma.vehicle.findMany({
      where: {
        isActive: true,
        OR: [
          { nextMaintenanceDate: { lte: in30Days } },
        ],
      },
      select: {
        id: true,
        plate: true,
        model: true,
        brand: true,
        nextMaintenanceDate: true,
        nextMaintenanceKm: true,
        currentKm: true,
        status: true,
      },
    });
  }
}
