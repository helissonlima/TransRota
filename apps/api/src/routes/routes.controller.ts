import {
  Body, Controller, Get, Param, Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RoutesService } from './routes.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateStopStatusDto } from './dto/update-stop-status.dto';
import { AddDeliveryProofDto } from './dto/add-delivery-proof.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { TenantPrisma } from '../tenant/tenant.decorator';
import { UserRole } from '@transrota/shared';
import { TenantPrismaService } from '../core/prisma/tenant-prisma.service';

@ApiTags('Routes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)
  @ApiOperation({ summary: 'Criar rota com paradas e itens' })
  create(@TenantPrisma() prisma: TenantPrismaService, @Body() dto: CreateRouteDto) {
    return this.routesService.create(prisma, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar rotas' })
  findAll(
    @TenantPrisma() prisma: TenantPrismaService,
    @Query('branchId') branchId?: string,
    @Query('status') status?: string,
  ) {
    return this.routesService.findAll(prisma, branchId, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhe completo da rota' })
  findOne(@TenantPrisma() prisma: TenantPrismaService, @Param('id') id: string) {
    return this.routesService.findOne(prisma, id);
  }

  @Patch(':id/start')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR, UserRole.DRIVER)
  @ApiOperation({ summary: 'Iniciar rota' })
  start(@TenantPrisma() prisma: TenantPrismaService, @Param('id') id: string) {
    return this.routesService.start(prisma, id);
  }

  @Patch(':id/complete')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR)
  @ApiOperation({ summary: 'Finalizar rota manualmente' })
  complete(@TenantPrisma() prisma: TenantPrismaService, @Param('id') id: string) {
    return this.routesService.complete(prisma, id);
  }

  @Patch(':id/cancel')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Cancelar rota' })
  cancel(@TenantPrisma() prisma: TenantPrismaService, @Param('id') id: string) {
    return this.routesService.cancel(prisma, id);
  }

  @Patch(':id/stops/:stopId/status')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR, UserRole.DRIVER)
  @ApiOperation({ summary: 'Atualizar status de uma parada' })
  updateStopStatus(
    @TenantPrisma() prisma: TenantPrismaService,
    @Param('id') id: string,
    @Param('stopId') stopId: string,
    @Body() dto: UpdateStopStatusDto,
  ) {
    return this.routesService.updateStopStatus(prisma, id, stopId, dto);
  }

  @Post(':id/stops/:stopId/proof')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR, UserRole.DRIVER)
  @ApiOperation({ summary: 'Adicionar comprovante de entrega' })
  addProof(
    @TenantPrisma() prisma: TenantPrismaService,
    @Param('id') id: string,
    @Param('stopId') stopId: string,
    @Body() dto: AddDeliveryProofDto,
  ) {
    return this.routesService.addProof(prisma, id, stopId, dto);
  }
}
