import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { MasterPrismaService } from '../core/prisma/master-prisma.service';
import { AsaasClient } from './asaas.client';
import {
  CreateBillingCustomerDto,
  CreateSubscriptionDto,
  CreateInvoiceDto,
} from './dto/billing.dto';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(
    private readonly masterPrisma: MasterPrismaService,
    private readonly asaas: AsaasClient,
  ) {}

  // ── Clientes de Billing ───────────────────────────────────────────────────

  async createBillingCustomer(dto: CreateBillingCustomerDto) {
    const company = await this.masterPrisma.company.findUnique({
      where: { id: dto.companyId },
    });
    if (!company) throw new NotFoundException('Empresa não encontrada');

    const existing = await this.masterPrisma.billingCustomer.findUnique({
      where: { companyId: dto.companyId },
    });
    if (existing) throw new BadRequestException('Empresa já possui cadastro de billing');

    const asaasResult = await this.asaas.createCustomer({
      name: company.name,
      cpfCnpj: company.cnpj,
      email: company.email,
      phone: dto.phone ?? company.phone ?? undefined,
      postalCode: dto.postalCode,
      address: dto.address,
      addressNumber: dto.addressNumber,
      complement: dto.complement,
      province: dto.province,
      externalReference: company.id,
    });

    const asaasCustomerId = asaasResult.ok
      ? asaasResult.data.id
      : `local_${company.id}`;

    const customer = await this.masterPrisma.billingCustomer.create({
      data: {
        companyId: company.id,
        asaasCustomerId,
        name: company.name,
        cpfCnpj: company.cnpj,
        email: company.email,
        phone: dto.phone ?? company.phone,
        postalCode: dto.postalCode,
        address: dto.address,
        addressNumber: dto.addressNumber,
        complement: dto.complement,
        province: dto.province,
        city: dto.city,
        state: dto.state,
      },
    });

    // Notificação
    await this.masterPrisma.adminNotification.create({
      data: {
        type: 'NEW_COMPANY',
        title: 'Novo cliente de billing',
        message: `${company.name} foi cadastrado no sistema de cobranças.`,
        companyId: company.id,
      },
    });

    return customer;
  }

  async getBillingCustomer(companyId: string) {
    const customer = await this.masterPrisma.billingCustomer.findUnique({
      where: { companyId },
      include: {
        company: { select: { name: true, cnpj: true, email: true } },
        billingSubscription: { include: { plan: true } },
        invoices: { orderBy: { dueDate: 'desc' }, take: 10 },
      },
    });
    if (!customer) throw new NotFoundException('Cliente de billing não encontrado');
    return customer;
  }

  // ── Assinaturas ───────────────────────────────────────────────────────────

  async createSubscription(dto: CreateSubscriptionDto) {
    const customer = await this.masterPrisma.billingCustomer.findUnique({
      where: { companyId: dto.companyId },
    });
    if (!customer) throw new NotFoundException('Cadastre o cliente de billing primeiro');

    const plan = await this.masterPrisma.plan.findUnique({
      where: { id: dto.planId },
    });
    if (!plan) throw new NotFoundException('Plano não encontrado');

    const value = Number(plan.priceMonthly);

    const asaasResult = await this.asaas.createSubscription({
      customer: customer.asaasCustomerId,
      billingType: dto.billingType,
      value,
      nextDueDate: dto.nextDueDate,
      cycle: dto.cycle,
      description: `TransRota - Plano ${plan.name}`,
      externalReference: customer.companyId,
    });

    const asaasSubId = asaasResult.ok
      ? asaasResult.data.id
      : `local_sub_${Date.now()}`;

    const subscription = await this.masterPrisma.billingSubscription.create({
      data: {
        billingCustomerId: customer.id,
        asaasSubscriptionId: asaasSubId,
        planId: plan.id,
        billingType: dto.billingType as any,
        value,
        nextDueDate: new Date(dto.nextDueDate),
        cycle: dto.cycle as any,
        description: `Plano ${plan.name}`,
        externalReference: customer.companyId,
      },
      include: { plan: true },
    });

    // Atualiza o plano da empresa
    await this.masterPrisma.company.update({
      where: { id: dto.companyId },
      data: { planId: plan.id },
    });

    // Cria Subscription no modelo antigo também para compatibilidade
    await this.masterPrisma.subscription.create({
      data: {
        companyId: dto.companyId,
        planId: plan.id,
        status: 'ACTIVE',
        startsAt: new Date(),
      },
    });

    return subscription;
  }

  async cancelSubscription(companyId: string) {
    const subscription = await this.masterPrisma.billingSubscription.findFirst({
      where: { billingCustomer: { companyId }, status: 'ACTIVE' },
    });
    if (!subscription)
      throw new NotFoundException('Assinatura ativa não encontrada');

    await this.asaas.cancelSubscription(subscription.asaasSubscriptionId);

    const updated = await this.masterPrisma.billingSubscription.update({
      where: { id: subscription.id },
      data: { status: 'INACTIVE' },
    });

    await this.masterPrisma.adminNotification.create({
      data: {
        type: 'SUBSCRIPTION_CANCELLED',
        title: 'Assinatura cancelada',
        message: `Assinatura da empresa foi cancelada.`,
        companyId,
      },
    });

    return updated;
  }

  // ── Cobranças Avulsas ─────────────────────────────────────────────────────

  async createInvoice(dto: CreateInvoiceDto) {
    const customer = await this.masterPrisma.billingCustomer.findUnique({
      where: { companyId: dto.companyId },
    });
    if (!customer) throw new NotFoundException('Cadastre o cliente de billing primeiro');

    const asaasResult = await this.asaas.createPayment({
      customer: customer.asaasCustomerId,
      billingType: dto.billingType,
      value: dto.value,
      dueDate: dto.dueDate,
      description: dto.description ?? 'Cobrança TransRota',
      externalReference: customer.companyId,
    });

    let invoiceUrl: string | undefined;
    let bankSlipUrl: string | undefined;
    let pixQrCode: string | undefined;
    let pixQrCodeImage: string | undefined;
    let asaasPaymentId: string | undefined;

    if (asaasResult.ok) {
      asaasPaymentId = asaasResult.data.id;
      invoiceUrl = asaasResult.data.invoiceUrl;
      bankSlipUrl = asaasResult.data.bankSlipUrl;

      if (dto.billingType === 'PIX' && asaasPaymentId) {
        const pixResult = await this.asaas.getPixQrCode(asaasPaymentId);
        if (pixResult.ok) {
          pixQrCode = pixResult.data.payload;
          pixQrCodeImage = pixResult.data.encodedImage;
        }
      }
    }

    const invoice = await this.masterPrisma.invoice.create({
      data: {
        billingCustomerId: customer.id,
        asaasPaymentId: asaasPaymentId ?? `local_pay_${Date.now()}`,
        value: dto.value,
        billingType: dto.billingType as any,
        dueDate: new Date(dto.dueDate),
        description: dto.description,
        externalReference: customer.companyId,
        invoiceUrl,
        bankSlipUrl,
        pixQrCode,
        pixQrCodeImage,
      },
    });

    return invoice;
  }

  async listInvoices(companyId: string) {
    const customer = await this.masterPrisma.billingCustomer.findUnique({
      where: { companyId },
    });
    if (!customer) return [];

    return this.masterPrisma.invoice.findMany({
      where: { billingCustomerId: customer.id },
      orderBy: { dueDate: 'desc' },
    });
  }

  // ── Webhook ───────────────────────────────────────────────────────────────

  async handleWebhook(event: string, payload: any) {
    // Salva log do webhook
    const log = await this.masterPrisma.billingWebhookLog.create({
      data: { event, payload },
    });

    try {
      switch (event) {
        case 'PAYMENT_RECEIVED':
        case 'PAYMENT_CONFIRMED':
          await this.handlePaymentConfirmed(payload);
          break;
        case 'PAYMENT_OVERDUE':
          await this.handlePaymentOverdue(payload);
          break;
        case 'PAYMENT_REFUNDED':
          await this.handlePaymentRefunded(payload);
          break;
        default:
          this.logger.log(`Webhook event ignorado: ${event}`);
      }

      await this.masterPrisma.billingWebhookLog.update({
        where: { id: log.id },
        data: { processed: true },
      });
    } catch (err: any) {
      await this.masterPrisma.billingWebhookLog.update({
        where: { id: log.id },
        data: { error: err.message },
      });
      throw err;
    }
  }

  private async handlePaymentConfirmed(payload: any) {
    const asaasPaymentId = payload.payment?.id;
    if (!asaasPaymentId) return;

    const invoice = await this.masterPrisma.invoice.findUnique({
      where: { asaasPaymentId },
    });
    if (!invoice) return;

    await this.masterPrisma.invoice.update({
      where: { id: invoice.id },
      data: {
        status: 'CONFIRMED',
        paidAt: new Date(),
        netValue: payload.payment?.netValue,
      },
    });

    const customer = await this.masterPrisma.billingCustomer.findUnique({
      where: { id: invoice.billingCustomerId },
    });

    await this.masterPrisma.adminNotification.create({
      data: {
        type: 'PAYMENT_RECEIVED',
        title: 'Pagamento recebido',
        message: `Pagamento de R$ ${Number(invoice.value).toFixed(2)} confirmado.`,
        companyId: customer?.companyId,
        metadata: { invoiceId: invoice.id, value: Number(invoice.value) },
      },
    });
  }

  private async handlePaymentOverdue(payload: any) {
    const asaasPaymentId = payload.payment?.id;
    if (!asaasPaymentId) return;

    const invoice = await this.masterPrisma.invoice.findUnique({
      where: { asaasPaymentId },
    });
    if (!invoice) return;

    await this.masterPrisma.invoice.update({
      where: { id: invoice.id },
      data: { status: 'OVERDUE' },
    });

    const customer = await this.masterPrisma.billingCustomer.findUnique({
      where: { id: invoice.billingCustomerId },
    });

    await this.masterPrisma.adminNotification.create({
      data: {
        type: 'PAYMENT_OVERDUE',
        title: 'Pagamento vencido',
        message: `Cobrança de R$ ${Number(invoice.value).toFixed(2)} está vencida.`,
        companyId: customer?.companyId,
      },
    });
  }

  private async handlePaymentRefunded(payload: any) {
    const asaasPaymentId = payload.payment?.id;
    if (!asaasPaymentId) return;

    await this.masterPrisma.invoice.updateMany({
      where: { asaasPaymentId },
      data: { status: 'REFUNDED' },
    });
  }

  // ── Métricas Financeiras ──────────────────────────────────────────────────

  async getFinancialMetrics() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      activeSubscriptions,
      totalCompanies,
      activeCompanies,
      invoicesThisMonth,
      invoicesLastMonth,
      paidThisMonth,
      overdueInvoices,
      recentInvoices,
    ] = await Promise.all([
      this.masterPrisma.billingSubscription.findMany({
        where: { status: 'ACTIVE' },
        include: { plan: true },
      }),
      this.masterPrisma.company.count(),
      this.masterPrisma.company.count({ where: { isActive: true } }),
      this.masterPrisma.invoice.findMany({
        where: { createdAt: { gte: startOfMonth } },
      }),
      this.masterPrisma.invoice.findMany({
        where: {
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
      }),
      this.masterPrisma.invoice.findMany({
        where: {
          paidAt: { gte: startOfMonth },
          status: { in: ['CONFIRMED', 'RECEIVED'] },
        },
      }),
      this.masterPrisma.invoice.count({
        where: { status: 'OVERDUE' },
      }),
      this.masterPrisma.invoice.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: {
          billingCustomer: {
            select: { company: { select: { name: true } } },
          },
        },
      }),
    ]);

    // MRR (Monthly Recurring Revenue)
    const mrr = activeSubscriptions.reduce(
      (acc, s) => acc + Number(s.value),
      0,
    );

    // ARR
    const arr = mrr * 12;

    // Receita deste mês
    const revenueThisMonth = paidThisMonth.reduce(
      (acc, i) => acc + Number(i.value),
      0,
    );

    // Receita mês passado
    const revenueLastMonth = invoicesLastMonth
      .filter((i) => ['CONFIRMED', 'RECEIVED'].includes(i.status))
      .reduce((acc, i) => acc + Number(i.value), 0);

    // Crescimento
    const revenueGrowth =
      revenueLastMonth > 0
        ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100
        : 0;

    // Churn (empresas que cancelaram no mês)
    const cancelledThisMonth = await this.masterPrisma.billingSubscription.count({
      where: { status: 'INACTIVE', updatedAt: { gte: startOfMonth } },
    });

    const churnRate =
      activeSubscriptions.length > 0
        ? (cancelledThisMonth /
            (activeSubscriptions.length + cancelledThisMonth)) *
          100
        : 0;

    // Breakdown por plano
    const planBreakdown = activeSubscriptions.reduce(
      (acc, sub) => {
        const planName = sub.plan.name;
        if (!acc[planName]) acc[planName] = { count: 0, revenue: 0 };
        acc[planName].count += 1;
        acc[planName].revenue += Number(sub.value);
        return acc;
      },
      {} as Record<string, { count: number; revenue: number }>,
    );

    return {
      mrr,
      arr,
      revenueThisMonth,
      revenueLastMonth,
      revenueGrowth: Math.round(revenueGrowth * 100) / 100,
      churnRate: Math.round(churnRate * 100) / 100,
      totalCompanies,
      activeCompanies,
      activeSubscriptions: activeSubscriptions.length,
      overdueInvoices,
      invoicesThisMonth: invoicesThisMonth.length,
      planBreakdown,
      recentInvoices: recentInvoices.map((i) => ({
        id: i.id,
        company: i.billingCustomer?.company?.name ?? 'N/A',
        value: Number(i.value),
        status: i.status,
        billingType: i.billingType,
        dueDate: i.dueDate,
        paidAt: i.paidAt,
      })),
    };
  }
}
