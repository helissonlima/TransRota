import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  AdminAuthController,
  AdminCompaniesController,
  AdminUsersController,
  AdminPlansController,
  AdminOperationsController,
} from './admin-auth.controller';
import { AdminAuthService } from './admin-auth.service';
import { MasterPrismaModule } from '../core/prisma/master-prisma.module';
import { TenantModule } from '../tenant/tenant.module';
import { SuperAdminGuard } from './guards/super-admin.guard';

@Module({
  imports: [
    MasterPrismaModule,
    TenantModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  controllers: [AdminAuthController, AdminCompaniesController, AdminUsersController, AdminPlansController, AdminOperationsController],
  providers: [AdminAuthService, SuperAdminGuard],
})
export class AdminAuthModule {}
