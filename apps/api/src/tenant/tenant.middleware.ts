import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MasterPrismaService } from '../core/prisma/master-prisma.service';
import { TenantPrismaFactory } from '../core/prisma/tenant-prisma.factory';

export interface TenantRequest extends Request {
  tenantId: string;
  schemaName: string;
  tenantFeatures: string[];
  tenantPrisma: ReturnType<TenantPrismaFactory['getClient']> extends Promise<infer T> ? T : never;
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
    if (fullPath.includes('/admin/')) {
      return next();
    }

    const tenantId =
      req.headers['x-tenant-id'] as string ||
      this.extractSubdomain(req.hostname);

    if (!tenantId) {
      throw new UnauthorizedException('Tenant não identificado');
    }

    const company = await this.masterPrisma.company.findFirst({
      where: { id: tenantId, isActive: true },
    });

    if (!company) {
      throw new UnauthorizedException('Empresa não encontrada ou inativa');
    }

    req.tenantId = company.id;
    req.schemaName = company.schemaName;
    req.tenantFeatures = (company as any).features ?? [];
    req.tenantPrisma = await this.tenantPrismaFactory.getClient(company.schemaName);

    next();
  }

  private extractSubdomain(hostname: string): string | null {
    const parts = hostname.split('.');
    // ex: acme.transrota.com.br → 'acme' — resolve no master por slug
    return parts.length > 2 ? parts[0] : null;
  }
}
