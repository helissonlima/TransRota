import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { TenantPrismaService } from '../core/prisma/tenant-prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Injectable()
export class UsersService {
  async create(prisma: TenantPrismaService, dto: CreateUserDto) {
    const existing = await prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('E-mail já cadastrado');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash,
        role: dto.role as any,
        branchId: dto.branchId,
      },
      select: { id: true, name: true, email: true, role: true, branchId: true, createdAt: true },
    });
    return user;
  }

  async findAll(prisma: TenantPrismaService, branchId?: string) {
    return prisma.user.findMany({
      where: { isActive: true, ...(branchId ? { branchId } : {}) },
      select: { id: true, name: true, email: true, role: true, branchId: true, lastLoginAt: true, createdAt: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(prisma: TenantPrismaService, id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, branchId: true, createdAt: true },
    });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async updateRole(prisma: TenantPrismaService, id: string, dto: UpdateUserRoleDto) {
    await this.findOne(prisma, id);
    return prisma.user.update({
      where: { id },
      data: { role: dto.role as any, branchId: dto.branchId },
      select: { id: true, name: true, email: true, role: true, branchId: true },
    });
  }

  async deactivate(prisma: TenantPrismaService, id: string) {
    await this.findOne(prisma, id);
    await prisma.user.update({ where: { id }, data: { isActive: false } });
  }

  async changePassword(prisma: TenantPrismaService, id: string, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) throw new ConflictException('Senha atual incorreta');
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id }, data: { passwordHash } });
  }
}
