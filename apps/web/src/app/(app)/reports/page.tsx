'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
} from 'recharts';
import {
  DollarSign,
  Package2,
  Gauge,
  TrendingUp,
  Calendar,
  BarChart2,
  Truck,
  Users,
} from 'lucide-react';
import api from '@/lib/api';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/ui/stat-card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/cn';

type TabKey = 'deliveries' | 'fleet' | 'drivers';

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: 'deliveries', label: 'Entregas', icon: Package2 },
  { key: 'fleet', label: 'Frota', icon: Truck },
  { key: 'drivers', label: 'Motoristas', icon: Users },
];

type DeliveriesResponse = {
  summary: Record<string, number>;
  total: number;
  stops: Array<{
    id: string;
    status: string;
    route: {
      id: string;
      scheduledDate: string;
    };
  }>;
};

type FleetResponse = {
  costs: {
    maintenance: number;
    fuel: number;
    total: number;
  };
  fuel: {
    totalLiters: number;
    records: number;
    averagePricePerLiter: number;
    entries?: Array<{
      performedAt: string;
      totalCost: number | string;
    }>;
  };
  maintenance: {
    total: number;
    records: Array<{
      performedAt: string;
      cost: number | string;
    }>;
  };
};

type DriverStatsResponse = Array<{
  driverId: string;
  name: string;
  routes: number;
  delivered: number;
  notDelivered: number;
  partial: number;
}>;

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ color: string; name: string; value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-brand-border rounded-xl shadow-card-hover p-3 text-xs">
      <p className="font-semibold text-brand-text-secondary mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 py-0.5">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
          <span className="text-brand-text-secondary">{p.name}:</span>
          <span className="font-bold text-brand-text-primary ml-auto pl-2">{p.value.toLocaleString('pt-BR')}</span>
        </div>
      ))}
    </div>
  );
}

export default function ReportsPage() {
  const today = new Date();
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [from, setFrom] = useState(firstOfMonth.toISOString().slice(0, 10));
  const [to, setTo] = useState(today.toISOString().slice(0, 10));
  const [activeTab, setActiveTab] = useState<TabKey>('deliveries');

  const { data: deliveries, isLoading: loadingDeliveries } = useQuery<DeliveriesResponse>({
    queryKey: ['report-deliveries', from, to],
    queryFn: () => api.get(`/reports/deliveries?from=${from}&to=${to}`).then((r) => r.data),
  });

  const { data: fleet, isLoading: loadingFleet } = useQuery<FleetResponse>({
    queryKey: ['report-fleet', from, to],
    queryFn: () => api.get(`/reports/fleet?from=${from}&to=${to}`).then((r) => r.data),
  });

  const { data: driverStats = [], isLoading: loadingDrivers } = useQuery<DriverStatsResponse>({
    queryKey: ['report-drivers', from, to],
    queryFn: () => api.get(`/reports/drivers?from=${from}&to=${to}`).then((r) => r.data),
  });

  const deliveryPieData = useMemo(() => {
    const summary = deliveries?.summary ?? {};
    return [
      { name: 'Entregue', value: summary.DELIVERED ?? 0, color: '#10b981' },
      { name: 'Parcial', value: summary.PARTIAL_DELIVERY ?? 0, color: '#f59e0b' },
      { name: 'Não Entregue', value: summary.NOT_DELIVERED ?? 0, color: '#ef4444' },
    ];
  }, [deliveries]);

  const deliveryByDay = useMemo(() => {
    const grouped = new Map<string, { day: string; entregas: number; devolucoes: number }>();
    for (const stop of deliveries?.stops ?? []) {
      const date = new Date(stop.route.scheduledDate);
      const key = date.toISOString().slice(0, 10);
      if (!grouped.has(key)) {
        grouped.set(key, {
          day: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
          entregas: 0,
          devolucoes: 0,
        });
      }
      const bucket = grouped.get(key)!;
      if (stop.status === 'DELIVERED' || stop.status === 'PARTIAL_DELIVERY') bucket.entregas += 1;
      if (stop.status === 'NOT_DELIVERED') bucket.devolucoes += 1;
    }

    return Array.from(grouped.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-7)
      .map(([, value]) => value);
  }, [deliveries]);

  const fleetCostsSeries = useMemo(() => {
    const grouped = new Map<string, { month: string; combustivel: number; manutencao: number }>();

    for (const fuel of fleet?.fuel.entries ?? []) {
      const date = new Date(fuel.performedAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!grouped.has(key)) {
        grouped.set(key, {
          month: date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''),
          combustivel: 0,
          manutencao: 0,
        });
      }
      grouped.get(key)!.combustivel += Number(fuel.totalCost);
    }

    for (const maintenance of fleet?.maintenance.records ?? []) {
      const date = new Date(maintenance.performedAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!grouped.has(key)) {
        grouped.set(key, {
          month: date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''),
          combustivel: 0,
          manutencao: 0,
        });
      }
      grouped.get(key)!.manutencao += Number(maintenance.cost);
    }

    return Array.from(grouped.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-6)
      .map(([, value]) => value);
  }, [fleet]);

  const normalizedDrivers = useMemo(
    () =>
      driverStats.slice(0, 5).map((driver) => ({
        name: driver.name,
        entregues: driver.delivered,
        parcial: driver.partial,
        naoEntregue: driver.notDelivered,
      })),
    [driverStats],
  );

  const totalDeliveries = deliveries?.total ?? 0;
  const deliveredCount = deliveries?.summary?.DELIVERED ?? 0;
  const deliveryRate = totalDeliveries > 0 ? Math.round((deliveredCount / totalDeliveries) * 100) : 0;
  const totalFleetCost = fleet?.costs?.total ?? 0;

  return (
    <div className="min-h-screen">
      <Header
        title="Relatórios"
        breadcrumbs={[{ label: 'Relatórios' }]}
      />

      <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
        {/* Date range picker */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-brand-border rounded-2xl p-4 flex items-center gap-4 flex-wrap"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-brand-text-primary">
            <Calendar className="w-4 h-4 text-primary-600" />
            Período de análise
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="input-base w-auto"
            />
            <span className="text-brand-text-secondary text-sm">até</span>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="input-base w-auto"
            />
          </div>
          {/* Quick ranges */}
          <div className="flex items-center gap-2 ml-auto flex-wrap">
            {[
              { label: 'Esta semana', days: 7 },
              { label: 'Este mês', days: 30 },
              { label: 'Trimestre', days: 90 },
            ].map((range) => (
              <button
                key={range.label}
                onClick={() => {
                  const t = new Date();
                  const f = new Date(t.getTime() - range.days * 24 * 60 * 60 * 1000);
                  setFrom(f.toISOString().slice(0, 10));
                  setTo(t.toISOString().slice(0, 10));
                }}
                className="text-xs px-3 py-1.5 rounded-lg border border-brand-border bg-slate-50 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 transition-colors font-medium text-brand-text-secondary"
              >
                {range.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Summary KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Custo Total da Frota"
            value={totalFleetCost}
            icon={DollarSign}
            iconColor="orange"
            prefix="R$ "
            formatter={(v) => v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            subtitle="no período"
          />
          <StatCard
            title="Taxa de Entrega"
            value={deliveryRate}
            icon={TrendingUp}
            iconColor="emerald"
            suffix="%"
            subtitle="entregues com sucesso"
          />
          <StatCard
            title="Total de Entregas"
            value={totalDeliveries}
            icon={Package2}
            iconColor="blue"
            subtitle="no período"
          />
        </div>

        {/* Tab navigation */}
        <div className="flex items-center bg-white border border-brand-border rounded-xl p-1 gap-1 w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                activeTab === tab.key
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-brand-text-secondary hover:text-brand-text-primary hover:bg-slate-50',
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* ── Entregas tab ──────────────────────────────────────────────── */}
          {activeTab === 'deliveries' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
              {/* Bar chart — deliveries by day */}
              <div className="xl:col-span-2 card p-5">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-semibold text-brand-text-primary">Entregas por Dia</h3>
                    <p className="text-xs text-brand-text-secondary mt-0.5">Entregas realizadas e devoluções</p>
                  </div>
                  <Badge variant="info">Última semana</Badge>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={deliveryByDay} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} iconType="circle" iconSize={8} />
                    <Bar dataKey="entregas" name="Entregas" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="devolucoes" name="Devoluções" fill="#f97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                {!loadingDeliveries && deliveryByDay.length === 0 && (
                  <p className="text-sm text-brand-text-secondary mt-3">Sem dados de entregas no período selecionado.</p>
                )}
              </div>

              {/* Pie chart — delivery status */}
              <div className="card p-5">
                <div className="mb-5">
                  <h3 className="font-semibold text-brand-text-primary">Status das Entregas</h3>
                  <p className="text-xs text-brand-text-secondary mt-0.5">Distribuição no período</p>
                </div>
                <div className="flex justify-center">
                  <PieChart width={180} height={180}>
                    <Pie data={deliveryPieData} cx={90} cy={90} innerRadius={50} outerRadius={80} dataKey="value" strokeWidth={2} stroke="#fff">
                      {deliveryPieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [v, '']} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                  </PieChart>
                </div>
                <div className="mt-4 space-y-2">
                  {deliveryPieData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: item.color }} />
                        <span className="text-brand-text-secondary">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-brand-text-primary">{item.value}</span>
                        <span className="text-brand-text-secondary">
                          ({totalDeliveries > 0 ? Math.round((item.value / totalDeliveries) * 100) : 0}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Frota tab ──────────────────────────────────────────────────── */}
          {activeTab === 'fleet' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {/* Area chart — costs over time */}
              <div className="card p-5">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-semibold text-brand-text-primary">Custos da Frota</h3>
                    <p className="text-xs text-brand-text-secondary mt-0.5">Combustível vs Manutenção (R$)</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={fleetCostsSeries}>
                    <defs>
                      <linearGradient id="gradFuel" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563eb" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradMaint" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f97316" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip />} formatter={(v) => [`R$ ${Number(v).toLocaleString('pt-BR')}`, '']} />
                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} iconType="circle" iconSize={8} />
                    <Area type="monotone" dataKey="combustivel" name="Combustível" stroke="#2563eb" strokeWidth={2} fill="url(#gradFuel)" />
                    <Area type="monotone" dataKey="manutencao" name="Manutenção" stroke="#f97316" strokeWidth={2} fill="url(#gradMaint)" />
                  </AreaChart>
                </ResponsiveContainer>
                {!loadingFleet && fleetCostsSeries.length === 0 && (
                  <p className="text-sm text-brand-text-secondary mt-3">Sem registros de custos no período selecionado.</p>
                )}
              </div>

              {/* Cost breakdown */}
              <div className="card p-5">
                <h3 className="font-semibold text-brand-text-primary mb-5">Resumo de Custos</h3>
                {loadingFleet ? (
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Total', value: fleet?.costs?.total ?? 0, color: 'text-brand-text-primary', bg: 'bg-slate-50' },
                      { label: 'Combustível', value: fleet?.costs?.fuel ?? 0, color: 'text-primary-600', bg: 'bg-primary-50' },
                      { label: 'Manutenção', value: fleet?.costs?.maintenance ?? 0, color: 'text-accent-600', bg: 'bg-accent-50/50' },
                      { label: 'Custo/Entrega', value: totalDeliveries > 0 ? Math.round((totalFleetCost / totalDeliveries) * 100) / 100 : 0, color: 'text-success-600', bg: 'bg-success-50' },
                    ].map((item) => (
                      <div key={item.label} className={cn('rounded-xl p-4', item.bg)}>
                        <div className="text-xs text-brand-text-secondary mb-1">{item.label}</div>
                        <div className={cn('text-lg font-bold', item.color)}>
                          {item.label === 'Custo/Entrega'
                            ? `R$ ${item.value.toFixed(2)}`
                            : `R$ ${Number(item.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Motoristas tab ──────────────────────────────────────────────── */}
          {activeTab === 'drivers' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {/* Horizontal bar chart */}
              <div className="card p-5">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-semibold text-brand-text-primary">Top Motoristas</h3>
                    <p className="text-xs text-brand-text-secondary mt-0.5">Entregas por motorista no período</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart
                    data={normalizedDrivers}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={90} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} iconType="circle" iconSize={8} />
                    <Bar dataKey="entregues" name="Entregues" fill="#10b981" radius={[0, 4, 4, 0]} stackId="a" />
                    <Bar dataKey="parcial" name="Parcial" fill="#f59e0b" radius={[0, 0, 0, 0]} stackId="a" />
                    <Bar dataKey="naoEntregue" name="Não entregue" fill="#ef4444" radius={[0, 4, 4, 0]} stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Driver performance table */}
              <div className="card overflow-hidden">
                <div className="px-5 py-4 border-b border-brand-border">
                  <h3 className="font-semibold text-brand-text-primary">Desempenho Detalhado</h3>
                </div>
                <div className="divide-y divide-brand-border/50">
                  {normalizedDrivers.map((driver, i) => {
                    const total = driver.entregues + driver.parcial + driver.naoEntregue;
                    const rate = total > 0 ? Math.round((driver.entregues / total) * 100) : 0;
                    return (
                      <div key={driver.name} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/70 transition-colors">
                        <span className="text-sm font-bold text-brand-text-secondary w-4">{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-brand-text-primary truncate">{driver.name}</p>
                          <div className="mt-1.5 progress-bar">
                            <div
                              className={cn('progress-fill', rate >= 95 ? 'progress-fill-success' : rate >= 80 ? '' : 'progress-fill-warning')}
                              style={{ width: `${rate}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-sm font-bold text-brand-text-primary">{driver.entregues}</div>
                          <div className={cn('text-xs font-semibold', rate >= 95 ? 'text-success-600' : rate >= 80 ? 'text-primary-600' : 'text-warning-600')}>
                            {rate}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {!loadingDrivers && normalizedDrivers.length === 0 && (
                    <div className="px-5 py-8 text-sm text-brand-text-secondary text-center">
                      Sem dados de desempenho de motoristas no período selecionado.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
