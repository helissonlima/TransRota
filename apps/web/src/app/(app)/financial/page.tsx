'use client';

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, TrendingDown, DollarSign, AlertCircle, CheckCircle2,
  Clock, Plus, Pencil, Trash2, ChevronDown, Wallet, Receipt,
  Users, BarChart3, ArrowUpCircle, ArrowDownCircle, X, Building2,
  Car, User, CreditCard, Filter, Download, RefreshCw, Award,
  BadgeCheck, Ban, Hourglass, CircleDollarSign, PiggyBank,
} from 'lucide-react';
import { toast } from 'sonner';
import { format, parseISO, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid, Legend,
} from 'recharts';
import api from '@/lib/api';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { StatCard } from '@/components/ui/stat-card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/cn';

// ─── Types ─────────────────────────────────────────────────────────────────

type TabId = 'overview' | 'payables' | 'receivables' | 'commissions' | 'cashflow' | 'costcenters';

interface DashboardSummary {
  totalPayables: number; totalReceivables: number;
  paidPayables: number; receivedReceivables: number;
  pendingPayables: number; pendingReceivables: number;
  balance: number; overdueCount: number; overdueValue: number;
}

interface CashFlowPoint { month: string; receitas: number; despesas: number }
interface ExpenseCategory { category: string; value: number }

interface FinancialEntry {
  id: string; type: 'PAYABLE' | 'RECEIVABLE'; category: string;
  description: string; amount: number; dueDate: string;
  paymentDate?: string; status: string; paymentMethod?: string;
  documentNumber?: string; notes?: string;
  costCenter?: { id: string; name: string; code: string };
  vehicle?: { id: string; plate: string; model: string };
  driver?: { id: string; name: string };
}

interface Commission {
  id: string; driverId: string; period: string;
  routeCount: number; baseAmount: number; percentage: number;
  amount: number; bonus?: number; deductions?: number;
  netAmount: number; status: string; paidAt?: string; notes?: string;
  driver: { id: string; name: string; cpf: string };
}

interface CostCenter { id: string; name: string; code: string; description?: string; isActive: boolean }
interface Driver { id: string; name: string; cpf: string }
interface Vehicle { id: string; plate: string; model: string; brand: string }

// ─── Constants ─────────────────────────────────────────────────────────────

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'overview',     label: 'Visão Geral',     icon: BarChart3 },
  { id: 'payables',     label: 'Contas a Pagar',  icon: ArrowDownCircle },
  { id: 'receivables',  label: 'Contas a Receber', icon: ArrowUpCircle },
  { id: 'commissions',  label: 'Comissões',        icon: Award },
  { id: 'cashflow',     label: 'Fluxo de Caixa',  icon: TrendingUp },
  { id: 'costcenters',  label: 'Centro de Custos', icon: Building2 },
];

const CATEGORY_LABELS: Record<string, string> = {
  FUEL: 'Combustível', MAINTENANCE: 'Manutenção', INSURANCE: 'Seguro',
  TAX: 'Tributos', TOLL: 'Pedágio', SALARY: 'Salários', COMMISSION: 'Comissão',
  SUPPLIER: 'Fornecedor', RENT: 'Aluguel', UTILITIES: 'Utilidades',
  SERVICE: 'Serviços', CONTRACT: 'Contrato', BONUS: 'Bônus',
  REIMBURSEMENT: 'Reembolso', OTHER: 'Outros',
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  CASH: 'Dinheiro', BANK_TRANSFER: 'Transferência', PIX: 'PIX',
  CREDIT_CARD: 'Cartão de Crédito', DEBIT_CARD: 'Cartão de Débito',
  BOLETO: 'Boleto', CHECK: 'Cheque',
};

const STATUS_CONFIG: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'gray' }> = {
  PENDING:   { label: 'Pendente',   variant: 'warning' },
  PAID:      { label: 'Pago',       variant: 'success' },
  RECEIVED:  { label: 'Recebido',   variant: 'success' },
  OVERDUE:   { label: 'Vencido',    variant: 'danger'  },
  CANCELLED: { label: 'Cancelado',  variant: 'gray'    },
  PARTIAL:   { label: 'Parcial',    variant: 'info'    },
  APPROVED:  { label: 'Aprovado',   variant: 'info'    },
};

const COMMISSION_STATUS_CONFIG: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'gray'; icon: React.ElementType }> = {
  PENDING:   { label: 'Pendente',   variant: 'warning', icon: Hourglass    },
  APPROVED:  { label: 'Aprovado',   variant: 'info',    icon: BadgeCheck   },
  PAID:      { label: 'Pago',       variant: 'success', icon: CheckCircle2 },
  CANCELLED: { label: 'Cancelado',  variant: 'gray',    icon: Ban          },
};

const PIE_COLORS = ['#6366f1','#22c55e','#f59e0b','#ef4444','#3b82f6','#8b5cf6','#ec4899','#14b8a6'];

const PAYABLE_CATEGORIES = ['FUEL','MAINTENANCE','INSURANCE','TAX','TOLL','SALARY','COMMISSION','SUPPLIER','RENT','UTILITIES','OTHER'];
const RECEIVABLE_CATEGORIES = ['SERVICE','CONTRACT','BONUS','REIMBURSEMENT','OTHER'];
const PAYMENT_METHODS = ['CASH','BANK_TRANSFER','PIX','CREDIT_CARD','DEBIT_CARD','BOLETO','CHECK'];

// ─── Helpers ────────────────────────────────────────────────────────────────

const fmtCurrency = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const fmtMonth = (ym: string) => {
  const [y, m] = ym.split('-');
  return format(new Date(+y, +m - 1, 1), 'MMM/yy', { locale: ptBR });
};

const currentPeriod = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

// ─── Schemas ─────────────────────────────────────────────────────────────────

const entrySchema = z.object({
  type: z.enum(['PAYABLE', 'RECEIVABLE']),
  category: z.string().min(1, 'Selecione uma categoria'),
  description: z.string().min(3, 'Mínimo 3 caracteres'),
  amount: z.coerce.number().min(0.01, 'Valor inválido'),
  dueDate: z.string().min(1, 'Data de vencimento obrigatória'),
  paymentDate: z.string().optional(),
  paymentMethod: z.string().optional(),
  documentNumber: z.string().optional(),
  costCenterId: z.string().optional(),
  vehicleId: z.string().optional(),
  driverId: z.string().optional(),
  notes: z.string().optional(),
});
type EntryFormData = z.infer<typeof entrySchema>;

const commissionSchema = z.object({
  driverId: z.string().min(1, 'Selecione um motorista'),
  period: z.string().regex(/^\d{4}-\d{2}$/, 'Formato YYYY-MM'),
  routeCount: z.coerce.number().min(0),
  baseAmount: z.coerce.number().min(0.01, 'Valor base inválido'),
  percentage: z.coerce.number().min(0).max(100),
  bonus: z.coerce.number().min(0).optional(),
  deductions: z.coerce.number().min(0).optional(),
  notes: z.string().optional(),
});
type CommissionFormData = z.infer<typeof commissionSchema>;

const costCenterSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  code: z.string().min(1, 'Código obrigatório').regex(/^[A-Z0-9_-]+$/, 'Use apenas letras maiúsculas, números, hífens e underscores'),
  description: z.string().optional(),
});
type CostCenterFormData = z.infer<typeof costCenterSchema>;

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionHeader({ title, description, action }: {
  title: string; description?: string; action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h2 className="text-lg font-bold text-brand-text-primary">{title}</h2>
        {description && <p className="text-sm text-brand-text-secondary mt-0.5">{description}</p>}
      </div>
      {action}
    </div>
  );
}

function EmptyState({ icon: Icon, title, description }: {
  icon: React.ElementType; title: string; description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-slate-400" />
      </div>
      <p className="font-semibold text-brand-text-primary">{title}</p>
      <p className="text-sm text-brand-text-secondary mt-1 max-w-xs">{description}</p>
    </div>
  );
}

function FormField({ label, error, children, required, colSpan }: {
  label: string; error?: string; children: React.ReactNode; required?: boolean; colSpan?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-1', colSpan)}>
      <label className="text-xs font-medium text-brand-text-secondary">
        {label}{required && <span className="text-danger-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-danger-500">{error}</p>}
    </div>
  );
}

const inputCls = 'w-full h-9 px-3 text-sm border border-brand-border rounded-lg bg-white text-brand-text-primary placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400';
const selectCls = cn(inputCls, 'appearance-none cursor-pointer');

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab({ month }: { month: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['financial-dashboard', month],
    queryFn: () => api.get(`/financial/dashboard?month=${month}`).then(r => r.data),
  });

  const summary: DashboardSummary = data?.summary ?? {};
  const cashFlow: CashFlowPoint[] = data?.cashFlow ?? [];
  const expenseByCategory: ExpenseCategory[] = data?.expenseByCategory ?? [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
    );
  }

  const balance = summary.balance ?? 0;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Receitas do Mês"
          value={summary.totalReceivables ?? 0}
          icon={ArrowUpCircle}
          iconColor="emerald"
          prefix="R$ "
          formatter={v => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(v)}
        />
        <StatCard
          title="Despesas do Mês"
          value={summary.totalPayables ?? 0}
          icon={ArrowDownCircle}
          iconColor="rose"
          prefix="R$ "
          formatter={v => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(v)}
        />
        <StatCard
          title="Saldo Líquido"
          value={Math.abs(balance)}
          icon={balance >= 0 ? TrendingUp : TrendingDown}
          iconColor={balance >= 0 ? 'emerald' : 'rose'}
          prefix={balance < 0 ? '-R$ ' : 'R$ '}
          formatter={v => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(v)}
        />
        <StatCard
          title="Contas Vencidas"
          value={summary.overdueCount ?? 0}
          subtitle={`${fmtCurrency(summary.overdueValue ?? 0)} em atraso`}
          icon={AlertCircle}
          iconColor="orange"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="A Pagar"
          value={summary.pendingPayables ?? 0}
          icon={Clock}
          iconColor="amber"
          prefix="R$ "
          formatter={v => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(v)}
        />
        <StatCard
          title="Pago"
          value={summary.paidPayables ?? 0}
          icon={CheckCircle2}
          iconColor="emerald"
          prefix="R$ "
          formatter={v => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(v)}
        />
        <StatCard
          title="A Receber"
          value={summary.pendingReceivables ?? 0}
          icon={CircleDollarSign}
          iconColor="blue"
          prefix="R$ "
          formatter={v => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(v)}
        />
        <StatCard
          title="Recebido"
          value={summary.receivedReceivables ?? 0}
          icon={PiggyBank}
          iconColor="violet"
          prefix="R$ "
          formatter={v => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(v)}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Cash flow chart */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-brand-border p-5 shadow-card">
          <h3 className="text-sm font-bold text-brand-text-primary mb-4">Fluxo de Caixa — Últimos 12 Meses</h3>
          {cashFlow.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-sm text-brand-text-secondary">
              Sem dados para exibir
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={cashFlow} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradRec" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradDes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tickFormatter={fmtMonth} tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(v: number, name: string) => [fmtCurrency(v), name === 'receitas' ? 'Receitas' : 'Despesas']}
                  labelFormatter={fmtMonth}
                />
                <Area type="monotone" dataKey="receitas" stroke="#22c55e" strokeWidth={2} fill="url(#gradRec)" />
                <Area type="monotone" dataKey="despesas" stroke="#ef4444" strokeWidth={2} fill="url(#gradDes)" />
                <Legend formatter={v => v === 'receitas' ? 'Receitas' : 'Despesas'} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Expense by category */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-brand-border p-5 shadow-card">
          <h3 className="text-sm font-bold text-brand-text-primary mb-4">Despesas por Categoria</h3>
          {expenseByCategory.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-sm text-brand-text-secondary">
              Sem dados para exibir
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={expenseByCategory}
                    cx="50%" cy="50%"
                    innerRadius={45} outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {expenseByCategory.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => fmtCurrency(v)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {expenseByCategory.slice(0, 5).map((e, i) => (
                  <div key={e.category} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-brand-text-secondary truncate max-w-[100px]">{CATEGORY_LABELS[e.category] ?? e.category}</span>
                    </div>
                    <span className="font-semibold text-brand-text-primary">{fmtCurrency(e.value)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Entries Table (shared for payables/receivables) ──────────────────────────

function EntriesTab({ type }: { type: 'PAYABLE' | 'RECEIVABLE' }) {
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<FinancialEntry | null>(null);
  const [statusFilter, setStatusFilter] = useState('');

  const { data: entries = [], isLoading } = useQuery<FinancialEntry[]>({
    queryKey: ['financial-entries', type, statusFilter],
    queryFn: () =>
      api.get(`/financial/entries?type=${type}${statusFilter ? `&status=${statusFilter}` : ''}`).then(r => r.data),
  });

  const { data: vehicles = [] } = useQuery<Vehicle[]>({
    queryKey: ['vehicles-list'],
    queryFn: () => api.get('/fleet').then(r => r.data?.data ?? r.data ?? []),
  });

  const { data: driversData = [] } = useQuery<Driver[]>({
    queryKey: ['drivers-list'],
    queryFn: () => api.get('/drivers').then(r => r.data?.data ?? r.data ?? []),
  });

  const { data: costCenters = [] } = useQuery<CostCenter[]>({
    queryKey: ['cost-centers'],
    queryFn: () => api.get('/financial/cost-centers').then(r => r.data),
  });

  const form = useForm<EntryFormData>({
    resolver: zodResolver(entrySchema),
    defaultValues: { type },
  });

  const watchCategory = form.watch('category');

  const createMutation = useMutation({
    mutationFn: (data: EntryFormData) => api.post('/financial/entries', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['financial-entries'] });
      qc.invalidateQueries({ queryKey: ['financial-dashboard'] });
      setShowModal(false);
      form.reset({ type });
      toast.success('Lançamento criado com sucesso!');
    },
    onError: (e: any) => toast.error(e.response?.data?.message ?? 'Erro ao criar lançamento'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EntryFormData> }) =>
      api.patch(`/financial/entries/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['financial-entries'] });
      qc.invalidateQueries({ queryKey: ['financial-dashboard'] });
      setEditing(null);
      setShowModal(false);
      form.reset({ type });
      toast.success('Lançamento atualizado!');
    },
    onError: (e: any) => toast.error(e.response?.data?.message ?? 'Erro ao atualizar'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/financial/entries/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['financial-entries'] });
      qc.invalidateQueries({ queryKey: ['financial-dashboard'] });
      toast.success('Lançamento removido');
    },
    onError: (e: any) => toast.error(e.response?.data?.message ?? 'Erro ao remover'),
  });

  const openNew = () => {
    form.reset({ type });
    setEditing(null);
    setShowModal(true);
  };

  const openEdit = (entry: FinancialEntry) => {
    setEditing(entry);
    form.reset({
      type: entry.type,
      category: entry.category,
      description: entry.description,
      amount: entry.amount,
      dueDate: entry.dueDate?.slice(0, 10),
      paymentDate: entry.paymentDate?.slice(0, 10) ?? undefined,
      paymentMethod: entry.paymentMethod ?? undefined,
      documentNumber: entry.documentNumber ?? undefined,
      costCenterId: entry.costCenter?.id ?? undefined,
      vehicleId: entry.vehicle?.id ?? undefined,
      driverId: entry.driver?.id ?? undefined,
      notes: entry.notes ?? undefined,
    });
    setShowModal(true);
  };

  const onSubmit = (data: EntryFormData) => {
    if (editing) {
      updateMutation.mutate({ id: editing.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const categories = type === 'PAYABLE' ? PAYABLE_CATEGORIES : RECEIVABLE_CATEGORIES;
  const isPayable = type === 'PAYABLE';
  const title = isPayable ? 'Contas a Pagar' : 'Contas a Receber';
  const description = isPayable
    ? 'Controle de despesas, fornecedores e obrigações financeiras'
    : 'Receitas, contratos e valores a receber';

  const totalPending = entries
    .filter(e => e.status === 'PENDING' || e.status === 'OVERDUE')
    .reduce((s, e) => s + Number(e.amount), 0);

  const totalPaid = entries
    .filter(e => e.status === 'PAID' || e.status === 'RECEIVED')
    .reduce((s, e) => s + Number(e.amount), 0);

  return (
    <div>
      <SectionHeader
        title={title}
        description={description}
        action={
          <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={openNew}>
            {isPayable ? 'Nova Despesa' : 'Nova Receita'}
          </Button>
        }
      />

      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className={cn('rounded-xl p-4 border', isPayable ? 'bg-orange-50 border-orange-100' : 'bg-emerald-50 border-emerald-100')}>
          <p className="text-xs text-brand-text-secondary mb-1">{isPayable ? 'Pendente a Pagar' : 'Pendente a Receber'}</p>
          <p className={cn('text-xl font-bold', isPayable ? 'text-orange-600' : 'text-emerald-600')}>{fmtCurrency(totalPending)}</p>
        </div>
        <div className="rounded-xl p-4 border bg-green-50 border-green-100">
          <p className="text-xs text-brand-text-secondary mb-1">{isPayable ? 'Total Pago' : 'Total Recebido'}</p>
          <p className="text-xl font-bold text-green-600">{fmtCurrency(totalPaid)}</p>
        </div>
        <div className="rounded-xl p-4 border bg-slate-50 border-slate-100">
          <p className="text-xs text-brand-text-secondary mb-1">Total de Lançamentos</p>
          <p className="text-xl font-bold text-brand-text-primary">{entries.length}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4 text-brand-text-secondary flex-shrink-0" />
        <span className="text-xs text-brand-text-secondary font-medium">Filtrar por status:</span>
        {['', 'PENDING', 'PAID', 'RECEIVED', 'OVERDUE', 'CANCELLED'].map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={cn(
              'text-xs px-3 py-1.5 rounded-full border transition-colors',
              statusFilter === s
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-brand-text-secondary border-brand-border hover:border-slate-300',
            )}
          >
            {s === '' ? 'Todos' : STATUS_CONFIG[s]?.label ?? s}
          </button>
        ))}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
        </div>
      ) : entries.length === 0 ? (
        <EmptyState
          icon={isPayable ? ArrowDownCircle : ArrowUpCircle}
          title={`Nenhum lançamento${statusFilter ? ' com esse status' : ''}`}
          description={`Cadastre ${isPayable ? 'uma despesa' : 'uma receita'} para começar a controlar suas finanças`}
        />
      ) : (
        <div className="rounded-2xl border border-brand-border overflow-hidden shadow-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-brand-border">
                <th className="px-4 py-3 text-left text-xs font-semibold text-brand-text-secondary">Descrição</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-brand-text-secondary">Categoria</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-brand-text-secondary">Vencimento</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-brand-text-secondary">Valor</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-brand-text-secondary">Status</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-brand-text-secondary">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60">
              {entries.map(entry => {
                const overdue = entry.status === 'PENDING' && isPast(parseISO(entry.dueDate));
                const statusKey = overdue ? 'OVERDUE' : entry.status;
                const cfg = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG['PENDING'];
                return (
                  <tr key={entry.id} className="bg-white hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-brand-text-primary truncate max-w-[200px]">{entry.description}</p>
                      {entry.documentNumber && (
                        <p className="text-xs text-brand-text-secondary">NF/Doc: {entry.documentNumber}</p>
                      )}
                      {(entry.vehicle || entry.driver) && (
                        <div className="flex items-center gap-2 mt-0.5">
                          {entry.vehicle && (
                            <span className="text-xs text-blue-600 flex items-center gap-0.5">
                              <Car className="w-3 h-3" />{entry.vehicle.plate}
                            </span>
                          )}
                          {entry.driver && (
                            <span className="text-xs text-violet-600 flex items-center gap-0.5">
                              <User className="w-3 h-3" />{entry.driver.name.split(' ')[0]}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-brand-text-secondary whitespace-nowrap">
                      {CATEGORY_LABELS[entry.category] ?? entry.category}
                    </td>
                    <td className={cn('px-4 py-3 text-xs whitespace-nowrap', overdue ? 'text-danger-600 font-semibold' : 'text-brand-text-secondary')}>
                      {format(parseISO(entry.dueDate), 'dd/MM/yyyy')}
                      {overdue && <div className="text-danger-500">Vencido</div>}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-brand-text-primary whitespace-nowrap">
                      {fmtCurrency(Number(entry.amount))}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={cfg.variant}>{cfg.label}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openEdit(entry)}
                          className="p-1.5 rounded-lg text-brand-text-tertiary hover:bg-slate-100 hover:text-primary-600 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Remover este lançamento?')) deleteMutation.mutate(entry.id);
                          }}
                          className="p-1.5 rounded-lg text-brand-text-tertiary hover:bg-danger-50 hover:text-danger-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <Modal
        open={showModal}
        onClose={() => { setShowModal(false); setEditing(null); form.reset({ type }); }}
        title={editing ? 'Editar Lançamento' : (isPayable ? 'Nova Despesa' : 'Nova Receita')}
        size="xl"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button
              size="sm"
              loading={createMutation.isPending || updateMutation.isPending}
              onClick={form.handleSubmit(onSubmit)}
            >
              {editing ? 'Salvar Alterações' : 'Criar Lançamento'}
            </Button>
          </div>
        }
      >
        <form className="grid grid-cols-2 gap-4 p-1">
          <FormField label="Descrição" required error={form.formState.errors.description?.message} colSpan="col-span-2">
            <input {...form.register('description')} className={inputCls} placeholder="Ex: Combustível veículo ABC-1234" />
          </FormField>

          <FormField label="Categoria" required error={form.formState.errors.category?.message}>
            <select {...form.register('category')} className={selectCls}>
              <option value="">Selecione...</option>
              {categories.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c] ?? c}</option>)}
            </select>
          </FormField>

          <FormField label="Valor (R$)" required error={form.formState.errors.amount?.message}>
            <input {...form.register('amount')} type="number" step="0.01" min="0" className={inputCls} placeholder="0,00" />
          </FormField>

          <FormField label="Data de Vencimento" required error={form.formState.errors.dueDate?.message}>
            <input {...form.register('dueDate')} type="date" className={inputCls} />
          </FormField>

          <FormField label={isPayable ? 'Data de Pagamento' : 'Data de Recebimento'} error={form.formState.errors.paymentDate?.message}>
            <input {...form.register('paymentDate')} type="date" className={inputCls} />
          </FormField>

          <FormField label="Forma de Pagamento">
            <select {...form.register('paymentMethod')} className={selectCls}>
              <option value="">Selecione...</option>
              {PAYMENT_METHODS.map(m => <option key={m} value={m}>{PAYMENT_METHOD_LABELS[m]}</option>)}
            </select>
          </FormField>

          <FormField label="Nº Documento / NF">
            <input {...form.register('documentNumber')} className={inputCls} placeholder="Número da nota fiscal ou recibo" />
          </FormField>

          <FormField label="Centro de Custo">
            <select {...form.register('costCenterId')} className={selectCls}>
              <option value="">Nenhum</option>
              {costCenters.map((cc: CostCenter) => (
                <option key={cc.id} value={cc.id}>{cc.code} — {cc.name}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Veículo">
            <select {...form.register('vehicleId')} className={selectCls}>
              <option value="">Nenhum</option>
              {vehicles.map((v: Vehicle) => (
                <option key={v.id} value={v.id}>{v.plate} — {v.brand} {v.model}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Motorista">
            <select {...form.register('driverId')} className={selectCls}>
              <option value="">Nenhum</option>
              {driversData.map((d: Driver) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Observações" colSpan="col-span-2">
            <textarea {...form.register('notes')} rows={2} className={cn(inputCls, 'h-auto resize-none py-2')} placeholder="Observações opcionais..." />
          </FormField>
        </form>
      </Modal>
    </div>
  );
}

// ─── Commissions Tab ──────────────────────────────────────────────────────────

function CommissionsTab() {
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Commission | null>(null);
  const [periodFilter, setPeriodFilter] = useState(currentPeriod());

  const { data: commissions = [], isLoading } = useQuery<Commission[]>({
    queryKey: ['commissions', periodFilter],
    queryFn: () => api.get(`/commissions${periodFilter ? `?period=${periodFilter}` : ''}`).then(r => r.data),
  });

  const { data: summary } = useQuery({
    queryKey: ['commissions-summary', periodFilter],
    queryFn: () => api.get(`/commissions/summary${periodFilter ? `?period=${periodFilter}` : ''}`).then(r => r.data),
  });

  const { data: driversData = [] } = useQuery<Driver[]>({
    queryKey: ['drivers-list'],
    queryFn: () => api.get('/drivers').then(r => r.data?.data ?? r.data ?? []),
  });

  const form = useForm<CommissionFormData>({ resolver: zodResolver(commissionSchema) });

  const baseAmount = form.watch('baseAmount') ?? 0;
  const percentage = form.watch('percentage') ?? 0;
  const bonus = form.watch('bonus') ?? 0;
  const deductVal = form.watch('deductions') ?? 0;
  const previewAmount = (Number(baseAmount) * Number(percentage)) / 100;
  const previewNet = previewAmount + Number(bonus) - Number(deductVal);

  const createMutation = useMutation({
    mutationFn: (data: CommissionFormData) => api.post('/commissions', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['commissions'] });
      setShowModal(false); form.reset();
      toast.success('Comissão cadastrada!');
    },
    onError: (e: any) => toast.error(e.response?.data?.message ?? 'Erro ao criar comissão'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CommissionFormData> }) =>
      api.patch(`/commissions/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['commissions'] });
      setEditing(null); setShowModal(false); form.reset();
      toast.success('Comissão atualizada!');
    },
    onError: (e: any) => toast.error(e.response?.data?.message ?? 'Erro ao atualizar'),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/commissions/${id}/status`, { status }),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['commissions'] });
      const labels: Record<string, string> = { APPROVED: 'aprovada', PAID: 'paga', CANCELLED: 'cancelada' };
      toast.success(`Comissão ${labels[vars.status] ?? 'atualizada'}!`);
    },
    onError: (e: any) => toast.error(e.response?.data?.message ?? 'Erro ao atualizar status'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/commissions/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['commissions'] }); toast.success('Comissão removida'); },
    onError: (e: any) => toast.error(e.response?.data?.message ?? 'Erro ao remover'),
  });

  const openNew = () => { form.reset({ period: periodFilter }); setEditing(null); setShowModal(true); };
  const openEdit = (c: Commission) => {
    setEditing(c);
    form.reset({
      driverId: c.driverId, period: c.period, routeCount: c.routeCount,
      baseAmount: Number(c.baseAmount), percentage: Number(c.percentage),
      bonus: c.bonus ? Number(c.bonus) : undefined,
      deductions: c.deductions ? Number(c.deductions) : undefined,
      notes: c.notes ?? undefined,
    });
    setShowModal(true);
  };

  const onSubmit = (data: CommissionFormData) => {
    if (editing) updateMutation.mutate({ id: editing.id, data });
    else createMutation.mutate(data);
  };

  const getAvatarColor = (name: string) => {
    const colors = ['bg-blue-500','bg-emerald-500','bg-violet-500','bg-orange-500','bg-rose-500','bg-cyan-500'];
    let h = 0;
    for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
    return colors[Math.abs(h) % colors.length];
  };

  return (
    <div>
      <SectionHeader
        title="Comissões de Motoristas"
        description="Gerencie o pagamento de comissões por rotas e entregas realizadas"
        action={
          <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={openNew}>
            Nova Comissão
          </Button>
        }
      />

      {/* Period filter + summary */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-brand-text-secondary">Período:</label>
          <input
            type="month"
            value={periodFilter}
            onChange={e => setPeriodFilter(e.target.value)}
            className={cn(inputCls, 'w-36')}
          />
        </div>

        {summary && (
          <div className="flex flex-wrap gap-3 ml-auto">
            {[
              { label: 'Comissões', value: summary.count, suffix: '', color: 'text-brand-text-primary' },
              { label: 'Total Bruto', value: fmtCurrency(summary.totalCommissions ?? 0), suffix: '', color: 'text-brand-text-primary' },
              { label: 'Total Líquido', value: fmtCurrency(summary.totalNet ?? 0), suffix: '', color: 'text-violet-600 font-bold' },
              { label: 'Pago', value: fmtCurrency(summary.totalPaid ?? 0), suffix: '', color: 'text-emerald-600' },
              { label: 'Pendente', value: fmtCurrency(summary.totalPending ?? 0), suffix: '', color: 'text-orange-600' },
            ].map(item => (
              <div key={item.label} className="text-center px-3 py-2 rounded-xl bg-slate-50 border border-brand-border">
                <p className="text-xs text-brand-text-secondary">{item.label}</p>
                <p className={cn('text-sm font-semibold', item.color)}>{item.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div>
      ) : commissions.length === 0 ? (
        <EmptyState
          icon={Award}
          title="Nenhuma comissão neste período"
          description="Cadastre comissões para os motoristas com base nas rotas realizadas"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {commissions.map(c => {
            const cfg = COMMISSION_STATUS_CONFIG[c.status] ?? COMMISSION_STATUS_CONFIG.PENDING;
            const StatusIcon = cfg.icon;
            const initials = c.driver.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-brand-border p-5 shadow-card hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={cn('w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0', getAvatarColor(c.driver.name))}>
                      {initials}
                    </div>
                    <div>
                      <p className="font-semibold text-brand-text-primary text-sm">{c.driver.name}</p>
                      <p className="text-xs text-brand-text-secondary">
                        {format(new Date(c.period + '-01'), 'MMMM yyyy', { locale: ptBR })} · {c.routeCount} rotas
                      </p>
                    </div>
                  </div>
                  <Badge variant={cfg.variant}>
                    <StatusIcon className="w-3 h-3 mr-1 inline" />{cfg.label}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div>
                    <p className="text-xs text-brand-text-secondary mb-0.5">Base</p>
                    <p className="text-sm font-medium text-brand-text-primary">{fmtCurrency(Number(c.baseAmount))}</p>
                  </div>
                  <div>
                    <p className="text-xs text-brand-text-secondary mb-0.5">Comissão ({c.percentage}%)</p>
                    <p className="text-sm font-medium text-blue-600">{fmtCurrency(Number(c.amount))}</p>
                  </div>
                  <div>
                    <p className="text-xs text-brand-text-secondary mb-0.5">Líquido</p>
                    <p className="text-base font-bold text-emerald-600">{fmtCurrency(Number(c.netAmount))}</p>
                  </div>
                </div>

                {(Number(c.bonus) > 0 || Number(c.deductions) > 0) && (
                  <div className="flex gap-3 mt-2 pt-2 border-t border-brand-border/60">
                    {Number(c.bonus) > 0 && (
                      <span className="text-xs text-emerald-600">+{fmtCurrency(Number(c.bonus))} bônus</span>
                    )}
                    {Number(c.deductions) > 0 && (
                      <span className="text-xs text-danger-600">-{fmtCurrency(Number(c.deductions))} descontos</span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-brand-border/60">
                  {/* Status actions */}
                  <div className="flex gap-1.5">
                    {c.status === 'PENDING' && (
                      <button
                        onClick={() => statusMutation.mutate({ id: c.id, status: 'APPROVED' })}
                        className="text-xs px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 font-medium hover:bg-blue-100 transition-colors"
                      >
                        Aprovar
                      </button>
                    )}
                    {c.status === 'APPROVED' && (
                      <button
                        onClick={() => statusMutation.mutate({ id: c.id, status: 'PAID' })}
                        className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 font-medium hover:bg-emerald-100 transition-colors"
                      >
                        Marcar Pago
                      </button>
                    )}
                    {(c.status === 'PENDING' || c.status === 'APPROVED') && (
                      <button
                        onClick={() => statusMutation.mutate({ id: c.id, status: 'CANCELLED' })}
                        className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 font-medium hover:bg-slate-200 transition-colors"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                  {/* Edit / delete */}
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(c)}
                      className="p-1.5 rounded-lg text-brand-text-tertiary hover:bg-slate-100 hover:text-primary-600 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => { if (confirm('Remover esta comissão?')) deleteMutation.mutate(c.id); }}
                      className="p-1.5 rounded-lg text-brand-text-tertiary hover:bg-danger-50 hover:text-danger-600 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <Modal
        open={showModal}
        onClose={() => { setShowModal(false); setEditing(null); form.reset(); }}
        title={editing ? 'Editar Comissão' : 'Nova Comissão'}
        size="lg"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button
              size="sm"
              loading={createMutation.isPending || updateMutation.isPending}
              onClick={form.handleSubmit(onSubmit)}
            >
              {editing ? 'Salvar' : 'Criar Comissão'}
            </Button>
          </div>
        }
      >
        <form className="grid grid-cols-2 gap-4 p-1">
          <FormField label="Motorista" required error={form.formState.errors.driverId?.message}>
            <select {...form.register('driverId')} className={selectCls}>
              <option value="">Selecione...</option>
              {driversData.map((d: Driver) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </FormField>

          <FormField label="Período (YYYY-MM)" required error={form.formState.errors.period?.message}>
            <input {...form.register('period')} type="month" className={inputCls} />
          </FormField>

          <FormField label="Nº de Rotas" required error={form.formState.errors.routeCount?.message}>
            <input {...form.register('routeCount')} type="number" min="0" className={inputCls} placeholder="0" />
          </FormField>

          <FormField label="Valor Base (R$)" required error={form.formState.errors.baseAmount?.message}>
            <input {...form.register('baseAmount')} type="number" step="0.01" min="0" className={inputCls} placeholder="0,00" />
          </FormField>

          <FormField label="Percentual (%)" required error={form.formState.errors.percentage?.message}>
            <input {...form.register('percentage')} type="number" step="0.01" min="0" max="100" className={inputCls} placeholder="0" />
          </FormField>

          <FormField label="Bônus (R$)">
            <input {...form.register('bonus')} type="number" step="0.01" min="0" className={inputCls} placeholder="0,00" />
          </FormField>

          <FormField label="Descontos (R$)">
            <input {...form.register('deductions')} type="number" step="0.01" min="0" className={inputCls} placeholder="0,00" />
          </FormField>

          <FormField label="Observações" colSpan="col-span-2">
            <textarea {...form.register('notes')} rows={2} className={cn(inputCls, 'h-auto resize-none py-2')} />
          </FormField>

          {/* Live preview */}
          {(Number(baseAmount) > 0 && Number(percentage) > 0) && (
            <div className="col-span-2 rounded-xl bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 p-4">
              <p className="text-xs font-semibold text-violet-700 mb-3">Prévia do Cálculo</p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-xs text-brand-text-secondary">Comissão Bruta</p>
                  <p className="text-base font-bold text-violet-600">{fmtCurrency(previewAmount)}</p>
                </div>
                <div>
                  <p className="text-xs text-brand-text-secondary">Bônus / Descontos</p>
                  <p className="text-base font-bold text-brand-text-primary">
                    {Number(bonus) > 0 ? `+${fmtCurrency(Number(bonus))}` : ''}
                    {Number(deductVal) > 0 ? ` -${fmtCurrency(Number(deductVal))}` : ''}
                    {Number(bonus) === 0 && Number(deductVal) === 0 ? '—' : ''}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-brand-text-secondary">Valor Líquido</p>
                  <p className="text-lg font-bold text-emerald-600">{fmtCurrency(previewNet)}</p>
                </div>
              </div>
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
}

// ─── Cash Flow Tab ────────────────────────────────────────────────────────────

function CashFlowTab() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());

  // Fetch entries for the full year
  const { data: entries = [], isLoading } = useQuery<FinancialEntry[]>({
    queryKey: ['financial-cashflow', year],
    queryFn: () =>
      api.get(`/financial/entries?startDate=${year}-01-01&endDate=${year}-12-31`).then(r => r.data),
  });

  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const monthStr = `${year}-${String(i + 1).padStart(2, '0')}`;
    const monthEntries = entries.filter(e => e.dueDate?.startsWith(monthStr));
    const receitas = monthEntries.filter(e => e.type === 'RECEIVABLE').reduce((s, e) => s + Number(e.amount), 0);
    const despesas = monthEntries.filter(e => e.type === 'PAYABLE').reduce((s, e) => s + Number(e.amount), 0);
    return {
      month: format(new Date(year, i, 1), 'MMM', { locale: ptBR }),
      receitas,
      despesas,
      saldo: receitas - despesas,
    };
  });

  const totalReceitas = monthlyData.reduce((s, m) => s + m.receitas, 0);
  const totalDespesas = monthlyData.reduce((s, m) => s + m.despesas, 0);
  const saldoAnual = totalReceitas - totalDespesas;

  return (
    <div>
      <SectionHeader
        title="Fluxo de Caixa"
        description="Análise mensal de receitas, despesas e saldo projetado"
        action={
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-brand-text-secondary">Ano:</label>
            <select
              value={year}
              onChange={e => setYear(Number(e.target.value))}
              className={cn(selectCls, 'w-24')}
            >
              {[today.getFullYear() - 1, today.getFullYear(), today.getFullYear() + 1].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        }
      />

      {/* Annual KPIs */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4">
          <p className="text-xs text-emerald-700 font-medium mb-1">Receita Total {year}</p>
          <p className="text-2xl font-bold text-emerald-600">{fmtCurrency(totalReceitas)}</p>
        </div>
        <div className="rounded-2xl bg-red-50 border border-red-100 p-4">
          <p className="text-xs text-red-700 font-medium mb-1">Despesa Total {year}</p>
          <p className="text-2xl font-bold text-red-500">{fmtCurrency(totalDespesas)}</p>
        </div>
        <div className={cn('rounded-2xl border p-4', saldoAnual >= 0 ? 'bg-blue-50 border-blue-100' : 'bg-orange-50 border-orange-100')}>
          <p className={cn('text-xs font-medium mb-1', saldoAnual >= 0 ? 'text-blue-700' : 'text-orange-700')}>
            Saldo Anual {year}
          </p>
          <p className={cn('text-2xl font-bold', saldoAnual >= 0 ? 'text-blue-600' : 'text-orange-500')}>
            {fmtCurrency(saldoAnual)}
          </p>
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 rounded-2xl" />
      ) : (
        <>
          {/* Bar chart */}
          <div className="bg-white rounded-2xl border border-brand-border p-5 shadow-card mb-6">
            <h3 className="text-sm font-bold text-brand-text-primary mb-4">Receitas vs Despesas por Mês</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthlyData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number, name: string) => [fmtCurrency(v), name === 'receitas' ? 'Receitas' : 'Despesas']} />
                <Legend formatter={v => v === 'receitas' ? 'Receitas' : 'Despesas'} />
                <Bar dataKey="receitas" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="despesas" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly table */}
          <div className="bg-white rounded-2xl border border-brand-border overflow-hidden shadow-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-brand-border">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-brand-text-secondary">Mês</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-brand-text-secondary">Receitas</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-brand-text-secondary">Despesas</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-brand-text-secondary">Saldo</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-brand-text-secondary">Indicador</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60">
                {monthlyData.map((row, i) => (
                  <tr key={i} className={cn(
                    'hover:bg-slate-50/70 transition-colors',
                    i + 1 === today.getMonth() + 1 && year === today.getFullYear() ? 'bg-primary-50/40' : 'bg-white',
                  )}>
                    <td className="px-4 py-3 font-medium text-brand-text-primary capitalize">
                      {row.month}
                      {i + 1 === today.getMonth() + 1 && year === today.getFullYear() && (
                        <span className="ml-2 text-xs text-primary-600 font-semibold">(atual)</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-emerald-600 font-medium">{row.receitas > 0 ? fmtCurrency(row.receitas) : '—'}</td>
                    <td className="px-4 py-3 text-right text-red-500 font-medium">{row.despesas > 0 ? fmtCurrency(row.despesas) : '—'}</td>
                    <td className={cn('px-4 py-3 text-right font-bold', row.saldo >= 0 ? 'text-emerald-600' : 'text-red-500')}>
                      {row.receitas > 0 || row.despesas > 0 ? fmtCurrency(row.saldo) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      {(row.receitas > 0 || row.despesas > 0) && (
                        <div className="w-full max-w-[120px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={cn('h-full rounded-full', row.saldo >= 0 ? 'bg-emerald-500' : 'bg-red-400')}
                            style={{ width: `${Math.min(100, Math.abs(row.saldo) / Math.max(row.receitas, row.despesas, 1) * 100)}%` }}
                          />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Cost Centers Tab ─────────────────────────────────────────────────────────

function CostCentersTab() {
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<CostCenter | null>(null);

  const { data: costCenters = [], isLoading } = useQuery<CostCenter[]>({
    queryKey: ['cost-centers'],
    queryFn: () => api.get('/financial/cost-centers').then(r => r.data),
  });

  const form = useForm<CostCenterFormData>({ resolver: zodResolver(costCenterSchema) });

  const createMutation = useMutation({
    mutationFn: (data: CostCenterFormData) => api.post('/financial/cost-centers', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cost-centers'] });
      setShowModal(false); form.reset();
      toast.success('Centro de custo criado!');
    },
    onError: (e: any) => toast.error(e.response?.data?.message ?? 'Erro ao criar'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CostCenterFormData> }) =>
      api.patch(`/financial/cost-centers/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cost-centers'] });
      setEditing(null); setShowModal(false); form.reset();
      toast.success('Centro de custo atualizado!');
    },
    onError: (e: any) => toast.error(e.response?.data?.message ?? 'Erro ao atualizar'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/financial/cost-centers/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['cost-centers'] }); toast.success('Centro de custo desativado'); },
    onError: (e: any) => toast.error(e.response?.data?.message ?? 'Erro ao desativar'),
  });

  const openNew = () => { form.reset(); setEditing(null); setShowModal(true); };
  const openEdit = (cc: CostCenter) => {
    setEditing(cc);
    form.reset({ name: cc.name, code: cc.code, description: cc.description ?? undefined });
    setShowModal(true);
  };

  const onSubmit = (data: CostCenterFormData) => {
    if (editing) updateMutation.mutate({ id: editing.id, data });
    else createMutation.mutate(data);
  };

  const CC_COLORS = ['bg-blue-500','bg-emerald-500','bg-violet-500','bg-orange-500','bg-rose-500','bg-cyan-500','bg-amber-500','bg-indigo-500'];
  const getColor = (code: string) => { let h = 0; for (let i = 0; i < code.length; i++) h = code.charCodeAt(i) + ((h << 5) - h); return CC_COLORS[Math.abs(h) % CC_COLORS.length]; };

  return (
    <div>
      <SectionHeader
        title="Centro de Custos"
        description="Organize e classifique despesas por departamento ou projeto"
        action={
          <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={openNew}>
            Novo Centro
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
      ) : costCenters.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="Nenhum centro de custo"
          description="Crie centros de custo para organizar e classificar seus lançamentos financeiros"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {costCenters.map(cc => (
            <motion.div
              key={cc.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-brand-border p-5 shadow-card hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0', getColor(cc.code))}>
                    {cc.code.slice(0, 3)}
                  </div>
                  <div>
                    <p className="font-semibold text-brand-text-primary text-sm">{cc.name}</p>
                    <p className="text-xs text-brand-text-secondary font-mono">{cc.code}</p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(cc)} className="p-1.5 rounded-lg hover:bg-slate-100 text-brand-text-tertiary hover:text-primary-600 transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => { if (confirm('Desativar este centro de custo?')) deleteMutation.mutate(cc.id); }} className="p-1.5 rounded-lg hover:bg-danger-50 text-brand-text-tertiary hover:text-danger-600 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {cc.description && <p className="text-xs text-brand-text-secondary line-clamp-2">{cc.description}</p>}
            </motion.div>
          ))}
        </div>
      )}

      <Modal
        open={showModal}
        onClose={() => { setShowModal(false); setEditing(null); form.reset(); }}
        title={editing ? 'Editar Centro de Custo' : 'Novo Centro de Custo'}
        size="sm"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button
              size="sm"
              loading={createMutation.isPending || updateMutation.isPending}
              onClick={form.handleSubmit(onSubmit)}
            >
              {editing ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        }
      >
        <form className="flex flex-col gap-4 p-1">
          <FormField label="Nome" required error={form.formState.errors.name?.message}>
            <input {...form.register('name')} className={inputCls} placeholder="Ex: Operações Sul" />
          </FormField>
          <FormField label="Código" required error={form.formState.errors.code?.message}>
            <input
              {...form.register('code')}
              className={inputCls}
              placeholder="Ex: OPS-SUL"
              onChange={e => form.setValue('code', e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ''))}
            />
            <p className="text-xs text-brand-text-tertiary">Use letras maiúsculas, números, hífens e underscores</p>
          </FormField>
          <FormField label="Descrição" error={form.formState.errors.description?.message}>
            <textarea {...form.register('description')} rows={2} className={cn(inputCls, 'h-auto resize-none py-2')} placeholder="Descrição opcional..." />
          </FormField>
        </form>
      </Modal>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function FinancialPage() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [month, setMonth] = useState(currentPeriod());

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg">
      <Header title="Módulo Financeiro" />

      <main className="flex-1 p-6 max-w-[1400px] mx-auto w-full space-y-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-brand-text-primary">Financeiro</h1>
            <p className="text-sm text-brand-text-secondary mt-0.5">
              Gestão completa de receitas, despesas, comissões e fluxo de caixa
            </p>
          </div>
          {activeTab === 'overview' && (
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-brand-text-secondary">Mês de referência:</label>
              <input
                type="month"
                value={month}
                onChange={e => setMonth(e.target.value)}
                className={cn(inputCls, 'w-36')}
              />
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-slate-100/80 rounded-2xl p-1 w-fit overflow-x-auto">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap',
                  active
                    ? 'bg-white text-primary-700 shadow-sm'
                    : 'text-brand-text-secondary hover:text-brand-text-primary hover:bg-white/60',
                )}
              >
                <Icon className={cn('w-4 h-4 flex-shrink-0', active ? 'text-primary-600' : '')} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            {activeTab === 'overview'    && <OverviewTab month={month} />}
            {activeTab === 'payables'    && <EntriesTab type="PAYABLE" />}
            {activeTab === 'receivables' && <EntriesTab type="RECEIVABLE" />}
            {activeTab === 'commissions' && <CommissionsTab />}
            {activeTab === 'cashflow'    && <CashFlowTab />}
            {activeTab === 'costcenters' && <CostCentersTab />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
