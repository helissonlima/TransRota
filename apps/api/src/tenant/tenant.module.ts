import { Module } from '@nestjs/common';
import { TenantMiddleware } from './tenant.middleware';
import { TenantPrismaFactory } from '../core/prisma/tenant-prisma.factory';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';

@Module({
  providers: [TenantPrismaFactory, TenantMiddleware, TenantService],
  exports: [TenantPrismaFactory, TenantMiddleware],
  controllers: [TenantController],
})
export class TenantModule {}
