import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { TenantPrismaService } from '../core/prisma/tenant-prisma.service';
import {
  CreateFinancialEntryDto,
  UpdateFinancialEntryDto,
  CreateCostCenterDto,
  FinancialType,
  FinancialStatus,
} from './dto/financial.dto';

@Injectable()
export class FinancialService {
  private entry(prisma: TenantPrismaService) { return (prisma as any).financialEntry; }
  private cc(prisma: TenantPrismaService) { return (prisma as any).costCenter; }

  // ── Lançamentos ────────────────────────────────────────────────────────────

  async createEntry(prisma: TenantPrismaService, dto: CreateFinancialEntryDto) {
    return this.entry(prisma).create({
      data: {
        type: dto.type,
        category: dto.category,
        description: dto.description,
        amount: dto.amount,
        dueDate: new Date(dto.dueDate),
        paymentDate: dto.paymentDate ? new Date(dto.paymentDate) : undefined,
        status: dto.paymentDate
          ? (dto.type === FinancialType.PAYABLE ? FinancialStatus.PAID : FinancialStatus.RECEIVED)
          : FinancialStatus.PENDING,
        paymentMethod: dto.paymentMethod ?? undefined,
        documentNumber: dto.documentNumber,
        costCenterId: dto.costCenterId,
        vehicleId: dto.vehicleId,
        driverId: dto.driverId,
        notes: dto.notes,
      },
      include: {
        costCenter: { select: { id: true, name: true, code: true } },
        vehicle: { select: { id: true, plate: true, model: true } },
        driver: { select: { id: true, name: true } },
      },
    });
  }

  async findEntries(
    prisma: TenantPrismaService,
    type?: string,
    status?: string,
    category?: string,
    startDate?: string,
    endDate?: string,
  ) {
    return this.entry(prisma).findMany({
      where: {
        ...(type ? { type: type as any } : {}),
        ...(status ? { status: status as any } : {}),
        ...(category ? { category: category as any } : {}),
        ...(startDate || endDate
          ? {
              dueDate: {
                ...(startDate ? { gte: new Date(startDate) } : {}),
                ...(endDate ? { lte: new Date(endDate) } : {}),
              },
            }
          : {}),
      },
      include: {
        costCenter: { select: { id: true, name: true, code: true } },
        vehicle: { select: { id: true, plate: true, model: true } },
        driver: { select: { id: true, name: true } },
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async findOneEntry(prisma: TenantPrismaService, id: string) {
    const entry = await this.entry(prisma).findUnique({
      where: { id },
      include: {
        costCenter: { select: { id: true, name: true, code: true } },
        vehicle: { select: { id: true, plate: true, model: true } },
        driver: { select: { id: true, name: true } },
      },
    });
    if (!entry) throw new NotFoundException('Lançamento não encontrado');
    return entry;
  }

  async updateEntry(prisma: TenantPrismaService, id: string, dto: UpdateFinancialEntryDto) {
    await this.findOneEntry(prisma, id);
    return this.entry(prisma).update({
      where: { id },
      data: {
        ...(dto.category ? { category: dto.category } : {}),
        ...(dto.description ? { description: dto.description } : {}),
        ...(dto.amount !== undefined ? { amount: dto.amount } : {}),
        ...(dto.dueDate ? { dueDate: new Date(dto.dueDate) } : {}),
        ...(dto.paymentDate ? { paymentDate: new Date(dto.paymentDate) } : {}),
        ...(dto.status ? { status: dto.status } : {}),
        ...(dto.paymentMethod ? { paymentMethod: dto.paymentMethod } : {}),
        ...(dto.documentNumber !== undefined ? { documentNumber: dto.documentNumber } : {}),
        ...(dto.costCenterId !== undefined ? { costCenterId: dto.costCenterId } : {}),
        ...(dto.vehicleId !== undefined ? { vehicleId: dto.vehicleId } : {}),
        ...(dto.driverId !== undefined ? { driverId: dto.driverId } : {}),
        ...(dto.notes !== undefined ? { notes: dto.notes } : {}),
      },
      include: {
        costCenter: { select: { id: true, name: true, code: true } },
        vehicle: { select: { id: true, plate: true, model: true } },
        driver: { select: { id: true, name: true } },
      },
    });
  }

  async deleteEntry(prisma: TenantPrismaService, id: string) {
    await this.findOneEntry(prisma, id);
    return this.entry(prisma).delete({ where: { id } });
  }

  // ── Centros de Custo ───────────────────────────────────────────────────────

  async createCostCenter(prisma: TenantPrismaService, dto: CreateCostCenterDto) {
    const existing = await this.cc(prisma).findUnique({ where: { code: dto.code } });
    if (existing) throw new ConflictException('Já existe um centro de custo com este código');

    return this.cc(prisma).create({ data: dto });
  }

  async findCostCenters(prisma: TenantPrismaService) {
    return this.cc(prisma).findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
  }

  async updateCostCenter(prisma: TenantPrismaService, id: string, dto: Partial<CreateCostCenterDto & { isActive: boolean }>) {
    const cc = await this.cc(prisma).findUnique({ where: { id } });
    if (!cc) throw new NotFoundException('Centro de custo não encontrado');
    return this.cc(prisma).update({ where: { id }, data: dto });
  }

  async deleteCostCenter(prisma: TenantPrismaService, id: string) {
    const cc = await this.cc(prisma).findUnique({ where: { id } });
    if (!cc) throw new NotFoundException('Centro de custo não encontrado');
    return this.cc(prisma).update({ where: { id }, data: { isActive: false } });
  }

  // ── Dashboard / Resumo ─────────────────────────────────────────────────────

  async getDashboard(prisma: TenantPrismaService, month?: string) {
    try {
      const today = new Date();
    const year = month ? parseInt(month.split('-')[0]) : today.getFullYear();
    const monthNum = month ? parseInt(month.split('-')[1]) : today.getMonth() + 1;
    const start = new Date(year, monthNum - 1, 1);
    const end = new Date(year, monthNum, 0, 23, 59, 59);

    const entries = await this.entry(prisma).findMany({
      where: { dueDate: { gte: start, lte: end } },
    });

    const payables = entries.filter((e: any) => e.type === 'PAYABLE');
    const receivables = entries.filter((e: any) => e.type === 'RECEIVABLE');
    const overdue = entries.filter((e: any) =>
      e.status === 'PENDING' && new Date(e.dueDate) < today,
    );

    const totalPayables = payables.reduce((s: number, e: any) => s + Number(e.amount), 0);
    const totalReceivables = receivables.reduce((s: number, e: any) => s + Number(e.amount), 0);
    const paidPayables = payables
      .filter((e: any) => e.status === 'PAID')
      .reduce((s: number, e: any) => s + Number(e.amount), 0);
    const receivedReceivables = receivables
      .filter((e: any) => e.status === 'RECEIVED')
      .reduce((s: number, e: any) => s + Number(e.amount), 0);

    const balance = receivedReceivables - paidPayables;

    // Fluxo de caixa diário nos últimos 12 meses para gráfico
    const last12Start = new Date(today.getFullYear(), today.getMonth() - 11, 1);
    const allEntries = await this.entry(prisma).findMany({
      where: { dueDate: { gte: last12Start } },
    });

    const monthlyFlow: Record<string, { month: string; receitas: number; despesas: number }> = {};
    allEntries.forEach((e: any) => {
      const d = new Date(e.dueDate);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyFlow[key]) monthlyFlow[key] = { month: key, receitas: 0, despesas: 0 };
      if (e.type === 'RECEIVABLE') monthlyFlow[key].receitas += Number(e.amount);
      else monthlyFlow[key].despesas += Number(e.amount);
    });

    const cashFlow = Object.values(monthlyFlow).sort((a, b) => a.month.localeCompare(b.month));

    // Despesas por categoria
    const expenseByCategory: Record<string, number> = {};
    payables.forEach((e: any) => {
      expenseByCategory[e.category] = (expenseByCategory[e.category] ?? 0) + Number(e.amount);
    });

      return {
        summary: {
          totalPayables,
          totalReceivables,
          paidPayables,
          receivedReceivables,
          pendingPayables: totalPayables - paidPayables,
          pendingReceivables: totalReceivables - receivedReceivables,
          balance,
          overdueCount: overdue.length,
          overdueValue: overdue.reduce((s: number, e: any) => s + Number(e.amount), 0),
        },
        cashFlow,
        expenseByCategory: Object.entries(expenseByCategory).map(([category, value]) => ({ category, value })),
      };
    } catch {
      return {
        summary: {
          totalPayables: 0,
          totalReceivables: 0,
          paidPayables: 0,
          receivedReceivables: 0,
          pendingPayables: 0,
          pendingReceivables: 0,
          balance: 0,
          overdueCount: 0,
          overdueValue: 0,
        },
        cashFlow: [],
        expenseByCategory: [],
      };
    }
  }
}
