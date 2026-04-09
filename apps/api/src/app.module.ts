import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TenantModule } from './tenant/tenant.module';
import { AuthModule } from './auth/auth.module';
import { AdminAuthModule } from './admin-auth/admin-auth.module';
import { UsersModule } from './users/users.module';
import { FleetModule } from './fleet/fleet.module';
import { DriversModule } from './drivers/drivers.module';
import { RoutesModule } from './routes/routes.module';
import { ChecklistModule } from './checklist/checklist.module';
import { ReportsModule } from './reports/reports.module';
import { TenantMiddleware } from './tenant/tenant.middleware';
import { MasterPrismaModule } from './core/prisma/master-prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    MasterPrismaModule,
    TenantModule,
    AuthModule,
    AdminAuthModule,
    UsersModule,
    FleetModule,
    DriversModule,
    RoutesModule,
    ChecklistModule,
    ReportsModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // TenantMiddleware em todas as rotas exceto onboarding e superadmin
    consumer
      .apply(TenantMiddleware)
      .exclude(
        { path: 'companies', method: RequestMethod.POST },
        { path: 'health', method: RequestMethod.GET },
        { path: 'admin/auth/login', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
