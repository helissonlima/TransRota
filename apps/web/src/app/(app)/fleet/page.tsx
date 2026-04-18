"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Truck,
  AlertTriangle,
  Fuel,
  Wrench,
  Eye,
  ChevronRight,
  X,
  Droplets,
  ChevronDown,
  ChevronUp,
  FileText,
  Settings2,
  Pencil,
  Trash2,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { format, parseISO, differenceInDays } from "date-fns";
import api from "@/lib/api";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Badge, VehicleStatusBadge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";
import { ViewToggle, type ViewMode } from "@/components/ui/view-toggle";
import { cn } from "@/lib/cn";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Vehicle {
  id: string;
  plate: string;
  model: string;
  brand: string;
  year: number;
  manufacturingYear?: number;
  type: string;
  fuelType?: string;
  status: "ACTIVE" | "MAINTENANCE" | "INACTIVE";
  currentKm: number;
  nextMaintenanceKm?: number;
  nextMaintenanceDate?: string;
  tag?: number;
  renavam?: string;
  crvNumber?: string;
  chassisNumber?: string;
  securityCode?: string;
  engineCode?: string;
  documentExpiry?: string;
  responsiblePerson?: string;
  tankCapacity?: number;
  horsepower?: string;
  grossWeight?: string;
  axles?: string;
  cmt?: string;
  seats?: string;
  category?: string;
  oilChangeIntervalKm?: number;
  branch?: { name: string };
  _count: { routes: number; maintenanceRecords: number };
}

interface OilChangeRecord {
  id: string;
  vehicleId: string;
  changeDate?: string;
  changeKm?: number;
  currentKm?: number;
  nextChangeKm?: number;
  status: "UP_TO_DATE" | "DUE_SOON" | "OVERDUE";
  kmDriven?: number;
  oilType?: string;
  responsibleName?: string;
  notes?: string;
  createdAt: string;
  vehicle?: { plate: string; brand: string; model: string };
}

// ─── Constants ────────────────────────────────────────────────────────────────

const FILTER_TABS = [
  { key: "", label: "Todos" },
  { key: "ACTIVE", label: "Ativos" },
  { key: "MAINTENANCE", label: "Manutenção" },
  { key: "INACTIVE", label: "Inativos" },
] as const;

const SECTION_TABS = [
  { key: "vehicles", label: "Frota", icon: Truck },
  { key: "oil", label: "Troca de Óleo", icon: Droplets },
] as const;

const FUEL_LABELS: Record<string, { label: string; color: string }> = {
  GASOLINE: { label: "Gasolina", color: "text-orange-500" },
  DIESEL: { label: "Diesel", color: "text-slate-600" },
  ETHANOL: { label: "Etanol", color: "text-green-600" },
  FLEX: { label: "Flex", color: "text-blue-500" },
  ELECTRIC: { label: "Elétrico", color: "text-emerald-500" },
  GNV: { label: "GNV", color: "text-purple-500" },
};

const TYPE_LABELS: Record<string, string> = {
  TRUCK: "Caminhão",
  VAN: "Van / Furgão",
  CAR: "Carro / Passeio",
  MOTORCYCLE: "Moto",
  UTILITY: "Utilitário",
};

const VEHICLE_CATALOG: Record<string, Record<string, string[]>> = {
  TRUCK: {
    "Mercedes-Benz": [
      "Accelo 815",
      "Accelo 1016",
      "Accelo 1316",
      "Atego 1719",
      "Atego 2430",
      "Actros 2551",
    ],
    Volvo: ["FH 460", "FH 500", "FM 370", "FM 460", "FMX 420", "FMX 500"],
    Scania: ["P320", "P360", "G410", "G450", "R450", "R500", "S500"],
    Iveco: ["Tector 170E22", "Tector 240E28", "Stralis 440", "Stralis 480"],
    Ford: ["Cargo 1119", "Cargo 1419", "Cargo 2842", "F-MAX 1942"],
    Volkswagen: [
      "Delivery 9.170",
      "Delivery 11.180",
      "Constellation 24.280",
      "Meteor 29.530",
    ],
  },
  VAN: {
    "Mercedes-Benz": [
      "Sprinter 311 CDI",
      "Sprinter 415 CDI",
      "Sprinter 515 CDI",
    ],
    Volkswagen: ["Transporter T6", "Crafter 2.0 TDI Furgão"],
    Ford: ["Transit 2.0 Furgão", "Transit Custom", "Transit Minibus"],
    Renault: ["Master 2.3 Furgão", "Master 2.3 Minibus"],
    Fiat: ["Ducato 2.3 Furgão", "Ducato 2.3 Minibus", "Doblò Cargo 1.8"],
  },
  CAR: {
    Volkswagen: [
      "Gol 1.0",
      "Polo 1.0 Turbo",
      "Voyage 1.6",
      "Virtus 1.0 Turbo",
      "T-Cross 1.0 Turbo",
    ],
    Chevrolet: [
      "Onix 1.0 Turbo",
      "Onix Plus 1.0 Turbo",
      "Tracker 1.0 Turbo",
      "S10 2.8 Diesel",
    ],
    Fiat: [
      "Argo 1.0",
      "Argo 1.3",
      "Cronos 1.3",
      "Strada 1.3",
      "Toro 2.0 Diesel",
      "Mobi Like",
    ],
    Toyota: [
      "Yaris Sedan 1.5",
      "Corolla 2.0",
      "Corolla Cross 2.0",
      "Hilux SRX 2.8",
      "SW4 2.8",
    ],
    Hyundai: ["HB20 1.0", "HB20S 1.0", "Creta 2.0", "Tucson 1.6 Turbo"],
    Ford: ["EcoSport 1.5", "Ranger XLS 2.3"],
    Renault: ["Kwid 1.0", "Sandero 1.6", "Duster 1.6", "Captur 1.6"],
    Honda: ["City Hatch 1.5", "Civic 2.0", "HR-V 1.5 Turbo"],
  },
  MOTORCYCLE: {
    Honda: [
      "CG 160 Fan",
      "CG 160 Titan",
      "Biz 125",
      "Pop 110i",
      "PCX 150",
      "NXR 160 Bros",
      "XRE 300",
    ],
    Yamaha: [
      "Factor 150",
      "YBR 150",
      "Fazer 250 FZ25",
      "MT-03",
      "NMAX 160",
      "Crosser 150",
    ],
    Suzuki: ["Yes 125", "Burgman 125", "Intruder 125"],
    Kawasaki: ["Ninja 300", "Ninja 400", "Z400"],
  },
  UTILITY: {
    Fiat: ["Fiorino 1.4", "Doblò Cargo 1.8"],
    Volkswagen: ["Saveiro 1.6", "Amarok 2.0 Diesel"],
    Ford: ["Courier 1.6", "Ranger XL 2.3"],
    Chevrolet: ["Montana 1.4", "S10 LS 2.8"],
    Renault: ["Kangoo Express 1.6"],
  },
};

const OIL_STATUS_CONFIG = {
  UP_TO_DATE: {
    label: "Em Dia",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  DUE_SOON: {
    label: "Próximo",
    color: "text-warning-700",
    bg: "bg-warning-50",
    border: "border-warning-200",
  },
  OVERDUE: {
    label: "Atrasado",
    color: "text-danger-700",
    bg: "bg-danger-50",
    border: "border-danger-200",
  },
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function applyMaskPlate(v: string) {
  return v
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 7);
}

function isHeavyMachine(vehicle: Vehicle) {
  return (
    (vehicle.category ?? "").toUpperCase().startsWith("MAQUINA_PESADA") ||
    vehicle.plate.startsWith("HMQ")
  );
}

function vehicleCode(vehicle: Vehicle) {
  return isHeavyMachine(vehicle)
    ? `SEM PLACA${vehicle.tag !== undefined ? ` #${vehicle.tag}` : ""}`
    : vehicle.plate;
}

// ─── Schemas ──────────────────────────────────────────────────────────────────

const vehicleSchema = z.object({
  plate: z.string().optional(),
  withoutPlate: z.boolean().optional(),
  brand: z.string().min(1, "Marca obrigatória"),
  model: z.string().min(1, "Modelo obrigatório"),
  year: z.coerce
    .number()
    .int()
    .min(1990)
    .max(new Date().getFullYear() + 1),
  type: z.string().min(1, "Tipo obrigatório"),
  fuelType: z.string().min(1, "Combustível obrigatório"),
  currentKm: z.coerce.number().min(0),
  manufacturingYear: z.coerce.number().optional(),
  nextMaintenanceKm: z.coerce.number().optional(),
  oilChangeIntervalKm: z.coerce.number().optional(),
  tankCapacity: z.coerce.number().optional(),
  responsiblePerson: z.string().optional(),
  tag: z.coerce.number().optional(),
  renavam: z.string().optional(),
  crvNumber: z.string().optional(),
  chassisNumber: z.string().optional(),
  securityCode: z.string().optional(),
  engineCode: z.string().optional(),
  documentExpiry: z.string().optional(),
  category: z.string().optional(),
  horsepower: z.string().optional(),
  grossWeight: z.string().optional(),
  axles: z.string().optional(),
  cmt: z.string().optional(),
  seats: z.string().optional(),
});

const oilChangeSchema = z.object({
  vehicleId: z.string().min(1, "Selecione o veículo"),
  changeDate: z.string().optional(),
  changeKm: z.coerce.number().optional(),
  nextChangeKm: z.coerce.number().optional(),
  oilType: z.string().optional(),
  responsibleName: z.string().optional(),
  notes: z.string().optional(),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;
type OilChangeFormData = z.infer<typeof oilChangeSchema>;

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

// ─── VehicleCard ──────────────────────────────────────────────────────────────

function VehicleCard({
  vehicle,
  onClick,
  selected,
}: {
  vehicle: Vehicle;
  onClick: () => void;
  selected?: boolean;
}) {
  const heavyMachine = isHeavyMachine(vehicle);
  const maintenanceSoon =
    vehicle.nextMaintenanceDate &&
    new Date(vehicle.nextMaintenanceDate) <=
      new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

  const kmProgress =
    vehicle.nextMaintenanceKm && vehicle.currentKm
      ? Math.min((vehicle.currentKm / vehicle.nextMaintenanceKm) * 100, 100)
      : null;

  const fuelInfo = FUEL_LABELS[vehicle.fuelType ?? ""];
  const docExpiryDays = vehicle.documentExpiry
    ? differenceInDays(parseISO(vehicle.documentExpiry), new Date())
    : null;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={cn(
        "bg-white rounded-2xl border shadow-card hover:shadow-card-hover transition-shadow cursor-pointer group",
        selected
          ? "border-primary-500 ring-2 ring-primary-100"
          : "border-brand-border",
      )}
      onClick={onClick}
    >
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-plate text-xl font-black text-brand-text-primary tracking-wider">
                {vehicleCode(vehicle)}
              </span>
              {vehicle.tag !== undefined && (
                <span className="text-xs font-bold text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded-md">
                  #{vehicle.tag}
                </span>
              )}
              {maintenanceSoon && (
                <span
                  className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"
                  title="Manutenção próxima"
                />
              )}
            </div>
            <p className="text-sm text-brand-text-secondary">
              {vehicle.brand} {vehicle.model} · {vehicle.year}
            </p>
          </div>
          <VehicleStatusBadge status={vehicle.status} />
        </div>

        <div className="flex items-center gap-4 text-xs text-brand-text-secondary mt-3 flex-wrap">
          <span className="flex items-center gap-1">
            <Truck className="w-3.5 h-3.5" />
            {TYPE_LABELS[vehicle.type] ?? vehicle.type}
          </span>
          {fuelInfo && (
            <span className={cn("flex items-center gap-1", fuelInfo.color)}>
              <Fuel className="w-3.5 h-3.5" />
              {fuelInfo.label}
            </span>
          )}
          {vehicle.tankCapacity && (
            <span className="flex items-center gap-1 text-slate-400">
              <Droplets className="w-3.5 h-3.5" />
              {vehicle.tankCapacity}L
            </span>
          )}
        </div>
      </div>

      <div className="px-5 pb-4">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-brand-text-secondary">KM Atual</span>
          <span className="font-semibold text-brand-text-primary">
            {vehicle.currentKm.toLocaleString("pt-BR")}{" "}
            {heavyMachine ? "h" : "km"}
          </span>
        </div>
        {kmProgress !== null && (
          <>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  kmProgress > 90
                    ? "bg-danger-500"
                    : kmProgress > 70
                      ? "bg-warning-500"
                      : "bg-primary-500",
                )}
                style={{ width: `${kmProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-brand-text-secondary mt-1">
              <span>
                Próx. revisão:{" "}
                {vehicle.nextMaintenanceKm?.toLocaleString("pt-BR")}{" "}
                {heavyMachine ? "h" : "km"}
              </span>
              <span
                className={cn(
                  kmProgress > 80 && "text-danger-500 font-semibold",
                )}
              >
                {Math.round(kmProgress)}%
              </span>
            </div>
          </>
        )}

        {docExpiryDays !== null && docExpiryDays <= 30 && (
          <div
            className={cn(
              "mt-2 flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg",
              docExpiryDays < 0
                ? "bg-danger-50 text-danger-700"
                : "bg-warning-50 text-warning-700",
            )}
          >
            <AlertTriangle className="w-3 h-3 flex-shrink-0" />
            {docExpiryDays < 0
              ? `CRLV vencido há ${Math.abs(docExpiryDays)} dias`
              : `CRLV vence em ${docExpiryDays} dias`}
          </div>
        )}
      </div>

      <div className="px-5 py-3 bg-slate-50/80 rounded-b-2xl border-t border-brand-border/50 flex items-center justify-between">
        <span className="text-xs font-medium text-brand-text-primary">
          {vehicle.branch?.name}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="xs"
            variant="ghost"
            leftIcon={<Eye className="w-3 h-3" />}
          >
            Detalhes
          </Button>
        </div>
        <ChevronRight className="w-4 h-4 text-brand-text-secondary group-hover:text-primary-600 transition-colors" />
      </div>
    </motion.div>
  );
}

// ─── OilChangeCard ────────────────────────────────────────────────────────────

function OilChangeCard({
  record,
  onRegister,
}: {
  record: OilChangeRecord;
  onRegister: () => void;
}) {
  const cfg = OIL_STATUS_CONFIG[record.status];
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={cn(
        "bg-white rounded-2xl border shadow-card hover:shadow-card-hover transition-shadow",
        record.status === "OVERDUE"
          ? "border-danger-200"
          : record.status === "DUE_SOON"
            ? "border-warning-200"
            : "border-brand-border",
      )}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-plate text-lg font-black text-brand-text-primary tracking-wider">
              {record.vehicle?.plate ?? "—"}
            </p>
            <p className="text-xs text-brand-text-secondary mt-0.5">
              {record.vehicle?.brand} {record.vehicle?.model}
            </p>
          </div>
          <span
            className={cn(
              "text-xs font-semibold px-2.5 py-1 rounded-lg border",
              cfg.color,
              cfg.bg,
              cfg.border,
            )}
          >
            {cfg.label}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs mt-3">
          {[
            {
              label: "Última troca",
              value: record.changeDate
                ? format(parseISO(record.changeDate), "dd/MM/yyyy")
                : "—",
            },
            {
              label: "KM da troca",
              value: record.changeKm
                ? `${record.changeKm.toLocaleString("pt-BR")} km`
                : "—",
            },
            {
              label: "Próxima troca",
              value: record.nextChangeKm
                ? `${record.nextChangeKm.toLocaleString("pt-BR")} km`
                : "—",
              danger: record.status === "OVERDUE",
            },
            {
              label: "KM percorrido",
              value: record.kmDriven
                ? `${record.kmDriven.toLocaleString("pt-BR")} km`
                : "—",
            },
          ].map((item) => (
            <div key={item.label} className="bg-slate-50 rounded-lg p-2.5">
              <div className="text-brand-text-secondary mb-0.5">
                {item.label}
              </div>
              <div
                className={cn(
                  "font-semibold",
                  item.danger ? "text-danger-600" : "text-brand-text-primary",
                )}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {record.oilType && (
          <div className="mt-2 flex items-center gap-1.5 text-xs bg-slate-50 rounded-lg px-2.5 py-1.5">
            <Droplets className="w-3 h-3 text-primary-500" />
            <span className="text-brand-text-secondary">Óleo:</span>
            <span className="font-semibold text-brand-text-primary">
              {record.oilType}
            </span>
          </div>
        )}
      </div>

      <div className="px-5 py-3 bg-slate-50/80 rounded-b-2xl border-t border-brand-border/50">
        <Button
          size="sm"
          variant="secondary"
          className="w-full"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          onClick={onRegister}
        >
          Registrar Nova Troca
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function FleetPage() {
  const qc = useQueryClient();
  const [section, setSection] = useState<"vehicles" | "oil">("vehicles");
  const [headerSearch, setHeaderSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [vehicleSortBy, setVehicleSortBy] = useState<
    "plate-asc" | "plate-desc" | "km-desc" | "maintenance-asc"
  >("plate-asc");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [vehicleModal, setVehicleModal] = useState(false);
  const [oilModal, setOilModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedOil, setSelectedOil] = useState<OilChangeRecord | null>(null);
  const [detailVehicle, setDetailVehicle] = useState<Vehicle | null>(null);
  const [detailOil, setDetailOil] = useState<OilChangeRecord | null>(null);
  const [heavyMachinesEnabled, setHeavyMachinesEnabled] = useState(false);

  useEffect(() => {
    const tenantId = localStorage.getItem("tenantId") ?? "";
    const sortKey = tenantId ? `sort:fleet:${tenantId}` : "sort:fleet";
    const savedSort = localStorage.getItem(sortKey);
    if (
      savedSort === "plate-asc" ||
      savedSort === "plate-desc" ||
      savedSort === "km-desc" ||
      savedSort === "maintenance-asc"
    ) {
      setVehicleSortBy(savedSort);
    }
  }, []);

  useEffect(() => {
    const tenantId = localStorage.getItem("tenantId") ?? "";
    const sortKey = tenantId ? `sort:fleet:${tenantId}` : "sort:fleet";
    localStorage.setItem(sortKey, vehicleSortBy);
  }, [vehicleSortBy]);

  useEffect(() => {
    const tenantId = localStorage.getItem("tenantId") ?? "";
    const sharedKey = tenantId
      ? `view-mode:fleet-drivers:${tenantId}`
      : "view-mode:fleet-drivers";
    const legacyKey = tenantId
      ? `view-mode:fleet:${tenantId}`
      : "view-mode:fleet";
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

  useEffect(() => {
    const tenantId = localStorage.getItem("tenantId") ?? "";
    const key = tenantId
      ? `feature:heavy-machines-enabled:${tenantId}`
      : "feature:heavy-machines-enabled";
    setHeavyMachinesEnabled(localStorage.getItem(key) === "true");
  }, []);

  // ── Queries ──
  const { data: vehicles = [], isLoading: loadingVehicles } = useQuery<
    Vehicle[]
  >({
    queryKey: ["vehicles", statusFilter],
    queryFn: () =>
      api
        .get("/vehicles", { params: { status: statusFilter || undefined } })
        .then((r) => r.data),
  });

  const { data: oilRecords = [], isLoading: loadingOil } = useQuery<
    OilChangeRecord[]
  >({
    queryKey: ["oil-changes"],
    enabled: section === "oil",
    queryFn: async () => {
      const allVehicles: Vehicle[] = await api
        .get("/vehicles")
        .then((r) => r.data);
      const results = await Promise.all(
        allVehicles.map((v) =>
          api
            .get(`/vehicles/${v.id}/oil-changes`)
            .then((r) =>
              (r.data as OilChangeRecord[]).map((rec) => ({
                ...rec,
                vehicle: { plate: v.plate, brand: v.brand, model: v.model },
              })),
            )
            .catch(() => []),
        ),
      );
      return results.flat();
    },
  });

  // ── Mutations ──
  const createVehicle = useMutation({
    mutationFn: (d: VehicleFormData) => api.post("/vehicles", d),
    onSuccess: () => {
      toast.success("Veículo cadastrado com sucesso!");
      qc.invalidateQueries({ queryKey: ["vehicles"] });
      setVehicleModal(false);
      vForm.reset();
    },
    onError: (e: any) =>
      toast.error(e?.response?.data?.message ?? "Erro ao cadastrar veículo."),
  });

  const createOil = useMutation({
    mutationFn: ({ vehicleId, ...rest }: OilChangeFormData) =>
      api.post(`/vehicles/${vehicleId}/oil-changes`, rest),
    onSuccess: () => {
      toast.success("Troca de óleo registrada!");
      qc.invalidateQueries({ queryKey: ["oil-changes"] });
      setOilModal(false);
      oForm.reset();
    },
    onError: () => toast.error("Erro ao registrar troca de óleo."),
  });

  const deleteVehicle = useMutation({
    mutationFn: (id: string) => api.delete(`/vehicles/${id}`),
    onSuccess: () => {
      toast.success("Veículo removido com sucesso.");
      qc.invalidateQueries({ queryKey: ["vehicles"] });
      setSelectedVehicle(null);
    },
    onError: (e: any) =>
      toast.error(e?.response?.data?.message ?? "Erro ao remover veículo."),
  });

  const deleteOilChange = useMutation({
    mutationFn: ({ vehicleId, id }: { vehicleId: string; id: string }) =>
      api.delete(`/vehicles/${vehicleId}/oil-changes/${id}`),
    onSuccess: () => {
      toast.success("Registro de troca removido.");
      qc.invalidateQueries({ queryKey: ["oil-changes"] });
      setSelectedOil(null);
    },
    onError: () => toast.error("Erro ao remover registro de troca."),
  });

  // ── Forms ──
  const vForm = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
  });
  const {
    register: vr,
    handleSubmit: vhs,
    reset: vReset,
    setValue: vSv,
    watch: vw,
    formState: { errors: ve },
  } = vForm;

  const oForm = useForm<OilChangeFormData>({
    resolver: zodResolver(oilChangeSchema),
  });
  const {
    register: or,
    handleSubmit: ohs,
    reset: oReset,
    formState: { errors: oe },
  } = oForm;

  const plateVal = vw("plate") ?? "";
  const withoutPlateVal = !!vw("withoutPlate");
  const typeVal = vw("type") ?? "";
  const brandVal = vw("brand") ?? "";
  const heavyCatalog: Record<string, string[]> = {
    "John Deere": [
      "Trator 6110J",
      "Trator 6195J",
      "Colheitadeira S440",
      "Pulverizador M4040",
    ],
    "Massey Ferguson": [
      "Trator MF 6713",
      "Trator MF 7370",
      "Colheitadeira MF 6690",
    ],
    "New Holland": ["Trator TL5.80", "Trator T7.190", "Escavadeira E215C"],
    Caterpillar: [
      "Escavadeira 320",
      "Escavadeira 336",
      "Pá-carregadeira 938K",
      "Motoniveladora 120K",
    ],
    Komatsu: [
      "Escavadeira PC200",
      "Escavadeira PC210",
      "Pá-carregadeira WA200",
    ],
    JCB: ["Retroescavadeira 3CX", "Telehandler 541-70"],
  };
  const baseCatalog = withoutPlateVal
    ? { UTILITY: heavyCatalog }
    : VEHICLE_CATALOG;
  const brands = typeVal ? Object.keys(baseCatalog[typeVal] ?? {}) : [];
  const models =
    typeVal && brandVal ? (baseCatalog[typeVal]?.[brandVal] ?? []) : [];

  const submitVehicle = (data: VehicleFormData) => {
    const requiresPlate = !data.withoutPlate;
    const plate = (data.plate ?? "").trim().toUpperCase();
    if (
      requiresPlate &&
      !/^[A-Z]{3}[0-9][A-Z][0-9]{2}$|^[A-Z]{3}[0-9]{4}$/.test(plate)
    ) {
      toast.error("Placa inválida — Mercosul: ABC1D23 · Antigo: ABC1234");
      return;
    }

    const payload = {
      ...data,
      plate: requiresPlate ? plate : undefined,
      withoutPlate: !!data.withoutPlate,
      type: data.withoutPlate ? "UTILITY" : data.type,
      category: data.withoutPlate
        ? `MAQUINA_PESADA${data.category ? `:${data.category}` : ""}`
        : data.category,
      fuelType: data.withoutPlate ? data.fuelType || "DIESEL" : data.fuelType,
    };

    createVehicle.mutate(payload as any);
  };

  const filtered = vehicles.filter((v) => {
    if (typeFilter && v.type !== typeFilter) return false;
    return [v.plate, v.model, v.brand, String(v.tag ?? "")].some((s) =>
      s.toLowerCase().includes(headerSearch.toLowerCase()),
    );
  });

  const sortedVehicles = [...filtered].sort((a, b) => {
    switch (vehicleSortBy) {
      case "plate-desc":
        return vehicleCode(b).localeCompare(vehicleCode(a), "pt-BR", {
          numeric: true,
        });
      case "km-desc":
        return b.currentKm - a.currentKm;
      case "maintenance-asc": {
        const aTime = a.nextMaintenanceDate
          ? new Date(a.nextMaintenanceDate).getTime()
          : Number.POSITIVE_INFINITY;
        const bTime = b.nextMaintenanceDate
          ? new Date(b.nextMaintenanceDate).getTime()
          : Number.POSITIVE_INFINITY;
        return aTime - bTime;
      }
      case "plate-asc":
      default:
        return vehicleCode(a).localeCompare(vehicleCode(b), "pt-BR", {
          numeric: true,
        });
    }
  });

  const filteredOil = oilRecords.filter((r) => {
    const target =
      `${r.vehicle?.plate ?? ""} ${r.vehicle?.brand ?? ""} ${r.vehicle?.model ?? ""}`.toLowerCase();
    return target.includes(headerSearch.toLowerCase());
  });

  const counts = {
    "": vehicles.length,
    ACTIVE: vehicles.filter((v) => v.status === "ACTIVE").length,
    MAINTENANCE: vehicles.filter((v) => v.status === "MAINTENANCE").length,
    INACTIVE: vehicles.filter((v) => v.status === "INACTIVE").length,
  };

  const overdueOil = oilRecords.filter((r) => r.status === "OVERDUE").length;

  // ── Field helper ──
  function Field({
    label,
    required,
    children,
    span2,
  }: {
    label: string;
    required?: boolean;
    children: React.ReactNode;
    span2?: boolean;
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
        title="Frota"
        breadcrumbs={[{ label: "Frota" }]}
        searchQuery={headerSearch}
        onSearchQueryChange={setHeaderSearch}
        searchPlaceholder={
          section === "vehicles"
            ? "Buscar placa, TAG, marca ou modelo..."
            : "Buscar por placa/modelo..."
        }
      />

      <div className="p-6 space-y-5 max-w-[1600px] mx-auto">
        {/* ── Section tabs ── */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center bg-white border border-brand-border rounded-xl p-1 gap-0.5 w-fit">
            {SECTION_TABS.map((tab) => {
              const Icon = tab.icon;
              const active = section === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setSection(tab.key as typeof section)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-primary-600 text-white shadow-sm"
                      : "text-brand-text-secondary hover:text-brand-text-primary hover:bg-slate-50",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.key === "oil" && overdueOil > 0 && (
                    <span className="w-5 h-5 bg-danger-500 text-white text-2xs font-bold rounded-full flex items-center justify-center">
                      {overdueOil}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {section === "vehicles" && selectedVehicle && (
              <span className="hidden md:inline-flex text-xs font-medium text-brand-text-secondary bg-slate-100 px-2 py-1 rounded-md">
                Selecionado: {vehicleCode(selectedVehicle)}
              </span>
            )}
            {section === "oil" && selectedOil && (
              <span className="hidden md:inline-flex text-xs font-medium text-brand-text-secondary bg-slate-100 px-2 py-1 rounded-md">
                Selecionado: {selectedOil.vehicle?.plate ?? "Registro"}
              </span>
            )}

            {section === "vehicles" ? (
              <Button
                size="sm"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => setVehicleModal(true)}
              >
                Cadastrar Veículo
              </Button>
            ) : (
              <Button
                size="sm"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => setOilModal(true)}
              >
                Registrar Troca
              </Button>
            )}

            <Button
              size="sm"
              variant="secondary"
              leftIcon={<Pencil className="w-4 h-4" />}
              disabled={
                section === "vehicles" ? !selectedVehicle : !selectedOil
              }
              onClick={() => {
                if (section === "vehicles" && selectedVehicle) {
                  setDetailVehicle(selectedVehicle);
                  return;
                }
                if (section === "oil" && selectedOil) {
                  setDetailOil(selectedOil);
                }
              }}
            >
              Editar
            </Button>

            <Button
              size="sm"
              variant="danger"
              leftIcon={<Trash2 className="w-4 h-4" />}
              disabled={
                section === "vehicles" ? !selectedVehicle : !selectedOil
              }
              onClick={() => {
                if (section === "vehicles" && selectedVehicle) {
                  if (
                    confirm(
                      `Deseja remover o veículo ${vehicleCode(selectedVehicle)}?`,
                    )
                  ) {
                    deleteVehicle.mutate(selectedVehicle.id);
                  }
                  return;
                }
                if (section === "oil" && selectedOil) {
                  if (
                    confirm(
                      `Deseja remover o registro de troca do veículo ${selectedOil.vehicle?.plate ?? ""}?`,
                    )
                  ) {
                    deleteOilChange.mutate({
                      vehicleId: selectedOil.vehicleId,
                      id: selectedOil.id,
                    });
                  }
                }
              }}
            >
              Excluir
            </Button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* ════ VEHICLES SECTION ════ */}
          {section === "vehicles" && (
            <motion.div
              key="vehicles"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              {/* Toolbar */}
              <div className="flex items-center gap-3 flex-wrap">
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
                        {counts[tab.key as keyof typeof counts]}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center bg-white border border-brand-border rounded-xl p-1 gap-0.5">
                  {[
                    { key: "", label: "Todos" },
                    { key: "CAR", label: "Carros" },
                    { key: "MOTORCYCLE", label: "Motos" },
                    { key: "TRUCK", label: "Caminhões" },
                    { key: "UTILITY", label: "Utilitários" },
                    { key: "VAN", label: "Vans" },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setTypeFilter(tab.key)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                        typeFilter === tab.key
                          ? "bg-primary-600 text-white shadow-sm"
                          : "text-brand-text-secondary hover:text-brand-text-primary hover:bg-slate-50",
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <ViewToggle mode={viewMode} onChange={setViewMode} />

                <div className="flex items-center gap-2 bg-white border border-brand-border rounded-xl px-3 py-1.5">
                  <label
                    htmlFor="fleet-sort"
                    className="text-xs font-medium text-brand-text-secondary"
                  >
                    Ordenar:
                  </label>
                  <select
                    id="fleet-sort"
                    value={vehicleSortBy}
                    onChange={(e) =>
                      setVehicleSortBy(
                        e.target.value as
                          | "plate-asc"
                          | "plate-desc"
                          | "km-desc"
                          | "maintenance-asc",
                      )
                    }
                    className="bg-transparent text-sm font-medium text-brand-text-primary outline-none"
                  >
                    <option value="plate-asc">Código/Placa (A-Z)</option>
                    <option value="plate-desc">Código/Placa (Z-A)</option>
                    <option value="km-desc">Maior KM</option>
                    <option value="maintenance-asc">
                      Manutenção mais próxima
                    </option>
                  </select>
                </div>

                {!loadingVehicles && (
                  <span className="text-sm text-brand-text-secondary">
                    <span className="font-semibold text-brand-text-primary">
                      {sortedVehicles.length}
                    </span>{" "}
                    veículos
                  </span>
                )}
              </div>

              {/* Maintenance alert */}
              {!loadingVehicles &&
                sortedVehicles.some(
                  (v) =>
                    v.nextMaintenanceDate &&
                    new Date(v.nextMaintenanceDate) <=
                      new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) &&
                    v.status === "ACTIVE",
                ) && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-3.5 bg-warning-50 border border-warning-200 rounded-xl text-sm"
                  >
                    <AlertTriangle className="w-5 h-5 text-warning-500 flex-shrink-0" />
                    <span className="text-warning-700 font-medium">
                      Alguns veículos estão com manutenção próxima do
                      vencimento.
                    </span>
                    <Badge variant="warning" className="ml-auto">
                      Atenção
                    </Badge>
                  </motion.div>
                )}

              {/* Grid / List */}
              {loadingVehicles ? (
                viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <SkeletonCard key={i} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-brand-border overflow-hidden">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 px-5 py-4 border-b border-brand-border/50 last:border-b-0"
                      >
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-20 ml-auto" />
                      </div>
                    ))}
                  </div>
                )
              ) : sortedVehicles.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-24 text-brand-text-secondary"
                >
                  <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                    <Truck className="w-10 h-10 opacity-30" />
                  </div>
                  <p className="font-semibold">Nenhum veículo encontrado</p>
                  <p className="text-sm mt-1 opacity-70">
                    Tente ajustar os filtros ou cadastre um novo veículo.
                  </p>
                </motion.div>
              ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                  <AnimatePresence>
                    {sortedVehicles.map((v, i) => (
                      <motion.div
                        key={v.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25, delay: i * 0.03 }}
                      >
                        <VehicleCard
                          vehicle={v}
                          selected={selectedVehicle?.id === v.id}
                          onClick={() => {
                            setSelectedOil(null);
                            setSelectedVehicle(v);
                            setDetailVehicle(v);
                          }}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-2xl border border-brand-border overflow-hidden"
                >
                  {/* List header */}
                  <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_120px_120px_100px] gap-4 px-5 py-3 bg-slate-50/80 border-b border-brand-border/50 text-xs font-semibold text-brand-text-secondary uppercase tracking-wider">
                    <span>Veículo</span>
                    <span>Tipo / Combustível</span>
                    <span>KM</span>
                    <span>Filial</span>
                    <span>Status</span>
                    <span className="text-right">Rotas</span>
                  </div>
                  <AnimatePresence>
                    {sortedVehicles.map((v, i) => {
                      const fuelInfo = FUEL_LABELS[v.fuelType ?? ""];
                      const heavyMachine = isHeavyMachine(v);
                      return (
                        <motion.div
                          key={v.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          transition={{ duration: 0.2, delay: i * 0.02 }}
                          onClick={() => {
                            setSelectedOil(null);
                            setSelectedVehicle(v);
                            setDetailVehicle(v);
                          }}
                          className={cn(
                            "grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_120px_120px_100px] gap-2 md:gap-4 items-center px-5 py-3.5 border-b border-brand-border/30 last:border-b-0 cursor-pointer transition-colors hover:bg-slate-50/80",
                            selectedVehicle?.id === v.id && "bg-primary-50/50",
                          )}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                              <Truck className="w-4 h-4 text-brand-text-secondary" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-plate text-sm font-black text-brand-text-primary tracking-wider truncate">
                                {vehicleCode(v)}
                                {v.tag !== undefined && (
                                  <span className="text-2xs font-bold text-primary-600 bg-primary-50 px-1 py-0.5 rounded ml-1.5">
                                    #{v.tag}
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-brand-text-secondary truncate">
                                {v.brand} {v.model} · {v.year}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-brand-text-secondary">
                            <span>{TYPE_LABELS[v.type] ?? v.type}</span>
                            {fuelInfo && (
                              <span
                                className={cn("font-medium", fuelInfo.color)}
                              >
                                {fuelInfo.label}
                              </span>
                            )}
                          </div>

                          <div className="text-sm font-medium text-brand-text-primary tabular-nums">
                            {v.currentKm.toLocaleString("pt-BR")}{" "}
                            {heavyMachine ? "h" : "km"}
                          </div>

                          <span className="text-xs text-brand-text-secondary truncate">
                            {v.branch?.name ?? "—"}
                          </span>

                          <VehicleStatusBadge status={v.status} />

                          <span className="text-xs text-brand-text-secondary text-right tabular-nums">
                            {v._count.routes}
                          </span>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ════ OIL SECTION ════ */}
          {section === "oil" && (
            <motion.div
              key="oil"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              {overdueOil > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-3.5 bg-danger-50 border border-danger-200 rounded-xl text-sm"
                >
                  <Droplets className="w-5 h-5 text-danger-500 flex-shrink-0 animate-pulse" />
                  <span className="text-danger-700 font-medium">
                    {overdueOil} veículo(s) com troca de óleo em atraso.
                  </span>
                  <Badge variant="danger" className="ml-auto">
                    {overdueOil} Atrasado(s)
                  </Badge>
                </motion.div>
              )}

              {loadingOil ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : oilRecords.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-24 text-brand-text-secondary"
                >
                  <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                    <Droplets className="w-10 h-10 opacity-30" />
                  </div>
                  <p className="font-semibold">
                    Nenhum registro de troca de óleo
                  </p>
                  <p className="text-sm mt-1 opacity-70">
                    Registre a primeira troca de óleo de um veículo.
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                  <AnimatePresence>
                    {filteredOil.map((rec, i) => (
                      <motion.div
                        key={rec.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25, delay: i * 0.03 }}
                        className={cn(
                          selectedOil?.id === rec.id &&
                            "ring-2 ring-primary-200 rounded-2xl",
                        )}
                        onClick={() => {
                          setSelectedVehicle(null);
                          setSelectedOil(rec);
                          setDetailOil(rec);
                        }}
                      >
                        <OilChangeCard
                          record={rec}
                          onRegister={() => {
                            oForm.setValue("vehicleId", rec.vehicleId);
                            setOilModal(true);
                          }}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ════ VEHICLE MODAL ════ */}
      <Modal
        open={vehicleModal}
        onClose={() => {
          setVehicleModal(false);
          vReset();
        }}
        title="Novo Veículo"
        description="Cadastre o veículo na frota. Campos com * são obrigatórios."
        size="xl"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setVehicleModal(false);
                vReset();
              }}
            >
              Cancelar
            </Button>
            <Button
              loading={createVehicle.isPending}
              onClick={vhs(submitVehicle)}
            >
              Cadastrar Veículo
            </Button>
          </>
        }
      >
        <form className="space-y-3 max-h-[62vh] overflow-y-auto pr-1 scrollbar-thin">
          {/* ── Identificação ── */}
          <FormSection title="Identificação Básica" icon={Truck} defaultOpen>
            {heavyMachinesEnabled && (
              <div className="col-span-2 -mt-1 mb-1 flex items-center justify-between rounded-lg border border-brand-border bg-slate-50 px-3 py-2">
                <div>
                  <p className="text-sm font-medium text-brand-text-primary">
                    Máquina pesada (sem placa)
                  </p>
                  <p className="text-xs text-brand-text-secondary">
                    Ative para tratores, escavadeiras e outros equipamentos sem
                    placa.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = !withoutPlateVal;
                    vSv("withoutPlate", next);
                    if (next) {
                      vSv("plate", "");
                      vSv("type", "UTILITY");
                      if (!vw("fuelType")) vSv("fuelType", "DIESEL");
                    }
                    vSv("brand", "");
                    vSv("model", "");
                  }}
                  className={cn(
                    "relative inline-flex h-7 w-12 items-center rounded-full transition-colors",
                    withoutPlateVal ? "bg-primary-600" : "bg-slate-300",
                  )}
                  aria-pressed={withoutPlateVal}
                >
                  <span
                    className={cn(
                      "inline-block h-5 w-5 transform rounded-full bg-white transition-transform",
                      withoutPlateVal ? "translate-x-6" : "translate-x-1",
                    )}
                  />
                </button>
              </div>
            )}

            <Field
              label={withoutPlateVal ? "Identificador interno" : "Placa"}
              required={!withoutPlateVal}
            >
              <input
                {...vr("plate")}
                value={plateVal}
                onChange={(e) =>
                  vSv("plate", applyMaskPlate(e.target.value), {
                    shouldValidate: true,
                  })
                }
                placeholder={
                  withoutPlateVal ? "Gerado automaticamente" : "ABC1D23"
                }
                maxLength={7}
                disabled={withoutPlateVal}
                className={cn(
                  "input-base font-plate uppercase tracking-widest",
                  ve.plate && "border-danger-400",
                  withoutPlateVal && "opacity-60 cursor-not-allowed",
                )}
              />
              <p className="text-xs text-brand-text-secondary mt-1">
                {withoutPlateVal
                  ? "Código interno será criado automaticamente (ex.: HMQ0001)."
                  : "Mercosul: ABC1D23 · Antigo: ABC1234"}
              </p>
            </Field>

            <Field label="TAG">
              <input
                {...vr("tag")}
                type="number"
                placeholder="Ex: 10"
                className="input-base"
              />
            </Field>

            <Field label="Tipo" required>
              <select
                {...vr("type")}
                value={typeVal}
                onChange={(e) => {
                  vSv("type", e.target.value, { shouldValidate: true });
                  vSv("brand", "");
                  vSv("model", "");
                }}
                disabled={withoutPlateVal}
                className={cn(
                  "input-base",
                  ve.type && "border-danger-400",
                  withoutPlateVal && "opacity-60 cursor-not-allowed",
                )}
              >
                <option value="">Selecionar...</option>
                {Object.entries(TYPE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Marca" required>
              <select
                {...vr("brand")}
                value={brandVal}
                onChange={(e) => {
                  vSv("brand", e.target.value, { shouldValidate: true });
                  vSv("model", "");
                }}
                disabled={!typeVal}
                className={cn(
                  "input-base",
                  ve.brand && "border-danger-400",
                  !typeVal && "opacity-50 cursor-not-allowed",
                )}
              >
                <option value="">
                  {typeVal
                    ? "Selecionar marca..."
                    : "Selecione o tipo primeiro"}
                </option>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Modelo" required>
              <select
                {...vr("model")}
                value={vw("model") ?? ""}
                onChange={(e) =>
                  vSv("model", e.target.value, { shouldValidate: true })
                }
                disabled={!brandVal}
                className={cn(
                  "input-base",
                  ve.model && "border-danger-400",
                  !brandVal && "opacity-50 cursor-not-allowed",
                )}
              >
                <option value="">
                  {brandVal
                    ? "Selecionar modelo..."
                    : "Selecione a marca primeiro"}
                </option>
                {models.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Ano Modelo" required>
              <input
                {...vr("year")}
                type="number"
                placeholder={String(new Date().getFullYear())}
                className={cn("input-base", ve.year && "border-danger-400")}
              />
            </Field>

            <Field label="Ano Fabricação">
              <input
                {...vr("manufacturingYear")}
                type="number"
                placeholder="Ex: 2023"
                className="input-base"
              />
            </Field>

            <Field label="Combustível" required>
              <select
                {...vr("fuelType")}
                className={cn("input-base", ve.fuelType && "border-danger-400")}
              >
                <option value="">Selecionar...</option>
                {Object.entries(FUEL_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="KM Atual" required>
              <input
                {...vr("currentKm")}
                type="number"
                placeholder="0"
                className={cn(
                  "input-base",
                  ve.currentKm && "border-danger-400",
                )}
              />
              <p className="text-xs text-brand-text-secondary mt-1">
                {withoutPlateVal
                  ? "Para máquina pesada este valor representa horas trabalhadas."
                  : "Quilometragem atual do veículo."}
              </p>
            </Field>

            <Field
              label={
                withoutPlateVal
                  ? "Próx. Manutenção (horas)"
                  : "KM Próx. Revisão"
              }
            >
              <input
                {...vr("nextMaintenanceKm")}
                type="number"
                placeholder="Opcional"
                className="input-base"
              />
            </Field>

            <Field label="Responsável">
              <input
                {...vr("responsiblePerson")}
                placeholder="Nome do responsável"
                className="input-base"
              />
            </Field>

            <Field label="Categoria">
              <input
                {...vr("category")}
                placeholder="Ex: PARTICULAR, COMERCIAL"
                className="input-base"
              />
            </Field>
          </FormSection>

          {/* ── Documentação ── */}
          <FormSection
            title="Documentação (CRLV / DETRAN)"
            icon={FileText}
            defaultOpen={false}
          >
            <Field label="RENAVAM">
              <input
                {...vr("renavam")}
                placeholder="Código RENAVAM"
                className="input-base font-mono"
              />
            </Field>
            <Field label="Nº CRV">
              <input
                {...vr("crvNumber")}
                placeholder="Número do CRV"
                className="input-base font-mono"
              />
            </Field>
            <Field label="Nº Chassi">
              <input
                {...vr("chassisNumber")}
                placeholder="Número do chassi"
                className="input-base font-mono"
              />
            </Field>
            <Field label="Cód. Segurança CLA">
              <input
                {...vr("securityCode")}
                placeholder="Código de segurança"
                className="input-base font-mono"
              />
            </Field>
            <Field label="Vigência do Documento">
              <input
                {...vr("documentExpiry")}
                type="date"
                className="input-base"
              />
            </Field>
            <Field label="Código do Motor">
              <input
                {...vr("engineCode")}
                placeholder="Código do motor"
                className="input-base font-mono"
              />
            </Field>
          </FormSection>

          {/* ── Especificações ── */}
          <FormSection
            title="Especificações Técnicas"
            icon={Settings2}
            defaultOpen={false}
          >
            <Field label="Potência / Cilindrada">
              <input
                {...vr("horsepower")}
                placeholder="Ex: 75 CV / 999"
                className="input-base"
              />
            </Field>
            <Field label="Peso Bruto Total">
              <input
                {...vr("grossWeight")}
                placeholder="Ex: 1.47 t"
                className="input-base"
              />
            </Field>
            <Field label="Eixos">
              <input
                {...vr("axles")}
                placeholder="Ex: 2 ou 6x2"
                className="input-base"
              />
            </Field>
            <Field label="CMT">
              <input
                {...vr("cmt")}
                placeholder="Capacidade máx. tração"
                className="input-base"
              />
            </Field>
            <Field label="Lotação">
              <input
                {...vr("seats")}
                placeholder="Ex: 05P"
                className="input-base"
              />
            </Field>
            <Field label="Cap. Tanque (L)">
              <input
                {...vr("tankCapacity")}
                type="number"
                placeholder="Ex: 48"
                className="input-base"
              />
            </Field>
            <Field
              label={
                withoutPlateVal
                  ? "Intervalo de manutenção (horas)"
                  : "Intervalo Troca de Óleo (km)"
              }
            >
              <input
                {...vr("oilChangeIntervalKm")}
                type="number"
                placeholder="Ex: 10000"
                className="input-base"
              />
              <p className="text-xs text-brand-text-secondary mt-1">
                {withoutPlateVal
                  ? "Exemplo: 250h, 500h, 1000h (controle por horímetro)."
                  : "Padrão: 10.000 km (carros) / 1.000 km (motos)"}
              </p>
            </Field>
          </FormSection>
        </form>
      </Modal>

      {/* ════ OIL CHANGE MODAL ════ */}
      <Modal
        open={oilModal}
        onClose={() => {
          setOilModal(false);
          oReset();
        }}
        title="Registrar Troca de Óleo"
        description="Informe os dados da troca de óleo realizada."
        size="md"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setOilModal(false);
                oReset();
              }}
            >
              Cancelar
            </Button>
            <Button
              loading={createOil.isPending}
              onClick={ohs((d) => createOil.mutate(d))}
            >
              Registrar
            </Button>
          </>
        }
      >
        <form className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">
              Veículo *
            </label>
            <select
              {...or("vehicleId")}
              className={cn("input-base", oe.vehicleId && "border-danger-400")}
            >
              <option value="">Selecionar veículo...</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {vehicleCode(v)} — {v.brand} {v.model}
                </option>
              ))}
            </select>
            {oe.vehicleId && (
              <p className="text-danger-500 text-xs mt-1">
                {oe.vehicleId.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">
              Data da Troca
            </label>
            <input {...or("changeDate")} type="date" className="input-base" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">
              KM na Troca
            </label>
            <input
              {...or("changeKm")}
              type="number"
              placeholder="Ex: 50000"
              className="input-base"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">
              Próxima Troca (km)
            </label>
            <input
              {...or("nextChangeKm")}
              type="number"
              placeholder="Calculado automaticamente"
              className="input-base"
            />
            <p className="text-xs text-brand-text-secondary mt-1">
              Deixe em branco para usar o intervalo do veículo
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">
              Tipo de Óleo
            </label>
            <input
              {...or("oilType")}
              placeholder="Ex: 0W20, 5W30"
              className="input-base"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">
              Responsável
            </label>
            <input
              {...or("responsibleName")}
              placeholder="Nome do mecânico/oficina"
              className="input-base"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">
              Observações
            </label>
            <input
              {...or("notes")}
              placeholder="Opcional"
              className="input-base"
            />
          </div>
        </form>
      </Modal>

      {/* ════ VEHICLE DETAIL MODAL ════ */}
      {detailVehicle && (
        <Modal
          open={!!detailVehicle}
          onClose={() => setDetailVehicle(null)}
          title={`${detailVehicle.brand} ${detailVehicle.model}`}
          description={`Identificação: ${vehicleCode(detailVehicle)}${detailVehicle.tag !== undefined ? ` · TAG #${detailVehicle.tag}` : ""}`}
          size="xl"
          footer={
            <Button variant="secondary" onClick={() => setDetailVehicle(null)}>
              Fechar
            </Button>
          }
        >
          <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1 scrollbar-thin">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Placa", value: detailVehicle.plate, mono: true },
                {
                  label: "Status",
                  value: <VehicleStatusBadge status={detailVehicle.status} />,
                },
                {
                  label: "KM Atual",
                  value: `${detailVehicle.currentKm.toLocaleString("pt-BR")} km`,
                },
                {
                  label: "Tipo",
                  value: TYPE_LABELS[detailVehicle.type] ?? detailVehicle.type,
                },
                {
                  label: "Combustível",
                  value:
                    FUEL_LABELS[detailVehicle.fuelType ?? ""]?.label ?? "—",
                },
                { label: "Rotas", value: detailVehicle._count.routes },
              ].map((item) => (
                <div key={item.label} className="bg-slate-50 rounded-xl p-3">
                  <div className="text-xs text-brand-text-secondary mb-1">
                    {item.label}
                  </div>
                  <div
                    className={cn(
                      "text-sm font-semibold text-brand-text-primary",
                      item.mono && "font-plate",
                    )}
                  >
                    {item.value as React.ReactNode}
                  </div>
                </div>
              ))}
            </div>

            {/* Specs */}
            {(detailVehicle.tankCapacity ||
              detailVehicle.horsepower ||
              detailVehicle.seats ||
              detailVehicle.oilChangeIntervalKm) && (
              <div>
                <p className="text-xs font-semibold text-brand-text-secondary uppercase tracking-wider mb-2">
                  Especificações
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      label: "Tanque",
                      value: detailVehicle.tankCapacity
                        ? `${detailVehicle.tankCapacity} L`
                        : null,
                    },
                    { label: "Potência", value: detailVehicle.horsepower },
                    { label: "Lotação", value: detailVehicle.seats },
                    { label: "Peso Bruto", value: detailVehicle.grossWeight },
                    { label: "Eixos", value: detailVehicle.axles },
                    {
                      label: "Int. Óleo",
                      value: detailVehicle.oilChangeIntervalKm
                        ? `${detailVehicle.oilChangeIntervalKm.toLocaleString("pt-BR")} km`
                        : null,
                    },
                  ]
                    .filter((i) => i.value)
                    .map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2 text-xs"
                      >
                        <span className="text-brand-text-secondary">
                          {item.label}
                        </span>
                        <span className="font-semibold text-brand-text-primary">
                          {item.value}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Docs */}
            {(detailVehicle.renavam ||
              detailVehicle.chassisNumber ||
              detailVehicle.crvNumber ||
              detailVehicle.documentExpiry) && (
              <div>
                <p className="text-xs font-semibold text-brand-text-secondary uppercase tracking-wider mb-2">
                  Documentação
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "RENAVAM", value: detailVehicle.renavam },
                    { label: "Nº CRV", value: detailVehicle.crvNumber },
                    { label: "Chassi", value: detailVehicle.chassisNumber },
                    { label: "Categoria", value: detailVehicle.category },
                    {
                      label: "Vigência Doc.",
                      value: detailVehicle.documentExpiry
                        ? format(
                            parseISO(detailVehicle.documentExpiry),
                            "dd/MM/yyyy",
                          )
                        : null,
                    },
                    {
                      label: "Responsável",
                      value: detailVehicle.responsiblePerson,
                    },
                  ]
                    .filter((i) => i.value)
                    .map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2 text-xs"
                      >
                        <span className="text-brand-text-secondary">
                          {item.label}
                        </span>
                        <span className="font-semibold font-mono text-brand-text-primary">
                          {item.value}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* ════ OIL DETAIL MODAL ════ */}
      {detailOil && (
        <Modal
          open={!!detailOil}
          onClose={() => setDetailOil(null)}
          title={`Troca de Óleo — ${detailOil.vehicle?.plate ?? "—"}`}
          description={
            `${detailOil.vehicle?.brand ?? ""} ${detailOil.vehicle?.model ?? ""}`.trim() ||
            undefined
          }
          size="md"
          footer={
            <div className="flex items-center justify-between w-full">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  oForm.setValue("vehicleId", detailOil.vehicleId);
                  setOilModal(true);
                  setDetailOil(null);
                }}
              >
                Registrar Nova Troca
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setDetailOil(null)}
              >
                Fechar
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            {/* Status banner */}
            {(() => {
              const cfg = OIL_STATUS_CONFIG[detailOil.status];
              return (
                <div
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold",
                    cfg.bg,
                    cfg.border,
                    cfg.color,
                  )}
                >
                  <Droplets className="w-4 h-4 flex-shrink-0" />
                  {cfg.label}
                </div>
              );
            })()}

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { label: "Placa", value: detailOil.vehicle?.plate, mono: true },
                {
                  label: "Veículo",
                  value:
                    `${detailOil.vehicle?.brand ?? ""} ${detailOil.vehicle?.model ?? ""}`.trim() ||
                    null,
                },
                {
                  label: "Última Troca",
                  value: detailOil.changeDate
                    ? format(parseISO(detailOil.changeDate), "dd/MM/yyyy")
                    : null,
                },
                {
                  label: "KM da Troca",
                  value:
                    detailOil.changeKm != null
                      ? `${detailOil.changeKm.toLocaleString("pt-BR")} km`
                      : null,
                },
                {
                  label: "KM Atual",
                  value:
                    detailOil.currentKm != null
                      ? `${detailOil.currentKm.toLocaleString("pt-BR")} km`
                      : null,
                },
                {
                  label: "Próxima Troca",
                  value:
                    detailOil.nextChangeKm != null
                      ? `${detailOil.nextChangeKm.toLocaleString("pt-BR")} km`
                      : null,
                  danger: detailOil.status === "OVERDUE",
                },
                {
                  label: "KM Percorrido",
                  value:
                    detailOil.kmDriven != null
                      ? `${detailOil.kmDriven.toLocaleString("pt-BR")} km`
                      : null,
                },
                { label: "Tipo de Óleo", value: detailOil.oilType },
              ]
                .filter((i) => i.value)
                .map((item) => (
                  <div
                    key={item.label}
                    className="bg-slate-50 rounded-lg px-3 py-2.5"
                  >
                    <p className="text-brand-text-secondary mb-0.5">
                      {item.label}
                    </p>
                    <p
                      className={cn(
                        "font-semibold text-brand-text-primary",
                        item.mono && "font-plate",
                        item.danger && "text-danger-600",
                      )}
                    >
                      {item.value}
                    </p>
                  </div>
                ))}
            </div>

            {detailOil.responsibleName && (
              <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5 text-sm border border-brand-border/60">
                <User className="w-4 h-4 text-brand-text-secondary flex-shrink-0" />
                <span className="text-brand-text-secondary">Responsável:</span>
                <span className="font-semibold text-brand-text-primary">
                  {detailOil.responsibleName}
                </span>
              </div>
            )}

            {detailOil.notes && (
              <div className="bg-slate-50 rounded-xl px-4 py-3">
                <p className="text-xs text-brand-text-secondary mb-1">
                  Observações
                </p>
                <p className="text-sm text-brand-text-primary">
                  {detailOil.notes}
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
