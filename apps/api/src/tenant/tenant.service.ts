import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { execSync } from 'child_process';
import * as path from 'path';
import { MasterPrismaService } from '../core/prisma/master-prisma.service';
import { TenantPrismaFactory } from '../core/prisma/tenant-prisma.factory';
import { CreateCompanyDto } from './dto/create-company.dto';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TenantService {
  constructor(
    private readonly masterPrisma: MasterPrismaService,
    private readonly tenantPrismaFactory: TenantPrismaFactory,
  ) {}

  async createCompany(dto: CreateCompanyDto) {
    // Verifica duplicidade
    const existing = await this.masterPrisma.company.findFirst({
      where: { OR: [{ cnpj: dto.cnpj }, { email: dto.email }] },
    });
    if (existing) {
      throw new ConflictException('Empresa já cadastrada com este CNPJ ou e-mail');
    }

    const plan = await this.masterPrisma.plan.findFirst({
      where: { type: 'STARTER', isActive: true },
    });
    if (!plan) throw new BadRequestException('Plano padrão não encontrado');

    const schemaName = `tenant_${uuidv4().replace(/-/g, '').slice(0, 16)}`;

    // Cria empresa no master
    const company = await this.masterPrisma.company.create({
      data: {
        name: dto.name,
        cnpj: dto.cnpj,
        email: dto.email,
        phone: dto.phone,
        schemaName,
        planId: plan.id,
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 dias
      },
    });

    // Provisiona schema no PostgreSQL
    await this.provisionTenantSchema(schemaName);

    // Cria admin inicial no schema do tenant
    const tenantPrisma = await this.tenantPrismaFactory.getClient(schemaName);
    const passwordHash = await bcrypt.hash(dto.adminPassword, 12);

    await tenantPrisma.user.create({
      data: {
        name: dto.adminName,
        email: dto.adminEmail,
        passwordHash,
        role: 'ADMIN',
      },
    });

    return { companyId: company.id, schemaName, trialEndsAt: company.trialEndsAt };
  }

  private async provisionTenantSchema(schemaName: string) {
    // Cria o schema PostgreSQL isolado para o tenant
    await this.masterPrisma.$executeRawUnsafe(
      `CREATE SCHEMA IF NOT EXISTS "${schemaName}"`,
    );

    // Executa as migrations Prisma para o novo schema via CLI
    const baseUrl = process.env.DATABASE_BASE_URL!;
    const tenantUrl = `${baseUrl}?schema=${schemaName}`;
    const schemaPath = path.resolve(__dirname, '../../prisma/tenant.prisma');

    execSync(
      `npx prisma db push --schema="${schemaPath}" --skip-generate --force-reset`,
      {
        env: { ...process.env, DATABASE_TENANT_URL: tenantUrl },
        stdio: 'pipe',
      },
    );
  }

  async listCompanies() {
    return this.masterPrisma.company.findMany({
      include: { plan: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCompany(id: string) {
    return this.masterPrisma.company.findUniqueOrThrow({ where: { id } });
  }
}
