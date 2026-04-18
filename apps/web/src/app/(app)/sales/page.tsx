"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ShoppingCart,
  DollarSign,
  Clock,
  Truck,
  XCircle,
  Plus,
  Search,
  ChevronRight,
  X,
  Loader2,
  Calendar,
  AlertCircle,
  Check,
  Trash2,
  Edit2,
  Package,
  FileText,
  User,
  MapPin,
  CreditCard,
  Hash,
  TrendingUp,
  BarChart3,
  Filter,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import api from "@/lib/api";
import { cn } from "@/lib/cn";
import { usePersistedViewMode } from "@/lib/use-persisted-view-mode";
import { Header } from "@/components/layout/header";
import { DetailPanel } from "@/components/ui/detail-panel";
import {
  ViewModeToggle,
  VIEW_TOGGLE_PRESETS,
} from "@/components/ui/view-toggle";
import { EmptyStateCard } from "@/components/ui/state-feedback";

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

interface SaleOrder {
  id: string;
  clientId?: string;
  orderNumber: string;
  clientName: string;
  clientDoc: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  sellerId: string;
  sellerName: string;
  supplierId: string;
  supplierName: string;
  invoiceNumber?: string;
  paymentMethod: string;
  dueDate: string;
  isPriceLocked: boolean;
  isSafra: boolean;
  safraDescription?: string;
  notes?: string;
  items: OrderItem[];
  totalAmount: number;
  status: keyof typeof STATUS_LABEL;
  deliveryStatus: keyof typeof DELIVERY_STATUS_LABEL;
  createdAt: string;
  updatedAt: string;
}

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface Seller {
  id: string;
  name: string;
  email: string;
}

interface Supplier {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  salePrice: number;
}

interface Client {
  id: string;
  name: string;
  doc?: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
}

interface SellerPerformance {
  id: string;
  name: string;
  totalOrders: number;
  totalRevenue: number;
  deliveredCount: number;
}

const STATUS_COLOR: Record<string, string> = {
  DRAFT: "text-slate-600 bg-slate-100 border-slate-200",
  CONFIRMED: "text-blue-600 bg-blue-50 border-blue-200",
  PARTIALLY_DELIVERED: "text-orange-600 bg-orange-50 border-orange-200",
  DELIVERED: "text-emerald-600 bg-emerald-50 border-emerald-200",
  CANCELLED: "text-red-600 bg-red-50 border-red-200",
  INVOICED: "text-purple-600 bg-purple-50 border-purple-200",
};

const STATUS_ACCENT: Record<string, string> = {
  DRAFT: "border-l-slate-400",
  CONFIRMED: "border-l-blue-500",
  PARTIALLY_DELIVERED: "border-l-orange-500",
  DELIVERED: "border-l-emerald-500",
  CANCELLED: "border-l-red-500",
  INVOICED: "border-l-purple-500",
};

const STATUS_HEADER_BG: Record<string, string> = {
  DRAFT: "from-slate-500 to-slate-600",
  CONFIRMED: "from-blue-500 to-blue-600",
  PARTIALLY_DELIVERED: "from-orange-500 to-orange-600",
  DELIVERED: "from-emerald-500 to-emerald-600",
  CANCELLED: "from-red-500 to-red-600",
  INVOICED: "from-purple-500 to-purple-600",
};

const STATUS_LABEL: Record<string, string> = {
  DRAFT: "Rascunho",
  CONFIRMED: "Confirmado",
  PARTIALLY_DELIVERED: "Parcial",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
  INVOICED: "Faturado",
};

const DELIVERY_STATUS_COLOR: Record<string, string> = {
  PENDING: "text-amber-600 bg-amber-50",
  IN_TRANSIT: "text-blue-600 bg-blue-50",
  DELIVERED: "text-emerald-600 bg-emerald-50",
  RETURNED: "text-red-600 bg-red-50",
  TO_VERIFY: "text-orange-600 bg-orange-50",
  PARTIAL: "text-purple-600 bg-purple-50",
};

const DELIVERY_STATUS_LABEL: Record<string, string> = {
  PENDING: "Pendente",
  IN_TRANSIT: "Em Trânsito",
  DELIVERED: "Entregue",
  RETURNED: "Devolvida",
  TO_VERIFY: "A Verificar",
  PARTIAL: "Parcial",
};

const PAYMENT_METHODS = [
  { value: "CASH", label: "Dinheiro" },
  { value: "PIX", label: "PIX" },
  { value: "BANK_SLIP", label: "Boleto" },
  { value: "CREDIT_CARD", label: "Cartão Crédito" },
  { value: "DEBIT_CARD", label: "Cartão Débito" },
  { value: "TRANSFER", label: "Transferência" },
];

const PAYMENT_LABEL: Record<string, string> = Object.fromEntries(
  PAYMENT_METHODS.map((m) => [m.value, m.label]),
);

const BRL_FORMATTER = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function formatBRL(value: number) {
  return BRL_FORMATTER.format(Number(value || 0));
}

function formatBRLFromCents(value: number) {
  return BRL_FORMATTER.format(Number(value || 0) / 100);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR");
}

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const OrderItemSchema = z.object({
  productId: z.string().min(1, "Produto é obrigatório"),
  quantity: z.number().min(1, "Quantidade deve ser maior que 0"),
  unitPrice: z.number().min(0, "Preço deve ser válido"),
});

const CreateSaleOrderSchema = z.object({
  clientId: z.string().optional(),
  clientName: z.string().min(1, "Nome do cliente é obrigatório"),
  clientDoc: z.string().optional(),
  clientEmail: z.string().optional(),
  clientPhone: z.string().optional(),
  clientAddress: z.string().optional(),
  sellerId: z.string().min(1, "Vendedor é obrigatório"),
  supplierId: z.string().min(1, "Fornecedor é obrigatório"),
  invoiceNumber: z.string().optional(),
  paymentMethod: z.string().min(1, "Método de pagamento é obrigatório"),
  dueDate: z.string().min(1, "Data de vencimento é obrigatória"),
  isPriceLocked: z.boolean(),
  isSafra: z.boolean(),
  safraDescription: z.string().optional(),
  items: z.array(OrderItemSchema).min(1, "Adicione pelo menos um item"),
  notes: z.string().optional(),
});

type CreateSaleOrderInput = z.infer<typeof CreateSaleOrderSchema>;

// ============================================================================
// COMPONENT: KPI CARDS
// ============================================================================

function KPICards({ stats }: { stats: DashboardStats }) {
  const kpis = [
    {
      label: "Total Pedidos",
      value: stats.totalOrders,
      icon: ShoppingCart,
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Receita Total",
      value: formatBRLFromCents(stats.totalRevenue),
      icon: DollarSign,
      bg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      label: "Pendentes",
      value: stats.pendingOrders,
      icon: Clock,
      bg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      label: "Entregues",
      value: stats.deliveredOrders,
      icon: Truck,
      bg: "bg-cyan-50",
      iconColor: "text-cyan-600",
    },
    {
      label: "Cancelados",
      value: stats.cancelledOrders,
      icon: XCircle,
      bg: "bg-red-50",
      iconColor: "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06, duration: 0.35 }}
            className="group relative bg-white rounded-2xl border border-slate-200/80 p-4 hover:shadow-lg hover:border-slate-300 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                  kpi.bg,
                )}
              >
                <Icon className={cn("w-5 h-5", kpi.iconColor)} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500 font-medium truncate">
                  {kpi.label}
                </p>
                <p className="text-xl font-bold text-slate-900 truncate">
                  {kpi.value}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ============================================================================
// COMPONENT: PIPELINE CARD (compacto e elegante)
// ============================================================================

function PipelineCard({
  order,
  onClick,
  selected,
  delay = 0,
}: {
  order: SaleOrder;
  onClick: (order: SaleOrder) => void;
  selected?: boolean;
  delay?: number;
}) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay, duration: 0.2 }}
      onClick={() => onClick(order)}
      className={cn(
        "w-full text-left rounded-xl border bg-white p-4 shadow-sm transition-all duration-150",
        "hover:shadow-lg hover:translate-y-[-2px] hover:border-slate-300",
        selected
          ? "ring-2 ring-primary-400 ring-offset-1 border-primary-300 shadow-md"
          : "border-slate-200/80",
      )}
    >
      {/* Status accent bar */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={cn(
              "w-2 h-2 rounded-full flex-shrink-0 bg-gradient-to-br",
              STATUS_HEADER_BG[order.status],
            )}
          />
          <span className="text-[11px] font-mono font-semibold text-slate-400">
            #{order.orderNumber}
          </span>
        </div>
        <span
          className={cn(
            "inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-md border flex-shrink-0",
            STATUS_COLOR[order.status],
          )}
        >
          {STATUS_LABEL[order.status]}
        </span>
      </div>

      <p className="text-sm font-bold text-slate-900 truncate mb-1">
        {order.clientName}
      </p>

      <div className="flex items-center gap-1.5 mb-3">
        <User className="w-3 h-3 text-slate-400 flex-shrink-0" />
        <span className="text-xs text-slate-500 truncate">
          {order.sellerName || "—"}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
        <span className="text-lg font-bold text-slate-900">
          {formatBRLFromCents(order.totalAmount)}
        </span>
        <div className="flex items-center gap-2">
          {order.deliveryStatus && order.deliveryStatus !== "PENDING" && (
            <span
              className={cn(
                "inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded",
                DELIVERY_STATUS_COLOR[order.deliveryStatus],
              )}
            >
              {DELIVERY_STATUS_LABEL[order.deliveryStatus]}
            </span>
          )}
          <span className="text-[11px] text-slate-400">
            {formatDate(order.createdAt)}
          </span>
        </div>
      </div>
    </motion.button>
  );
}

// ============================================================================
// COMPONENT: PIPELINE TAB (Grade com filtros por status)
// ============================================================================

function PipelineTab({
  orders,
  selectedOrderId,
  onSelectOrder,
}: {
  orders: SaleOrder[];
  selectedOrderId?: string | null;
  onSelectOrder: (order: SaleOrder) => void;
}) {
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = usePersistedViewMode<"cards" | "list">({
    defaultMode: "cards",
    allowedModes: ["cards", "list"],
    storageKeyBase: "view-mode:sales-pipeline",
  });

  const statuses = Object.keys(STATUS_LABEL) as Array<
    keyof typeof STATUS_LABEL
  >;

  const ordersByStatus = useMemo(() => {
    return statuses.reduce(
      (acc, status) => {
        acc[status] = orders.filter((o) => o.status === status);
        return acc;
      },
      {} as Record<string, SaleOrder[]>,
    );
  }, [orders]);

  const filteredOrders = useMemo(() => {
    let result =
      activeFilter === "ALL"
        ? orders
        : orders.filter((o) => o.status === activeFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.clientName.toLowerCase().includes(q) ||
          o.sellerName?.toLowerCase().includes(q),
      );
    }
    return result;
  }, [orders, activeFilter, searchQuery]);

  const totalFiltered = filteredOrders.reduce(
    (s, o) => s + (o.totalAmount || 0),
    0,
  );

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar por pedido, cliente ou vendedor..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
        />
      </div>

      {/* Status filter tags */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setActiveFilter("ALL")}
          className={cn(
            "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium border transition-all duration-150",
            activeFilter === "ALL"
              ? "bg-slate-900 text-white border-slate-900 shadow-sm"
              : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50",
          )}
        >
          <span>Todos</span>
          <span
            className={cn(
              "text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center",
              activeFilter === "ALL"
                ? "bg-white/20 text-white"
                : "bg-slate-100 text-slate-600",
            )}
          >
            {orders.length}
          </span>
        </button>
        {statuses.map((status) => {
          const count = ordersByStatus[status]?.length || 0;
          const isActive = activeFilter === status;
          const statusValue =
            ordersByStatus[status]?.reduce(
              (s, o) => s + (o.totalAmount || 0),
              0,
            ) || 0;
          return (
            <button
              key={status}
              onClick={() => setActiveFilter(isActive ? "ALL" : status)}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium border transition-all duration-150",
                isActive
                  ? "shadow-sm " +
                      STATUS_COLOR[status]
                        .replace("bg-", "bg-")
                        .replace(/border-\S+/, "border-transparent")
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50",
              )}
            >
              <div
                className={cn(
                  "w-2 h-2 rounded-full bg-gradient-to-br flex-shrink-0",
                  STATUS_HEADER_BG[status],
                )}
              />
              <span>{STATUS_LABEL[status]}</span>
              <span
                className={cn(
                  "text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center",
                  isActive
                    ? "bg-white/60 text-current"
                    : "bg-slate-100 text-slate-500",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Summary bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div>
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-800">
              {filteredOrders.length}
            </span>{" "}
            pedido{filteredOrders.length !== 1 ? "s" : ""}
            {activeFilter !== "ALL" && (
              <span>
                {" "}
                em{" "}
                <span className="font-medium">
                  {STATUS_LABEL[activeFilter]}
                </span>
              </span>
            )}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            Clique em um item para abrir os detalhes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ViewModeToggle
            mode={viewMode}
            onChange={setViewMode}
            options={VIEW_TOGGLE_PRESETS.cardsList}
            className="border-slate-200"
          />
          <p className="text-sm font-bold text-slate-700">
            {formatBRLFromCents(totalFiltered)}
          </p>
        </div>
      </div>

      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          <AnimatePresence>
            {filteredOrders.map((order, idx) => (
              <PipelineCard
                key={order.id}
                order={order}
                onClick={onSelectOrder}
                selected={selectedOrderId === order.id}
                delay={idx * 0.015}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filteredOrders.map((order, idx) => (
              <ListOrderRow
                key={order.id}
                order={order}
                onClick={onSelectOrder}
                selected={selectedOrderId === order.id}
                delay={idx * 0.01}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {filteredOrders.length === 0 && (
        <EmptyStateCard
          icon={Package}
          title="Nenhum pedido encontrado"
          description={
            searchQuery
              ? "Tente ajustar a busca"
              : "Nenhum pedido nesta categoria"
          }
          className="bg-white border-slate-200"
        />
      )}
    </div>
  );
}

// ============================================================================
// COMPONENT: LISTA TAB
// ============================================================================

interface ListaFilters {
  search: string;
  status: string;
  deliveryStatus: string;
  sellerId: string;
  supplierId: string;
}

function ListOrderRow({
  order,
  onClick,
  selected,
  delay = 0,
}: {
  order: SaleOrder;
  onClick: (order: SaleOrder) => void;
  selected?: boolean;
  delay?: number;
}) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ delay, duration: 0.15 }}
      onClick={() => onClick(order)}
      className={cn(
        "w-full text-left bg-white rounded-xl border transition-all duration-150 group",
        "hover:shadow-md hover:border-slate-300",
        selected
          ? "border-primary-400 ring-2 ring-primary-100 shadow-md"
          : "border-slate-200/80 shadow-sm",
      )}
    >
      <div className="flex items-center gap-4 px-4 py-3.5">
        <div
          className={cn(
            "w-1 h-10 rounded-full flex-shrink-0 bg-gradient-to-b",
            STATUS_HEADER_BG[order.status],
          )}
        />
        <div className="flex-1 min-w-0 grid grid-cols-12 gap-3 items-center">
          <div className="col-span-4 min-w-0">
            <p className="text-xs font-mono font-semibold text-slate-400">
              #{order.orderNumber}
            </p>
            <p className="text-sm font-semibold text-slate-800 truncate">
              {order.clientName}
            </p>
          </div>
          <div className="col-span-3 min-w-0 hidden md:block">
            <p className="text-xs text-slate-500 truncate">
              <User className="w-3 h-3 inline mr-1" />
              {order.sellerName || "—"}
            </p>
            <p className="text-xs text-slate-400 truncate mt-0.5">
              {order.supplierName || "—"}
            </p>
          </div>
          <div className="col-span-3 flex flex-wrap gap-1">
            <span
              className={cn(
                "inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-md border",
                STATUS_COLOR[order.status],
              )}
            >
              {STATUS_LABEL[order.status]}
            </span>
            <span
              className={cn(
                "inline-flex text-[10px] font-medium px-1.5 py-0.5 rounded",
                DELIVERY_STATUS_COLOR[order.deliveryStatus],
              )}
            >
              {DELIVERY_STATUS_LABEL[order.deliveryStatus]}
            </span>
          </div>
          <div className="col-span-2 text-right">
            <p className="text-sm font-bold text-slate-900">
              {formatBRLFromCents(order.totalAmount)}
            </p>
            <p className="text-[11px] text-slate-400">
              {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors flex-shrink-0" />
      </div>
    </motion.button>
  );
}

function ListaTab({
  orders,
  sellers,
  suppliers,
  selectedOrderId,
  onSelectOrder,
}: {
  orders: SaleOrder[];
  sellers: Seller[];
  suppliers: Supplier[];
  selectedOrderId?: string | null;
  onSelectOrder: (order: SaleOrder) => void;
}) {
  const [filters, setFilters] = useState<ListaFilters>({
    search: "",
    status: "",
    deliveryStatus: "",
    sellerId: "",
    supplierId: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchMatch =
        filters.search === "" ||
        order.orderNumber
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        order.clientName.toLowerCase().includes(filters.search.toLowerCase());
      const statusMatch =
        filters.status === "" || order.status === filters.status;
      const deliveryMatch =
        filters.deliveryStatus === "" ||
        order.deliveryStatus === filters.deliveryStatus;
      const sellerMatch =
        filters.sellerId === "" || order.sellerId === filters.sellerId;
      const supplierMatch =
        filters.supplierId === "" || order.supplierId === filters.supplierId;
      return (
        searchMatch &&
        statusMatch &&
        deliveryMatch &&
        sellerMatch &&
        supplierMatch
      );
    });
  }, [orders, filters]);

  const activeFilterCount = [
    filters.status,
    filters.deliveryStatus,
    filters.sellerId,
    filters.supplierId,
  ].filter(Boolean).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por pedido ou cliente..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all",
            showFilters || activeFilterCount > 0
              ? "bg-primary-50 border-primary-200 text-primary-700"
              : "bg-white border-slate-200 text-slate-600 hover:border-slate-300",
          )}
        >
          <Filter className="w-4 h-4" />
          Filtros
          {activeFilterCount > 0 && (
            <span className="bg-primary-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                >
                  <option value="">Todos os Status</option>
                  {Object.entries(STATUS_LABEL).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
                <select
                  value={filters.deliveryStatus}
                  onChange={(e) =>
                    setFilters({ ...filters, deliveryStatus: e.target.value })
                  }
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                >
                  <option value="">Todas as Entregas</option>
                  {Object.entries(DELIVERY_STATUS_LABEL).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
                <select
                  value={filters.sellerId}
                  onChange={(e) =>
                    setFilters({ ...filters, sellerId: e.target.value })
                  }
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                >
                  <option value="">Todos os Vendedores</option>
                  {sellers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <select
                  value={filters.supplierId}
                  onChange={(e) =>
                    setFilters({ ...filters, supplierId: e.target.value })
                  }
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                >
                  <option value="">Todos os Fornecedores</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              {activeFilterCount > 0 && (
                <button
                  onClick={() =>
                    setFilters({
                      ...filters,
                      status: "",
                      deliveryStatus: "",
                      sellerId: "",
                      supplierId: "",
                    })
                  }
                  className="mt-2 text-xs text-primary-600 hover:text-primary-700 font-medium"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-xs text-slate-400 px-1">
        {filteredOrders.length} pedido{filteredOrders.length !== 1 ? "s" : ""}{" "}
        encontrado{filteredOrders.length !== 1 ? "s" : ""}
      </p>

      <div className="space-y-2">
        <AnimatePresence>
          {filteredOrders.map((order, idx) => (
            <ListOrderRow
              key={order.id}
              order={order}
              onClick={onSelectOrder}
              selected={selectedOrderId === order.id}
              delay={idx * 0.01}
            />
          ))}
        </AnimatePresence>
        {filteredOrders.length === 0 && (
          <EmptyStateCard
            icon={Search}
            title="Nenhum pedido encontrado"
            description="Tente ajustar os filtros"
            className="bg-white border-slate-200"
          />
        )}
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENT: VENDEDORES TAB
// ============================================================================

function VendedoresTab({
  sellers,
  performance,
}: {
  sellers: Seller[];
  performance: SellerPerformance[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <AnimatePresence>
        {performance.map((seller, idx) => {
          const deliveredRatio =
            seller.totalOrders > 0
              ? (seller.deliveredCount / seller.totalOrders) * 100
              : 0;
          return (
            <motion.div
              key={seller.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200 group"
            >
              <div className="h-1 bg-gradient-to-r from-primary-500 to-primary-600" />
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {seller.name}
                      </h3>
                      <p className="text-xs text-slate-400">Vendedor</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-600">
                      {formatBRLFromCents(seller.totalRevenue)}
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                      receita
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-slate-50 rounded-lg p-2.5 text-center">
                    <p className="text-lg font-bold text-slate-900">
                      {seller.totalOrders}
                    </p>
                    <p className="text-[10px] text-slate-500">Pedidos</p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-2.5 text-center">
                    <p className="text-lg font-bold text-emerald-700">
                      {seller.deliveredCount}
                    </p>
                    <p className="text-[10px] text-emerald-600">Entregues</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-2.5 text-center">
                    <p className="text-lg font-bold text-blue-700">
                      {deliveredRatio.toFixed(0)}%
                    </p>
                    <p className="text-[10px] text-blue-600">Taxa</p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                    <span>Entregas</span>
                    <span>
                      {seller.deliveredCount}/{seller.totalOrders}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${deliveredRatio}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-1.5 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
      {performance.length === 0 && (
        <EmptyStateCard
          icon={BarChart3}
          title="Nenhum vendedor com dados"
          className="col-span-full bg-white border-slate-200"
        />
      )}
    </div>
  );
}

// ============================================================================
// COMPONENT: ORDER DETAIL (usando DetailPanel global)
// ============================================================================

function OrderDetail({
  order,
  onClose,
}: {
  order: SaleOrder | null;
  onClose: () => void;
}) {
  if (!order) return null;

  const statusBadge = {
    label: STATUS_LABEL[order.status] || order.status,
    variant:
      (
        {
          DRAFT: "gray",
          CONFIRMED: "info",
          PARTIALLY_DELIVERED: "orange",
          DELIVERED: "success",
          CANCELLED: "danger",
          INVOICED: "purple",
        } as Record<string, any>
      )[order.status] || "default",
  };

  const deliveryBadge = {
    label: DELIVERY_STATUS_LABEL[order.deliveryStatus] || order.deliveryStatus,
    variant:
      (
        {
          PENDING: "warning",
          IN_TRANSIT: "info",
          DELIVERED: "success",
          RETURNED: "danger",
          TO_VERIFY: "orange",
          PARTIAL: "purple",
        } as Record<string, any>
      )[order.deliveryStatus] || "default",
  };

  return (
    <DetailPanel
      open={!!order}
      onClose={onClose}
      title={`Pedido #${order.orderNumber}`}
      subtitle={order.clientName}
      badges={[statusBadge, deliveryBadge]}
      width="lg"
    >
      <div className="px-5 py-4 bg-gradient-to-r from-emerald-50 to-emerald-50/30 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-emerald-600 font-medium">Valor Total</p>
            <p className="text-2xl font-bold text-emerald-700">
              {formatBRLFromCents(order.totalAmount)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">
              {order.items.length} ite{order.items.length !== 1 ? "ns" : "m"}
            </p>
            <p className="text-xs text-slate-400">
              Criado em {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
      </div>

      <DetailPanel.Section title="Cliente">
        <DetailPanel.Grid cols={2}>
          <DetailPanel.Field label="Nome" value={order.clientName} />
          <DetailPanel.Field label="CPF/CNPJ" value={order.clientDoc} mono />
          <DetailPanel.Field label="Email" value={order.clientEmail} />
          <DetailPanel.Field label="Telefone" value={order.clientPhone} />
          <DetailPanel.Field
            label="Endereço"
            value={order.clientAddress}
            className="col-span-2"
          />
        </DetailPanel.Grid>
      </DetailPanel.Section>

      <DetailPanel.Section title="Informações da Venda">
        <DetailPanel.Grid cols={2}>
          <DetailPanel.Field label="Vendedor" value={order.sellerName} />
          <DetailPanel.Field label="Fornecedor" value={order.supplierName} />
          <DetailPanel.Field
            label="Pagamento"
            value={PAYMENT_LABEL[order.paymentMethod] || order.paymentMethod}
          />
          <DetailPanel.Field
            label="Vencimento"
            value={formatDate(order.dueDate)}
          />
          <DetailPanel.Field
            label="Nota Fiscal"
            value={order.invoiceNumber}
            mono
          />
          <div className="flex items-center gap-3">
            {order.isPriceLocked && (
              <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                TRAVA
              </span>
            )}
            {order.isSafra && (
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                SAFRA
              </span>
            )}
          </div>
        </DetailPanel.Grid>
      </DetailPanel.Section>

      <DetailPanel.Section title="Itens do Pedido">
        <div className="space-y-2">
          {order.items.map((item) => (
            <DetailPanel.ItemRow key={item.id}>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {item.productName}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {item.quantity}x {formatBRL(item.unitPrice / 100)}
                </p>
              </div>
              <p className="text-sm font-bold text-slate-900 flex-shrink-0 ml-3">
                {formatBRL(item.lineTotal / 100)}
              </p>
            </DetailPanel.ItemRow>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between bg-slate-900 text-white rounded-xl px-4 py-3">
          <span className="text-sm font-medium">Total</span>
          <span className="text-lg font-bold">
            {formatBRLFromCents(order.totalAmount)}
          </span>
        </div>
      </DetailPanel.Section>

      {order.notes && (
        <DetailPanel.Section title="Observações">
          <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3">
            {order.notes}
          </p>
        </DetailPanel.Section>
      )}
    </DetailPanel>
  );
}

// ============================================================================
// COMPONENT: NOVO PEDIDO MODAL
// ============================================================================

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  sellers: Seller[];
  suppliers: Supplier[];
  products: Product[];
  onSuccess: () => void;
}

function NewOrderModal({
  isOpen,
  onClose,
  sellers,
  suppliers,
  products,
  onSuccess,
}: NewOrderModalProps) {
  const queryClient = useQueryClient();
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<CreateSaleOrderInput>({
    resolver: zodResolver(CreateSaleOrderSchema),
    defaultValues: { items: [{ productId: "", quantity: 1, unitPrice: 0 }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const [clientSearch, setClientSearch] = useState("");
  const [showClientSuggestions, setShowClientSuggestions] = useState(false);
  const [activeProductIndex, setActiveProductIndex] = useState<number | null>(
    null,
  );
  const [productSearch, setProductSearch] = useState("");
  const [productInputValues, setProductInputValues] = useState<
    Record<number, string>
  >({});

  useEffect(() => {
    if (!isOpen) return;
    setClientSearch("");
    setShowClientSuggestions(false);
    setActiveProductIndex(null);
    setProductSearch("");
    setProductInputValues({});
  }, [isOpen]);

  const { data: clientSuggestions = [], isFetching: clientSuggestionsLoading } =
    useQuery<Client[]>({
      queryKey: ["clients-search", clientSearch],
      queryFn: async () => {
        const r = await api.get("/clients", {
          params: { q: clientSearch, limit: 8 },
        });
        return r.data;
      },
      enabled: isOpen && clientSearch.trim().length >= 3,
    });

  const quickCreateClientMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: clientSearch.trim(),
        doc: getValues("clientDoc") || undefined,
        email: getValues("clientEmail") || undefined,
        phone: getValues("clientPhone") || undefined,
        address: getValues("clientAddress") || undefined,
      };
      const r = await api.post("/clients", payload);
      return r.data as Client;
    },
    onSuccess: (client) => {
      setValue("clientId", client.id);
      setValue("clientName", client.name || "");
      setValue("clientDoc", client.doc || getValues("clientDoc") || "");
      setValue("clientEmail", client.email || getValues("clientEmail") || "");
      setValue("clientPhone", client.phone || getValues("clientPhone") || "");
      setValue(
        "clientAddress",
        client.address || getValues("clientAddress") || "",
      );
      setClientSearch(client.name || "");
      setShowClientSuggestions(false);
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["clients-search"] });
      toast.success("Cliente criado e selecionado");
    },
    onError: () => {
      toast.error("Não foi possível criar cliente rapidamente");
    },
  });

  const { data: productSuggestions = [] } = useQuery<Product[]>({
    queryKey: ["products-search", productSearch],
    queryFn: async () => {
      const r = await api.get("/products", {
        params: { search: productSearch },
      });
      return r.data;
    },
    enabled:
      isOpen && activeProductIndex !== null && productSearch.trim().length >= 3,
  });

  const itemsValue = watch("items");
  const subtotal = useMemo(
    () =>
      itemsValue.reduce((sum, item) => {
        return sum + (item.quantity || 0) * (item.unitPrice || 0) * 100;
      }, 0),
    [itemsValue],
  );

  const createOrderMutation = useMutation({
    mutationFn: async (data: CreateSaleOrderInput) => {
      const r = await api.post("/sale-orders", {
        ...data,
        totalAmount: subtotal,
      });
      return r.data;
    },
    onSuccess: () => {
      toast.success("Pedido criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["sales-orders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      reset();
      setClientSearch("");
      setProductSearch("");
      setProductInputValues({});
      setActiveProductIndex(null);
      onClose();
      onSuccess();
    },
    onError: () => {
      toast.error("Erro ao criar pedido");
    },
  });

  const onSubmit = (data: CreateSaleOrderInput) => {
    createOrderMutation.mutate(data);
  };
  const inputClass =
    "w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all placeholder:text-slate-400";
  const selectClass =
    "w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all";
  const labelClass = "text-xs font-medium text-slate-500 mb-1 block";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="h-[92vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200/50">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Novo Pedido de Venda
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Preencha os dados abaixo
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid h-[calc(92vh-72px)] grid-cols-1 md:grid-cols-12"
              >
                <div className="space-y-5 overflow-y-auto p-6 md:col-span-8 scrollbar-thin">
                  {/* Client */}
                  <div className="bg-slate-50/50 rounded-xl border border-slate-200/60 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="w-4 h-4 text-slate-500" />
                      <h3 className="text-sm font-semibold text-slate-800">
                        Dados do Cliente
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="hidden" {...register("clientId")} />
                      <input type="hidden" {...register("clientName")} />
                      <div className="col-span-2 relative">
                        <label className={labelClass}>Cliente</label>
                        <input
                          value={clientSearch}
                          onFocus={() => setShowClientSuggestions(true)}
                          onBlur={() =>
                            setTimeout(
                              () => setShowClientSuggestions(false),
                              150,
                            )
                          }
                          onChange={(e) => {
                            setClientSearch(e.target.value);
                            setValue("clientName", e.target.value);
                            setValue("clientId", "");
                          }}
                          placeholder="Digite 3 letras para buscar..."
                          className={inputClass}
                        />
                        {showClientSuggestions &&
                          clientSearch.trim().length >= 3 &&
                          clientSuggestions.length > 0 && (
                            <div className="absolute z-20 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg overflow-hidden">
                              {clientSuggestions.map((client) => (
                                <button
                                  key={client.id}
                                  type="button"
                                  onMouseDown={(e) => e.preventDefault()}
                                  onClick={() => {
                                    setValue("clientId", client.id);
                                    setValue("clientName", client.name || "");
                                    setValue("clientDoc", client.doc || "");
                                    setValue("clientEmail", client.email || "");
                                    setValue("clientPhone", client.phone || "");
                                    setValue(
                                      "clientAddress",
                                      client.address || "",
                                    );
                                    setClientSearch(client.name || "");
                                    setShowClientSuggestions(false);
                                  }}
                                  className="w-full px-3 py-2.5 text-left hover:bg-slate-50 transition-colors"
                                >
                                  <p className="text-sm font-semibold text-slate-800">
                                    {client.name}
                                  </p>
                                  <p className="text-xs text-slate-400">
                                    {client.doc || "-"}{" "}
                                    {client.phone ? `• ${client.phone}` : ""}
                                  </p>
                                </button>
                              ))}
                            </div>
                          )}
                        {showClientSuggestions &&
                          clientSearch.trim().length >= 3 &&
                          !clientSuggestionsLoading &&
                          clientSuggestions.length === 0 && (
                            <div className="absolute z-20 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg overflow-hidden">
                              <button
                                type="button"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() =>
                                  quickCreateClientMutation.mutate()
                                }
                                disabled={quickCreateClientMutation.isPending}
                                className="w-full px-3 py-2.5 text-left hover:bg-primary-50 disabled:opacity-60 transition-colors"
                              >
                                <p className="text-sm font-semibold text-primary-700">
                                  {quickCreateClientMutation.isPending
                                    ? "Criando..."
                                    : `Cadastrar "${clientSearch.trim()}"`}
                                </p>
                                <p className="text-xs text-slate-400">
                                  Clique para criar e selecionar
                                </p>
                              </button>
                            </div>
                          )}
                      </div>
                      <div>
                        <label className={labelClass}>CPF/CNPJ</label>
                        <input
                          {...register("clientDoc")}
                          placeholder="000.000.000-00"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Email</label>
                        <input
                          {...register("clientEmail")}
                          type="email"
                          placeholder="email@exemplo.com"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Telefone</label>
                        <input
                          {...register("clientPhone")}
                          placeholder="(00) 00000-0000"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Endereço</label>
                        <input
                          {...register("clientAddress")}
                          placeholder="Rua, nº - Cidade/UF"
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sales Info */}
                  <div className="bg-slate-50/50 rounded-xl border border-slate-200/60 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-4 h-4 text-slate-500" />
                      <h3 className="text-sm font-semibold text-slate-800">
                        Informações da Venda
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Vendedor</label>
                        <select
                          {...register("sellerId")}
                          className={selectClass}
                        >
                          <option value="">Selecione...</option>
                          {sellers.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Fornecedor</label>
                        <select
                          {...register("supplierId")}
                          className={selectClass}
                        >
                          <option value="">Selecione...</option>
                          {suppliers.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Nº Nota Fiscal</label>
                        <input
                          {...register("invoiceNumber")}
                          placeholder="Opcional"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Pagamento</label>
                        <select
                          {...register("paymentMethod")}
                          className={selectClass}
                        >
                          <option value="">Selecione...</option>
                          {PAYMENT_METHODS.map((m) => (
                            <option key={m.value} value={m.value}>
                              {m.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Vencimento</label>
                        <input
                          {...register("dueDate")}
                          type="date"
                          className={inputClass}
                        />
                      </div>
                      <div className="flex items-end gap-4 pb-1">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            {...register("isPriceLocked")}
                            type="checkbox"
                            className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
                          />
                          <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                            TRAVA
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            {...register("isSafra")}
                            type="checkbox"
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            SAFRA
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="bg-slate-50/50 rounded-xl border border-slate-200/60 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-slate-500" />
                        <h3 className="text-sm font-semibold text-slate-800">
                          Itens do Pedido
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          append({ productId: "", quantity: 1, unitPrice: 0 });
                          setProductInputValues((prev) => ({
                            ...prev,
                            [fields.length]: "",
                          }));
                        }}
                        className="flex items-center gap-1.5 text-primary-600 hover:text-primary-700 font-semibold text-xs transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Adicionar
                      </button>
                    </div>
                    <div className="space-y-2 max-h-[36vh] overflow-y-auto pr-1 scrollbar-thin">
                      {fields.map((field, idx) => {
                        const selectedProduct = products.find(
                          (p) => p.id === itemsValue[idx]?.productId,
                        );
                        return (
                          <div
                            key={field.id}
                            className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 p-2.5"
                          >
                            <input
                              type="hidden"
                              {...register(`items.${idx}.productId`)}
                            />
                            <div className="relative flex-1 min-w-0">
                              <input
                                value={
                                  productInputValues[idx] ??
                                  selectedProduct?.name ??
                                  ""
                                }
                                onFocus={() => {
                                  setActiveProductIndex(idx);
                                  setProductSearch(
                                    productInputValues[idx] ?? "",
                                  );
                                }}
                                onBlur={() =>
                                  setTimeout(
                                    () =>
                                      setActiveProductIndex((prev) =>
                                        prev === idx ? null : prev,
                                      ),
                                    150,
                                  )
                                }
                                onChange={(e) => {
                                  setProductInputValues((prev) => ({
                                    ...prev,
                                    [idx]: e.target.value,
                                  }));
                                  setActiveProductIndex(idx);
                                  setProductSearch(e.target.value);
                                  setValue(`items.${idx}.productId`, "");
                                }}
                                placeholder="Buscar produto..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                              />
                              {activeProductIndex === idx &&
                                productSearch.trim().length >= 3 &&
                                productSuggestions.length > 0 && (
                                  <div className="absolute z-20 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg max-h-48 overflow-y-auto">
                                    {productSuggestions.map((product) => (
                                      <button
                                        key={product.id}
                                        type="button"
                                        onClick={() => {
                                          setValue(
                                            `items.${idx}.productId`,
                                            product.id,
                                          );
                                          setValue(
                                            `items.${idx}.unitPrice`,
                                            Number(product.salePrice || 0),
                                          );
                                          setProductInputValues((prev) => ({
                                            ...prev,
                                            [idx]: product.name,
                                          }));
                                          setProductSearch(product.name);
                                          setActiveProductIndex(null);
                                        }}
                                        className="w-full px-3 py-2 text-left hover:bg-slate-50 transition-colors"
                                      >
                                        <p className="text-sm font-semibold text-slate-800">
                                          {product.name}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                          {formatBRL(
                                            Number(product.salePrice || 0),
                                          )}
                                        </p>
                                      </button>
                                    ))}
                                  </div>
                                )}
                            </div>
                            <input
                              {...register(`items.${idx}.quantity`, {
                                valueAsNumber: true,
                              })}
                              type="number"
                              placeholder="Qtd"
                              className="w-20 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-2 text-sm text-center focus:outline-none focus:border-primary-500"
                            />
                            <input
                              {...register(`items.${idx}.unitPrice`, {
                                valueAsNumber: true,
                              })}
                              type="number"
                              placeholder="Preço"
                              defaultValue={selectedProduct?.salePrice}
                              step="0.01"
                              className="w-28 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-2 text-sm text-right focus:outline-none focus:border-primary-500"
                            />
                            <button
                              type="button"
                              onClick={() => remove(idx)}
                              className="text-slate-300 hover:text-red-500 p-1.5 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    {fields.length === 0 && (
                      <div className="text-center py-6 text-sm text-slate-400">
                        Nenhum item adicionado
                      </div>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>Observações</label>
                    <textarea
                      {...register("notes")}
                      placeholder="Observações (opcional)"
                      rows={2}
                      className={cn(inputClass, "resize-none")}
                    />
                  </div>
                </div>

                {/* Summary sidebar */}
                <aside className="border-t border-slate-200 bg-slate-50 p-5 md:col-span-4 md:border-l md:border-t-0 flex flex-col">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
                    Resumo
                  </h3>
                  <div className="space-y-3 bg-white rounded-xl border border-slate-200 p-4 flex-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Itens</span>
                      <span className="font-semibold text-slate-800">
                        {fields.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Quantidade</span>
                      <span className="font-semibold text-slate-800">
                        {itemsValue.reduce(
                          (sum, item) => sum + (item.quantity || 0),
                          0,
                        )}
                      </span>
                    </div>
                    <div className="h-px bg-slate-100" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Subtotal</span>
                      <span className="text-xl font-bold text-slate-900">
                        {formatBRLFromCents(subtotal)}
                      </span>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={createOrderMutation.isPending}
                    className="mt-4 w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-xl py-3 font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                  >
                    {createOrderMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Criando...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Criar Pedido
                      </>
                    )}
                  </button>
                </aside>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function SalesPage() {
  const [activeTab, setActiveTab] = useState<
    "pipeline" | "lista" | "vendedores"
  >("pipeline");
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<SaleOrder | null>(null);

  const { data: stats = {} as DashboardStats, isLoading: statsLoading } =
    useQuery({
      queryKey: ["dashboard-stats"],
      queryFn: async () => {
        const r = await api.get("/sale-orders/dashboard");
        return r.data;
      },
    });

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["sales-orders"],
    queryFn: async () => {
      const r = await api.get("/sale-orders");
      return r.data;
    },
  });

  const { data: sellers = [] } = useQuery({
    queryKey: ["sellers"],
    queryFn: async () => {
      const r = await api.get("/sellers");
      return r.data;
    },
  });

  const { data: sellers_performance = [] } = useQuery({
    queryKey: ["sellers-performance"],
    queryFn: async () => {
      const r = await api.get("/sellers/dashboard");
      return r.data;
    },
  });

  const { data: suppliers = [] } = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const r = await api.get("/suppliers");
      return r.data;
    },
  });

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const r = await api.get("/products");
      return r.data;
    },
  });

  const isLoading = statsLoading || ordersLoading;

  const tabs = [
    { value: "pipeline" as const, label: "Pipeline", icon: TrendingUp },
    { value: "lista" as const, label: "Lista", icon: FileText },
    { value: "vendedores" as const, label: "Vendedores", icon: User },
  ];

  return (
    <div className="min-h-screen bg-brand-bg">
      <Header title="Vendas" />
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-slate-500">
              Gerencie seus pedidos de vendas
            </p>
          </div>
          <button
            onClick={() => setIsNewOrderOpen(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white rounded-xl px-5 py-2.5 font-semibold flex items-center gap-2 transition-all shadow-sm hover:shadow-md text-sm"
          >
            <Plus className="w-4 h-4" />
            Novo Pedido
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
              <p className="text-sm text-slate-500">Carregando dados...</p>
            </div>
          </div>
        ) : (
          <>
            <KPICards stats={stats} />
            <div className="mt-6">
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 w-fit mb-5">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.value}
                      onClick={() => setActiveTab(tab.value)}
                      className={cn(
                        "flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium text-sm transition-all",
                        activeTab === tab.value
                          ? "bg-primary-600 text-white shadow-sm"
                          : "text-slate-500 hover:text-slate-700 hover:bg-slate-50",
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                {activeTab === "pipeline" && (
                  <motion.div
                    key="pipeline"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                  >
                    <PipelineTab
                      orders={orders}
                      selectedOrderId={selectedOrder?.id}
                      onSelectOrder={setSelectedOrder}
                    />
                  </motion.div>
                )}
                {activeTab === "lista" && (
                  <motion.div
                    key="lista"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                  >
                    <ListaTab
                      orders={orders}
                      sellers={sellers}
                      suppliers={suppliers}
                      selectedOrderId={selectedOrder?.id}
                      onSelectOrder={setSelectedOrder}
                    />
                  </motion.div>
                )}
                {activeTab === "vendedores" && (
                  <motion.div
                    key="vendedores"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                  >
                    <VendedoresTab
                      sellers={sellers}
                      performance={sellers_performance}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </main>

      <NewOrderModal
        isOpen={isNewOrderOpen}
        onClose={() => setIsNewOrderOpen(false)}
        sellers={sellers}
        suppliers={suppliers}
        products={products}
        onSuccess={() => {}}
      />
      <OrderDetail
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
