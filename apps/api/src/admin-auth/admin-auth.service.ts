import { Injectable, UnauthorizedException, NotFoundException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { MasterPrismaService } from '../core/prisma/master-prisma.service';
import { TenantPrismaFactory } from '../core/prisma/tenant-prisma.factory';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly masterPrisma: MasterPrismaService,
    private readonly tenantFactory: TenantPrismaFactory,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async listCompanies() {
    return this.masterPrisma.company.findMany({
      include: { plan: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async toggleCompany(id: string) {
    const company = await this.masterPrisma.company.findUniqueOrThrow({ where: { id } });
    return this.masterPrisma.company.update({
      where: { id },
      data: { isActive: !company.isActive },
      include: { plan: true },
    });
  }

  async listAdmins() {
    return this.masterPrisma.superAdmin.findMany({
      select: { id: true, name: true, email: true, isActive: true, lastLoginAt: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async listPlans() {
    return this.masterPrisma.plan.findMany({ orderBy: { priceMonthly: 'asc' } });
  }

  async getCompany(id: string) {
    const company = await this.masterPrisma.company.findUnique({
      where: { id },
      include: { plan: true },
    });
    if (!company) throw new NotFoundException('Empresa não encontrada');
    return company;
  }

  private async getCompanySchema(id: string) {
    const company = await this.masterPrisma.company.findUnique({ where: { id }, select: { schemaName: true } });
    if (!company) throw new NotFoundException('Empresa não encontrada');
    return company.schemaName;
  }

  async listCompanyUsers(companyId: string) {
    const schema = await this.getCompanySchema(companyId);
    const prisma = await this.tenantFactory.getClient(schema);
    return prisma.user.findMany({
      where: { isActive: true },
      select: { id: true, name: true, email: true, role: true, lastLoginAt: true, createdAt: true },
      orderBy: { name: 'asc' },
    });
  }

  async createCompanyUser(companyId: string, dto: { name: string; email: string; password: string; role: string }) {
    const schema = await this.getCompanySchema(companyId);
    const prisma = await this.tenantFactory.getClient(schema);
    const existing = await prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('E-mail já cadastrado nesta empresa');
    const passwordHash = await bcrypt.hash(dto.password, 12);
    return prisma.user.create({
      data: { name: dto.name, email: dto.email, passwordHash, role: dto.role as any },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
  }

  async deactivateCompanyUser(companyId: string, userId: string) {
    const schema = await this.getCompanySchema(companyId);
    const prisma = await this.tenantFactory.getClient(schema);
    await prisma.user.update({ where: { id: userId }, data: { isActive: false } });
  }

  async createAdmin(dto: { name: string; email: string; password: string }) {
    const existing = await this.masterPrisma.superAdmin.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('E-mail já cadastrado');
    const passwordHash = await bcrypt.hash(dto.password, 12);
    return this.masterPrisma.superAdmin.create({
      data: { name: dto.name, email: dto.email, passwordHash },
      select: { id: true, name: true, email: true, isActive: true, createdAt: true },
    });
  }

  async login(email: string, password: string) {
    const admin = await this.masterPrisma.superAdmin.findUnique({ where: { email } });
    if (!admin || !admin.isActive) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { sub: admin.id, email: admin.email, role: 'SUPERADMIN' };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    const refreshHash = await bcrypt.hash(refreshToken, 10);
    await this.masterPrisma.superAdmin.update({
      where: { id: admin.id },
      data: { refreshTokenHash: refreshHash, lastLoginAt: new Date() },
    });

    return {
      accessToken,
      refreshToken,
      user: { id: admin.id, email: admin.email, name: admin.name, role: 'SUPERADMIN' },
    };
  }
}
