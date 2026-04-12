import { Injectable, NotFoundException } from '@nestjs/common';
import { TenantPrismaService } from '../core/prisma/tenant-prisma.service';
import { CreateFuelRecordDto } from './dto/create-fuel-record.dto';

@Injectable()
export class FuelService {
  async create(prisma: TenantPrismaService, vehicleId: string, dto: CreateFuelRecordDto) {
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) throw new NotFoundException('Veículo não encontrado');

    const totalCost = Number(dto.liters) * Number(dto.pricePerLiter);
    const record = await prisma.fuelRecord.create({
      data: {
        vehicleId,
        driverId: dto.driverId,
        liters: dto.liters,
        pricePerLiter: dto.pricePerLiter,
        totalCost,
        km: dto.km,
        fuelType: dto.fuelType as any,
        isFullTank: dto.isFullTank ?? true,
        station: dto.station,
        performedAt: new Date(dto.performedAt),
      },
    });

    // Atualiza km atual do veículo
    if (dto.km > vehicle.currentKm) {
      await prisma.vehicle.update({
        where: { id: vehicleId },
        data: { currentKm: dto.km },
      });
    }

    return record;
  }

  async findByVehicle(prisma: TenantPrismaService, vehicleId: string) {
    return prisma.fuelRecord.findMany({
      where: { vehicleId },
      include: { driver: { select: { name: true } } },
      orderBy: { performedAt: 'desc' },
    });
  }

  async findAll(
    prisma: TenantPrismaService,
    vehicleId?: string,
    dateFrom?: string,
    dateTo?: string,
  ) {
    return prisma.fuelRecord.findMany({
      where: {
        ...(vehicleId ? { vehicleId } : {}),
        ...(dateFrom || dateTo ? {
          performedAt: {
            ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
            ...(dateTo   ? { lte: new Date(dateTo)   } : {}),
          },
        } : {}),
      },
      include: {
        vehicle: { select: { plate: true, model: true, brand: true } },
        driver:  { select: { name: true } },
      },
      orderBy: { performedAt: 'desc' },
    });
  }

  async getCostSummary(prisma: TenantPrismaService, branchId?: string) {
    const records = await prisma.fuelRecord.findMany({
      where: branchId
        ? { vehicle: { branchId } }
        : {},
      select: { totalCost: true, liters: true, fuelType: true, performedAt: true },
    });

    const total = records.reduce((acc, r) => acc + Number(r.totalCost), 0);
    const totalLiters = records.reduce((acc, r) => acc + Number(r.liters), 0);

    return { total, totalLiters, count: records.length, averageCostPerLiter: total / totalLiters || 0 };
  }
}
