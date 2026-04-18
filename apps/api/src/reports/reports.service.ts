import { Injectable } from "@nestjs/common";
import { TenantPrismaService } from "../core/prisma/tenant-prisma.service";
import * as Excel from "exceljs";

@Injectable()
export class ReportsService {
  private normalizeName(value: string) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  private parseCellValue(v: any): any {
    if (v == null) return null;
    if (typeof v === "object") {
      if (v.result !== undefined) return v.result;
      if (v.text !== undefined) return v.text;
      if (Array.isArray(v.richText))
        return v.richText.map((r: any) => r.text || "").join("");
    }
    return v;
  }

  private parseNumber(v: any): number | null {
    const raw = this.parseCellValue(v);
    if (raw == null || raw === "") return null;
    if (typeof raw === "number") return raw;
    const normalized = String(raw)
      .replace(/\s/g, "")
      .replace(/\./g, "")
      .replace(/,/g, ".")
      .replace(/[^\d.-]/g, "");
    const n = Number(normalized);
    return Number.isFinite(n) ? n : null;
  }

  async reconcileWarehouseStock(
    prisma: TenantPrismaService,
    fileBuffer: Buffer,
  ) {
    const workbook = new Excel.Workbook();
    await workbook.xlsx.load(fileBuffer as any);

    const ws = workbook.getWorksheet("ARMAZÉM");
    if (!ws) {
      throw new Error("A aba ARMAZÉM não foi encontrada na planilha.");
    }

    const groups = [2, 7, 12, 17, 22];
    const sheetMap = new Map<string, { name: string; quantity: number }>();

    for (let r = 6; r <= ws.rowCount; r += 1) {
      const row = ws.getRow(r);
      for (const c of groups) {
        const nameRaw = this.parseCellValue(row.getCell(c).value);
        const qty = this.parseNumber(row.getCell(c + 1).value);
        const name = String(nameRaw || "").trim();
        if (!name || qty == null) continue;

        const key = this.normalizeName(name);
        const existing = sheetMap.get(key);
        if (existing) {
          existing.quantity += qty;
        } else {
          sheetMap.set(key, { name, quantity: qty });
        }
      }
    }

    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        stockItems: { select: { quantity: true } },
      },
    });

    const systemMap = new Map<string, { name: string; quantity: number }>();
    for (const product of products) {
      const totalQty = product.stockItems.reduce(
        (sum, item) => sum + Number(item.quantity),
        0,
      );
      const key = this.normalizeName(product.name);
      const existing = systemMap.get(key);
      if (existing) {
        existing.quantity += totalQty;
      } else {
        systemMap.set(key, { name: product.name, quantity: totalQty });
      }
    }

    const rows: Array<{
      productName: string;
      sheetQuantity: number;
      systemQuantity: number;
      difference: number;
      status: "MATCH" | "DIVERGENT" | "MISSING_IN_SYSTEM" | "MISSING_IN_SHEET";
    }> = [];

    let matched = 0;
    let divergent = 0;
    let missingInSystem = 0;
    let missingInSheet = 0;

    for (const [key, sheet] of sheetMap.entries()) {
      const system = systemMap.get(key);
      if (!system) {
        rows.push({
          productName: sheet.name,
          sheetQuantity: sheet.quantity,
          systemQuantity: 0,
          difference: -sheet.quantity,
          status: "MISSING_IN_SYSTEM",
        });
        missingInSystem += 1;
        continue;
      }

      const diff = Number((system.quantity - sheet.quantity).toFixed(3));
      const isMatch = Math.abs(diff) < 0.0005;
      rows.push({
        productName: system.name,
        sheetQuantity: sheet.quantity,
        systemQuantity: system.quantity,
        difference: diff,
        status: isMatch ? "MATCH" : "DIVERGENT",
      });
      if (isMatch) matched += 1;
      else divergent += 1;
    }

    for (const [key, system] of systemMap.entries()) {
      if (sheetMap.has(key)) continue;
      if (Math.abs(system.quantity) < 0.0005) continue;
      rows.push({
        productName: system.name,
        sheetQuantity: 0,
        systemQuantity: system.quantity,
        difference: Number(system.quantity.toFixed(3)),
        status: "MISSING_IN_SHEET",
      });
      missingInSheet += 1;
    }

    rows.sort((a, b) => {
      const statusOrder = {
        DIVERGENT: 0,
        MISSING_IN_SYSTEM: 1,
        MISSING_IN_SHEET: 2,
        MATCH: 3,
      } as const;
      const byStatus = statusOrder[a.status] - statusOrder[b.status];
      if (byStatus !== 0) return byStatus;
      return a.productName.localeCompare(b.productName, "pt-BR");
    });

    return {
      summary: {
        sheetItems: sheetMap.size,
        systemItems: systemMap.size,
        matched,
        divergent,
        missingInSystem,
        missingInSheet,
      },
      rows,
      generatedAt: new Date().toISOString(),
    };
  }

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
      prisma.vehicle.count({
        where: { ...branchFilter, status: "MAINTENANCE" },
      }),
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
          status: { in: ["DELIVERED", "PARTIAL_DELIVERY"] },
        },
      }),
      prisma.vehicle.count({
        where: {
          ...branchFilter,
          isActive: true,
          OR: [
            {
              nextMaintenanceDate: {
                lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              },
            },
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
      {
        DRAFT: 0,
        SCHEDULED: 0,
        IN_PROGRESS: 0,
        COMPLETED: 0,
        CANCELLED: 0,
        totalStops: 0,
      } as Record<string, number>,
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
            id: true,
            name: true,
            scheduledDate: true,
            driver: { select: { name: true } },
            vehicle: { select: { plate: true } },
          },
        },
        items: true,
        proofs: { select: { createdAt: true } },
      },
      orderBy: { route: { scheduledDate: "desc" } },
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
        orderBy: { performedAt: "desc" },
      }),
      prisma.fuelRecord.findMany({
        where: { performedAt: { gte: from, lte: to } },
        include: {
          vehicle: { select: { plate: true, model: true } },
          driver: { select: { name: true } },
        },
        orderBy: { performedAt: "desc" },
      }),
    ]);

    const maintenanceCost = maintenance.reduce(
      (acc, m) => acc + Number(m.cost),
      0,
    );
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
        entries: fuel,
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
        status: { in: ["COMPLETED", "IN_PROGRESS"] },
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
          if (stop.status === "DELIVERED") acc[driverId].delivered += 1;
          else if (stop.status === "NOT_DELIVERED")
            acc[driverId].notDelivered += 1;
          else if (stop.status === "PARTIAL_DELIVERY")
            acc[driverId].partial += 1;
        }
        return acc;
      },
      {} as Record<string, any>,
    );

    return Object.values(driverStats).sort(
      (a: any, b: any) => b.routes - a.routes,
    );
  }
}
