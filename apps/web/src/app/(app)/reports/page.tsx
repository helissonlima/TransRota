"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
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
} from "recharts";
import {
  Fuel,
  Wrench,
  Route,
  Users,
  Truck,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  Activity,
  DollarSign,
  Gauge,
  BarChart2,
  FileSpreadsheet,
} from "lucide-react";
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import api from "@/lib/api";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/cn";

type TabKey = "fuel" | "km" | "maintenance" | "drivers" | "conferencia";

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "km", label: "KM Diário", icon: Route },
  { key: "fuel", label: "Abastecimento", icon: Fuel },
  { key: "maintenance", label: "Manutenções", icon: Wrench },
  { key: "drivers", label: "Condutores", icon: Users },
  { key: "conferencia", label: "Conferência", icon: FileSpreadsheet },
];

const BRAND_COLORS = [
  "#6366f1",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#14b8a6",
  "#f97316",
  "#06b6d4",
];

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function formatKm(v: number) {
  return v.toLocaleString("pt-BR") + " km";
}

interface KmRecord {
  id: string;
  date: string;
  totalKm: number;
  workKm: number;
  personalKm: number;
  vehicle: { plate: string; model: string };
  driver: { name: string };
}
interface FuelRecord {
  id: string;
  performedAt: string;
  totalCost: number;
  liters: number;
  km: number;
  fuelType: string;
  vehicle: { plate: string; model: string };
  driver?: { name: string };
}
interface MaintenanceRecord {
  id: string;
  performedAt: string;
  cost: number;
  type: string;
  description: string;
  vehicle: { plate: string; model: string };
  workshopName?: string;
}
interface Driver {
  id: string;
  name: string;
}
interface Vehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
  type: string;
}

interface ReconciliationRow {
  productName: string;
  sheetQuantity: number;
  systemQuantity: number;
  difference: number;
  status: "MATCH" | "DIVERGENT" | "MISSING_IN_SYSTEM" | "MISSING_IN_SHEET";
}

interface ReconciliationResponse {
  summary: {
    sheetItems: number;
    systemItems: number;
    matched: number;
    divergent: number;
    missingInSystem: number;
    missingInSheet: number;
  };
  rows: ReconciliationRow[];
  generatedAt: string;
}

const now = new Date();
const months = Array.from({ length: 6 }, (_, i) => {
  const d = subMonths(now, 5 - i);
  return {
    label: format(d, "MMM/yy", { locale: ptBR }),
    from: startOfMonth(d).toISOString().slice(0, 10),
    to: endOfMonth(d).toISOString().slice(0, 10),
  };
});

export default function ReportsPage() {
  const [tab, setTab] = useState<TabKey>("km");
  const [period, setPeriod] = useState<"1m" | "3m" | "6m">("6m");
  const [sheetFile, setSheetFile] = useState<File | null>(null);

  const dateFrom =
    period === "1m"
      ? months[5].from
      : period === "3m"
        ? months[3].from
        : months[0].from;

  const { data: kmData = [], isLoading: kmLoading } = useQuery<KmRecord[]>({
    queryKey: ["reports-km", dateFrom],
    queryFn: () =>
      api
        .get("/daily-km", { params: { dateFrom, dateTo: months[5].to } })
        .then((r) =>
          Array.isArray(r.data) ? r.data : (r.data?.records ?? r.data ?? []),
        ),
    enabled: tab === "km",
  });

  const { data: fuelData = [], isLoading: fuelLoading } = useQuery<
    FuelRecord[]
  >({
    queryKey: ["reports-fuel", dateFrom],
    queryFn: () =>
      api
        .get("/vehicles/fuel-records", {
          params: { dateFrom, dateTo: months[5].to },
        })
        .then((r) => r.data),
    enabled: tab === "fuel",
  });

  const { data: mainData = [], isLoading: mainLoading } = useQuery<
    MaintenanceRecord[]
  >({
    queryKey: ["reports-maintenance", dateFrom],
    queryFn: () =>
      api
        .get("/vehicles/maintenance-records", {
          params: { dateFrom, dateTo: months[5].to },
        })
        .then((r) => r.data),
    enabled: tab === "maintenance",
  });

  const { data: drivers = [] } = useQuery<Driver[]>({
    queryKey: ["drivers-list"],
    queryFn: () => api.get("/drivers").then((r) => r.data?.drivers ?? r.data),
    enabled: tab === "drivers",
  });

  const { data: vehicles = [] } = useQuery<Vehicle[]>({
    queryKey: ["vehicles-list"],
    queryFn: () => api.get("/vehicles").then((r) => r.data?.vehicles ?? r.data),
    enabled: tab === "drivers",
  });

  // ── KM aggregated by month ─────────────────────────────────────────────────
  const kmByMonth = months.map((m) => {
    const recs = kmData.filter((r) => r.date >= m.from && r.date <= m.to);
    return {
      month: m.label,
      trabalho: Math.round(recs.reduce((s, r) => s + r.workKm, 0)),
      pessoal: Math.round(recs.reduce((s, r) => s + r.personalKm, 0)),
      total: Math.round(recs.reduce((s, r) => s + r.totalKm, 0)),
    };
  });

  const kmByDriver = Object.values(
    kmData.reduce(
      (acc, r) => {
        const n = r.driver?.name ?? "Desconhecido";
        if (!acc[n])
          acc[n] = { name: n.split(" ").slice(0, 2).join(" "), km: 0 };
        acc[n].km += r.totalKm;
        return acc;
      },
      {} as Record<string, { name: string; km: number }>,
    ),
  )
    .sort((a, b) => b.km - a.km)
    .slice(0, 8);

  const kmByVehicle = Object.values(
    kmData.reduce(
      (acc, r) => {
        const p = r.vehicle?.plate ?? "—";
        if (!acc[p]) acc[p] = { plate: p, km: 0 };
        acc[p].km += r.totalKm;
        return acc;
      },
      {} as Record<string, { plate: string; km: number }>,
    ),
  )
    .sort((a, b) => b.km - a.km)
    .slice(0, 8);

  const totalKm = kmData.reduce((s, r) => s + r.totalKm, 0);
  const workKm = kmData.reduce((s, r) => s + r.workKm, 0);

  // ── Fuel aggregated ────────────────────────────────────────────────────────
  const fuelByMonth = months.map((m) => {
    const recs = fuelData.filter(
      (r) => r.performedAt >= m.from && r.performedAt <= m.to,
    );
    return {
      month: m.label,
      custo: Math.round(recs.reduce((s, r) => s + r.totalCost, 0)),
      litros: Math.round(recs.reduce((s, r) => s + r.liters, 0)),
    };
  });

  const fuelByVehicle = Object.values(
    fuelData.reduce(
      (acc, r) => {
        const p = r.vehicle?.plate ?? "—";
        if (!acc[p]) acc[p] = { plate: p, custo: 0, litros: 0 };
        acc[p].custo += r.totalCost;
        acc[p].litros += r.liters;
        return acc;
      },
      {} as Record<string, { plate: string; custo: number; litros: number }>,
    ),
  )
    .sort((a, b) => b.custo - a.custo)
    .slice(0, 8);

  const totalFuel = fuelData.reduce((s, r) => s + r.totalCost, 0);
  const totalLiters = fuelData.reduce((s, r) => s + r.liters, 0);

  const fuelByType = Object.values(
    fuelData.reduce(
      (acc, r) => {
        const t = r.fuelType;
        if (!acc[t]) acc[t] = { name: t, value: 0 };
        acc[t].value += r.totalCost;
        return acc;
      },
      {} as Record<string, { name: string; value: number }>,
    ),
  );

  // ── Maintenance aggregated ─────────────────────────────────────────────────
  const mainByMonth = months.map((m) => {
    const recs = mainData.filter(
      (r) => r.performedAt >= m.from && r.performedAt <= m.to,
    );
    return {
      month: m.label,
      preventiva: Math.round(
        recs
          .filter((r) => r.type?.toUpperCase().includes("PREV"))
          .reduce((s, r) => s + r.cost, 0),
      ),
      corretiva: Math.round(
        recs
          .filter((r) => !r.type?.toUpperCase().includes("PREV"))
          .reduce((s, r) => s + r.cost, 0),
      ),
    };
  });

  const totalMain = mainData.reduce((s, r) => s + r.cost, 0);
  const mainByWorkshop = Object.values(
    mainData.reduce(
      (acc, r) => {
        const w = r.workshopName ?? "Não informado";
        if (!acc[w]) acc[w] = { name: w.slice(0, 25), value: 0 };
        acc[w].value += r.cost;
        return acc;
      },
      {} as Record<string, { name: string; value: number }>,
    ),
  )
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const isLoading =
    (tab === "km" && kmLoading) ||
    (tab === "fuel" && fuelLoading) ||
    (tab === "maintenance" && mainLoading);

  const reconciliationMutation = useMutation<
    ReconciliationResponse,
    Error,
    File
  >({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post(
        "/reports/warehouse-reconciliation",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return response.data;
    },
  });

  const reconciliation = reconciliationMutation.data;

  const reconStatusLabel: Record<ReconciliationRow["status"], string> = {
    MATCH: "OK",
    DIVERGENT: "Divergente",
    MISSING_IN_SYSTEM: "Falta no Sistema",
    MISSING_IN_SHEET: "Falta na Planilha",
  };

  const reconStatusColor: Record<ReconciliationRow["status"], string> = {
    MATCH: "bg-success-50 text-success-700",
    DIVERGENT: "bg-warning-50 text-warning-700",
    MISSING_IN_SYSTEM: "bg-danger-50 text-danger-700",
    MISSING_IN_SHEET: "bg-primary-50 text-primary-700",
  };

  return (
    <div className="min-h-screen">
      <Header title="Relatórios" breadcrumbs={[{ label: "Relatórios" }]} />

      <div className="p-6 space-y-5 max-w-[1600px] mx-auto">
        {/* Tab bar + period filter */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1 bg-white border border-brand-border rounded-xl p-1">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  tab === t.key
                    ? "bg-primary-600 text-white shadow-sm"
                    : "text-brand-text-secondary hover:text-brand-text-primary hover:bg-slate-50",
                )}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            ))}
          </div>

          {tab !== "conferencia" && (
            <div className="flex items-center gap-2">
              {(["1m", "3m", "6m"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all",
                    period === p
                      ? "bg-primary-600 text-white border-primary-600"
                      : "bg-white text-brand-text-secondary border-brand-border hover:border-primary-300",
                  )}
                >
                  {p === "1m" ? "1 Mês" : p === "3m" ? "3 Meses" : "6 Meses"}
                </button>
              ))}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {/* ── KM TAB ─────────────────────────────────────────────────────── */}
            {tab === "km" && (
              <motion.div
                key="km"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-5"
              >
                {/* KPI row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    {
                      label: "KM Total",
                      value: formatKm(totalKm),
                      icon: Gauge,
                      color: "text-primary-600",
                      bg: "bg-primary-50",
                    },
                    {
                      label: "KM Trabalho",
                      value: formatKm(workKm),
                      icon: TrendingUp,
                      color: "text-success-600",
                      bg: "bg-success-50",
                    },
                    {
                      label: "KM Pessoal",
                      value: formatKm(totalKm - workKm),
                      icon: Route,
                      color: "text-warning-600",
                      bg: "bg-warning-50",
                    },
                    {
                      label: "Registros",
                      value: kmData.length.toLocaleString("pt-BR"),
                      icon: Activity,
                      color: "text-slate-600",
                      bg: "bg-slate-50",
                    },
                  ].map((kpi, i) => (
                    <motion.div
                      key={kpi.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white rounded-2xl border border-brand-border shadow-card p-4"
                    >
                      <div
                        className={cn(
                          "w-9 h-9 rounded-xl flex items-center justify-center mb-3",
                          kpi.bg,
                        )}
                      >
                        <kpi.icon className={cn("w-5 h-5", kpi.color)} />
                      </div>
                      <div className="text-xl font-bold text-brand-text-primary">
                        {kpi.value}
                      </div>
                      <div className="text-xs text-brand-text-secondary mt-0.5">
                        {kpi.label}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="bg-white rounded-2xl border border-brand-border shadow-card p-5">
                    <h3 className="font-semibold text-brand-text-primary mb-4 flex items-center gap-2">
                      <BarChart2 className="w-4 h-4 text-primary-600" />
                      KM por Mês
                    </h3>
                    <ResponsiveContainer width="100%" height={240}>
                      <BarChart data={kmByMonth} barSize={16}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis
                          dataKey="month"
                          tick={{ fontSize: 11, fill: "#94a3b8" }}
                        />
                        <YAxis
                          tick={{ fontSize: 11, fill: "#94a3b8" }}
                          width={60}
                          tickFormatter={(v) => (v / 1000).toFixed(0) + "k"}
                        />
                        <Tooltip formatter={(v) => [formatKm(Number(v))]} />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                        <Bar
                          dataKey="trabalho"
                          name="Trabalho"
                          fill="#6366f1"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="pessoal"
                          name="Pessoal"
                          fill="#e0e7ff"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white rounded-2xl border border-brand-border shadow-card p-5">
                    <h3 className="font-semibold text-brand-text-primary mb-4 flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary-600" />
                      Top Condutores (KM)
                    </h3>
                    <div className="space-y-2.5">
                      {kmByDriver.map((d, i) => (
                        <div key={d.name} className="flex items-center gap-3">
                          <span className="text-xs font-bold text-brand-text-secondary w-4">
                            {i + 1}
                          </span>
                          <span className="text-sm text-brand-text-primary flex-1 truncate">
                            {d.name}
                          </span>
                          <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary-500 rounded-full"
                              style={{
                                width: `${Math.min(100, (d.km / (kmByDriver[0]?.km || 1)) * 100)}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-brand-text-secondary w-20 text-right">
                            {formatKm(d.km)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-brand-border shadow-card p-5 lg:col-span-2">
                    <h3 className="font-semibold text-brand-text-primary mb-4 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-primary-600" />
                      KM por Veículo
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart
                        data={kmByVehicle}
                        layout="vertical"
                        barSize={14}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#f1f5f9"
                          horizontal={false}
                        />
                        <XAxis
                          type="number"
                          tick={{ fontSize: 11, fill: "#94a3b8" }}
                          tickFormatter={(v) => (v / 1000).toFixed(0) + "k"}
                        />
                        <YAxis
                          dataKey="plate"
                          type="category"
                          tick={{ fontSize: 11, fill: "#64748b" }}
                          width={80}
                        />
                        <Tooltip formatter={(v) => [formatKm(Number(v))]} />
                        <Bar
                          dataKey="km"
                          fill="#6366f1"
                          radius={[0, 4, 4, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── FUEL TAB ───────────────────────────────────────────────────── */}
            {tab === "fuel" && (
              <motion.div
                key="fuel"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-5"
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    {
                      label: "Custo Total",
                      value: formatCurrency(totalFuel),
                      icon: DollarSign,
                      color: "text-primary-600",
                      bg: "bg-primary-50",
                    },
                    {
                      label: "Litros",
                      value:
                        Math.round(totalLiters).toLocaleString("pt-BR") + " L",
                      icon: Fuel,
                      color: "text-success-600",
                      bg: "bg-success-50",
                    },
                    {
                      label: "Custo Médio/L",
                      value: totalLiters
                        ? formatCurrency(totalFuel / totalLiters)
                        : "—",
                      icon: TrendingUp,
                      color: "text-warning-600",
                      bg: "bg-warning-50",
                    },
                    {
                      label: "Abastecimentos",
                      value: fuelData.length.toLocaleString("pt-BR"),
                      icon: Activity,
                      color: "text-slate-600",
                      bg: "bg-slate-50",
                    },
                  ].map((kpi, i) => (
                    <motion.div
                      key={kpi.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white rounded-2xl border border-brand-border shadow-card p-4"
                    >
                      <div
                        className={cn(
                          "w-9 h-9 rounded-xl flex items-center justify-center mb-3",
                          kpi.bg,
                        )}
                      >
                        <kpi.icon className={cn("w-5 h-5", kpi.color)} />
                      </div>
                      <div className="text-xl font-bold text-brand-text-primary">
                        {kpi.value}
                      </div>
                      <div className="text-xs text-brand-text-secondary mt-0.5">
                        {kpi.label}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  <div className="bg-white rounded-2xl border border-brand-border shadow-card p-5 lg:col-span-2">
                    <h3 className="font-semibold text-brand-text-primary mb-4 flex items-center gap-2">
                      <BarChart2 className="w-4 h-4 text-primary-600" />
                      Custo de Combustível por Mês
                    </h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={fuelByMonth}>
                        <defs>
                          <linearGradient
                            id="colorFuel"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#6366f1"
                              stopOpacity={0.15}
                            />
                            <stop
                              offset="95%"
                              stopColor="#6366f1"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis
                          dataKey="month"
                          tick={{ fontSize: 11, fill: "#94a3b8" }}
                        />
                        <YAxis
                          tick={{ fontSize: 11, fill: "#94a3b8" }}
                          width={70}
                          tickFormatter={(v) =>
                            "R$" + (v / 1000).toFixed(0) + "k"
                          }
                        />
                        <Tooltip
                          formatter={(v) => [formatCurrency(Number(v))]}
                        />
                        <Area
                          type="monotone"
                          dataKey="custo"
                          name="Custo"
                          stroke="#6366f1"
                          fill="url(#colorFuel)"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white rounded-2xl border border-brand-border shadow-card p-5">
                    <h3 className="font-semibold text-brand-text-primary mb-4 flex items-center gap-2">
                      <Fuel className="w-4 h-4 text-primary-600" />
                      Tipo de Combustível
                    </h3>
                    <ResponsiveContainer width="100%" height={160}>
                      <PieChart>
                        <Pie
                          data={fuelByType}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={70}
                          label={({ name, percent }) =>
                            `${((percent ?? 0) * 100).toFixed(0)}%`
                          }
                          labelLine={false}
                        >
                          {fuelByType.map((_, i) => (
                            <Cell
                              key={i}
                              fill={BRAND_COLORS[i % BRAND_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(v) => [formatCurrency(Number(v))]}
                        />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white rounded-2xl border border-brand-border shadow-card p-5 lg:col-span-3">
                    <h3 className="font-semibold text-brand-text-primary mb-4 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-primary-600" />
                      Top Veículos — Custo de Combustível
                    </h3>
                    <div className="space-y-2.5">
                      {fuelByVehicle.map((v, i) => (
                        <div key={v.plate} className="flex items-center gap-3">
                          <span className="text-xs font-bold text-brand-text-secondary w-4">
                            {i + 1}
                          </span>
                          <span className="font-mono text-sm font-semibold text-brand-text-primary w-24">
                            {v.plate}
                          </span>
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary-500 rounded-full"
                              style={{
                                width: `${Math.min(100, (v.custo / (fuelByVehicle[0]?.custo || 1)) * 100)}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-brand-text-primary w-28 text-right">
                            {formatCurrency(v.custo)}
                          </span>
                          <span className="text-xs text-brand-text-secondary w-20 text-right">
                            {Math.round(v.litros)} L
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── MAINTENANCE TAB ────────────────────────────────────────────── */}
            {tab === "maintenance" && (
              <motion.div
                key="maintenance"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-5"
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    {
                      label: "Custo Total",
                      value: formatCurrency(totalMain),
                      icon: DollarSign,
                      color: "text-primary-600",
                      bg: "bg-primary-50",
                    },
                    {
                      label: "Preventivas",
                      value: mainData
                        .filter((r) => r.type?.toUpperCase().includes("PREV"))
                        .length.toString(),
                      icon: TrendingUp,
                      color: "text-success-600",
                      bg: "bg-success-50",
                    },
                    {
                      label: "Corretivas",
                      value: mainData
                        .filter((r) => !r.type?.toUpperCase().includes("PREV"))
                        .length.toString(),
                      icon: TrendingDown,
                      color: "text-danger-600",
                      bg: "bg-danger-50",
                    },
                    {
                      label: "Registros",
                      value: mainData.length.toString(),
                      icon: Wrench,
                      color: "text-slate-600",
                      bg: "bg-slate-50",
                    },
                  ].map((kpi, i) => (
                    <motion.div
                      key={kpi.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white rounded-2xl border border-brand-border shadow-card p-4"
                    >
                      <div
                        className={cn(
                          "w-9 h-9 rounded-xl flex items-center justify-center mb-3",
                          kpi.bg,
                        )}
                      >
                        <kpi.icon className={cn("w-5 h-5", kpi.color)} />
                      </div>
                      <div className="text-xl font-bold text-brand-text-primary">
                        {kpi.value}
                      </div>
                      <div className="text-xs text-brand-text-secondary mt-0.5">
                        {kpi.label}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="bg-white rounded-2xl border border-brand-border shadow-card p-5">
                    <h3 className="font-semibold text-brand-text-primary mb-4 flex items-center gap-2">
                      <BarChart2 className="w-4 h-4 text-primary-600" />
                      Custo por Mês
                    </h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={mainByMonth} barSize={14}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis
                          dataKey="month"
                          tick={{ fontSize: 11, fill: "#94a3b8" }}
                        />
                        <YAxis
                          tick={{ fontSize: 11, fill: "#94a3b8" }}
                          width={70}
                          tickFormatter={(v) =>
                            "R$" + (v / 1000).toFixed(0) + "k"
                          }
                        />
                        <Tooltip
                          formatter={(v) => [formatCurrency(Number(v))]}
                        />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                        <Bar
                          dataKey="preventiva"
                          name="Preventiva"
                          fill="#22c55e"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="corretiva"
                          name="Corretiva"
                          fill="#ef4444"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white rounded-2xl border border-brand-border shadow-card p-5">
                    <h3 className="font-semibold text-brand-text-primary mb-4 flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-primary-600" />
                      Custo por Oficina
                    </h3>
                    <div className="space-y-3">
                      {mainByWorkshop.map((w, i) => (
                        <div key={w.name} className="flex items-center gap-3">
                          <span className="text-xs font-bold text-brand-text-secondary w-4">
                            {i + 1}
                          </span>
                          <span
                            className="text-sm text-brand-text-primary flex-1 truncate"
                            title={w.name}
                          >
                            {w.name}
                          </span>
                          <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-warning-500 rounded-full"
                              style={{
                                width: `${Math.min(100, (w.value / (mainByWorkshop[0]?.value || 1)) * 100)}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-brand-text-primary w-24 text-right">
                            {formatCurrency(w.value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent maintenance log */}
                  <div className="bg-white rounded-2xl border border-brand-border shadow-card overflow-hidden lg:col-span-2">
                    <div className="px-5 py-4 border-b border-brand-border flex items-center justify-between">
                      <h3 className="font-semibold text-brand-text-primary">
                        Últimos Registros
                      </h3>
                      <span className="text-xs text-brand-text-secondary">
                        {mainData.length} registros
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-slate-50/80 border-b border-brand-border">
                            {[
                              "Veículo",
                              "Tipo",
                              "Descrição",
                              "Oficina",
                              "Data",
                              "Custo",
                            ].map((h) => (
                              <th
                                key={h}
                                className="text-left px-4 py-3 text-xs font-semibold text-brand-text-secondary uppercase tracking-wide"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border/50">
                          {mainData.slice(0, 10).map((r, i) => (
                            <tr
                              key={r.id}
                              className="hover:bg-slate-50/60 transition-colors"
                            >
                              <td className="px-4 py-2.5 font-mono font-bold text-brand-text-primary text-xs">
                                {r.vehicle?.plate}
                              </td>
                              <td className="px-4 py-2.5">
                                <span
                                  className={cn(
                                    "text-xs font-semibold px-2 py-0.5 rounded-full",
                                    r.type?.toUpperCase().includes("PREV")
                                      ? "bg-success-50 text-success-700"
                                      : "bg-danger-50 text-danger-700",
                                  )}
                                >
                                  {r.type}
                                </span>
                              </td>
                              <td className="px-4 py-2.5 text-brand-text-secondary max-w-[200px] truncate">
                                {r.description}
                              </td>
                              <td className="px-4 py-2.5 text-brand-text-secondary text-xs">
                                {r.workshopName ?? "—"}
                              </td>
                              <td className="px-4 py-2.5 text-brand-text-secondary text-xs">
                                {r.performedAt
                                  ? format(parseISO(r.performedAt), "dd/MM/yy")
                                  : "—"}
                              </td>
                              <td className="px-4 py-2.5 font-semibold text-brand-text-primary">
                                {formatCurrency(r.cost)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── DRIVERS TAB ────────────────────────────────────────────────── */}
            {tab === "drivers" && (
              <motion.div
                key="drivers"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-5"
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    {
                      label: "Motoristas Ativos",
                      value: drivers.length.toString(),
                      icon: Users,
                      color: "text-primary-600",
                      bg: "bg-primary-50",
                    },
                    {
                      label: "Veículos Ativos",
                      value: vehicles.length.toString(),
                      icon: Truck,
                      color: "text-success-600",
                      bg: "bg-success-50",
                    },
                    {
                      label: "Ratio V/M",
                      value: drivers.length
                        ? (vehicles.length / drivers.length).toFixed(1)
                        : "—",
                      icon: Activity,
                      color: "text-warning-600",
                      bg: "bg-warning-50",
                    },
                    {
                      label: "Com CNH Vencendo",
                      value: drivers
                        .filter(
                          (d) =>
                            (d as any).licenseExpiry &&
                            new Date((d as any).licenseExpiry) <
                              new Date(Date.now() + 90 * 24 * 3600 * 1000),
                        )
                        .length.toString(),
                      icon: Calendar,
                      color: "text-danger-600",
                      bg: "bg-danger-50",
                    },
                  ].map((kpi, i) => (
                    <motion.div
                      key={kpi.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white rounded-2xl border border-brand-border shadow-card p-4"
                    >
                      <div
                        className={cn(
                          "w-9 h-9 rounded-xl flex items-center justify-center mb-3",
                          kpi.bg,
                        )}
                      >
                        <kpi.icon className={cn("w-5 h-5", kpi.color)} />
                      </div>
                      <div className="text-xl font-bold text-brand-text-primary">
                        {kpi.value}
                      </div>
                      <div className="text-xs text-brand-text-secondary mt-0.5">
                        {kpi.label}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="bg-white rounded-2xl border border-brand-border shadow-card overflow-hidden">
                    <div className="px-5 py-4 border-b border-brand-border">
                      <h3 className="font-semibold text-brand-text-primary">
                        Motoristas Cadastrados
                      </h3>
                    </div>
                    <div className="divide-y divide-brand-border/50">
                      {drivers.slice(0, 10).map((d: any, i) => {
                        const expiry = d.licenseExpiry
                          ? new Date(d.licenseExpiry)
                          : null;
                        const isExpiringSoon =
                          expiry &&
                          expiry < new Date(Date.now() + 90 * 24 * 3600 * 1000);
                        return (
                          <motion.div
                            key={d.id}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.04 }}
                            className="flex items-center gap-3 px-5 py-3"
                          >
                            <div className="w-9 h-9 bg-primary-50 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-bold text-primary-600">
                                {d.name.charAt(0)}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm text-brand-text-primary truncate">
                                {d.name}
                              </div>
                              <div className="text-xs text-brand-text-secondary">
                                CNH: {d.licenseNumber ?? "—"} • Cat.{" "}
                                {d.licenseCategory}
                              </div>
                            </div>
                            {isExpiringSoon && (
                              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-warning-50 text-warning-700">
                                Vencendo
                              </span>
                            )}
                            {expiry && (
                              <span className="text-xs text-brand-text-secondary">
                                {format(expiry, "MM/yyyy")}
                              </span>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-brand-border shadow-card overflow-hidden">
                    <div className="px-5 py-4 border-b border-brand-border">
                      <h3 className="font-semibold text-brand-text-primary">
                        Frota Atual
                      </h3>
                    </div>
                    <div className="divide-y divide-brand-border/50">
                      {vehicles.slice(0, 10).map((v: any, i) => (
                        <motion.div
                          key={v.id}
                          initial={{ opacity: 0, x: 8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className="flex items-center gap-3 px-5 py-3"
                        >
                          <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Truck className="w-4 h-4 text-slate-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-mono font-bold text-sm text-brand-text-primary">
                              {v.plate}
                            </div>
                            <div className="text-xs text-brand-text-secondary">
                              {v.brand} {v.model}
                            </div>
                          </div>
                          <span
                            className={cn(
                              "text-xs font-semibold px-2 py-0.5 rounded-full",
                              v.status === "ACTIVE"
                                ? "bg-success-50 text-success-700"
                                : v.status === "MAINTENANCE"
                                  ? "bg-warning-50 text-warning-700"
                                  : "bg-slate-100 text-slate-600",
                            )}
                          >
                            {v.status === "ACTIVE"
                              ? "Ativo"
                              : v.status === "MAINTENANCE"
                                ? "Manutenção"
                                : "Inativo"}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {tab === "conferencia" && (
              <motion.div
                key="conferencia"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-5"
              >
                <div className="bg-white rounded-2xl border border-brand-border shadow-card p-5">
                  <h3 className="font-semibold text-brand-text-primary mb-3">
                    Conferência Planilha x Estoque
                  </h3>
                  <p className="text-sm text-brand-text-secondary mb-4">
                    Envie a planilha com a aba ARMAZÉM para comparar quantidades
                    da planilha com o estoque atual do sistema.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={(e) =>
                        setSheetFile(e.target.files?.[0] ?? null)
                      }
                      className="text-sm"
                    />
                    <Button
                      onClick={() =>
                        sheetFile && reconciliationMutation.mutate(sheetFile)
                      }
                      disabled={!sheetFile || reconciliationMutation.isPending}
                      className="gap-2"
                    >
                      {reconciliationMutation.isPending
                        ? "Processando..."
                        : "Executar Conferência"}
                    </Button>
                  </div>

                  {reconciliationMutation.isError && (
                    <div className="mt-4 rounded-xl border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700">
                      Falha ao processar planilha:{" "}
                      {reconciliationMutation.error.message}
                    </div>
                  )}
                </div>

                {reconciliation && (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                      {[
                        {
                          label: "Itens Planilha",
                          value: reconciliation.summary.sheetItems,
                          color: "bg-primary-50 text-primary-700",
                        },
                        {
                          label: "Itens Sistema",
                          value: reconciliation.summary.systemItems,
                          color: "bg-slate-50 text-slate-700",
                        },
                        {
                          label: "Conferidos",
                          value: reconciliation.summary.matched,
                          color: "bg-success-50 text-success-700",
                        },
                        {
                          label: "Divergentes",
                          value: reconciliation.summary.divergent,
                          color: "bg-warning-50 text-warning-700",
                        },
                        {
                          label: "Faltam no Sistema",
                          value: reconciliation.summary.missingInSystem,
                          color: "bg-danger-50 text-danger-700",
                        },
                        {
                          label: "Faltam na Planilha",
                          value: reconciliation.summary.missingInSheet,
                          color: "bg-primary-50 text-primary-700",
                        },
                      ].map((kpi) => (
                        <div
                          key={kpi.label}
                          className="bg-white rounded-2xl border border-brand-border shadow-card p-4"
                        >
                          <div
                            className={cn(
                              "inline-flex rounded-full px-2 py-1 text-xs font-semibold mb-2",
                              kpi.color,
                            )}
                          >
                            {kpi.label}
                          </div>
                          <div className="text-2xl font-bold text-brand-text-primary">
                            {kpi.value.toLocaleString("pt-BR")}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-white rounded-2xl border border-brand-border shadow-card overflow-hidden">
                      <div className="px-5 py-4 border-b border-brand-border flex items-center justify-between">
                        <h3 className="font-semibold text-brand-text-primary">
                          Resultado da Conferência
                        </h3>
                        <span className="text-xs text-brand-text-secondary">
                          Gerado em{" "}
                          {format(
                            parseISO(reconciliation.generatedAt),
                            "dd/MM/yyyy HH:mm",
                          )}
                        </span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead className="bg-brand-bg border-b border-brand-border">
                            <tr>
                              {[
                                "Produto",
                                "Planilha",
                                "Sistema",
                                "Diferença",
                                "Status",
                              ].map((h) => (
                                <th
                                  key={h}
                                  className="text-left px-4 py-3 text-xs font-semibold text-brand-text-secondary uppercase tracking-wide"
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-brand-border/50">
                            {reconciliation.rows.map((row, i) => (
                              <tr
                                key={`${row.productName}-${i}`}
                                className="hover:bg-slate-50/60 transition-colors"
                              >
                                <td className="px-4 py-2.5 text-brand-text-primary font-semibold">
                                  {row.productName}
                                </td>
                                <td className="px-4 py-2.5 text-brand-text-secondary">
                                  {row.sheetQuantity.toLocaleString("pt-BR", {
                                    maximumFractionDigits: 3,
                                  })}
                                </td>
                                <td className="px-4 py-2.5 text-brand-text-secondary">
                                  {row.systemQuantity.toLocaleString("pt-BR", {
                                    maximumFractionDigits: 3,
                                  })}
                                </td>
                                <td
                                  className={cn(
                                    "px-4 py-2.5 font-semibold",
                                    Math.abs(row.difference) < 0.0005
                                      ? "text-success-700"
                                      : "text-warning-700",
                                  )}
                                >
                                  {row.difference.toLocaleString("pt-BR", {
                                    maximumFractionDigits: 3,
                                  })}
                                </td>
                                <td className="px-4 py-2.5">
                                  <span
                                    className={cn(
                                      "text-xs font-semibold px-2 py-0.5 rounded-full",
                                      reconStatusColor[row.status],
                                    )}
                                  >
                                    {reconStatusLabel[row.status]}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
