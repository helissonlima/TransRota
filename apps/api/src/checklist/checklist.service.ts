import { Injectable, NotFoundException } from '@nestjs/common';
import { TenantPrismaService } from '../core/prisma/tenant-prisma.service';
import { CreateChecklistDto } from './dto/create-checklist.dto';
import { ExecuteChecklistDto } from './dto/execute-checklist.dto';

@Injectable()
export class ChecklistService {
  async create(prisma: TenantPrismaService, dto: CreateChecklistDto) {
    return prisma.checklist.create({
      data: {
        name: dto.name,
        type: dto.type as any,
        branchId: dto.branchId,
        items: {
          create: dto.items.map((item, index) => ({
            description: item.description,
            isRequired: item.isRequired ?? true,
            order: item.order ?? index + 1,
            allowPhoto: item.allowPhoto ?? false,
            allowNotes: item.allowNotes ?? true,
          })),
        },
      },
      include: { items: { orderBy: { order: 'asc' } } },
    });
  }

  async findAll(prisma: TenantPrismaService, type?: string) {
    return prisma.checklist.findMany({
      where: { isActive: true, ...(type ? { type: type as any } : {}) },
      include: { items: { orderBy: { order: 'asc' } } },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(prisma: TenantPrismaService, id: string) {
    const checklist = await prisma.checklist.findUnique({
      where: { id },
      include: { items: { orderBy: { order: 'asc' } } },
    });
    if (!checklist) throw new NotFoundException('Checklist não encontrado');
    return checklist;
  }

  async execute(prisma: TenantPrismaService, id: string, dto: ExecuteChecklistDto) {
    const checklist = await this.findOne(prisma, id);
    const hasIssues = dto.responses.some((r) => r.status === 'NOK');

    const execution = await prisma.checklistExecution.create({
      data: {
        checklistId: id,
        vehicleId: dto.vehicleId,
        driverId: dto.driverId,
        routeId: dto.routeId,
        hasIssues,
        ...(dto.inspectorId ? { inspectorId: dto.inspectorId } : {}),
        ...(dto.fuelLevel !== undefined ? { fuelLevel: dto.fuelLevel } : {}),
        ...(dto.externalDamage ? { externalDamage: dto.externalDamage } : {}),
        ...(dto.internalDamage ? { internalDamage: dto.internalDamage } : {}),
        ...(dto.unitLocation ? { unitLocation: dto.unitLocation } : {}),
        ...(dto.attachments ? { attachments: dto.attachments } : {}),
        ...(dto.resolutionStatus ? { resolutionStatus: dto.resolutionStatus as any } : {}),
        ...(dto.resolvedById ? { resolvedById: dto.resolvedById } : {}),
        responses: {
          create: dto.responses.map((r) => ({
            itemId: r.itemId,
            status: r.status as any,
            notes: r.notes,
            photoUrl: r.photoUrl,
          })),
        },
      },
      include: { responses: true },
    } as any);

    // Se houver itens NOK obrigatórios, coloca veículo em manutenção
    if (hasIssues) {
      const nokItems = dto.responses
        .filter((r) => r.status === 'NOK')
        .map((r) => r.itemId);

      const requiredNok = checklist.items.filter(
        (i) => i.isRequired && nokItems.includes(i.id),
      );

      if (requiredNok.length > 0) {
        await prisma.vehicle.update({
          where: { id: dto.vehicleId },
          data: { status: 'MAINTENANCE' },
        });
      }
    }

    return execution;
  }

  async getExecutions(prisma: TenantPrismaService, vehicleId?: string, driverId?: string) {
    return prisma.checklistExecution.findMany({
      where: {
        ...(vehicleId ? { vehicleId } : {}),
        ...(driverId ? { driverId } : {}),
      },
      include: {
        checklist: { select: { name: true, type: true } },
        vehicle: { select: { plate: true, model: true } },
        driver: { select: { name: true } },
      },
      orderBy: { executedAt: 'desc' },
      take: 50,
    });
  }
}
