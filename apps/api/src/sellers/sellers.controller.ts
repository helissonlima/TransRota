import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { TenantPrisma } from '../tenant/tenant.decorator';
import { TenantPrismaService } from '../core/prisma/tenant-prisma.service';
import { UserRole } from '@transrota/shared';
import { SellersService } from './sellers.service';
import { CreateSellerDto, UpdateSellerDto } from './dto/seller.dto';

@ApiTags('Vendedores')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('sellers')
export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  @Get()
  @ApiOperation({ summary: 'Listar vendedores' })
  list(@TenantPrisma() prisma: TenantPrismaService, @Query('includeInactive') includeInactive?: string) {
    return this.sellersService.list(prisma, includeInactive === 'true');
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Dashboard de vendedores' })
  dashboard(@TenantPrisma() prisma: TenantPrismaService) {
    return this.sellersService.dashboard(prisma);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhar vendedor' })
  findOne(@TenantPrisma() prisma: TenantPrismaService, @Param('id') id: string) {
    return this.sellersService.findOne(prisma, id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Criar vendedor' })
  create(@TenantPrisma() prisma: TenantPrismaService, @Body() dto: CreateSellerDto) {
    return this.sellersService.create(prisma, dto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Atualizar vendedor' })
  update(@TenantPrisma() prisma: TenantPrismaService, @Param('id') id: string, @Body() dto: UpdateSellerDto) {
    return this.sellersService.update(prisma, id, dto);
  }
}
