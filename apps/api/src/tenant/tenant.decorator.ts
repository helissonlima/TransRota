import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TenantRequest } from './tenant.middleware';

export const TenantPrisma = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<TenantRequest>();
    return request.tenantPrisma;
  },
);

export const TenantId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<TenantRequest>();
    return request.tenantId;
  },
);
