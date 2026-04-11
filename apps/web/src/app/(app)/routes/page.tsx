'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  MapPin,
  Truck,
  User,
  Clock,
  CheckCircle2,
  Play,
  XCircle,
  FileEdit,
  ChevronRight,
  Package,
  X,
  Navigation,
} from 'lucide-react';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import api from '@/lib/api';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Badge, RouteStatusBadge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/cn';

type RouteStatus = 'DRAFT' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

interface RouteStop {
  id: string;
  sequence: number;
  address: string;
  status: string;
  deliveryStatus?: string;
}

interface Route {
  id: string;
  name: string;
  status: RouteStatus;
  scheduledDate: string;
  vehicle?: { plate: string; brand: string; model: string };
  driver?: { name: string };
  stops?: RouteStop[];
  _count: { stops: number };
  completedStops?: number;
}

const STATUS_CONFIG: Record<RouteStatus, {
  label: string;
  icon: React.ElementType;
  headerBg: string;
  headerText: string;
  cardBorder: string;
  dotColor: string;
}> = {
  DRAFT: {
    label: 'Rascunho',
    icon: FileEdit,
    headerBg: 'bg-slate-100',
    headerText: 'text-slate-600',
    cardBorder: 'border-slate-200',
    dotColor: 'bg-slate-400',
  },
  SCHEDULED: {
    label: 'Agendadas',
    icon: Clock,
    headerBg: 'bg-blue-50',
    headerText: 'text-blue-700',
    cardBorder: 'border-blue-100',
    dotColor: 'bg-blue-500',
  },
  IN_PROGRESS: {
    label: 'Em Andamento',
    icon: Play,
    headerBg: 'bg-warning-50',
    headerText: 'text-warning-700',
    cardBorder: 'border-warning-100',
    dotColor: 'bg-warning-500',
  },
  COMPLETED: {
    label: 'Concluídas',
    icon: CheckCircle2,
    headerBg: 'bg-success-50',
    headerText: 'text-success-700',
    cardBorder: 'border-success-100',
    dotColor: 'bg-success-500',
  },
  CANCELLED: {
    label: 'Canceladas',
    icon: XCircle,
    headerBg: 'bg-danger-50',
    headerText: 'text-danger-600',
    cardBorder: 'border-danger-100',
    dotColor: 'bg-danger-500',
  },
};

const KANBAN_COLUMNS: RouteStatus[] = ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

const routeSchema = z.object({
  name: z.string().min(3, 'Nome obrigatório'),
  scheduledDate: z.string().min(1, 'Data obrigatória'),
  vehicleId: z.string().uuid('Veículo obrigatório'),
  driverId: z.string().uuid('Motorista obrigatório'),
});

type RouteFormData = z.infer<typeof routeSchema>;

function RouteCard({ route, onClick }: { route: Route; onClick: () => void }) {
  const config = STATUS_CONFIG[route.status];
  const progress = route._count.stops > 0
    ? ((route.completedStops ?? 0) / route._count.stops) * 100
    : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={cn(
        'bg-white rounded-xl border shadow-card hover:shadow-card-hover transition-shadow cursor-pointer',
        config.cardBorder,
      )}
      onClick={onClick}
    >
      {/* Card body */}
      <div className="p-4">
        {/* Route name + date */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0', config.headerBg)}>
              <config.icon className={cn('w-3.5 h-3.5', config.headerText)} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-brand-text-primary leading-tight truncate max-w-[140px]">
                {route.name}
              </p>
              <p className="text-xs text-brand-text-secondary mt-0.5">
                {format(parseISO(route.scheduledDate), 'dd/MM/yyyy', { locale: ptBR })}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-brand-text-secondary flex-shrink-0 mt-0.5" />
        </div>

        {/* Vehicle + Driver */}
        {route.vehicle && (
          <div className="flex items-center gap-1.5 text-xs text-brand-text-secondary mb-1">
            <Truck className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="font-plate font-semibold text-brand-text-primary">{route.vehicle.plate}</span>
            <span className="text-brand-text-secondary">· {route.vehicle.brand}</span>
          </div>
        )}
        {route.driver && (
          <div className="flex items-center gap-1.5 text-xs text-brand-text-secondary mb-3">
            <User className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{route.driver.name}</span>
          </div>
        )}

        {/* Progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-brand-text-secondary">
              <Package className="w-3 h-3" />
              <span>{route.completedStops ?? 0}/{route._count.stops} paradas</span>
            </div>
            {route._count.stops > 0 && (
              <span className={cn('font-semibold', progress === 100 ? 'text-success-600' : 'text-brand-text-secondary')}>
                {Math.round(progress)}%
              </span>
            )}
          </div>
          {route._count.stops > 0 && (
            <div className="progress-bar">
              <div
                className={cn(
                  'progress-fill',
                  progress === 100 ? 'progress-fill-success' :
                  progress > 50 ? '' :
                  'progress-fill-warning',
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function KanbanColumn({
  status,
  routes,
  loading,
  onSelectRoute,
}: {
  status: RouteStatus;
  routes: Route[];
  loading: boolean;
  onSelectRoute: (route: Route) => void;
}) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <div className="kanban-column flex flex-col">
      {/* Column header */}
      <div className={cn('flex items-center justify-between px-4 py-3 rounded-t-xl', config.headerBg)}>
        <div className="flex items-center gap-2">
          <div className={cn('w-2 h-2 rounded-full', config.dotColor)} />
          <span className={cn('text-sm font-semibold', config.headerText)}>{config.label}</span>
        </div>
        <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full bg-white/60', config.headerText)}>
          {routes.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex-1 p-3 space-y-2.5 min-h-[200px] max-h-[calc(100vh-280px)] overflow-y-auto scrollbar-thin">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-brand-border p-4 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))
        ) : routes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-brand-text-secondary text-xs opacity-60">
            <Icon className="w-6 h-6 mb-2" />
            <span>Nenhuma rota</span>
          </div>
        ) : (
          <AnimatePresence>
            {routes.map((route) => (
              <RouteCard
                key={route.id}
                route={route}
                onClick={() => onSelectRoute(route)}
              />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

export default function RoutesPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);

  const { data: routes = [], isLoading } = useQuery<Route[]>({
    queryKey: ['routes'],
    queryFn: () => api.get('/routes').then((r) => r.data),
    refetchInterval: 15_000,
  });

  const { data: vehicles = [] } = useQuery<Array<{ id: string; plate: string; brand: string; model: string }>>({
    queryKey: ['vehicles-active'],
    queryFn: () => api.get('/vehicles', { params: { status: 'ACTIVE' } }).then((r) => r.data),
  });

  const { data: drivers = [] } = useQuery<Array<{ id: string; name: string }>>({
    queryKey: ['drivers-active'],
    queryFn: () => api.get('/drivers', { params: { status: 'ACTIVE' } }).then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: RouteFormData) => api.post('/routes', data),
    onSuccess: () => {
      toast.success('Rota criada com sucesso!');
      qc.invalidateQueries({ queryKey: ['routes'] });
      setModalOpen(false);
      reset();
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Erro ao criar rota.'),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<RouteFormData>({
    resolver: zodResolver(routeSchema),
  });

  const filteredRoutes = routes.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.driver?.name.toLowerCase().includes(search.toLowerCase()) ||
      r.vehicle?.plate.toLowerCase().includes(search.toLowerCase()),
  );

  const grouped = KANBAN_COLUMNS.reduce((acc, status) => {
    acc[status] = filteredRoutes.filter((r) => r.status === status);
    return acc;
  }, {} as Record<RouteStatus, Route[]>);

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        title="Rotas"
        breadcrumbs={[{ label: 'Rotas' }]}
      />

      <div className="flex-1 p-6 flex flex-col gap-5 max-w-[1800px] mx-auto w-full">
        {/* Toolbar */}
        <div className="flex items-center gap-3">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar rota, motorista ou placa..."
              className="input-base pl-9"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
            <span className="font-semibold text-brand-text-primary">{routes.length}</span> rotas total
          </div>

          <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
            Nova Rota
          </Button>

          {/* Live indicator */}
          <div className="ml-auto flex items-center gap-1.5 text-xs text-brand-text-secondary bg-white border border-brand-border rounded-lg px-2.5 py-1.5">
            <div className="w-1.5 h-1.5 bg-success-500 rounded-full animate-pulse-soft" />
            Atualizando em tempo real
          </div>
        </div>

        {/* Kanban board */}
        <div className="flex-1 flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
          {KANBAN_COLUMNS.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              routes={grouped[status]}
              loading={isLoading}
              onSelectRoute={setSelectedRoute}
            />
          ))}

          {/* Empty state overlay */}
          {!isLoading && routes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center text-brand-text-secondary">
                <Navigation className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="font-semibold">Nenhuma rota cadastrada</p>
                <p className="text-sm mt-1 opacity-60">Crie a primeira rota para começar</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Route Modal */}
      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); reset(); }}
        title="Nova Rota"
        description="Configure os dados da nova rota."
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setModalOpen(false); reset(); }}>Cancelar</Button>
            <Button loading={createMutation.isPending} onClick={handleSubmit((d) => createMutation.mutate(d))}>
              Criar Rota
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">Nome da Rota *</label>
            <input {...register('name')} placeholder="Ex: Zona Sul — Entrega" className={cn('input-base', errors.name && 'border-danger-400')} />
            {errors.name && <p className="text-danger-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">Data Agendada *</label>
            <input {...register('scheduledDate')} type="datetime-local" className={cn('input-base', errors.scheduledDate && 'border-danger-400')} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">Veículo *</label>
            <select {...register('vehicleId')} className={cn('input-base', errors.vehicleId && 'border-danger-400')}>
              <option value="">Selecionar veículo...</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>{v.plate} — {v.brand} {v.model}</option>
              ))}
            </select>
            {errors.vehicleId && <p className="text-danger-500 text-xs mt-1">{errors.vehicleId.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">Motorista *</label>
            <select {...register('driverId')} className={cn('input-base', errors.driverId && 'border-danger-400')}>
              <option value="">Selecionar motorista...</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            {errors.driverId && <p className="text-danger-500 text-xs mt-1">{errors.driverId.message}</p>}
          </div>
        </form>
      </Modal>

      {/* Route detail modal */}
      {selectedRoute && (
        <Modal
          open={!!selectedRoute}
          onClose={() => setSelectedRoute(null)}
          title={selectedRoute.name}
          size="lg"
          footer={<Button variant="secondary" onClick={() => setSelectedRoute(null)}>Fechar</Button>}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <RouteStatusBadge status={selectedRoute.status} />
              <span className="text-sm text-brand-text-secondary">
                {format(parseISO(selectedRoute.scheduledDate), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {selectedRoute.vehicle && (
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="text-xs text-brand-text-secondary mb-1">Veículo</div>
                  <div className="text-sm font-semibold text-brand-text-primary font-plate">{selectedRoute.vehicle.plate}</div>
                  <div className="text-xs text-brand-text-secondary">{selectedRoute.vehicle.brand} {selectedRoute.vehicle.model}</div>
                </div>
              )}
              {selectedRoute.driver && (
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="text-xs text-brand-text-secondary mb-1">Motorista</div>
                  <div className="text-sm font-semibold text-brand-text-primary">{selectedRoute.driver.name}</div>
                </div>
              )}
            </div>

            {/* Stops */}
            {selectedRoute.stops && selectedRoute.stops.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-brand-text-primary mb-3">
                  Paradas ({selectedRoute.stops.length})
                </h4>
                <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
                  {selectedRoute.stops.map((stop) => (
                    <div key={stop.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <div className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center text-2xs font-bold flex-shrink-0',
                        stop.status === 'COMPLETED' ? 'bg-success-100 text-success-700' :
                        stop.status === 'IN_PROGRESS' ? 'bg-warning-100 text-warning-700' :
                        'bg-slate-200 text-slate-600',
                      )}>
                        {stop.sequence}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-brand-text-primary truncate">{stop.address}</p>
                      </div>
                      {stop.deliveryStatus && (
                        <Badge variant={stop.deliveryStatus === 'DELIVERED' ? 'success' : 'warning'} className="flex-shrink-0">
                          {stop.deliveryStatus === 'DELIVERED' ? 'Entregue' : 'Pendente'}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
