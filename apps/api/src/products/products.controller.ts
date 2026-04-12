import {
  Body, Controller, Delete, Get, Param,
  Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { TenantPrisma } from '../tenant/tenant.decorator';
import { TenantPrismaService } from '../core/prisma/tenant-prisma.service';
import { UserRole } from '@transrota/shared';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, CreateCategoryDto } from './dto/product.dto';
import { UpsertBOMDto } from './dto/bom.dto';

@ApiTags('Produtos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // --------- Categories ---------
  @Get('product-categories')
  @ApiOperation({ summary: 'Listar categorias de produtos' })
  listCategories(@TenantPrisma() prisma: TenantPrismaService) {
    return this.productsService.listCategories(prisma);
  }

  @Post('product-categories')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Criar categoria de produto' })
  createCategory(@TenantPrisma() prisma: TenantPrismaService, @Body() dto: CreateCategoryDto) {
    return this.productsService.createCategory(prisma, dto);
  }

  @Delete('product-categories/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Excluir categoria' })
  deleteCategory(@TenantPrisma() prisma: TenantPrismaService, @Param('id') id: string) {
    return this.productsService.deleteCategory(prisma, id);
  }

  // --------- Products ---------
  @Get('products')
  @ApiOperation({ summary: 'Listar produtos' })
  list(
    @TenantPrisma() prisma: TenantPrismaService,
    @Query('type') type?: string,
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
  ) {
    return this.productsService.list(prisma, type, categoryId, search);
  }

  @Get('products/:id')
  @ApiOperation({ summary: 'Detalhar produto' })
  findOne(@TenantPrisma() prisma: TenantPrismaService, @Param('id') id: string) {
    return this.productsService.findOne(prisma, id);
  }

  @Post('products')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Criar produto' })
  create(@TenantPrisma() prisma: TenantPrismaService, @Body() dto: CreateProductDto) {
    return this.productsService.create(prisma, dto);
  }

  @Patch('products/:id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Atualizar produto' })
  update(@TenantPrisma() prisma: TenantPrismaService, @Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(prisma, id, dto);
  }

  @Delete('products/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Desativar produto' })
  remove(@TenantPrisma() prisma: TenantPrismaService, @Param('id') id: string) {
    return this.productsService.remove(prisma, id);
  }

  // --------- BOM (Ficha Técnica) ---------
  @Get('products/:id/bom')
  @ApiOperation({ summary: 'Ver ficha técnica (BOM) do produto' })
  getBOM(@TenantPrisma() prisma: TenantPrismaService, @Param('id') id: string) {
    return this.productsService.getBOM(prisma, id);
  }

  @Post('products/:id/bom')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Criar ou atualizar ficha técnica (BOM)' })
  upsertBOM(@TenantPrisma() prisma: TenantPrismaService, @Param('id') id: string, @Body() dto: UpsertBOMDto) {
    return this.productsService.upsertBOM(prisma, id, dto);
  }
}
