import {
  Body, Controller, Delete, Get, Param,
  Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { CreateDriverDocumentDto } from './dto/create-driver-document.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { TenantPrisma } from '../tenant/tenant.decorator';
import { UserRole } from '@transrota/shared';
import { TenantPrismaService } from '../core/prisma/tenant-prisma.service';

@ApiTags('Drivers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Cadastrar motorista' })
  create(@TenantPrisma() prisma: TenantPrismaService, @Body() dto: CreateDriverDto) {
    return this.driversService.create(prisma, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar motoristas' })
  findAll(@TenantPrisma() prisma: TenantPrismaService, @Query('branchId') branchId?: string) {
    return this.driversService.findAll(prisma, branchId);
  }

  @Get('alerts/licenses')
  @ApiOperation({ summary: 'CNHs próximas do vencimento' })
  expiringLicenses(@TenantPrisma() prisma: TenantPrismaService) {
    return this.driversService.getExpiringLicenses(prisma);
  }

  @Get('alerts/documents')
  @ApiOperation({ summary: 'Documentos próximos do vencimento' })
  expiringDocuments(@TenantPrisma() prisma: TenantPrismaService) {
    return this.driversService.getExpiringDocuments(prisma);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhe do motorista' })
  findOne(@TenantPrisma() prisma: TenantPrismaService, @Param('id') id: string) {
    return this.driversService.findOne(prisma, id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Atualizar motorista' })
  update(
    @TenantPrisma() prisma: TenantPrismaService,
    @Param('id') id: string,
    @Body() dto: UpdateDriverDto,
  ) {
    return this.driversService.update(prisma, id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Desativar motorista' })
  async deactivate(@TenantPrisma() prisma: TenantPrismaService, @Param('id') id: string) {
    await this.driversService.deactivate(prisma, id);
    return { message: 'Motorista desativado' };
  }

  @Post(':id/documents')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Adicionar documento ao motorista' })
  addDocument(
    @TenantPrisma() prisma: TenantPrismaService,
    @Param('id') id: string,
    @Body() dto: CreateDriverDocumentDto,
  ) {
    return this.driversService.addDocument(prisma, id, dto);
  }

  @Get(':id/documents')
  @ApiOperation({ summary: 'Documentos do motorista' })
  async getDocuments(@TenantPrisma() prisma: TenantPrismaService, @Param('id') id: string) {
    const driver = await this.driversService.findOne(prisma, id);
    return driver.documents;
  }
}
