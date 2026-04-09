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
  Users,
  AlertTriangle,
  Phone,
  MapPin,
  Route,
  X,
  Calendar,
  ShieldAlert,
} from 'lucide-react';
import { toast } from 'sonner';
import { differenceInDays, parseISO, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import api from '@/lib/api';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Badge, DriverStatusBadge, LicenseCategoryBadge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/cn';

interface Driver {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiry: string;
  status: string;
  branch: { id: string; name: string };
  _count: { routes: number };
}

const AVATAR_COLORS = [
  'bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-orange-500',
  'bg-rose-500', 'bg-cyan-500', 'bg-amber-500', 'bg-indigo-500',
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

function maskCPF(cpf: string): string {
  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11) return cpf;
  return `${digits.slice(0, 3)}.***.***-${digits.slice(9)}`;
}

function ExpiryCountdown({ expiryDate }: { expiryDate: string }) {
  const expiry = parseISO(expiryDate);
  const days = differenceInDays(expiry, new Date());
  const expired = days < 0;
  const critical = days >= 0 && days <= 30;
  const warning = days > 30 && days <= 60;

  return (
    <div className={cn(
      'flex items-center gap-1.5 text-xs font-medium',
      expired ? 'text-danger-600' :
      critical ? 'text-danger-500' :
      warning ? 'text-warning-600' :
      'text-brand-text-secondary',
    )}>
      {(expired || critical) && (
        <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0" />
      )}
      <span>
        {expired
          ? `Vencida há ${Math.abs(days)} dias`
          : days === 0
          ? 'Vence hoje!'
          : `${days} dias restantes`}
      </span>
    </div>
  );
}

const driverSchema = z.object({
  name: z.string().min(3, 'Nome obrigatório'),
  cpf: z.string().min(11, 'CPF inválido').max(14),
  phone: z.string().min(10, 'Telefone inválido'),
  licenseNumber: z.string().min(9, 'CNH inválida'),
  licenseCategory: z.string().min(1, 'Categoria obrigatória'),
  licenseExpiry: z.string().min(1, 'Validade obrigatória'),
  branchId: z.string().uuid('Filial obrigatória'),
});

type DriverFormData = z.infer<typeof driverSchema>;

export default function DriversPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Driver | null>(null);
  const [statusFilter, setStatusFilter] = useState('');

  const { data: drivers = [], isLoading } = useQuery<Driver[]>({
    queryKey: ['drivers', statusFilter],
    queryFn: () =>
      api.get('/drivers', { params: { status: statusFilter || undefined } }).then((r) => r.data),
  });

  const { data: branches = [] } = useQuery<Array<{ id: string; name: string }>>({
    queryKey: ['branches'],
    queryFn: () => api.get('/branches').then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: DriverFormData) => api.post('/drivers', data),
    onSuccess: () => {
      toast.success('Motorista cadastrado com sucesso!');
      qc.invalidateQueries({ queryKey: ['drivers'] });
      setModalOpen(false);
      reset();
    },
    onError: () => toast.error('Erro ao cadastrar motorista.'),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<DriverFormData>({
    resolver: zodResolver(driverSchema),
  });

  const filtered = drivers.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.cpf.includes(search) ||
      d.licenseNumber.includes(search),
  );

  // Drivers with expiring/expired licenses
  const expiringDrivers = drivers.filter((d) => {
    const days = differenceInDays(parseISO(d.licenseExpiry), new Date());
    return days <= 30 && d.status === 'ACTIVE';
  });

  const FILTER_TABS = [
    { key: '', label: 'Todos', count: drivers.length },
    { key: 'ACTIVE', label: 'Ativos', count: drivers.filter((d) => d.status === 'ACTIVE').length },
    { key: 'INACTIVE', label: 'Inativos', count: drivers.filter((d) => d.status === 'INACTIVE').length },
    { key: 'SUSPENDED', label: 'Suspensos', count: drivers.filter((d) => d.status === 'SUSPENDED').length },
  ];

  return (
    <div className="min-h-screen">
      <Header
        title="Motoristas"
        breadcrumbs={[{ label: 'Motoristas' }]}
        actions={
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
            Novo Motorista
          </Button>
        }
      />

      <div className="p-6 space-y-5 max-w-[1600px] mx-auto">
        {/* Expiring documents alert */}
        <AnimatePresence>
          {expiringDrivers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="alert-warning flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-warning-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertTriangle className="w-5 h-5 text-warning-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-warning-800 text-sm">
                    {expiringDrivers.length} motorista(s) com CNH vencendo em breve ou vencida
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {expiringDrivers.slice(0, 5).map((d) => (
                      <button
                        key={d.id}
                        onClick={() => setSelected(d)}
                        className="flex items-center gap-1.5 bg-white/60 hover:bg-white rounded-lg px-2.5 py-1 text-xs font-medium text-warning-800 border border-warning-200 transition-colors"
                      >
                        <span className={cn('w-6 h-6 rounded-full flex items-center justify-center text-white text-2xs font-bold flex-shrink-0', getAvatarColor(d.name))}>
                          {getInitials(d.name)}
                        </span>
                        {d.name.split(' ')[0]}
                      </button>
                    ))}
                    {expiringDrivers.length > 5 && (
                      <span className="text-xs text-warning-700 self-center">+{expiringDrivers.length - 5} mais</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
                <span className={cn('text-2xs font-bold px-1.5 py-0.5 rounded-full',
                  statusFilter === tab.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-brand-text-secondary',
                )}>
                  {tab.count}
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
              placeholder="Buscar nome, CPF ou CNH..."
              className="input-base pl-9"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Cards grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-brand-text-secondary"
          >
            <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <Users className="w-10 h-10 opacity-30" />
            </div>
            <p className="font-semibold">Nenhum motorista encontrado</p>
            <p className="text-sm mt-1 opacity-70">Tente ajustar os filtros ou cadastre um novo motorista.</p>
            <Button className="mt-4" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
              Cadastrar Motorista
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            <AnimatePresence>
              {filtered.map((driver, i) => {
                const days = differenceInDays(parseISO(driver.licenseExpiry), new Date());
                const isExpiringSoon = days <= 30;
                const isExpired = days < 0;

                return (
                  <motion.div
                    key={driver.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25, delay: i * 0.03 }}
                    whileHover={{ y: -3 }}
                    className={cn(
                      'bg-white rounded-2xl border shadow-card hover:shadow-card-hover transition-shadow cursor-pointer group',
                      (isExpired || isExpiringSoon) && driver.status === 'ACTIVE'
                        ? 'border-warning-200'
                        : 'border-brand-border',
                    )}
                    onClick={() => setSelected(driver)}
                  >
                    {/* Header */}
                    <div className="p-5 pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className={cn('w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0', getAvatarColor(driver.name))}>
                            {getInitials(driver.name)}
                          </div>
                          <div>
                            <p className="font-semibold text-brand-text-primary text-sm leading-tight">{driver.name}</p>
                            <p className="text-xs text-brand-text-secondary font-mono mt-0.5">{maskCPF(driver.cpf)}</p>
                          </div>
                        </div>
                        <DriverStatusBadge status={driver.status} />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="px-5 pb-4 space-y-2">
                      <div className="flex items-center gap-2 text-xs text-brand-text-secondary">
                        <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{driver.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-brand-text-secondary">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{driver.branch.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-brand-text-secondary">
                        <Route className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{driver._count.routes} rotas realizadas</span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className={cn(
                      'px-5 py-3 rounded-b-2xl border-t flex items-center justify-between',
                      (isExpired || isExpiringSoon) && driver.status === 'ACTIVE'
                        ? 'bg-warning-50/60 border-warning-100'
                        : 'bg-slate-50/80 border-brand-border/50',
                    )}>
                      <div className="flex items-center gap-2">
                        <LicenseCategoryBadge category={driver.licenseCategory} />
                        <span className="text-xs text-brand-text-secondary font-mono">{driver.licenseNumber}</span>
                      </div>
                      <div>
                        <ExpiryCountdown expiryDate={driver.licenseExpiry} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Create Driver Modal */}
      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); reset(); }}
        title="Novo Motorista"
        description="Preencha os dados do motorista para cadastrá-lo."
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setModalOpen(false); reset(); }}>Cancelar</Button>
            <Button loading={createMutation.isPending} onClick={handleSubmit((d) => createMutation.mutate(d))}>
              Cadastrar Motorista
            </Button>
          </>
        }
      >
        <form className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">Nome Completo *</label>
            <input {...register('name')} placeholder="Ex: Carlos Eduardo Silva" className={cn('input-base', errors.name && 'border-danger-400')} />
            {errors.name && <p className="text-danger-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">CPF *</label>
            <input {...register('cpf')} placeholder="000.000.000-00" className={cn('input-base font-mono', errors.cpf && 'border-danger-400')} />
            {errors.cpf && <p className="text-danger-500 text-xs mt-1">{errors.cpf.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">Telefone *</label>
            <input {...register('phone')} placeholder="(11) 99999-9999" className={cn('input-base', errors.phone && 'border-danger-400')} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">Número da CNH *</label>
            <input {...register('licenseNumber')} placeholder="00000000000" className={cn('input-base font-mono', errors.licenseNumber && 'border-danger-400')} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">Categoria CNH *</label>
            <select {...register('licenseCategory')} className={cn('input-base', errors.licenseCategory && 'border-danger-400')}>
              <option value="">Selecionar...</option>
              {['A', 'B', 'C', 'D', 'E', 'AB', 'AC', 'AD', 'AE'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">Validade da CNH *</label>
            <input {...register('licenseExpiry')} type="date" className={cn('input-base', errors.licenseExpiry && 'border-danger-400')} />
          </div>

          <div>
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

      {/* Driver detail modal */}
      {selected && (
        <Modal
          open={!!selected}
          onClose={() => setSelected(null)}
          title={selected.name}
          description={`CNH: ${selected.licenseNumber} (Cat. ${selected.licenseCategory})`}
          size="md"
          footer={<Button variant="secondary" onClick={() => setSelected(null)}>Fechar</Button>}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold', getAvatarColor(selected.name))}>
                {getInitials(selected.name)}
              </div>
              <div>
                <p className="font-bold text-lg text-brand-text-primary">{selected.name}</p>
                <DriverStatusBadge status={selected.status} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'CPF', value: maskCPF(selected.cpf), mono: true },
                { label: 'Telefone', value: selected.phone },
                { label: 'CNH', value: selected.licenseNumber, mono: true },
                { label: 'Categoria', value: selected.licenseCategory },
                { label: 'Validade CNH', value: format(parseISO(selected.licenseExpiry), 'dd/MM/yyyy') },
                { label: 'Filial', value: selected.branch.name },
                { label: 'Total de Rotas', value: selected._count.routes },
              ].map((item) => (
                <div key={item.label} className="bg-slate-50 rounded-xl p-3">
                  <div className="text-xs text-brand-text-secondary mb-1">{item.label}</div>
                  <div className={cn('text-sm font-semibold text-brand-text-primary', item.mono && 'font-mono')}>{item.value}</div>
                </div>
              ))}
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="text-xs text-brand-text-secondary mb-1">Status da CNH</div>
              <ExpiryCountdown expiryDate={selected.licenseExpiry} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
