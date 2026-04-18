'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import api from '@/lib/api';
import { cn } from '@/lib/cn';
import { Header } from '@/components/layout/header';

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

interface SaleOrder {
  id: string;
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
  DRAFT: 'text-slate-500 bg-slate-100',
  CONFIRMED: 'text-blue-400 bg-blue-500/10',
  PARTIALLY_DELIVERED: 'text-orange-400 bg-orange-500/10',
  DELIVERED: 'text-emerald-400 bg-emerald-500/10',
  CANCELLED: 'text-red-400 bg-red-500/10',
  INVOICED: 'text-purple-400 bg-purple-500/10',
};

const STATUS_LABEL: Record<string, string> = {
  DRAFT: 'Rascunho',
  CONFIRMED: 'Confirmado',
  PARTIALLY_DELIVERED: 'Parcial',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelado',
  INVOICED: 'Faturado',
};

const DELIVERY_STATUS_COLOR: Record<string, string> = {
  PENDING: 'text-amber-500 bg-amber-500/10',
  IN_TRANSIT: 'text-blue-500 bg-blue-500/10',
  DELIVERED: 'text-emerald-500 bg-emerald-500/10',
  RETURNED: 'text-red-500 bg-red-500/10',
  TO_VERIFY: 'text-orange-500 bg-orange-500/10',
  PARTIAL: 'text-purple-500 bg-purple-500/10',
};

const DELIVERY_STATUS_LABEL: Record<string, string> = {
  PENDING: 'Pendente',
  IN_TRANSIT: 'Em Trânsito',
  DELIVERED: 'Entregue',
  RETURNED: 'Devolvida',
  TO_VERIFY: 'A Verificar',
  PARTIAL: 'Parcial',
};

const PAYMENT_METHODS = [
  { value: 'CASH', label: 'Dinheiro' },
  { value: 'PIX', label: 'PIX' },
  { value: 'BANK_SLIP', label: 'Boleto' },
  { value: 'CREDIT_CARD', label: 'Cartão Crédito' },
  { value: 'DEBIT_CARD', label: 'Cartão Débito' },
  { value: 'TRANSFER', label: 'Transferência' },
];

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const OrderItemSchema = z.object({
  productId: z.string().min(1, 'Produto é obrigatório'),
  quantity: z.number().min(1, 'Quantidade deve ser maior que 0'),
  unitPrice: z.number().min(0, 'Preço deve ser válido'),
});

const CreateSaleOrderSchema = z.object({
  clientName: z.string().min(1, 'Nome do cliente é obrigatório'),
  clientDoc: z.string().min(1, 'CPF/CNPJ é obrigatório'),
  clientEmail: z.string().email('Email inválido'),
  clientPhone: z.string().min(1, 'Telefone é obrigatório'),
  clientAddress: z.string().min(1, 'Endereço é obrigatório'),
  sellerId: z.string().min(1, 'Vendedor é obrigatório'),
  supplierId: z.string().min(1, 'Fornecedor é obrigatório'),
  invoiceNumber: z.string().optional(),
  paymentMethod: z.string().min(1, 'Método de pagamento é obrigatório'),
  dueDate: z.string().min(1, 'Data de vencimento é obrigatória'),
  isPriceLocked: z.boolean().default(false),
  isSafra: z.boolean().default(false),
  safraDescription: z.string().optional(),
  items: z.array(OrderItemSchema).min(1, 'Adicione pelo menos um item'),
  notes: z.string().optional(),
});

type CreateSaleOrderInput = z.infer<typeof CreateSaleOrderSchema>;

// ============================================================================
// COMPONENT: KPI CARDS
// ============================================================================

function KPICards({ stats }: { stats: DashboardStats }) {
  const kpis = [
    {
      label: 'Total Pedidos',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'from-blue-500/20 to-blue-600/20',
    },
    {
      label: 'Receita Total',
      value: `R$ ${(stats.totalRevenue / 100).toFixed(2)}`,
      icon: DollarSign,
      color: 'from-emerald-500/20 to-emerald-600/20',
    },
    {
      label: 'Pendentes',
      value: stats.pendingOrders,
      icon: Clock,
      color: 'from-amber-500/20 to-amber-600/20',
    },
    {
      label: 'Entregues',
      value: stats.deliveredOrders,
      icon: Truck,
      color: 'from-cyan-500/20 to-cyan-600/20',
    },
    {
      label: 'Cancelados',
      value: stats.cancelledOrders,
      icon: XCircle,
      color: 'from-red-500/20 to-red-600/20',
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
                'bg-white border border-brand-border rounded-2xl p-6 shadow-card',
                'bg-gradient-to-br',
                kpi.color
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

function PipelineTab({ orders }: { orders: SaleOrder[] }) {
  const statuses = ['DRAFT', 'CONFIRMED', 'DELIVERED', 'CANCELLED'] as const;

  const ordersByStatus = useMemo(() => {
    return statuses.reduce(
      (acc, status) => {
        acc[status] = orders.filter((o) => o.status === status);
        return acc;
      },
      {} as Record<(typeof statuses)[number], SaleOrder[]>
    );
  }, [orders]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statuses.map((status) => (
        <div key={status} className="bg-brand-bg rounded-2xl p-4 min-h-96">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-brand-text-primary">
              {STATUS_LABEL[status]}
            </h3>
            <span className="bg-primary-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              {ordersByStatus[status].length}
            </span>
          </div>
          <div className="space-y-3">
            <AnimatePresence>
              {ordersByStatus[status].map((order) => (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white border border-brand-border rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="font-semibold text-sm text-brand-text-primary">
                      #{order.orderNumber}
                    </p>
                    <span
                      className={cn(
                        'text-xs px-2 py-1 rounded-md',
                        DELIVERY_STATUS_COLOR[order.deliveryStatus]
                      )}
                    >
                      {DELIVERY_STATUS_LABEL[order.deliveryStatus]}
                    </span>
                  </div>
                  <p className="text-sm text-brand-text-secondary mb-2">
                    {order.clientName}
                  </p>
                  <p className="text-xs text-brand-text-secondary mb-3">
                    Vendedor: {order.sellerName}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-brand-border">
                    <p className="font-bold text-sm text-brand-text-primary">
                      R$ {(order.totalAmount / 100).toFixed(2)}
                    </p>
                    <p className="text-xs text-brand-text-secondary">
                      {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
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

function ListaTab({
  orders,
  sellers,
  suppliers,
}: {
  orders: SaleOrder[];
  sellers: Seller[];
  suppliers: Supplier[];
}) {
  const [filters, setFilters] = useState<ListaFilters>({
    search: '',
    status: '',
    deliveryStatus: '',
    sellerId: '',
    supplierId: '',
  });

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchMatch =
        filters.search === '' ||
        order.orderNumber
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        order.clientName
          .toLowerCase()
          .includes(filters.search.toLowerCase());

      const statusMatch = filters.status === '' || order.status === filters.status;
      const deliveryMatch =
        filters.deliveryStatus === '' ||
        order.deliveryStatus === filters.deliveryStatus;
      const sellerMatch =
        filters.sellerId === '' || order.sellerId === filters.sellerId;
      const supplierMatch =
        filters.supplierId === '' ||
        order.supplierId === filters.supplierId;

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
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value })
            }
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

      <div className="bg-white border border-brand-border rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-brand-bg border-b border-brand-border">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-brand-text-primary">
                  Nº Pedido
                </th>
                <th className="px-4 py-3 text-left font-semibold text-brand-text-primary">
                  Cliente
                </th>
                <th className="px-4 py-3 text-left font-semibold text-brand-text-primary">
                  Endereço
                </th>
                <th className="px-4 py-3 text-left font-semibold text-brand-text-primary">
                  Vendedor
                </th>
                <th className="px-4 py-3 text-left font-semibold text-brand-text-primary">
                  Fornecedor
                </th>
                <th className="px-4 py-3 text-left font-semibold text-brand-text-primary">
                  NF
                </th>
                <th className="px-4 py-3 text-left font-semibold text-brand-text-primary">
                  Vencimento
                </th>
                <th className="px-4 py-3 text-left font-semibold text-brand-text-primary">
                  Trava
                </th>
                <th className="px-4 py-3 text-left font-semibold text-brand-text-primary">
                  Safra
                </th>
                <th className="px-4 py-3 text-left font-semibold text-brand-text-primary">
                  Total
                </th>
                <th className="px-4 py-3 text-left font-semibold text-brand-text-primary">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-semibold text-brand-text-primary">
                  Entrega
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              <AnimatePresence>
                {filteredOrders.map((order, idx) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className="hover:bg-brand-bg transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-brand-text-primary">
                      #{order.orderNumber}
                    </td>
                    <td className="px-4 py-3 text-brand-text-secondary">
                      {order.clientName}
                    </td>
                    <td className="px-4 py-3 text-brand-text-secondary text-xs">
                      {order.clientAddress.substring(0, 30)}
                    </td>
                    <td className="px-4 py-3 text-brand-text-secondary">
                      {order.sellerName}
                    </td>
                    <td className="px-4 py-3 text-brand-text-secondary">
                      {order.supplierName}
                    </td>
                    <td className="px-4 py-3 text-brand-text-secondary">
                      {order.invoiceNumber || '-'}
                    </td>
                    <td className="px-4 py-3 text-brand-text-secondary">
                      {new Date(order.dueDate).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'text-xs font-semibold px-2 py-1 rounded-md',
                          order.isPriceLocked
                            ? 'bg-red-500/10 text-red-600'
                            : 'bg-emerald-500/10 text-emerald-600'
                        )}
                      >
                        {order.isPriceLocked ? 'SIM' : 'NÃO'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'text-xs font-semibold px-2 py-1 rounded-md',
                          order.isSafra
                            ? 'bg-blue-500/10 text-blue-600'
                            : 'bg-slate-100 text-slate-600'
                        )}
                      >
                        {order.isSafra ? 'SIM' : 'NÃO'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-brand-text-primary">
                      R$ {(order.totalAmount / 100).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'text-xs font-semibold px-2 py-1 rounded-md',
                          STATUS_COLOR[order.status]
                        )}
                      >
                        {STATUS_LABEL[order.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'text-xs font-semibold px-2 py-1 rounded-md',
                          DELIVERY_STATUS_COLOR[order.deliveryStatus]
                        )}
                      >
                        {DELIVERY_STATUS_LABEL[order.deliveryStatus]}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
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
                    R$ {(seller.totalRevenue / 100).toFixed(2)}
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
                      transition={{ duration: 0.6, ease: 'easeOut' }}
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
    reset,
    formState: { errors },
  } = useForm<CreateSaleOrderInput>({
    resolver: zodResolver(CreateSaleOrderSchema),
    defaultValues: {
      items: [{ productId: '', quantity: 1, unitPrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const itemsValue = watch('items');
  const subtotal = useMemo(
    () =>
      itemsValue.reduce((sum, item) => {
        const quantity = item.quantity || 0;
        const price = item.unitPrice || 0;
        return sum + quantity * price * 100;
      }, 0),
    [itemsValue]
  );

  const createOrderMutation = useMutation({
    mutationFn: async (data: CreateSaleOrderInput) => {
      const response = await api.post('/sale-orders', {
        ...data,
        totalAmount: subtotal,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Pedido criado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['sales-orders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      reset();
      onClose();
      onSuccess();
    },
    onError: () => {
      toast.error('Erro ao criar pedido');
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
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

              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                {/* Client Section */}
                <div>
                  <h3 className="font-semibold text-brand-text-primary mb-3">
                    Dados do Cliente
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      {...register('clientName')}
                      placeholder="Nome do Cliente"
                      className="col-span-2 bg-slate-50 border border-brand-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                    />
                    <input
                      {...register('clientDoc')}
                      placeholder="CPF/CNPJ"
                      className="bg-slate-50 border border-brand-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                    />
                    <input
                      {...register('clientEmail')}
                      type="email"
                      placeholder="Email"
                      className="bg-slate-50 border border-brand-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                    />
                    <input
                      {...register('clientPhone')}
                      placeholder="Telefone"
                      className="col-span-2 bg-slate-50 border border-brand-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                    />
                    <input
                      {...register('clientAddress')}
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
                      {...register('sellerId')}
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
                      {...register('supplierId')}
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
                      {...register('invoiceNumber')}
                      placeholder="Nº Nota Fiscal"
                      className="bg-slate-50 border border-brand-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                    />
                    <select
                      {...register('paymentMethod')}
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
                      {...register('dueDate')}
                      type="date"
                      className="col-span-2 bg-slate-50 border border-brand-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                    />
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        {...register('isPriceLocked')}
                        type="checkbox"
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-semibold text-red-600">
                        TRAVA
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        {...register('isSafra')}
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
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {fields.map((field, idx) => {
                      const selectedProduct = products.find(
                        (p) => p.id === itemsValue[idx]?.productId
                      );
                      return (
                        <div key={field.id} className="flex gap-2">
                          <select
                            {...register(`items.${idx}.productId`)}
                            className="flex-1 bg-slate-50 border border-brand-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                          >
                            <option value="">Produto</option>
                            {products.map((product) => (
                              <option key={product.id} value={product.id}>
                                {product.name}
                              </option>
                            ))}
                          </select>
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
                    onClick={() =>
                      append({ productId: '', quantity: 1, unitPrice: 0 })
                    }
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
                      R$ {(subtotal / 100).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Notes */}
                <textarea
                  {...register('notes')}
                  placeholder="Observações (opcional)"
                  rows={3}
                  className="w-full bg-slate-50 border border-brand-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-500"
                />

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={createOrderMutation.isPending}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-xl py-2.5 font-semibold transition-colors flex items-center justify-center gap-2"
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
  const [activeTab, setActiveTab] = useState<'pipeline' | 'lista' | 'vendedores'>(
    'pipeline'
  );
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);

  // Fetch data
  const { data: stats = {} as DashboardStats, isLoading: statsLoading } =
    useQuery({
      queryKey: ['dashboard-stats'],
      queryFn: async () => {
        const response = await api.get('/sale-orders/dashboard');
        return response.data;
      },
    });

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['sales-orders'],
    queryFn: async () => {
      const response = await api.get('/sale-orders');
      return response.data;
    },
  });

  const { data: sellers = [] } = useQuery({
    queryKey: ['sellers'],
    queryFn: async () => {
      const response = await api.get('/sellers');
      return response.data;
    },
  });

  const { data: sellers_performance = [] } = useQuery({
    queryKey: ['sellers-performance'],
    queryFn: async () => {
      const response = await api.get('/sellers/dashboard');
      return response.data;
    },
  });

  const { data: suppliers = [] } = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const response = await api.get('/suppliers');
      return response.data;
    },
  });

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await api.get('/products');
      return response.data;
    },
  });

  const isLoading = statsLoading || ordersLoading;

  return (
    <div className="min-h-screen bg-brand-bg">
      <Header />

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
                  { value: 'pipeline', label: 'Pipeline' },
                  { value: 'lista', label: 'Lista' },
                  { value: 'vendedores', label: 'Vendedores' },
                ].map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() =>
                      setActiveTab(tab.value as 'pipeline' | 'lista' | 'vendedores')
                    }
                    className={cn(
                      'px-4 py-2.5 rounded-xl font-semibold text-sm transition-all',
                      activeTab === tab.value
                        ? 'bg-primary-600 text-white'
                        : 'text-brand-text-secondary hover:text-brand-text-primary'
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === 'pipeline' && (
                  <motion.div
                    key="pipeline"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <PipelineTab orders={orders} />
                  </motion.div>
                )}

                {activeTab === 'lista' && (
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
                    />
                  </motion.div>
                )}

                {activeTab === 'vendedores' && (
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
    </div>
  );
}
