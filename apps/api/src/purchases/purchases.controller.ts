import { Body, Controller, Get, Param, Post, Query, UseGuards, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { TenantPrisma } from '../tenant/tenant.decorator';
import { TenantPrismaService } from '../core/prisma/tenant-prisma.service';
import { UserRole } from '@transrota/shared';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseOrderDto, ReceivePurchaseDto } from './dto/purchase.dto';

@ApiTags('Compras')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('purchase-orders')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar ordens de compra' })
  list(@TenantPrisma() prisma: TenantPrismaService, @Query('status') status?: string, @Query('supplierId') supplierId?: string) {
    return this.purchasesService.list(prisma, status, supplierId);
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Dashboard de compras' })
  dashboard(@TenantPrisma() prisma: TenantPrismaService) {
    return this.purchasesService.dashboard(prisma);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhar ordem de compra' })
  findOne(@TenantPrisma() prisma: TenantPrismaService, @Param('id') id: string) {
    return this.purchasesService.findOne(prisma, id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Criar ordem de compra' })
  create(@TenantPrisma() prisma: TenantPrismaService, @Body() dto: CreatePurchaseOrderDto) {
    return this.purchasesService.create(prisma, dto);
  }

  @Patch(':id/confirm')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Confirmar ordem de compra' })
  confirm(@TenantPrisma() prisma: TenantPrismaService, @Param('id') id: string) {
    return this.purchasesService.confirm(prisma, id);
  }

  @Patch(':id/receive')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Receber itens (entrada automática no estoque)' })
  receive(@TenantPrisma() prisma: TenantPrismaService, @Param('id') id: string, @Body() dto: ReceivePurchaseDto) {
    return this.purchasesService.receive(prisma, id, dto);
  }

  @Patch(':id/cancel')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Cancelar ordem de compra' })
  cancel(@TenantPrisma() prisma: TenantPrismaService, @Param('id') id: string) {
    return this.purchasesService.cancel(prisma, id);
  }
}
