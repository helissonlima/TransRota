import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TenantPrismaService } from '../core/prisma/tenant-prisma.service';
import { CreateDailyKmDto } from './dto/create-daily-km.dto';
import { DailyKmStatus } from '@transrota/shared';

@Injectable()
export class DailyKmService {
  private validateKm(dto: Pick<CreateDailyKmDto, 'initialKm' | 'finalKm' | 'personalInitialKm' | 'personalFinalKm'>) {
    if (dto.finalKm < dto.initialKm) {
      throw new BadRequestException('KM final deve ser maior ou igual ao KM inicial');
    }

    if (
      dto.personalInitialKm !== undefined &&
      dto.personalFinalKm !== undefined &&
      dto.personalFinalKm < dto.personalInitialKm
    ) {
      throw new BadRequestException('KM pessoal final deve ser maior ou igual ao KM pessoal inicial');
    }
  }

  private computeKm(dto: CreateDailyKmDto): {
    personalKm: number;
    workKm: number;
    totalKm: number;
  } {
    const totalKm = Math.max(0, dto.finalKm - dto.initialKm);

    let personalKm = 0;
    if (
      dto.personalInitialKm !== undefined &&
      dto.personalFinalKm !== undefined
    ) {
      personalKm = Math.max(0, dto.personalFinalKm - dto.personalInitialKm);
    }

    const workKm = Math.max(0, totalKm - personalKm);

    return { personalKm, workKm, totalKm };
  }

  async create(prisma: TenantPrismaService, dto: CreateDailyKmDto) {
    this.validateKm(dto);
    const { personalKm, workKm, totalKm } = this.computeKm(dto);

    return (prisma as any).dailyKmLog.create({
      data: {
        vehicleId: dto.vehicleId,
        driverId: dto.driverId,
        date: new Date(dto.date),
        dayOfWeek: dto.dayOfWeek,
        initialKm: dto.initialKm,
        finalKm: dto.finalKm,
        personalInitialKm: dto.personalInitialKm,
        personalFinalKm: dto.personalFinalKm,
        personalKm,
        workKm,
        totalKm,
        status: dto.status ?? DailyKmStatus.OK,
        notes: dto.notes,
      },
    });
  }

  async findAll(
    prisma: TenantPrismaService,
    vehicleId?: string,
    driverId?: string,
    dateFrom?: string,
    dateTo?: string,
  ) {
    return (prisma as any).dailyKmLog.findMany({
      where: {
        ...(vehicleId ? { vehicleId } : {}),
        ...(driverId ? { driverId } : {}),
        ...(dateFrom || dateTo
          ? {
              date: {
                ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
                ...(dateTo ? { lte: new Date(dateTo) } : {}),
              },
            }
          : {}),
      },
      include: {
        vehicle: { select: { plate: true, model: true } },
        driver: { select: { name: true } },
      },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(prisma: TenantPrismaService, id: string) {
    const record = await (prisma as any).dailyKmLog.findUnique({
      where: { id },
      include: {
        vehicle: { select: { plate: true, model: true } },
        driver: { select: { name: true } },
      },
    });
    if (!record) throw new NotFoundException('Registro de KM diário não encontrado');
    return record;
  }

  async update(
    prisma: TenantPrismaService,
    id: string,
    dto: Partial<CreateDailyKmDto>,
  ) {
    const existing = await this.findOne(prisma, id);

    const merged = {
      vehicleId: dto.vehicleId ?? existing.vehicleId,
      driverId: dto.driverId ?? existing.driverId,
      date: dto.date ? dto.date : existing.date.toISOString().substring(0, 10),
      initialKm: dto.initialKm ?? existing.initialKm,
      finalKm: dto.finalKm ?? existing.finalKm,
      personalInitialKm: dto.personalInitialKm ?? existing.personalInitialKm,
      personalFinalKm: dto.personalFinalKm ?? existing.personalFinalKm,
    } as CreateDailyKmDto;

    this.validateKm(merged);

    const { personalKm, workKm, totalKm } = this.computeKm(merged);

    return (prisma as any).dailyKmLog.update({
      where: { id },
      data: {
        ...(dto.vehicleId ? { vehicleId: dto.vehicleId } : {}),
        ...(dto.driverId ? { driverId: dto.driverId } : {}),
        ...(dto.date ? { date: new Date(dto.date) } : {}),
        ...(dto.dayOfWeek !== undefined ? { dayOfWeek: dto.dayOfWeek } : {}),
        ...(dto.initialKm !== undefined ? { initialKm: dto.initialKm } : {}),
        ...(dto.finalKm !== undefined ? { finalKm: dto.finalKm } : {}),
        ...(dto.personalInitialKm !== undefined ? { personalInitialKm: dto.personalInitialKm } : {}),
        ...(dto.personalFinalKm !== undefined ? { personalFinalKm: dto.personalFinalKm } : {}),
        personalKm,
        workKm,
        totalKm,
        ...(dto.status ? { status: dto.status } : {}),
        ...(dto.notes !== undefined ? { notes: dto.notes } : {}),
      },
    });
  }

  async remove(prisma: TenantPrismaService, id: string) {
    await this.findOne(prisma, id);
    await (prisma as any).dailyKmLog.delete({ where: { id } });
  }

  async getMonthlySummary(
    prisma: TenantPrismaService,
    year: number,
    month: number,
    driverId?: string,
  ) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const records = await (prisma as any).dailyKmLog.findMany({
      where: {
        date: { gte: start, lt: end },
        ...(driverId ? { driverId } : {}),
      },
      include: {
        driver: { select: { id: true, name: true } },
        vehicle: { select: { plate: true, model: true } },
      },
    });

    // Group by driver
    const grouped: Record<
      string,
      {
        driver: { id: string; name: string };
        month: string;
        totalKm: number;
        workKm: number;
        personalKm: number;
        daysCount: number;
      }
    > = {};

    for (const r of records) {
      const key = r.driverId;
      if (!grouped[key]) {
        grouped[key] = {
          driver: { id: r.driverId, name: r.driver?.name ?? '' },
          month: `${year}-${String(month).padStart(2, '0')}`,
          totalKm: 0,
          workKm: 0,
          personalKm: 0,
          daysCount: 0,
        };
      }
      grouped[key].totalKm += r.totalKm ?? 0;
      grouped[key].workKm += r.workKm ?? 0;
      grouped[key].personalKm += r.personalKm ?? 0;
      grouped[key].daysCount += 1;
    }

    return Object.values(grouped);
  }

  async getMonthlySummaryByVehicle(
    prisma: TenantPrismaService,
    year: number,
    month: number,
    vehicleId?: string,
  ) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const records = await (prisma as any).dailyKmLog.findMany({
      where: {
        date: { gte: start, lt: end },
        ...(vehicleId ? { vehicleId } : {}),
      },
      include: {
        vehicle: { select: { id: true, plate: true, model: true, brand: true } },
      },
    });

    const grouped: Record<
      string,
      {
        vehicle: { id: string; plate: string; model: string; brand: string };
        month: string;
        totalKm: number;
        workKm: number;
        personalKm: number;
        daysCount: number;
      }
    > = {};

    for (const r of records) {
      const key = r.vehicleId;
      if (!grouped[key]) {
        grouped[key] = {
          vehicle: {
            id: r.vehicleId,
            plate: r.vehicle?.plate ?? '',
            model: r.vehicle?.model ?? '',
            brand: r.vehicle?.brand ?? '',
          },
          month: `${year}-${String(month).padStart(2, '0')}`,
          totalKm: 0,
          workKm: 0,
          personalKm: 0,
          daysCount: 0,
        };
      }
      grouped[key].totalKm += r.totalKm ?? 0;
      grouped[key].workKm += r.workKm ?? 0;
      grouped[key].personalKm += r.personalKm ?? 0;
      grouped[key].daysCount += 1;
    }

    return Object.values(grouped);
  }
}
