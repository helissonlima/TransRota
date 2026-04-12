import { Body, Controller, Delete, Get, Patch, Post, Put, Param, HttpCode, HttpStatus, UseGuards, Res, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { unlink } from 'node:fs/promises';
import { AdminAuthService } from './admin-auth.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { CreatePlanDto, UpdatePlanDto } from './dto/plan.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UpdatePaymentSettingsDto } from './dto/payment-settings.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SuperAdminGuard } from './guards/super-admin.guard';

@ApiTags('Admin Auth')
@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login do Super Admin (sem x-tenant-id)' })
  login(@Body() dto: AdminLoginDto) {
    return this.adminAuthService.login(dto.email, dto.password);
  }
}

@ApiTags('Admin Companies')
@Controller('admin/companies')
@UseGuards(JwtAuthGuard, SuperAdminGuard)
export class AdminCompaniesController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as empresas (super admin)' })
  list() {
    return this.adminAuthService.listCompanies();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhes da empresa' })
  findOne(@Param('id') id: string) {
    return this.adminAuthService.getCompany(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar empresa' })
  update(@Param('id') id: string, @Body() dto: UpdateCompanyDto) {
    return this.adminAuthService.updateCompany(id, dto);
  }

  @Patch(':id/toggle')
  @ApiOperation({ summary: 'Ativar/desativar empresa' })
  toggle(@Param('id') id: string) {
    return this.adminAuthService.toggleCompany(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir empresa permanentemente (somente para ambiente controlado)' })
  remove(@Param('id') id: string) {
    return this.adminAuthService.deleteCompanyPermanently(id);
  }

  @Get(':id/users')
  @ApiOperation({ summary: 'Listar usuários da empresa' })
  listUsers(@Param('id') id: string) {
    return this.adminAuthService.listCompanyUsers(id);
  }

  @Post(':id/users')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar usuário na empresa' })
  createUser(@Param('id') id: string, @Body() dto: { name: string; email: string; password: string; role: string }) {
    return this.adminAuthService.createCompanyUser(id, dto);
  }

  @Delete(':id/users/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Desativar usuário da empresa' })
  deactivateUser(@Param('id') id: string, @Param('userId') userId: string) {
    return this.adminAuthService.deactivateCompanyUser(id, userId);
  }

  @Get(':id/features')
  @ApiOperation({ summary: 'Listar features habilitadas para a empresa' })
  getFeatures(@Param('id') id: string) {
    return this.adminAuthService.getCompanyFeatures(id);
  }

  @Put(':id/features')
  @ApiOperation({ summary: 'Atualizar features habilitadas para a empresa' })
  setFeatures(@Param('id') id: string, @Body() body: { features: string[] }) {
    return this.adminAuthService.setCompanyFeatures(id, body.features);
  }
}

@ApiTags('Admin Users')
@Controller('admin/users')
@UseGuards(JwtAuthGuard, SuperAdminGuard)
export class AdminUsersController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Get()
  @ApiOperation({ summary: 'Listar super admins' })
  list() {
    return this.adminAuthService.listAdmins();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar novo super admin' })
  create(@Body() dto: { name: string; email: string; password: string }) {
    return this.adminAuthService.createAdmin(dto);
  }
}

@ApiTags('Admin Plans')
@Controller('admin/plans')
@UseGuards(JwtAuthGuard, SuperAdminGuard)
export class AdminPlansController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Get()
  @ApiOperation({ summary: 'Listar planos' })
  list() {
    return this.adminAuthService.listPlans();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar plano' })
  create(@Body() dto: CreatePlanDto) {
    return this.adminAuthService.createPlan(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar plano' })
  update(@Param('id') id: string, @Body() dto: UpdatePlanDto) {
    return this.adminAuthService.updatePlan(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir/desativar plano' })
  remove(@Param('id') id: string) {
    return this.adminAuthService.deletePlan(id);
  }
}

@ApiTags('Admin Notifications')
@Controller('admin/notifications')
@UseGuards(JwtAuthGuard, SuperAdminGuard)
export class AdminNotificationsController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Get()
  @ApiOperation({ summary: 'Listar notificações' })
  list(@Query('limit') limit?: number) {
    return this.adminAuthService.listNotifications(limit ?? 50);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Quantidade de notificações não lidas' })
  unreadCount() {
    return this.adminAuthService.getUnreadCount();
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Marcar notificação como lida' })
  markRead(@Param('id') id: string) {
    return this.adminAuthService.markNotificationRead(id);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Marcar todas como lidas' })
  markAllRead() {
    return this.adminAuthService.markAllNotificationsRead();
  }
}

@ApiTags('Admin Operations')
@Controller('admin/ops')
@UseGuards(JwtAuthGuard, SuperAdminGuard)
export class AdminOperationsController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Get('backup/full')
  @ApiOperation({ summary: 'Gerar e baixar backup completo do banco' })
  async downloadFullBackup(@Res() res: Response) {
    const { fileName, filePath } = await this.adminAuthService.createFullBackup();

    res.download(filePath, fileName, async () => {
      await unlink(filePath).catch(() => undefined);
    });
  }
}

@ApiTags('Admin Settings')
@Controller('admin/settings')
@UseGuards(JwtAuthGuard, SuperAdminGuard)
export class AdminSettingsController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Get('payment')
  @ApiOperation({ summary: 'Obter configuração global de gateway de pagamento' })
  getPaymentSettings() {
    return this.adminAuthService.getPaymentSettings();
  }

  @Patch('payment')
  @ApiOperation({ summary: 'Atualizar configuração global de gateway de pagamento' })
  updatePaymentSettings(@Body() dto: UpdatePaymentSettingsDto) {
    return this.adminAuthService.updatePaymentSettings(dto);
  }
}
