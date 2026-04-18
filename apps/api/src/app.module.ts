import { Module, MiddlewareConsumer, RequestMethod } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { ConfigModule } from "@nestjs/config";
import { LoggerModule } from "nestjs-pino";
import { ThrottlerModule } from "@nestjs/throttler";
import { TenantModule } from "./tenant/tenant.module";
import { AuthModule } from "./auth/auth.module";
import { AdminAuthModule } from "./admin-auth/admin-auth.module";
import { UsersModule } from "./users/users.module";
import { FleetModule } from "./fleet/fleet.module";
import { DriversModule } from "./drivers/drivers.module";
import { RoutesModule } from "./routes/routes.module";
import { ChecklistModule } from "./checklist/checklist.module";
import { ReportsModule } from "./reports/reports.module";
import { TenantMiddleware } from "./tenant/tenant.middleware";
import { MasterPrismaModule } from "./core/prisma/master-prisma.module";
import { DailyKmModule } from "./daily-km/daily-km.module";
import { BookingsModule } from "./bookings/bookings.module";
import { TaxesModule } from "./taxes/taxes.module";
import { EquipmentModule } from "./equipment/equipment.module";
import { BillingModule } from "./billing/billing.module";
import { CommissionsModule } from "./commissions/commissions.module";
import { FinancialModule } from "./financial/financial.module";
import { ProductsModule } from "./products/products.module";
import { SuppliersModule } from "./suppliers/suppliers.module";
import { PurchasesModule } from "./purchases/purchases.module";
import { SellersModule } from "./sellers/sellers.module";
import { ClientsModule } from "./clients/clients.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== "production"
            ? { target: "pino-pretty", options: { singleLine: true } }
            : undefined,
      },
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || "localhost",
        port: parseInt(process.env.REDIS_PORT || "6379", 10),
      },
    }),
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
    SuppliersModule,
    PurchasesModule,
    SellersModule,
    ClientsModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // TenantMiddleware em todas as rotas exceto onboarding e superadmin
    consumer
      .apply(TenantMiddleware)
      .exclude(
        { path: "companies", method: RequestMethod.POST },
        { path: "companies", method: RequestMethod.GET },
        { path: "health", method: RequestMethod.GET },
        { path: "admin/auth/login", method: RequestMethod.POST },
        { path: "webhooks/(.*)", method: RequestMethod.ALL },
      )
      .forRoutes("*");
  }
}
