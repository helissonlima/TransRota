'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  ArrowLeft, Truck, Users, MapPin, ClipboardList, BarChart2,
  Route, CalendarDays, Receipt, Cpu, Wallet, Package,
  Save, AlertCircle, CheckCircle2,
} from 'lucide-react';
import adminApi from '@/lib/admin-api';
import { cn } from '@/lib/cn';

interface FeatureDef {
  key: string; label: string; description: string;
  icon: React.ElementType; iconColor: string; category: string;
}

const ALL_FEATURES: FeatureDef[] = [
  { key: 'fleet',      label: 'Frota',                    description: 'Gerenciamento de veículos, manutenções e controle de combustível',         icon: Truck,        iconColor: 'text-blue-400',   category: 'Operacional' },
  { key: 'drivers',    label: 'Motoristas',               description: 'Cadastro de motoristas, habilitações e documentos',                       icon: Users,        iconColor: 'text-violet-400', category: 'Operacional' },
  { key: 'routes',     label: 'Rotas e Entregas',         description: 'Planejamento de rotas, rastreamento de paradas e comprovantes',           icon: MapPin,       iconColor: 'text-emerald-400',category: 'Operacional' },
  { key: 'checklists', label: 'Checklists / Inspeções',   description: 'Inspeções pré e pós viagem, controle de não conformidades',               icon: ClipboardList,iconColor: 'text-amber-400',  category: 'Operacional' },
  { key: 'daily_km',   label: 'KM Diário',                description: 'Registro diário de quilometragem por motorista',                          icon: Route,        iconColor: 'text-cyan-400',   category: 'Operacional' },
  { key: 'bookings',   label: 'Agendamentos',             description: 'Reserva e agendamento de veículos por período',                           icon: CalendarDays, iconColor: 'text-indigo-400', category: 'Operacional' },
  { key: 'equipment',  label: 'Equipamentos',             description: 'Controle de equipamentos auxiliares (drones, geradores, etc.)',           icon: Cpu,          iconColor: 'text-orange-400', category: 'Operacional' },
  { key: 'financial',  label: 'Financeiro Completo',      description: 'Contas a pagar/receber, comissões de motoristas e fluxo de caixa',        icon: Wallet,       iconColor: 'text-emerald-400',category: 'Financeiro'  },
  { key: 'fiscal',     label: 'Fiscal / Taxas Veiculares',description: 'IPVA, licenciamento, seguros obrigatórios e multas dos veículos',         icon: Receipt,      iconColor: 'text-rose-400',   category: 'Financeiro'  },
  { key: 'products',   label: 'Produtos e Estoque',       description: 'Catálogo, controle de estoque, BOM (ficha técnica) e ordens de produção', icon: Package,      iconColor: 'text-teal-400',   category: 'Estoque'     },
  { key: 'reports',    label: 'Relatórios',               description: 'Relatórios operacionais, financeiros e de desempenho da frota',           icon: BarChart2,    iconColor: 'text-purple-400', category: 'Gestão'      },
];

const CATEGORIES = [...new Set(ALL_FEATURES.map(f => f.category))];

interface CompanyFeatures { id: string; name: string; features: string[] }

export default function CompanyFeaturesPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const qc = useQueryClient();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [dirty, setDirty] = useState(false);

  const { data: company, isLoading } = useQuery<CompanyFeatures>({
    queryKey: ['admin', 'company-features', id],
    queryFn: () => adminApi.get(`/admin/companies/${id}/features`).then(r => r.data),
  });

  useEffect(() => { if (company) setSelected(new Set(company.features)); }, [company]);

  const saveMutation = useMutation({
    mutationFn: () => adminApi.put(`/admin/companies/${id}/features`, { features: Array.from(selected) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'company-features', id] });
      setDirty(false);
      toast.success('Módulos atualizados com sucesso!');
    },
    onError: (e: any) => toast.error(e.response?.data?.message ?? 'Erro ao salvar'),
  });

  const toggle = (key: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
    setDirty(true);
  };

  const toggleAll = (enable: boolean) => {
    setSelected(enable ? new Set(ALL_FEATURES.map(f => f.key)) : new Set());
    setDirty(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b1120] flex items-center justify-center">
        <p className="text-[#94a3b8] text-sm">Carregando módulos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1120] text-white flex flex-col">
      <header className="border-b border-[#1e2d4a] px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-[#64748b] hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
          <div className="w-px h-5 bg-[#1e2d4a]" />
          <div>
            <h1 className="text-base font-bold">Módulos — {company?.name ?? '...'}</h1>
            <p className="text-xs text-[#64748b] mt-0.5">{selected.size} de {ALL_FEATURES.length} módulos habilitados</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => toggleAll(true)} className="text-xs px-3 py-1.5 rounded-lg border border-[#1e2d4a] text-[#94a3b8] hover:text-white hover:border-[#2e4a7a] transition-colors">Habilitar todos</button>
          <button onClick={() => toggleAll(false)} className="text-xs px-3 py-1.5 rounded-lg border border-[#1e2d4a] text-[#94a3b8] hover:text-white hover:border-[#2e4a7a] transition-colors">Desabilitar todos</button>
          <button
            onClick={() => saveMutation.mutate()}
            disabled={!dirty || saveMutation.isPending}
            className={cn('flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all', dirty ? 'bg-primary-600 hover:bg-primary-700 text-white' : 'bg-[#1a2744] text-[#64748b] cursor-not-allowed')}
          >
            <Save className="w-4 h-4" />{saveMutation.isPending ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </div>
      </header>

      {dirty && (
        <div className="bg-amber-900/30 border-b border-amber-500/30 px-6 py-2 flex items-center gap-2 text-amber-300 text-xs">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          Alterações pendentes — clique em &quot;Salvar alterações&quot; para aplicar ao sistema do cliente.
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="rounded-2xl bg-[#0f1c36] border border-[#1e2d4a] p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold">{company?.name}</span>
              <span className="text-xs text-[#64748b]">{selected.size}/{ALL_FEATURES.length} ativos</span>
            </div>
            <div className="w-full h-2 bg-[#1e2d4a] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary-600 to-emerald-500 rounded-full transition-all duration-500" style={{ width: `${(selected.size / ALL_FEATURES.length) * 100}%` }} />
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {ALL_FEATURES.filter(f => selected.has(f.key)).map(f => {
                const Icon = f.icon;
                return (
                  <span key={f.key} className={cn('inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-[#1a2744] border border-[#2e4a7a]', f.iconColor)}>
                    <Icon className="w-3 h-3" />{f.label}
                  </span>
                );
              })}
              {selected.size === 0 && <span className="text-xs text-[#64748b]">Nenhum módulo habilitado</span>}
            </div>
          </div>

          {CATEGORIES.map(category => (
            <section key={category}>
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#64748b] mb-3">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ALL_FEATURES.filter(f => f.category === category).map(feat => {
                  const Icon = feat.icon;
                  const enabled = selected.has(feat.key);
                  return (
                    <button
                      key={feat.key}
                      onClick={() => toggle(feat.key)}
                      className={cn('relative flex items-start gap-4 p-4 rounded-2xl border text-left transition-all w-full', enabled ? 'bg-[#0f2a4a] border-primary-500/50 ring-1 ring-primary-500/20' : 'bg-[#0f1c36] border-[#1e2d4a] hover:border-[#2e4a7a] hover:bg-[#132040]')}
                    >
                      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', enabled ? 'bg-primary-500/15' : 'bg-[#1a2744]')}>
                        <Icon className={cn('w-5 h-5', enabled ? feat.iconColor : 'text-[#4a5568]')} />
                      </div>
                      <div className="flex-1 min-w-0 pr-12">
                        <p className={cn('text-sm font-semibold', enabled ? 'text-white' : 'text-[#94a3b8]')}>{feat.label}</p>
                        <p className="text-xs text-[#64748b] mt-0.5 leading-relaxed">{feat.description}</p>
                      </div>
                      <div className={cn('absolute right-4 top-1/2 -translate-y-1/2 w-9 h-5 rounded-full transition-all', enabled ? 'bg-primary-600' : 'bg-[#1e2d4a]')}>
                        <div className={cn('absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200', enabled ? 'translate-x-[18px]' : 'translate-x-0.5')} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
