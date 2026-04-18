"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Receipt,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  Car,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCheck,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { format, parseISO, isPast, isAfter, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import api from "@/lib/api";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { EmptyStateCard, SkeletonRows } from "@/components/ui/state-feedback";
import {
  ViewModeToggle,
  VIEW_TOGGLE_PRESETS,
} from "@/components/ui/view-toggle";
import { cn } from "@/lib/cn";
import { usePersistedViewMode } from "@/lib/use-persisted-view-mode";
import { UX_CARD_SECTION, uxSelectableCardClass } from "@/lib/ux-card-presets";

type TaxType = "IPVA" | "LICENSING" | "INSURANCE" | "FINE" | "OTHER";
type PaymentStatus = "PENDING" | "PAID" | "OVERDUE" | "EXEMPT";

interface TaxRecord {
  id: string;
  type: TaxType;
  year: number;
  dueDate: string;
  value: number | string;
  paymentStatus: PaymentStatus;
  notes?: string;
  paidAt?: string;
  paidValue?: number | string;
  vehicle: { id: string; plate: string; model: string; brand: string };
}

interface Vehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
}

interface TaxSummary {
  totalPending: number;
  pendingValue: number;
  totalPaid: number;
  paidValue: number;
  totalOverdue: number;
  overdueValue: number;
}

const taxSchema = z.object({
  vehicleId: z.string().min(1, "Veículo obrigatório"),
  type: z.enum(["IPVA", "LICENSING", "INSURANCE", "FINE", "OTHER"]),
  year: z.coerce.number().min(2000).max(2099, "Ano inválido"),
  dueDate: z.string().min(1, "Data de vencimento obrigatória"),
  value: z.coerce.number().min(0.01, "Valor inválido"),
  notes: z.string().optional(),
});

type TaxFormData = z.infer<typeof taxSchema>;

const TYPE_CONFIG: Record<
  TaxType,
  { label: string; variant: "info" | "warning" | "success" | "danger" | "gray" }
> = {
  IPVA: { label: "IPVA", variant: "info" },
  LICENSING: { label: "Licenciamento", variant: "warning" },
  INSURANCE: { label: "Seguro", variant: "success" },
  FINE: { label: "Multa", variant: "danger" },
  OTHER: { label: "Outro", variant: "gray" },
};

const STATUS_CONFIG: Record<
  PaymentStatus,
  {
    label: string;
    variant: "warning" | "success" | "danger" | "gray";
  }
> = {
  PENDING: { label: "Pendente", variant: "warning" },
  PAID: { label: "Pago", variant: "success" },
  OVERDUE: { label: "Vencido", variant: "danger" },
  EXEMPT: { label: "Isento", variant: "gray" },
};

const FILTER_TABS = [
  { key: "", label: "Todos" },
  { key: "PENDING", label: "Pendentes" },
  { key: "PAID", label: "Pagos" },
  { key: "OVERDUE", label: "Vencidos" },
] as const;

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function toMoney(value: number | string | null | undefined): number {
  if (value === null || value === undefined) return 0;
  const parsed = typeof value === "number" ? value : Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function FiscalPage() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<PaymentStatus | "">("");
  const [modalOpen, setModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [payConfirmId, setPayConfirmId] = useState<string | null>(null);
  const [selectedTax, setSelectedTax] = useState<TaxRecord | null>(null);
  const [editingTaxId, setEditingTaxId] = useState<string | null>(null);
  const [viewMode, setViewMode] = usePersistedViewMode<"table" | "cards">({
    defaultMode: "table",
    allowedModes: ["table", "cards"],
    storageKeyBase: "view-mode:fiscal",
  });

  const { data: taxes = [], isLoading } = useQuery<TaxRecord[]>({
    queryKey: ["taxes", filter],
    queryFn: () =>
      api
        .get("/taxes", { params: { paymentStatus: filter || undefined } })
        .then((r) => r.data),
  });

  const { data: vehicles = [] } = useQuery<Vehicle[]>({
    queryKey: ["vehicles-select"],
    queryFn: () =>
      api
        .get("/vehicles", { params: { limit: 200 } })
        .then((r) => r.data?.vehicles ?? r.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: TaxFormData) => api.post("/taxes", data),
    onSuccess: () => {
      toast.success("Lançamento criado com sucesso!");
      qc.invalidateQueries({ queryKey: ["taxes"] });
      setModalOpen(false);
      reset();
    },
    onError: () => toast.error("Erro ao criar lançamento."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TaxFormData }) =>
      api.patch(`/taxes/${id}`, data),
    onSuccess: () => {
      toast.success("Lançamento atualizado com sucesso!");
      qc.invalidateQueries({ queryKey: ["taxes"] });
      setModalOpen(false);
      setEditingTaxId(null);
      reset();
    },
    onError: () => toast.error("Erro ao atualizar lançamento."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/taxes/${id}`),
    onSuccess: () => {
      toast.success("Lançamento excluído com sucesso!");
      qc.invalidateQueries({ queryKey: ["taxes"] });
      setSelectedTax(null);
      setDetailOpen(false);
    },
    onError: () => toast.error("Erro ao excluir lançamento."),
  });

  const payMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/taxes/${id}/pay`),
    onSuccess: () => {
      toast.success("Lançamento marcado como pago!");
      qc.invalidateQueries({ queryKey: ["taxes"] });
      setPayConfirmId(null);
    },
    onError: () => toast.error("Erro ao registrar pagamento."),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaxFormData>({
    resolver: zodResolver(taxSchema),
    defaultValues: {
      type: "IPVA" as TaxType,
      year: new Date().getFullYear(),
      vehicleId: "",
      dueDate: "",
      value: 0,
      notes: "",
    },
  });

  // Compute summary from taxes list
  const summary: TaxSummary = taxes.reduce(
    (acc, t) => {
      if (t.paymentStatus === "PENDING") {
        acc.totalPending++;
        acc.pendingValue += toMoney(t.value);
      } else if (t.paymentStatus === "PAID") {
        acc.totalPaid++;
        acc.paidValue += toMoney(t.paidValue ?? t.value);
      } else if (t.paymentStatus === "OVERDUE") {
        acc.totalOverdue++;
        acc.overdueValue += toMoney(t.value);
      }
      return acc;
    },
    {
      totalPending: 0,
      pendingValue: 0,
      totalPaid: 0,
      paidValue: 0,
      totalOverdue: 0,
      overdueValue: 0,
    },
  );

  const overdueItems = taxes.filter((t) => t.paymentStatus === "OVERDUE");
  const selectedTaxResolved = selectedTax
    ? (taxes.find((t) => t.id === selectedTax.id) ?? selectedTax)
    : null;

  return (
    <div className="min-h-screen">
      <Header
        title="Financeiro Fiscal"
        breadcrumbs={[{ label: "Financeiro Fiscal" }]}
      />

      <div className="p-6 space-y-5 max-w-[1600px] mx-auto">
        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="bg-white rounded-2xl border border-brand-border shadow-card p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-warning-50 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-warning-500" />
              </div>
              <span className="text-sm font-semibold text-brand-text-secondary">
                Pendentes
              </span>
            </div>
            <div className="text-2xl font-bold text-brand-text-primary">
              {summary.totalPending}
            </div>
            <div className="text-sm text-brand-text-secondary mt-1">
              {formatCurrency(summary.pendingValue)}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-2xl border border-brand-border shadow-card p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-success-50 rounded-xl flex items-center justify-center">
                <CheckCheck className="w-5 h-5 text-success-500" />
              </div>
              <span className="text-sm font-semibold text-brand-text-secondary">
                Pagos
              </span>
            </div>
            <div className="text-2xl font-bold text-brand-text-primary">
              {summary.totalPaid}
            </div>
            <div className="text-sm text-brand-text-secondary mt-1">
              {formatCurrency(summary.paidValue)}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-brand-border shadow-card p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-danger-50 rounded-xl flex items-center justify-center relative">
                <AlertTriangle className="w-5 h-5 text-danger-500" />
                {summary.totalOverdue > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-danger-500 rounded-full animate-pulse" />
                )}
              </div>
              <span className="text-sm font-semibold text-brand-text-secondary">
                Vencidos
              </span>
            </div>
            <div className="text-2xl font-bold text-danger-600">
              {summary.totalOverdue}
            </div>
            <div className="text-sm text-danger-500 mt-1">
              {formatCurrency(summary.overdueValue)}
            </div>
          </motion.div>
        </div>

        {/* Overdue alert */}
        <AnimatePresence>
          {overdueItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-danger-50 border border-danger-200 rounded-xl p-4 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-danger-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-danger-700">
                  {overdueItems.length} lançamento
                  {overdueItems.length > 1 ? "s" : ""} vencido
                  {overdueItems.length > 1 ? "s" : ""}
                </p>
                <p className="text-xs text-danger-600 mt-0.5">
                  Total em atraso: {formatCurrency(summary.overdueValue)} —
                  regularize o quanto antes para evitar multas adicionais.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1 bg-white border border-brand-border rounded-xl p-1 w-fit">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as PaymentStatus | "")}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  filter === tab.key
                    ? "bg-primary-600 text-white shadow-sm"
                    : "text-brand-text-secondary hover:text-brand-text-primary hover:bg-slate-50",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {selectedTaxResolved && (
              <span className="hidden md:inline-flex text-xs font-medium text-brand-text-secondary bg-slate-100 px-2 py-1 rounded-md">
                Selecionado: {selectedTaxResolved.vehicle.plate}
              </span>
            )}
            <ViewModeToggle
              mode={viewMode}
              onChange={setViewMode}
              options={VIEW_TOGGLE_PRESETS.tableCards}
            />
            <Button
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setEditingTaxId(null);
                reset({
                  type: "IPVA",
                  year: new Date().getFullYear(),
                  vehicleId: "",
                  dueDate: "",
                  value: undefined as any,
                  notes: "",
                });
                setModalOpen(true);
              }}
            >
              Novo Lançamento
            </Button>
            <Button
              size="sm"
              variant="secondary"
              leftIcon={<Pencil className="w-4 h-4" />}
              disabled={!selectedTaxResolved}
              onClick={() => {
                if (!selectedTaxResolved) return;
                setEditingTaxId(selectedTaxResolved.id);
                reset({
                  vehicleId: selectedTaxResolved.vehicle.id,
                  type: selectedTaxResolved.type,
                  year: selectedTaxResolved.year,
                  dueDate: selectedTaxResolved.dueDate?.slice(0, 10),
                  value: Number(selectedTaxResolved.value),
                  notes: selectedTaxResolved.notes,
                });
                setModalOpen(true);
              }}
            >
              Editar
            </Button>
            <Button
              size="sm"
              variant="danger"
              leftIcon={<Trash2 className="w-4 h-4" />}
              disabled={!selectedTaxResolved || deleteMutation.isPending}
              onClick={() => {
                if (!selectedTaxResolved) return;
                if (
                  confirm(
                    `Deseja excluir o lançamento ${TYPE_CONFIG[selectedTaxResolved.type].label} do veículo ${selectedTaxResolved.vehicle.plate}?`,
                  )
                ) {
                  deleteMutation.mutate(selectedTaxResolved.id);
                }
              }}
            >
              Excluir
            </Button>
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-brand-border shadow-card p-4">
            <SkeletonRows rows={5} rowClassName="h-12 w-full" />
          </div>
        ) : taxes.length === 0 ? (
          <EmptyStateCard
            icon={Receipt}
            title="Nenhum lançamento encontrado"
            description={
              filter
                ? "Tente mudar o filtro."
                : "Cadastre IPVA, licenciamentos e outros impostos."
            }
            action={
              <Button
                size="sm"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => setModalOpen(true)}
              >
                Novo Lançamento
              </Button>
            }
            className="py-20 bg-white border-brand-border shadow-card border-solid"
          />
        ) : viewMode === "table" ? (
          <div className="bg-white rounded-2xl border border-brand-border shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-brand-border bg-slate-50/80">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-brand-text-secondary uppercase tracking-wide">
                      Veículo
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-brand-text-secondary uppercase tracking-wide">
                      Tipo
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-brand-text-secondary uppercase tracking-wide">
                      Ano
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-brand-text-secondary uppercase tracking-wide">
                      Vencimento
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-brand-text-secondary uppercase tracking-wide">
                      Valor
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-brand-text-secondary uppercase tracking-wide">
                      Status
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-brand-text-secondary uppercase tracking-wide">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/50">
                  {taxes.map((tax, i) => {
                    const typeConfig = TYPE_CONFIG[tax.type];
                    const statusConfig = STATUS_CONFIG[tax.paymentStatus];
                    return (
                      <motion.tr
                        key={tax.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: i * 0.03 }}
                        className={cn(
                          "hover:bg-slate-50/60 transition-colors cursor-pointer",
                          tax.paymentStatus === "OVERDUE" && "bg-danger-50/30",
                          selectedTaxResolved?.id === tax.id &&
                            "bg-primary-50/40",
                        )}
                        onClick={() => {
                          setSelectedTax(tax);
                          setDetailOpen(true);
                        }}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Car className="w-3.5 h-3.5 text-brand-text-secondary" />
                            </div>
                            <div>
                              <div className="font-mono font-bold text-brand-text-primary">
                                {tax.vehicle.plate}
                              </div>
                              <div className="text-xs text-brand-text-secondary">
                                {tax.vehicle.brand} {tax.vehicle.model}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={typeConfig.variant}>
                            {typeConfig.label}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-center text-brand-text-secondary font-mono">
                          {tax.year}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "text-sm",
                              tax.paymentStatus === "OVERDUE"
                                ? "text-danger-600 font-semibold"
                                : "text-brand-text-secondary",
                            )}
                          >
                            {tax.dueDate
                              ? format(parseISO(tax.dueDate), "dd/MM/yyyy")
                              : "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-brand-text-primary">
                          {formatCurrency(Number(tax.value))}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant={statusConfig.variant} dot>
                            {statusConfig.label}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {tax.paymentStatus !== "PAID" &&
                            tax.paymentStatus !== "EXEMPT" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTax(tax);
                                  setPayConfirmId(tax.id);
                                }}
                                className="text-xs text-success-600 hover:text-success-700 font-semibold flex items-center gap-1 mx-auto hover:bg-success-50 px-2 py-1 rounded-lg transition-colors"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Pagar
                              </button>
                            )}
                          {tax.paymentStatus === "PAID" && (
                            <span className="text-xs text-brand-text-secondary">
                              {tax.paidAt
                                ? format(parseISO(tax.paidAt), "dd/MM/yy")
                                : "Pago"}
                            </span>
                          )}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {taxes.map((tax, i) => {
              const typeConfig = TYPE_CONFIG[tax.type];
              const statusConfig = STATUS_CONFIG[tax.paymentStatus];
              return (
                <motion.button
                  key={tax.id}
                  type="button"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                  onClick={() => {
                    setSelectedTax(tax);
                    setDetailOpen(true);
                  }}
                  className={uxSelectableCardClass({
                    selected: selectedTaxResolved?.id === tax.id,
                    tone:
                      tax.paymentStatus === "OVERDUE" ? "danger" : "default",
                  })}
                >
                  <div className={UX_CARD_SECTION.header}>
                    <div className="min-w-0">
                      <p className="text-sm font-mono font-bold text-brand-text-primary">
                        {tax.vehicle.plate}
                      </p>
                      <p className="text-xs text-brand-text-secondary truncate">
                        {tax.vehicle.brand} {tax.vehicle.model}
                      </p>
                    </div>
                    <Badge variant={statusConfig.variant} dot>
                      {statusConfig.label}
                    </Badge>
                  </div>

                  <div className={UX_CARD_SECTION.metaGrid}>
                    <div className={UX_CARD_SECTION.metricMuted}>
                      <p className="text-brand-text-secondary">Tipo</p>
                      <p className="font-semibold text-brand-text-primary">
                        {typeConfig.label}
                      </p>
                    </div>
                    <div className={UX_CARD_SECTION.metricMuted}>
                      <p className="text-brand-text-secondary">Ano</p>
                      <p className="font-semibold text-brand-text-primary font-mono">
                        {tax.year}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-brand-text-secondary">
                        Vencimento
                      </p>
                      <p
                        className={cn(
                          "text-sm font-semibold",
                          tax.paymentStatus === "OVERDUE"
                            ? "text-danger-600"
                            : "text-brand-text-primary",
                        )}
                      >
                        {tax.dueDate
                          ? format(parseISO(tax.dueDate), "dd/MM/yyyy")
                          : "—"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-brand-text-secondary">Valor</p>
                      <p className="text-sm font-bold text-brand-text-primary">
                        {formatCurrency(Number(tax.value))}
                      </p>
                    </div>
                  </div>

                  {tax.paymentStatus !== "PAID" &&
                    tax.paymentStatus !== "EXEMPT" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTax(tax);
                          setPayConfirmId(tax.id);
                        }}
                        className="mt-3 w-full text-xs text-success-700 hover:text-success-800 font-semibold bg-success-50 hover:bg-success-100 rounded-lg py-2 transition-colors"
                      >
                        Marcar como pago
                      </button>
                    )}
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      {/* Tax Detail Modal */}
      {selectedTaxResolved && (
        <Modal
          open={detailOpen}
          onClose={() => setDetailOpen(false)}
          title={`${TYPE_CONFIG[selectedTaxResolved.type].label} • ${selectedTaxResolved.vehicle.plate}`}
          description={`${selectedTaxResolved.vehicle.brand} ${selectedTaxResolved.vehicle.model} • Ano ${selectedTaxResolved.year}`}
          size="lg"
          footer={
            <div className="w-full flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                {selectedTaxResolved.paymentStatus !== "PAID" &&
                  selectedTaxResolved.paymentStatus !== "EXEMPT" && (
                    <Button
                      size="sm"
                      loading={payMutation.isPending}
                      leftIcon={<CheckCircle2 className="w-4 h-4" />}
                      onClick={() => setPayConfirmId(selectedTaxResolved.id)}
                    >
                      Marcar como Pago
                    </Button>
                  )}
                <Button
                  size="sm"
                  variant="secondary"
                  leftIcon={<Pencil className="w-4 h-4" />}
                  onClick={() => {
                    setEditingTaxId(selectedTaxResolved.id);
                    reset({
                      vehicleId: selectedTaxResolved.vehicle.id,
                      type: selectedTaxResolved.type,
                      year: selectedTaxResolved.year,
                      dueDate: selectedTaxResolved.dueDate?.slice(0, 10),
                      value: Number(selectedTaxResolved.value),
                      notes: selectedTaxResolved.notes,
                    });
                    setDetailOpen(false);
                    setModalOpen(true);
                  }}
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  loading={deleteMutation.isPending}
                  leftIcon={<Trash2 className="w-4 h-4" />}
                  onClick={() => {
                    if (
                      confirm(
                        `Deseja excluir o lançamento ${TYPE_CONFIG[selectedTaxResolved.type].label} do veículo ${selectedTaxResolved.vehicle.plate}?`,
                      )
                    ) {
                      deleteMutation.mutate(selectedTaxResolved.id);
                    }
                  }}
                >
                  Excluir
                </Button>
              </div>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setDetailOpen(false)}
              >
                Fechar
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-xs text-brand-text-secondary mb-1">
                  Veículo
                </div>
                <div className="text-sm font-semibold text-brand-text-primary">
                  <span className="font-mono">
                    {selectedTaxResolved.vehicle.plate}
                  </span>
                  <span className="text-brand-text-secondary">
                    {" "}
                    — {selectedTaxResolved.vehicle.brand}{" "}
                    {selectedTaxResolved.vehicle.model}
                  </span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-xs text-brand-text-secondary mb-1">
                  Status
                </div>
                <Badge
                  variant={
                    STATUS_CONFIG[selectedTaxResolved.paymentStatus].variant
                  }
                  dot
                >
                  {STATUS_CONFIG[selectedTaxResolved.paymentStatus].label}
                </Badge>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-xs text-brand-text-secondary mb-1">
                  Tipo
                </div>
                <Badge variant={TYPE_CONFIG[selectedTaxResolved.type].variant}>
                  {TYPE_CONFIG[selectedTaxResolved.type].label}
                </Badge>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-xs text-brand-text-secondary mb-1">
                  Ano de Referência
                </div>
                <div className="text-sm font-semibold text-brand-text-primary">
                  {selectedTaxResolved.year}
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-xs text-brand-text-secondary mb-1">
                  Vencimento
                </div>
                <div
                  className={cn(
                    "text-sm font-semibold",
                    selectedTaxResolved.paymentStatus === "OVERDUE"
                      ? "text-danger-600"
                      : "text-brand-text-primary",
                  )}
                >
                  {selectedTaxResolved.dueDate
                    ? format(
                        parseISO(selectedTaxResolved.dueDate),
                        "dd 'de' MMMM 'de' yyyy",
                        { locale: ptBR },
                      )
                    : "—"}
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-xs text-brand-text-secondary mb-1">
                  Valor
                </div>
                <div className="text-sm font-semibold text-brand-text-primary">
                  {formatCurrency(Number(selectedTaxResolved.value))}
                </div>
              </div>
              {selectedTaxResolved.paidAt && (
                <div className="bg-success-50 rounded-xl p-3 border border-success-200 col-span-2">
                  <div className="text-xs text-success-700 mb-1">
                    Pagamento registrado em
                  </div>
                  <div className="text-sm font-semibold text-success-700">
                    {format(
                      parseISO(selectedTaxResolved.paidAt),
                      "dd/MM/yyyy 'às' HH:mm",
                      { locale: ptBR },
                    )}
                  </div>
                </div>
              )}
            </div>

            {selectedTaxResolved.notes && (
              <div className="bg-slate-50 rounded-xl p-3 border border-brand-border">
                <div className="text-xs text-brand-text-secondary mb-1">
                  Observações
                </div>
                <div className="text-sm text-brand-text-primary">
                  {selectedTaxResolved.notes}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* New Tax Modal */}
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTaxId(null);
          reset();
        }}
        title={
          editingTaxId ? "Editar Lançamento Fiscal" : "Novo Lançamento Fiscal"
        }
        description={
          editingTaxId
            ? "Atualize os dados do lançamento selecionado."
            : "Registre um imposto, licenciamento ou multa."
        }
        size="md"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setModalOpen(false);
                setEditingTaxId(null);
                reset();
              }}
            >
              Cancelar
            </Button>
            <Button
              loading={createMutation.isPending || updateMutation.isPending}
              onClick={handleSubmit(
                (d) => {
                  if (editingTaxId) {
                    updateMutation.mutate({ id: editingTaxId, data: d });
                    return;
                  }
                  createMutation.mutate(d);
                },
                () => toast.error("Preencha todos os campos obrigatórios"),
              )}
            >
              {editingTaxId ? "Salvar Alterações" : "Salvar"}
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">
              Veículo *
            </label>
            <select
              {...register("vehicleId")}
              className={cn(
                "input-base",
                errors.vehicleId && "border-danger-400",
              )}
            >
              <option value="">Selecione o veículo</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.plate} — {v.brand} {v.model}
                </option>
              ))}
            </select>
            {errors.vehicleId && (
              <p className="text-danger-500 text-xs mt-1">
                {errors.vehicleId.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">
                Tipo *
              </label>
              <select {...register("type")} className="input-base">
                {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
                  <option key={key} value={key}>
                    {cfg.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">
                Ano *
              </label>
              <input
                type="number"
                {...register("year")}
                placeholder={String(new Date().getFullYear())}
                className={cn("input-base", errors.year && "border-danger-400")}
              />
              {errors.year && (
                <p className="text-danger-500 text-xs mt-1">
                  {errors.year.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">
                Vencimento *
              </label>
              <input
                type="date"
                {...register("dueDate")}
                className={cn(
                  "input-base",
                  errors.dueDate && "border-danger-400",
                )}
              />
              {errors.dueDate && (
                <p className="text-danger-500 text-xs mt-1">
                  {errors.dueDate.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">
                Valor (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                {...register("value")}
                placeholder="0,00"
                className={cn(
                  "input-base",
                  errors.value && "border-danger-400",
                )}
              />
              {errors.value && (
                <p className="text-danger-500 text-xs mt-1">
                  {errors.value.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">
              Observações
            </label>
            <textarea
              {...register("notes")}
              placeholder="Referência, processo, etc."
              rows={2}
              className="input-base resize-none"
            />
          </div>
        </form>
      </Modal>

      {/* Pay Confirmation Modal */}
      <Modal
        open={!!payConfirmId}
        onClose={() => setPayConfirmId(null)}
        title="Confirmar Pagamento"
        description="Esta ação marcará o lançamento como pago. Deseja continuar?"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setPayConfirmId(null)}>
              Cancelar
            </Button>
            <Button
              loading={payMutation.isPending}
              onClick={() => payConfirmId && payMutation.mutate(payConfirmId)}
            >
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Confirmar Pagamento
            </Button>
          </>
        }
      >
        <div className="flex items-center gap-3 p-4 bg-success-50 rounded-xl border border-success-100">
          <CheckCircle2 className="w-8 h-8 text-success-500 flex-shrink-0" />
          <p className="text-sm text-success-700">
            O lançamento será marcado como <strong>pago</strong> com a data de
            hoje.
          </p>
        </div>
      </Modal>
    </div>
  );
}
