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
  Truck,
  AlertTriangle,
  Fuel,
  Wrench,
  Eye,
  ChevronRight,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Badge, VehicleStatusBadge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Skeleton, SkeletonCard } from '@/components/ui/skeleton';
import { cn } from '@/lib/cn';

interface Vehicle {
  id: string;
  plate: string;
  model: string;
  brand: string;
  year: number;
  type: string;
  fuelType?: string;
  status: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';
  currentKm: number;
  nextMaintenanceKm?: number;
  nextMaintenanceDate?: string;
  branch: { name: string };
  _count: { routes: number };
}

const FILTER_TABS = [
  { key: '', label: 'Todos' },
  { key: 'ACTIVE', label: 'Ativos' },
  { key: 'MAINTENANCE', label: 'Manutenção' },
  { key: 'INACTIVE', label: 'Inativos' },
] as const;

const FUEL_LABELS: Record<string, { label: string; color: string }> = {
  GASOLINE: { label: 'Gasolina', color: 'text-orange-500' },
  DIESEL: { label: 'Diesel', color: 'text-slate-600' },
  ETHANOL: { label: 'Etanol', color: 'text-green-600' },
  FLEX: { label: 'Flex', color: 'text-blue-500' },
  ELECTRIC: { label: 'Elétrico', color: 'text-emerald-500' },
  GNV: { label: 'GNV', color: 'text-purple-500' },
};

const vehicleSchema = z.object({
  plate: z.string().min(7, 'Placa inválida').max(8),
  brand: z.string().min(1, 'Marca obrigatória'),
  model: z.string().min(1, 'Modelo obrigatório'),
  year: z.coerce.number().int().min(1990).max(new Date().getFullYear() + 1),
  type: z.string().min(1, 'Tipo obrigatório'),
  fuelType: z.string().min(1, 'Combustível obrigatório'),
  currentKm: z.coerce.number().min(0),
  nextMaintenanceKm: z.coerce.number().optional(),
  branchId: z.string().uuid('Filial obrigatória'),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

function VehicleCard({ vehicle, onClick }: { vehicle: Vehicle; onClick: () => void }) {
  const maintenanceSoon =
    vehicle.nextMaintenanceDate &&
    new Date(vehicle.nextMaintenanceDate) <= new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

  const kmProgress =
    vehicle.nextMaintenanceKm && vehicle.currentKm
      ? Math.min((vehicle.currentKm / vehicle.nextMaintenanceKm) * 100, 100)
      : null;

  const fuelInfo = FUEL_LABELS[vehicle.fuelType ?? ''];

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="bg-white rounded-2xl border border-brand-border shadow-card hover:shadow-card-hover transition-shadow cursor-pointer group"
      onClick={onClick}
    >
      {/* Card header */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-plate text-xl font-black text-brand-text-primary tracking-wider">
                {vehicle.plate}
              </span>
              {maintenanceSoon && (
                <span className="flex-shrink-0 w-2 h-2 bg-accent-500 rounded-full animate-pulse-orange" title="Manutenção próxima" />
              )}
            </div>
            <p className="text-sm text-brand-text-secondary">
              {vehicle.brand} {vehicle.model} · {vehicle.year}
            </p>
          </div>
          <VehicleStatusBadge status={vehicle.status} />
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 text-xs text-brand-text-secondary mt-3">
          <div className="flex items-center gap-1">
            <Truck className="w-3.5 h-3.5" />
            <span className="capitalize">{vehicle.type?.toLowerCase() ?? 'Veículo'}</span>
          </div>
          {fuelInfo && (
            <div className={cn('flex items-center gap-1', fuelInfo.color)}>
              <Fuel className="w-3.5 h-3.5" />
              <span>{fuelInfo.label}</span>
            </div>
          )}
        </div>
      </div>

      {/* KM progress */}
      <div className="px-5 pb-4">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-brand-text-secondary">KM Atual</span>
          <span className="font-semibold text-brand-text-primary">
            {vehicle.currentKm.toLocaleString('pt-BR')} km
          </span>
        </div>
        {kmProgress !== null && (
          <>
            <div className="progress-bar">
              <div
                className={cn(
                  'progress-fill',
                  kmProgress > 90 ? 'progress-fill-danger' :
                  kmProgress > 70 ? 'progress-fill-warning' :
                  'progress-fill',
                )}
                style={{ width: `${kmProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-2xs text-brand-text-secondary mt-1">
              <span>Próx. revisão: {vehicle.nextMaintenanceKm?.toLocaleString('pt-BR')} km</span>
              <span className={cn(kmProgress > 80 ? 'text-danger-500 font-semibold' : '')}>{Math.round(kmProgress)}%</span>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-slate-50/80 rounded-b-2xl border-t border-brand-border/50 flex items-center justify-between">
        <div className="text-xs text-brand-text-secondary">
          <span className="font-medium text-brand-text-primary">{vehicle.branch.name}</span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="xs" variant="ghost" leftIcon={<Eye className="w-3 h-3" />}>
            Detalhes
          </Button>
          {vehicle.status === 'ACTIVE' && (
            <Button size="xs" variant="ghost" leftIcon={<Wrench className="w-3 h-3" />}>
              Manutenção
            </Button>
          )}
        </div>
        <ChevronRight className="w-4 h-4 text-brand-text-secondary group-hover:text-primary-600 transition-colors" />
      </div>
    </motion.div>
  );
}

export default function FleetPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const { data: vehicles = [], isLoading } = useQuery<Vehicle[]>({
    queryKey: ['vehicles', statusFilter],
    queryFn: () =>
      api.get('/vehicles', { params: { status: statusFilter || undefined } }).then((r) => r.data),
  });

  const { data: branches = [] } = useQuery<Array<{ id: string; name: string }>>({
    queryKey: ['branches'],
    queryFn: () => api.get('/branches').then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: VehicleFormData) => api.post('/vehicles', data),
    onSuccess: () => {
      toast.success('Veículo cadastrado com sucesso!');
      qc.invalidateQueries({ queryKey: ['vehicles'] });
      setModalOpen(false);
      reset();
    },
    onError: () => toast.error('Erro ao cadastrar veículo. Tente novamente.'),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleFormData>({ resolver: zodResolver(vehicleSchema) });

  const filtered = vehicles.filter(
    (v) =>
      v.plate.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase()) ||
      v.brand.toLowerCase().includes(search.toLowerCase()),
  );

  const counts = {
    all: vehicles.length,
    ACTIVE: vehicles.filter((v) => v.status === 'ACTIVE').length,
    MAINTENANCE: vehicles.filter((v) => v.status === 'MAINTENANCE').length,
    INACTIVE: vehicles.filter((v) => v.status === 'INACTIVE').length,
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Frota"
        breadcrumbs={[{ label: 'Frota' }]}
        actions={
          <Button
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setModalOpen(true)}
          >
            Novo Veículo
          </Button>
        }
      />

      <div className="p-6 space-y-5 max-w-[1600px] mx-auto">
        {/* Toolbar */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Filter tabs */}
          <div className="flex items-center bg-white border border-brand-border rounded-xl p-1 gap-0.5">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5',
                  statusFilter === tab.key
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-brand-text-secondary hover:text-brand-text-primary hover:bg-slate-50',
                )}
              >
                {tab.label}
                <span className={cn(
                  'text-2xs font-bold px-1.5 py-0.5 rounded-full',
                  statusFilter === tab.key
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-brand-text-secondary',
                )}>
                  {tab.key === '' ? counts.all : counts[tab.key as keyof typeof counts]}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar placa, marca ou modelo..."
              className="input-base pl-9"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Results count */}
          {!isLoading && (
            <span className="text-sm text-brand-text-secondary">
              <span className="font-semibold text-brand-text-primary">{filtered.length}</span> veículos
            </span>
          )}
        </div>

        {/* Maintenance alert */}
        {!isLoading && filtered.some((v) =>
          v.nextMaintenanceDate &&
          new Date(v.nextMaintenanceDate) <= new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) &&
          v.status === 'ACTIVE',
        ) && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-3.5 bg-warning-50 border border-warning-200 rounded-xl text-sm"
          >
            <AlertTriangle className="w-5 h-5 text-warning-500 flex-shrink-0" />
            <span className="text-warning-700 font-medium">
              Alguns veículos estão com manutenção próxima do vencimento.
            </span>
            <Badge variant="warning" className="ml-auto">Atenção</Badge>
          </motion.div>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-brand-text-secondary"
          >
            <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <Truck className="w-10 h-10 opacity-30" />
            </div>
            <p className="font-semibold">Nenhum veículo encontrado</p>
            <p className="text-sm mt-1 opacity-70">Tente ajustar os filtros ou cadastre um novo veículo.</p>
            <Button
              className="mt-4"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setModalOpen(true)}
            >
              Cadastrar Veículo
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            <AnimatePresence>
              {filtered.map((vehicle, i) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: i * 0.03 }}
                >
                  <VehicleCard
                    vehicle={vehicle}
                    onClick={() => setSelectedVehicle(vehicle)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Create Vehicle Modal */}
      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); reset(); }}
        title="Novo Veículo"
        description="Preencha os dados do veículo para cadastrá-lo na frota."
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setModalOpen(false); reset(); }}>
              Cancelar
            </Button>
            <Button
              loading={createMutation.isPending}
              onClick={handleSubmit((d) => createMutation.mutate(d))}
            >
              Cadastrar Veículo
            </Button>
          </>
        }
      >
        <form className="grid grid-cols-2 gap-4">
          {/* Plate */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">Placa *</label>
            <input {...register('plate')} placeholder="ABC-1234" className={cn('input-base font-plate uppercase', errors.plate && 'border-danger-400')} />
            {errors.plate && <p className="text-danger-500 text-xs mt-1">{errors.plate.message}</p>}
          </div>

          {/* Type */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">Tipo *</label>
            <select {...register('type')} className={cn('input-base', errors.type && 'border-danger-400')}>
              <option value="">Selecionar...</option>
              {['TRUCK', 'VAN', 'CAR', 'MOTORCYCLE', 'BUS', 'TRAILER'].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Brand */}
          <div>
            <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">Marca *</label>
            <input {...register('brand')} placeholder="Ex: Mercedes-Benz" className={cn('input-base', errors.brand && 'border-danger-400')} />
            {errors.brand && <p className="text-danger-500 text-xs mt-1">{errors.brand.message}</p>}
          </div>

          {/* Model */}
          <div>
            <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">Modelo *</label>
            <input {...register('model')} placeholder="Ex: Accelo 1016" className={cn('input-base', errors.model && 'border-danger-400')} />
            {errors.model && <p className="text-danger-500 text-xs mt-1">{errors.model.message}</p>}
          </div>

          {/* Year */}
          <div>
            <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">Ano *</label>
            <input {...register('year')} type="number" placeholder="2024" className={cn('input-base', errors.year && 'border-danger-400')} />
            {errors.year && <p className="text-danger-500 text-xs mt-1">{errors.year.message}</p>}
          </div>

          {/* Fuel type */}
          <div>
            <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">Combustível *</label>
            <select {...register('fuelType')} className={cn('input-base', errors.fuelType && 'border-danger-400')}>
              <option value="">Selecionar...</option>
              {Object.entries(FUEL_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>

          {/* Current KM */}
          <div>
            <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">KM Atual *</label>
            <input {...register('currentKm')} type="number" placeholder="0" className={cn('input-base', errors.currentKm && 'border-danger-400')} />
          </div>

          {/* Next maintenance KM */}
          <div>
            <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">KM Próx. Revisão</label>
            <input {...register('nextMaintenanceKm')} type="number" placeholder="Opcional" className="input-base" />
          </div>

          {/* Branch */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">Filial *</label>
            <select {...register('branchId')} className={cn('input-base', errors.branchId && 'border-danger-400')}>
              <option value="">Selecionar filial...</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
            {errors.branchId && <p className="text-danger-500 text-xs mt-1">{errors.branchId.message}</p>}
          </div>
        </form>
      </Modal>

      {/* Vehicle detail modal */}
      {selectedVehicle && (
        <Modal
          open={!!selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
          title={`${selectedVehicle.brand} ${selectedVehicle.model}`}
          description={`Placa: ${selectedVehicle.plate}`}
          size="md"
          footer={
            <Button variant="secondary" onClick={() => setSelectedVehicle(null)}>
              Fechar
            </Button>
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Placa', value: selectedVehicle.plate, mono: true },
                { label: 'Ano', value: selectedVehicle.year },
                { label: 'Filial', value: selectedVehicle.branch.name },
                { label: 'Status', value: <VehicleStatusBadge status={selectedVehicle.status} /> },
                { label: 'KM Atual', value: `${selectedVehicle.currentKm.toLocaleString('pt-BR')} km` },
                { label: 'Total de Rotas', value: selectedVehicle._count.routes },
              ].map((item) => (
                <div key={item.label} className="bg-slate-50 rounded-xl p-3">
                  <div className="text-xs text-brand-text-secondary mb-1">{item.label}</div>
                  <div className={cn('text-sm font-semibold text-brand-text-primary', item.mono && 'font-plate')}>
                    {item.value as React.ReactNode}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
