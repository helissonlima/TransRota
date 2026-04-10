'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Receipt,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  Car,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import { format, parseISO, isPast, isAfter, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import api from '@/lib/api';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/cn';

type TaxType = 'IPVA' | 'LICENCIAMENTO' | 'SEGURO' | 'MULTA' | 'OUTRO';
type PaymentStatus = 'PENDING' | 'PAID' | 'OVERDUE' | 'EXEMPT';

interface TaxRecord {
  id: string;
  type: TaxType;
  year: number;
  dueDate: string;
  value: number;
  paymentStatus: PaymentStatus;
  notes?: string;
  paidAt?: string;
  vehicle: { id: string; plate: string; model: string; brand: string };
}

interface Vehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
}

interface TaxSummary {
  totalPending: number;
  pendingValue: number;
  totalPaid: number;
  paidValue: number;
  totalOverdue: number;
  overdueValue: number;
}

const taxSchema = z.object({
  vehicleId: z.string().min(1, 'Veículo obrigatório'),
  type: z.enum(['IPVA', 'LICENCIAMENTO', 'SEGURO', 'MULTA', 'OUTRO']),
  year: z.coerce.number().min(2000).max(2099, 'Ano inválido'),
  dueDate: z.string().min(1, 'Data de vencimento obrigatória'),
  value: z.coerce.number().min(0.01, 'Valor inválido'),
  notes: z.string().optional(),
});

type TaxFormData = z.infer<typeof taxSchema>;

const TYPE_CONFIG: Record<TaxType, { label: string; variant: 'info' | 'warning' | 'success' | 'danger' | 'gray' }> = {
  IPVA: { label: 'IPVA', variant: 'info' },
  LICENCIAMENTO: { label: 'Licenciamento', variant: 'warning' },
  SEGURO: { label: 'Seguro', variant: 'success' },
  MULTA: { label: 'Multa', variant: 'danger' },
  OUTRO: { label: 'Outro', variant: 'gray' },
};

const STATUS_CONFIG: Record<PaymentStatus, {
  label: string;
  variant: 'warning' | 'success' | 'danger' | 'gray';
}> = {
  PENDING: { label: 'Pendente', variant: 'warning' },
  PAID: { label: 'Pago', variant: 'success' },
  OVERDUE: { label: 'Vencido', variant: 'danger' },
  EXEMPT: { label: 'Isento', variant: 'gray' },
};

const FILTER_TABS = [
  { key: '', label: 'Todos' },
  { key: 'PENDING', label: 'Pendentes' },
  { key: 'PAID', label: 'Pagos' },
  { key: 'OVERDUE', label: 'Vencidos' },
] as const;

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function FiscalPage() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<PaymentStatus | ''>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [payConfirmId, setPayConfirmId] = useState<string | null>(null);

  const { data: taxes = [], isLoading } = useQuery<TaxRecord[]>({
    queryKey: ['taxes', filter],
    queryFn: () =>
      api.get('/taxes', { params: { paymentStatus: filter || undefined } }).then((r) => r.data),
  });

  const { data: vehicles = [] } = useQuery<Vehicle[]>({
    queryKey: ['vehicles-select'],
    queryFn: () =>
      api.get('/vehicles', { params: { limit: 200 } }).then((r) => r.data?.vehicles ?? r.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: TaxFormData) => api.post('/taxes', data),
    onSuccess: () => {
      toast.success('Lançamento criado com sucesso!');
      qc.invalidateQueries({ queryKey: ['taxes'] });
      setModalOpen(false);
      reset();
    },
    onError: () => toast.error('Erro ao criar lançamento.'),
  });

  const payMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/taxes/${id}/pay`),
    onSuccess: () => {
      toast.success('Lançamento marcado como pago!');
      qc.invalidateQueries({ queryKey: ['taxes'] });
      setPayConfirmId(null);
    },
    onError: () => toast.error('Erro ao registrar pagamento.'),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TaxFormData>({
    resolver: zodResolver(taxSchema),
    defaultValues: {
      type: 'IPVA',
      year: new Date().getFullYear(),
    },
  });

  // Compute summary from taxes list
  const summary: TaxSummary = taxes.reduce(
    (acc, t) => {
      if (t.paymentStatus === 'PENDING') {
        acc.totalPending++;
        acc.pendingValue += t.value;
      } else if (t.paymentStatus === 'PAID') {
        acc.totalPaid++;
        acc.paidValue += t.value;
      } else if (t.paymentStatus === 'OVERDUE') {
        acc.totalOverdue++;
        acc.overdueValue += t.value;
      }
      return acc;
    },
    { totalPending: 0, pendingValue: 0, totalPaid: 0, paidValue: 0, totalOverdue: 0, overdueValue: 0 },
  );

  const overdueItems = taxes.filter((t) => t.paymentStatus === 'OVERDUE');

  return (
    <div className="min-h-screen">
      <Header
        title="Financeiro Fiscal"
        breadcrumbs={[{ label: 'Financeiro Fiscal' }]}
        actions={
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
            Novo Lançamento
          </Button>
        }
      />

      <div className="p-6 space-y-5 max-w-[1600px] mx-auto">
        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="bg-white rounded-2xl border border-brand-border shadow-card p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-warning-50 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-warning-500" />
              </div>
              <span className="text-sm font-semibold text-brand-text-secondary">Pendentes</span>
            </div>
            <div className="text-2xl font-bold text-brand-text-primary">{summary.totalPending}</div>
            <div className="text-sm text-brand-text-secondary mt-1">{formatCurrency(summary.pendingValue)}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-2xl border border-brand-border shadow-card p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-success-50 rounded-xl flex items-center justify-center">
                <CheckCheck className="w-5 h-5 text-success-500" />
              </div>
              <span className="text-sm font-semibold text-brand-text-secondary">Pagos</span>
            </div>
            <div className="text-2xl font-bold text-brand-text-primary">{summary.totalPaid}</div>
            <div className="text-sm text-brand-text-secondary mt-1">{formatCurrency(summary.paidValue)}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-brand-border shadow-card p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-danger-50 rounded-xl flex items-center justify-center relative">
                <AlertTriangle className="w-5 h-5 text-danger-500" />
                {summary.totalOverdue > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-danger-500 rounded-full animate-pulse" />
                )}
              </div>
              <span className="text-sm font-semibold text-brand-text-secondary">Vencidos</span>
            </div>
            <div className="text-2xl font-bold text-danger-600">{summary.totalOverdue}</div>
            <div className="text-sm text-danger-500 mt-1">{formatCurrency(summary.overdueValue)}</div>
          </motion.div>
        </div>

        {/* Overdue alert */}
        <AnimatePresence>
          {overdueItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-danger-50 border border-danger-200 rounded-xl p-4 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-danger-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-danger-700">
                  {overdueItems.length} lançamento{overdueItems.length > 1 ? 's' : ''} vencido{overdueItems.length > 1 ? 's' : ''}
                </p>
                <p className="text-xs text-danger-600 mt-0.5">
                  Total em atraso: {formatCurrency(summary.overdueValue)} — regularize o quanto antes para evitar multas adicionais.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 bg-white border border-brand-border rounded-xl p-1 w-fit">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as PaymentStatus | '')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                filter === tab.key
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-brand-text-secondary hover:text-brand-text-primary hover:bg-slate-50',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-brand-border shadow-card p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : taxes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-brand-border shadow-card">
            <Receipt className="w-12 h-12 text-slate-300 mb-3" />
            <p className="font-semibold text-brand-text-primary">Nenhum lançamento encontrado</p>
            <p className="text-sm text-brand-text-secondary mt-1 mb-4">
              {filter ? 'Tente mudar o filtro.' : 'Cadastre IPVA, licenciamentos e outros impostos.'}
            </p>
            <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
              Novo Lançamento
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-brand-border shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-brand-border bg-slate-50/80">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-brand-text-secondary uppercase tracking-wide">Veículo</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-brand-text-secondary uppercase tracking-wide">Tipo</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-brand-text-secondary uppercase tracking-wide">Ano</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-brand-text-secondary uppercase tracking-wide">Vencimento</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-brand-text-secondary uppercase tracking-wide">Valor</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-brand-text-secondary uppercase tracking-wide">Status</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-brand-text-secondary uppercase tracking-wide">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/50">
                  {taxes.map((tax, i) => {
                    const typeConfig = TYPE_CONFIG[tax.type];
                    const statusConfig = STATUS_CONFIG[tax.paymentStatus];
                    return (
                      <motion.tr
                        key={tax.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: i * 0.03 }}
                        className={cn(
                          'hover:bg-slate-50/60 transition-colors',
                          tax.paymentStatus === 'OVERDUE' && 'bg-danger-50/30',
                        )}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Car className="w-3.5 h-3.5 text-brand-text-secondary" />
                            </div>
                            <div>
                              <div className="font-mono font-bold text-brand-text-primary">{tax.vehicle.plate}</div>
                              <div className="text-xs text-brand-text-secondary">{tax.vehicle.brand} {tax.vehicle.model}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={typeConfig.variant}>{typeConfig.label}</Badge>
                        </td>
                        <td className="px-4 py-3 text-center text-brand-text-secondary font-mono">{tax.year}</td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            'text-sm',
                            tax.paymentStatus === 'OVERDUE' ? 'text-danger-600 font-semibold' : 'text-brand-text-secondary',
                          )}>
                            {format(parseISO(tax.dueDate), 'dd/MM/yyyy')}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-brand-text-primary">
                          {formatCurrency(tax.value)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant={statusConfig.variant} dot>{statusConfig.label}</Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {tax.paymentStatus !== 'PAID' && tax.paymentStatus !== 'EXEMPT' && (
                            <button
                              onClick={() => setPayConfirmId(tax.id)}
                              className="text-xs text-success-600 hover:text-success-700 font-semibold flex items-center gap-1 mx-auto hover:bg-success-50 px-2 py-1 rounded-lg transition-colors"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Pagar
                            </button>
                          )}
                          {tax.paymentStatus === 'PAID' && tax.paidAt && (
                            <span className="text-xs text-brand-text-secondary">
                              {format(parseISO(tax.paidAt), 'dd/MM/yy')}
                            </span>
                          )}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* New Tax Modal */}
      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); reset(); }}
        title="Novo Lançamento Fiscal"
        description="Registre um imposto, licenciamento ou multa."
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setModalOpen(false); reset(); }}>Cancelar</Button>
            <Button
              loading={createMutation.isPending}
              onClick={handleSubmit(
                (d) => createMutation.mutate(d),
                () => toast.error('Preencha todos os campos obrigatórios'),
              )}
            >
              Salvar
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">Veículo *</label>
            <select {...register('vehicleId')} className={cn('input-base', errors.vehicleId && 'border-danger-400')}>
              <option value="">Selecione o veículo</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>{v.plate} — {v.brand} {v.model}</option>
              ))}
            </select>
            {errors.vehicleId && <p className="text-danger-500 text-xs mt-1">{errors.vehicleId.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">Tipo *</label>
              <select {...register('type')} className="input-base">
                {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
                  <option key={key} value={key}>{cfg.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">Ano *</label>
              <input
                type="number"
                {...register('year')}
                placeholder={String(new Date().getFullYear())}
                className={cn('input-base', errors.year && 'border-danger-400')}
              />
              {errors.year && <p className="text-danger-500 text-xs mt-1">{errors.year.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">Vencimento *</label>
              <input
                type="date"
                {...register('dueDate')}
                className={cn('input-base', errors.dueDate && 'border-danger-400')}
              />
              {errors.dueDate && <p className="text-danger-500 text-xs mt-1">{errors.dueDate.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">Valor (R$) *</label>
              <input
                type="number"
                step="0.01"
                {...register('value')}
                placeholder="0,00"
                className={cn('input-base', errors.value && 'border-danger-400')}
              />
              {errors.value && <p className="text-danger-500 text-xs mt-1">{errors.value.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">Observações</label>
            <textarea
              {...register('notes')}
              placeholder="Referência, processo, etc."
              rows={2}
              className="input-base resize-none"
            />
          </div>
        </form>
      </Modal>

      {/* Pay Confirmation Modal */}
      <Modal
        open={!!payConfirmId}
        onClose={() => setPayConfirmId(null)}
        title="Confirmar Pagamento"
        description="Esta ação marcará o lançamento como pago. Deseja continuar?"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setPayConfirmId(null)}>Cancelar</Button>
            <Button
              loading={payMutation.isPending}
              onClick={() => payConfirmId && payMutation.mutate(payConfirmId)}
            >
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Confirmar Pagamento
            </Button>
          </>
        }
      >
        <div className="flex items-center gap-3 p-4 bg-success-50 rounded-xl border border-success-100">
          <CheckCircle2 className="w-8 h-8 text-success-500 flex-shrink-0" />
          <p className="text-sm text-success-700">
            O lançamento será marcado como <strong>pago</strong> com a data de hoje.
          </p>
        </div>
      </Modal>
    </div>
  );
}
