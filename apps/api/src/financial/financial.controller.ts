import {
  Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { FinancialService } from './financial.service';
import {
  CreateFinancialEntryDto,
  UpdateFinancialEntryDto,
  CreateCostCenterDto,
} from './dto/financial.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { TenantPrisma } from '../tenant/tenant.decorator';
import { UserRole } from '@transrota/shared';
import { TenantPrismaService } from '../core/prisma/tenant-prisma.service';

@ApiTags('Financeiro')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('financial')
export class FinancialController {
  constructor(private readonly financial: FinancialService) {}

  // ── Dashboard ──────────────────────────────────────────────────────────────

  @Get('dashboard')
  @ApiOperation({ summary: 'Dashboard financeiro' })
  @ApiQuery({ name: 'month', required: false, description: 'YYYY-MM' })
  getDashboard(
    @TenantPrisma() prisma: TenantPrismaService,
    @Query('month') month?: string,
  ) {
    return this.financial.getDashboard(prisma, month);
  }

  // ── Lançamentos ────────────────────────────────────────────────────────────

  @Post('entries')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Cadastrar lançamento financeiro' })
  createEntry(@TenantPrisma() prisma: TenantPrismaService, @Body() dto: CreateFinancialEntryDto) {
    return this.financial.createEntry(prisma, dto);
  }

  @Get('entries')
  @ApiOperation({ summary: 'Listar lançamentos' })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  findEntries(
    @TenantPrisma() prisma: TenantPrismaService,
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('category') category?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.financial.findEntries(prisma, type, status, category, startDate, endDate);
  }

  @Get('entries/:id')
  @ApiOperation({ summary: 'Detalhe de lançamento' })
  findOneEntry(@TenantPrisma() prisma: TenantPrismaService, @Param('id') id: string) {
    return this.financial.findOneEntry(prisma, id);
  }

  @Patch('entries/:id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Editar lançamento' })
  updateEntry(
    @TenantPrisma() prisma: TenantPrismaService,
    @Param('id') id: string,
    @Body() dto: UpdateFinancialEntryDto,
  ) {
    return this.financial.updateEntry(prisma, id, dto);
  }

  @Delete('entries/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Remover lançamento' })
  deleteEntry(@TenantPrisma() prisma: TenantPrismaService, @Param('id') id: string) {
    return this.financial.deleteEntry(prisma, id);
  }

  // ── Centros de Custo ───────────────────────────────────────────────────────

  @Post('cost-centers')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Criar centro de custo' })
  createCostCenter(@TenantPrisma() prisma: TenantPrismaService, @Body() dto: CreateCostCenterDto) {
    return this.financial.createCostCenter(prisma, dto);
  }

  @Get('cost-centers')
  @ApiOperation({ summary: 'Listar centros de custo' })
  findCostCenters(@TenantPrisma() prisma: TenantPrismaService) {
    return this.financial.findCostCenters(prisma);
  }

  @Patch('cost-centers/:id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Editar centro de custo' })
  updateCostCenter(
    @TenantPrisma() prisma: TenantPrismaService,
    @Param('id') id: string,
    @Body() dto: Partial<CreateCostCenterDto>,
  ) {
    return this.financial.updateCostCenter(prisma, id, dto);
  }

  @Delete('cost-centers/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Desativar centro de custo' })
  deleteCostCenter(@TenantPrisma() prisma: TenantPrismaService, @Param('id') id: string) {
    return this.financial.deleteCostCenter(prisma, id);
  }
}
