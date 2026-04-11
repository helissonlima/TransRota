'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Truck,
  Users,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  Activity,
  Award,
  Receipt,
  Droplets,
  CalendarDays,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from 'recharts';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import api from '@/lib/api';
import { Header } from '@/components/layout/header';
import { StatCard } from '@/components/ui/stat-card';
import { Badge, RouteStatusBadge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/cn';

interface DashboardData {
  fleet: { total: number; active: number; inMaintenance: number };
  drivers: { total: number };
  routes: {
    today: number;
    thisMonth: number;
    COMPLETED: number;
    IN_PROGRESS: number;
    SCHEDULED: number;
    CANCELLED: number;
  };
  deliveries: { today: number };
  alerts: { maintenanceDue: number };
}

interface TaxAlert { id: string; type: string; dueDate: string; value?: number; vehicle: { plate: string; model: string } }
interface OilAlert { vehicleId: string; status: string; nextChangeKm?: number; currentKm?: number; vehicle?: { plate: string; model: string } }
interface TodayBooking { id: string; timeSlot: string; status: string; vehicle: { plate: string; model: string }; user: { name: string } }

// Generate mock 7-day line chart data
function generateWeeklyData() {
  return Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    return {
      date: format(date, 'EEE', { locale: ptBR }),
      rotas: Math.floor(Math.random() * 25 + 10),
      entregas: Math.floor(Math.random() * 40 + 20),
    };
  });
}

const weeklyData = generateWeeklyData();

const DONUT_COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
} as const;

const MOCK_ACTIVITY = [
  { id: '1', route: 'Zona Sul — Entrega', vehicle: 'ABC-1234', driver: 'Carlos Silva', status: 'COMPLETED', time: '14:32' },
  { id: '2', route: 'Zona Norte — Coleta', vehicle: 'DEF-5678', driver: 'Ana Souza', status: 'IN_PROGRESS', time: '15:10' },
  { id: '3', route: 'Centro — Distribuição', vehicle: 'GHI-9012', driver: 'Paulo Martins', status: 'SCHEDULED', time: '16:00' },
  { id: '4', route: 'Zona Oeste — Express', vehicle: 'JKL-3456', driver: 'Maria Lima', status: 'COMPLETED', time: '13:45' },
  { id: '5', route: 'Zona Leste — Retorno', vehicle: 'MNO-7890', driver: 'Roberto Costa', status: 'CANCELLED', time: '12:00' },
];

const MOCK_TOP_DRIVERS = [
  { name: 'Carlos Silva', deliveries: 48, rate: 98 },
  { name: 'Ana Souza', deliveries: 42, rate: 95 },
  { name: 'Paulo Martins', deliveries: 38, rate: 92 },
  { name: 'Maria Lima', deliveries: 35, rate: 96 },
  { name: 'Roberto Costa', deliveries: 30, rate: 88 },
];

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ color: string; name: string; value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-brand-border rounded-xl shadow-card-hover p-3 text-xs">
      <p className="font-semibold text-brand-text-secondary mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-brand-text-secondary">{p.name}:</span>
          <span className="font-bold text-brand-text-primary">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/reports/dashboard').then((r) => r.data),
    refetchInterval: 30_000,
  });

  const { data: taxAlerts = [] } = useQuery<TaxAlert[]>({
    queryKey: ['taxes-overdue'],
    queryFn: () => api.get('/taxes/overdue').then(r => r.data).catch(() => []),
  });

  const { data: oilAlerts = [] } = useQuery<OilAlert[]>({
    queryKey: ['oil-overdue'],
    queryFn: async () => {
      const vehicles = await api.get('/vehicles').then(r => r.data).catch(() => []);
      const results = await Promise.all(
        (vehicles as any[]).map((v: any) =>
          api.get(`/vehicles/${v.id}/oil-changes`).then((r: any) =>
            (r.data as any[])
              .filter((rec: any) => rec.status === 'OVERDUE' || rec.status === 'DUE_SOON')
              .map((rec: any) => ({ ...rec, vehicle: { plate: v.plate, model: v.model } }))
          ).catch(() => [])
        )
      );
      return results.flat();
    },
  });

  const { data: todayBookings = [] } = useQuery<TodayBooking[]>({
    queryKey: ['bookings-today'],
    queryFn: () => {
      const today = new Date().toISOString().slice(0, 10);
      return api.get('/bookings', { params: { date: today } }).then(r => r.data).catch(() => []);
    },
  });

  const userName =
    typeof window !== 'undefined' ? localStorage.getItem('userName') ?? 'Usuário' : 'Usuário';
  const firstName = userName.split('@')[0].split('.')[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

  const routeChartData = [
    { name: 'Concluídas', value: data?.routes.COMPLETED ?? 0 },
    { name: 'Em Andamento', value: data?.routes.IN_PROGRESS ?? 0 },
    { name: 'Agendadas', value: data?.routes.SCHEDULED ?? 0 },
    { name: 'Canceladas', value: data?.routes.CANCELLED ?? 0 },
  ];

  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="min-h-screen">
      <Header
        title="Dashboard"
        breadcrumbs={[{ label: 'Dashboard' }]}
      />

      <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
        {/* ── Page header ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-end justify-between"
        >
          <div>
            <h2 className="text-2xl font-bold text-brand-text-primary">
              {greeting},{' '}
              <span className="gradient-text capitalize">
                {firstName.charAt(0).toUpperCase() + firstName.slice(1)}
              </span>
              !
            </h2>
            <p className="text-sm text-brand-text-secondary mt-1 capitalize">{today}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-brand-text-secondary bg-white border border-brand-border rounded-xl px-3 py-2">
            <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse-soft" />
            Atualizado automaticamente
          </div>
        </motion.div>

        {/* ── Alert banner ────────────────────────────────────────────────── */}
        {(data?.alerts.maintenanceDue ?? 0) > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="alert-warning flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-warning-500/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-warning-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-warning-800 text-sm">
                {data?.alerts.maintenanceDue} veículo(s) com manutenção próxima do vencimento.
              </p>
              <p className="text-warning-600 text-xs mt-0.5">
                Agende as revisões para evitar imprevistos na operação.
              </p>
            </div>
            <a
              href="/fleet"
              className="flex-shrink-0 text-sm font-semibold text-warning-700 hover:text-warning-900 underline underline-offset-2 transition-colors"
            >
              Ver frota →
            </a>
          </motion.div>
        )}

        {/* ── KPI Cards ───────────────────────────────────────────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 xl:grid-cols-4 gap-4"
        >
          <motion.div variants={cardVariants}>
            <StatCard
              title="Veículos Ativos"
              value={data?.fleet.active ?? 0}
              icon={Truck}
              iconColor="blue"
              subtitle={isLoading ? undefined : `${data?.fleet.inMaintenance ?? 0} em manutenção`}
              loading={isLoading}
              delay={0}
            />
          </motion.div>
          <motion.div variants={cardVariants}>
            <StatCard
              title="Motoristas"
              value={data?.drivers.total ?? 0}
              icon={Users}
              iconColor="emerald"
              subtitle="habilitados"
              loading={isLoading}
              delay={1}
            />
          </motion.div>
          <motion.div variants={cardVariants}>
            <StatCard
              title="Rotas Hoje"
              value={data?.routes.today ?? 0}
              icon={MapPin}
              iconColor="violet"
              subtitle={isLoading ? undefined : `${data?.routes.thisMonth ?? 0} este mês`}
              loading={isLoading}
              delay={2}
            />
          </motion.div>
          <motion.div variants={cardVariants}>
            <StatCard
              title="Entregas Hoje"
              value={data?.deliveries.today ?? 0}
              icon={CheckCircle2}
              iconColor="orange"
              loading={isLoading}
              delay={3}
            />
          </motion.div>
        </motion.div>

        {/* ── Secondary Alerts ────────────────────────────────────────────── */}
        {(taxAlerts.length > 0 || oilAlerts.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 xl:grid-cols-2 gap-4"
          >
            {taxAlerts.length > 0 && (
              <a href="/fiscal" className="block group">
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center flex-shrink-0">
                    <Receipt className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-red-800 text-sm">
                      {taxAlerts.length} obrigação(ões) fiscal(is) vencida(s) ou próxima(s)
                    </p>
                    <p className="text-red-600 text-xs mt-0.5">IPVA, licenciamento ou seguro pendente</p>
                  </div>
                  <span className="text-xs font-semibold text-red-700 group-hover:underline">Ver →</span>
                </div>
              </a>
            )}
            {oilAlerts.length > 0 && (
              <a href="/fleet" className="block group">
                <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                    <Droplets className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-amber-800 text-sm">
                      {oilAlerts.length} veículo(s) com troca de óleo atrasada ou próxima
                    </p>
                    <p className="text-amber-600 text-xs mt-0.5">Verifique o controle de troca de óleo</p>
                  </div>
                  <span className="text-xs font-semibold text-amber-700 group-hover:underline">Ver →</span>
                </div>
              </a>
            )}
          </motion.div>
        )}

        {/* ── Today Bookings ───────────────────────────────────────────────── */}
        {todayBookings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="card"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-primary-600" />
                <h3 className="font-semibold text-brand-text-primary text-sm">Agendamentos de Hoje</h3>
              </div>
              <a href="/bookings" className="text-xs font-semibold text-primary-600 hover:underline">Ver todos →</a>
            </div>
            <div className="divide-y divide-brand-border/40">
              {todayBookings.slice(0, 4).map((b, i) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.04 }}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/70 transition-colors"
                >
                  <div className={cn('w-2 h-8 rounded-full flex-shrink-0',
                    b.status === 'CONFIRMED' ? 'bg-emerald-400' :
                    b.status === 'PENDING'   ? 'bg-warning-400' :
                    b.status === 'COMPLETED' ? 'bg-blue-400'    : 'bg-slate-300',
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brand-text-primary truncate">
                      {b.vehicle.plate} — {b.vehicle.model}
                    </p>
                    <p className="text-xs text-brand-text-secondary">{b.user.name}</p>
                  </div>
                  <span className="text-xs font-semibold text-brand-text-secondary bg-slate-100 px-2 py-1 rounded-lg">
                    {b.timeSlot}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Charts row ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
          {/* Line chart — last 7 days */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="xl:col-span-3 card p-5"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold text-brand-text-primary">Atividade — Últimos 7 dias</h3>
                <p className="text-xs text-brand-text-secondary mt-0.5">Rotas e entregas realizadas</p>
              </div>
              <Badge variant="info">Esta semana</Badge>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                  iconType="circle"
                  iconSize={8}
                />
                <Line
                  type="monotone"
                  dataKey="rotas"
                  name="Rotas"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  dot={{ fill: '#2563eb', r: 3 }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="entregas"
                  name="Entregas"
                  stroke="#f97316"
                  strokeWidth={2.5}
                  dot={{ fill: '#f97316', r: 3 }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                  strokeDasharray="0"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Donut chart — route status */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="xl:col-span-2 card p-5"
          >
            <div className="mb-4">
              <h3 className="font-semibold text-brand-text-primary">Status das Rotas</h3>
              <p className="text-xs text-brand-text-secondary mt-0.5">Distribuição de hoje</p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <Skeleton className="w-32 h-32 rounded-full" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center">
                  <PieChart width={180} height={180}>
                    <Pie
                      data={routeChartData}
                      cx={90}
                      cy={90}
                      innerRadius={52}
                      outerRadius={80}
                      dataKey="value"
                      strokeWidth={2}
                      stroke="#fff"
                    >
                      {routeChartData.map((_, i) => (
                        <Cell key={i} fill={DONUT_COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v) => [v, '']}
                      contentStyle={{
                        borderRadius: 12,
                        border: '1px solid #e2e8f0',
                        fontSize: 12,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                      }}
                    />
                  </PieChart>
                </div>
                <div className="mt-2 space-y-2">
                  {routeChartData.map((item, i) => (
                    <div key={item.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-sm" style={{ background: DONUT_COLORS[i] }} />
                        <span className="text-brand-text-secondary">{item.name}</span>
                      </div>
                      <span className="font-semibold text-brand-text-primary">{item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </div>

        {/* ── Activity + Top drivers ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {/* Recent activity */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="card"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary-600" />
                <h3 className="font-semibold text-brand-text-primary text-sm">Atividade Recente</h3>
              </div>
              <Badge variant="gray">Últimas 5 rotas</Badge>
            </div>
            <div className="divide-y divide-brand-border/40">
              {MOCK_ACTIVITY.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/70 transition-colors"
                >
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                    item.status === 'COMPLETED' ? 'bg-success-50 text-success-600' :
                    item.status === 'IN_PROGRESS' ? 'bg-warning-50 text-warning-600' :
                    item.status === 'CANCELLED' ? 'bg-danger-50 text-danger-600' :
                    'bg-primary-50 text-primary-600',
                  )}>
                    {item.status === 'COMPLETED' ? <CheckCircle2 className="w-4 h-4" /> :
                     item.status === 'IN_PROGRESS' ? <TrendingUp className="w-4 h-4" /> :
                     <Clock className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brand-text-primary truncate">{item.route}</p>
                    <p className="text-xs text-brand-text-secondary">
                      {item.vehicle} · {item.driver}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <RouteStatusBadge status={item.status} />
                    <span className="text-xs text-brand-text-secondary">{item.time}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Top drivers */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="card"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-accent-500" />
                <h3 className="font-semibold text-brand-text-primary text-sm">Top Motoristas</h3>
              </div>
              <Badge variant="orange">Este mês</Badge>
            </div>
            <div className="divide-y divide-brand-border/40">
              {MOCK_TOP_DRIVERS.map((driver, i) => {
                const initials = driver.name.split(' ').map((n) => n[0]).join('').slice(0, 2);
                const avatarColors = ['bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-orange-500', 'bg-rose-500'];
                return (
                  <motion.div
                    key={driver.name}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 + i * 0.05 }}
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/70 transition-colors"
                  >
                    <span className="text-sm font-bold text-brand-text-secondary w-4 flex-shrink-0">
                      {i + 1}
                    </span>
                    <div className={cn('w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0', avatarColors[i])}>
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-brand-text-primary truncate">{driver.name}</p>
                      <div className="mt-1 progress-bar w-full">
                        <div
                          className="progress-fill"
                          style={{ width: `${(driver.deliveries / 50) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="text-sm font-bold text-brand-text-primary">{driver.deliveries}</span>
                      <span className={cn('text-xs font-semibold', driver.rate >= 95 ? 'text-success-600' : 'text-warning-600')}>
                        {driver.rate}%
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
