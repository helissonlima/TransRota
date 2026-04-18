import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { MasterPrismaService } from "../core/prisma/master-prisma.service";
import { TenantPrismaFactory } from "../core/prisma/tenant-prisma.factory";

export interface TenantRequest extends Request {
  tenantId: string;
  schemaName: string;
  tenantFeatures: string[];
  tenantPrisma: ReturnType<TenantPrismaFactory["getClient"]> extends Promise<
    infer T
  >
    ? T
    : never;
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(
    private readonly masterPrisma: MasterPrismaService,
    private readonly tenantPrismaFactory: TenantPrismaFactory,
  ) {}

  async use(req: TenantRequest, res: Response, next: NextFunction) {
    // Rotas de admin não precisam de tenant
    const fullPath = req.originalUrl || req.url || req.path;
    if (fullPath.includes("/admin/") || fullPath.includes("/media/")) {
      return next();
    }

    const tenantKey =
      (req.headers["x-tenant-id"] as string) ||
      this.extractSubdomain(req.hostname);

    if (!tenantKey) {
      throw new UnauthorizedException("Tenant não identificado");
    }

    const company = await this.resolveCompany(tenantKey.trim());

    if (!company) {
      throw new UnauthorizedException("Empresa não encontrada ou inativa");
    }

    req.tenantId = company.id;
    req.schemaName = company.schemaName;
    req.tenantFeatures = (company as any).features ?? [];
    req.tenantPrisma = await this.tenantPrismaFactory.getClient(
      company.schemaName,
    );

    next();
  }

  private async resolveCompany(tenantKey: string) {
    const byId = await this.masterPrisma.company.findFirst({
      where: { id: tenantKey, isActive: true },
    });

    if (byId) return byId;

    const schemaCandidates = this.buildSchemaCandidates(tenantKey);

    return this.masterPrisma.company.findFirst({
      where: {
        isActive: true,
        schemaName: { in: schemaCandidates },
      },
    });
  }

  private buildSchemaCandidates(tenantKey: string) {
    const normalized = tenantKey.toLowerCase().replace(/[^a-z0-9_]/g, "_");
    const candidates = new Set<string>([
      tenantKey,
      normalized,
      `tenant_${tenantKey}`,
      `tenant_${normalized}`,
    ]);

    return Array.from(candidates);
  }

  private extractSubdomain(hostname: string): string | null {
    if (
      !hostname ||
      hostname === "localhost" ||
      /^\d+\.\d+\.\d+\.\d+$/.test(hostname)
    ) {
      return null;
    }

    const parts = hostname.split(".");
    // ex: acme.transrota.com.br → 'acme' — usado como chave para id/schema
    return parts.length > 2 ? parts[0] : null;
  }
}
