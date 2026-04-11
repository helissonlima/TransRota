import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TenantPrismaService } from '../core/prisma/tenant-prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingStatus } from '@transrota/shared';

@Injectable()
export class BookingsService {
  private async checkConflict(
    prisma: TenantPrismaService,
    vehicleId: string,
    date: string,
    timeSlot: string,
    excludeId?: string,
  ) {
    const conflict = await (prisma as any).vehicleBooking.findFirst({
      where: {
        vehicleId,
        date: new Date(date),
        timeSlot,
        status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
    });
    if (conflict) {
      throw new ConflictException(
        'Já existe uma reserva para este veículo neste horário',
      );
    }
  }

  async create(prisma: TenantPrismaService, dto: CreateBookingDto) {
    await this.checkConflict(prisma, dto.vehicleId, dto.date, dto.timeSlot);

    return (prisma as any).vehicleBooking.create({
      data: {
        vehicleId: dto.vehicleId,
        userId: dto.userId,
        branchId: dto.branchId,
        date: new Date(dto.date),
        timeSlot: dto.timeSlot,
        purpose: dto.purpose,
        status: dto.status ?? BookingStatus.PENDING,
        notes: dto.notes,
      },
    });
  }

  async findAll(
    prisma: TenantPrismaService,
    vehicleId?: string,
    userId?: string,
    status?: string,
    dateFrom?: string,
    dateTo?: string,
  ) {
    return (prisma as any).vehicleBooking.findMany({
      where: {
        ...(vehicleId ? { vehicleId } : {}),
        ...(userId ? { userId } : {}),
        ...(status ? { status: status as any } : {}),
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
        vehicle: { select: { plate: true, model: true, brand: true } },
        user: { select: { id: true, name: true } },
      },
      orderBy: [{ date: 'asc' }, { timeSlot: 'asc' }],
    });
  }

  async findOne(prisma: TenantPrismaService, id: string) {
    const booking = await (prisma as any).vehicleBooking.findUnique({
      where: { id },
      include: {
        vehicle: { select: { plate: true, model: true, brand: true } },
        user: { select: { id: true, name: true } },
      },
    });
    if (!booking) throw new NotFoundException('Reserva não encontrada');
    return booking;
  }

  async update(
    prisma: TenantPrismaService,
    id: string,
    dto: Partial<CreateBookingDto>,
  ) {
    const existing = await this.findOne(prisma, id);

    if (dto.vehicleId || dto.date || dto.timeSlot) {
      await this.checkConflict(
        prisma,
        dto.vehicleId ?? existing.vehicleId,
        dto.date ?? existing.date.toISOString().substring(0, 10),
        dto.timeSlot ?? existing.timeSlot,
        id,
      );
    }

    return (prisma as any).vehicleBooking.update({
      where: { id },
      data: {
        ...(dto.vehicleId ? { vehicleId: dto.vehicleId } : {}),
        ...(dto.userId ? { userId: dto.userId } : {}),
        ...(dto.branchId !== undefined ? { branchId: dto.branchId } : {}),
        ...(dto.date ? { date: new Date(dto.date) } : {}),
        ...(dto.timeSlot ? { timeSlot: dto.timeSlot } : {}),
        ...(dto.purpose !== undefined ? { purpose: dto.purpose } : {}),
        ...(dto.status ? { status: dto.status } : {}),
        ...(dto.notes !== undefined ? { notes: dto.notes } : {}),
      },
    });
  }

  async confirm(prisma: TenantPrismaService, id: string, confirmedBy: string) {
    await this.findOne(prisma, id);
    return (prisma as any).vehicleBooking.update({
      where: { id },
      data: {
        status: BookingStatus.CONFIRMED,
        confirmedBy,
        confirmedAt: new Date(),
      },
    });
  }

  async cancel(prisma: TenantPrismaService, id: string) {
    await this.findOne(prisma, id);
    return (prisma as any).vehicleBooking.update({
      where: { id },
      data: { status: BookingStatus.CANCELLED },
    });
  }

  async remove(prisma: TenantPrismaService, id: string) {
    await this.findOne(prisma, id);
    await (prisma as any).vehicleBooking.delete({ where: { id } });
  }
}
