import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcryptjs";
import AdmZip = require("adm-zip");
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { execFile, execFileSync } from "node:child_process";
import { promisify } from "node:util";
import * as path from "node:path";
import { MasterPrismaService } from "../core/prisma/master-prisma.service";
import { TenantPrismaFactory } from "../core/prisma/tenant-prisma.factory";
import { UserRole } from "@transrota/shared";
import { CreatePlanDto, UpdatePlanDto } from "./dto/plan.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { UpdatePaymentSettingsDto } from "./dto/payment-settings.dto";

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
      orderBy: { createdAt: "desc" },
    });
  }

  async toggleCompany(id: string) {
    const company = await this.masterPrisma.company.findUniqueOrThrow({
      where: { id },
    });
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
    if (!company) throw new NotFoundException("Empresa não encontrada");
    return company;
  }

  async setCompanyFeatures(id: string, features: string[]) {
    const company = await this.masterPrisma.company.findUnique({
      where: { id },
    });
    if (!company) throw new NotFoundException("Empresa não encontrada");
    return this.masterPrisma.company.update({
      where: { id },
      data: { features },
      select: { id: true, name: true, features: true },
    });
  }

  async listAdmins() {
    return this.masterPrisma.superAdmin.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async listPlans() {
    return this.masterPrisma.plan.findMany({
      orderBy: { priceMonthly: "asc" },
    });
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
    if (!plan) throw new NotFoundException("Plano não encontrado");
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
    if (!plan) throw new NotFoundException("Plano não encontrado");
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
    const company = await this.masterPrisma.company.findUnique({
      where: { id },
    });
    if (!company) throw new NotFoundException("Empresa não encontrada");
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

    if (!company) throw new NotFoundException("Empresa não encontrada");

    // Remove dados do tenant primeiro. Se falhar aqui, nada do master é apagado.
    try {
      await this.masterPrisma.$executeRawUnsafe(
        `DROP SCHEMA IF EXISTS "${company.schemaName}" CASCADE`,
      );
    } catch {
      throw new InternalServerErrorException(
        "Não foi possível remover os dados do tenant desta empresa",
      );
    }

    await this.masterPrisma.$transaction(async (tx) => {
      if (company.billingCustomer?.id) {
        await tx.invoice.deleteMany({
          where: { billingCustomerId: company.billingCustomer.id },
        });
        await tx.billingSubscription.deleteMany({
          where: { billingCustomerId: company.billingCustomer.id },
        });
        await tx.billingCustomer.delete({
          where: { id: company.billingCustomer.id },
        });
      }

      await tx.adminNotification.deleteMany({ where: { companyId: id } });
      await tx.masterAuditLog.deleteMany({ where: { companyId: id } });
      await tx.subscription.deleteMany({ where: { companyId: id } });
      await tx.company.delete({ where: { id } });
    });

    return { message: "Empresa removida permanentemente" };
  }

  // ── Notifications ─────────────────────────────────────────────────────────

  async listNotifications(limit = 50) {
    return this.masterPrisma.adminNotification.findMany({
      orderBy: { createdAt: "desc" },
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
    return { message: "Todas as notificações marcadas como lidas" };
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
      where: { singletonKey: "default" },
    });

    if (settings) return settings;

    return {
      provider: "ASAAS",
      environment: "SANDBOX",
      asaasApiKey: "",
      asaasWalletId: "",
      asaasWebhookToken: "",
      sicoobClientId: "",
      sicoobClientSecret: "",
      sicoobCertificateBase64: "",
      sicoobPixKey: "",
      isActive: true,
    };
  }

  async updatePaymentSettings(dto: UpdatePaymentSettingsDto) {
    return this.masterPrisma.paymentGatewaySettings.upsert({
      where: { singletonKey: "default" },
      create: {
        singletonKey: "default",
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
    if (!company) throw new NotFoundException("Empresa não encontrada");
    return company;
  }

  private async getCompanySchema(id: string) {
    const company = await this.masterPrisma.company.findUnique({
      where: { id },
      select: { schemaName: true },
    });
    if (!company) throw new NotFoundException("Empresa não encontrada");
    return company.schemaName;
  }

  async listCompanyUsers(companyId: string) {
    const schema = await this.getCompanySchema(companyId);
    const prisma = await this.tenantFactory.getClient(schema);
    return prisma.user.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        lastLoginAt: true,
        createdAt: true,
      },
      orderBy: { name: "asc" },
    });
  }

  async createCompanyUser(
    companyId: string,
    dto: { name: string; email: string; password: string; role: string },
  ) {
    const schema = await this.getCompanySchema(companyId);
    const prisma = await this.tenantFactory.getClient(schema);
    const existing = await prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing)
      throw new ConflictException("E-mail já cadastrado nesta empresa");
    const passwordHash = await bcrypt.hash(dto.password, 12);
    return prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash,
        role: dto.role as any,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async deactivateCompanyUser(companyId: string, userId: string) {
    const schema = await this.getCompanySchema(companyId);
    const prisma = await this.tenantFactory.getClient(schema);
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });
  }

  async createAdmin(dto: { name: string; email: string; password: string }) {
    const existing = await this.masterPrisma.superAdmin.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException("E-mail já cadastrado");
    const passwordHash = await bcrypt.hash(dto.password, 12);
    return this.masterPrisma.superAdmin.create({
      data: { name: dto.name, email: dto.email, passwordHash },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  async login(email: string, password: string) {
    const admin = await this.masterPrisma.superAdmin.findUnique({
      where: { email },
    });
    if (!admin || !admin.isActive) {
      throw new UnauthorizedException("Credenciais inválidas");
    }

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) {
      throw new UnauthorizedException("Credenciais inválidas");
    }

    const payload = {
      sub: admin.id,
      email: admin.email,
      role: UserRole.SUPER_ADMIN,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: "8h" });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.getOrThrow("JWT_REFRESH_SECRET"),
      expiresIn: "7d",
    });

    const refreshHash = await bcrypt.hash(refreshToken, 10);
    await this.masterPrisma.superAdmin.update({
      where: { id: admin.id },
      data: { refreshTokenHash: refreshHash, lastLoginAt: new Date() },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: UserRole.SUPER_ADMIN,
      },
    };
  }

  async refreshAdmin(adminId: string, refreshToken: string) {
    const admin = await this.masterPrisma.superAdmin.findUnique({
      where: { id: adminId },
    });
    if (!admin || !admin.isActive || !admin.refreshTokenHash) {
      throw new ForbiddenException("Refresh token inválido");
    }

    const valid = await bcrypt.compare(refreshToken, admin.refreshTokenHash);
    if (!valid) {
      throw new ForbiddenException("Refresh token inválido");
    }

    const payload = {
      sub: admin.id,
      email: admin.email,
      role: UserRole.SUPER_ADMIN,
    };
    const newAccessToken = this.jwtService.sign(payload, { expiresIn: "8h" });
    const newRefreshToken = this.jwtService.sign(payload, {
      secret: this.config.getOrThrow("JWT_REFRESH_SECRET"),
      expiresIn: "7d",
    });

    const refreshHash = await bcrypt.hash(newRefreshToken, 10);
    await this.masterPrisma.superAdmin.update({
      where: { id: admin.id },
      data: { refreshTokenHash: refreshHash },
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async createFullBackup(): Promise<{ fileName: string; filePath: string }> {
    // Exporta schema master (public) ─────────────────────────────────────────
    const masterTables = await this.masterPrisma.$queryRawUnsafe<
      { table_name: string }[]
    >(
      `SELECT table_name FROM information_schema.tables
       WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
       ORDER BY table_name`,
    );
    const masterData: Record<string, unknown[]> = {};
    for (const { table_name } of masterTables) {
      masterData[table_name] = await this.masterPrisma.$queryRawUnsafe<
        unknown[]
      >(`SELECT * FROM "public"."${table_name}"`);
    }

    // Exporta cada schema de tenant ──────────────────────────────────────────
    const companies = await this.masterPrisma.company.findMany({
      select: { id: true, name: true, schemaName: true },
    });

    if (companies.length === 0) {
      throw new BadRequestException(
        "Não há empresas cadastradas para gerar backup completo.",
      );
    }

    const tenantsData: Record<
      string,
      { tables: Record<string, unknown[]>; tableNames: string[] }
    > = {};
    for (const company of companies) {
      const { schemaName } = company;
      const tenantTables = await this.masterPrisma.$queryRawUnsafe<
        { table_name: string }[]
      >(
        `SELECT table_name FROM information_schema.tables
         WHERE table_schema = $1 AND table_type = 'BASE TABLE'
         ORDER BY table_name`,
        schemaName,
      );
      const tenantData: Record<string, unknown[]> = {};
      for (const { table_name } of tenantTables) {
        tenantData[table_name] = await this.masterPrisma.$queryRawUnsafe<
          unknown[]
        >(`SELECT * FROM "${schemaName}"."${table_name}"`);
      }
      tenantsData[schemaName] = {
        tables: tenantData,
        tableNames: tenantTables.map((t) => t.table_name),
      };
    }

    // Monta o ZIP ─────────────────────────────────────────────────────────────
    const zip = new AdmZip();
    const manifest = {
      version: "2.0",
      type: "full",
      backedUpAt: new Date().toISOString(),
      masterTables: masterTables.map((t) => t.table_name),
      tenants: companies.map((c) => ({
        id: c.id,
        name: c.name,
        schemaName: c.schemaName,
        tables: tenantsData[c.schemaName]?.tableNames ?? [],
      })),
    };
    zip.addFile(
      "manifest.json",
      Buffer.from(JSON.stringify(manifest, null, 2), "utf8"),
    );
    for (const [tableName, rows] of Object.entries(masterData)) {
      zip.addFile(
        `master/${tableName}.json`,
        Buffer.from(JSON.stringify(rows, null, 2), "utf8"),
      );
    }
    for (const [schemaName, { tables }] of Object.entries(tenantsData)) {
      for (const [tableName, rows] of Object.entries(tables)) {
        zip.addFile(
          `tenant/${schemaName}/${tableName}.json`,
          Buffer.from(JSON.stringify(rows, null, 2), "utf8"),
        );
      }
    }

    const backupDir = "/tmp/transrota-backups";
    await mkdir(backupDir, { recursive: true });
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `transrota-full-backup-${timestamp}.zip`;
    const filePath = join(backupDir, fileName);
    zip.writeZip(filePath);

    return { fileName, filePath };
  }

  // ─── Restauração completa ─────────────────────────────────────────────────

  async restoreFullBackup(
    buffer: Buffer,
  ): Promise<{
    message: string;
    tenantsRestored: number;
    companiesRestored: number;
  }> {
    const zip = new AdmZip(buffer);
    const manifestEntry = zip.getEntry("manifest.json");
    if (!manifestEntry)
      throw new BadRequestException(
        "ZIP inválido: manifest.json não encontrado",
      );

    const manifest: {
      version: string;
      type: string;
      masterTables: string[];
      tenants: {
        id: string;
        name: string;
        schemaName: string;
        tables: string[];
      }[];
    } = JSON.parse(manifestEntry.getData().toString("utf8"));

    if (manifest.type !== "full")
      throw new BadRequestException(
        "Este ZIP é um backup de empresa individual. Use o endpoint de restauração por empresa.",
      );

    const companyEntry =
      zip.getEntry("master/Company.json") ??
      zip.getEntry("master/company.json");

    const companiesInBackup = companyEntry
      ? (JSON.parse(companyEntry.getData().toString("utf8")) as unknown[])
          .length
      : 0;

    if (companiesInBackup === 0) {
      throw new BadRequestException(
        "Backup completo inválido para restauração: nenhuma empresa encontrada no arquivo. Use um backup completo que contenha empresas.",
      );
    }

    if (manifest.tenants.length !== companiesInBackup) {
      throw new BadRequestException(
        "Backup completo inconsistente: quantidade de empresas no manifesto difere de master/Company.json.",
      );
    }

    const BATCH = 200;

    // ── 1. Restaura schema master (public) com FK checks desligados ──────────
    await this.masterPrisma.$transaction(
      async (tx) => {
        await tx.$executeRawUnsafe(`SET session_replication_role = 'replica'`);
        for (const tableName of manifest.masterTables) {
          const entry = zip.getEntry(`master/${tableName}.json`);
          if (!entry) continue;
          const rows: unknown[] = JSON.parse(entry.getData().toString("utf8"));
          if (!rows.length) continue;
          await tx.$executeRawUnsafe(
            `TRUNCATE "public"."${tableName}" CASCADE`,
          );
          for (let i = 0; i < rows.length; i += BATCH) {
            const batch = rows.slice(i, i + BATCH);
            await tx.$executeRawUnsafe(
              `INSERT INTO "public"."${tableName}"
               SELECT * FROM json_populate_recordset(null::"public"."${tableName}", $1::json)`,
              JSON.stringify(batch),
            );
          }
        }
        await tx.$executeRawUnsafe(`SET session_replication_role = 'origin'`);
      },
      { timeout: 120_000 },
    );

    // ── 2. Restaura cada schema de tenant ────────────────────────────────────
    for (const tenant of manifest.tenants) {
      const { schemaName } = tenant;
      await this.masterPrisma.$executeRawUnsafe(
        `DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`,
      );
      await this.masterPrisma.$executeRawUnsafe(
        `CREATE SCHEMA "${schemaName}"`,
      );
      await this.provisionTenantSchemaStructure(schemaName);

      await this.masterPrisma.$transaction(
        async (tx) => {
          await tx.$executeRawUnsafe(
            `SET session_replication_role = 'replica'`,
          );
          for (const tableName of tenant.tables) {
            const entry = zip.getEntry(
              `tenant/${schemaName}/${tableName}.json`,
            );
            if (!entry) continue;
            const rows: unknown[] = JSON.parse(
              entry.getData().toString("utf8"),
            );
            if (!rows.length) continue;
            for (let i = 0; i < rows.length; i += BATCH) {
              const batch = rows.slice(i, i + BATCH);
              await tx.$executeRawUnsafe(
                `INSERT INTO "${schemaName}"."${tableName}"
                 SELECT * FROM json_populate_recordset(null::"${schemaName}"."${tableName}", $1::json)`,
                JSON.stringify(batch),
              );
            }
          }
          await tx.$executeRawUnsafe(`SET session_replication_role = 'origin'`);
        },
        { timeout: 120_000 },
      );
    }

    return {
      message: "Backup completo restaurado com sucesso",
      tenantsRestored: manifest.tenants.length,
      companiesRestored: companiesInBackup,
    };
  }

  // ─── Backup por empresa ───────────────────────────────────────────────────

  async createCompanyBackup(
    companyId: string,
  ): Promise<{ fileName: string; filePath: string }> {
    const company = await this.masterPrisma.company.findUnique({
      where: { id: companyId },
      include: {
        plan: true,
        subscriptions: true,
        billingCustomer: {
          include: { billingSubscription: true, invoices: true },
        },
        notifications: true,
        auditLogs: true,
      },
    });
    if (!company) throw new NotFoundException("Empresa não encontrada");

    const { schemaName } = company;

    // Lista todas as tabelas do schema tenant
    const tables = await this.masterPrisma.$queryRawUnsafe<
      { table_name: string }[]
    >(
      `SELECT table_name FROM information_schema.tables
       WHERE table_schema = $1 AND table_type = 'BASE TABLE'
       ORDER BY table_name`,
      schemaName,
    );

    // Exporta cada tabela como array JSON
    const tenantData: Record<string, unknown[]> = {};
    for (const { table_name } of tables) {
      tenantData[table_name] = await this.masterPrisma.$queryRawUnsafe<
        unknown[]
      >(`SELECT * FROM "${schemaName}"."${table_name}"`);
    }

    // Monta o ZIP
    const zip = new AdmZip();

    const manifest = {
      version: "1.0",
      companyId,
      schemaName,
      backedUpAt: new Date().toISOString(),
      tenantTables: tables.map((t) => t.table_name),
    };

    zip.addFile(
      "manifest.json",
      Buffer.from(JSON.stringify(manifest, null, 2), "utf8"),
    );
    zip.addFile(
      "master/company.json",
      Buffer.from(JSON.stringify(company, null, 2), "utf8"),
    );

    for (const [tableName, rows] of Object.entries(tenantData)) {
      zip.addFile(
        `tenant/${tableName}.json`,
        Buffer.from(JSON.stringify(rows, null, 2), "utf8"),
      );
    }

    const backupDir = "/tmp/transrota-backups";
    await mkdir(backupDir, { recursive: true });
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const safeName = company.name.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 40);
    const fileName = `backup_${safeName}_${timestamp}.zip`;
    const filePath = join(backupDir, fileName);
    zip.writeZip(filePath);

    return { fileName, filePath };
  }

  // ─── Restauração por empresa ──────────────────────────────────────────────

  async restoreCompanyBackup(
    buffer: Buffer,
  ): Promise<{ message: string; companyId: string; schemaName: string }> {
    const zip = new AdmZip(buffer);

    const manifestEntry = zip.getEntry("manifest.json");
    if (!manifestEntry)
      throw new BadRequestException(
        "ZIP inválido: manifest.json não encontrado",
      );
    let manifest: {
      version: string;
      type?: string;
      companyId?: string;
      schemaName?: string;
      tenantTables?: string[];
    };

    try {
      manifest = JSON.parse(manifestEntry.getData().toString("utf8"));
    } catch {
      throw new BadRequestException(
        "ZIP inválido: manifest.json está corrompido",
      );
    }

    if (manifest.type === "full") {
      throw new BadRequestException(
        "Este ZIP é um backup completo. Use a restauração completa em Admin > Operações.",
      );
    }

    if (!manifest.schemaName || !Array.isArray(manifest.tenantTables)) {
      throw new BadRequestException(
        "ZIP inválido: estrutura de backup de empresa não reconhecida",
      );
    }

    const companyEntry = zip.getEntry("master/company.json");
    if (!companyEntry)
      throw new BadRequestException(
        "ZIP inválido: master/company.json não encontrado",
      );
    let companyData: any;
    try {
      companyData = JSON.parse(companyEntry.getData().toString("utf8"));
    } catch {
      throw new BadRequestException(
        "ZIP inválido: master/company.json está corrompido",
      );
    }

    if (!companyData?.id || !companyData?.name) {
      throw new BadRequestException(
        "ZIP inválido: dados da empresa incompletos no backup",
      );
    }

    const { schemaName, tenantTables } = manifest;

    // ── 1. Garante plano existente no master ─────────────────────────────────
    if (companyData.plan) {
      await this.masterPrisma.plan.upsert({
        where: { id: companyData.plan.id },
        update: {},
        create: {
          id: companyData.plan.id,
          name: companyData.plan.name,
          type: companyData.plan.type,
          maxVehicles: companyData.plan.maxVehicles,
          maxDrivers: companyData.plan.maxDrivers,
          maxUsers: companyData.plan.maxUsers,
          maxBranches: companyData.plan.maxBranches,
          storageGb: companyData.plan.storageGb,
          priceMonthly: companyData.plan.priceMonthly,
          isActive: companyData.plan.isActive ?? true,
        },
      });
    }

    // ── 2. Recria o registro da empresa no master ────────────────────────────
    await this.masterPrisma.company.upsert({
      where: { id: companyData.id },
      update: {
        name: companyData.name,
        cnpj: companyData.cnpj,
        email: companyData.email,
        phone: companyData.phone,
        planId: companyData.planId,
        isActive: companyData.isActive,
        trialEndsAt: companyData.trialEndsAt
          ? new Date(companyData.trialEndsAt)
          : null,
        features: companyData.features ?? [],
      },
      create: {
        id: companyData.id,
        name: companyData.name,
        cnpj: companyData.cnpj,
        email: companyData.email,
        phone: companyData.phone,
        schemaName,
        planId: companyData.planId,
        isActive: companyData.isActive,
        trialEndsAt: companyData.trialEndsAt
          ? new Date(companyData.trialEndsAt)
          : null,
        features: companyData.features ?? [],
        createdAt: companyData.createdAt
          ? new Date(companyData.createdAt)
          : undefined,
      },
    });

    // ── 3. Recria o schema tenant e aplica estrutura via prisma db push ──────
    await this.masterPrisma.$executeRawUnsafe(
      `DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`,
    );
    await this.masterPrisma.$executeRawUnsafe(`CREATE SCHEMA "${schemaName}"`);
    await this.provisionTenantSchemaStructure(schemaName);

    // ── 4. Restaura dados do tenant (FK checks desativados temporariamente) ──
    const BATCH = 200;
    await this.masterPrisma.$transaction(
      async (tx) => {
        await tx.$executeRawUnsafe(`SET session_replication_role = 'replica'`);

        for (const tableName of tenantTables) {
          const entry = zip.getEntry(`tenant/${tableName}.json`);
          if (!entry) continue;
          const rows: unknown[] = JSON.parse(entry.getData().toString("utf8"));
          if (!rows.length) continue;

          for (let i = 0; i < rows.length; i += BATCH) {
            const batch = rows.slice(i, i + BATCH) as Record<string, unknown>[];
            // json_populate_recordset cuida de toda conversão de tipos (ISO dates, decimals, etc.)
            await tx.$executeRawUnsafe(
              `INSERT INTO "${schemaName}"."${tableName}"
               SELECT * FROM json_populate_recordset(null::"${schemaName}"."${tableName}", $1::json)`,
              JSON.stringify(batch),
            );
          }
        }

        await tx.$executeRawUnsafe(`SET session_replication_role = 'origin'`);
      },
      { timeout: 120_000 },
    );

    return {
      message: "Empresa restaurada com sucesso",
      companyId: companyData.id,
      schemaName,
    };
  }

  private provisionTenantSchemaStructure(schemaName: string): void {
    const masterUrl = this.config.getOrThrow<string>("DATABASE_MASTER_URL");
    const baseUrl = masterUrl.split("?")[0];
    const tenantUrl = `${baseUrl}?schema=${schemaName}`;
    const schemaPath = path.resolve(__dirname, "../../prisma/tenant.prisma");
    const cwd = path.resolve(__dirname, "../..");
    execFileSync(
      "npx",
      ["prisma", "db", "push", "--schema", schemaPath, "--skip-generate"],
      {
        cwd,
        env: { ...process.env, DATABASE_TENANT_URL: tenantUrl },
        stdio: "pipe",
      },
    );
  }
}
