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
import { DailyKmModule } from './daily-km/daily-km.module';
import { BookingsModule } from './bookings/bookings.module';
import { TaxesModule } from './taxes/taxes.module';
import { EquipmentModule } from './equipment/equipment.module';
import { BillingModule } from './billing/billing.module';
import { CommissionsModule } from './commissions/commissions.module';
import { FinancialModule } from './financial/financial.module';
import { ProductsModule } from './products/products.module';

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
    DailyKmModule,
    BookingsModule,
    TaxesModule,
    EquipmentModule,
    BillingModule,
    CommissionsModule,
    FinancialModule,
    ProductsModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // TenantMiddleware em todas as rotas exceto onboarding e superadmin
    consumer
      .apply(TenantMiddleware)
      .exclude(
        { path: 'companies', method: RequestMethod.POST },
        { path: 'companies', method: RequestMethod.GET },
        { path: 'health', method: RequestMethod.GET },
        { path: 'admin/auth/login', method: RequestMethod.POST },
        { path: 'webhooks/(.*)', method: RequestMethod.ALL },
      )
      .forRoutes('*');
  }
}
