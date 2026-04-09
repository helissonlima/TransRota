import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantPrisma } from '../tenant/tenant.decorator';
import { TenantPrismaService } from '../core/prisma/tenant-prisma.service';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'KPIs do dashboard principal' })
  dashboard(
    @TenantPrisma() prisma: TenantPrismaService,
    @Query('branchId') branchId?: string,
  ) {
    return this.reportsService.getDashboard(prisma, branchId);
  }

  @Get('deliveries')
  @ApiOperation({ summary: 'Relatório de entregas por período' })
  deliveries(
    @TenantPrisma() prisma: TenantPrismaService,
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('branchId') branchId?: string,
  ) {
    return this.reportsService.getDeliveriesReport(
      prisma,
      new Date(from),
      new Date(to),
      branchId,
    );
  }

  @Get('fleet')
  @ApiOperation({ summary: 'Relatório de custos da frota' })
  fleet(
    @TenantPrisma() prisma: TenantPrismaService,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.reportsService.getFleetReport(prisma, new Date(from), new Date(to));
  }

  @Get('drivers')
  @ApiOperation({ summary: 'Desempenho dos motoristas' })
  drivers(
    @TenantPrisma() prisma: TenantPrismaService,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.reportsService.getDriversReport(prisma, new Date(from), new Date(to));
  }
}
