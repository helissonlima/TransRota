import {
  Body, Controller, Delete, Get, Param,
  Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DailyKmService } from './daily-km.service';
import { CreateDailyKmDto } from './dto/create-daily-km.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { TenantPrisma } from '../tenant/tenant.decorator';
import { UserRole } from '@transrota/shared';
import { TenantPrismaService } from '../core/prisma/tenant-prisma.service';
import { PartialType } from '@nestjs/swagger';

class UpdateDailyKmDto extends PartialType(CreateDailyKmDto) {}

@ApiTags('KM Diário')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('daily-km')
export class DailyKmController {
  constructor(private readonly dailyKmService: DailyKmService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)
  @ApiOperation({ summary: 'Registrar KM diário' })
  create(
    @TenantPrisma() prisma: TenantPrismaService,
    @Body() dto: CreateDailyKmDto,
  ) {
    return this.dailyKmService.create(prisma, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar registros de KM diário' })
  @ApiQuery({ name: 'vehicleId', required: false })
  @ApiQuery({ name: 'driverId', required: false })
  @ApiQuery({ name: 'dateFrom', required: false })
  @ApiQuery({ name: 'dateTo', required: false })
  findAll(
    @TenantPrisma() prisma: TenantPrismaService,
    @Query('vehicleId') vehicleId?: string,
    @Query('driverId') driverId?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.dailyKmService.findAll(prisma, vehicleId, driverId, dateFrom, dateTo);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Resumo mensal de KM por motorista' })
  @ApiQuery({ name: 'year', required: true, example: 2024 })
  @ApiQuery({ name: 'month', required: true, example: 1 })
  @ApiQuery({ name: 'driverId', required: false })
  getMonthlySummary(
    @TenantPrisma() prisma: TenantPrismaService,
    @Query('year') year: string,
    @Query('month') month: string,
    @Query('driverId') driverId?: string,
  ) {
    const now = new Date();
    return this.dailyKmService.getMonthlySummary(
      prisma,
      year ? parseInt(year, 10) : now.getFullYear(),
      month ? parseInt(month, 10) : now.getMonth() + 1,
      driverId,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhe de registro KM diário' })
  findOne(
    @TenantPrisma() prisma: TenantPrismaService,
    @Param('id') id: string,
  ) {
    return this.dailyKmService.findOne(prisma, id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Atualizar registro de KM diário' })
  update(
    @TenantPrisma() prisma: TenantPrismaService,
    @Param('id') id: string,
    @Body() dto: UpdateDailyKmDto,
  ) {
    return this.dailyKmService.update(prisma, id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Remover registro de KM diário' })
  async remove(
    @TenantPrisma() prisma: TenantPrismaService,
    @Param('id') id: string,
  ) {
    await this.dailyKmService.remove(prisma, id);
    return { message: 'Registro removido' };
  }
}
