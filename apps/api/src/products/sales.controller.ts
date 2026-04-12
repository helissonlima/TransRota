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
import { SalesService } from './sales.service';
import { CreateSaleOrderDto } from './dto/sale.dto';

@ApiTags('Vendas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('sale-orders')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar pedidos de venda' })
  list(@TenantPrisma() prisma: TenantPrismaService, @Query('status') status?: string) {
    return this.salesService.list(prisma, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhar pedido de venda' })
  findOne(@TenantPrisma() prisma: TenantPrismaService, @Param('id') id: string) {
    return this.salesService.findOne(prisma, id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Criar pedido de venda' })
  create(@TenantPrisma() prisma: TenantPrismaService, @Body() dto: CreateSaleOrderDto) {
    return this.salesService.create(prisma, dto);
  }

  @Patch(':id/confirm')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Confirmar pedido de venda' })
  confirm(@TenantPrisma() prisma: TenantPrismaService, @Param('id') id: string) {
    return this.salesService.confirm(prisma, id);
  }

  @Patch(':id/deliver')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Entregar pedido (baixa de estoque automática)' })
  deliver(@TenantPrisma() prisma: TenantPrismaService, @Param('id') id: string) {
    return this.salesService.deliver(prisma, id);
  }

  @Patch(':id/cancel')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Cancelar pedido de venda' })
  cancel(@TenantPrisma() prisma: TenantPrismaService, @Param('id') id: string) {
    return this.salesService.cancel(prisma, id);
  }
}
