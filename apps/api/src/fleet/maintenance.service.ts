import { Injectable, NotFoundException } from '@nestjs/common';
import { TenantPrismaService } from '../core/prisma/tenant-prisma.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';

@Injectable()
export class MaintenanceService {
  async create(prisma: TenantPrismaService, vehicleId: string, dto: CreateMaintenanceDto) {
    // Atualiza km atual do veículo se for maior
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) throw new NotFoundException('Veículo não encontrado');

    const record = await prisma.maintenanceRecord.create({
      data: { vehicleId, ...dto } as any,
    });

    // Atualiza km atual e próxima manutenção no veículo
    await prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        currentKm: Math.max(vehicle.currentKm, dto.km),
        ...(dto.nextDueKm ? { nextMaintenanceKm: dto.nextDueKm } : {}),
        ...(dto.nextDueDate ? { nextMaintenanceDate: dto.nextDueDate } : {}),
        status: 'ACTIVE',
      },
    });

    return record;
  }

  async findByVehicle(prisma: TenantPrismaService, vehicleId: string) {
    return prisma.maintenanceRecord.findMany({
      where: { vehicleId },
      orderBy: { performedAt: 'desc' },
    });
  }
}
