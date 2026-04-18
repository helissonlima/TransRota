"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Users,
  AlertTriangle,
  Phone,
  MapPin,
  Route,
  X,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  User,
  FileText,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { differenceInDays, parseISO, format } from "date-fns";
import api from "@/lib/api";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { DriverStatusBadge, LicenseCategoryBadge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { DetailPanel } from "@/components/ui/detail-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { ViewToggle, type ViewMode } from "@/components/ui/view-toggle";
import { cn } from "@/lib/cn";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Driver {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiry: string;
  status: string;
  birthDate?: string;
  rg?: string;
  rgIssuingOrg?: string;
  rgIssuingState?: string;
  nationality?: string;
  filiation?: string;
  licenseFirstDate?: string;
  licenseIssueDate?: string;
  licenseIssuingOrg?: string;
  licenseIssuingState?: string;
  licenseRegistrationNumber?: string;
  branch?: { id: string; name: string };
  _count: { routes: number };
}

// ─── Constants ────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-orange-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-amber-500",
  "bg-indigo-500",
];

const LICENSE_CATEGORIES = ["A", "B", "C", "D", "E", "AB", "AC", "AD", "AE"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getAvatarColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function maskCPF(cpf: string) {
  const d = cpf.replace(/\D/g, "");
  return d.length === 11 ? `${d.slice(0, 3)}.***.***-${d.slice(9)}` : cpf;
}

function applyMaskCPF(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

function applyMaskPhone(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10)
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function applyMaskCNH(value: string) {
  return value.replace(/\D/g, "").slice(0, 11);
}

// ─── ExpiryCountdown ──────────────────────────────────────────────────────────

function ExpiryCountdown({ expiryDate }: { expiryDate: string }) {
  const days = differenceInDays(parseISO(expiryDate), new Date());
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-xs font-medium",
        days < 0
          ? "text-danger-600"
          : days <= 30
            ? "text-danger-500"
            : days <= 60
              ? "text-warning-600"
              : "text-brand-text-secondary",
      )}
    >
      {days <= 30 && <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0" />}
      <span>
        {days < 0
          ? `Vencida há ${Math.abs(days)} dias`
          : days === 0
            ? "Vence hoje!"
            : `${days} dias restantes`}
      </span>
    </div>
  );
}

// ─── FormSection (accordion) ──────────────────────────────────────────────────

function FormSection({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-brand-border rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-brand-text-primary">
          <Icon className="w-4 h-4 text-primary-600" />
          {title}
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-brand-text-secondary" />
        ) : (
          <ChevronDown className="w-4 h-4 text-brand-text-secondary" />
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 grid grid-cols-2 gap-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const driverSchema = z.object({
  // Obrigatórios
  name: z.string().min(3, "Nome obrigatório"),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido"),
  phone: z.string().regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, "Telefone inválido"),
  licenseNumber: z
    .string()
    .regex(/^\d{11}$/, "CNH deve ter exatamente 11 dígitos"),
  licenseCategory: z.string().min(1, "Categoria obrigatória"),
  licenseExpiry: z.string().min(1, "Validade obrigatória"),
  // Dados pessoais — opcionais
  birthDate: z.string().optional(),
  rg: z.string().optional(),
  rgIssuingOrg: z.string().optional(),
  rgIssuingState: z.string().optional(),
  nationality: z.string().optional(),
  filiation: z.string().optional(),
  // Dados CNH — opcionais
  licenseFirstDate: z.string().optional(),
  licenseIssueDate: z.string().optional(),
  licenseIssuingOrg: z.string().optional(),
  licenseIssuingState: z.string().optional(),
  licenseRegistrationNumber: z.string().optional(),
});

type DriverFormData = z.infer<typeof driverSchema>;

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DriversPage() {
  const qc = useQueryClient();
  const [headerSearch, setHeaderSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Driver | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<
    "name-asc" | "name-desc" | "expiry-asc" | "routes-desc"
  >("name-asc");

  useEffect(() => {
    const tenantId = localStorage.getItem("tenantId") ?? "";
    const sortKey = tenantId ? `sort:drivers:${tenantId}` : "sort:drivers";
    const savedSort = localStorage.getItem(sortKey);
    if (
      savedSort === "name-asc" ||
      savedSort === "name-desc" ||
      savedSort === "expiry-asc" ||
      savedSort === "routes-desc"
    ) {
      setSortBy(savedSort);
    }
  }, []);

  useEffect(() => {
    const tenantId = localStorage.getItem("tenantId") ?? "";
    const sortKey = tenantId ? `sort:drivers:${tenantId}` : "sort:drivers";
    localStorage.setItem(sortKey, sortBy);
  }, [sortBy]);

  useEffect(() => {
    const tenantId = localStorage.getItem("tenantId") ?? "";
    const sharedKey = tenantId
      ? `view-mode:fleet-drivers:${tenantId}`
      : "view-mode:fleet-drivers";
    const legacyKey = tenantId
      ? `view-mode:drivers:${tenantId}`
      : "view-mode:drivers";
    const saved =
      localStorage.getItem(sharedKey) ?? localStorage.getItem(legacyKey);
    if (saved === "grid" || saved === "list")
      localStorage.setItem(sharedKey, saved);
    if (saved === "grid" || saved === "list") setViewMode(saved);
  }, []);

  useEffect(() => {
    const tenantId = localStorage.getItem("tenantId") ?? "";
    const sharedKey = tenantId
      ? `view-mode:fleet-drivers:${tenantId}`
      : "view-mode:fleet-drivers";
    localStorage.setItem(sharedKey, viewMode);
  }, [viewMode]);

  const { data: drivers = [], isLoading } = useQuery<Driver[]>({
    queryKey: ["drivers", statusFilter],
    queryFn: () =>
      api
        .get("/drivers", { params: { status: statusFilter || undefined } })
        .then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: DriverFormData) => api.post("/drivers", data),
    onSuccess: () => {
      toast.success("Motorista cadastrado com sucesso!");
      qc.invalidateQueries({ queryKey: ["drivers"] });
      setModalOpen(false);
      reset();
    },
    onError: (e: any) =>
      toast.error(e?.response?.data?.message ?? "Erro ao cadastrar motorista."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/drivers/${id}`),
    onSuccess: () => {
      toast.success("Motorista desativado com sucesso!");
      qc.invalidateQueries({ queryKey: ["drivers"] });
      setSelected(null);
    },
    onError: (e: any) =>
      toast.error(e?.response?.data?.message ?? "Erro ao desativar motorista."),
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DriverFormData>({
    resolver: zodResolver(driverSchema),
  });

  const cpfVal = watch("cpf") ?? "";
  const phoneVal = watch("phone") ?? "";
  const cnhVal = watch("licenseNumber") ?? "";

  const filtered = drivers.filter((d) =>
    [d.name, d.cpf, d.licenseNumber].some((s) =>
      s.toLowerCase().includes(headerSearch.toLowerCase()),
    ),
  );

  const sortedFiltered = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "name-desc":
        return b.name.localeCompare(a.name, "pt-BR");
      case "expiry-asc":
        return (
          parseISO(a.licenseExpiry).getTime() -
          parseISO(b.licenseExpiry).getTime()
        );
      case "routes-desc":
        return b._count.routes - a._count.routes;
      case "name-asc":
      default:
        return a.name.localeCompare(b.name, "pt-BR");
    }
  });

  const expiringDrivers = drivers.filter((d) => {
    const days = differenceInDays(parseISO(d.licenseExpiry), new Date());
    return days <= 30 && d.status === "ACTIVE";
  });

  const FILTER_TABS = [
    { key: "", label: "Todos", count: drivers.length },
    {
      key: "ACTIVE",
      label: "Ativos",
      count: drivers.filter((d) => d.status === "ACTIVE").length,
    },
    {
      key: "INACTIVE",
      label: "Inativos",
      count: drivers.filter((d) => d.status === "INACTIVE").length,
    },
    {
      key: "SUSPENDED",
      label: "Suspensos",
      count: drivers.filter((d) => d.status === "SUSPENDED").length,
    },
  ];

  function Field({
    label,
    required,
    span2,
    children,
  }: {
    label: string;
    required?: boolean;
    span2?: boolean;
    children: React.ReactNode;
  }) {
    return (
      <div className={span2 ? "col-span-2" : ""}>
        <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">
          {label}
          {required && " *"}
        </label>
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Motoristas"
        breadcrumbs={[{ label: "Motoristas" }]}
        searchQuery={headerSearch}
        onSearchQueryChange={setHeaderSearch}
        searchPlaceholder="Buscar nome, CPF ou CNH..."
      />

      <div className="p-6 space-y-5 max-w-[1600px] mx-auto">
        {/* Expiring alert */}
        <AnimatePresence>
          {expiringDrivers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-start gap-4 p-4 bg-warning-50 border border-warning-200 rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-warning-500/20 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-warning-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-warning-800 text-sm">
                    {expiringDrivers.length} motorista(s) com CNH vencendo em
                    breve ou vencida
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {expiringDrivers.slice(0, 5).map((d) => (
                      <button
                        key={d.id}
                        onClick={() => setSelected(d)}
                        className="flex items-center gap-1.5 bg-white/60 hover:bg-white rounded-lg px-2.5 py-1 text-xs font-medium text-warning-800 border border-warning-200 transition-colors"
                      >
                        <span
                          className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-white text-2xs font-bold",
                            getAvatarColor(d.name),
                          )}
                        >
                          {getInitials(d.name)}
                        </span>
                        {d.name.split(" ")[0]}
                      </button>
                    ))}
                    {expiringDrivers.length > 5 && (
                      <span className="text-xs text-warning-700 self-center">
                        +{expiringDrivers.length - 5} mais
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center bg-white border border-brand-border rounded-xl p-1 gap-0.5">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5",
                  statusFilter === tab.key
                    ? "bg-primary-600 text-white shadow-sm"
                    : "text-brand-text-secondary hover:text-brand-text-primary hover:bg-slate-50",
                )}
              >
                {tab.label}
                <span
                  className={cn(
                    "text-2xs font-bold px-1.5 py-0.5 rounded-full",
                    statusFilter === tab.key
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-brand-text-secondary",
                  )}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white border border-brand-border rounded-xl px-3 py-1.5">
              <label
                htmlFor="drivers-sort"
                className="text-xs font-medium text-brand-text-secondary"
              >
                Ordenar:
              </label>
              <select
                id="drivers-sort"
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as
                      | "name-asc"
                      | "name-desc"
                      | "expiry-asc"
                      | "routes-desc",
                  )
                }
                className="bg-transparent text-sm font-medium text-brand-text-primary outline-none"
              >
                <option value="name-asc">Nome (A-Z)</option>
                <option value="name-desc">Nome (Z-A)</option>
                <option value="expiry-asc">CNH vencendo primeiro</option>
                <option value="routes-desc">Mais rotas</option>
              </select>
            </div>

            <ViewToggle mode={viewMode} onChange={setViewMode} />

            {selected && (
              <span className="hidden md:inline-flex text-xs font-medium text-brand-text-secondary bg-slate-100 px-2 py-1 rounded-md">
                Selecionado: {selected.name}
              </span>
            )}

            <Button
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setModalOpen(true)}
            >
              Cadastrar Motorista
            </Button>

            <Button
              size="sm"
              variant="secondary"
              leftIcon={<Pencil className="w-4 h-4" />}
              disabled={!selected}
              onClick={() => selected && setDetailOpen(true)}
            >
              Editar
            </Button>

            <Button
              size="sm"
              variant="danger"
              leftIcon={<Trash2 className="w-4 h-4" />}
              disabled={!selected}
              onClick={() => {
                if (!selected) return;
                if (confirm(`Deseja desativar o motorista ${selected.name}?`)) {
                  deleteMutation.mutate(selected.id);
                }
              }}
            >
              Excluir
            </Button>
          </div>
        </div>

        {/* Grid / List */}
        {isLoading ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-brand-border p-5 space-y-3"
                >
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
          ) : (
            <div className="bg-white rounded-2xl border border-brand-border overflow-hidden">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 px-5 py-4 border-b border-brand-border/50 last:border-b-0"
                >
                  <Skeleton className="w-9 h-9 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20 ml-auto" />
                </div>
              ))}
            </div>
          )
        ) : sortedFiltered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-brand-text-secondary"
          >
            <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <Users className="w-10 h-10 opacity-30" />
            </div>
            <p className="font-semibold">Nenhum motorista encontrado</p>
            <p className="text-sm mt-1 opacity-70">
              Tente ajustar os filtros ou cadastre um novo motorista.
            </p>
          </motion.div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            <AnimatePresence>
              {sortedFiltered.map((driver, i) => {
                const days = differenceInDays(
                  parseISO(driver.licenseExpiry),
                  new Date(),
                );
                const warn =
                  (days < 0 || days <= 30) && driver.status === "ACTIVE";

                return (
                  <motion.div
                    key={driver.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25, delay: i * 0.03 }}
                    whileHover={{ y: -3 }}
                    className={cn(
                      "bg-white rounded-2xl border shadow-card hover:shadow-card-hover transition-shadow cursor-pointer group",
                      selected?.id === driver.id &&
                        "ring-2 ring-primary-200 border-primary-500",
                      warn ? "border-warning-200" : "border-brand-border",
                    )}
                    onClick={() => {
                      setSelected(driver);
                      setDetailOpen(true);
                    }}
                  >
                    <div className="p-5 pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0",
                              getAvatarColor(driver.name),
                            )}
                          >
                            {getInitials(driver.name)}
                          </div>
                          <div>
                            <p className="font-semibold text-brand-text-primary text-sm leading-tight">
                              {driver.name}
                            </p>
                            <p className="text-xs text-brand-text-secondary font-mono mt-0.5">
                              {maskCPF(driver.cpf)}
                            </p>
                          </div>
                        </div>
                        <DriverStatusBadge status={driver.status} />
                      </div>
                    </div>

                    <div className="px-5 pb-4 space-y-2">
                      <div className="flex items-center gap-2 text-xs text-brand-text-secondary">
                        <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                        {driver.phone}
                      </div>
                      {driver.branch?.name && (
                        <div className="flex items-center gap-2 text-xs text-brand-text-secondary">
                          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                          {driver.branch.name}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-xs text-brand-text-secondary">
                        <Route className="w-3.5 h-3.5 flex-shrink-0" />
                        {driver._count.routes} rotas realizadas
                      </div>
                    </div>

                    <div
                      className={cn(
                        "px-5 py-3 rounded-b-2xl border-t flex items-center justify-between",
                        warn
                          ? "bg-warning-50/60 border-warning-100"
                          : "bg-slate-50/80 border-brand-border/50",
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <LicenseCategoryBadge
                          category={driver.licenseCategory}
                        />
                        <span className="text-xs text-brand-text-secondary font-mono">
                          {driver.licenseNumber}
                        </span>
                      </div>
                      <ExpiryCountdown expiryDate={driver.licenseExpiry} />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl border border-brand-border overflow-hidden"
          >
            {/* List header */}
            <div className="hidden md:grid grid-cols-[1fr_140px_140px_120px_100px_120px] gap-4 px-5 py-3 bg-slate-50/80 border-b border-brand-border/50 text-xs font-semibold text-brand-text-secondary uppercase tracking-wider">
              <span>Motorista</span>
              <span>Telefone</span>
              <span>CNH</span>
              <span>Filial</span>
              <span>Status</span>
              <span className="text-right">Validade</span>
            </div>
            <AnimatePresence>
              {sortedFiltered.map((driver, i) => {
                const days = differenceInDays(
                  parseISO(driver.licenseExpiry),
                  new Date(),
                );
                const warn =
                  (days < 0 || days <= 30) && driver.status === "ACTIVE";

                return (
                  <motion.div
                    key={driver.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: 0.2, delay: i * 0.02 }}
                    onClick={() => {
                      setSelected(driver);
                      setDetailOpen(true);
                    }}
                    className={cn(
                      "grid grid-cols-1 md:grid-cols-[1fr_140px_140px_120px_100px_120px] gap-2 md:gap-4 items-center px-5 py-3.5 border-b border-brand-border/30 last:border-b-0 cursor-pointer transition-colors hover:bg-slate-50/80",
                      selected?.id === driver.id && "bg-primary-50/50",
                      warn && "bg-warning-50/30",
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={cn(
                          "w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0",
                          getAvatarColor(driver.name),
                        )}
                      >
                        {getInitials(driver.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-brand-text-primary text-sm leading-tight truncate">
                          {driver.name}
                        </p>
                        <p className="text-xs text-brand-text-secondary font-mono">
                          {maskCPF(driver.cpf)}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs text-brand-text-secondary">
                      {driver.phone}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <LicenseCategoryBadge category={driver.licenseCategory} />
                      <span className="text-xs text-brand-text-secondary font-mono truncate">
                        {driver.licenseNumber}
                      </span>
                    </div>

                    <span className="text-xs text-brand-text-secondary truncate">
                      {driver.branch?.name ?? "—"}
                    </span>

                    <DriverStatusBadge status={driver.status} />

                    <div className="text-right">
                      <ExpiryCountdown expiryDate={driver.licenseExpiry} />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* ════ CREATE DRIVER MODAL ════ */}
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          reset();
        }}
        title="Novo Motorista"
        description="Preencha os dados do condutor. Campos com * são obrigatórios."
        size="xl"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setModalOpen(false);
                reset();
              }}
            >
              Cancelar
            </Button>
            <Button
              loading={createMutation.isPending}
              onClick={handleSubmit((d) => createMutation.mutate(d))}
            >
              Cadastrar Motorista
            </Button>
          </>
        }
      >
        <form className="space-y-3 max-h-[62vh] overflow-y-auto pr-1 scrollbar-thin">
          {/* ── Dados Principais ── */}
          <FormSection title="Dados Principais" icon={User} defaultOpen>
            <Field label="Nome Completo" required span2>
              <input
                {...register("name")}
                placeholder="Ex: Carlos Eduardo Silva"
                className={cn("input-base", errors.name && "border-danger-400")}
              />
              {errors.name && (
                <p className="text-danger-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </Field>

            <Field label="CPF" required>
              <input
                {...register("cpf")}
                value={cpfVal}
                onChange={(e) =>
                  setValue("cpf", applyMaskCPF(e.target.value), {
                    shouldValidate: true,
                  })
                }
                placeholder="000.000.000-00"
                maxLength={14}
                className={cn(
                  "input-base font-mono",
                  errors.cpf && "border-danger-400",
                )}
              />
              {errors.cpf && (
                <p className="text-danger-500 text-xs mt-1">
                  {errors.cpf.message}
                </p>
              )}
            </Field>

            <Field label="Telefone" required>
              <input
                {...register("phone")}
                value={phoneVal}
                onChange={(e) =>
                  setValue("phone", applyMaskPhone(e.target.value), {
                    shouldValidate: true,
                  })
                }
                placeholder="(11) 99999-9999"
                maxLength={15}
                className={cn(
                  "input-base",
                  errors.phone && "border-danger-400",
                )}
              />
              {errors.phone && (
                <p className="text-danger-500 text-xs mt-1">
                  {errors.phone.message}
                </p>
              )}
            </Field>

            <Field label="Data de Nascimento">
              <input
                {...register("birthDate")}
                type="date"
                className="input-base"
              />
            </Field>

            <Field label="Nacionalidade">
              <input
                {...register("nationality")}
                placeholder="Ex: BRASILEIRO(A)"
                className="input-base"
              />
            </Field>
          </FormSection>

          {/* ── RG / Identidade ── */}
          <FormSection
            title="Documento de Identidade (RG)"
            icon={FileText}
            defaultOpen={false}
          >
            <Field label="Nº do RG">
              <input
                {...register("rg")}
                placeholder="Ex: 16440124"
                className="input-base font-mono"
              />
            </Field>
            <Field label="Órgão Emissor">
              <input
                {...register("rgIssuingOrg")}
                placeholder="Ex: SSP, PCE"
                className="input-base"
              />
            </Field>
            <Field label="UF Emissor">
              <input
                {...register("rgIssuingState")}
                placeholder="Ex: MG"
                maxLength={2}
                className="input-base uppercase"
              />
            </Field>
            <Field label="Filiação" span2>
              <input
                {...register("filiation")}
                placeholder="Ex: João Silva / Maria Silva"
                className="input-base"
              />
            </Field>
          </FormSection>

          {/* ── CNH ── */}
          <FormSection
            title="Carteira Nacional de Habilitação (CNH)"
            icon={ShieldAlert}
            defaultOpen
          >
            <Field label="Número da CNH" required>
              <input
                {...register("licenseNumber")}
                value={cnhVal}
                onChange={(e) =>
                  setValue("licenseNumber", applyMaskCNH(e.target.value), {
                    shouldValidate: true,
                  })
                }
                placeholder="00000000000"
                maxLength={11}
                inputMode="numeric"
                className={cn(
                  "input-base font-mono",
                  errors.licenseNumber && "border-danger-400",
                )}
              />
              {errors.licenseNumber && (
                <p className="text-danger-500 text-xs mt-1">
                  {errors.licenseNumber.message}
                </p>
              )}
            </Field>

            <Field label="Nº de Registro">
              <input
                {...register("licenseRegistrationNumber")}
                placeholder="Nº registro CNH"
                className="input-base font-mono"
              />
            </Field>

            <Field label="Categoria" required>
              <select
                {...register("licenseCategory")}
                className={cn(
                  "input-base",
                  errors.licenseCategory && "border-danger-400",
                )}
              >
                <option value="">Selecionar...</option>
                {LICENSE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Validade da CNH" required>
              <input
                {...register("licenseExpiry")}
                type="date"
                className={cn(
                  "input-base",
                  errors.licenseExpiry && "border-danger-400",
                )}
              />
            </Field>

            <Field label="1ª Habilitação">
              <input
                {...register("licenseFirstDate")}
                type="date"
                className="input-base"
              />
            </Field>

            <Field label="Data de Emissão">
              <input
                {...register("licenseIssueDate")}
                type="date"
                className="input-base"
              />
            </Field>

            <Field label="Órgão Emissor CNH">
              <input
                {...register("licenseIssuingOrg")}
                placeholder="Ex: DETRAN"
                className="input-base"
              />
            </Field>

            <Field label="UF Emissão CNH">
              <input
                {...register("licenseIssuingState")}
                placeholder="Ex: MG"
                maxLength={2}
                className="input-base uppercase"
              />
            </Field>
          </FormSection>
        </form>
      </Modal>

      {/* ════ DRIVER DETAIL PANEL ════ */}
      {selected && (
        <DetailPanel
          open={detailOpen}
          onClose={() => setDetailOpen(false)}
          title={selected.name}
          subtitle={`CNH: ${selected.licenseNumber} (Cat. ${selected.licenseCategory})`}
          badges={[
            {
              label:
                selected.status === "ACTIVE"
                  ? "Ativo"
                  : selected.status === "ON_ROUTE"
                    ? "Em Rota"
                    : selected.status === "VACATION"
                      ? "Férias"
                      : "Inativo",
              variant:
                selected.status === "ACTIVE"
                  ? "success"
                  : selected.status === "ON_ROUTE"
                    ? "info"
                    : selected.status === "VACATION"
                      ? "warning"
                      : "gray",
            },
          ]}
          width="lg"
        >
          {/* Avatar header */}
          <div className="flex items-center gap-4 mb-2">
            <div
              className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0",
                getAvatarColor(selected.name),
              )}
            >
              {getInitials(selected.name)}
            </div>
            <div>
              <p className="font-bold text-lg text-slate-800">
                {selected.name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <DriverStatusBadge status={selected.status} />
                <LicenseCategoryBadge category={selected.licenseCategory} />
              </div>
            </div>
          </div>

          <DetailPanel.Section title="Dados Principais">
            <DetailPanel.Grid cols={2}>
              <DetailPanel.Field
                label="CPF"
                value={maskCPF(selected.cpf)}
                mono
              />
              <DetailPanel.Field label="Telefone" value={selected.phone} />
              <DetailPanel.Field label="Filial" value={selected.branch?.name} />
              <DetailPanel.Field
                label="Rotas"
                value={`${selected._count.routes} realizadas`}
              />
              {selected.birthDate && (
                <DetailPanel.Field
                  label="Nasc."
                  value={format(parseISO(selected.birthDate), "dd/MM/yyyy")}
                />
              )}
              {selected.nationality && (
                <DetailPanel.Field
                  label="Nacion."
                  value={selected.nationality}
                />
              )}
            </DetailPanel.Grid>
          </DetailPanel.Section>

          {(selected.rg || selected.filiation) && (
            <DetailPanel.Section title="Identidade">
              <DetailPanel.Grid cols={2}>
                {selected.rg && (
                  <DetailPanel.Field label="RG" value={selected.rg} mono />
                )}
                {(selected.rgIssuingOrg || selected.rgIssuingState) && (
                  <DetailPanel.Field
                    label="Org. Emiss."
                    value={
                      selected.rgIssuingOrg && selected.rgIssuingState
                        ? `${selected.rgIssuingOrg} / ${selected.rgIssuingState}`
                        : (selected.rgIssuingOrg ?? selected.rgIssuingState)
                    }
                  />
                )}
                {selected.filiation && (
                  <DetailPanel.Field
                    label="Filiação"
                    value={selected.filiation}
                  />
                )}
              </DetailPanel.Grid>
            </DetailPanel.Section>
          )}

          <DetailPanel.Section title="CNH">
            <DetailPanel.Grid cols={2}>
              <DetailPanel.Field
                label="Número"
                value={selected.licenseNumber}
                mono
              />
              <DetailPanel.Field
                label="Categoria"
                value={selected.licenseCategory}
              />
              {selected.licenseFirstDate && (
                <DetailPanel.Field
                  label="1ª Habilitação"
                  value={format(
                    parseISO(selected.licenseFirstDate),
                    "dd/MM/yyyy",
                  )}
                />
              )}
              {selected.licenseIssueDate && (
                <DetailPanel.Field
                  label="Emissão"
                  value={format(
                    parseISO(selected.licenseIssueDate),
                    "dd/MM/yyyy",
                  )}
                />
              )}
              <DetailPanel.Field
                label="Validade"
                value={format(parseISO(selected.licenseExpiry), "dd/MM/yyyy")}
              />
              {(selected.licenseIssuingOrg || selected.licenseIssuingState) && (
                <DetailPanel.Field
                  label="Org. Emiss."
                  value={
                    selected.licenseIssuingOrg && selected.licenseIssuingState
                      ? `${selected.licenseIssuingOrg} / ${selected.licenseIssuingState}`
                      : (selected.licenseIssuingOrg ??
                        selected.licenseIssuingState)
                  }
                />
              )}
            </DetailPanel.Grid>
            <div className="mt-3 bg-slate-50 rounded-xl p-3">
              <div className="text-xs text-slate-500 mb-1">Status da CNH</div>
              <ExpiryCountdown expiryDate={selected.licenseExpiry} />
            </div>
          </DetailPanel.Section>
        </DetailPanel>
      )}
    </div>
  );
}
