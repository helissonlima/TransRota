import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TenantPrisma } from '../tenant/tenant.decorator';
import { UserRole, TokenPayload } from '@transrota/shared';
import { TenantPrismaService } from '../core/prisma/tenant-prisma.service';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Criar novo usuário no tenant' })
  create(
    @TenantPrisma() prisma: TenantPrismaService,
    @Body() dto: CreateUserDto,
  ) {
    return this.usersService.create(prisma, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar usuários do tenant' })
  findAll(
    @TenantPrisma() prisma: TenantPrismaService,
    @Query('branchId') branchId?: string,
  ) {
    return this.usersService.findAll(prisma, branchId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  findOne(@TenantPrisma() prisma: TenantPrismaService, @Param('id') id: string) {
    return this.usersService.findOne(prisma, id);
  }

  @Patch(':id/role')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Alterar role do usuário' })
  updateRole(
    @TenantPrisma() prisma: TenantPrismaService,
    @Param('id') id: string,
    @Body() dto: UpdateUserRoleDto,
  ) {
    return this.usersService.updateRole(prisma, id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Desativar usuário' })
  async deactivate(@TenantPrisma() prisma: TenantPrismaService, @Param('id') id: string) {
    await this.usersService.deactivate(prisma, id);
    return { message: 'Usuário desativado' };
  }

  @Patch(':id/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Alterar própria senha' })
  async changePassword(
    @TenantPrisma() prisma: TenantPrismaService,
    @Param('id') id: string,
    @CurrentUser() me: TokenPayload,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    // Só permite alterar a própria senha (a menos que seja ADMIN)
    if (me.sub !== id && me.role !== UserRole.ADMIN) {
      throw new Error('Forbidden');
    }
    await this.usersService.changePassword(prisma, id, body.currentPassword, body.newPassword);
  }
}
