import { Injectable } from '@nestjs/common';
import { TenantPrismaService } from '../core/prisma/tenant-prisma.service';

@Injectable()
export class ReportsService {
  async getDashboard(prisma: TenantPrismaService, branchId?: string) {
    const branchFilter = branchId ? { branchId } : {};
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      totalVehicles,
      vehiclesInMaintenance,
      totalDrivers,
      routesToday,
      routesThisMonth,
      deliveriesToday,
      pendingAlerts,
    ] = await Promise.all([
      prisma.vehicle.count({ where: { ...branchFilter, isActive: true } }),
      prisma.vehicle.count({ where: { ...branchFilter, status: 'MAINTENANCE' } }),
      prisma.driver.count({ where: { ...branchFilter, isActive: true } }),
      prisma.route.findMany({
        where: { ...branchFilter, scheduledDate: { gte: startOfDay } },
        select: { id: true, status: true, _count: { select: { stops: true } } },
      }),
      prisma.route.count({
        where: { ...branchFilter, scheduledDate: { gte: startOfMonth } },
      }),
      prisma.routeStop.count({
        where: {
          route: { ...branchFilter, scheduledDate: { gte: startOfDay } },
          status: { in: ['DELIVERED', 'PARTIAL_DELIVERY'] },
        },
      }),
      prisma.vehicle.count({
        where: {
          ...branchFilter,
          isActive: true,
          OR: [
            { nextMaintenanceDate: { lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } },
          ],
        },
      }),
    ]);

    const routeStats = routesToday.reduce(
      (acc, r) => {
        acc[r.status] = (acc[r.status] || 0) + 1;
        acc.totalStops += r._count.stops;
        return acc;
      },
      { DRAFT: 0, SCHEDULED: 0, IN_PROGRESS: 0, COMPLETED: 0, CANCELLED: 0, totalStops: 0 } as Record<string, number>,
    );

    return {
      fleet: {
        total: totalVehicles,
        active: totalVehicles - vehiclesInMaintenance,
        inMaintenance: vehiclesInMaintenance,
      },
      drivers: { total: totalDrivers },
      routes: {
        today: routesToday.length,
        thisMonth: routesThisMonth,
        ...routeStats,
      },
      deliveries: {
        today: deliveriesToday,
      },
      alerts: {
        maintenanceDue: pendingAlerts,
      },
    };
  }

  async getDeliveriesReport(
    prisma: TenantPrismaService,
    from: Date,
    to: Date,
    branchId?: string,
  ) {
    const stops = await prisma.routeStop.findMany({
      where: {
        route: {
          ...(branchId ? { branchId } : {}),
          scheduledDate: { gte: from, lte: to },
        },
      },
      include: {
        route: {
          select: {
            name: true,
            scheduledDate: true,
            driver: { select: { name: true } },
            vehicle: { select: { plate: true } },
          },
        },
        items: true,
        proofs: { select: { createdAt: true } },
      },
      orderBy: { route: { scheduledDate: 'desc' } },
    });

    const summary = stops.reduce(
      (acc, s) => {
        acc[s.status] = (acc[s.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return { summary, total: stops.length, stops };
  }

  async getFleetReport(prisma: TenantPrismaService, from: Date, to: Date) {
    const [maintenance, fuel] = await Promise.all([
      prisma.maintenanceRecord.findMany({
        where: { performedAt: { gte: from, lte: to } },
        include: { vehicle: { select: { plate: true, model: true } } },
        orderBy: { performedAt: 'desc' },
      }),
      prisma.fuelRecord.findMany({
        where: { performedAt: { gte: from, lte: to } },
        include: {
          vehicle: { select: { plate: true, model: true } },
          driver: { select: { name: true } },
        },
        orderBy: { performedAt: 'desc' },
      }),
    ]);

    const maintenanceCost = maintenance.reduce((acc, m) => acc + Number(m.cost), 0);
    const fuelCost = fuel.reduce((acc, f) => acc + Number(f.totalCost), 0);
    const fuelLiters = fuel.reduce((acc, f) => acc + Number(f.liters), 0);

    return {
      costs: {
        maintenance: maintenanceCost,
        fuel: fuelCost,
        total: maintenanceCost + fuelCost,
      },
      fuel: {
        totalLiters: fuelLiters,
        records: fuel.length,
        averagePricePerLiter: fuelCost / fuelLiters || 0,
      },
      maintenance: {
        total: maintenance.length,
        records: maintenance,
      },
    };
  }

  async getDriversReport(prisma: TenantPrismaService, from: Date, to: Date) {
    const routes = await prisma.route.findMany({
      where: {
        scheduledDate: { gte: from, lte: to },
        status: { in: ['COMPLETED', 'IN_PROGRESS'] },
      },
      include: {
        driver: { select: { id: true, name: true } },
        stops: { select: { status: true } },
      },
    });

    const driverStats = routes.reduce(
      (acc, route) => {
        const driverId = route.driver.id;
        if (!acc[driverId]) {
          acc[driverId] = {
            driverId,
            name: route.driver.name,
            routes: 0,
            delivered: 0,
            notDelivered: 0,
            partial: 0,
          };
        }
        acc[driverId].routes += 1;
        for (const stop of route.stops) {
          if (stop.status === 'DELIVERED') acc[driverId].delivered += 1;
          else if (stop.status === 'NOT_DELIVERED') acc[driverId].notDelivered += 1;
          else if (stop.status === 'PARTIAL_DELIVERY') acc[driverId].partial += 1;
        }
        return acc;
      },
      {} as Record<string, any>,
    );

    return Object.values(driverStats).sort((a: any, b: any) => b.routes - a.routes);
  }
}
