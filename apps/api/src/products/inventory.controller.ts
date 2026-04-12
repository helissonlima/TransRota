import {
  Body, Controller, Get, Post, Query, UseGuards, Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { TenantPrisma } from '../tenant/tenant.decorator';
import { TenantPrismaService } from '../core/prisma/tenant-prisma.service';
import { InventoryService } from './inventory.service';
import { CreateStockMovementDto } from './dto/inventory.dto';

@ApiTags('Estoque')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('stock')
  @ApiOperation({ summary: 'Estoque atual por produto/localização' })
  getCurrentStock(
    @TenantPrisma() prisma: TenantPrismaService,
    @Query('productId') productId?: string,
    @Query('locationId') locationId?: string,
  ) {
    return this.inventoryService.getCurrentStock(prisma, productId, locationId);
  }

  @Get('stock/alerts')
  @ApiOperation({ summary: 'Alertas de estoque baixo' })
  getLowStockAlerts(@TenantPrisma() prisma: TenantPrismaService) {
    return this.inventoryService.getLowStockAlerts(prisma);
  }

  @Get('movements')
  @ApiOperation({ summary: 'Histórico de movimentações' })
  listMovements(
    @TenantPrisma() prisma: TenantPrismaService,
    @Query('productId') productId?: string,
    @Query('type') type?: string,
    @Query('limit') limit?: string,
  ) {
    return this.inventoryService.listMovements(prisma, productId, type, limit ? Number(limit) : 100);
  }

  @Post('movements')
  @ApiOperation({ summary: 'Registrar movimentação de estoque' })
  createMovement(
    @TenantPrisma() prisma: TenantPrismaService,
    @Body() dto: CreateStockMovementDto,
    @Request() req: any,
  ) {
    return this.inventoryService.createMovement(prisma, dto, req.user?.id);
  }

  @Get('locations')
  @ApiOperation({ summary: 'Listar localizações de estoque' })
  listLocations(@TenantPrisma() prisma: TenantPrismaService) {
    return this.inventoryService.listLocations(prisma);
  }

  @Post('locations')
  @ApiOperation({ summary: 'Criar localização de estoque' })
  createLocation(
    @TenantPrisma() prisma: TenantPrismaService,
    @Body() body: { name: string; description?: string },
  ) {
    return this.inventoryService.createLocation(prisma, body.name, body.description);
  }
}
