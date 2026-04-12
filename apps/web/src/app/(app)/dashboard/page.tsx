'use client';

import { useMemo } from 'react';
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
  Fuel,
  Wrench,
  Gauge,
  DollarSign,
  ClipboardList,
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
import { addDays, format, formatDistanceToNow, subDays, startOfMonth } from 'date-fns';
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
interface VehicleAlert {
  id: string;
  plate: string;
  model: string;
  brand: string;
  currentKm?: number;
  nextMaintenanceKm?: number;
  nextMaintenanceDate?: string;
  status: string;
}
interface MaintenanceAlert {
  id: string;
  type?: string;
  description?: string;
  notes?: string;
  nextDueKm?: number;
  nextDueDate?: string;
  vehicle: { plate: string; model: string; brand: string };
}
interface ChecklistExecutionAlert {
  id: string;
  resolutionStatus?: 'PENDING' | 'RESOLVED' | 'APPROVED';
  hasIssues: boolean;
  externalDamage?: string;
  internalDamage?: string;
  vehicle: { plate: string; model?: string };
  checklist: { name: string; type: string };
  createdAt?: string;
}
interface BookingAlert {
  id: string;
  date: string;
  status: string;
  vehicleId?: string;
  vehicle: { plate: string; model: string };
  user: { name: string };
}

type AlertPriority = 'CRITICO' | 'ALTO' | 'MEDIO';

interface PrioritizedAlertItem {
  id: string;
  priority: AlertPriority;
  category: 'RESERVA' | 'OLEO' | 'PNEU' | 'AVARIA';
  title: string;
  description: string;
  href: string;
}
interface DeliveryReportStop {
  id: string;
  status: string;
  route: {
    id: string;
    scheduledDate: string;
  };
}

interface DeliveryReportResponse {
  total: number;
  summary: Record<string, number>;
  stops: DeliveryReportStop[];
}

interface DriverPerformance {
  driverId: string;
  name: string;
  routes: number;
  delivered: number;
  notDelivered: number;
  partial: number;
}

interface RecentRoute {
  id: string;
  name: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'SCHEDULED' | 'CANCELLED' | 'DRAFT';
  scheduledDate: string;
  vehicle: { plate: string; model: string };
  driver: { name: string };
}

const DONUT_COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
} as const;

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

  const { data: futureBookings = [] } = useQuery<BookingAlert[]>({
    queryKey: ['bookings-future-active'],
    queryFn: () => {
      const today = new Date().toISOString().slice(0, 10);
      return api.get('/bookings', { params: { dateFrom: today } }).then((r) => r.data).catch(() => []);
    },
  });

  const { data: vehicleAlerts = [] } = useQuery<VehicleAlert[]>({
    queryKey: ['vehicle-maintenance-alerts'],
    queryFn: () => api.get('/vehicles/alerts').then((r) => r.data).catch(() => []),
  });

  const { data: maintenanceAlerts = [] } = useQuery<MaintenanceAlert[]>({
    queryKey: ['maintenance-alerts-dashboard'],
    queryFn: () => {
      const from = subDays(new Date(), 180).toISOString().slice(0, 10);
      const to = new Date().toISOString().slice(0, 10);
      return api.get('/vehicles/maintenance-records', { params: { dateFrom: from, dateTo: to } }).then((r) => r.data).catch(() => []);
    },
  });

  const { data: pendingChecklistIssues = [] } = useQuery<ChecklistExecutionAlert[]>({
    queryKey: ['dashboard-pending-checklist-issues'],
    queryFn: () => api.get('/checklists/executions', { params: { resolutionStatus: 'PENDING' } }).then((r) => r.data).catch(() => []),
  });

  const last7DaysRange = useMemo(() => {
    const to = new Date();
    const from = subDays(to, 6);
    return {
      from: from.toISOString().slice(0, 10),
      to: to.toISOString().slice(0, 10),
    };
  }, []);

  const { data: deliveriesLastWeek } = useQuery<DeliveryReportResponse>({
    queryKey: ['deliveries-last-week', last7DaysRange.from, last7DaysRange.to],
    queryFn: () => api.get(`/reports/deliveries?from=${last7DaysRange.from}&to=${last7DaysRange.to}`).then((r) => r.data),
  });

  const { data: topDrivers = [] } = useQuery<DriverPerformance[]>({
    queryKey: ['dashboard-top-drivers', last7DaysRange.from, last7DaysRange.to],
    queryFn: () => api.get(`/reports/drivers?from=${last7DaysRange.from}&to=${last7DaysRange.to}`).then((r) => r.data).catch(() => []),
  });

  const { data: recentRoutes = [] } = useQuery<RecentRoute[]>({
    queryKey: ['dashboard-recent-routes'],
    queryFn: () => api.get('/routes').then((r) => r.data).catch(() => []),
  });

  const monthRange = useMemo(() => {
    const now = new Date();
    return {
      from: startOfMonth(now).toISOString().slice(0, 10),
      to: now.toISOString().slice(0, 10),
    };
  }, []);

  const { data: monthFuelRecords = [] } = useQuery<Array<{ totalCost: number; liters: number }>>({
    queryKey: ['dashboard-fuel-month', monthRange.from, monthRange.to],
    queryFn: () => api.get('/vehicles/fuel-records', { params: { dateFrom: monthRange.from, dateTo: monthRange.to } }).then(r => r.data).catch(() => []),
  });

  const { data: monthMaintenanceRecords = [] } = useQuery<Array<{ cost?: number }>>({
    queryKey: ['dashboard-maintenance-month', monthRange.from, monthRange.to],
    queryFn: () => api.get('/vehicles/maintenance-records', { params: { dateFrom: monthRange.from, dateTo: monthRange.to } }).then(r => r.data).catch(() => []),
  });

  const { data: monthKmLogs = [] } = useQuery<Array<{ totalKm: number }>>({
    queryKey: ['dashboard-km-month', monthRange.from, monthRange.to],
    queryFn: () => api.get('/daily-km', { params: { dateFrom: monthRange.from, dateTo: monthRange.to } }).then(r => r.data).catch(() => []),
  });

  const weeklyData = useMemo(() => {
    const dayBuckets = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      return {
        key: format(date, 'yyyy-MM-dd'),
        date: format(date, 'EEE', { locale: ptBR }),
        rotas: new Set<string>(),
        entregas: 0,
      };
    });

    const dayMap = new Map(dayBuckets.map((d) => [d.key, d]));
    for (const stop of deliveriesLastWeek?.stops ?? []) {
      const key = format(new Date(stop.route.scheduledDate), 'yyyy-MM-dd');
      const bucket = dayMap.get(key);
      if (!bucket) continue;
      bucket.rotas.add(stop.route.id);
      if (stop.status === 'DELIVERED' || stop.status === 'PARTIAL_DELIVERY') {
        bucket.entregas += 1;
      }
    }

    return dayBuckets.map((d) => ({
      date: d.date,
      rotas: d.rotas.size,
      entregas: d.entregas,
    }));
  }, [deliveriesLastWeek]);

  const recentActivity = useMemo(() => recentRoutes.slice(0, 5), [recentRoutes]);

  const topDriversData = useMemo(
    () =>
      topDrivers.slice(0, 5).map((driver) => {
        const totalStops = driver.delivered + driver.partial + driver.notDelivered;
        return {
          name: driver.name,
          deliveries: driver.delivered,
          rate: totalStops > 0 ? Math.round((driver.delivered / totalStops) * 100) : 0,
        };
      }),
    [topDrivers],
  );

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

  const fleetKpis = useMemo(() => {
    const fuelCost = monthFuelRecords.reduce((acc, r) => acc + Number(r.totalCost ?? 0), 0);
    const fuelLiters = monthFuelRecords.reduce((acc, r) => acc + Number(r.liters ?? 0), 0);
    const maintenanceCost = monthMaintenanceRecords.reduce((acc, r) => acc + Number((r as any).cost ?? 0), 0);
    const totalKm = monthKmLogs.reduce((acc, r) => acc + Number(r.totalKm ?? 0), 0);
    return { fuelCost, fuelLiters, maintenanceCost, totalKm, fuelCount: monthFuelRecords.length, maintenanceCount: monthMaintenanceRecords.length };
  }, [monthFuelRecords, monthMaintenanceRecords, monthKmLogs]);

  const operationalAlerts = useMemo(() => {
    const reservedActive = futureBookings.filter((b) => b.status === 'PENDING' || b.status === 'CONFIRMED');
    const reservedVehicles = new Set(reservedActive.map((b) => b.vehicleId ?? b.vehicle.plate));

    const tireKeywords = /pneu|pneus|rod[aao]|alinhamento|balanceamento/i;
    const tireNearDue = maintenanceAlerts.filter((m) => {
      const text = `${m.type ?? ''} ${m.description ?? ''} ${m.notes ?? ''}`;
      if (!tireKeywords.test(text)) return false;

      const dueByDate = m.nextDueDate ? new Date(m.nextDueDate) <= addDays(new Date(), 30) : false;
      const vehicle = vehicleAlerts.find((v) => v.plate === m.vehicle.plate);
      const dueByKm = m.nextDueKm !== undefined && vehicle?.currentKm !== undefined
        ? m.nextDueKm - vehicle.currentKm <= 1000
        : false;
      return dueByDate || dueByKm;
    });

    const oilDueSoon = oilAlerts.filter((o) => o.status === 'OVERDUE' || o.status === 'DUE_SOON');

    const damageKeywords = /el[eé]tric|bateria|freio|motor|suspens[aã]o|avaria|painel|faro|chicote/i;
    const pendingDamageIssues = pendingChecklistIssues.filter((c) => {
      const damageText = `${c.externalDamage ?? ''} ${c.internalDamage ?? ''}`.trim();
      return c.hasIssues && (!!damageText || damageKeywords.test(`${c.checklist?.name ?? ''} ${damageText}`));
    });

    const priorityWeight: Record<AlertPriority, number> = {
      CRITICO: 3,
      ALTO: 2,
      MEDIO: 1,
    };

    const prioritizedItems: PrioritizedAlertItem[] = [
      ...pendingDamageIssues.map((c) => {
        const text = `${c.externalDamage ?? ''} ${c.internalDamage ?? ''} ${c.checklist?.name ?? ''}`;
        const criticalDamage = /el[eé]tric|freio|motor|chicote|suspens[aã]o/i.test(text);
        return {
          id: `avaria-${c.id}`,
          priority: (criticalDamage ? 'CRITICO' : 'ALTO') as AlertPriority,
          category: 'AVARIA' as const,
          title: `${c.vehicle.plate} — ${c.checklist.name}`,
          description: c.externalDamage || c.internalDamage || 'Pendência de checklist com problema',
          href: '/checklists',
        };
      }),
      ...oilDueSoon.map((o) => ({
        id: `oleo-${o.vehicleId}`,
        priority: (o.status === 'OVERDUE' ? 'CRITICO' : 'ALTO') as AlertPriority,
        category: 'OLEO' as const,
        title: `${o.vehicle?.plate ?? 'Veículo'} — Troca de óleo`,
        description: o.status === 'OVERDUE' ? 'Troca de óleo atrasada' : 'Troca de óleo próxima do vencimento',
        href: '/fleet',
      })),
      ...tireNearDue.map((m) => ({
        id: `pneu-${m.id}`,
        priority: 'MEDIO' as const,
        category: 'PNEU' as const,
        title: `${m.vehicle.plate} — Pneus`,
        description: m.description || m.type || 'Manutenção de pneus próxima',
        href: '/fleet',
      })),
      ...reservedActive.map((b) => ({
        id: `reserva-${b.id}`,
        priority: 'MEDIO' as const,
        category: 'RESERVA' as const,
        title: `${b.vehicle.plate} — Reserva ativa`,
        description: `${b.user.name} • ${b.status}`,
        href: '/bookings',
      })),
    ].sort((a, b) => {
      const byPriority = priorityWeight[b.priority] - priorityWeight[a.priority];
      if (byPriority !== 0) return byPriority;
      return a.category.localeCompare(b.category);
    });

    const criticalCount = prioritizedItems.filter((i) => i.priority === 'CRITICO').length;
    const highCount = prioritizedItems.filter((i) => i.priority === 'ALTO').length;
    const mediumCount = prioritizedItems.filter((i) => i.priority === 'MEDIO').length;

    return {
      reservedCount: reservedVehicles.size,
      reservedItems: reservedActive.slice(0, 5),
      oilCount: oilDueSoon.length,
      tireCount: tireNearDue.length,
      tireItems: tireNearDue.slice(0, 5),
      damageCount: pendingDamageIssues.length,
      damageItems: pendingDamageIssues.slice(0, 5),
      criticalCount,
      highCount,
      mediumCount,
      prioritizedItems: prioritizedItems.slice(0, 10),
    };
  }, [futureBookings, maintenanceAlerts, oilAlerts, pendingChecklistIssues, vehicleAlerts]);

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

        {/* ── Operational Panorama ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="card p-5"
        >
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <h3 className="font-semibold text-brand-text-primary">Panorama Operacional</h3>
              <p className="text-xs text-brand-text-secondary mt-0.5">
                Alertas de início de turno para evitar falhas na operação
              </p>
            </div>
            <Badge variant={operationalAlerts.criticalCount > 0 ? 'danger' : operationalAlerts.highCount > 0 ? 'warning' : 'success'} dot>
              {operationalAlerts.prioritizedItems.length} alerta(s)
            </Badge>
          </div>

          <div className="flex items-center gap-2 flex-wrap mb-4">
            <Badge variant={operationalAlerts.criticalCount > 0 ? 'danger' : 'gray'}>
              Crítico: {operationalAlerts.criticalCount}
            </Badge>
            <Badge variant={operationalAlerts.highCount > 0 ? 'warning' : 'gray'}>
              Alto: {operationalAlerts.highCount}
            </Badge>
            <Badge variant={operationalAlerts.mediumCount > 0 ? 'info' : 'gray'}>
              Médio: {operationalAlerts.mediumCount}
            </Badge>
          </div>

          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
            <a href="/bookings" className="bg-slate-50 border border-brand-border rounded-xl p-3 hover:bg-slate-100 transition-colors">
              <div className="flex items-center justify-between">
                <CalendarDays className="w-4 h-4 text-blue-600" />
                <Badge variant="info">Reserva</Badge>
              </div>
              <p className="text-2xl font-bold text-brand-text-primary mt-2">{operationalAlerts.reservedCount}</p>
              <p className="text-xs text-brand-text-secondary">veículo(s) reservados</p>
            </a>

            <a href="/fleet" className="bg-slate-50 border border-brand-border rounded-xl p-3 hover:bg-slate-100 transition-colors">
              <div className="flex items-center justify-between">
                <Droplets className="w-4 h-4 text-amber-600" />
                <Badge variant={operationalAlerts.oilCount > 0 ? 'warning' : 'success'}>
                  Óleo
                </Badge>
              </div>
              <p className="text-2xl font-bold text-brand-text-primary mt-2">{operationalAlerts.oilCount}</p>
              <p className="text-xs text-brand-text-secondary">troca(s) próxima(s)/atrasada(s)</p>
            </a>

            <a href="/fleet" className="bg-slate-50 border border-brand-border rounded-xl p-3 hover:bg-slate-100 transition-colors">
              <div className="flex items-center justify-between">
                <Wrench className="w-4 h-4 text-orange-600" />
                <Badge variant={operationalAlerts.tireCount > 0 ? 'warning' : 'success'}>
                  Pneus
                </Badge>
              </div>
              <p className="text-2xl font-bold text-brand-text-primary mt-2">{operationalAlerts.tireCount}</p>
              <p className="text-xs text-brand-text-secondary">manutenção(ões) próxima(s)</p>
            </a>

            <a href="/checklists" className="bg-slate-50 border border-brand-border rounded-xl p-3 hover:bg-slate-100 transition-colors">
              <div className="flex items-center justify-between">
                <ClipboardList className="w-4 h-4 text-red-600" />
                <Badge variant={operationalAlerts.damageCount > 0 ? 'danger' : 'success'}>
                  Avarias
                </Badge>
              </div>
              <p className="text-2xl font-bold text-brand-text-primary mt-2">{operationalAlerts.damageCount}</p>
              <p className="text-xs text-brand-text-secondary">pendências de danos/itens críticos</p>
            </a>
          </div>

          {operationalAlerts.prioritizedItems.length > 0 ? (
            <div className="bg-slate-50 border border-brand-border rounded-xl p-3">
              <div className="text-xs font-semibold text-brand-text-secondary uppercase tracking-wide mb-2">
                Ordem de Prioridade (maior risco primeiro)
              </div>
              <div className="space-y-2">
                {operationalAlerts.prioritizedItems.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    className="flex items-start justify-between gap-3 bg-white border border-brand-border rounded-lg p-2.5 hover:bg-slate-50 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <Badge variant={item.priority === 'CRITICO' ? 'danger' : item.priority === 'ALTO' ? 'warning' : 'info'}>
                          {item.priority}
                        </Badge>
                        <Badge variant="gray">{item.category}</Badge>
                      </div>
                      <p className="text-sm font-semibold text-brand-text-primary truncate">{item.title}</p>
                      <p className="text-xs text-brand-text-secondary truncate">{item.description}</p>
                    </div>
                    <span className="text-xs font-semibold text-primary-600 flex-shrink-0">Abrir</span>
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-success-50 border border-success-200 rounded-xl p-3 text-success-700 text-sm">
              Operação em dia: sem pendências críticas de reserva, pneus e avarias para o início do trabalho.
            </div>
          )}
        </motion.div>

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

        {/* ── Fleet KPIs ──────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Gauge className="w-4 h-4 text-brand-text-secondary" />
            <span className="text-xs font-semibold text-brand-text-secondary uppercase tracking-wide">Frota — Este Mês</span>
          </div>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <a href="/reports" className="block group">
              <div className="card p-4 hover:shadow-card-hover transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Gauge className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-xs text-brand-text-secondary bg-slate-50 px-2 py-0.5 rounded-lg">{monthKmLogs.length} reg.</span>
                </div>
                <p className="text-2xl font-bold text-brand-text-primary tabular-nums">
                  {fleetKpis.totalKm.toLocaleString('pt-BR')}
                </p>
                <p className="text-xs text-brand-text-secondary mt-0.5">KM rodados</p>
              </div>
            </a>

            <a href="/reports" className="block group">
              <div className="card p-4 hover:shadow-card-hover transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
                    <Fuel className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-xs text-brand-text-secondary bg-slate-50 px-2 py-0.5 rounded-lg">{fleetKpis.fuelCount} abast.</span>
                </div>
                <p className="text-2xl font-bold text-brand-text-primary tabular-nums">
                  {fleetKpis.fuelLiters.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} L
                </p>
                <p className="text-xs text-brand-text-secondary mt-0.5">Combustível consumido</p>
              </div>
            </a>

            <a href="/reports" className="block group">
              <div className="card p-4 hover:shadow-card-hover transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-xs text-brand-text-secondary bg-slate-50 px-2 py-0.5 rounded-lg">combustível</span>
                </div>
                <p className="text-2xl font-bold text-brand-text-primary tabular-nums">
                  R$ {fleetKpis.fuelCost.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-brand-text-secondary mt-0.5">Gasto em abastecimento</p>
              </div>
            </a>

            <a href="/reports" className="block group">
              <div className="card p-4 hover:shadow-card-hover transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
                    <Wrench className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="text-xs text-brand-text-secondary bg-slate-50 px-2 py-0.5 rounded-lg">{fleetKpis.maintenanceCount} serv.</span>
                </div>
                <p className="text-2xl font-bold text-brand-text-primary tabular-nums">
                  R$ {fleetKpis.maintenanceCost.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-brand-text-secondary mt-0.5">Gasto em manutenções</p>
              </div>
            </a>
          </div>
        </motion.div>

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
              {recentActivity.length > 0 ? recentActivity.map((item, i) => (
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
                    <p className="text-sm font-medium text-brand-text-primary truncate">{item.name}</p>
                    <p className="text-xs text-brand-text-secondary">
                      {item.vehicle.plate} · {item.driver.name}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <RouteStatusBadge status={item.status} />
                    <span className="text-xs text-brand-text-secondary">
                      {formatDistanceToNow(new Date(item.scheduledDate), { addSuffix: true, locale: ptBR })}
                    </span>
                  </div>
                </motion.div>
              )) : (
                <div className="px-5 py-8 text-sm text-brand-text-secondary text-center">
                  Sem atividade recente no período.
                </div>
              )}
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
              {topDriversData.length > 0 ? topDriversData.map((driver, i) => {
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
              }) : (
                <div className="px-5 py-8 text-sm text-brand-text-secondary text-center">
                  Sem dados de desempenho de motoristas para os ultimos 7 dias.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
