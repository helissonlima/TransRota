'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Route,
  Car,
  User,
  Calendar,
  TrendingUp,
  CheckCircle2,
  XCircle,
  ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';
import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import api from '@/lib/api';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/cn';

type DailyKmStatus = 'OK' | 'NOK';

interface DailyKmRecord {
  id: string;
  date: string;
  initialKm: number;
  finalKm: number;
  workKm: number;
  personalKm: number;
  totalKm: number;
  status: DailyKmStatus;
  notes?: string;
  vehicle: { id: string; plate: string; model: string; brand: string };
  driver: { id: string; name: string };
}

interface DailyKmSummary {
  driver: { id: string; name: string };
  month: string;
  personalKm: number;
  workKm: number;
  totalKm: number;
}

interface Vehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
}

interface Driver {
  id: string;
  name: string;
}

const recordSchema = z.object({
  date: z.string().min(1, 'Data obrigatória'),
  vehicleId: z.string().min(1, 'Veículo obrigatório'),
  driverId: z.string().min(1, 'Condutor obrigatório'),
  initialKm: z.coerce.number().min(0, 'KM inicial inválido'),
  finalKm: z.coerce.number().min(0, 'KM final inválido'),
  personalInitialKm: z.coerce.number().optional(),
  personalFinalKm: z.coerce.number().optional(),
  status: z.enum(['OK', 'NOK']),
  notes: z.string().optional(),
}).refine((d) => d.finalKm >= d.initialKm, {
  message: 'KM final deve ser maior que KM inicial',
  path: ['finalKm'],
});

type RecordFormData = z.infer<typeof recordSchema>;

const TABS = [
  { key: 'records', label: 'Registros' },
  { key: 'summary', label: 'Resumo por Condutor' },
] as const;

function StatusBadge({ status }: { status: DailyKmStatus }) {
  if (status === 'OK') return <Badge variant="success" dot>OK</Badge>;
  return <Badge variant="danger" dot>NOK</Badge>;
}

export default function DailyKmPage() {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState<'records' | 'summary'>('records');
  const [modalOpen, setModalOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState(() => format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  const [dateTo, setDateTo] = useState(() => format(endOfMonth(new Date()), 'yyyy-MM-dd'));
  const summaryDate = parseISO(dateFrom);
  const summaryYear = String(summaryDate.getFullYear());
  const summaryMonth = String(summaryDate.getMonth() + 1);

  const { data: records = [], isLoading: loadingRecords } = useQuery<DailyKmRecord[]>({
    queryKey: ['daily-km', dateFrom, dateTo],
    queryFn: () =>
      api.get('/daily-km', { params: { dateFrom, dateTo } }).then((r) => r.data),
  });

  const { data: summary = [], isLoading: loadingSummary } = useQuery<DailyKmSummary[]>({
    queryKey: ['daily-km-summary', summaryYear, summaryMonth],
    queryFn: () => api.get('/daily-km/summary', { params: { year: summaryYear, month: summaryMonth } }).then((r) => r.data),
    enabled: activeTab === 'summary',
  });

  const { data: vehicles = [] } = useQuery<Vehicle[]>({
    queryKey: ['vehicles-select'],
    queryFn: () => api.get('/vehicles', { params: { status: 'ACTIVE', limit: 200 } }).then((r) => r.data?.vehicles ?? r.data),
  });

  const { data: drivers = [] } = useQuery<Driver[]>({
    queryKey: ['drivers-select'],
    queryFn: () => api.get('/drivers', { params: { status: 'ACTIVE', limit: 200 } }).then((r) => r.data?.drivers ?? r.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: RecordFormData) => api.post('/daily-km', data),
    onSuccess: () => {
      toast.success('Registro criado com sucesso!');
      qc.invalidateQueries({ queryKey: ['daily-km'] });
      qc.invalidateQueries({ queryKey: ['daily-km-summary'] });
      setModalOpen(false);
      reset();
    },
    onError: () => toast.error('Erro ao criar registro.'),
  });

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<RecordFormData>({
    resolver: zodResolver(recordSchema),
    defaultValues: {
      date: format(new Date(), 'yyyy-MM-dd'),
      status: 'OK',
      initialKm: 0,
      finalKm: 0,
      personalInitialKm: 0,
      personalFinalKm: 0,
    },
  });

  const watchInitialKm = watch('initialKm') ?? 0;
  const watchFinalKm = watch('finalKm') ?? 0;
  const watchPersonalInitial = watch('personalInitialKm') ?? 0;
  const watchPersonalFinal = watch('personalFinalKm') ?? 0;

  const calculatedPersonalKm = Math.max(0, (watchPersonalFinal ?? 0) - (watchPersonalInitial ?? 0));
  const calculatedTotalKm = Math.max(0, watchFinalKm - watchInitialKm);
  const calculatedWorkKm = Math.max(0, calculatedTotalKm - calculatedPersonalKm);

  return (
    <div className="min-h-screen">
      <Header
        title="KM Diário"
        breadcrumbs={[{ label: 'KM Diário' }]}
      />

      <div className="p-6 space-y-5 max-w-[1600px] mx-auto">
        {/* Tabs */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1 bg-white border border-brand-border rounded-xl p-1 w-fit">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  activeTab === tab.key
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-brand-text-secondary hover:text-brand-text-primary hover:bg-slate-50',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
            Novo Registro
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'records' && (
            <motion.div
              key="records"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Date filter */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-text-secondary" />
                  <span className="text-sm text-brand-text-secondary">Período:</span>
                </div>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="input-base py-1.5 text-sm w-40"
                />
                <span className="text-brand-text-secondary text-sm">até</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="input-base py-1.5 text-sm w-40"
                />
                <Badge variant="gray">{records.length} registros</Badge>
              </div>

              {/* Records table/cards */}
              {loadingRecords ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-brand-border shadow-card p-4">
                      <Skeleton className="h-5 w-48 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              ) : records.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-brand-border shadow-card">
                  <Route className="w-12 h-12 text-slate-300 mb-3" />
                  <p className="font-semibold text-brand-text-primary">Nenhum registro encontrado</p>
                  <p className="text-sm text-brand-text-secondary mt-1 mb-4">Tente ajustar o período ou crie um novo registro.</p>
                  <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
                    Novo Registro
                  </Button>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-brand-border shadow-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-brand-border bg-slate-50/80">
                          <th className="text-left px-4 py-3 text-xs font-semibold text-brand-text-secondary uppercase tracking-wide">Data</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-brand-text-secondary uppercase tracking-wide">Condutor</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-brand-text-secondary uppercase tracking-wide">Veículo</th>
                          <th className="text-right px-4 py-3 text-xs font-semibold text-brand-text-secondary uppercase tracking-wide">KM Inicial</th>
                          <th className="text-right px-4 py-3 text-xs font-semibold text-brand-text-secondary uppercase tracking-wide">KM Final</th>
                          <th className="text-right px-4 py-3 text-xs font-semibold text-brand-text-secondary uppercase tracking-wide">Trabalho</th>
                          <th className="text-right px-4 py-3 text-xs font-semibold text-brand-text-secondary uppercase tracking-wide">Pessoal</th>
                          <th className="text-right px-4 py-3 text-xs font-semibold text-brand-text-secondary uppercase tracking-wide">Total</th>
                          <th className="text-center px-4 py-3 text-xs font-semibold text-brand-text-secondary uppercase tracking-wide">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-border/50">
                        {records.map((record, i) => (
                          <motion.tr
                            key={record.id}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: i * 0.03 }}
                            className="hover:bg-slate-50/60 transition-colors"
                          >
                            <td className="px-4 py-3 text-brand-text-secondary text-xs whitespace-nowrap">
                              {format(parseISO(record.date), 'dd/MM/yyyy', { locale: ptBR })}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold flex-shrink-0">
                                  {record.driver.name.charAt(0)}
                                </div>
                                <span className="font-medium text-brand-text-primary whitespace-nowrap">{record.driver.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-col">
                                <span className="font-mono font-bold text-brand-text-primary">{record.vehicle.plate}</span>
                                <span className="text-xs text-brand-text-secondary">{record.vehicle.brand} {record.vehicle.model}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right text-brand-text-primary font-mono">{record.initialKm.toLocaleString('pt-BR')}</td>
                            <td className="px-4 py-3 text-right text-brand-text-primary font-mono">{record.finalKm.toLocaleString('pt-BR')}</td>
                            <td className="px-4 py-3 text-right font-semibold text-primary-600 font-mono">{record.workKm.toLocaleString('pt-BR')}</td>
                            <td className="px-4 py-3 text-right text-brand-text-secondary font-mono">{record.personalKm.toLocaleString('pt-BR')}</td>
                            <td className="px-4 py-3 text-right font-bold text-brand-text-primary font-mono">{record.totalKm.toLocaleString('pt-BR')}</td>
                            <td className="px-4 py-3 text-center">
                              <StatusBadge status={record.status} />
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'summary' && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {loadingSummary ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-brand-border shadow-card p-4">
                      <Skeleton className="h-5 w-40 mb-2" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                  ))}
                </div>
              ) : summary.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-brand-border shadow-card">
                  <TrendingUp className="w-12 h-12 text-slate-300 mb-3" />
                  <p className="font-semibold text-brand-text-primary">Nenhum resumo disponível</p>
                  <p className="text-sm text-brand-text-secondary mt-1">Os resumos por condutor aparecerão aqui após registros serem criados.</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-brand-border shadow-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-brand-border bg-slate-50/80">
                          <th className="text-left px-4 py-3 text-xs font-semibold text-brand-text-secondary uppercase tracking-wide">Condutor</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-brand-text-secondary uppercase tracking-wide">Mês</th>
                          <th className="text-right px-4 py-3 text-xs font-semibold text-brand-text-secondary uppercase tracking-wide">KM Pessoal</th>
                          <th className="text-right px-4 py-3 text-xs font-semibold text-brand-text-secondary uppercase tracking-wide">KM Trabalho</th>
                          <th className="text-right px-4 py-3 text-xs font-semibold text-brand-text-secondary uppercase tracking-wide">KM Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-border/50">
                        {summary.map((row, i) => (
                          <motion.tr
                            key={`${row.driver.id}-${row.month}`}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: i * 0.03 }}
                            className="hover:bg-slate-50/60 transition-colors"
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold">
                                  {row.driver.name.charAt(0)}
                                </div>
                                <span className="font-medium text-brand-text-primary">{row.driver.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-brand-text-secondary capitalize">
                              {format(parseISO(row.month + '-01'), 'MMMM yyyy', { locale: ptBR })}
                            </td>
                            <td className="px-4 py-3 text-right text-brand-text-secondary font-mono">{row.personalKm.toLocaleString('pt-BR')}</td>
                            <td className="px-4 py-3 text-right text-primary-600 font-semibold font-mono">{row.workKm.toLocaleString('pt-BR')}</td>
                            <td className="px-4 py-3 text-right font-bold text-brand-text-primary font-mono">{row.totalKm.toLocaleString('pt-BR')}</td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Create Record Modal */}
      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); reset(); }}
        title="Novo Registro de KM"
        description="Preencha os dados do trajeto do dia."
        size="xl"
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
              Salvar Registro
            </Button>
          </>
        }
      >
        <form className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">Data *</label>
              <input
                type="date"
                {...register('date')}
                className={cn('input-base', errors.date && 'border-danger-400')}
              />
              {errors.date && <p className="text-danger-500 text-xs mt-1">{errors.date.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">Status *</label>
              <select {...register('status')} className="input-base">
                <option value="OK">OK</option>
                <option value="NOK">NOK</option>
              </select>
            </div>

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

            <div>
              <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">Condutor *</label>
              <select {...register('driverId')} className={cn('input-base', errors.driverId && 'border-danger-400')}>
                <option value="">Selecione o condutor</option>
                {drivers.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              {errors.driverId && <p className="text-danger-500 text-xs mt-1">{errors.driverId.message}</p>}
            </div>
          </div>

          {/* KM de Trabalho */}
          <div>
            <h4 className="text-sm font-semibold text-brand-text-primary mb-3 flex items-center gap-2">
              <Car className="w-4 h-4 text-primary-600" />
              KM de Trabalho
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-brand-text-secondary mb-1.5">KM Inicial *</label>
                <input
                  type="number"
                  {...register('initialKm')}
                  placeholder="0"
                  className={cn('input-base', errors.initialKm && 'border-danger-400')}
                />
                {errors.initialKm && <p className="text-danger-500 text-xs mt-1">{errors.initialKm.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-brand-text-secondary mb-1.5">KM Final *</label>
                <input
                  type="number"
                  {...register('finalKm')}
                  placeholder="0"
                  className={cn('input-base', errors.finalKm && 'border-danger-400')}
                />
                {errors.finalKm && <p className="text-danger-500 text-xs mt-1">{errors.finalKm.message}</p>}
              </div>
            </div>
          </div>

          {/* KM Pessoal */}
          <div>
            <h4 className="text-sm font-semibold text-brand-text-primary mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-brand-text-secondary" />
              KM Pessoal (opcional)
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-brand-text-secondary mb-1.5">KM Inicial Pessoal</label>
                <input type="number" {...register('personalInitialKm')} placeholder="0" className="input-base" />
              </div>
              <div>
                <label className="block text-xs font-medium text-brand-text-secondary mb-1.5">KM Final Pessoal</label>
                <input type="number" {...register('personalFinalKm')} placeholder="0" className="input-base" />
              </div>
            </div>
          </div>

          {/* Auto-calculated summary */}
          <div className="bg-slate-50 rounded-xl border border-brand-border p-4">
            <h4 className="text-xs font-semibold text-brand-text-secondary uppercase tracking-wide mb-3">Resumo Calculado</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-primary-600">{calculatedWorkKm.toLocaleString('pt-BR')}</div>
                <div className="text-xs text-brand-text-secondary">KM Trabalho</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-brand-text-secondary">{calculatedPersonalKm.toLocaleString('pt-BR')}</div>
                <div className="text-xs text-brand-text-secondary">KM Pessoal</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-brand-text-primary">{calculatedTotalKm.toLocaleString('pt-BR')}</div>
                <div className="text-xs text-brand-text-secondary">KM Total</div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">Observações</label>
            <textarea
              {...register('notes')}
              placeholder="Observações sobre o trajeto..."
              rows={2}
              className="input-base resize-none"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
