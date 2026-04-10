import { Body, Controller, Delete, Get, Patch, Post, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AdminAuthService } from './admin-auth.service';
import { AdminLoginDto } from './dto/admin-login.dto';

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

  @Patch(':id/toggle')
  @ApiOperation({ summary: 'Ativar/desativar empresa' })
  toggle(@Param('id') id: string) {
    return this.adminAuthService.toggleCompany(id);
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
}

@ApiTags('Admin Users')
@Controller('admin/users')
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
export class AdminPlansController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Get()
  @ApiOperation({ summary: 'Listar planos' })
  list() {
    return this.adminAuthService.listPlans();
  }
}
