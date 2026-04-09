import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FuelService } from './fuel.service';
import { CreateFuelRecordDto } from './dto/create-fuel-record.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { TenantPrisma } from '../tenant/tenant.decorator';
import { TenantPrismaService } from '../core/prisma/tenant-prisma.service';

@ApiTags('Fleet - Abastecimento')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('vehicles/:vehicleId/fuel')
export class FuelController {
  constructor(private readonly fuelService: FuelService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar abastecimento' })
  create(
    @TenantPrisma() prisma: TenantPrismaService,
    @Param('vehicleId') vehicleId: string,
    @Body() dto: CreateFuelRecordDto,
  ) {
    return this.fuelService.create(prisma, vehicleId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Histórico de abastecimentos do veículo' })
  findAll(
    @TenantPrisma() prisma: TenantPrismaService,
    @Param('vehicleId') vehicleId: string,
  ) {
    return this.fuelService.findByVehicle(prisma, vehicleId);
  }
}
