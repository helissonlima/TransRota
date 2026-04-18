import { Body, Controller, Get, Param, Post, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { TenantPrisma } from '../tenant/tenant.decorator';
import { TenantPrismaService } from '../core/prisma/tenant-prisma.service';
import { UserRole } from '@transrota/shared';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto, UpdateSupplierDto, LinkSupplierProductDto } from './dto/supplier.dto';

@ApiTags('Fornecedores')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Get()
  @ApiOperation({ summary: 'Listar fornecedores' })
  list(@TenantPrisma() prisma: TenantPrismaService, @Query('includeInactive') includeInactive?: string) {
    return this.suppliersService.list(prisma, includeInactive === 'true');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhar fornecedor' })
  findOne(@TenantPrisma() prisma: TenantPrismaService, @Param('id') id: string) {
    return this.suppliersService.findOne(prisma, id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Criar fornecedor' })
  create(@TenantPrisma() prisma: TenantPrismaService, @Body() dto: CreateSupplierDto) {
    return this.suppliersService.create(prisma, dto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Atualizar fornecedor' })
  update(@TenantPrisma() prisma: TenantPrismaService, @Param('id') id: string, @Body() dto: UpdateSupplierDto) {
    return this.suppliersService.update(prisma, id, dto);
  }

  @Post(':id/products')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Vincular produto ao fornecedor' })
  linkProduct(@TenantPrisma() prisma: TenantPrismaService, @Param('id') id: string, @Body() dto: LinkSupplierProductDto) {
    return this.suppliersService.linkProduct(prisma, id, dto);
  }

  @Delete(':id/products/:productId')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Desvincular produto do fornecedor' })
  unlinkProduct(@TenantPrisma() prisma: TenantPrismaService, @Param('id') id: string, @Param('productId') productId: string) {
    return this.suppliersService.unlinkProduct(prisma, id, productId);
  }

  @Get(':id/products')
  @ApiOperation({ summary: 'Listar produtos do fornecedor' })
  getProducts(@TenantPrisma() prisma: TenantPrismaService, @Param('id') id: string) {
    return this.suppliersService.getSupplierProducts(prisma, id);
  }
}
