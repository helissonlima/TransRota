import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface AsaasCustomerPayload {
  name: string;
  cpfCnpj: string;
  email: string;
  phone?: string;
  postalCode?: string;
  address?: string;
  addressNumber?: string;
  complement?: string;
  province?: string;
  externalReference?: string;
}

export interface AsaasPaymentPayload {
  customer: string; // asaasCustomerId
  billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX' | 'UNDEFINED';
  value: number;
  dueDate: string; // YYYY-MM-DD
  description?: string;
  externalReference?: string;
  postalService?: boolean;
}

export interface AsaasSubscriptionPayload {
  customer: string;
  billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX' | 'UNDEFINED';
  value: number;
  nextDueDate: string; // YYYY-MM-DD
  cycle: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'SEMIANNUALLY' | 'YEARLY';
  description?: string;
  externalReference?: string;
}

interface AsaasResponse<T = any> {
  ok: boolean;
  data?: T;
  error?: string;
}

@Injectable()
export class AsaasClient {
  private readonly logger = new Logger(AsaasClient.name);
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(private readonly config: ConfigService) {
    const env = this.config.get<string>('ASAAS_ENVIRONMENT', 'sandbox');
    this.baseUrl =
      env === 'production'
        ? 'https://api.asaas.com/v3'
        : 'https://sandbox.asaas.com/api/v3';
    this.apiKey = this.config.get<string>('ASAAS_API_KEY', '');
  }

  private get headers() {
    return {
      'Content-Type': 'application/json',
      access_token: this.apiKey,
    };
  }

  private async request<T>(
    method: string,
    path: string,
    body?: any,
  ): Promise<AsaasResponse<T>> {
    if (!this.apiKey) {
      this.logger.warn('ASAAS_API_KEY não configurada — operação simulada');
      return { ok: false, error: 'ASAAS_API_KEY não configurada' };
    }

    try {
      const url = `${this.baseUrl}${path}`;
      const res = await fetch(url, {
        method,
        headers: this.headers,
        ...(body ? { body: JSON.stringify(body) } : {}),
      });

      const data = await res.json();

      if (!res.ok) {
        this.logger.error(`Asaas ${method} ${path} → ${res.status}`, data);
        return {
          ok: false,
          error: data?.errors?.[0]?.description ?? `HTTP ${res.status}`,
        };
      }

      return { ok: true, data };
    } catch (err: any) {
      this.logger.error(`Asaas request failed: ${err.message}`);
      return { ok: false, error: err.message };
    }
  }

  // ── Clientes ──────────────────────────────────────────────────────────────

  async createCustomer(payload: AsaasCustomerPayload) {
    return this.request<any>('POST', '/customers', payload);
  }

  async updateCustomer(asaasId: string, payload: Partial<AsaasCustomerPayload>) {
    return this.request<any>('PUT', `/customers/${asaasId}`, payload);
  }

  async getCustomer(asaasId: string) {
    return this.request<any>('GET', `/customers/${asaasId}`);
  }

  // ── Cobranças ─────────────────────────────────────────────────────────────

  async createPayment(payload: AsaasPaymentPayload) {
    return this.request<any>('POST', '/payments', payload);
  }

  async getPayment(asaasId: string) {
    return this.request<any>('GET', `/payments/${asaasId}`);
  }

  async listPaymentsByCustomer(customerId: string) {
    return this.request<any>('GET', `/payments?customer=${customerId}`);
  }

  async deletePayment(asaasId: string) {
    return this.request<any>('DELETE', `/payments/${asaasId}`);
  }

  // ── Assinaturas ───────────────────────────────────────────────────────────

  async createSubscription(payload: AsaasSubscriptionPayload) {
    return this.request<any>('POST', '/subscriptions', payload);
  }

  async getSubscription(asaasId: string) {
    return this.request<any>('GET', `/subscriptions/${asaasId}`);
  }

  async updateSubscription(
    asaasId: string,
    payload: Partial<AsaasSubscriptionPayload>,
  ) {
    return this.request<any>('PUT', `/subscriptions/${asaasId}`, payload);
  }

  async cancelSubscription(asaasId: string) {
    return this.request<any>('DELETE', `/subscriptions/${asaasId}`);
  }

  async listSubscriptionPayments(subscriptionId: string) {
    return this.request<any>(
      'GET',
      `/subscriptions/${subscriptionId}/payments`,
    );
  }

  // ── Pix QR Code ───────────────────────────────────────────────────────────

  async getPixQrCode(paymentId: string) {
    return this.request<any>('GET', `/payments/${paymentId}/pixQrCode`);
  }
}
