"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  MapPin,
  Truck,
  User,
  Clock,
  CheckCircle2,
  Play,
  XCircle,
  FileEdit,
  ChevronRight,
  Package,
  Navigation,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import api from "@/lib/api";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Badge, RouteStatusBadge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { DetailPanel } from "@/components/ui/detail-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/cn";

type RouteStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

interface RouteStop {
  id: string;
  sequence: number;
  address: string;
  status: string;
  deliveryStatus?: string;
}

interface Route {
  id: string;
  name: string;
  status: RouteStatus;
  scheduledDate: string;
  vehicle?: { plate: string; brand: string; model: string };
  driver?: { name: string };
  stops?: RouteStop[];
  _count: { stops: number };
  completedStops?: number;
}

const STATUS_CONFIG: Record<
  RouteStatus,
  {
    label: string;
    icon: React.ElementType;
    headerBg: string;
    headerText: string;
    cardBorder: string;
    dotColor: string;
  }
> = {
  DRAFT: {
    label: "Rascunho",
    icon: FileEdit,
    headerBg: "bg-slate-100",
    headerText: "text-slate-600",
    cardBorder: "border-slate-200",
    dotColor: "bg-slate-400",
  },
  SCHEDULED: {
    label: "Agendadas",
    icon: Clock,
    headerBg: "bg-blue-50",
    headerText: "text-blue-700",
    cardBorder: "border-blue-100",
    dotColor: "bg-blue-500",
  },
  IN_PROGRESS: {
    label: "Em Andamento",
    icon: Play,
    headerBg: "bg-warning-50",
    headerText: "text-warning-700",
    cardBorder: "border-warning-100",
    dotColor: "bg-warning-500",
  },
  COMPLETED: {
    label: "Concluídas",
    icon: CheckCircle2,
    headerBg: "bg-success-50",
    headerText: "text-success-700",
    cardBorder: "border-success-100",
    dotColor: "bg-success-500",
  },
  CANCELLED: {
    label: "Canceladas",
    icon: XCircle,
    headerBg: "bg-danger-50",
    headerText: "text-danger-600",
    cardBorder: "border-danger-100",
    dotColor: "bg-danger-500",
  },
};

const KANBAN_COLUMNS: RouteStatus[] = [
  "SCHEDULED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

const stopSchema = z.object({
  clientName: z.string().min(1, "Nome do cliente obrigatório"),
  address: z.string().min(1, "Endereço obrigatório"),
  city: z.string().min(1, "Cidade obrigatória"),
  state: z.string().length(2, "UF obrigatória (2 letras)"),
  clientDocument: z.string().optional(),
  zipCode: z.string().optional(),
  notes: z.string().optional(),
});

const routeSchema = z.object({
  name: z.string().min(3, "Nome obrigatório"),
  scheduledDate: z.string().min(1, "Data obrigatória"),
  vehicleId: z.string().uuid("Veículo obrigatório"),
  driverId: z.string().uuid("Motorista obrigatório"),
  stops: z.array(stopSchema).optional(),
});

type StopFormData = z.infer<typeof stopSchema>;
type RouteFormData = z.infer<typeof routeSchema>;

function RouteCard({
  route,
  onClick,
  selected,
}: {
  route: Route;
  onClick: () => void;
  selected?: boolean;
}) {
  const config = STATUS_CONFIG[route.status];
  const progress =
    route._count.stops > 0
      ? ((route.completedStops ?? 0) / route._count.stops) * 100
      : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className={cn(
        "bg-white rounded-xl border shadow-card hover:shadow-card-hover transition-shadow cursor-pointer",
        config.cardBorder,
        selected && "ring-2 ring-primary-200 border-primary-500",
      )}
      onClick={onClick}
    >
      {/* Card body */}
      <div className="p-3">
        {/* Route name + date */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0",
                config.headerBg,
              )}
            >
              <config.icon className={cn("w-3 h-3", config.headerText)} />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-brand-text-primary leading-tight truncate max-w-[120px]">
                {route.name}
              </p>
              <p className="text-[11px] text-brand-text-secondary mt-0.5">
                {format(parseISO(route.scheduledDate), "dd/MM/yyyy", {
                  locale: ptBR,
                })}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-brand-text-secondary flex-shrink-0 mt-0.5" />
        </div>

        {/* Vehicle + Driver */}
        {route.vehicle && (
          <div className="flex items-center gap-1 text-xs text-brand-text-secondary mb-0.5">
            <Truck className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="font-plate font-semibold text-brand-text-primary">
              {route.vehicle.plate}
            </span>
          </div>
        )}
        {route.driver && (
          <div className="flex items-center gap-1 text-xs text-brand-text-secondary mb-2">
            <User className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{route.driver.name}</span>
          </div>
        )}

        {/* Progress */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-brand-text-secondary">
              <Package className="w-3 h-3" />
              <span>
                {route.completedStops ?? 0}/{route._count.stops} paradas
              </span>
            </div>
            {route._count.stops > 0 && (
              <span
                className={cn(
                  "font-semibold",
                  progress === 100
                    ? "text-success-600"
                    : "text-brand-text-secondary",
                )}
              >
                {Math.round(progress)}%
              </span>
            )}
          </div>
          {route._count.stops > 0 && (
            <div className="progress-bar">
              <div
                className={cn(
                  "progress-fill",
                  progress === 100
                    ? "progress-fill-success"
                    : progress > 50
                      ? ""
                      : "progress-fill-warning",
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function KanbanColumn({
  status,
  routes,
  loading,
  onSelectRoute,
  selectedRouteId,
}: {
  status: RouteStatus;
  routes: Route[];
  loading: boolean;
  onSelectRoute: (route: Route) => void;
  selectedRouteId?: string;
}) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <div className="kanban-column flex flex-col rounded-2xl border border-brand-border bg-slate-50/70 backdrop-blur-sm min-w-[300px]">
      {/* Column header */}
      <div
        className={cn(
          "flex items-center justify-between px-4 py-3 rounded-t-2xl border-b border-brand-border/60",
          config.headerBg,
        )}
      >
        <div className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full", config.dotColor)} />
          <span className={cn("text-sm font-semibold", config.headerText)}>
            {config.label}
          </span>
        </div>
        <span
          className={cn(
            "text-xs font-bold px-2 py-0.5 rounded-full bg-white/60",
            config.headerText,
          )}
        >
          {routes.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex-1 p-3 space-y-2 min-h-[200px] max-h-[calc(100vh-280px)] overflow-y-auto scrollbar-thin">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-brand-border p-3 space-y-2"
            >
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))
        ) : routes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-brand-text-secondary text-xs opacity-60">
            <Icon className="w-6 h-6 mb-2" />
            <span>Nenhuma rota</span>
          </div>
        ) : (
          <AnimatePresence>
            {routes.map((route) => (
              <RouteCard
                key={route.id}
                route={route}
                selected={selectedRouteId === route.id}
                onClick={() => onSelectRoute(route)}
              />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

export default function RoutesPage() {
  const qc = useQueryClient();
  const [headerSearch, setHeaderSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const { data: routes = [], isLoading } = useQuery<Route[]>({
    queryKey: ["routes"],
    queryFn: () => api.get("/routes").then((r) => r.data),
    refetchInterval: 15_000,
  });

  const { data: vehicles = [] } = useQuery<
    Array<{ id: string; plate: string; brand: string; model: string }>
  >({
    queryKey: ["vehicles-active"],
    queryFn: () =>
      api
        .get("/vehicles", { params: { status: "ACTIVE" } })
        .then((r) => r.data),
  });

  const { data: drivers = [] } = useQuery<Array<{ id: string; name: string }>>({
    queryKey: ["drivers-active"],
    queryFn: () =>
      api.get("/drivers", { params: { status: "ACTIVE" } }).then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: RouteFormData) => api.post("/routes", data),
    onSuccess: () => {
      toast.success("Rota criada com sucesso!");
      qc.invalidateQueries({ queryKey: ["routes"] });
      setModalOpen(false);
      reset();
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? "Erro ao criar rota."),
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/routes/${id}/cancel`),
    onSuccess: () => {
      toast.success("Rota cancelada com sucesso!");
      qc.invalidateQueries({ queryKey: ["routes"] });
      setDetailOpen(false);
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? "Erro ao cancelar rota."),
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<RouteFormData>({
    resolver: zodResolver(routeSchema),
    defaultValues: { stops: [] },
  });

  const {
    fields: stopFields,
    append: appendStop,
    remove: removeStop,
  } = useFieldArray({
    control,
    name: "stops",
  });

  const filteredRoutes = routes.filter(
    (r) =>
      r.name.toLowerCase().includes(headerSearch.toLowerCase()) ||
      r.driver?.name.toLowerCase().includes(headerSearch.toLowerCase()) ||
      r.vehicle?.plate.toLowerCase().includes(headerSearch.toLowerCase()),
  );

  const grouped = KANBAN_COLUMNS.reduce(
    (acc, status) => {
      acc[status] = filteredRoutes.filter((r) => r.status === status);
      return acc;
    },
    {} as Record<RouteStatus, Route[]>,
  );

  const routeStats = {
    total: filteredRoutes.length,
    scheduled: grouped.SCHEDULED.length,
    inProgress: grouped.IN_PROGRESS.length,
    completed: grouped.COMPLETED.length,
  };

  const selectedRouteResolved = selectedRoute
    ? (routes.find((r) => r.id === selectedRoute.id) ?? selectedRoute)
    : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        title="Rotas"
        breadcrumbs={[{ label: "Rotas" }]}
        searchQuery={headerSearch}
        onSearchQueryChange={setHeaderSearch}
        searchPlaceholder="Buscar rota, motorista ou placa..."
      />

      <div className="flex-1 p-6 flex flex-col gap-5 max-w-[1800px] mx-auto w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              label: "Total",
              value: routeStats.total,
              tone: "bg-blue-50 text-blue-700 border-blue-100",
            },
            {
              label: "Agendadas",
              value: routeStats.scheduled,
              tone: "bg-sky-50 text-sky-700 border-sky-100",
            },
            {
              label: "Em Andamento",
              value: routeStats.inProgress,
              tone: "bg-amber-50 text-amber-700 border-amber-100",
            },
            {
              label: "Concluídas",
              value: routeStats.completed,
              tone: "bg-emerald-50 text-emerald-700 border-emerald-100",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white rounded-2xl border border-brand-border shadow-card p-3.5"
            >
              <p className="text-xs text-brand-text-secondary uppercase tracking-wide">
                {item.label}
              </p>
              <p className="text-2xl font-black text-brand-text-primary mt-1">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 flex-wrap bg-white rounded-2xl border border-brand-border shadow-card p-3.5">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-brand-text-secondary">
              <span className="font-semibold text-brand-text-primary">
                {filteredRoutes.length}
              </span>{" "}
              rota(s) exibida(s)
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {selectedRouteResolved && (
                <span className="hidden md:inline-flex text-xs font-medium text-brand-text-secondary bg-slate-100 px-2 py-1 rounded-md">
                  Selecionado: {selectedRouteResolved.name}
                </span>
              )}

              <Button
                size="sm"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => setModalOpen(true)}
              >
                Nova Rota
              </Button>

              <Button
                size="sm"
                variant="secondary"
                leftIcon={<Pencil className="w-4 h-4" />}
                disabled={!selectedRouteResolved}
                onClick={() => selectedRouteResolved && setDetailOpen(true)}
              >
                Editar
              </Button>

              <Button
                size="sm"
                variant="danger"
                leftIcon={<Trash2 className="w-4 h-4" />}
                disabled={!selectedRouteResolved || cancelMutation.isPending}
                onClick={() => {
                  if (!selectedRouteResolved) return;
                  if (
                    confirm(
                      `Deseja cancelar a rota ${selectedRouteResolved.name}?`,
                    )
                  ) {
                    cancelMutation.mutate(selectedRouteResolved.id);
                  }
                }}
              >
                Excluir
              </Button>
            </div>
          </div>

          {/* Live indicator */}
          <div className="flex items-center gap-1.5 text-xs text-brand-text-secondary bg-white border border-brand-border rounded-lg px-2.5 py-1.5">
            <div className="w-1.5 h-1.5 bg-success-500 rounded-full animate-pulse-soft" />
            Atualizando em tempo real
          </div>
        </div>

        {/* Kanban board */}
        <div className="flex-1 flex gap-4 overflow-x-auto pb-4 scrollbar-thin rounded-2xl bg-gradient-to-b from-slate-50 to-white p-2 border border-brand-border/60">
          {KANBAN_COLUMNS.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              routes={grouped[status]}
              loading={isLoading}
              onSelectRoute={(route) => {
                setSelectedRoute(route);
                setDetailOpen(true);
              }}
              selectedRouteId={selectedRouteResolved?.id}
            />
          ))}

          {/* Empty state overlay */}
          {!isLoading && routes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center text-brand-text-secondary">
                <Navigation className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="font-semibold">Nenhuma rota cadastrada</p>
                <p className="text-sm mt-1 opacity-60">
                  Crie a primeira rota para começar
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Route Modal */}
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          reset();
        }}
        title="Nova Rota"
        description="Configure os dados da nova rota e adicione as paradas de entrega."
        size="lg"
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
              Criar Rota
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          {/* ── Dados da rota ────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">
                Nome da Rota *
              </label>
              <input
                {...register("name")}
                placeholder="Ex: Zona Sul — Entrega"
                className={cn("input-base", errors.name && "border-danger-400")}
              />
              {errors.name && (
                <p className="text-danger-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">
                Data Agendada *
              </label>
              <input
                {...register("scheduledDate")}
                type="datetime-local"
                className={cn(
                  "input-base",
                  errors.scheduledDate && "border-danger-400",
                )}
              />
            </div>

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
                <option value="">Selecionar veículo...</option>
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

            <div>
              <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">
                Motorista *
              </label>
              <select
                {...register("driverId")}
                className={cn(
                  "input-base",
                  errors.driverId && "border-danger-400",
                )}
              >
                <option value="">Selecionar motorista...</option>
                {drivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              {errors.driverId && (
                <p className="text-danger-500 text-xs mt-1">
                  {errors.driverId.message}
                </p>
              )}
            </div>
          </div>

          {/* ── Paradas ──────────────────────────────────────────────── */}
          <div className="border-t border-brand-border pt-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-semibold text-brand-text-primary flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary-500" />
                  Paradas de Entrega
                  {stopFields.length > 0 && (
                    <span className="text-xs font-bold bg-primary-50 text-primary-600 px-1.5 py-0.5 rounded-full">
                      {stopFields.length}
                    </span>
                  )}
                </h4>
                <p className="text-xs text-brand-text-secondary mt-0.5">
                  Adicione os locais de entrega com cliente e endereço.
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                onClick={() =>
                  appendStop({
                    clientName: "",
                    address: "",
                    city: "",
                    state: "",
                    clientDocument: "",
                    zipCode: "",
                    notes: "",
                  })
                }
              >
                Adicionar Parada
              </Button>
            </div>

            {stopFields.length === 0 && (
              <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-brand-border rounded-xl text-brand-text-secondary text-xs gap-1 opacity-60">
                <MapPin className="w-5 h-5 opacity-50" />
                <span>Nenhuma parada. A rota pode ser criada sem paradas.</span>
              </div>
            )}

            <div className="space-y-3 max-h-72 overflow-y-auto scrollbar-thin pr-1">
              {stopFields.map((field, index) => (
                <div
                  key={field.id}
                  className="bg-slate-50 border border-brand-border rounded-xl p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-text-secondary flex items-center gap-1.5">
                      <span className="w-5 h-5 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-[10px] font-black">
                        {index + 1}
                      </span>
                      Parada {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeStop(index)}
                      className="text-brand-text-secondary hover:text-danger-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="sm:col-span-2">
                      <input
                        {...register(`stops.${index}.clientName`)}
                        placeholder="Nome do cliente *"
                        className={cn(
                          "input-base text-sm",
                          errors.stops?.[index]?.clientName &&
                            "border-danger-400",
                        )}
                      />
                      {errors.stops?.[index]?.clientName && (
                        <p className="text-danger-500 text-xs mt-0.5">
                          {errors.stops[index]!.clientName!.message}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <input
                        {...register(`stops.${index}.address`)}
                        placeholder="Endereço completo (rua, número, bairro) *"
                        className={cn(
                          "input-base text-sm",
                          errors.stops?.[index]?.address && "border-danger-400",
                        )}
                      />
                      {errors.stops?.[index]?.address && (
                        <p className="text-danger-500 text-xs mt-0.5">
                          {errors.stops[index]!.address!.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <input
                        {...register(`stops.${index}.city`)}
                        placeholder="Cidade *"
                        className={cn(
                          "input-base text-sm",
                          errors.stops?.[index]?.city && "border-danger-400",
                        )}
                      />
                      {errors.stops?.[index]?.city && (
                        <p className="text-danger-500 text-xs mt-0.5">
                          {errors.stops[index]!.city!.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        {...register(`stops.${index}.state`)}
                        placeholder="UF *"
                        maxLength={2}
                        style={{ textTransform: "uppercase" }}
                        className={cn(
                          "input-base text-sm",
                          errors.stops?.[index]?.state && "border-danger-400",
                        )}
                      />
                      <input
                        {...register(`stops.${index}.zipCode`)}
                        placeholder="CEP"
                        className="input-base text-sm"
                      />
                    </div>

                    <div>
                      <input
                        {...register(`stops.${index}.clientDocument`)}
                        placeholder="CPF/CNPJ (opcional)"
                        className="input-base text-sm"
                      />
                    </div>

                    <div>
                      <input
                        {...register(`stops.${index}.notes`)}
                        placeholder="Observações (opcional)"
                        className="input-base text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>
      </Modal>

      {/* Route detail panel */}
      {selectedRouteResolved && (
        <DetailPanel
          open={detailOpen}
          onClose={() => setDetailOpen(false)}
          title={selectedRouteResolved.name}
          subtitle={format(
            parseISO(selectedRouteResolved.scheduledDate),
            "dd 'de' MMMM 'de' yyyy 'às' HH:mm",
            { locale: ptBR },
          )}
          badges={[
            {
              label:
                selectedRouteResolved.status === "COMPLETED"
                  ? "Concluída"
                  : selectedRouteResolved.status === "IN_PROGRESS"
                    ? "Em Andamento"
                    : selectedRouteResolved.status === "SCHEDULED"
                      ? "Agendada"
                      : selectedRouteResolved.status === "CANCELLED"
                        ? "Cancelada"
                        : "Rascunho",
              variant:
                selectedRouteResolved.status === "COMPLETED"
                  ? "success"
                  : selectedRouteResolved.status === "IN_PROGRESS"
                    ? "warning"
                    : selectedRouteResolved.status === "CANCELLED"
                      ? "danger"
                      : "gray",
            },
          ]}
          width="md"
        >
          <DetailPanel.Section title="Informações">
            <DetailPanel.Grid cols={2}>
              {selectedRouteResolved.vehicle && (
                <>
                  <DetailPanel.Field
                    label="Placa"
                    value={selectedRouteResolved.vehicle.plate}
                    mono
                  />
                  <DetailPanel.Field
                    label="Veículo"
                    value={`${selectedRouteResolved.vehicle.brand} ${selectedRouteResolved.vehicle.model}`}
                  />
                </>
              )}
              {selectedRouteResolved.driver && (
                <DetailPanel.Field
                  label="Motorista"
                  value={selectedRouteResolved.driver.name}
                />
              )}
            </DetailPanel.Grid>
          </DetailPanel.Section>

          {selectedRouteResolved.stops &&
            selectedRouteResolved.stops.length > 0 && (
              <DetailPanel.Section
                title={`Paradas (${selectedRouteResolved.stops.length})`}
              >
                <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
                  {selectedRouteResolved.stops.map((stop) => (
                    <div
                      key={stop.id}
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl"
                    >
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-2xs font-bold flex-shrink-0",
                          stop.status === "COMPLETED"
                            ? "bg-success-100 text-success-700"
                            : stop.status === "IN_PROGRESS"
                              ? "bg-warning-100 text-warning-700"
                              : "bg-slate-200 text-slate-600",
                        )}
                      >
                        {stop.sequence}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-700 truncate">
                          {stop.address}
                        </p>
                      </div>
                      {stop.deliveryStatus && (
                        <Badge
                          variant={
                            stop.deliveryStatus === "DELIVERED"
                              ? "success"
                              : "warning"
                          }
                          className="flex-shrink-0"
                        >
                          {stop.deliveryStatus === "DELIVERED"
                            ? "Entregue"
                            : "Pendente"}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </DetailPanel.Section>
            )}
        </DetailPanel>
      )}
    </div>
  );
}
