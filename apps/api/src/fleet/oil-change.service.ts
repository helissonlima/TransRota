import { Injectable, NotFoundException } from '@nestjs/common';
import { TenantPrismaService } from '../core/prisma/tenant-prisma.service';
import { CreateOilChangeDto } from './dto/create-oil-change.dto';
import { OilChangeStatus } from '@transrota/shared';

@Injectable()
export class OilChangeService {
  private calculateStatus(
    currentKm?: number,
    nextChangeKm?: number,
  ): OilChangeStatus {
    if (currentKm === undefined || nextChangeKm === undefined) {
      return OilChangeStatus.UP_TO_DATE;
    }
    const remaining = nextChangeKm - currentKm;
    if (remaining <= 0) return OilChangeStatus.OVERDUE;
    if (remaining <= 1000) return OilChangeStatus.DUE_SOON;
    return OilChangeStatus.UP_TO_DATE;
  }

  async create(
    prisma: TenantPrismaService,
    vehicleId: string,
    dto: CreateOilChangeDto,
  ) {
    // Fetch vehicle to get oilChangeIntervalKm if nextChangeKm not provided
    const vehicle = await (prisma as any).vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) throw new NotFoundException('Veículo não encontrado');

    let resolvedNextChangeKm = dto.nextChangeKm;
    if (resolvedNextChangeKm === undefined && dto.changeKm !== undefined && vehicle.oilChangeIntervalKm) {
      resolvedNextChangeKm = dto.changeKm + vehicle.oilChangeIntervalKm;
    }

    const resolvedCurrentKm = dto.currentKm ?? vehicle.currentKm;
    const status = this.calculateStatus(resolvedCurrentKm, resolvedNextChangeKm);

    return (prisma as any).oilChangeRecord.create({
      data: {
        vehicleId,
        changeDate: dto.changeDate ? new Date(dto.changeDate) : undefined,
        changeKm: dto.changeKm,
        currentKm: resolvedCurrentKm,
        nextChangeKm: resolvedNextChangeKm,
        status,
        kmDriven: dto.kmDriven,
        oilType: dto.oilType,
        responsibleName: dto.responsibleName,
        notes: dto.notes,
      },
    });
  }

  async findAll(prisma: TenantPrismaService, vehicleId: string) {
    const vehicle = await (prisma as any).vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) throw new NotFoundException('Veículo não encontrado');

    return (prisma as any).oilChangeRecord.findMany({
      where: { vehicleId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(prisma: TenantPrismaService, id: string) {
    const record = await (prisma as any).oilChangeRecord.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('Registro de troca de óleo não encontrado');
    return record;
  }

  async update(
    prisma: TenantPrismaService,
    id: string,
    dto: Partial<CreateOilChangeDto>,
  ) {
    await this.findOne(prisma, id);

    const existing = await (prisma as any).oilChangeRecord.findUnique({ where: { id } });
    const resolvedCurrentKm = dto.currentKm ?? existing.currentKm;
    const resolvedNextChangeKm = dto.nextChangeKm ?? existing.nextChangeKm;
    const status = dto.status ?? this.calculateStatus(resolvedCurrentKm, resolvedNextChangeKm);

    return (prisma as any).oilChangeRecord.update({
      where: { id },
      data: {
        ...(dto.changeDate ? { changeDate: new Date(dto.changeDate) } : {}),
        ...(dto.changeKm !== undefined ? { changeKm: dto.changeKm } : {}),
        ...(dto.currentKm !== undefined ? { currentKm: dto.currentKm } : {}),
        ...(dto.nextChangeKm !== undefined ? { nextChangeKm: dto.nextChangeKm } : {}),
        ...(dto.kmDriven !== undefined ? { kmDriven: dto.kmDriven } : {}),
        ...(dto.oilType ? { oilType: dto.oilType } : {}),
        ...(dto.responsibleName ? { responsibleName: dto.responsibleName } : {}),
        ...(dto.notes !== undefined ? { notes: dto.notes } : {}),
        status,
      },
    });
  }

  async remove(prisma: TenantPrismaService, id: string) {
    await this.findOne(prisma, id);
    await (prisma as any).oilChangeRecord.delete({ where: { id } });
  }
}
