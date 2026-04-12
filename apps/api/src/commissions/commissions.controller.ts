import {
  Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CommissionsService } from './commissions.service';
import { CreateCommissionDto, UpdateCommissionDto, UpdateCommissionStatusDto } from './dto/commission.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { TenantPrisma } from '../tenant/tenant.decorator';
import { UserRole } from '@transrota/shared';
import { TenantPrismaService } from '../core/prisma/tenant-prisma.service';

@ApiTags('Comissões de Motoristas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('commissions')
export class CommissionsController {
  constructor(private readonly commissions: CommissionsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Cadastrar comissão' })
  create(@TenantPrisma() prisma: TenantPrismaService, @Body() dto: CreateCommissionDto) {
    return this.commissions.create(prisma, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar comissões' })
  @ApiQuery({ name: 'driverId', required: false })
  @ApiQuery({ name: 'period', required: false })
  @ApiQuery({ name: 'status', required: false })
  findAll(
    @TenantPrisma() prisma: TenantPrismaService,
    @Query('driverId') driverId?: string,
    @Query('period') period?: string,
    @Query('status') status?: string,
  ) {
    return this.commissions.findAll(prisma, driverId, period, status);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Resumo de comissões por período' })
  @ApiQuery({ name: 'period', required: false })
  getSummary(
    @TenantPrisma() prisma: TenantPrismaService,
    @Query('period') period?: string,
  ) {
    return this.commissions.getSummary(prisma, period);
  }

  @Post('generate')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Gerar comissão automaticamente a partir das rotas' })
  generateFromRoutes(
    @TenantPrisma() prisma: TenantPrismaService,
    @Body() body: { driverId: string; period: string; percentage: number },
  ) {
    return this.commissions.generateFromRoutes(prisma, body.driverId, body.period, body.percentage);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhe de comissão' })
  findOne(@TenantPrisma() prisma: TenantPrismaService, @Param('id') id: string) {
    return this.commissions.findOne(prisma, id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Editar comissão' })
  update(
    @TenantPrisma() prisma: TenantPrismaService,
    @Param('id') id: string,
    @Body() dto: UpdateCommissionDto,
  ) {
    return this.commissions.update(prisma, id, dto);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Atualizar status (aprovar / marcar como pago / cancelar)' })
  updateStatus(
    @TenantPrisma() prisma: TenantPrismaService,
    @Param('id') id: string,
    @Body() dto: UpdateCommissionStatusDto,
  ) {
    return this.commissions.updateStatus(prisma, id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Remover comissão' })
  remove(@TenantPrisma() prisma: TenantPrismaService, @Param('id') id: string) {
    return this.commissions.remove(prisma, id);
  }
}
