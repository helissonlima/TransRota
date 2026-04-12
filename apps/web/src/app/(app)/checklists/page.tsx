'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  ClipboardList,
  ClipboardCheck,
  ClipboardX,
  ChevronRight,
  Trash2,
  GripVertical,
  CheckCircle2,
  AlertCircle,
  XCircle,
  X,
  Wrench,
  Truck,
  User,
  Eye,
  Fuel,
  MapPin,
  Shield,
} from 'lucide-react';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import api from '@/lib/api';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { DataTable, type Column } from '@/components/ui/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/cn';

type ChecklistType = 'PRE_TRIP' | 'POST_TRIP' | 'MAINTENANCE' | 'PERIODIC';
type ResolutionStatus = 'PENDING' | 'RESOLVED' | 'APPROVED';

interface ChecklistItem {
  id?: string;
  description: string;
  required: boolean;
  category?: string;
}

interface ChecklistTemplate {
  id: string;
  name: string;
  type: ChecklistType;
  description?: string;
  items: ChecklistItem[];
  _count: { executions: number };
  isActive: boolean;
}

interface ChecklistResponse {
  id: string;
  status: 'OK' | 'NOK' | 'NA';
  notes?: string;
  item: { description: string; isRequired: boolean; order: number };
}

interface ChecklistExecution {
  id: string;
  createdAt: string;
  executedAt: string;
  hasIssues: boolean;
  resolutionStatus: ResolutionStatus;
  resolvedAt?: string;
  resolvedByName?: string;
  inspectorId?: string;
  inspectorName?: string;
  fuelLevel?: string;
  externalDamage?: string;
  internalDamage?: string;
  unitLocation?: string;
  vehicle: { plate: string; brand: string; model: string };
  driver: { name: string };
  checklist: { name: string; type: ChecklistType };
  responses?: ChecklistResponse[];
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

const TYPE_CONFIG: Record<ChecklistType, {
  label: string;
  icon: React.ElementType;
  variant: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'orange' | 'gray';
  bg: string;
  text: string;
}> = {
  PRE_TRIP: {
    label: 'Pré-Viagem',
    icon: Truck,
    variant: 'info',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
  },
  POST_TRIP: {
    label: 'Pós-Viagem',
    icon: ClipboardCheck,
    variant: 'success',
    bg: 'bg-success-50',
    text: 'text-success-700',
  },
  MAINTENANCE: {
    label: 'Manutenção',
    icon: Wrench,
    variant: 'warning',
    bg: 'bg-warning-50',
    text: 'text-warning-700',
  },
  PERIODIC: {
    label: 'Periódica',
    icon: ClipboardList,
    variant: 'purple',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
  },
};

const RESOLUTION_CONFIG: Record<ResolutionStatus, {
  label: string;
  variant: 'orange' | 'info' | 'success';
}> = {
  PENDING: { label: 'Pendente', variant: 'orange' },
  RESOLVED: { label: 'Resolvido', variant: 'info' },
  APPROVED: { label: 'Aprovado', variant: 'success' },
};

const FUEL_LEVELS = ['1/4', '2/4', '3/4', 'CHEIO'];

const checklistSchema = z.object({
  name: z.string().min(3, 'Nome obrigatório'),
  type: z.enum(['PRE_TRIP', 'POST_TRIP', 'MAINTENANCE', 'PERIODIC']),
  description: z.string().optional(),
  items: z.array(
    z.object({
      description: z.string().min(3, 'Descrição obrigatória'),
      required: z.boolean(),
    }),
  ).min(1, 'Adicione ao menos 1 item'),
});

const executeSchema = z.object({
  vehicleId: z.string().min(1, 'Veículo obrigatório'),
  driverId: z.string().min(1, 'Motorista obrigatório'),
  inspectorId: z.string().optional(),
  fuelLevel: z.string().optional(),
  externalDamage: z.string().optional(),
  internalDamage: z.string().optional(),
  unitLocation: z.string().optional(),
});

type ChecklistFormData = z.infer<typeof checklistSchema>;
type ExecuteFormData = z.infer<typeof executeSchema>;

export default function ChecklistsPage() {
  const qc = useQueryClient();
  const [headerSearch, setHeaderSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<ChecklistType | ''>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ChecklistTemplate | null>(null);
  const [executeModalOpen, setExecuteModalOpen] = useState(false);
  const [executingTemplate, setExecutingTemplate] = useState<ChecklistTemplate | null>(null);
  const [selectedExecution, setSelectedExecution] = useState<ChecklistExecution | null>(null);

  const { data: templates = [], isLoading: loadingTemplates } = useQuery<ChecklistTemplate[]>({
    queryKey: ['checklists', typeFilter],
    queryFn: () =>
      api.get('/checklists', { params: { type: typeFilter || undefined } }).then((r) => r.data),
  });

  const { data: executions = [], isLoading: loadingExecutions } = useQuery<ChecklistExecution[]>({
    queryKey: ['checklist-executions'],
    queryFn: () =>
      api.get('/checklists/executions', { params: { limit: 20 } }).then((r) => r.data),
  });

  const { data: vehicles = [] } = useQuery<Vehicle[]>({
    queryKey: ['vehicles-select'],
    queryFn: () =>
      api.get('/vehicles', { params: { status: 'ACTIVE', limit: 200 } }).then((r) => r.data?.vehicles ?? r.data),
    enabled: executeModalOpen,
  });

  const { data: drivers = [] } = useQuery<Driver[]>({
    queryKey: ['drivers-select'],
    queryFn: () =>
      api.get('/drivers', { params: { status: 'ACTIVE', limit: 200 } }).then((r) => r.data?.drivers ?? r.data),
    enabled: executeModalOpen,
  });

  const createMutation = useMutation({
    mutationFn: (data: ChecklistFormData) => api.post('/checklists', data),
    onSuccess: () => {
      toast.success('Checklist criado com sucesso!');
      qc.invalidateQueries({ queryKey: ['checklists'] });
      setModalOpen(false);
      reset();
    },
    onError: () => toast.error('Erro ao criar checklist.'),
  });

  const executeMutation = useMutation({
    mutationFn: (data: ExecuteFormData) =>
      api.post(`/checklists/${executingTemplate!.id}/execute`, data),
    onSuccess: () => {
      toast.success('Execução iniciada com sucesso!');
      qc.invalidateQueries({ queryKey: ['checklist-executions'] });
      setExecuteModalOpen(false);
      resetExecute();
      setExecutingTemplate(null);
    },
    onError: () => toast.error('Erro ao iniciar execução.'),
  });

  const resolveMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'RESOLVED' | 'APPROVED' }) =>
      api.patch(`/checklists/executions/${id}/resolve`, { status }).then((r) => r.data),
    onSuccess: (updated) => {
      toast.success(updated.resolutionStatus === 'APPROVED' ? 'Execução aprovada!' : 'Execução marcada como resolvida!');
      qc.invalidateQueries({ queryKey: ['checklist-executions'] });
      setSelectedExecution((prev) => prev ? { ...prev, ...updated } : null);
    },
    onError: (err: any) => toast.error(err?.response?.data?.message ?? 'Erro ao atualizar status.'),
  });

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<ChecklistFormData>({
    resolver: zodResolver(checklistSchema),
    defaultValues: {
      type: 'PRE_TRIP',
      items: [{ description: '', required: true }],
    },
  });

  const {
    register: registerExecute,
    handleSubmit: handleSubmitExecute,
    reset: resetExecute,
    formState: { errors: executeErrors },
  } = useForm<ExecuteFormData>({
    resolver: zodResolver(executeSchema),
    defaultValues: { fuelLevel: '' },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  const filtered = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(headerSearch.toLowerCase()) &&
      (typeFilter === '' || t.type === typeFilter),
  );

  const checklistStats = {
    templates: templates.length,
    executions: executions.length,
    withIssues: executions.filter((e) => e.hasIssues).length,
    pending: executions.filter((e) => e.resolutionStatus === 'PENDING').length,
  };

  function openExecuteModal(template: ChecklistTemplate) {
    setExecutingTemplate(template);
    setSelectedTemplate(null);
    setExecuteModalOpen(true);
  }

  const executionColumns: Column<ChecklistExecution>[] = [
    {
      key: 'createdAt',
      header: 'Data/Hora',
      cell: (row) => (
        <span className="text-xs text-brand-text-secondary">
          {row.createdAt ? format(parseISO(row.createdAt), "dd/MM 'às' HH:mm", { locale: ptBR }) : '—'}
        </span>
      ),
    },
    {
      key: 'checklist',
      header: 'Checklist',
      cell: (row) => {
        const config = TYPE_CONFIG[row.checklist.type];
        return (
          <div className="flex items-center gap-2">
            <div className={cn('w-6 h-6 rounded-lg flex items-center justify-center', config.bg)}>
              <config.icon className={cn('w-3.5 h-3.5', config.text)} />
            </div>
            <span className="text-sm font-medium text-brand-text-primary">{row.checklist.name}</span>
          </div>
        );
      },
    },
    {
      key: 'vehicle',
      header: 'Veículo',
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-plate font-bold text-sm text-brand-text-primary">{row.vehicle.plate}</span>
          <span className="text-xs text-brand-text-secondary">{row.vehicle.brand}</span>
        </div>
      ),
    },
    {
      key: 'driver',
      header: 'Motorista',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-2xs font-bold flex-shrink-0">
            {row.driver.name.charAt(0)}
          </div>
          <span className="text-sm text-brand-text-primary">{row.driver.name}</span>
        </div>
      ),
    },
    {
      key: 'fuelLevel',
      header: 'Combustível',
      cell: (row) => (
        <span className="text-sm text-brand-text-secondary">
          {row.fuelLevel || '—'}
        </span>
      ),
    },
    {
      key: 'hasIssues',
      header: 'Status',
      cell: (row) => {
        const config = RESOLUTION_CONFIG[row.resolutionStatus];
        if (row.resolutionStatus !== 'PENDING') {
          return <Badge variant={config.variant} dot>{config.label}</Badge>;
        }
        if (row.hasIssues) {
          return (
            <div className="flex items-center gap-2">
              <Badge variant="danger" dot>Com Problemas</Badge>
            </div>
          );
        }
        return <Badge variant="success" dot>OK</Badge>;
      },
    },
  ];

  return (
    <div className="min-h-screen">
      <Header
        title="Checklists"
        breadcrumbs={[{ label: 'Checklists' }]}
        searchQuery={headerSearch}
        onSearchQueryChange={setHeaderSearch}
        searchPlaceholder="Buscar checklist..."
      />

      <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Templates', value: checklistStats.templates, icon: ClipboardList, tone: 'bg-blue-50 text-blue-700 border-blue-100' },
            { label: 'Execuções', value: checklistStats.executions, icon: ClipboardCheck, tone: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
            { label: 'Com Problemas', value: checklistStats.withIssues, icon: AlertCircle, tone: 'bg-amber-50 text-amber-700 border-amber-100' },
            { label: 'Pendentes', value: checklistStats.pending, icon: XCircle, tone: 'bg-rose-50 text-rose-700 border-rose-100' },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-2xl border border-brand-border shadow-card p-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-brand-text-secondary uppercase tracking-wide">{item.label}</p>
                  <p className="text-2xl font-black text-brand-text-primary mt-1">{item.value}</p>
                </div>
                <div className={cn('w-10 h-10 rounded-xl border flex items-center justify-center', item.tone)}>
                  <item.icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 flex-wrap bg-white rounded-2xl border border-brand-border shadow-card p-3.5">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center bg-white border border-brand-border rounded-xl p-1 gap-0.5">
              <button
                onClick={() => setTypeFilter('')}
                className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all', typeFilter === '' ? 'bg-primary-600 text-white' : 'text-brand-text-secondary hover:bg-slate-50')}
              >
                Todos
              </button>
              {(Object.entries(TYPE_CONFIG) as [ChecklistType, typeof TYPE_CONFIG[ChecklistType]][]).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => setTypeFilter(key)}
                  className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all', typeFilter === key ? 'bg-primary-600 text-white' : 'text-brand-text-secondary hover:bg-slate-50')}
                >
                  {cfg.label}
                </button>
              ))}
            </div>
            <span className="text-sm text-brand-text-secondary">
              <span className="font-semibold text-brand-text-primary">{filtered.length}</span> template(s)
            </span>
          </div>

          <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
            Criar Checklist
          </Button>
        </div>

        {/* Templates section */}
        <div className="bg-white rounded-2xl border border-brand-border shadow-card p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="text-lg font-bold text-brand-text-primary">Templates de Checklist</h2>
            <Badge variant="gray">{templates.length} totais</Badge>
          </div>

          {loadingTemplates ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card p-5 space-y-3">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-brand-text-secondary border-2 border-dashed border-brand-border rounded-2xl bg-slate-50/60">
              <ClipboardList className="w-12 h-12 mb-3 opacity-20" />
              <p className="font-semibold">Nenhum checklist encontrado</p>
              <Button className="mt-4" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
                Criar Checklist
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              <AnimatePresence>
                {filtered.map((template, i) => {
                  const config = TYPE_CONFIG[template.type];
                  const Icon = config.icon;
                  return (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25, delay: i * 0.04 }}
                      whileHover={{ y: -2 }}
                      className="card-lift bg-white rounded-2xl border border-brand-border shadow-card hover:shadow-card-hover cursor-pointer group"
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <div className="p-5">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', config.bg)}>
                              <Icon className={cn('w-5 h-5', config.text)} />
                            </div>
                            <div>
                              <h3 className="font-semibold text-brand-text-primary text-sm leading-tight">{template.name}</h3>
                              <Badge variant={config.variant} className="mt-1">{config.label}</Badge>
                            </div>
                          </div>
                          <button
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-brand-text-secondary hover:text-primary-600"
                            onClick={(e) => { e.stopPropagation(); setSelectedTemplate(template); }}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>

                        {template.description && (
                          <p className="text-xs text-brand-text-secondary mb-3 line-clamp-2">{template.description}</p>
                        )}

                        {/* Items preview */}
                        <div className="space-y-1 mb-4">
                          {template.items.slice(0, 3).map((item, j) => (
                            <div key={j} className="flex items-center gap-2 text-xs text-brand-text-secondary">
                              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-brand-border" />
                              <span className="truncate">{item.description}</span>
                              {item.required && (
                                <span className="text-danger-400 flex-shrink-0">*</span>
                              )}
                            </div>
                          ))}
                          {template.items.length > 3 && (
                            <div className="text-xs text-brand-text-secondary pl-5">
                              +{template.items.length - 3} itens adicionais
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="px-5 py-3 bg-slate-50/80 rounded-b-2xl border-t border-brand-border/50 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-brand-text-secondary">
                          <ClipboardCheck className="w-3.5 h-3.5" />
                          <span><span className="font-semibold text-brand-text-primary">{template._count?.executions ?? 0}</span> execuções</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-brand-text-secondary">
                          <span>{template.items.length} itens</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Recent executions */}
        <div className="bg-white rounded-2xl border border-brand-border shadow-card p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-brand-text-primary">Execuções Recentes</h2>
            <Badge variant="gray">{executions.length} registros</Badge>
          </div>
          <DataTable
            columns={executionColumns}
            data={executions}
            loading={loadingExecutions}
            rowKey={(r) => r.id}
            onRowClick={(r) => setSelectedExecution(r)}
            emptyIcon={ClipboardX}
            emptyTitle="Nenhuma execução registrada"
            emptyDescription="As execuções de checklist aparecerão aqui."
            skeletonRows={5}
          />
        </div>
      </div>

      {/* Execution Detail Modal */}
      {selectedExecution && (
        <Modal
          open={!!selectedExecution}
          onClose={() => setSelectedExecution(null)}
          title={selectedExecution.checklist.name}
          description={`${selectedExecution.createdAt ? format(parseISO(selectedExecution.createdAt), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR }) : ''} • ${selectedExecution.driver.name}`}
          size="xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                {selectedExecution.resolutionStatus === 'PENDING' && selectedExecution.hasIssues && (
                  <Button
                    variant="secondary"
                    loading={resolveMutation.isPending}
                    onClick={() => resolveMutation.mutate({ id: selectedExecution.id, status: 'RESOLVED' })}
                  >
                    Marcar como Resolvido
                  </Button>
                )}
                {selectedExecution.resolutionStatus === 'RESOLVED' && (
                  <Button
                    loading={resolveMutation.isPending}
                    onClick={() => resolveMutation.mutate({ id: selectedExecution.id, status: 'APPROVED' })}
                  >
                    Aprovar
                  </Button>
                )}
              </div>
              <Button variant="secondary" onClick={() => setSelectedExecution(null)}>Fechar</Button>
            </div>
          }
        >
          <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1 scrollbar-thin">
            {/* Info grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-xs text-brand-text-secondary mb-1">Tipo</div>
                <div className="text-sm font-semibold text-brand-text-primary flex items-center gap-2">
                  <Badge variant={TYPE_CONFIG[selectedExecution.checklist.type].variant}>
                    {TYPE_CONFIG[selectedExecution.checklist.type].label}
                  </Badge>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-xs text-brand-text-secondary mb-1">Status</div>
                <div className="text-sm font-semibold">
                  {(() => {
                    const config = RESOLUTION_CONFIG[selectedExecution.resolutionStatus];
                    if (selectedExecution.resolutionStatus !== 'PENDING') {
                      return <Badge variant={config.variant} dot>{config.label}</Badge>;
                    }
                    if (selectedExecution.hasIssues) return <Badge variant="danger" dot>Com Problemas</Badge>;
                    return <Badge variant="success" dot>OK</Badge>;
                  })()}
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-xs text-brand-text-secondary mb-1">Veículo</div>
                <div className="text-sm font-semibold text-brand-text-primary">
                  <span className="font-mono">{selectedExecution.vehicle.plate}</span>
                  <span className="text-brand-text-secondary"> — {selectedExecution.vehicle.brand} {selectedExecution.vehicle.model}</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-xs text-brand-text-secondary mb-1">Motorista</div>
                <div className="text-sm font-semibold text-brand-text-primary">{selectedExecution.driver.name}</div>
              </div>
              {selectedExecution.inspectorName && (
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="text-xs text-brand-text-secondary mb-1">Inspetor</div>
                  <div className="text-sm font-semibold text-brand-text-primary">{selectedExecution.inspectorName}</div>
                </div>
              )}
              {selectedExecution.fuelLevel && (
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="text-xs text-brand-text-secondary mb-1">Combustível</div>
                  <div className="text-sm font-semibold text-brand-text-primary flex items-center gap-1.5">
                    <Fuel className="w-4 h-4 text-brand-text-secondary" />
                    {selectedExecution.fuelLevel}
                  </div>
                </div>
              )}
              {selectedExecution.unitLocation && (
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="text-xs text-brand-text-secondary mb-1">Localização</div>
                  <div className="text-sm font-semibold text-brand-text-primary flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-brand-text-secondary" />
                    {selectedExecution.unitLocation}
                  </div>
                </div>
              )}
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-xs text-brand-text-secondary mb-1">Data/Hora</div>
                <div className="text-sm font-semibold text-brand-text-primary">
                  {format(parseISO(selectedExecution.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </div>
              </div>
              {selectedExecution.resolvedAt && (
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="text-xs text-brand-text-secondary mb-1">
                    {selectedExecution.resolutionStatus === 'APPROVED' ? 'Aprovado em' : 'Resolvido em'}
                  </div>
                  <div className="text-sm font-semibold text-brand-text-primary">
                    {format(parseISO(selectedExecution.resolvedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    {selectedExecution.resolvedByName && (
                      <span className="text-brand-text-secondary"> por {selectedExecution.resolvedByName}</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Avarias */}
            {(selectedExecution.externalDamage || selectedExecution.internalDamage) && (
              <div className="space-y-2">
                {selectedExecution.externalDamage && (
                  <div className="bg-warning-50 rounded-xl border border-warning-200 p-3">
                    <div className="text-xs text-warning-600 font-semibold mb-1 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" /> Avaria Externa
                    </div>
                    <div className="text-sm text-warning-800">{selectedExecution.externalDamage}</div>
                  </div>
                )}
                {selectedExecution.internalDamage && (
                  <div className="bg-warning-50 rounded-xl border border-warning-200 p-3">
                    <div className="text-xs text-warning-600 font-semibold mb-1 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" /> Avaria Interna
                    </div>
                    <div className="text-sm text-warning-800">{selectedExecution.internalDamage}</div>
                  </div>
                )}
              </div>
            )}

            {/* Itens verificados */}
            {selectedExecution.responses && selectedExecution.responses.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-brand-text-secondary uppercase tracking-wide mb-2">
                  Itens Verificados
                </div>
                <div className="space-y-1.5">
                  {selectedExecution.responses.map((r) => (
                    <div
                      key={r.id}
                      className={cn(
                        'flex items-start gap-3 rounded-xl px-3 py-2.5 border',
                        r.status === 'OK' && 'bg-success-50 border-success-200',
                        r.status === 'NOK' && 'bg-danger-50 border-danger-200',
                        r.status === 'NA' && 'bg-slate-50 border-slate-200',
                      )}
                    >
                      <div className={cn(
                        'mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold',
                        r.status === 'OK' && 'bg-success-500',
                        r.status === 'NOK' && 'bg-danger-500',
                        r.status === 'NA' && 'bg-slate-400',
                      )}>
                        {r.status === 'OK' ? '✓' : r.status === 'NOK' ? '✗' : '—'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={cn(
                          'text-sm font-medium',
                          r.status === 'OK' && 'text-success-800',
                          r.status === 'NOK' && 'text-danger-800',
                          r.status === 'NA' && 'text-slate-600',
                        )}>
                          {r.item.description}
                          {r.item.isRequired && (
                            <span className="ml-1 text-xs font-normal opacity-60">*</span>
                          )}
                        </div>
                        {r.notes && (
                          <div className="text-xs text-brand-text-secondary mt-0.5">{r.notes}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Create Checklist Modal */}
      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); reset(); }}
        title="Novo Checklist"
        description="Defina o template com os itens de verificação."
        size="xl"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setModalOpen(false); reset(); }}>Cancelar</Button>
            <Button loading={createMutation.isPending} onClick={handleSubmit(
              (d) => createMutation.mutate(d),
              () => toast.error('Preencha todos os campos obrigatórios'),
            )}>
              Criar Checklist
            </Button>
          </>
        }
      >
        <form className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">Nome *</label>
              <input {...register('name')} placeholder="Ex: Inspeção Pré-Viagem" className={cn('input-base', errors.name && 'border-danger-400')} />
              {errors.name && <p className="text-danger-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">Tipo *</label>
              <select {...register('type')} className="input-base">
                {(Object.entries(TYPE_CONFIG) as [ChecklistType, typeof TYPE_CONFIG[ChecklistType]][]).map(([key, cfg]) => (
                  <option key={key} value={key}>{cfg.label}</option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">Descrição</label>
              <textarea
                {...register('description')}
                placeholder="Descreva o objetivo deste checklist..."
                rows={2}
                className="input-base resize-none"
              />
            </div>
          </div>

          {/* Items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-brand-text-primary">
                Itens de Verificação *
              </label>
              <span className="text-xs text-brand-text-secondary">{fields.length} itens</span>
            </div>

            {errors.items && !errors.items[0] && (
              <p className="text-danger-500 text-xs mb-2">{errors.items.message}</p>
            )}

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
              <AnimatePresence>
                {fields.map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 bg-slate-50 rounded-xl p-2.5 border border-brand-border/50"
                  >
                    <GripVertical className="w-4 h-4 text-brand-text-secondary flex-shrink-0 cursor-grab" />
                    <span className="text-xs font-bold text-brand-text-secondary w-5 flex-shrink-0">{index + 1}</span>
                    <input
                      {...register(`items.${index}.description`)}
                      placeholder={`Item ${index + 1}...`}
                      className={cn('flex-1 text-sm bg-transparent outline-none text-brand-text-primary placeholder:text-brand-text-secondary/50 min-w-0', errors.items?.[index]?.description && 'text-danger-600')}
                    />
                    <label className="flex items-center gap-1.5 text-xs text-brand-text-secondary flex-shrink-0 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register(`items.${index}.required`)}
                        className="w-3.5 h-3.5 rounded accent-primary-600"
                      />
                      Obrigatório
                    </label>
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-slate-400 hover:text-danger-500 hover:bg-danger-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={() => append({ description: '', required: false })}
              className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-brand-border rounded-xl text-sm text-brand-text-secondary hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50 transition-all"
            >
              <Plus className="w-4 h-4" />
              Adicionar Item
            </button>
          </div>
        </form>
      </Modal>

      {/* Template detail modal */}
      {selectedTemplate && (
        <Modal
          open={!!selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
          title={selectedTemplate.name}
          description={selectedTemplate.description}
          size="md"
          footer={
            <>
              <Button variant="secondary" onClick={() => setSelectedTemplate(null)}>Fechar</Button>
              <Button
                leftIcon={<ClipboardCheck className="w-4 h-4" />}
                onClick={() => openExecuteModal(selectedTemplate)}
              >
                Iniciar Execução
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant={TYPE_CONFIG[selectedTemplate.type].variant}>
                {TYPE_CONFIG[selectedTemplate.type].label}
              </Badge>
              <span className="text-sm text-brand-text-secondary">
                {selectedTemplate.items.length} itens · {selectedTemplate._count.executions} execuções
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-brand-text-primary">Itens de Verificação</h4>
              <div className="space-y-1.5">
                {selectedTemplate.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-brand-border/50"
                  >
                    <div className="w-6 h-6 rounded-full border-2 border-brand-border/60 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xs font-bold text-brand-text-secondary">{i + 1}</span>
                    </div>
                    <span className="flex-1 text-sm text-brand-text-primary">{item.description}</span>
                    {item.required && (
                      <span className="text-2xs text-danger-500 font-semibold bg-danger-50 px-1.5 py-0.5 rounded-md flex-shrink-0">
                        Obrigatório
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Execute Checklist Modal */}
      {executingTemplate && (
        <Modal
          open={executeModalOpen}
          onClose={() => { setExecuteModalOpen(false); resetExecute(); setExecutingTemplate(null); }}
          title={`Executar: ${executingTemplate.name}`}
          description="Preencha os dados da inspeção antes de iniciar."
          size="lg"
          footer={
            <>
              <Button variant="secondary" onClick={() => { setExecuteModalOpen(false); resetExecute(); setExecutingTemplate(null); }}>Cancelar</Button>
              <Button
                loading={executeMutation.isPending}
                leftIcon={<ClipboardCheck className="w-4 h-4" />}
                onClick={handleSubmitExecute(
                  (d) => executeMutation.mutate(d),
                  () => toast.error('Preencha todos os campos obrigatórios'),
                )}
              >
                Iniciar Execução
              </Button>
            </>
          }
        >
          <form className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">Veículo *</label>
                <select {...registerExecute('vehicleId')} className={cn('input-base', executeErrors.vehicleId && 'border-danger-400')}>
                  <option value="">Selecione o veículo</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>{v.plate} — {v.brand} {v.model}</option>
                  ))}
                </select>
                {executeErrors.vehicleId && <p className="text-danger-500 text-xs mt-1">{executeErrors.vehicleId.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">Motorista *</label>
                <select {...registerExecute('driverId')} className={cn('input-base', executeErrors.driverId && 'border-danger-400')}>
                  <option value="">Selecione o motorista</option>
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
                {executeErrors.driverId && <p className="text-danger-500 text-xs mt-1">{executeErrors.driverId.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">
                  <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Inspetor</span>
                </label>
                <input
                  {...registerExecute('inspectorId')}
                  placeholder="Nome ou ID do inspetor"
                  className="input-base"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">
                  <span className="flex items-center gap-1.5"><Fuel className="w-3.5 h-3.5" /> Nível de Combustível</span>
                </label>
                <select {...registerExecute('fuelLevel')} className="input-base">
                  <option value="">Selecione</option>
                  {FUEL_LEVELS.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Localização da Unidade</span>
                </label>
                <input
                  {...registerExecute('unitLocation')}
                  placeholder="Ex: Pátio Norte, Filial SP..."
                  className="input-base"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">
                  <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-warning-500" /> Avaria Externa</span>
                </label>
                <textarea
                  {...registerExecute('externalDamage')}
                  placeholder="Descreva avarias externas (se houver)..."
                  rows={3}
                  className="input-base resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">
                  <span className="flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5 text-warning-500" /> Avaria Interna</span>
                </label>
                <textarea
                  {...registerExecute('internalDamage')}
                  placeholder="Descreva avarias internas (se houver)..."
                  rows={3}
                  className="input-base resize-none"
                />
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
