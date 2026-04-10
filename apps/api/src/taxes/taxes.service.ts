import { Injectable, NotFoundException } from '@nestjs/common';
import { TenantPrismaService } from '../core/prisma/tenant-prisma.service';
import { CreateVehicleTaxDto } from './dto/create-vehicle-tax.dto';
import { PaymentStatus } from '@transrota/shared';

@Injectable()
export class TaxesService {
  async create(prisma: TenantPrismaService, dto: CreateVehicleTaxDto) {
    return (prisma as any).vehicleTax.create({
      data: {
        vehicleId: dto.vehicleId,
        type: dto.type,
        year: dto.year,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        value: dto.value,
        paymentStatus: dto.paymentStatus ?? PaymentStatus.PENDING,
        paidAt: dto.paidAt ? new Date(dto.paidAt) : undefined,
        paidValue: dto.paidValue,
        notes: dto.notes,
      },
    });
  }

  async findAll(
    prisma: TenantPrismaService,
    vehicleId?: string,
    paymentStatus?: string,
    type?: string,
  ) {
    return (prisma as any).vehicleTax.findMany({
      where: {
        ...(vehicleId ? { vehicleId } : {}),
        ...(paymentStatus ? { paymentStatus: paymentStatus as any } : {}),
        ...(type ? { type: type as any } : {}),
      },
      include: {
        vehicle: { select: { plate: true, model: true, brand: true } },
      },
      orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(prisma: TenantPrismaService, id: string) {
    const tax = await (prisma as any).vehicleTax.findUnique({
      where: { id },
      include: {
        vehicle: { select: { plate: true, model: true, brand: true } },
      },
    });
    if (!tax) throw new NotFoundException('Tributo/taxa não encontrado');
    return tax;
  }

  async update(
    prisma: TenantPrismaService,
    id: string,
    dto: Partial<CreateVehicleTaxDto>,
  ) {
    await this.findOne(prisma, id);
    return (prisma as any).vehicleTax.update({
      where: { id },
      data: {
        ...(dto.vehicleId ? { vehicleId: dto.vehicleId } : {}),
        ...(dto.type ? { type: dto.type } : {}),
        ...(dto.year !== undefined ? { year: dto.year } : {}),
        ...(dto.dueDate ? { dueDate: new Date(dto.dueDate) } : {}),
        ...(dto.value !== undefined ? { value: dto.value } : {}),
        ...(dto.paymentStatus ? { paymentStatus: dto.paymentStatus } : {}),
        ...(dto.paidAt ? { paidAt: new Date(dto.paidAt) } : {}),
        ...(dto.paidValue !== undefined ? { paidValue: dto.paidValue } : {}),
        ...(dto.notes !== undefined ? { notes: dto.notes } : {}),
      },
    });
  }

  async pay(
    prisma: TenantPrismaService,
    id: string,
    paidValue?: number,
    paidAt?: string,
  ) {
    await this.findOne(prisma, id);
    return (prisma as any).vehicleTax.update({
      where: { id },
      data: {
        paymentStatus: PaymentStatus.PAID,
        paidAt: paidAt ? new Date(paidAt) : new Date(),
        ...(paidValue !== undefined ? { paidValue } : {}),
      },
    });
  }

  async getOverdue(prisma: TenantPrismaService) {
    const today = new Date();
    return (prisma as any).vehicleTax.findMany({
      where: {
        OR: [
          { paymentStatus: PaymentStatus.OVERDUE },
          {
            paymentStatus: PaymentStatus.PENDING,
            dueDate: { lt: today },
          },
        ],
      },
      include: {
        vehicle: { select: { plate: true, model: true, brand: true } },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async remove(prisma: TenantPrismaService, id: string) {
    await this.findOne(prisma, id);
    await (prisma as any).vehicleTax.delete({ where: { id } });
  }
}
