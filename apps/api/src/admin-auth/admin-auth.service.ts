import { Injectable, UnauthorizedException, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { MasterPrismaService } from '../core/prisma/master-prisma.service';
import { TenantPrismaFactory } from '../core/prisma/tenant-prisma.factory';
import { UserRole } from '@transrota/shared';
import { CreatePlanDto, UpdatePlanDto } from './dto/plan.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UpdatePaymentSettingsDto } from './dto/payment-settings.dto';

const execFileAsync = promisify(execFile);

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

  // ── Company Features (módulos habilitados) ────────────────────────────────

  async getCompanyFeatures(id: string) {
    const company = await this.masterPrisma.company.findUnique({
      where: { id },
      select: { id: true, name: true, features: true },
    });
    if (!company) throw new NotFoundException('Empresa não encontrada');
    return company;
  }

  async setCompanyFeatures(id: string, features: string[]) {
    const company = await this.masterPrisma.company.findUnique({ where: { id } });
    if (!company) throw new NotFoundException('Empresa não encontrada');
    return this.masterPrisma.company.update({
      where: { id },
      data: { features },
      select: { id: true, name: true, features: true },
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

  // ── Plan CRUD ─────────────────────────────────────────────────────────────

  async createPlan(dto: CreatePlanDto) {
    return this.masterPrisma.plan.create({
      data: {
        name: dto.name,
        type: dto.type as any,
        maxVehicles: dto.maxVehicles,
        maxDrivers: dto.maxDrivers,
        maxUsers: dto.maxUsers,
        maxBranches: dto.maxBranches,
        storageGb: dto.storageGb,
        priceMonthly: dto.priceMonthly,
      },
    });
  }

  async updatePlan(id: string, dto: UpdatePlanDto) {
    const plan = await this.masterPrisma.plan.findUnique({ where: { id } });
    if (!plan) throw new NotFoundException('Plano não encontrado');
    return this.masterPrisma.plan.update({
      where: { id },
      data: dto as any,
    });
  }

  async deletePlan(id: string) {
    const plan = await this.masterPrisma.plan.findUnique({
      where: { id },
      include: { _count: { select: { companies: true } } },
    });
    if (!plan) throw new NotFoundException('Plano não encontrado');
    if (plan._count.companies > 0) {
      // Não deleta, desativa
      return this.masterPrisma.plan.update({
        where: { id },
        data: { isActive: false },
      });
    }
    return this.masterPrisma.plan.delete({ where: { id } });
  }

  // ── Company Update ────────────────────────────────────────────────────────

  async updateCompany(id: string, dto: UpdateCompanyDto) {
    const company = await this.masterPrisma.company.findUnique({ where: { id } });
    if (!company) throw new NotFoundException('Empresa não encontrada');
    return this.masterPrisma.company.update({
      where: { id },
      data: dto as any,
      include: { plan: true },
    });
  }

  async deleteCompanyPermanently(id: string) {
    const company = await this.masterPrisma.company.findUnique({
      where: { id },
      include: {
        billingCustomer: {
          select: { id: true },
        },
      },
    });

    if (!company) throw new NotFoundException('Empresa não encontrada');

    // Remove dados do tenant primeiro. Se falhar aqui, nada do master é apagado.
    try {
      await this.masterPrisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${company.schemaName}" CASCADE`);
    } catch {
      throw new InternalServerErrorException('Não foi possível remover os dados do tenant desta empresa');
    }

    await this.masterPrisma.$transaction(async (tx) => {
      if (company.billingCustomer?.id) {
        await tx.invoice.deleteMany({ where: { billingCustomerId: company.billingCustomer.id } });
        await tx.billingSubscription.deleteMany({ where: { billingCustomerId: company.billingCustomer.id } });
        await tx.billingCustomer.delete({ where: { id: company.billingCustomer.id } });
      }

      await tx.adminNotification.deleteMany({ where: { companyId: id } });
      await tx.masterAuditLog.deleteMany({ where: { companyId: id } });
      await tx.subscription.deleteMany({ where: { companyId: id } });
      await tx.company.delete({ where: { id } });
    });

    return { message: 'Empresa removida permanentemente' };
  }

  // ── Notifications ─────────────────────────────────────────────────────────

  async listNotifications(limit = 50) {
    return this.masterPrisma.adminNotification.findMany({
      orderBy: { createdAt: 'desc' },
      take: Number(limit) || 50,
      include: {
        company: { select: { name: true } },
      },
    });
  }

  async markNotificationRead(id: string) {
    return this.masterPrisma.adminNotification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAllNotificationsRead() {
    await this.masterPrisma.adminNotification.updateMany({
      where: { isRead: false },
      data: { isRead: true },
    });
    return { message: 'Todas as notificações marcadas como lidas' };
  }

  async getUnreadCount() {
    const count = await this.masterPrisma.adminNotification.count({
      where: { isRead: false },
    });
    return { count };
  }

  // ── Payment Settings ───────────────────────────────────────────────────────

  async getPaymentSettings() {
    const settings = await this.masterPrisma.paymentGatewaySettings.findUnique({
      where: { singletonKey: 'default' },
    });

    if (settings) return settings;

    return {
      provider: 'ASAAS',
      environment: 'SANDBOX',
      asaasApiKey: '',
      asaasWalletId: '',
      asaasWebhookToken: '',
      sicoobClientId: '',
      sicoobClientSecret: '',
      sicoobCertificateBase64: '',
      sicoobPixKey: '',
      isActive: true,
    };
  }

  async updatePaymentSettings(dto: UpdatePaymentSettingsDto) {
    return this.masterPrisma.paymentGatewaySettings.upsert({
      where: { singletonKey: 'default' },
      create: {
        singletonKey: 'default',
        provider: dto.provider as any,
        environment: dto.environment as any,
        asaasApiKey: dto.asaasApiKey?.trim() || null,
        asaasWalletId: dto.asaasWalletId?.trim() || null,
        asaasWebhookToken: dto.asaasWebhookToken?.trim() || null,
        sicoobClientId: dto.sicoobClientId?.trim() || null,
        sicoobClientSecret: dto.sicoobClientSecret?.trim() || null,
        sicoobCertificateBase64: dto.sicoobCertificateBase64?.trim() || null,
        sicoobPixKey: dto.sicoobPixKey?.trim() || null,
        isActive: dto.isActive ?? true,
      },
      update: {
        provider: dto.provider as any,
        environment: dto.environment as any,
        asaasApiKey: dto.asaasApiKey?.trim() || null,
        asaasWalletId: dto.asaasWalletId?.trim() || null,
        asaasWebhookToken: dto.asaasWebhookToken?.trim() || null,
        sicoobClientId: dto.sicoobClientId?.trim() || null,
        sicoobClientSecret: dto.sicoobClientSecret?.trim() || null,
        sicoobCertificateBase64: dto.sicoobCertificateBase64?.trim() || null,
        sicoobPixKey: dto.sicoobPixKey?.trim() || null,
        isActive: dto.isActive ?? true,
      },
    });
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

    const payload = { sub: admin.id, email: admin.email, role: UserRole.SUPER_ADMIN };

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
      user: { id: admin.id, email: admin.email, name: admin.name, role: UserRole.SUPER_ADMIN },
    };
  }

  async createFullBackup() {
    const databaseUrl = this.config.get<string>('DATABASE_MASTER_URL');
    if (!databaseUrl) {
      throw new NotFoundException('DATABASE_MASTER_URL não configurada');
    }

    const backupDir = '/tmp/transrota-backups';
    await mkdir(backupDir, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `transrota-full-backup-${timestamp}.sql`;
    const filePath = join(backupDir, fileName);

    await execFileAsync('pg_dump', [
      '--format=plain',
      '--no-owner',
      '--no-privileges',
      '--file',
      filePath,
      databaseUrl,
    ]);

    return { fileName, filePath };
  }
}
