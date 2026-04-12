'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  CalendarDays,
  Car,
  User,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronDown,
  Calendar,
  Pencil,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { format, parseISO, isToday, isTomorrow, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import api from '@/lib/api';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/cn';

type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
type TimeSlot = 'MANHÃ' | 'TARDE' | 'DIA TODO' | 'HORÁRIO';

interface Booking {
  id: string;
  date: string;
  timeSlot: TimeSlot;
  purpose: string;
  notes?: string;
  status: BookingStatus;
  vehicle: { id: string; plate: string; model: string; brand: string };
  user: { id: string; name: string };
}

interface Vehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
}

const bookingSchema = z.object({
  vehicleId: z.string().min(1, 'Veículo obrigatório'),
  date: z.string().min(1, 'Data obrigatória'),
  timeSlot: z.enum(['MANHÃ', 'TARDE', 'DIA TODO', 'HORÁRIO']),
  purpose: z.string().min(3, 'Finalidade obrigatória'),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const STATUS_CONFIG: Record<BookingStatus, {
  label: string;
  variant: 'warning' | 'success' | 'danger' | 'info';
  border: string;
  icon: React.ElementType;
}> = {
  PENDING: { label: 'Pendente', variant: 'warning', border: 'border-l-warning-400', icon: Clock },
  CONFIRMED: { label: 'Confirmado', variant: 'success', border: 'border-l-success-400', icon: CheckCircle2 },
  CANCELLED: { label: 'Cancelado', variant: 'danger', border: 'border-l-danger-400', icon: XCircle },
  COMPLETED: { label: 'Concluído', variant: 'info', border: 'border-l-blue-400', icon: CheckCircle2 },
};

const FILTER_TABS = [
  { key: '', label: 'Todos' },
  { key: 'PENDING', label: 'Pendentes' },
  { key: 'CONFIRMED', label: 'Confirmados' },
  { key: 'COMPLETED', label: 'Concluídos' },
] as const;

function formatDateLabel(dateStr: string): string {
  try {
    const d = parseISO(dateStr);
    if (isToday(d)) return 'Hoje';
    if (isTomorrow(d)) return 'Amanhã';
    if (isYesterday(d)) return 'Ontem';
    return format(d, "EEEE, dd 'de' MMMM", { locale: ptBR });
  } catch {
    return dateStr;
  }
}

function groupByDate(bookings: Booking[]): Record<string, Booking[]> {
  return bookings.reduce<Record<string, Booking[]>>((acc, b) => {
    const key = b.date.slice(0, 10);
    if (!acc[key]) acc[key] = [];
    acc[key].push(b);
    return acc;
  }, {});
}

export default function BookingsPage() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<BookingStatus | ''>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);

  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ['bookings', filter],
    queryFn: () =>
      api.get('/bookings', { params: { status: filter || undefined } }).then((r) => r.data),
  });

  const { data: vehicles = [] } = useQuery<Vehicle[]>({
    queryKey: ['vehicles-select'],
    queryFn: () =>
      api.get('/vehicles', { params: { status: 'ACTIVE', limit: 200 } }).then((r) => r.data?.vehicles ?? r.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: BookingFormData) => api.post('/bookings', data),
    onSuccess: () => {
      toast.success('Agendamento criado com sucesso!');
      qc.invalidateQueries({ queryKey: ['bookings'] });
      setModalOpen(false);
      reset();
    },
    onError: () => toast.error('Erro ao criar agendamento.'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: BookingFormData }) => api.patch(`/bookings/${id}`, data),
    onSuccess: () => {
      toast.success('Agendamento atualizado com sucesso!');
      qc.invalidateQueries({ queryKey: ['bookings'] });
      setModalOpen(false);
      setEditingBookingId(null);
      reset();
    },
    onError: () => toast.error('Erro ao atualizar agendamento.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/bookings/${id}`),
    onSuccess: () => {
      toast.success('Agendamento excluído com sucesso!');
      qc.invalidateQueries({ queryKey: ['bookings'] });
      setSelectedBooking(null);
    },
    onError: () => toast.error('Erro ao excluir agendamento.'),
  });

  const confirmMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/bookings/${id}/confirm`),
    onSuccess: () => {
      toast.success('Agendamento confirmado!');
      qc.invalidateQueries({ queryKey: ['bookings'] });
      setConfirmingId(null);
    },
    onError: () => toast.error('Erro ao confirmar agendamento.'),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      date: format(new Date(), 'yyyy-MM-dd'),
      timeSlot: 'MANHÃ',
    },
  });

  const grouped = groupByDate(bookings);
  const sortedDates = Object.keys(grouped).sort();
  const selectedBookingResolved = selectedBooking
    ? (bookings.find((b) => b.id === selectedBooking.id) ?? selectedBooking)
    : null;

  return (
    <div className="min-h-screen">
      <Header
        title="Agendamento de Veículos"
        breadcrumbs={[{ label: 'Agendamento' }]}
      />

      <div className="p-6 space-y-5 max-w-[1600px] mx-auto">
        {/* Filter tabs */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1 bg-white border border-brand-border rounded-xl p-1 w-fit flex-wrap">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as BookingStatus | '')}
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

          <div className="flex items-center gap-2 flex-wrap">
            {selectedBookingResolved && (
              <span className="hidden md:inline-flex text-xs font-medium text-brand-text-secondary bg-slate-100 px-2 py-1 rounded-md">
                Selecionado: {selectedBookingResolved.vehicle.plate}
              </span>
            )}
            <Button
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setEditingBookingId(null);
                reset({
                  date: format(new Date(), 'yyyy-MM-dd'),
                  timeSlot: 'MANHÃ',
                  purpose: '',
                  notes: '',
                  vehicleId: '',
                });
                setModalOpen(true);
              }}
            >
              Novo Agendamento
            </Button>
            <Button
              size="sm"
              variant="secondary"
              leftIcon={<Pencil className="w-4 h-4" />}
              disabled={!selectedBookingResolved}
              onClick={() => {
                if (!selectedBookingResolved) return;
                setEditingBookingId(selectedBookingResolved.id);
                reset({
                  vehicleId: selectedBookingResolved.vehicle.id,
                  date: selectedBookingResolved.date?.slice(0, 10),
                  timeSlot: selectedBookingResolved.timeSlot,
                  purpose: selectedBookingResolved.purpose,
                  notes: selectedBookingResolved.notes,
                });
                setModalOpen(true);
              }}
            >
              Editar
            </Button>
            <Button
              size="sm"
              variant="danger"
              leftIcon={<Trash2 className="w-4 h-4" />}
              disabled={!selectedBookingResolved || deleteMutation.isPending}
              onClick={() => {
                if (!selectedBookingResolved) return;
                if (confirm(`Deseja excluir o agendamento do veículo ${selectedBookingResolved.vehicle.plate}?`)) {
                  deleteMutation.mutate(selectedBookingResolved.id);
                }
              }}
            >
              Excluir
            </Button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-5 w-48" />
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="bg-white rounded-2xl border border-brand-border shadow-card p-4">
                    <Skeleton className="h-5 w-40 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-brand-border shadow-card">
            <CalendarDays className="w-12 h-12 text-slate-300 mb-3" />
            <p className="font-semibold text-brand-text-primary">Nenhum agendamento encontrado</p>
            <p className="text-sm text-brand-text-secondary mt-1 mb-4">
              {filter ? 'Tente mudar o filtro de status.' : 'Crie um novo agendamento para começar.'}
            </p>
            <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
              Novo Agendamento
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedDates.map((dateKey) => (
              <div key={dateKey}>
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-4 h-4 text-brand-text-secondary" />
                  <h3 className="font-semibold text-brand-text-primary capitalize">
                    {formatDateLabel(dateKey)}
                  </h3>
                  <span className="text-xs text-brand-text-secondary bg-slate-100 px-2 py-0.5 rounded-full">
                    {format(parseISO(dateKey), 'dd/MM/yyyy')}
                  </span>
                  <Badge variant="gray">{grouped[dateKey].length}</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {grouped[dateKey].map((booking, i) => {
                    const config = STATUS_CONFIG[booking.status];
                    const StatusIcon = config.icon;
                    return (
                      <motion.div
                        key={booking.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: i * 0.03 }}
                        className={cn(
                          'bg-white rounded-2xl border border-brand-border shadow-card hover:shadow-card-hover transition-shadow cursor-pointer',
                          'border-l-4',
                          config.border,
                          selectedBookingResolved?.id === booking.id && 'ring-2 ring-primary-200 border-primary-400',
                        )}
                        onClick={() => setSelectedBooking(booking)}
                      >
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Car className="w-4 h-4 text-primary-600" />
                              </div>
                              <div>
                                <div className="font-mono font-bold text-brand-text-primary">{booking.vehicle.plate}</div>
                                <div className="text-xs text-brand-text-secondary">{booking.vehicle.brand} {booking.vehicle.model}</div>
                              </div>
                            </div>
                            <Badge variant={config.variant} dot>{config.label}</Badge>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <User className="w-3.5 h-3.5 text-brand-text-secondary flex-shrink-0" />
                              <span className="text-brand-text-primary font-medium">{booking.user?.name ?? 'Usuário não identificado'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="w-3.5 h-3.5 text-brand-text-secondary flex-shrink-0" />
                              <span className="text-brand-text-secondary">{booking.timeSlot}</span>
                            </div>
                            <p className="text-xs text-brand-text-secondary line-clamp-2 mt-1">{booking.purpose}</p>
                          </div>

                          {booking.status === 'PENDING' && (
                            <div className="mt-3 pt-3 border-t border-brand-border/50">
                              <Button
                                size="sm"
                                variant="secondary"
                                className="w-full"
                                loading={confirmMutation.isPending && confirmingId === booking.id}
                                onClick={() => {
                                  setConfirmingId(booking.id);
                                  confirmMutation.mutate(booking.id);
                                }}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                Confirmar
                              </Button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Booking Modal */}
      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingBookingId(null); reset(); }}
        title={editingBookingId ? 'Editar Agendamento' : 'Novo Agendamento'}
        description={editingBookingId ? 'Atualize os dados do agendamento selecionado.' : 'Agende um veículo para um colaborador.'}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setModalOpen(false); setEditingBookingId(null); reset(); }}>Cancelar</Button>
            <Button
              loading={createMutation.isPending || updateMutation.isPending}
              onClick={handleSubmit(
                (d) => {
                  if (editingBookingId) {
                    updateMutation.mutate({ id: editingBookingId, data: d });
                    return;
                  }
                  createMutation.mutate(d);
                },
                () => toast.error('Preencha todos os campos obrigatórios'),
              )}
            >
              {editingBookingId ? 'Salvar Alterações' : 'Criar Agendamento'}
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
              <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">Data *</label>
              <input
                type="date"
                {...register('date')}
                className={cn('input-base', errors.date && 'border-danger-400')}
              />
              {errors.date && <p className="text-danger-500 text-xs mt-1">{errors.date.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">Período *</label>
              <select {...register('timeSlot')} className="input-base">
                <option value="MANHÃ">Manhã</option>
                <option value="TARDE">Tarde</option>
                <option value="DIA TODO">Dia Todo</option>
                <option value="HORÁRIO">Horário específico</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">Finalidade *</label>
            <input
              {...register('purpose')}
              placeholder="Ex: Visita a cliente, Entrega de material..."
              className={cn('input-base', errors.purpose && 'border-danger-400')}
            />
            {errors.purpose && <p className="text-danger-500 text-xs mt-1">{errors.purpose.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">Observações</label>
            <textarea
              {...register('notes')}
              placeholder="Informações adicionais..."
              rows={3}
              className="input-base resize-none"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
