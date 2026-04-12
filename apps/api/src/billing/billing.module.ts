import { Module } from '@nestjs/common';
import { BillingController, BillingWebhookController } from './billing.controller';
import { BillingService } from './billing.service';
import { AsaasClient } from './asaas.client';
import { MasterPrismaModule } from '../core/prisma/master-prisma.module';

@Module({
  imports: [MasterPrismaModule],
  controllers: [BillingController, BillingWebhookController],
  providers: [BillingService, AsaasClient],
  exports: [BillingService],
})
export class BillingModule {}
