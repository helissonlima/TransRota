import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TenantPrismaService } from '../core/prisma/tenant-prisma.service';
import { CreateChecklistDto } from './dto/create-checklist.dto';
import { ExecuteChecklistDto } from './dto/execute-checklist.dto';
import { ResolveStatus } from './dto/resolve-execution.dto';

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
      include: {
        items: { orderBy: { order: 'asc' } },
        _count: { select: { executions: true } },
      },
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
    return prisma.$transaction(async (tx) => {
      const checklist = await tx.checklist.findUnique({
        where: { id },
        include: { items: { orderBy: { order: 'asc' } } },
      });
      if (!checklist) throw new NotFoundException('Checklist não encontrado');

      const hasIssues = dto.responses.some((r) => r.status === 'NOK');

      const execution = await tx.checklistExecution.create({
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

      if (hasIssues) {
        const nokItems = dto.responses
          .filter((r) => r.status === 'NOK')
          .map((r) => r.itemId);

        const requiredNok = checklist.items.filter(
          (i) => i.isRequired && nokItems.includes(i.id),
        );

        if (requiredNok.length > 0) {
          const activeRoutes = await tx.route.count({
            where: {
              vehicleId: dto.vehicleId,
              status: { in: ['SCHEDULED', 'IN_PROGRESS'] },
            },
          });

          if (activeRoutes === 0) {
            await tx.vehicle.update({
              where: { id: dto.vehicleId },
              data: { status: 'MAINTENANCE' },
            });
          }
        }
      }

      return execution;
    });
  }

  async getExecutions(
    prisma: TenantPrismaService,
    vehicleId?: string,
    driverId?: string,
    resolutionStatus?: string,
  ) {
    const list = await prisma.checklistExecution.findMany({
      where: {
        ...(vehicleId ? { vehicleId } : {}),
        ...(driverId ? { driverId } : {}),
        ...(resolutionStatus ? { resolutionStatus: resolutionStatus as any } : {}),
      },
      include: {
        checklist: { select: { name: true, type: true } },
        vehicle: { select: { plate: true, brand: true, model: true } },
        driver: { select: { name: true } },
        inspector: { select: { name: true } },
        resolvedBy: { select: { name: true } },
        responses: {
          include: {
            item: { select: { description: true, isRequired: true, order: true } },
          },
          orderBy: { item: { order: 'asc' } },
        },
      },
      orderBy: { executedAt: 'desc' },
      take: 100,
    });

    return list.map((e) => ({
      ...e,
      createdAt: e.executedAt,
      inspectorName: e.inspector?.name ?? null,
      resolvedByName: e.resolvedBy?.name ?? null,
    }));
  }

  async resolveExecution(
    prisma: TenantPrismaService,
    id: string,
    status: ResolveStatus,
    resolvedById: string,
  ) {
    const execution = await prisma.checklistExecution.findUnique({ where: { id } });
    if (!execution) throw new NotFoundException('Execução não encontrada');

    if (status === ResolveStatus.RESOLVED && execution.resolutionStatus !== 'PENDING') {
      throw new BadRequestException('Somente execuções pendentes podem ser marcadas como resolvidas');
    }
    if (status === ResolveStatus.APPROVED && execution.resolutionStatus !== 'RESOLVED') {
      throw new BadRequestException('Somente execuções resolvidas podem ser aprovadas');
    }

    return prisma.checklistExecution.update({
      where: { id },
      data: {
        resolutionStatus: status as any,
        resolvedById,
        resolvedAt: new Date(),
      },
      include: {
        checklist: { select: { name: true, type: true } },
        vehicle: { select: { plate: true, brand: true, model: true } },
        driver: { select: { name: true } },
        inspector: { select: { name: true } },
        resolvedBy: { select: { name: true } },
        responses: {
          include: {
            item: { select: { description: true, isRequired: true, order: true } },
          },
          orderBy: { item: { order: 'asc' } },
        },
      },
    });
  }
}
