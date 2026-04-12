'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Cpu,
  ChevronRight,
  Calendar,
  DollarSign,
  Route,
  FileText,
  Tag,
  Activity,
  PowerOff,
} from 'lucide-react';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import api from '@/lib/api';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/cn';

type EquipmentType = 'DRONE' | 'GERADOR' | 'OUTRO' | 'EMPILHADEIRA' | string;

interface Equipment {
  id: string;
  tagNumber?: number;
  name: string;
  type: EquipmentType;
  identifier?: string;
  isActive: boolean;
  _count?: { logs: number };
}

interface EquipmentLog {
  id: string;
  date: string;
  kmOut?: number;
  kmReturn?: number;
  kmTotal?: number;
  cost?: number;
  notes?: string;
}

interface ApiEquipment {
  id: string;
  tag?: number;
  name: string;
  type: EquipmentType;
  identifier?: string;
  isActive: boolean;
  _count?: { usageLogs: number };
}

interface ApiEquipmentLog {
  id: string;
  date: string;
  initialKm?: number | string;
  finalKm?: number | string;
  totalKm?: number | string;
  totalCost?: number | string;
  notes?: string;
}

const equipmentSchema = z.object({
  tagNumber: z.coerce.number().min(0, 'Tag obrigatória'),
  name: z.string().min(2, 'Nome obrigatório'),
  type: z.enum(['DRONE', 'GERADOR', 'EMPILHADEIRA', 'OUTRO']),
  identifier: z.string().optional(),
  isActive: z.boolean(),
});

const logSchema = z.object({
  date: z.string().min(1, 'Data obrigatória'),
  kmOut: z.coerce.number().optional(),
  kmReturn: z.coerce.number().optional(),
  cost: z.coerce.number().optional(),
  notes: z.string().optional(),
});

type EquipmentFormData = z.infer<typeof equipmentSchema>;
type LogFormData = z.infer<typeof logSchema>;

const TYPE_CONFIG_MAP: Record<string, { label: string; variant: 'purple' | 'orange' | 'gray' | 'info' | 'success'; bg: string; text: string; icon: string }> = {
  DRONE:        { label: 'Drone',        variant: 'purple',  bg: 'bg-purple-50',  text: 'text-purple-700',  icon: '🚁' },
  GERADOR:      { label: 'Gerador',      variant: 'orange',  bg: 'bg-orange-50',  text: 'text-orange-700',  icon: '⚡' },
  EMPILHADEIRA: { label: 'Empilhadeira', variant: 'info',    bg: 'bg-blue-50',    text: 'text-blue-700',    icon: '🏗️' },
  OUTRO:        { label: 'Outro',        variant: 'gray',    bg: 'bg-slate-100',  text: 'text-slate-600',   icon: '📦' },
};

const FALLBACK_CONFIG = { label: 'Outro', variant: 'gray' as const, bg: 'bg-slate-100', text: 'text-slate-600', icon: '📦' };

function getTypeConfig(type: string) {
  return TYPE_CONFIG_MAP[type] ?? { ...FALLBACK_CONFIG, label: type };
}

const TYPE_CONFIG = TYPE_CONFIG_MAP;

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function toNumber(value: number | string | null | undefined): number | undefined {
  if (value === null || value === undefined || value === '') return undefined;
  const parsed = typeof value === 'number' ? value : Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export default function EquipmentPage() {
  const qc = useQueryClient();
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [selectedLog, setSelectedLog] = useState<EquipmentLog | null>(null);
  const [equipmentModalOpen, setEquipmentModalOpen] = useState(false);
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [logDetailOpen, setLogDetailOpen] = useState(false);

  const { data: equipmentList = [], isLoading } = useQuery<Equipment[]>({
    queryKey: ['equipment'],
    queryFn: () =>
      api.get('/equipment').then((r) =>
        (r.data as ApiEquipment[]).map((equipment) => ({
          id: equipment.id,
          tagNumber: equipment.tag,
          name: equipment.name,
          type: equipment.type,
          identifier: equipment.identifier,
          isActive: equipment.isActive,
          _count: equipment._count ? { logs: equipment._count.usageLogs } : undefined,
        })),
      ),
  });

  const { data: logs = [], isLoading: loadingLogs } = useQuery<EquipmentLog[]>({
    queryKey: ['equipment-logs', selectedEquipment?.id],
    queryFn: () =>
      api.get(`/equipment/${selectedEquipment!.id}/logs`).then((r) =>
        (r.data as ApiEquipmentLog[]).map((log) => ({
          id: log.id,
          date: log.date,
          kmOut: toNumber(log.initialKm),
          kmReturn: toNumber(log.finalKm),
          kmTotal: toNumber(log.totalKm),
          cost: toNumber(log.totalCost),
          notes: log.notes,
        })),
      ),
    enabled: !!selectedEquipment,
  });

  const createEquipmentMutation = useMutation({
    mutationFn: (data: EquipmentFormData) =>
      api.post('/equipment', {
        tag: data.tagNumber,
        name: data.name,
        type: data.type,
        identifier: data.identifier,
        isActive: data.isActive,
      }),
    onSuccess: () => {
      toast.success('Equipamento criado com sucesso!');
      qc.invalidateQueries({ queryKey: ['equipment'] });
      setEquipmentModalOpen(false);
      resetEquipment();
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Erro ao criar equipamento.'),
  });

  const createLogMutation = useMutation({
    mutationFn: (data: LogFormData) =>
      api.post(`/equipment/${selectedEquipment!.id}/logs`, {
        date: data.date,
        initialKm: data.kmOut,
        finalKm: data.kmReturn,
        totalKm: data.kmOut !== undefined && data.kmReturn !== undefined ? Math.max(0, data.kmReturn - data.kmOut) : undefined,
        totalCost: data.cost,
        notes: data.notes,
      }),
    onSuccess: () => {
      toast.success('Uso registrado com sucesso!');
      qc.invalidateQueries({ queryKey: ['equipment'] });
      qc.invalidateQueries({ queryKey: ['equipment-logs', selectedEquipment?.id] });
      setLogModalOpen(false);
      resetLog();
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Erro ao registrar uso.'),
  });

  const {
    register: registerEquipment,
    handleSubmit: handleSubmitEquipment,
    reset: resetEquipment,
    formState: { errors: equipmentErrors },
  } = useForm<EquipmentFormData>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: { type: 'DRONE', isActive: true },
  });

  const {
    register: registerLog,
    handleSubmit: handleSubmitLog,
    reset: resetLog,
    watch: watchLog,
    formState: { errors: logErrors },
  } = useForm<LogFormData>({
    resolver: zodResolver(logSchema),
    defaultValues: { date: format(new Date(), 'yyyy-MM-dd') },
  });

  const kmOut = watchLog('kmOut') ?? 0;
  const kmReturn = watchLog('kmReturn') ?? 0;
  const calculatedKmTotal = Math.max(0, (kmReturn ?? 0) - (kmOut ?? 0));
  const meterLabel = selectedEquipment?.type === 'GERADOR' ? 'Horímetro' : 'KM';
  const meterOutLabel = selectedEquipment?.type === 'GERADOR' ? 'Horímetro Saída' : 'KM Saída';
  const meterReturnLabel = selectedEquipment?.type === 'GERADOR' ? 'Horímetro Chegada' : 'KM Chegada';
  const meterTotalLabel = selectedEquipment?.type === 'GERADOR' ? 'Horas Utilizadas' : 'KM Total';

  return (
    <div className="min-h-screen">
      <Header
        title={selectedEquipment ? selectedEquipment.name : 'Equipamentos'}
        breadcrumbs={
          selectedEquipment
            ? [
                { label: 'Equipamentos', href: '/equipment' },
                { label: selectedEquipment.name },
              ]
            : [{ label: 'Equipamentos' }]
        }
      />

      <div className="p-6 space-y-5 max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="text-sm text-brand-text-secondary">
            {selectedEquipment ? 'Gerencie o histórico e os dados do equipamento selecionado.' : `${equipmentList.length} equipamento(s) cadastrado(s)`}
          </div>

          <div className="flex items-center gap-2">
            {selectedEquipment ? (
              <>
                <Button size="sm" variant="secondary" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setLogModalOpen(true)}>
                  Registrar Uso
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setSelectedEquipment(null)}>
                  Voltar para lista
                </Button>
              </>
            ) : (
              <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setEquipmentModalOpen(true)}>
                Novo Equipamento
              </Button>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!selectedEquipment ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-brand-border shadow-card p-5">
                      <Skeleton className="h-10 w-10 rounded-xl mb-3" />
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                </div>
              ) : equipmentList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-brand-border shadow-card">
                  <Cpu className="w-12 h-12 text-slate-300 mb-3" />
                  <p className="font-semibold text-brand-text-primary">Nenhum equipamento cadastrado</p>
                  <p className="text-sm text-brand-text-secondary mt-1 mb-4">Cadastre drones, geradores e outros equipamentos.</p>
                  <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setEquipmentModalOpen(true)}>
                    Novo Equipamento
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {equipmentList.map((equip, i) => {
                    const config = getTypeConfig(equip.type);
                    return (
                      <motion.div
                        key={equip.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: i * 0.03 }}
                        whileHover={{ y: -2 }}
                        onClick={() => setSelectedEquipment(equip)}
                        className="bg-white rounded-2xl border border-brand-border shadow-card hover:shadow-card-hover cursor-pointer group transition-shadow"
                      >
                        <div className="p-5">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center text-2xl', config.bg)}>
                                {config.icon}
                              </div>
                              <div>
                                <h3 className="font-semibold text-brand-text-primary leading-tight">{equip.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant={config.variant}>{config.label}</Badge>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {equip.isActive ? (
                                <div className="flex items-center gap-1 text-xs text-success-600">
                                  <Activity className="w-3.5 h-3.5" />
                                  <span>Ativo</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-xs text-slate-400">
                                  <PowerOff className="w-3.5 h-3.5" />
                                  <span>Inativo</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="space-y-1.5 text-xs text-brand-text-secondary">
                            <div className="flex items-center gap-2">
                              <Tag className="w-3.5 h-3.5 flex-shrink-0" />
                              <span>Tag: <span className="font-mono font-semibold text-brand-text-primary">{equip.tagNumber ?? '—'}</span></span>
                            </div>
                            {equip.identifier && (
                              <div className="flex items-center gap-2">
                                <FileText className="w-3.5 h-3.5 flex-shrink-0" />
                                <span className="truncate">{equip.identifier}</span>
                              </div>
                            )}
                            {equip._count?.logs !== undefined && (
                              <div className="flex items-center gap-2">
                                <Route className="w-3.5 h-3.5 flex-shrink-0" />
                                <span>{equip._count.logs} uso{equip._count.logs !== 1 ? 's' : ''} registrado{equip._count.logs !== 1 ? 's' : ''}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="px-5 py-3 bg-slate-50/80 rounded-b-2xl border-t border-brand-border/50 flex items-center justify-between">
                          <span className="text-xs text-brand-text-secondary">Ver histórico de uso</span>
                          <ChevronRight className="w-4 h-4 text-brand-text-secondary group-hover:text-primary-600 transition-colors" />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="detail"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Equipment info card */}
              <div className="bg-white rounded-2xl border border-brand-border shadow-card p-5">
                <div className="flex items-center gap-4">
                  <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center text-3xl', getTypeConfig(selectedEquipment.type).bg)}>
                    {getTypeConfig(selectedEquipment.type).icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-lg font-bold text-brand-text-primary">{selectedEquipment.name}</h2>
                      <Badge variant={getTypeConfig(selectedEquipment.type).variant}>
                        {getTypeConfig(selectedEquipment.type).label}
                      </Badge>
                      {selectedEquipment.isActive
                        ? <Badge variant="success" dot>Ativo</Badge>
                        : <Badge variant="gray" dot>Inativo</Badge>}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-brand-text-secondary">
                      <span>Tag: <span className="font-mono font-semibold">{selectedEquipment.tagNumber ?? '—'}</span></span>
                      {selectedEquipment.identifier && <span>{selectedEquipment.identifier}</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Logs */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-brand-text-primary">Histórico de Uso</h3>
                  <Badge variant="gray">{logs.length} registros</Badge>
                </div>

                {loadingLogs ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="bg-white rounded-2xl border border-brand-border shadow-card p-4">
                        <Skeleton className="h-5 w-32 mb-2" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ))}
                  </div>
                ) : logs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-brand-border shadow-card">
                    <Route className="w-10 h-10 text-slate-300 mb-3" />
                    <p className="font-semibold text-brand-text-primary">Nenhum uso registrado</p>
                    <p className="text-sm text-brand-text-secondary mt-1 mb-4">Registre o primeiro uso deste equipamento.</p>
                    <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setLogModalOpen(true)}>
                      Registrar Uso
                    </Button>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-brand-border shadow-card overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-brand-border bg-slate-50/80">
                            <th className="text-left px-4 py-3 text-xs font-semibold text-brand-text-secondary uppercase tracking-wide">Data</th>
                            <th className="text-right px-4 py-3 text-xs font-semibold text-brand-text-secondary uppercase tracking-wide">KM Saída</th>
                            <th className="text-right px-4 py-3 text-xs font-semibold text-brand-text-secondary uppercase tracking-wide">KM Chegada</th>
                            <th className="text-right px-4 py-3 text-xs font-semibold text-brand-text-secondary uppercase tracking-wide">KM Total</th>
                            <th className="text-right px-4 py-3 text-xs font-semibold text-brand-text-secondary uppercase tracking-wide">Custo</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-brand-text-secondary uppercase tracking-wide">Observações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border/50">
                          {logs.map((log, i) => (
                            <motion.tr
                              key={log.id}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.2, delay: i * 0.03 }}
                              className={cn(
                                'hover:bg-slate-50/60 transition-colors cursor-pointer',
                                selectedLog?.id === log.id && 'bg-primary-50/40',
                              )}
                              onClick={() => {
                                setSelectedLog(log);
                                setLogDetailOpen(true);
                              }}
                            >
                              <td className="px-4 py-3 text-brand-text-secondary text-xs whitespace-nowrap">
                                {format(parseISO(log.date), 'dd/MM/yyyy', { locale: ptBR })}
                              </td>
                              <td className="px-4 py-3 text-right font-mono text-brand-text-secondary">
                                {log.kmOut != null ? log.kmOut.toLocaleString('pt-BR') : '—'}
                              </td>
                              <td className="px-4 py-3 text-right font-mono text-brand-text-secondary">
                                {log.kmReturn != null ? log.kmReturn.toLocaleString('pt-BR') : '—'}
                              </td>
                              <td className="px-4 py-3 text-right font-mono font-semibold text-brand-text-primary">
                                {log.kmTotal != null ? log.kmTotal.toLocaleString('pt-BR') : '—'}
                              </td>
                              <td className="px-4 py-3 text-right font-semibold text-primary-600">
                                {log.cost != null ? formatCurrency(log.cost) : '—'}
                              </td>
                              <td className="px-4 py-3 text-brand-text-secondary text-xs max-w-xs truncate">
                                {log.notes || '—'}
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Log Detail Modal */}
      {selectedLog && (
        <Modal
          open={logDetailOpen}
          onClose={() => setLogDetailOpen(false)}
          title={selectedEquipment ? `Uso - ${selectedEquipment.name}` : 'Detalhe do Uso'}
          description={format(parseISO(selectedLog.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          size="md"
          footer={<Button variant="secondary" onClick={() => setLogDetailOpen(false)}>Fechar</Button>}
        >
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-xs text-brand-text-secondary mb-1">Data</div>
                <div className="text-sm font-semibold text-brand-text-primary">
                  {format(parseISO(selectedLog.date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-xs text-brand-text-secondary mb-1">KM Total</div>
                <div className="text-sm font-semibold text-brand-text-primary font-mono">
                  {selectedLog.kmTotal != null ? selectedLog.kmTotal.toLocaleString('pt-BR') : '—'}
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-xs text-brand-text-secondary mb-1">KM Saída</div>
                <div className="text-sm font-semibold text-brand-text-primary font-mono">
                  {selectedLog.kmOut != null ? selectedLog.kmOut.toLocaleString('pt-BR') : '—'}
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-xs text-brand-text-secondary mb-1">KM Chegada</div>
                <div className="text-sm font-semibold text-brand-text-primary font-mono">
                  {selectedLog.kmReturn != null ? selectedLog.kmReturn.toLocaleString('pt-BR') : '—'}
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 col-span-2">
                <div className="text-xs text-brand-text-secondary mb-1">Custo</div>
                <div className="text-sm font-semibold text-primary-600">
                  {selectedLog.cost != null ? formatCurrency(selectedLog.cost) : '—'}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-brand-border">
              <div className="text-xs text-brand-text-secondary mb-1">Observações</div>
              <div className="text-sm text-brand-text-primary whitespace-pre-wrap">
                {selectedLog.notes || 'Sem observações.'}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* New Equipment Modal */}
      <Modal
        open={equipmentModalOpen}
        onClose={() => { setEquipmentModalOpen(false); resetEquipment(); }}
        title="Novo Equipamento"
        description="Cadastre um novo equipamento na frota."
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setEquipmentModalOpen(false); resetEquipment(); }}>Cancelar</Button>
            <Button
              loading={createEquipmentMutation.isPending}
              onClick={handleSubmitEquipment(
                (d) => createEquipmentMutation.mutate(d),
                () => toast.error('Preencha todos os campos obrigatórios'),
              )}
            >
              Cadastrar
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">Tag *</label>
              <input
                {...registerEquipment('tagNumber')}
                placeholder="Ex: 101"
                className={cn('input-base', equipmentErrors.tagNumber && 'border-danger-400')}
              />
              {equipmentErrors.tagNumber && <p className="text-danger-500 text-xs mt-1">{equipmentErrors.tagNumber.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">Tipo *</label>
              <select {...registerEquipment('type')} className="input-base">
                {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
                  <option key={key} value={key}>{cfg.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">Nome *</label>
            <input
              {...registerEquipment('name')}
              placeholder="Ex: Drone DJI Phantom 4"
              className={cn('input-base', equipmentErrors.name && 'border-danger-400')}
            />
            {equipmentErrors.name && <p className="text-danger-500 text-xs mt-1">{equipmentErrors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">Identificador / Série</label>
            <input
              {...registerEquipment('identifier')}
              placeholder="Número de série, chassi, etc."
              className="input-base"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              {...registerEquipment('isActive')}
              className="w-4 h-4 rounded accent-primary-600"
            />
            <span className="text-sm text-brand-text-primary font-medium">Equipamento ativo</span>
          </label>
        </form>
      </Modal>

      {/* New Log Modal */}
      <Modal
        open={logModalOpen}
        onClose={() => { setLogModalOpen(false); resetLog(); }}
        title="Registrar Uso"
        description={`Registre o uso de ${selectedEquipment?.name ?? 'equipamento'}.`}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setLogModalOpen(false); resetLog(); }}>Cancelar</Button>
            <Button
              loading={createLogMutation.isPending}
              onClick={handleSubmitLog(
                (d) => createLogMutation.mutate(d),
                () => toast.error('Preencha todos os campos obrigatórios'),
              )}
            >
              Salvar Uso
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">Data *</label>
            <input
              type="date"
              {...registerLog('date')}
              className={cn('input-base', logErrors.date && 'border-danger-400')}
            />
            {logErrors.date && <p className="text-danger-500 text-xs mt-1">{logErrors.date.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">KM Saída</label>
              <input type="number" {...registerLog('kmOut')} placeholder="0" className="input-base" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">KM Chegada</label>
              <input type="number" {...registerLog('kmReturn')} placeholder="0" className="input-base" />
            </div>
          </div>

          {/* Auto-calculated KM */}
          {(kmOut > 0 || kmReturn > 0) && (
            <div className="bg-primary-50 border border-primary-100 rounded-xl p-3 flex items-center justify-between">
              <span className="text-sm text-primary-700 font-medium">KM Total calculado:</span>
              <span className="text-lg font-bold text-primary-600">{calculatedKmTotal.toLocaleString('pt-BR')}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">Custo (R$)</label>
            <input type="number" step="0.01" {...registerLog('cost')} placeholder="0,00" className="input-base" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">Observações</label>
            <textarea
              {...registerLog('notes')}
              placeholder="Detalhes do uso..."
              rows={2}
              className="input-base resize-none"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
