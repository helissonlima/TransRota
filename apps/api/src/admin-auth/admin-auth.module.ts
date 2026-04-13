import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  AdminAuthController,
  AdminCompaniesController,
  AdminUsersController,
  AdminPlansController,
  AdminOperationsController,
  AdminNotificationsController,
  AdminSettingsController,
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
        signOptions: { expiresIn: '8h' },
      }),
    }),
  ],
  controllers: [AdminAuthController, AdminCompaniesController, AdminUsersController, AdminPlansController, AdminOperationsController, AdminNotificationsController, AdminSettingsController],
  providers: [AdminAuthService, SuperAdminGuard],
})
export class AdminAuthModule {}
