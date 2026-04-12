import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Headers,
  HttpCode,
  HttpStatus,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { BillingService } from './billing.service';
import {
  CreateBillingCustomerDto,
  CreateSubscriptionDto,
  CreateInvoiceDto,
} from './dto/billing.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SuperAdminGuard } from '../admin-auth/guards/super-admin.guard';

@ApiTags('Billing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, SuperAdminGuard)
@Controller('admin/billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  // ── Métricas ──────────────────────────────────────────────────────────────

  @Get('metrics')
  @ApiOperation({ summary: 'Métricas financeiras (MRR, ARR, churn)' })
  getMetrics() {
    return this.billingService.getFinancialMetrics();
  }

  // ── Clientes ──────────────────────────────────────────────────────────────

  @Post('customers')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cadastrar empresa como cliente de billing' })
  createCustomer(@Body() dto: CreateBillingCustomerDto) {
    return this.billingService.createBillingCustomer(dto);
  }

  @Get('customers/:companyId')
  @ApiOperation({ summary: 'Dados de billing de uma empresa' })
  getCustomer(@Param('companyId') companyId: string) {
    return this.billingService.getBillingCustomer(companyId);
  }

  // ── Assinaturas ───────────────────────────────────────────────────────────

  @Post('subscriptions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar assinatura recorrente' })
  createSubscription(@Body() dto: CreateSubscriptionDto) {
    return this.billingService.createSubscription(dto);
  }

  @Delete('subscriptions/:companyId')
  @ApiOperation({ summary: 'Cancelar assinatura' })
  cancelSubscription(@Param('companyId') companyId: string) {
    return this.billingService.cancelSubscription(companyId);
  }

  // ── Cobranças ─────────────────────────────────────────────────────────────

  @Post('invoices')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar cobrança avulsa' })
  createInvoice(@Body() dto: CreateInvoiceDto) {
    return this.billingService.createInvoice(dto);
  }

  @Get('invoices/:companyId')
  @ApiOperation({ summary: 'Listar cobranças de uma empresa' })
  listInvoices(@Param('companyId') companyId: string) {
    return this.billingService.listInvoices(companyId);
  }
}

// ── Webhook Controller (sem autenticação JWT) ─────────────────────────────

@ApiTags('Billing Webhooks')
@Controller('webhooks/asaas')
export class BillingWebhookController {
  constructor(
    private readonly billingService: BillingService,
    private readonly config: ConfigService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook do Asaas' })
  async handleWebhook(
    @Body() body: { event: string; payment?: any },
    @Headers('asaas-access-token') accessToken?: string,
  ) {
    const webhookToken = this.config.get<string>('ASAAS_WEBHOOK_TOKEN');
    if (webhookToken && accessToken !== webhookToken) {
      throw new UnauthorizedException('Token de webhook inválido');
    }

    await this.billingService.handleWebhook(body.event, body);
    return { received: true };
  }
}
