import {
  Body, Controller, Delete, Get, Param,
  Patch, Post, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OilChangeService } from './oil-change.service';
import { CreateOilChangeDto } from './dto/create-oil-change.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { TenantPrisma } from '../tenant/tenant.decorator';
import { UserRole } from '@transrota/shared';
import { TenantPrismaService } from '../core/prisma/tenant-prisma.service';
import { PartialType } from '@nestjs/swagger';

class UpdateOilChangeDto extends PartialType(CreateOilChangeDto) {}

@ApiTags('Fleet - Troca de Óleo')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('vehicles/:vehicleId/oil-changes')
export class OilChangeController {
  constructor(private readonly oilChangeService: OilChangeService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Registrar troca de óleo' })
  create(
    @TenantPrisma() prisma: TenantPrismaService,
    @Param('vehicleId') vehicleId: string,
    @Body() dto: CreateOilChangeDto,
  ) {
    return this.oilChangeService.create(prisma, vehicleId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar trocas de óleo do veículo' })
  findAll(
    @TenantPrisma() prisma: TenantPrismaService,
    @Param('vehicleId') vehicleId: string,
  ) {
    return this.oilChangeService.findAll(prisma, vehicleId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhe da troca de óleo' })
  findOne(
    @TenantPrisma() prisma: TenantPrismaService,
    @Param('id') id: string,
  ) {
    return this.oilChangeService.findOne(prisma, id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Atualizar registro de troca de óleo' })
  update(
    @TenantPrisma() prisma: TenantPrismaService,
    @Param('id') id: string,
    @Body() dto: UpdateOilChangeDto,
  ) {
    return this.oilChangeService.update(prisma, id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Remover registro de troca de óleo' })
  async remove(
    @TenantPrisma() prisma: TenantPrismaService,
    @Param('id') id: string,
  ) {
    await this.oilChangeService.remove(prisma, id);
    return { message: 'Registro removido' };
  }
}
