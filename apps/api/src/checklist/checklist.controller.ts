import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ChecklistService } from './checklist.service';
import { CreateChecklistDto } from './dto/create-checklist.dto';
import { ExecuteChecklistDto } from './dto/execute-checklist.dto';
import { ResolveExecutionDto } from './dto/resolve-execution.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TenantPrisma } from '../tenant/tenant.decorator';
import { UserRole, TokenPayload } from '@transrota/shared';
import { TenantPrismaService } from '../core/prisma/tenant-prisma.service';

@ApiTags('Checklist')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('checklists')
export class ChecklistController {
  constructor(private readonly checklistService: ChecklistService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Criar modelo de checklist' })
  create(@TenantPrisma() prisma: TenantPrismaService, @Body() dto: CreateChecklistDto) {
    return this.checklistService.create(prisma, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar modelos de checklist' })
  findAll(@TenantPrisma() prisma: TenantPrismaService, @Query('type') type?: string) {
    return this.checklistService.findAll(prisma, type);
  }

  @Get('executions')
  @ApiOperation({ summary: 'Histórico de execuções' })
  getExecutions(
    @TenantPrisma() prisma: TenantPrismaService,
    @Query('vehicleId') vehicleId?: string,
    @Query('driverId') driverId?: string,
    @Query('resolutionStatus') resolutionStatus?: string,
  ) {
    return this.checklistService.getExecutions(prisma, vehicleId, driverId, resolutionStatus);
  }

  @Patch('executions/:id/resolve')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Resolver ou aprovar uma execução de checklist' })
  resolveExecution(
    @TenantPrisma() prisma: TenantPrismaService,
    @Param('id') id: string,
    @Body() dto: ResolveExecutionDto,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.checklistService.resolveExecution(prisma, id, dto.status, user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhe do checklist' })
  findOne(@TenantPrisma() prisma: TenantPrismaService, @Param('id') id: string) {
    return this.checklistService.findOne(prisma, id);
  }

  @Post(':id/execute')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.OPERATOR, UserRole.DRIVER)
  @ApiOperation({ summary: 'Executar checklist (preencher)' })
  execute(
    @TenantPrisma() prisma: TenantPrismaService,
    @Param('id') id: string,
    @Body() dto: ExecuteChecklistDto,
  ) {
    return this.checklistService.execute(prisma, id, dto);
  }
}
