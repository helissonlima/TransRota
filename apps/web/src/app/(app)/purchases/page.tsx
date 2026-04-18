"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  DollarSign,
  Plus,
  X,
  MoreVertical,
  Edit2,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

import api from "@/lib/api";
import { cn } from "@/lib/cn";
import { usePersistedViewMode } from "@/lib/use-persisted-view-mode";
import { UX_CARD_SECTION, uxSelectableCardClass } from "@/lib/ux-card-presets";
import { Header } from "@/components/layout/header";
import { DetailPanel } from "@/components/ui/detail-panel";
import {
  ViewModeToggle,
  VIEW_TOGGLE_PRESETS,
} from "@/components/ui/view-toggle";

// Types and Schemas
interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  invoiceNumber: string;
  isPriceLocked: boolean;
  isSafra: boolean;
  safra?: string;
  notes: string;
  dueDate: string;
  status:
    | "DRAFT"
    | "CONFIRMED"
    | "PARTIALLY_RECEIVED"
    | "RECEIVED"
    | "CANCELLED";
  total: number;
  items: PurchaseOrderItem[];
  createdAt: string;
}

interface PurchaseOrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  receivedQty?: number;
}

interface Supplier {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
}

interface DashboardData {
  total: number;
  pending: number;
  received: number;
  totalValue: number;
}

const STATUS_COLOR = {
  DRAFT: "text-slate-500 bg-slate-100",
  CONFIRMED: "text-blue-400 bg-blue-500/10",
  PARTIALLY_RECEIVED: "text-amber-400 bg-amber-500/10",
  RECEIVED: "text-emerald-400 bg-emerald-500/10",
  CANCELLED: "text-red-400 bg-red-500/10",
};

const STATUS_LABEL = {
  DRAFT: "Rascunho",
  CONFIRMED: "Confirmada",
  PARTIALLY_RECEIVED: "Parcial",
  RECEIVED: "Recebida",
  CANCELLED: "Cancelada",
};

const createPurchaseOrderSchema = z.object({
  supplierId: z.string().min(1, "Fornecedor é obrigatório"),
  invoiceNumber: z.string().min(1, "Nota fiscal é obrigatória"),
  dueDate: z.string().min(1, "Vencimento é obrigatório"),
  isPriceLocked: z.boolean(),
  isSafra: z.boolean(),
  safra: z.string().optional(),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "Produto é obrigatório"),
        quantity: z.number().min(1, "Quantidade mínima é 1"),
        unitPrice: z.number().min(0, "Preço deve ser maior que 0"),
      }),
    )
    .min(1, "Adicione pelo menos um item"),
});

type CreatePurchaseOrderFormData = z.infer<typeof createPurchaseOrderSchema>;

export default function PurchasesPage() {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [supplierFilter, setSupplierFilter] = useState<string>("");
  const [ordersViewMode, setOrdersViewMode] = usePersistedViewMode<
    "list" | "cards"
  >({
    defaultMode: "list",
    allowedModes: ["list", "cards"],
    storageKeyBase: "view-mode:purchases-orders",
  });

  // Queries
  const { data: dashboard, isLoading: dashboardLoading } =
    useQuery<DashboardData>({
      queryKey: ["dashboard"],
      queryFn: async () => {
        const res = await api.get("/purchase-orders/dashboard");
        return res.data;
      },
    });

  const { data: purchaseOrders, isLoading: ordersLoading } = useQuery<
    PurchaseOrder[]
  >({
    queryKey: ["purchase-orders", statusFilter, supplierFilter],
    queryFn: async () => {
      const res = await api.get("/purchase-orders", {
        params: {
          ...(statusFilter && { status: statusFilter }),
          ...(supplierFilter && { supplierId: supplierFilter }),
        },
      });
      return res.data;
    },
  });

  const { data: suppliers } = useQuery<Supplier[]>({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const res = await api.get("/suppliers");
      return res.data;
    },
  });

  const { data: products } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get("/products");
      return res.data;
    },
  });

  // Form
  const form = useForm<CreatePurchaseOrderFormData>({
    resolver: zodResolver(createPurchaseOrderSchema),
    defaultValues: {
      supplierId: "",
      invoiceNumber: "",
      dueDate: "",
      isPriceLocked: false,
      isSafra: false,
      notes: "",
      items: [{ productId: "", quantity: 1, unitPrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Mutations
  const createOrderMutation = useMutation({
    mutationFn: async (data: CreatePurchaseOrderFormData) => {
      const res = await api.post("/purchase-orders", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Ordem de compra criada com sucesso");
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      setIsCreateModalOpen(false);
      form.reset();
    },
    onError: () => {
      toast.error("Erro ao criar ordem de compra");
    },
  });

  const confirmOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const res = await api.patch(`/purchase-orders/${orderId}/confirm`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Ordem confirmada");
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      setSelectedOrder(null);
    },
    onError: () => {
      toast.error("Erro ao confirmar ordem");
    },
  });

  const receiveItemsMutation = useMutation({
    mutationFn: async ({
      orderId,
      items,
    }: {
      orderId: string;
      items: Array<{ itemId: string; receivedQty: number }>;
    }) => {
      const res = await api.patch(`/purchase-orders/${orderId}/receive`, {
        items,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Itens recebidos com sucesso");
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      setSelectedOrder(null);
    },
    onError: () => {
      toast.error("Erro ao receber itens");
    },
  });

  const cancelOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const res = await api.patch(`/purchase-orders/${orderId}/cancel`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Ordem cancelada");
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      setSelectedOrder(null);
    },
    onError: () => {
      toast.error("Erro ao cancelar ordem");
    },
  });

  // Handlers
  const handleCreateOrder = (data: CreatePurchaseOrderFormData) => {
    createOrderMutation.mutate(data);
  };

  const handleConfirmOrder = (orderId: string) => {
    confirmOrderMutation.mutate(orderId);
  };

  const handleReceiveItems = (
    orderId: string,
    receivedItems: Record<string, number>,
  ) => {
    const items = Object.entries(receivedItems).map(
      ([itemId, receivedQty]) => ({
        itemId,
        receivedQty,
      }),
    );
    receiveItemsMutation.mutate({ orderId, items });
  };

  const handleCancelOrder = (orderId: string) => {
    if (confirm("Tem certeza que deseja cancelar esta ordem?")) {
      cancelOrderMutation.mutate(orderId);
    }
  };

  // Filters
  const filteredOrders =
    purchaseOrders?.filter((order) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        order.invoiceNumber.toLowerCase().includes(searchLower) ||
        order.supplierName.toLowerCase().includes(searchLower)
      );
    }) || [];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
  };

  return (
    <div className="min-h-screen bg-brand-bg">
      <Header title="Compras" />

      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-white hover:bg-primary-700"
          >
            <Plus size={20} />
            Nova Ordem
          </motion.button>
        </motion.div>

        {/* Dashboard KPIs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ staggerChildren: 0.1 }}
          className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <KPICard
            label="Total de Compras"
            value={dashboard?.total || 0}
            icon={ShoppingBag}
            isLoading={dashboardLoading}
          />
          <KPICard
            label="Pendentes"
            value={dashboard?.pending || 0}
            icon={Clock}
            isLoading={dashboardLoading}
          />
          <KPICard
            label="Recebidas"
            value={dashboard?.received || 0}
            icon={CheckCircle2}
            isLoading={dashboardLoading}
          />
          <KPICard
            label="Valor Total"
            value={formatCurrency(dashboard?.totalValue || 0)}
            icon={DollarSign}
            isLoading={dashboardLoading}
            isCurrency
          />
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 gap-3 rounded-2xl bg-white p-4 shadow-card"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <input
              type="text"
              placeholder="Pesquisar por nota fiscal ou fornecedor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "rounded-xl border border-brand-border bg-slate-50 px-3.5 py-2.5 text-sm",
                "focus:border-primary-500 focus:outline-none",
              )}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={cn(
                "rounded-xl border border-brand-border bg-slate-50 px-3.5 py-2.5 text-sm",
                "focus:border-primary-500 focus:outline-none",
              )}
            >
              <option value="">Todos os Status</option>
              <option value="DRAFT">Rascunho</option>
              <option value="CONFIRMED">Confirmada</option>
              <option value="PARTIALLY_RECEIVED">Parcial</option>
              <option value="RECEIVED">Recebida</option>
              <option value="CANCELLED">Cancelada</option>
            </select>
            <select
              value={supplierFilter}
              onChange={(e) => setSupplierFilter(e.target.value)}
              className={cn(
                "rounded-xl border border-brand-border bg-slate-50 px-3.5 py-2.5 text-sm",
                "focus:border-primary-500 focus:outline-none",
              )}
            >
              <option value="">Todos os Fornecedores</option>
              {suppliers?.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3 flex items-center justify-end">
            <ViewModeToggle
              mode={ordersViewMode}
              onChange={setOrdersViewMode}
              options={VIEW_TOGGLE_PRESETS.listCards}
            />
          </div>
        </motion.div>

        {ordersViewMode === "list" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="overflow-hidden rounded-2xl border border-brand-border bg-white shadow-card"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-brand-border bg-slate-50">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-brand-text-primary">
                      Nº Ordem
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-brand-text-primary">
                      Fornecedor
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-brand-text-primary">
                      Nota Fiscal
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-brand-text-primary">
                      Vencimento
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-brand-text-primary">
                      Trava
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-brand-text-primary">
                      Safra
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-brand-text-primary">
                      Total
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-brand-text-primary">
                      Status
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-brand-text-primary">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {ordersLoading ? (
                      <tr>
                        <td colSpan={9} className="px-6 py-8 text-center">
                          <motion.div
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="text-brand-text-secondary"
                          >
                            Carregando...
                          </motion.div>
                        </td>
                      </tr>
                    ) : filteredOrders.length === 0 ? (
                      <tr>
                        <td
                          colSpan={9}
                          className="px-6 py-8 text-center text-brand-text-secondary"
                        >
                          Nenhuma ordem encontrada
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order, index) => (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => setSelectedOrder(order)}
                          className="cursor-pointer border-b border-brand-border hover:bg-slate-50"
                        >
                          <td className="px-6 py-4 text-sm font-mono font-semibold text-brand-text-primary">
                            {order.id.slice(0, 8)}
                          </td>
                          <td className="px-6 py-4 text-sm text-brand-text-primary">
                            {order.supplierName}
                          </td>
                          <td className="px-6 py-4 text-sm text-brand-text-primary">
                            {order.invoiceNumber}
                          </td>
                          <td className="px-6 py-4 text-sm text-brand-text-secondary">
                            {formatDate(order.dueDate)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span
                              className={cn(
                                "inline-block rounded-full px-2.5 py-1 text-xs font-semibold",
                                order.isPriceLocked
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-gray-100 text-gray-700",
                              )}
                            >
                              {order.isPriceLocked ? "SIM" : "NÃO"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            {order.isSafra && (
                              <span className="inline-block rounded-full bg-purple-100 px-2.5 py-1 text-xs font-semibold text-purple-700">
                                {order.safra}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-semibold text-brand-text-primary">
                            {formatCurrency(order.total)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span
                              className={cn(
                                "inline-block rounded-full px-2.5 py-1 text-xs font-semibold",
                                STATUS_COLOR[order.status],
                              )}
                            >
                              {STATUS_LABEL[order.status]}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOrder(order);
                              }}
                              className="text-brand-text-secondary hover:text-brand-text-primary"
                            >
                              <MoreVertical size={18} />
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {ordersLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-brand-border bg-white p-4 shadow-card"
                >
                  <div className="h-4 w-24 bg-slate-100 rounded animate-pulse mb-2" />
                  <div className="h-3 w-40 bg-slate-100 rounded animate-pulse mb-2" />
                  <div className="h-3 w-32 bg-slate-100 rounded animate-pulse" />
                </div>
              ))
            ) : filteredOrders.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-brand-border bg-white p-10 text-center text-brand-text-secondary shadow-card">
                Nenhuma ordem encontrada
              </div>
            ) : (
              filteredOrders.map((order, index) => (
                <motion.button
                  key={order.id}
                  type="button"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  onClick={() => setSelectedOrder(order)}
                  className={uxSelectableCardClass()}
                >
                  <div className={UX_CARD_SECTION.header}>
                    <div>
                      <p className="text-xs text-brand-text-secondary">Ordem</p>
                      <p className="text-sm font-mono font-semibold text-brand-text-primary">
                        {order.id.slice(0, 8)}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "inline-block rounded-full px-2.5 py-1 text-xs font-semibold",
                        STATUS_COLOR[order.status],
                      )}
                    >
                      {STATUS_LABEL[order.status]}
                    </span>
                  </div>

                  <div className={UX_CARD_SECTION.infoStack}>
                    <p className="text-sm font-semibold text-brand-text-primary truncate">
                      {order.supplierName}
                    </p>
                    <p className="text-xs text-brand-text-secondary">
                      NF: {order.invoiceNumber}
                    </p>
                    <p className="text-xs text-brand-text-secondary">
                      Vencimento: {formatDate(order.dueDate)}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-brand-border flex items-center justify-between">
                    <span
                      className={cn(
                        "inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold",
                        order.isPriceLocked
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-700",
                      )}
                    >
                      {order.isPriceLocked ? "TRAVA" : "Sem trava"}
                    </span>
                    <span className="text-sm font-bold text-brand-text-primary">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </motion.button>
              ))
            )}
          </motion.div>
        )}
      </main>

      {/* Create Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCreateModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div onClick={(e) => e.stopPropagation()}>
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl"
              >
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-brand-text-primary">
                    Nova Ordem de Compra
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsCreateModalOpen(false)}
                    className="text-brand-text-secondary hover:text-brand-text-primary"
                  >
                    <X size={24} />
                  </motion.button>
                </div>

                <form
                  onSubmit={form.handleSubmit(handleCreateOrder)}
                  className="space-y-6"
                >
                  {/* Supplier */}
                  <div>
                    <label className="block text-sm font-semibold text-brand-text-primary mb-2">
                      Fornecedor *
                    </label>
                    <select
                      {...form.register("supplierId")}
                      className={cn(
                        "w-full rounded-xl border border-brand-border bg-slate-50 px-3.5 py-2.5 text-sm",
                        "focus:border-primary-500 focus:outline-none",
                      )}
                    >
                      <option value="">Selecione um fornecedor</option>
                      {suppliers?.map((supplier) => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </option>
                      ))}
                    </select>
                    {form.formState.errors.supplierId && (
                      <p className="mt-1 text-xs text-red-500">
                        {form.formState.errors.supplierId.message}
                      </p>
                    )}
                  </div>

                  {/* Invoice & Due Date */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-brand-text-primary mb-2">
                        Nota Fiscal *
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: NF-2024-001"
                        {...form.register("invoiceNumber")}
                        className={cn(
                          "w-full rounded-xl border border-brand-border bg-slate-50 px-3.5 py-2.5 text-sm",
                          "focus:border-primary-500 focus:outline-none",
                        )}
                      />
                      {form.formState.errors.invoiceNumber && (
                        <p className="mt-1 text-xs text-red-500">
                          {form.formState.errors.invoiceNumber.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-brand-text-primary mb-2">
                        Vencimento *
                      </label>
                      <input
                        type="date"
                        {...form.register("dueDate")}
                        className={cn(
                          "w-full rounded-xl border border-brand-border bg-slate-50 px-3.5 py-2.5 text-sm",
                          "focus:border-primary-500 focus:outline-none",
                        )}
                      />
                      {form.formState.errors.dueDate && (
                        <p className="mt-1 text-xs text-red-500">
                          {form.formState.errors.dueDate.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        {...form.register("isPriceLocked")}
                        className="h-4 w-4 rounded border-brand-border"
                      />
                      <span className="text-sm text-brand-text-primary">
                        Preço Travado (TRAVA)
                      </span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        {...form.register("isSafra")}
                        className="h-4 w-4 rounded border-brand-border"
                      />
                      <span className="text-sm text-brand-text-primary">
                        Safra
                      </span>
                    </label>
                    {form.watch("isSafra") && (
                      <motion.input
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        type="text"
                        placeholder="Ex: 2024/2025"
                        {...form.register("safra")}
                        className={cn(
                          "w-full rounded-xl border border-brand-border bg-slate-50 px-3.5 py-2.5 text-sm",
                          "focus:border-primary-500 focus:outline-none",
                        )}
                      />
                    )}
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-semibold text-brand-text-primary mb-2">
                      Observações
                    </label>
                    <textarea
                      placeholder="Adicione notas sobre esta ordem..."
                      {...form.register("notes")}
                      rows={3}
                      className={cn(
                        "w-full rounded-xl border border-brand-border bg-slate-50 px-3.5 py-2.5 text-sm",
                        "focus:border-primary-500 focus:outline-none",
                      )}
                    />
                  </div>

                  {/* Items */}
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <label className="block text-sm font-semibold text-brand-text-primary">
                        Itens *
                      </label>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() =>
                          append({ productId: "", quantity: 1, unitPrice: 0 })
                        }
                        className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700"
                      >
                        <Plus size={16} /> Adicionar Item
                      </motion.button>
                    </div>

                    <div className="space-y-3">
                      <AnimatePresence mode="popLayout">
                        {fields.map((field, index) => (
                          <motion.div
                            key={field.id}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex gap-2"
                          >
                            <select
                              {...form.register(`items.${index}.productId`)}
                              className={cn(
                                "flex-1 rounded-xl border border-brand-border bg-slate-50 px-3 py-2 text-sm",
                                "focus:border-primary-500 focus:outline-none",
                              )}
                            >
                              <option value="">Produto</option>
                              {products?.map((product) => (
                                <option key={product.id} value={product.id}>
                                  {product.name}
                                </option>
                              ))}
                            </select>
                            <input
                              type="number"
                              placeholder="Qtd"
                              {...form.register(`items.${index}.quantity`, {
                                valueAsNumber: true,
                              })}
                              className={cn(
                                "w-20 rounded-xl border border-brand-border bg-slate-50 px-2 py-2 text-sm",
                                "focus:border-primary-500 focus:outline-none",
                              )}
                            />
                            <input
                              type="number"
                              placeholder="Preço"
                              {...form.register(`items.${index}.unitPrice`, {
                                valueAsNumber: true,
                              })}
                              className={cn(
                                "w-24 rounded-xl border border-brand-border bg-slate-50 px-2 py-2 text-sm",
                                "focus:border-primary-500 focus:outline-none",
                              )}
                            />
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              type="button"
                              onClick={() => remove(index)}
                              className="text-brand-text-secondary hover:text-red-600"
                            >
                              <X size={18} />
                            </motion.button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    {form.formState.errors.items && (
                      <p className="mt-1 text-xs text-red-500">
                        {form.formState.errors.items.message}
                      </p>
                    )}
                  </div>

                  {/* Subtotal */}
                  <div className="flex justify-end rounded-xl bg-slate-50 p-3">
                    <div className="text-right">
                      <p className="text-xs text-brand-text-secondary">
                        Subtotal
                      </p>
                      <p className="text-lg font-bold text-brand-text-primary">
                        {formatCurrency(
                          form
                            .watch("items")
                            .reduce(
                              (sum, item) =>
                                sum + item.quantity * item.unitPrice,
                              0,
                            ),
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setIsCreateModalOpen(false)}
                      className="flex-1 rounded-xl border border-brand-border px-4 py-2.5 text-sm font-semibold text-brand-text-primary hover:bg-slate-50"
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={createOrderMutation.isPending}
                      className="flex-1 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
                    >
                      {createOrderMutation.isPending
                        ? "Criando..."
                        : "Criar Ordem"}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Panel */}
      {selectedOrder && (
        <OrderDetailPanel
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onConfirm={handleConfirmOrder}
          onReceive={handleReceiveItems}
          onCancel={handleCancelOrder}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
        />
      )}
    </div>
  );
}

// Components
interface KPICardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  isLoading?: boolean;
  isCurrency?: boolean;
}

function KPICard({
  label,
  value,
  icon: Icon,
  isLoading,
  isCurrency,
}: KPICardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="rounded-2xl border border-brand-border bg-white p-4 shadow-card"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-brand-text-secondary">{label}</p>
          <p
            className={cn("mt-2 text-2xl font-bold", isCurrency && "font-mono")}
          >
            {isLoading ? (
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                —
              </motion.span>
            ) : (
              value
            )}
          </p>
        </div>
        <div className="rounded-lg bg-primary-100 p-2">
          <Icon size={24} className="text-primary-600" />
        </div>
      </div>
    </motion.div>
  );
}

interface OrderDetailPanelProps {
  order: PurchaseOrder;
  onClose: () => void;
  onConfirm: (orderId: string) => void;
  onReceive: (orderId: string, items: Record<string, number>) => void;
  onCancel: (orderId: string) => void;
  formatCurrency: (value: number) => string;
  formatDate: (date: string) => string;
}

function OrderDetailPanel({
  order,
  onClose,
  onConfirm,
  onReceive,
  onCancel,
  formatCurrency,
  formatDate,
}: OrderDetailPanelProps) {
  const [receivedItems, setReceivedItems] = useState<Record<string, number>>(
    {},
  );

  return (
    <DetailPanel
      open
      onClose={onClose}
      title={`Ordem #${order.id.slice(0, 8)}`}
      subtitle={order.supplierName}
      badges={[
        {
          label: STATUS_LABEL[order.status],
          variant:
            order.status === "RECEIVED"
              ? "success"
              : order.status === "CANCELLED"
                ? "danger"
                : order.status === "CONFIRMED" ||
                    order.status === "PARTIALLY_RECEIVED"
                  ? "warning"
                  : "gray",
        },
      ]}
      width="lg"
    >
      <DetailPanel.Section title="Informações">
        <DetailPanel.Grid cols={2}>
          <DetailPanel.Field
            label="Nota Fiscal"
            value={order.invoiceNumber}
            mono
          />
          <DetailPanel.Field
            label="Vencimento"
            value={formatDate(order.dueDate)}
          />
          <DetailPanel.Field
            label="Trava de Preço"
            value={order.isPriceLocked ? "Sim" : "Não"}
          />
          <DetailPanel.Field
            label="Total"
            value={formatCurrency(order.total)}
          />
        </DetailPanel.Grid>
      </DetailPanel.Section>

      <DetailPanel.Section title="Itens">
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">
                  Produto
                </th>
                <th className="px-3 py-2 text-center text-xs font-semibold text-slate-600">
                  Qtd
                </th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-slate-600">
                  Preço Unit.
                </th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-slate-600">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="px-3 py-2 text-sm text-slate-700">
                    {item.productName}
                  </td>
                  <td className="px-3 py-2 text-center text-sm text-slate-700">
                    {item.quantity}
                  </td>
                  <td className="px-3 py-2 text-right text-sm text-slate-700">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="px-3 py-2 text-right text-sm font-semibold text-slate-800">
                    {formatCurrency(item.quantity * item.unitPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DetailPanel.Section>

      {["CONFIRMED", "PARTIALLY_RECEIVED"].includes(order.status) && (
        <DetailPanel.Section title="Receber Itens">
          <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-4 space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-2">
                <div className="flex-1">
                  <p className="text-sm text-amber-900">{item.productName}</p>
                  <p className="text-xs text-amber-700">
                    {item.receivedQty || 0}/{item.quantity} recebido
                  </p>
                </div>
                <input
                  type="number"
                  min="0"
                  max={item.quantity - (item.receivedQty || 0)}
                  defaultValue={0}
                  onChange={(e) =>
                    setReceivedItems({
                      ...receivedItems,
                      [item.id]: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-16 rounded-lg border border-amber-300 bg-white px-2 py-1 text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>
            ))}
            <button
              onClick={() => onReceive(order.id, receivedItems)}
              className="mt-2 w-full rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
            >
              Receber Itens
            </button>
          </div>
        </DetailPanel.Section>
      )}

      <div className="flex gap-3 pt-2">
        {order.status === "DRAFT" && (
          <button
            onClick={() => onConfirm(order.id)}
            className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Confirmar Ordem
          </button>
        )}
        {!["RECEIVED", "CANCELLED"].includes(order.status) && (
          <button
            onClick={() => onCancel(order.id)}
            className="flex-1 rounded-xl border border-red-300 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            Cancelar
          </button>
        )}
      </div>
    </DetailPanel>
  );
}
