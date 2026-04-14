import {
  Injectable,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { execFileSync } from "child_process";
import * as path from "path";
import { MasterPrismaService } from "../core/prisma/master-prisma.service";
import { TenantPrismaFactory } from "../core/prisma/tenant-prisma.factory";
import { CreateCompanyDto } from "./dto/create-company.dto";
import * as bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class TenantService {
  constructor(
    private readonly masterPrisma: MasterPrismaService,
    private readonly tenantPrismaFactory: TenantPrismaFactory,
  ) {}

  async createCompany(dto: CreateCompanyDto) {
    const normalizedEmail = dto.email.trim().toLowerCase();
    const normalizedAdminEmail = dto.adminEmail.trim().toLowerCase();
    const normalizedCnpj = this.normalizeCnpj(dto.cnpj);

    // Verifica duplicidade
    const existing = await this.masterPrisma.company.findFirst({
      where: {
        OR: [
          { cnpj: normalizedCnpj },
          { email: { equals: normalizedEmail, mode: "insensitive" } },
        ],
      },
    });
    if (existing) {
      throw new ConflictException(
        "Empresa já cadastrada com este CNPJ ou e-mail",
      );
    }

    const plan = await this.masterPrisma.plan.findFirst({
      where: { type: "STARTER", isActive: true },
    });
    if (!plan) throw new BadRequestException("Plano padrão não encontrado");

    const schemaName = `tenant_${uuidv4().replace(/-/g, "").slice(0, 16)}`;

    let companyId: string | undefined;
    try {
      // Provisiona schema primeiro para evitar empresa órfã em caso de falha.
      await this.provisionTenantSchema(schemaName);

      // Cria empresa no master
      const company = await this.masterPrisma.company.create({
        data: {
          name: dto.name,
          cnpj: normalizedCnpj,
          email: normalizedEmail,
          phone: dto.phone,
          schemaName,
          planId: plan.id,
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 dias
        },
      });
      companyId = company.id;

      // Cria admin inicial no schema do tenant
      const tenantPrisma = await this.tenantPrismaFactory.getClient(schemaName);
      const passwordHash = await bcrypt.hash(dto.adminPassword, 12);

      // Cria a branch (filial) padrão da empresa
      const defaultBranch = await (tenantPrisma as any).branch.create({
        data: {
          name: dto.name,
          city: "Não informado",
          state: "XX",
        },
      });

      await tenantPrisma.user.create({
        data: {
          name: dto.adminName,
          email: normalizedAdminEmail,
          passwordHash,
          role: "ADMIN",
          branchId: defaultBranch.id,
        },
      });

      await this.masterPrisma.adminNotification.create({
        data: {
          type: "NEW_COMPANY",
          title: "Nova empresa cadastrada",
          message: `${dto.name} iniciou o período de trial.`,
          companyId: company.id,
        },
      });

      return {
        companyId: company.id,
        schemaName,
        trialEndsAt: company.trialEndsAt,
      };
    } catch (error) {
      if (companyId) {
        await this.masterPrisma.company
          .delete({ where: { id: companyId } })
          .catch(() => undefined);
      }
      await this.dropTenantSchema(schemaName).catch(() => undefined);
      throw error;
    }
  }

  private async provisionTenantSchema(schemaName: string) {
    // Cria o schema PostgreSQL isolado para o tenant
    await this.masterPrisma.$executeRawUnsafe(
      `CREATE SCHEMA IF NOT EXISTS "${schemaName}"`,
    );

    // Executa sincronização Prisma para o novo schema.
    const baseUrl = this.resolveDatabaseBaseUrl();
    const tenantUrl = `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}schema=${schemaName}`;
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

  private async dropTenantSchema(schemaName: string) {
    await this.masterPrisma.$executeRawUnsafe(
      `DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`,
    );
  }

  private resolveDatabaseBaseUrl() {
    const masterUrl = process.env.DATABASE_MASTER_URL;
    if (masterUrl) {
      return masterUrl.split("?")[0];
    }
    if (process.env.DATABASE_BASE_URL) return process.env.DATABASE_BASE_URL;
    if (!masterUrl) {
      throw new BadRequestException(
        "DATABASE_BASE_URL ou DATABASE_MASTER_URL não configurada",
      );
    }
    return masterUrl.split("?")[0];
  }

  private normalizeCnpj(value: string) {
    const digits = value.replace(/\D/g, "");
    if (digits.length !== 14) {
      throw new BadRequestException("CNPJ inválido");
    }
    return digits.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5",
    );
  }

  async listCompanies() {
    return this.masterPrisma.company.findMany({
      include: { plan: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async getCompany(id: string) {
    return this.masterPrisma.company.findUniqueOrThrow({ where: { id } });
  }
}
