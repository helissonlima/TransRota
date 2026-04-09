import {
  Body, Controller, Delete, Get, Param,
  Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { TenantPrisma } from '../tenant/tenant.decorator';
import { UserRole } from '@transrota/shared';
import { TenantPrismaService } from '../core/prisma/tenant-prisma.service';

@ApiTags('Fleet - Veículos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Cadastrar veículo' })
  create(@TenantPrisma() prisma: TenantPrismaService, @Body() dto: CreateVehicleDto) {
    return this.vehiclesService.create(prisma, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar veículos' })
  findAll(
    @TenantPrisma() prisma: TenantPrismaService,
    @Query('branchId') branchId?: string,
    @Query('status') status?: string,
  ) {
    return this.vehiclesService.findAll(prisma, branchId, status);
  }

  @Get('alerts')
  @ApiOperation({ summary: 'Veículos com manutenção pendente' })
  getAlerts(@TenantPrisma() prisma: TenantPrismaService) {
    return this.vehiclesService.getAlerts(prisma);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhe do veículo' })
  findOne(@TenantPrisma() prisma: TenantPrismaService, @Param('id') id: string) {
    return this.vehiclesService.findOne(prisma, id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Atualizar veículo' })
  update(
    @TenantPrisma() prisma: TenantPrismaService,
    @Param('id') id: string,
    @Body() dto: UpdateVehicleDto,
  ) {
    return this.vehiclesService.update(prisma, id, dto);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)
  @ApiOperation({ summary: 'Alterar status do veículo' })
  updateStatus(
    @TenantPrisma() prisma: TenantPrismaService,
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.vehiclesService.updateStatus(prisma, id, status);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Desativar veículo' })
  async deactivate(@TenantPrisma() prisma: TenantPrismaService, @Param('id') id: string) {
    await this.vehiclesService.deactivate(prisma, id);
    return { message: 'Veículo desativado' };
  }
}
