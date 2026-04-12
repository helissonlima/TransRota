'use client';

import { useQuery } from '@tanstack/react-query';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  AlertTriangle,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  CircleDollarSign,
  Receipt,
} from 'lucide-react';
import adminApi from '@/lib/admin-api';
import { cn } from '@/lib/cn';

interface Metrics {
  mrr: number;
  arr: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
  revenueGrowth: number;
  churnRate: number;
  totalCompanies: number;
  activeCompanies: number;
  activeSubscriptions: number;
  overdueInvoices: number;
  invoicesThisMonth: number;
  planBreakdown: Record<string, { count: number; revenue: number }>;
  recentInvoices: {
    id: string;
    company: string;
    value: number;
    status: string;
    billingType: string;
    dueDate: string;
    paidAt: string | null;
  }[];
}

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Pendente', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  CONFIRMED: { label: 'Pago', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  RECEIVED: { label: 'Recebido', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  OVERDUE: { label: 'Vencido', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
  REFUNDED: { label: 'Estornado', color: 'text-gray-400 bg-gray-500/10 border-gray-500/20' },
};

const billingTypeLabels: Record<string, string> = {
  BOLETO: 'Boleto',
  CREDIT_CARD: 'Cartão',
  PIX: 'Pix',
  UNDEFINED: '—',
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export default function AdminBillingPage() {
  const { data: metrics, isLoading } = useQuery<Metrics>({
    queryKey: ['admin', 'billing', 'metrics'],
    queryFn: async () => {
      const { data } = await adminApi.get('/admin/billing/metrics');
      return data;
    },
  });

  if (isLoading || !metrics) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      label: 'MRR',
      value: formatCurrency(metrics.mrr),
      sub: `ARR: ${formatCurrency(metrics.arr)}`,
      icon: CircleDollarSign,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      label: 'Receita do Mês',
      value: formatCurrency(metrics.revenueThisMonth),
      sub: `Mês anterior: ${formatCurrency(metrics.revenueLastMonth)}`,
      icon: DollarSign,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      trend: metrics.revenueGrowth,
    },
    {
      label: 'Assinaturas Ativas',
      value: metrics.activeSubscriptions,
      sub: `${metrics.activeCompanies} de ${metrics.totalCompanies} empresas`,
      icon: CreditCard,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
    {
      label: 'Churn Rate',
      value: `${metrics.churnRate}%`,
      sub: `${metrics.overdueInvoices} cobranças vencidas`,
      icon: metrics.churnRate > 5 ? AlertTriangle : BarChart3,
      color: metrics.churnRate > 5 ? 'text-red-400' : 'text-cyan-400',
      bg: metrics.churnRate > 5 ? 'bg-red-500/10' : 'bg-cyan-500/10',
    },
  ];

  const planEntries = Object.entries(metrics.planBreakdown);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-white text-2xl font-bold">Financeiro</h1>
        <p className="text-[#64748b] text-sm mt-0.5">Métricas de receita, assinaturas e cobranças</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(({ label, value, sub, icon: Icon, color, bg, trend }) => (
          <div key={label} className="bg-[#0b1120] border border-[#1e2d4a] rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', bg)}>
                <Icon className={cn('w-5 h-5', color)} />
              </div>
              {trend !== undefined && (
                <span
                  className={cn(
                    'inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded',
                    trend >= 0
                      ? 'text-emerald-400 bg-emerald-500/10'
                      : 'text-red-400 bg-red-500/10',
                  )}
                >
                  {trend >= 0 ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {Math.abs(trend)}%
                </span>
              )}
            </div>
            <p className="text-[#64748b] text-xs mt-3 mb-1">{label}</p>
            <p className="text-white text-2xl font-bold">{value}</p>
            <p className="text-[#475569] text-[11px] mt-1">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Breakdown por plano */}
        <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-xl p-5 xl:col-span-1">
          <h2 className="text-white font-semibold text-sm mb-4">Distribuição por Plano</h2>
          {planEntries.length === 0 ? (
            <p className="text-[#64748b] text-sm">Nenhuma assinatura ativa</p>
          ) : (
            <div className="space-y-3">
              {planEntries.map(([name, data]) => {
                const pct =
                  metrics.activeSubscriptions > 0
                    ? Math.round((data.count / metrics.activeSubscriptions) * 100)
                    : 0;
                return (
                  <div key={name}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-[#94a3b8]">{name}</span>
                      <span className="text-white font-medium">
                        {data.count} · {formatCurrency(data.revenue)}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#1e2d4a] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Últimas cobranças */}
        <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-xl overflow-hidden xl:col-span-2">
          <div className="px-5 py-4 border-b border-[#1e2d4a] flex items-center justify-between">
            <h2 className="text-white font-semibold text-sm">Últimas Cobranças</h2>
            <span className="text-[#64748b] text-xs">{metrics.invoicesThisMonth} este mês</span>
          </div>

          {metrics.recentInvoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-[#64748b]">
              <Receipt className="w-8 h-8 mb-2 opacity-40" />
              <p className="text-sm">Nenhuma cobrança encontrada</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1e2d4a]">
                    {['Empresa', 'Valor', 'Tipo', 'Vencimento', 'Status'].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs text-[#64748b] font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {metrics.recentInvoices.map((inv) => {
                    const st = statusLabels[inv.status] ?? {
                      label: inv.status,
                      color: 'text-gray-400 bg-gray-500/10 border-gray-500/20',
                    };
                    return (
                      <tr
                        key={inv.id}
                        className="border-b border-[#1e2d4a]/50 hover:bg-[#0f1a2e]/50 transition-colors"
                      >
                        <td className="px-5 py-3 text-white">{inv.company}</td>
                        <td className="px-5 py-3 text-white font-medium">
                          {formatCurrency(inv.value)}
                        </td>
                        <td className="px-5 py-3 text-[#94a3b8]">
                          {billingTypeLabels[inv.billingType] ?? inv.billingType}
                        </td>
                        <td className="px-5 py-3 text-[#94a3b8] text-xs">
                          {new Date(inv.dueDate).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={cn(
                              'inline-flex items-center px-2 py-0.5 rounded-full text-xs border',
                              st.color,
                            )}
                          >
                            {st.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
