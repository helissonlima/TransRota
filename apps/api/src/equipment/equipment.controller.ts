import {
  Body, Controller, Delete, Get, Param,
  Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { EquipmentService } from './equipment.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { CreateUsageLogDto } from './dto/create-usage-log.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { TenantPrisma } from '../tenant/tenant.decorator';
import { UserRole } from '@transrota/shared';
import { TenantPrismaService } from '../core/prisma/tenant-prisma.service';
import { PartialType } from '@nestjs/swagger';

class UpdateEquipmentDto extends PartialType(CreateEquipmentDto) {}

@ApiTags('Equipamentos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('equipment')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Cadastrar equipamento' })
  create(
    @TenantPrisma() prisma: TenantPrismaService,
    @Body() dto: CreateEquipmentDto,
  ) {
    return this.equipmentService.create(prisma, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar equipamentos' })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'branchId', required: false })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  findAll(
    @TenantPrisma() prisma: TenantPrismaService,
    @Query('type') type?: string,
    @Query('branchId') branchId?: string,
    @Query('isActive') isActive?: string,
  ) {
    const isActiveFilter =
      isActive !== undefined ? isActive === 'true' : undefined;
    return this.equipmentService.findAll(prisma, type, branchId, isActiveFilter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhe do equipamento' })
  findOne(
    @TenantPrisma() prisma: TenantPrismaService,
    @Param('id') id: string,
  ) {
    return this.equipmentService.findOne(prisma, id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Atualizar equipamento' })
  update(
    @TenantPrisma() prisma: TenantPrismaService,
    @Param('id') id: string,
    @Body() dto: UpdateEquipmentDto,
  ) {
    return this.equipmentService.update(prisma, id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Desativar equipamento' })
  async deactivate(
    @TenantPrisma() prisma: TenantPrismaService,
    @Param('id') id: string,
  ) {
    await this.equipmentService.deactivate(prisma, id);
    return { message: 'Equipamento desativado' };
  }

  // --- Usage Logs ---

  @Post(':id/logs')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)
  @ApiOperation({ summary: 'Registrar uso do equipamento' })
  createUsageLog(
    @TenantPrisma() prisma: TenantPrismaService,
    @Param('id') id: string,
    @Body() dto: CreateUsageLogDto,
  ) {
    return this.equipmentService.createUsageLog(prisma, id, dto);
  }

  @Get(':id/logs')
  @ApiOperation({ summary: 'Listar registros de uso do equipamento' })
  @ApiQuery({ name: 'dateFrom', required: false })
  @ApiQuery({ name: 'dateTo', required: false })
  findUsageLogs(
    @TenantPrisma() prisma: TenantPrismaService,
    @Param('id') id: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.equipmentService.findUsageLogs(prisma, id, dateFrom, dateTo);
  }

  @Delete('logs/:logId')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Remover registro de uso' })
  async removeUsageLog(
    @TenantPrisma() prisma: TenantPrismaService,
    @Param('logId') logId: string,
  ) {
    await this.equipmentService.removeUsageLog(prisma, logId);
    return { message: 'Registro de uso removido' };
  }
}
