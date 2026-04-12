import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { TenantPrismaService } from '../core/prisma/tenant-prisma.service';
import { CreateCommissionDto, UpdateCommissionDto, UpdateCommissionStatusDto } from './dto/commission.dto';

@Injectable()
export class CommissionsService {
  private prismaModel(prisma: TenantPrismaService) {
    return (prisma as any).driverCommission;
  }

  private calculateNet(base: number, pct: number, bonus = 0, deductions = 0) {
    const amount = (base * pct) / 100;
    return { amount, netAmount: amount + bonus - deductions };
  }

  async create(prisma: TenantPrismaService, dto: CreateCommissionDto) {
    const existing = await this.prismaModel(prisma).findUnique({
      where: { driverId_period: { driverId: dto.driverId, period: dto.period } },
    });
    if (existing) throw new ConflictException('Já existe comissão para este motorista neste período');

    const driver = await (prisma as any).driver.findUnique({ where: { id: dto.driverId } });
    if (!driver) throw new NotFoundException('Motorista não encontrado');

    const bonus = dto.bonus ?? 0;
    const deductions = dto.deductions ?? 0;
    const { amount, netAmount } = this.calculateNet(dto.baseAmount, dto.percentage, bonus, deductions);

    return this.prismaModel(prisma).create({
      data: {
        driverId: dto.driverId,
        period: dto.period,
        routeCount: dto.routeCount,
        baseAmount: dto.baseAmount,
        percentage: dto.percentage,
        amount,
        bonus,
        deductions,
        netAmount,
        notes: dto.notes,
      },
      include: { driver: { select: { id: true, name: true, cpf: true } } },
    });
  }

  async findAll(
    prisma: TenantPrismaService,
    driverId?: string,
    period?: string,
    status?: string,
  ) {
    return this.prismaModel(prisma).findMany({
      where: {
        ...(driverId ? { driverId } : {}),
        ...(period ? { period } : {}),
        ...(status ? { status: status as any } : {}),
      },
      include: { driver: { select: { id: true, name: true, cpf: true } } },
      orderBy: [{ period: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(prisma: TenantPrismaService, id: string) {
    const record = await this.prismaModel(prisma).findUnique({
      where: { id },
      include: { driver: { select: { id: true, name: true, cpf: true } } },
    });
    if (!record) throw new NotFoundException('Comissão não encontrada');
    return record;
  }

  async update(prisma: TenantPrismaService, id: string, dto: UpdateCommissionDto) {
    const commission = await this.findOne(prisma, id);

    const baseAmount = dto.baseAmount ?? Number(commission.baseAmount);
    const percentage = dto.percentage ?? Number(commission.percentage);
    const bonus = dto.bonus !== undefined ? dto.bonus : Number(commission.bonus ?? 0);
    const deductions = dto.deductions !== undefined ? dto.deductions : Number(commission.deductions ?? 0);
    const { amount, netAmount } = this.calculateNet(baseAmount, percentage, bonus, deductions);

    return this.prismaModel(prisma).update({
      where: { id },
      data: {
        ...(dto.routeCount !== undefined ? { routeCount: dto.routeCount } : {}),
        baseAmount,
        percentage,
        amount,
        bonus,
        deductions,
        netAmount,
        ...(dto.notes !== undefined ? { notes: dto.notes } : {}),
      },
      include: { driver: { select: { id: true, name: true, cpf: true } } },
    });
  }

  async updateStatus(prisma: TenantPrismaService, id: string, dto: UpdateCommissionStatusDto) {
    await this.findOne(prisma, id);
    return this.prismaModel(prisma).update({
      where: { id },
      data: {
        status: dto.status as any,
        ...(dto.status === 'PAID' ? { paidAt: new Date() } : {}),
        ...(dto.notes !== undefined ? { notes: dto.notes } : {}),
      },
      include: { driver: { select: { id: true, name: true, cpf: true } } },
    });
  }

  async remove(prisma: TenantPrismaService, id: string) {
    await this.findOne(prisma, id);
    return this.prismaModel(prisma).delete({ where: { id } });
  }

  async getSummary(prisma: TenantPrismaService, period?: string) {
    const where = period ? { period } : {};
    const rows = await this.prismaModel(prisma).findMany({
      where,
      include: { driver: { select: { id: true, name: true } } },
    });

    const totalCommissions = rows.reduce((s: number, r: any) => s + Number(r.amount), 0);
    const totalNet = rows.reduce((s: number, r: any) => s + Number(r.netAmount), 0);
    const totalPaid = rows.filter((r: any) => r.status === 'PAID').reduce((s: number, r: any) => s + Number(r.netAmount), 0);
    const totalPending = rows.filter((r: any) => r.status === 'PENDING').reduce((s: number, r: any) => s + Number(r.netAmount), 0);

    return {
      count: rows.length,
      totalCommissions,
      totalNet,
      totalPaid,
      totalPending,
    };
  }

  async generateFromRoutes(prisma: TenantPrismaService, driverId: string, period: string, percentage: number) {
    const [year, month] = period.split('-').map(Number);
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    const routes = await (prisma as any).route.findMany({
      where: {
        driverId,
        status: 'COMPLETED',
        completedAt: { gte: start, lte: end },
      },
    });

    const routeCount = routes.length;
    const baseAmount = routeCount * 100; // R$100 por rota como base padrão

    return this.create(prisma, {
      driverId,
      period,
      routeCount,
      baseAmount,
      percentage,
    });
  }
}
