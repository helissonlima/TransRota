import {
  Body, Controller, Get, Param, Post, Query, UseGuards, Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { TenantPrisma } from '../tenant/tenant.decorator';
import { TenantPrismaService } from '../core/prisma/tenant-prisma.service';
import { UserRole } from '@transrota/shared';
import { ProductionService } from './production.service';
import { CreateProductionOrderDto } from './dto/production.dto';

@ApiTags('Produção')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('production-orders')
export class ProductionController {
  constructor(private readonly productionService: ProductionService) {}

  @Get()
  @ApiOperation({ summary: 'Listar ordens de produção' })
  list(@TenantPrisma() prisma: TenantPrismaService, @Query('status') status?: string) {
    return this.productionService.list(prisma, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhar ordem de produção' })
  findOne(@TenantPrisma() prisma: TenantPrismaService, @Param('id') id: string) {
    return this.productionService.findOne(prisma, id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Criar ordem de produção' })
  create(@TenantPrisma() prisma: TenantPrismaService, @Body() dto: CreateProductionOrderDto) {
    return this.productionService.create(prisma, dto);
  }

  @Patch(':id/start')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Iniciar ordem de produção' })
  start(@TenantPrisma() prisma: TenantPrismaService, @Param('id') id: string) {
    return this.productionService.start(prisma, id);
  }

  @Patch(':id/complete')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Concluir ordem de produção (baixa automática de componentes)' })
  complete(@TenantPrisma() prisma: TenantPrismaService, @Param('id') id: string) {
    return this.productionService.complete(prisma, id);
  }

  @Patch(':id/cancel')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Cancelar ordem de produção' })
  cancel(@TenantPrisma() prisma: TenantPrismaService, @Param('id') id: string) {
    return this.productionService.cancel(prisma, id);
  }
}
