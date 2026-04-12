import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TenantPrismaService } from '../core/prisma/tenant-prisma.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';

@Injectable()
export class MaintenanceService {
  private isHeavyMachine(vehicle: { category: string | null; plate: string }) {
    return vehicle.category?.toUpperCase().startsWith('MAQUINA_PESADA') || vehicle.plate.startsWith('HMQ');
  }

  async create(prisma: TenantPrismaService, vehicleId: string, dto: CreateMaintenanceDto) {
    // Atualiza km atual do veículo se for maior
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) throw new NotFoundException('Veículo não encontrado');

    const heavyMachine = this.isHeavyMachine(vehicle as any);
    const meterReading = heavyMachine ? (dto.workedHours ?? dto.km) : dto.km;
    if (meterReading === undefined || meterReading === null) {
      throw new BadRequestException(
        heavyMachine
          ? 'Horas trabalhadas são obrigatórias para máquina pesada'
          : 'KM é obrigatório para manutenção',
      );
    }

    const nextDueMeter = heavyMachine ? (dto.nextDueHours ?? dto.nextDueKm) : dto.nextDueKm;
    const notesWithMode = heavyMachine
      ? [dto.notes, 'Controle por horas trabalhadas.'].filter(Boolean).join(' | ')
      : dto.notes;

    const record = await prisma.maintenanceRecord.create({
      data: {
        vehicleId,
        ...dto,
        km: meterReading,
        ...(nextDueMeter !== undefined ? { nextDueKm: nextDueMeter } : {}),
        ...(notesWithMode ? { notes: notesWithMode } : {}),
      } as any,
    });

    // Atualiza km atual e próxima manutenção no veículo
    await prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        currentKm: Math.max(vehicle.currentKm, meterReading),
        ...(nextDueMeter ? { nextMaintenanceKm: nextDueMeter } : {}),
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
