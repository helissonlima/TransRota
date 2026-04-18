"use client";

import { useState, useMemo, useEffect } from "react";
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
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import api from "@/lib/api";
import { cn } from "@/lib/cn";
import { Header } from "@/components/layout/header";

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
  DRAFT: "text-slate-500 bg-slate-100",
  CONFIRMED: "text-blue-400 bg-blue-500/10",
  PARTIALLY_DELIVERED: "text-orange-400 bg-orange-500/10",
  DELIVERED: "text-emerald-400 bg-emerald-500/10",
  CANCELLED: "text-red-400 bg-red-500/10",
  INVOICED: "text-purple-400 bg-purple-500/10",
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
  PENDING: "text-amber-500 bg-amber-500/10",
  IN_TRANSIT: "text-blue-500 bg-blue-500/10",
  DELIVERED: "text-emerald-500 bg-emerald-500/10",
  RETURNED: "text-red-500 bg-red-500/10",
  TO_VERIFY: "text-orange-500 bg-orange-500/10",
  PARTIAL: "text-purple-500 bg-purple-500/10",
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
      color: "from-blue-500/20 to-blue-600/20",
    },
    {
      label: "Receita Total",
      value: formatBRLFromCents(stats.totalRevenue),
      icon: DollarSign,
      color: "from-emerald-500/20 to-emerald-600/20",
    },
    {
      label: "Pendentes",
      value: stats.pendingOrders,
      icon: Clock,
      color: "from-amber-500/20 to-amber-600/20",
    },
    {
      label: "Entregues",
      value: stats.deliveredOrders,
      icon: Truck,
      color: "from-cyan-500/20 to-cyan-600/20",
    },
    {
      label: "Cancelados",
      value: stats.cancelledOrders,
      icon: XCircle,
      color: "from-red-500/20 to-red-600/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <AnimatePresence>
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className={cn(
                "bg-white border border-brand-border rounded-2xl p-6 shadow-card",
                "bg-gradient-to-br",
                kpi.color,
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-brand-text-secondary text-sm font-medium">
                    {kpi.label}
                  </p>
                  <p className="text-brand-text-primary text-2xl font-bold mt-2">
                    {kpi.value}
                  </p>
                </div>
                <Icon className="w-5 h-5 text-brand-text-secondary opacity-60" />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// COMPONENT: PIPELINE TAB
// ============================================================================

function PipelineTab({
  orders,
  onSelectOrder,
}: {
  orders: SaleOrder[];
  onSelectOrder: (order: SaleOrder) => void;
}) {
  const statuses = ["DRAFT", "CONFIRMED", "DELIVERED", "CANCELLED"] as const;

  const ordersByStatus = useMemo(() => {
    return statuses.reduce(
      (acc, status) => {
        acc[status] = orders.filter((o) => o.status === status);
        return acc;
      },
      {} as Record<(typeof statuses)[number], SaleOrder[]>,
    );
  }, [orders]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {statuses.map((status) => (
        <div
          key={status}
          className="rounded-2xl border border-brand-border bg-white shadow-card"
        >
          <div className="flex items-center justify-between border-b border-brand-border bg-brand-bg/80 px-4 py-3">
            <h3 className="font-semibold text-brand-text-primary">
              {STATUS_LABEL[status]}
            </h3>
            <span className="rounded-full bg-primary-600 px-2.5 py-1 text-xs font-bold text-white">
              {ordersByStatus[status].length}
            </span>
          </div>

          <div className="space-y-3 p-3 max-h-[68vh] overflow-y-auto">
            <AnimatePresence>
              {ordersByStatus[status].map((order) => {
                const items = (order.items || []) as any[];
                const previewItems = items.slice(0, 3);
                return (
                  <motion.button
                    type="button"
                    key={order.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    whileHover={{ y: -2 }}
                    onClick={() => onSelectOrder(order)}
                    className="w-full rounded-xl border border-brand-border bg-white p-3 text-left transition-all hover:border-primary-300 hover:shadow-md"
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-brand-text-secondary">
                          Pedido #{order.orderNumber}
                        </p>
                        <p className="mt-0.5 text-sm font-bold text-brand-text-primary line-clamp-1">
                          {order.clientName}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "rounded-md px-2 py-1 text-[10px] font-semibold",
                          DELIVERY_STATUS_COLOR[order.deliveryStatus],
                        )}
                      >
                        {DELIVERY_STATUS_LABEL[order.deliveryStatus]}
                      </span>
                    </div>

                    <div className="mb-2 space-y-1 rounded-lg bg-brand-bg px-2.5 py-2">
                      {previewItems.length > 0 ? (
                        previewItems.map((item, index) => (
                          <div
                            key={`${order.id}-item-${index}`}
                            className="flex items-center justify-between text-xs"
                          >
                            <span className="line-clamp-1 text-brand-text-secondary">
                              {
                                (item.productName ||
                                  item.product?.name ||
                                  "Item sem nome") as string
                              }
                            </span>
                            <span className="font-semibold text-brand-text-primary">
                              x
                              {Number(item.quantity || 0).toLocaleString(
                                "pt-BR",
                              )}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-brand-text-secondary">
                          Sem itens vinculados
                        </p>
                      )}
                      {items.length > 3 && (
                        <p className="text-[11px] font-semibold text-primary-600">
                          +{items.length - 3} itens
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between border-t border-brand-border pt-2.5">
                      <div>
                        <p className="text-[11px] text-brand-text-secondary">
                          Vendedor
                        </p>
                        <p className="text-xs font-semibold text-brand-text-primary line-clamp-1">
                          {order.sellerName || "-"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] text-brand-text-secondary">
                          Total
                        </p>
                        <p className="text-sm font-black text-brand-text-primary">
                          {formatBRLFromCents(order.totalAmount)}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>

            {ordersByStatus[status].length === 0 && (
              <div className="rounded-xl border border-dashed border-brand-border p-5 text-center">
                <p className="text-xs text-brand-text-secondary">
                  Nenhum pedido nesta etapa.
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
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

function SaleOrderDetailPanel({
  order,
  onClose,
}: {
  order: SaleOrder | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!order) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [order, onClose]);

  return (
    <AnimatePresence>
      {order && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/35 backdrop-blur-[1px]"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 24, stiffness: 220 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-2xl bg-white shadow-2xl"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-start justify-between border-b border-brand-border p-6">
                <div>
                  <p className="text-xs uppercase tracking-wide text-brand-text-secondary">
                    Pedido #{order.orderNumber}
                  </p>
                  <h3 className="mt-1 text-2xl font-bold text-brand-text-primary">
                    {order.clientName}
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-brand-text-secondary hover:bg-slate-100 hover:text-brand-text-primary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 border-b border-brand-border p-6 text-sm">
                <div>
                  <p className="text-brand-text-secondary">Fornecedor</p>
                  <p className="font-semibold text-brand-text-primary">
                    {order.supplierName}
                  </p>
                </div>
                <div>
                  <p className="text-brand-text-secondary">Vendedor</p>
                  <p className="font-semibold text-brand-text-primary">
                    {order.sellerName}
                  </p>
                </div>
                <div>
                  <p className="text-brand-text-secondary">Vencimento</p>
                  <p className="font-semibold text-brand-text-primary">
                    {new Date(order.dueDate).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div>
                  <p className="text-brand-text-secondary">Total</p>
                  <p className="font-semibold text-emerald-600">
                    {formatBRLFromCents(order.totalAmount)}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-brand-text-secondary">Endereço</p>
                  <p className="font-semibold text-brand-text-primary">
                    {order.clientAddress || "-"}
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-text-secondary">
                  Itens vendidos
                </h4>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-brand-border bg-brand-bg p-4"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <p className="font-semibold text-brand-text-primary">
                          {item.productName}
                        </p>
                        <p className="font-bold text-brand-text-primary">
                          {formatBRL(item.lineTotal / 100)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-sm text-brand-text-secondary">
                        <p>Qtd: {item.quantity}</p>
                        <p>Unit: {formatBRL(item.unitPrice / 100)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
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

  return (
    <div className="space-y-4">
      <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-card">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
            <input
              type="text"
              placeholder="Buscar por pedido ou cliente..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className="w-full bg-slate-50 border border-brand-border rounded-xl pl-10 pr-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-500"
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="bg-slate-50 border border-brand-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-500"
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
            className="bg-slate-50 border border-brand-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-500"
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
            className="bg-slate-50 border border-brand-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-500"
          >
            <option value="">Todos os Vendedores</option>
            {sellers.map((seller) => (
              <option key={seller.id} value={seller.id}>
                {seller.name}
              </option>
            ))}
          </select>
          <select
            value={filters.supplierId}
            onChange={(e) =>
              setFilters({ ...filters, supplierId: e.target.value })
            }
            className="bg-slate-50 border border-brand-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-500"
          >
            <option value="">Todos os Fornecedores</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {filteredOrders.map((order, idx) => (
            <motion.button
              type="button"
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: idx * 0.015 }}
              onClick={() => onSelectOrder(order)}
              className={cn(
                "w-full rounded-2xl border bg-white p-5 text-left shadow-card transition-all",
                "hover:border-primary-500/50 hover:shadow-lg",
                selectedOrderId === order.id
                  ? "border-primary-500 ring-2 ring-primary-200"
                  : "border-brand-border",
              )}
            >
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-brand-text-secondary">
                    Pedido #{order.orderNumber}
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-brand-text-primary">
                    {order.clientName}
                  </h3>
                  <p className="mt-1 text-sm text-brand-text-secondary">
                    {order.clientAddress || "Endereço não informado"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-brand-text-secondary">Total</p>
                  <p className="text-2xl font-black text-brand-text-primary">
                    {formatBRLFromCents(order.totalAmount)}
                  </p>
                  <p className="mt-1 text-xs text-brand-text-secondary">
                    {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
                <div className="rounded-xl bg-brand-bg p-3">
                  <p className="text-[11px] uppercase tracking-wide text-brand-text-secondary">
                    Vendedor
                  </p>
                  <p className="mt-1 font-semibold text-brand-text-primary">
                    {order.sellerName || "-"}
                  </p>
                </div>
                <div className="rounded-xl bg-brand-bg p-3">
                  <p className="text-[11px] uppercase tracking-wide text-brand-text-secondary">
                    Fornecedor
                  </p>
                  <p className="mt-1 font-semibold text-brand-text-primary">
                    {order.supplierName || "-"}
                  </p>
                </div>
                <div className="rounded-xl bg-brand-bg p-3">
                  <p className="text-[11px] uppercase tracking-wide text-brand-text-secondary">
                    NF
                  </p>
                  <p className="mt-1 font-semibold text-brand-text-primary">
                    {order.invoiceNumber || "-"}
                  </p>
                </div>
                <div className="rounded-xl bg-brand-bg p-3">
                  <p className="text-[11px] uppercase tracking-wide text-brand-text-secondary">
                    Vencimento
                  </p>
                  <p className="mt-1 font-semibold text-brand-text-primary">
                    {new Date(order.dueDate).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-brand-bg p-3 md:justify-end md:gap-2">
                  <span
                    className={cn(
                      "text-xs font-semibold px-2 py-1 rounded-md",
                      STATUS_COLOR[order.status],
                    )}
                  >
                    {STATUS_LABEL[order.status]}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-semibold px-2 py-1 rounded-md",
                      DELIVERY_STATUS_COLOR[order.deliveryStatus],
                    )}
                  >
                    {DELIVERY_STATUS_LABEL[order.deliveryStatus]}
                  </span>
                  <ChevronRight className="h-4 w-4 text-brand-text-secondary" />
                </div>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>

        {filteredOrders.length === 0 && (
          <div className="rounded-2xl border border-dashed border-brand-border bg-white p-10 text-center">
            <p className="text-brand-text-secondary">
              Nenhum pedido encontrado com os filtros atuais.
            </p>
          </div>
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <AnimatePresence>
        {performance.map((seller, idx) => {
          const deliveredRatio =
            seller.totalOrders > 0
              ? (seller.deliveredCount / seller.totalOrders) * 100
              : 0;

          return (
            <motion.div
              key={seller.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white border border-brand-border rounded-2xl p-6 shadow-card hover:shadow-lg transition-shadow"
            >
              <div className="mb-4">
                <h3 className="text-lg font-bold text-brand-text-primary">
                  {seller.name}
                </h3>
              </div>
              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-sm text-brand-text-secondary mb-1">
                    Total de Pedidos
                  </p>
                  <p className="text-2xl font-bold text-brand-text-primary">
                    {seller.totalOrders}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-brand-text-secondary mb-1">
                    Receita Total
                  </p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {formatBRLFromCents(seller.totalRevenue)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-brand-text-secondary mb-2">
                    Entregues: {seller.deliveredCount}/{seller.totalOrders}
                  </p>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${deliveredRatio}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="bg-emerald-500 h-2 rounded-full"
                    />
                  </div>
                </div>
              </div>
              <button className="w-full bg-primary-600 hover:bg-primary-700 text-white rounded-xl py-2 text-sm font-semibold transition-colors">
                Ver Detalhes
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
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
    defaultValues: {
      items: [{ productId: "", quantity: 1, unitPrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

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
        const response = await api.get("/clients", {
          params: { q: clientSearch, limit: 8 },
        });
        return response.data;
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
      const response = await api.post("/clients", payload);
      return response.data as Client;
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
      const response = await api.get("/products", {
        params: { search: productSearch },
      });
      return response.data;
    },
    enabled:
      isOpen && activeProductIndex !== null && productSearch.trim().length >= 3,
  });

  const itemsValue = watch("items");
  const subtotal = useMemo(
    () =>
      itemsValue.reduce((sum, item) => {
        const quantity = item.quantity || 0;
        const price = item.unitPrice || 0;
        return sum + quantity * price * 100;
      }, 0),
    [itemsValue],
  );

  const createOrderMutation = useMutation({
    mutationFn: async (data: CreateSaleOrderInput) => {
      const response = await api.post("/sale-orders", {
        ...data,
        totalAmount: subtotal,
      });
      return response.data;
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6"
          >
            <div className="h-[94vh] w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-lg">
              <div className="sticky top-0 flex items-center justify-between p-6 border-b border-brand-border bg-white">
                <h2 className="text-2xl font-bold text-brand-text-primary">
                  Novo Pedido de Venda
                </h2>
                <button
                  onClick={onClose}
                  className="text-brand-text-secondary hover:text-brand-text-primary"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid h-[calc(94vh-96px)] grid-cols-1 gap-0 md:grid-cols-12"
              >
                <div className="space-y-6 overflow-hidden p-6 md:col-span-8">
                  {/* Client Section */}
                  <div>
                    <h3 className="font-semibold text-brand-text-primary mb-3">
                      Dados do Cliente
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="hidden" {...register("clientId")} />
                      <input type="hidden" {...register("clientName")} />
                      <div className="col-span-2 relative">
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
                            const value = e.target.value;
                            setClientSearch(value);
                            setValue("clientName", value);
                            setValue("clientId", "");
                          }}
                          placeholder="Nome do Cliente"
                          className="w-full bg-slate-50 border border-brand-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                        />
                        {showClientSuggestions &&
                          clientSearch.trim().length >= 3 &&
                          clientSuggestions.length > 0 && (
                            <div className="absolute z-20 mt-1 w-full rounded-xl border border-brand-border bg-white shadow-lg overflow-hidden">
                              {clientSuggestions.map((client) => (
                                <button
                                  key={client.id}
                                  type="button"
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
                                  className="w-full px-3 py-2.5 text-left hover:bg-slate-50"
                                >
                                  <p className="text-sm font-semibold text-brand-text-primary">
                                    {client.name}
                                  </p>
                                  <p className="text-xs text-brand-text-secondary">
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
                            <div className="absolute z-20 mt-1 w-full rounded-xl border border-brand-border bg-white shadow-lg overflow-hidden">
                              <button
                                type="button"
                                onClick={() =>
                                  quickCreateClientMutation.mutate()
                                }
                                disabled={quickCreateClientMutation.isPending}
                                className="w-full px-3 py-2.5 text-left hover:bg-slate-50 disabled:opacity-60"
                              >
                                <p className="text-sm font-semibold text-primary-700">
                                  {quickCreateClientMutation.isPending
                                    ? "Criando cliente..."
                                    : `Cadastrar cliente "${clientSearch.trim()}"`}
                                </p>
                                <p className="text-xs text-brand-text-secondary">
                                  Não encontrado no banco. Clique para criar e
                                  selecionar.
                                </p>
                              </button>
                            </div>
                          )}
                        <p className="mt-1 text-[11px] text-brand-text-secondary">
                          Digite 3 letras para buscar cliente no banco.
                        </p>
                      </div>
                      <input
                        {...register("clientDoc")}
                        placeholder="CPF/CNPJ"
                        className="bg-slate-50 border border-brand-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                      />
                      <input
                        {...register("clientEmail")}
                        type="email"
                        placeholder="Email"
                        className="bg-slate-50 border border-brand-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                      />
                      <input
                        {...register("clientPhone")}
                        placeholder="Telefone"
                        className="col-span-2 bg-slate-50 border border-brand-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                      />
                      <input
                        {...register("clientAddress")}
                        placeholder="Endereço"
                        className="col-span-2 bg-slate-50 border border-brand-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                      />
                    </div>
                  </div>

                  {/* Sales Info Section */}
                  <div>
                    <h3 className="font-semibold text-brand-text-primary mb-3">
                      Informações de Vendas
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        {...register("sellerId")}
                        className="bg-slate-50 border border-brand-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                      >
                        <option value="">Selecione Vendedor</option>
                        {sellers.map((seller) => (
                          <option key={seller.id} value={seller.id}>
                            {seller.name}
                          </option>
                        ))}
                      </select>
                      <select
                        {...register("supplierId")}
                        className="bg-slate-50 border border-brand-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                      >
                        <option value="">Selecione Fornecedor</option>
                        {suppliers.map((supplier) => (
                          <option key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </option>
                        ))}
                      </select>
                      <input
                        {...register("invoiceNumber")}
                        placeholder="Nº Nota Fiscal"
                        className="bg-slate-50 border border-brand-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                      />
                      <select
                        {...register("paymentMethod")}
                        className="bg-slate-50 border border-brand-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                      >
                        <option value="">Método de Pagamento</option>
                        {PAYMENT_METHODS.map((method) => (
                          <option key={method.value} value={method.value}>
                            {method.label}
                          </option>
                        ))}
                      </select>
                      <input
                        {...register("dueDate")}
                        type="date"
                        className="col-span-2 bg-slate-50 border border-brand-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                      />
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          {...register("isPriceLocked")}
                          type="checkbox"
                          className="w-4 h-4"
                        />
                        <span className="text-sm font-semibold text-red-600">
                          TRAVA
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          {...register("isSafra")}
                          type="checkbox"
                          className="w-4 h-4"
                        />
                        <span className="text-sm font-semibold text-blue-600">
                          SAFRA
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Items Section */}
                  <div>
                    <h3 className="font-semibold text-brand-text-primary mb-3">
                      Itens do Pedido
                    </h3>
                    <div className="space-y-2">
                      {fields.map((field, idx) => {
                        const selectedProduct = products.find(
                          (p) => p.id === itemsValue[idx]?.productId,
                        );
                        return (
                          <div key={field.id} className="flex gap-2">
                            <input
                              type="hidden"
                              {...register(`items.${idx}.productId`)}
                            />
                            <div className="relative flex-1">
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
                                  const value = e.target.value;
                                  setProductInputValues((prev) => ({
                                    ...prev,
                                    [idx]: value,
                                  }));
                                  setActiveProductIndex(idx);
                                  setProductSearch(value);
                                  setValue(`items.${idx}.productId`, "");
                                }}
                                placeholder="Produto"
                                className="w-full bg-slate-50 border border-brand-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                              />
                              {activeProductIndex === idx &&
                                productSearch.trim().length >= 3 &&
                                productSuggestions.length > 0 && (
                                  <div className="absolute z-20 mt-1 w-full rounded-xl border border-brand-border bg-white shadow-lg max-h-56 overflow-y-auto">
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
                                        className="w-full px-3 py-2.5 text-left hover:bg-slate-50"
                                      >
                                        <p className="text-sm font-semibold text-brand-text-primary">
                                          {product.name}
                                        </p>
                                        <p className="text-xs text-brand-text-secondary">
                                          Preço:{" "}
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
                              placeholder="Qty"
                              className="w-20 bg-slate-50 border border-brand-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                            />
                            <input
                              {...register(`items.${idx}.unitPrice`, {
                                valueAsNumber: true,
                              })}
                              type="number"
                              placeholder="Preço"
                              defaultValue={selectedProduct?.salePrice}
                              step="0.01"
                              className="w-24 bg-slate-50 border border-brand-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                            />
                            <button
                              type="button"
                              onClick={() => remove(idx)}
                              className="text-red-500 hover:text-red-700 p-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
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
                      className="mt-2 flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar Item
                    </button>
                    <div className="mt-3 p-3 bg-brand-bg rounded-xl border border-brand-border">
                      <p className="text-sm text-brand-text-secondary mb-1">
                        Subtotal
                      </p>
                      <p className="text-2xl font-bold text-brand-text-primary">
                        {formatBRLFromCents(subtotal)}
                      </p>
                    </div>
                  </div>

                  {/* Notes */}
                  <textarea
                    {...register("notes")}
                    placeholder="Observações (opcional)"
                    rows={3}
                    className="w-full bg-slate-50 border border-brand-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>

                <aside className="border-t border-brand-border bg-brand-bg/60 p-6 md:col-span-4 md:border-l md:border-t-0">
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-text-secondary">
                    Resumo da Venda
                  </h3>
                  <div className="space-y-3 rounded-2xl border border-brand-border bg-white p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-brand-text-secondary">Itens</span>
                      <span className="font-semibold text-brand-text-primary">
                        {fields.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-brand-text-secondary">
                        Quantidade total
                      </span>
                      <span className="font-semibold text-brand-text-primary">
                        {itemsValue.reduce(
                          (sum, item) => sum + (item.quantity || 0),
                          0,
                        )}
                      </span>
                    </div>
                    <div className="h-px bg-brand-border" />
                    <div className="flex items-center justify-between">
                      <span className="text-brand-text-secondary">
                        Subtotal
                      </span>
                      <span className="text-xl font-black text-brand-text-primary">
                        {formatBRLFromCents(subtotal)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-brand-border bg-white p-4 text-sm text-brand-text-secondary">
                    <p className="font-semibold text-brand-text-primary">
                      Dica
                    </p>
                    <p className="mt-1">
                      Clique fora deste painel para fechar sem salvar.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={createOrderMutation.isPending}
                    className="mt-6 w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-xl py-3 font-semibold transition-colors flex items-center justify-center gap-2"
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

  // Fetch data
  const { data: stats = {} as DashboardStats, isLoading: statsLoading } =
    useQuery({
      queryKey: ["dashboard-stats"],
      queryFn: async () => {
        const response = await api.get("/sale-orders/dashboard");
        return response.data;
      },
    });

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["sales-orders"],
    queryFn: async () => {
      const response = await api.get("/sale-orders");
      return response.data;
    },
  });

  const { data: sellers = [] } = useQuery({
    queryKey: ["sellers"],
    queryFn: async () => {
      const response = await api.get("/sellers");
      return response.data;
    },
  });

  const { data: sellers_performance = [] } = useQuery({
    queryKey: ["sellers-performance"],
    queryFn: async () => {
      const response = await api.get("/sellers/dashboard");
      return response.data;
    },
  });

  const { data: suppliers = [] } = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const response = await api.get("/suppliers");
      return response.data;
    },
  });

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await api.get("/products");
      return response.data;
    },
  });

  const isLoading = statsLoading || ordersLoading;

  return (
    <div className="min-h-screen bg-brand-bg">
      <Header title="Vendas" />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with Title and CTA */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-brand-text-primary">
              Vendas
            </h1>
            <p className="text-brand-text-secondary mt-1">
              Gerencie seus pedidos de vendas de forma eficiente
            </p>
          </div>
          <button
            onClick={() => setIsNewOrderOpen(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white rounded-xl px-6 py-3 font-semibold flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Novo Pedido
          </button>
        </div>

        {/* KPI Cards */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : (
          <>
            <KPICards stats={stats} />

            {/* Tabs */}
            <div className="mt-8">
              <div className="flex gap-2 mb-6 bg-white border border-brand-border rounded-2xl p-1 w-fit">
                {[
                  { value: "pipeline", label: "Pipeline" },
                  { value: "lista", label: "Lista" },
                  { value: "vendedores", label: "Vendedores" },
                ].map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() =>
                      setActiveTab(
                        tab.value as "pipeline" | "lista" | "vendedores",
                      )
                    }
                    className={cn(
                      "px-4 py-2.5 rounded-xl font-semibold text-sm transition-all",
                      activeTab === tab.value
                        ? "bg-primary-600 text-white"
                        : "text-brand-text-secondary hover:text-brand-text-primary",
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === "pipeline" && (
                  <motion.div
                    key="pipeline"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <PipelineTab
                      orders={orders}
                      onSelectOrder={setSelectedOrder}
                    />
                  </motion.div>
                )}

                {activeTab === "lista" && (
                  <motion.div
                    key="lista"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
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
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
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

      {/* New Order Modal */}
      <NewOrderModal
        isOpen={isNewOrderOpen}
        onClose={() => setIsNewOrderOpen(false)}
        sellers={sellers}
        suppliers={suppliers}
        products={products}
        onSuccess={() => {
          // Optional: Can add additional success handling here
        }}
      />

      <SaleOrderDetailPanel
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
