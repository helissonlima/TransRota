'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
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

interface ChecklistExecution {
  id: string;
  createdAt: string;
  hasIssues: boolean;
  completedAt?: string;
  vehicle: { plate: string; brand: string };
  driver: { name: string };
  checklist: { name: string; type: ChecklistType };
  _count?: { issues: number };
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

type ChecklistFormData = z.infer<typeof checklistSchema>;

const MOCK_EXECUTIONS: ChecklistExecution[] = [
  {
    id: '1',
    createdAt: new Date().toISOString(),
    hasIssues: false,
    completedAt: new Date().toISOString(),
    vehicle: { plate: 'ABC-1234', brand: 'Mercedes-Benz' },
    driver: { name: 'Carlos Silva' },
    checklist: { name: 'Inspeção Pré-Viagem', type: 'PRE_TRIP' },
    _count: { issues: 0 },
  },
  {
    id: '2',
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    hasIssues: true,
    completedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    vehicle: { plate: 'DEF-5678', brand: 'Volvo' },
    driver: { name: 'Ana Souza' },
    checklist: { name: 'Inspeção Pré-Viagem', type: 'PRE_TRIP' },
    _count: { issues: 2 },
  },
  {
    id: '3',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    hasIssues: false,
    completedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    vehicle: { plate: 'GHI-9012', brand: 'Scania' },
    driver: { name: 'Paulo Martins' },
    checklist: { name: 'Revisão Pós-Viagem', type: 'POST_TRIP' },
    _count: { issues: 0 },
  },
  {
    id: '4',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    hasIssues: true,
    completedAt: undefined,
    vehicle: { plate: 'JKL-3456', brand: 'Ford' },
    driver: { name: 'Maria Lima' },
    checklist: { name: 'Manutenção Preventiva', type: 'MAINTENANCE' },
    _count: { issues: 5 },
  },
];

const MOCK_TEMPLATES: ChecklistTemplate[] = [
  {
    id: '1', name: 'Inspeção Pré-Viagem', type: 'PRE_TRIP',
    description: 'Verificações obrigatórias antes de iniciar qualquer viagem',
    items: [
      { description: 'Verificar nível do óleo', required: true },
      { description: 'Verificar nível do combustível', required: true },
      { description: 'Verificar pneus (calibragem e estado)', required: true },
      { description: 'Testar luzes e faróis', required: true },
      { description: 'Verificar freios', required: true },
    ],
    _count: { executions: 142 },
    isActive: true,
  },
  {
    id: '2', name: 'Revisão Pós-Viagem', type: 'POST_TRIP',
    description: 'Inspeção ao finalizar a rota',
    items: [
      { description: 'Verificar estado geral do veículo', required: true },
      { description: 'Registrar km percorrido', required: true },
      { description: 'Relatar eventuais danos', required: false },
    ],
    _count: { executions: 98 },
    isActive: true,
  },
  {
    id: '3', name: 'Manutenção Preventiva', type: 'MAINTENANCE',
    description: 'Checklist para manutenção periódica',
    items: [
      { description: 'Troca de óleo e filtro', required: true },
      { description: 'Verificar correia dentada', required: true },
      { description: 'Checar sistema de arrefecimento', required: true },
      { description: 'Inspecionar embreagem', required: true },
      { description: 'Verificar bateria', required: false },
      { description: 'Checar filtro de ar', required: true },
    ],
    _count: { executions: 34 },
    isActive: true,
  },
];

export default function ChecklistsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<ChecklistType | ''>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ChecklistTemplate | null>(null);

  const { data: templates = MOCK_TEMPLATES, isLoading: loadingTemplates } = useQuery<ChecklistTemplate[]>({
    queryKey: ['checklists', typeFilter],
    queryFn: () =>
      api.get('/checklists', { params: { type: typeFilter || undefined } })
        .then((r) => r.data)
        .catch(() => MOCK_TEMPLATES),
  });

  const { data: executions = MOCK_EXECUTIONS, isLoading: loadingExecutions } = useQuery<ChecklistExecution[]>({
    queryKey: ['checklist-executions'],
    queryFn: () =>
      api.get('/checklists/executions', { params: { limit: 20 } })
        .then((r) => r.data)
        .catch(() => MOCK_EXECUTIONS),
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

  const { register, handleSubmit, reset, control, watch, formState: { errors } } = useForm<ChecklistFormData>({
    resolver: zodResolver(checklistSchema),
    defaultValues: {
      type: 'PRE_TRIP',
      items: [{ description: '', required: true }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  const filtered = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) &&
      (typeFilter === '' || t.type === typeFilter),
  );

  const executionColumns: Column<ChecklistExecution>[] = [
    {
      key: 'createdAt',
      header: 'Data/Hora',
      cell: (row) => (
        <span className="text-xs text-brand-text-secondary">
          {format(parseISO(row.createdAt), "dd/MM 'às' HH:mm", { locale: ptBR })}
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
      key: 'hasIssues',
      header: 'Status',
      cell: (row) => {
        if (!row.completedAt) {
          return (
            <Badge variant="warning" dot>Em Andamento</Badge>
          );
        }
        if (row.hasIssues) {
          return (
            <div className="flex items-center gap-2">
              <Badge variant="danger" dot>Com Problemas</Badge>
              {(row._count?.issues ?? 0) > 0 && (
                <span className="text-xs text-danger-600 font-semibold">{row._count?.issues} ocorrências</span>
              )}
            </div>
          );
        }
        return <Badge variant="success" dot>Aprovado</Badge>;
      },
    },
  ];

  return (
    <div className="min-h-screen">
      <Header
        title="Checklists"
        breadcrumbs={[{ label: 'Checklists' }]}
        actions={
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
            Novo Checklist
          </Button>
        }
      />

      <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
        {/* Templates section */}
        <div>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="text-lg font-bold text-brand-text-primary">Templates de Checklist</h2>
            <div className="flex items-center gap-3">
              {/* Type filter */}
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

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary pointer-events-none" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar checklist..."
                  className="input-base pl-9 w-48"
                />
              </div>
            </div>
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
            <div className="flex flex-col items-center justify-center py-16 text-brand-text-secondary">
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
                          <span><span className="font-semibold text-brand-text-primary">{template._count.executions}</span> execuções</span>
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
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-brand-text-primary">Execuções Recentes</h2>
            <Badge variant="gray">{executions.length} registros</Badge>
          </div>
          <DataTable
            columns={executionColumns}
            data={executions}
            loading={loadingExecutions}
            rowKey={(r) => r.id}
            emptyIcon={ClipboardX}
            emptyTitle="Nenhuma execução registrada"
            emptyDescription="As execuções de checklist aparecerão aqui."
            skeletonRows={5}
          />
        </div>
      </div>

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
              <Button leftIcon={<ClipboardCheck className="w-4 h-4" />}>
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
    </div>
  );
}
