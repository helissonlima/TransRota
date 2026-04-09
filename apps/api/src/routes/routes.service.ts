import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { TenantPrismaService } from '../core/prisma/tenant-prisma.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateStopStatusDto } from './dto/update-stop-status.dto';
import { AddDeliveryProofDto } from './dto/add-delivery-proof.dto';

@Injectable()
export class RoutesService {
  async create(prisma: TenantPrismaService, dto: CreateRouteDto) {
    return prisma.route.create({
      data: {
        name: dto.name,
        vehicleId: dto.vehicleId,
        driverId: dto.driverId,
        branchId: dto.branchId,
        scheduledDate: new Date(dto.scheduledDate),
        notes: dto.notes,
        stops: {
          create: dto.stops.map((stop, index) => ({
            sequence: stop.sequence ?? index + 1,
            clientName: stop.clientName,
            clientDocument: stop.clientDocument,
            address: stop.address,
            city: stop.city,
            state: stop.state,
            zipCode: stop.zipCode,
            lat: stop.lat,
            lng: stop.lng,
            timeWindowStart: stop.timeWindowStart ? new Date(stop.timeWindowStart) : undefined,
            timeWindowEnd: stop.timeWindowEnd ? new Date(stop.timeWindowEnd) : undefined,
            notes: stop.notes,
            items: {
              create: stop.items?.map((item) => ({
                description: item.description,
                quantity: item.quantity,
                weight: item.weight,
                nfeNumber: item.nfeNumber,
                barcode: item.barcode,
              })) ?? [],
            },
          })),
        },
      },
      include: { stops: { include: { items: true }, orderBy: { sequence: 'asc' } } },
    });
  }

  async findAll(prisma: TenantPrismaService, branchId?: string, status?: string) {
    return prisma.route.findMany({
      where: {
        ...(branchId ? { branchId } : {}),
        ...(status ? { status: status as any } : {}),
      },
      include: {
        vehicle: { select: { plate: true, model: true } },
        driver: { select: { name: true } },
        _count: { select: { stops: true } },
      },
      orderBy: { scheduledDate: 'desc' },
    });
  }

  async findOne(prisma: TenantPrismaService, id: string) {
    const route = await prisma.route.findUnique({
      where: { id },
      include: {
        vehicle: { select: { plate: true, model: true, brand: true } },
        driver: { select: { name: true, phone: true } },
        stops: {
          include: { items: true, proofs: true },
          orderBy: { sequence: 'asc' },
        },
      },
    });
    if (!route) throw new NotFoundException('Rota não encontrada');
    return route;
  }

  async start(prisma: TenantPrismaService, id: string) {
    const route = await this.findOne(prisma, id);
    if (route.status !== 'SCHEDULED' && route.status !== 'DRAFT') {
      throw new BadRequestException('Rota não pode ser iniciada neste status');
    }
    return prisma.route.update({
      where: { id },
      data: { status: 'IN_PROGRESS', startedAt: new Date() },
    });
  }

  async complete(prisma: TenantPrismaService, id: string) {
    const route = await this.findOne(prisma, id);
    if (route.status !== 'IN_PROGRESS') {
      throw new BadRequestException('Rota não está em andamento');
    }
    return prisma.route.update({
      where: { id },
      data: { status: 'COMPLETED', completedAt: new Date() },
    });
  }

  async cancel(prisma: TenantPrismaService, id: string) {
    await this.findOne(prisma, id);
    return prisma.route.update({ where: { id }, data: { status: 'CANCELLED' } });
  }

  async updateStopStatus(
    prisma: TenantPrismaService,
    routeId: string,
    stopId: string,
    dto: UpdateStopStatusDto,
  ) {
    const stop = await prisma.routeStop.findFirst({ where: { id: stopId, routeId } });
    if (!stop) throw new NotFoundException('Parada não encontrada');

    const updated = await prisma.routeStop.update({
      where: { id: stopId },
      data: {
        status: dto.status as any,
        nonDeliveryReason: dto.nonDeliveryReason as any,
        notes: dto.notes,
        arrivedAt: dto.arrivedAt ? new Date(dto.arrivedAt) : (stop.arrivedAt ?? new Date()),
        completedAt: ['DELIVERED', 'PARTIAL_DELIVERY', 'NOT_DELIVERED'].includes(dto.status)
          ? new Date()
          : undefined,
      },
    });

    // Atualiza contagem de paradas concluídas na rota
    const completedCount = await prisma.routeStop.count({
      where: {
        routeId,
        status: { in: ['DELIVERED', 'PARTIAL_DELIVERY', 'NOT_DELIVERED'] },
      },
    });

    const totalCount = await prisma.routeStop.count({ where: { routeId } });

    if (completedCount === totalCount) {
      await prisma.route.update({
        where: { id: routeId },
        data: { status: 'COMPLETED', completedAt: new Date() },
      });
    }

    return updated;
  }

  async addProof(
    prisma: TenantPrismaService,
    routeId: string,
    stopId: string,
    dto: AddDeliveryProofDto,
  ) {
    const stop = await prisma.routeStop.findFirst({ where: { id: stopId, routeId } });
    if (!stop) throw new NotFoundException('Parada não encontrada');

    // Atualiza quantidade entregue nos itens se fornecido
    if (dto.deliveredItems?.length) {
      for (const item of dto.deliveredItems) {
        await prisma.deliveryItem.update({
          where: { id: item.itemId },
          data: { deliveredQuantity: item.deliveredQuantity },
        });
      }
    }

    return prisma.deliveryProof.create({
      data: {
        stopId,
        photoUrl: dto.photoUrl,
        signatureUrl: dto.signatureUrl,
        lat: dto.lat,
        lng: dto.lng,
        receiverName: dto.receiverName,
        receiverDocument: dto.receiverDocument,
      },
    });
  }
}
