import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { TenantPrisma } from '../tenant/tenant.decorator';
import { TenantPrismaService } from '../core/prisma/tenant-prisma.service';

@ApiTags('Fleet - Manutenção')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('vehicles/:vehicleId/maintenance')
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar manutenção' })
  create(
    @TenantPrisma() prisma: TenantPrismaService,
    @Param('vehicleId') vehicleId: string,
    @Body() dto: CreateMaintenanceDto,
  ) {
    return this.maintenanceService.create(prisma, vehicleId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Histórico de manutenções do veículo' })
  findAll(
    @TenantPrisma() prisma: TenantPrismaService,
    @Param('vehicleId') vehicleId: string,
  ) {
    return this.maintenanceService.findByVehicle(prisma, vehicleId);
  }
}
