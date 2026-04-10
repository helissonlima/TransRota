import {
  Body, Controller, Delete, Get, Param,
  Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TaxesService } from './taxes.service';
import { CreateVehicleTaxDto } from './dto/create-vehicle-tax.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { TenantPrisma } from '../tenant/tenant.decorator';
import { UserRole } from '@transrota/shared';
import { TenantPrismaService } from '../core/prisma/tenant-prisma.service';
import { PartialType } from '@nestjs/swagger';

class UpdateVehicleTaxDto extends PartialType(CreateVehicleTaxDto) {}

@ApiTags('Tributos e Taxas de Veículos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('taxes')
export class TaxesController {
  constructor(private readonly taxesService: TaxesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Cadastrar tributo/taxa de veículo' })
  create(
    @TenantPrisma() prisma: TenantPrismaService,
    @Body() dto: CreateVehicleTaxDto,
  ) {
    return this.taxesService.create(prisma, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar tributos/taxas' })
  @ApiQuery({ name: 'vehicleId', required: false })
  @ApiQuery({ name: 'paymentStatus', required: false })
  @ApiQuery({ name: 'type', required: false })
  findAll(
    @TenantPrisma() prisma: TenantPrismaService,
    @Query('vehicleId') vehicleId?: string,
    @Query('paymentStatus') paymentStatus?: string,
    @Query('type') type?: string,
  ) {
    return this.taxesService.findAll(prisma, vehicleId, paymentStatus, type);
  }

  @Get('overdue')
  @ApiOperation({ summary: 'Listar tributos/taxas vencidos ou em atraso' })
  getOverdue(@TenantPrisma() prisma: TenantPrismaService) {
    return this.taxesService.getOverdue(prisma);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhe de tributo/taxa' })
  findOne(
    @TenantPrisma() prisma: TenantPrismaService,
    @Param('id') id: string,
  ) {
    return this.taxesService.findOne(prisma, id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Atualizar tributo/taxa' })
  update(
    @TenantPrisma() prisma: TenantPrismaService,
    @Param('id') id: string,
    @Body() dto: UpdateVehicleTaxDto,
  ) {
    return this.taxesService.update(prisma, id, dto);
  }

  @Patch(':id/pay')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Registrar pagamento de tributo/taxa' })
  pay(
    @TenantPrisma() prisma: TenantPrismaService,
    @Param('id') id: string,
    @Body('paidValue') paidValue?: number,
    @Body('paidAt') paidAt?: string,
  ) {
    return this.taxesService.pay(prisma, id, paidValue, paidAt);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Remover tributo/taxa' })
  async remove(
    @TenantPrisma() prisma: TenantPrismaService,
    @Param('id') id: string,
  ) {
    await this.taxesService.remove(prisma, id);
    return { message: 'Tributo/taxa removido' };
  }
}
