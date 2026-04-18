import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { Response } from "express";
import { ReportsService } from "./reports.service";
import { ExportService } from "./export.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TenantPrisma } from "../tenant/tenant.decorator";
import { TenantPrismaService } from "../core/prisma/tenant-prisma.service";
import { FileInterceptor } from "@nestjs/platform-express";

@ApiTags("Reports")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("reports")
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly exportService: ExportService,
  ) {}

  @Get("dashboard")
  @ApiOperation({ summary: "KPIs do dashboard principal" })
  dashboard(
    @TenantPrisma() prisma: TenantPrismaService,
    @Query("branchId") branchId?: string,
  ) {
    return this.reportsService.getDashboard(prisma, branchId);
  }

  @Get("deliveries")
  @ApiOperation({ summary: "Relatório de entregas por período" })
  deliveries(
    @TenantPrisma() prisma: TenantPrismaService,
    @Query("from") from: string,
    @Query("to") to: string,
    @Query("branchId") branchId?: string,
  ) {
    return this.reportsService.getDeliveriesReport(
      prisma,
      new Date(from),
      new Date(to),
      branchId,
    );
  }

  @Get("fleet")
  @ApiOperation({ summary: "Relatório de custos da frota" })
  fleet(
    @TenantPrisma() prisma: TenantPrismaService,
    @Query("from") from: string,
    @Query("to") to: string,
  ) {
    return this.reportsService.getFleetReport(
      prisma,
      new Date(from),
      new Date(to),
    );
  }

  @Get("drivers")
  @ApiOperation({ summary: "Desempenho dos motoristas" })
  drivers(
    @TenantPrisma() prisma: TenantPrismaService,
    @Query("from") from: string,
    @Query("to") to: string,
  ) {
    return this.reportsService.getDriversReport(
      prisma,
      new Date(from),
      new Date(to),
    );
  }

  @Post("warehouse-reconciliation")
  @ApiOperation({ summary: "Conferência Planilha x Estoque (aba ARMAZÉM)" })
  @UseInterceptors(FileInterceptor("file"))
  async warehouseReconciliation(
    @TenantPrisma() prisma: TenantPrismaService,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file?.buffer) {
      throw new BadRequestException(
        "Arquivo não enviado. Use o campo file (xlsx).",
      );
    }

    return this.reportsService.reconcileWarehouseStock(prisma, file.buffer);
  }

  // ── Exportações ─────────────────────────────────────────────────────────

  @Get("fleet/export")
  @ApiOperation({ summary: "Exportar relatório de frota em Excel" })
  async exportFleet(
    @TenantPrisma() prisma: TenantPrismaService,
    @Query("from") from: string,
    @Query("to") to: string,
    @Res() res: Response,
  ) {
    const report = await this.reportsService.getFleetReport(
      prisma,
      new Date(from),
      new Date(to),
    );

    const fuelRows = report.fuel.entries.map((f: any) => ({
      data: new Date(f.performedAt).toLocaleDateString("pt-BR"),
      veiculo: `${f.vehicle.plate} - ${f.vehicle.model}`,
      motorista: f.driver?.name ?? "—",
      litros: Number(f.liters),
      precoLitro: Number(f.pricePerLiter),
      total: Number(f.totalCost),
    }));

    const buffer = await this.exportService.generateExcel(
      "Abastecimentos",
      [
        { header: "Data", key: "data", width: 14 },
        { header: "Veículo", key: "veiculo", width: 25 },
        { header: "Motorista", key: "motorista", width: 25 },
        { header: "Litros", key: "litros", width: 12 },
        { header: "R$/Litro", key: "precoLitro", width: 12 },
        { header: "Total (R$)", key: "total", width: 14 },
      ],
      fuelRows,
    );

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=frota-${from}-${to}.xlsx`,
    );
    res.send(buffer);
  }

  @Get("deliveries/export")
  @ApiOperation({ summary: "Exportar relatório de entregas em Excel" })
  async exportDeliveries(
    @TenantPrisma() prisma: TenantPrismaService,
    @Query("from") from: string,
    @Query("to") to: string,
    @Query("branchId") branchId: string | undefined,
    @Res() res: Response,
  ) {
    const report = await this.reportsService.getDeliveriesReport(
      prisma,
      new Date(from),
      new Date(to),
      branchId,
    );

    const rows = report.stops.map((s: any) => ({
      data: new Date(s.route.scheduledDate).toLocaleDateString("pt-BR"),
      rota: s.route.name,
      motorista: s.route.driver?.name ?? "—",
      veiculo: s.route.vehicle?.plate ?? "—",
      cliente: s.clientName,
      endereco: s.address,
      cidade: s.city,
      status: s.status,
    }));

    const buffer = await this.exportService.generateExcel(
      "Entregas",
      [
        { header: "Data", key: "data", width: 14 },
        { header: "Rota", key: "rota", width: 20 },
        { header: "Motorista", key: "motorista", width: 22 },
        { header: "Veículo", key: "veiculo", width: 14 },
        { header: "Cliente", key: "cliente", width: 25 },
        { header: "Endereço", key: "endereco", width: 30 },
        { header: "Cidade", key: "cidade", width: 18 },
        { header: "Status", key: "status", width: 16 },
      ],
      rows,
    );

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=entregas-${from}-${to}.xlsx`,
    );
    res.send(buffer);
  }

  @Get("drivers/export")
  @ApiOperation({ summary: "Exportar desempenho dos motoristas em Excel" })
  async exportDrivers(
    @TenantPrisma() prisma: TenantPrismaService,
    @Query("from") from: string,
    @Query("to") to: string,
    @Res() res: Response,
  ) {
    const report = await this.reportsService.getDriversReport(
      prisma,
      new Date(from),
      new Date(to),
    );

    const rows = (report as any[]).map((d: any) => ({
      nome: d.name,
      rotas: d.routes,
      entregues: d.delivered,
      parciais: d.partial,
      naoEntregues: d.notDelivered,
      taxa:
        d.delivered + d.partial + d.notDelivered > 0
          ? `${Math.round((d.delivered / (d.delivered + d.partial + d.notDelivered)) * 100)}%`
          : "—",
    }));

    const buffer = await this.exportService.generateExcel(
      "Motoristas",
      [
        { header: "Motorista", key: "nome", width: 25 },
        { header: "Rotas", key: "rotas", width: 10 },
        { header: "Entregues", key: "entregues", width: 12 },
        { header: "Parciais", key: "parciais", width: 12 },
        { header: "Não Entregues", key: "naoEntregues", width: 14 },
        { header: "Taxa Sucesso", key: "taxa", width: 14 },
      ],
      rows,
    );

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=motoristas-${from}-${to}.xlsx`,
    );
    res.send(buffer);
  }
}
