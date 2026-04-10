import { Injectable, NotFoundException } from '@nestjs/common';
import { TenantPrismaService } from '../core/prisma/tenant-prisma.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { CreateUsageLogDto } from './dto/create-usage-log.dto';

@Injectable()
export class EquipmentService {
  // --- Equipment CRUD ---

  async create(prisma: TenantPrismaService, dto: CreateEquipmentDto) {
    return (prisma as any).equipment.create({
      data: {
        tag: dto.tag,
        name: dto.name,
        type: dto.type,
        identifier: dto.identifier,
        isActive: dto.isActive ?? true,
        branchId: dto.branchId,
      },
    });
  }

  async findAll(
    prisma: TenantPrismaService,
    type?: string,
    branchId?: string,
    isActive?: boolean,
  ) {
    return (prisma as any).equipment.findMany({
      where: {
        ...(type ? { type } : {}),
        ...(branchId ? { branchId } : {}),
        ...(isActive !== undefined ? { isActive } : {}),
      },
      include: {
        _count: { select: { usageLogs: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(prisma: TenantPrismaService, id: string) {
    const equipment = await (prisma as any).equipment.findUnique({
      where: { id },
      include: {
        usageLogs: { orderBy: { date: 'desc' }, take: 10 },
      },
    });
    if (!equipment) throw new NotFoundException('Equipamento não encontrado');
    return equipment;
  }

  async update(
    prisma: TenantPrismaService,
    id: string,
    dto: Partial<CreateEquipmentDto>,
  ) {
    await this.findOne(prisma, id);
    return (prisma as any).equipment.update({
      where: { id },
      data: {
        ...(dto.tag !== undefined ? { tag: dto.tag } : {}),
        ...(dto.name ? { name: dto.name } : {}),
        ...(dto.type ? { type: dto.type } : {}),
        ...(dto.identifier !== undefined ? { identifier: dto.identifier } : {}),
        ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
        ...(dto.branchId !== undefined ? { branchId: dto.branchId } : {}),
      },
    });
  }

  async deactivate(prisma: TenantPrismaService, id: string) {
    await this.findOne(prisma, id);
    await (prisma as any).equipment.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // --- Usage Logs ---

  async createUsageLog(
    prisma: TenantPrismaService,
    equipmentId: string,
    dto: CreateUsageLogDto,
  ) {
    await this.findOne(prisma, equipmentId);

    const totalKm =
      dto.totalKm ??
      (dto.initialKm !== undefined && dto.finalKm !== undefined
        ? Math.max(0, dto.finalKm - dto.initialKm)
        : undefined);

    return (prisma as any).equipmentUsageLog.create({
      data: {
        equipmentId,
        date: new Date(dto.date),
        initialKm: dto.initialKm,
        finalKm: dto.finalKm,
        totalKm,
        totalCost: dto.totalCost,
        notes: dto.notes,
      },
    });
  }

  async findUsageLogs(
    prisma: TenantPrismaService,
    equipmentId: string,
    dateFrom?: string,
    dateTo?: string,
  ) {
    await this.findOne(prisma, equipmentId);

    return (prisma as any).equipmentUsageLog.findMany({
      where: {
        equipmentId,
        ...(dateFrom || dateTo
          ? {
              date: {
                ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
                ...(dateTo ? { lte: new Date(dateTo) } : {}),
              },
            }
          : {}),
      },
      orderBy: { date: 'desc' },
    });
  }

  async removeUsageLog(prisma: TenantPrismaService, logId: string) {
    const log = await (prisma as any).equipmentUsageLog.findUnique({
      where: { id: logId },
    });
    if (!log) throw new NotFoundException('Registro de uso não encontrado');
    await (prisma as any).equipmentUsageLog.delete({ where: { id: logId } });
  }
}
