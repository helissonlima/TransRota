'use client';

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  X,
  Phone,
  MapPin,
  Package,
  ShoppingCart,
  CheckCircle,
  AlertCircle,
  Eye,
  Link2,
  Trash2,
  Edit2,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { cn } from '@/lib/cn';
import { Header } from '@/components/layout/header';

// Validation schemas
const supplierFormSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  tradeName: z.string().optional(),
  cnpj: z.string().min(14, 'CNPJ inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  email: z.string().email('Email inválido'),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().length(2, 'Estado deve ter 2 caracteres').optional(),
  contactName: z.string().optional(),
  notes: z.string().optional(),
});

const linkProductSchema = z.object({
  productId: z.string().min(1, 'Selecione um produto'),
  supplierSku: z.string().optional(),
  unitPrice: z.coerce.number().positive().optional(),
});

type SupplierFormData = z.infer<typeof supplierFormSchema>;
type LinkProductData = z.infer<typeof linkProductSchema>;

interface Supplier {
  id: string;
  name: string;
  tradeName?: string;
  cnpj: string;
  phone: string;
  email: string;
  address?: string;
  city?: string;
  state?: string;
  contactName?: string;
  notes?: string;
  active: boolean;
  productCount: number;
  orderCount: number;
  products?: Array<{
    id: string;
    name: string;
    supplierSku?: string;
    unitPrice?: number;
  }>;
  orders?: Array<{
    id: string;
    orderNumber: string;
    status: string;
    date: string;
    total: number;
  }>;
}

interface Stats {
  total: number;
  active: number;
  totalProducts: number;
  pendingOrders: number;
}

// Stat Card Component
function StatCard({
  icon: Icon,
  label,
  value,
  color,
  index,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-white border border-brand-border rounded-2xl shadow-card p-6 hover:shadow-card-hover transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-brand-text-secondary text-sm font-medium">{label}</p>
          <p className={cn('text-3xl font-bold mt-2', color)}>{value}</p>
        </div>
        <div className={cn('p-3 rounded-xl', color.replace('text-', 'bg-').replace('-600', '-100'))}>
          {Icon}
        </div>
      </div>
    </motion.div>
  );
}

// Link Product Modal
function LinkProductModal({
  isOpen,
  onClose,
  supplierId,
  onSuccess,
  availableProducts,
}: {
  isOpen: boolean;
  onClose: () => void;
  supplierId: string;
  onSuccess: () => void;
  availableProducts: any[];
}) {
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LinkProductData>({
    resolver: zodResolver(linkProductSchema),
    defaultValues: {
      productId: '',
      supplierSku: '',
      unitPrice: undefined,
    },
  });

  const linkMutation = useMutation({
    mutationFn: async (data: LinkProductData) => {
      return api.post(`/suppliers/${supplierId}/products`, data);
    },
    onSuccess: () => {
      toast.success('Produto vinculado com sucesso');
      queryClient.invalidateQueries({ queryKey: ['supplier', supplierId] });
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      reset();
      onSuccess();
    },
    onError: () => {
      toast.error('Erro ao vincular produto');
    },
  });

  const onSubmit = async (data: LinkProductData) => {
    await linkMutation.mutateAsync(data);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-end z-50"
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ duration: 0.3 }}
        className="bg-white w-full rounded-t-3xl p-6 max-w-md mx-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-brand-text-primary">Vincular Produto</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-brand-bg rounded-lg transition-colors"
          >
            <X size={20} className="text-brand-text-secondary" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-text-primary mb-2">
              Produto *
            </label>
            <Controller
              name="productId"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-4 py-2 border border-brand-border rounded-xl bg-white text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-primary-600"
                >
                  <option value="">Selecione um produto</option>
                  {availableProducts.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.productId && (
              <p className="text-red-500 text-xs mt-1">{errors.productId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-text-primary mb-2">
              SKU do Fornecedor
            </label>
            <Controller
              name="supplierSku"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="Ex: SKU-001"
                  className="w-full px-4 py-2 border border-brand-border rounded-xl bg-white text-brand-text-primary placeholder-brand-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-text-primary mb-2">
              Preço Unitário
            </label>
            <Controller
              name="unitPrice"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-brand-border rounded-xl bg-white text-brand-text-primary placeholder-brand-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              )}
            />
            {errors.unitPrice && (
              <p className="text-red-500 text-xs mt-1">{errors.unitPrice.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={linkMutation.isPending}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-50"
          >
            {linkMutation.isPending ? 'Vinculando...' : 'Vincular Produto'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

// Supplier Detail Modal
function SupplierDetailModal({
  isOpen,
  onClose,
  supplier,
  onUpdate,
  availableProducts,
}: {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier | null;
  onUpdate: () => void;
  availableProducts: any[];
}) {
  const [activeTab, setActiveTab] = useState<'info' | 'products' | 'orders'>('info');
  const [showLinkProduct, setShowLinkProduct] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: supplier
      ? {
          name: supplier.name,
          tradeName: supplier.tradeName || '',
          cnpj: supplier.cnpj,
          phone: supplier.phone,
          email: supplier.email,
          address: supplier.address || '',
          city: supplier.city || '',
          state: supplier.state || '',
          contactName: supplier.contactName || '',
          notes: supplier.notes || '',
        }
      : undefined,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: SupplierFormData) => {
      return api.put(`/suppliers/${supplier?.id}`, data);
    },
    onSuccess: () => {
      toast.success('Fornecedor atualizado com sucesso');
      queryClient.invalidateQueries({ queryKey: ['supplier', supplier?.id] });
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      setEditMode(false);
      onUpdate();
    },
    onError: () => {
      toast.error('Erro ao atualizar fornecedor');
    },
  });

  const onSubmit = async (data: SupplierFormData) => {
    await updateMutation.mutateAsync(data);
  };

  if (!isOpen || !supplier) return null;

  return (
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
        transition={{ duration: 0.3 }}
        className="fixed inset-4 bg-white rounded-3xl shadow-lg overflow-hidden z-50 flex flex-col max-w-3xl mx-auto"
      >
        {/* Header */}
        <div className="border-b border-brand-border p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center text-white font-bold">
              {supplier.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-brand-text-primary">{supplier.name}</h2>
              <p className="text-brand-text-secondary text-sm">{supplier.tradeName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-brand-bg rounded-lg transition-colors"
          >
            <X size={24} className="text-brand-text-secondary" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-brand-border px-6">
          {(['info', 'products', 'orders'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-6 py-4 font-medium text-sm transition-colors border-b-2',
                activeTab === tab
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-brand-text-secondary hover:text-brand-text-primary'
              )}
            >
              {tab === 'info' && 'Informações'}
              {tab === 'products' && `Produtos (${supplier.productCount})`}
              {tab === 'orders' && `Compras (${supplier.orderCount})`}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'info' && (
              <motion.div
                key="info"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {!editMode ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-brand-bg p-4 rounded-xl">
                        <p className="text-xs font-medium text-brand-text-secondary uppercase">CNPJ</p>
                        <p className="text-lg font-semibold text-brand-text-primary mt-1">{supplier.cnpj}</p>
                      </div>
                      <div className="bg-brand-bg p-4 rounded-xl">
                        <p className="text-xs font-medium text-brand-text-secondary uppercase">Status</p>
                        <div className="flex items-center gap-2 mt-1">
                          {supplier.active ? (
                            <>
                              <CheckCircle size={18} className="text-green-600" />
                              <span className="font-semibold text-green-600">Ativo</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle size={18} className="text-gray-400" />
                              <span className="font-semibold text-gray-400">Inativo</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 bg-brand-bg p-4 rounded-xl">
                        <Phone size={18} className="text-primary-600" />
                        <div>
                          <p className="text-xs text-brand-text-secondary">Telefone</p>
                          <p className="font-semibold text-brand-text-primary">{supplier.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-brand-bg p-4 rounded-xl">
                        <MapPin size={18} className="text-primary-600" />
                        <div>
                          <p className="text-xs text-brand-text-secondary">Localização</p>
                          <p className="font-semibold text-brand-text-primary">
                            {supplier.city}, {supplier.state}
                          </p>
                        </div>
                      </div>
                    </div>

                    {supplier.address && (
                      <div className="bg-brand-bg p-4 rounded-xl">
                        <p className="text-xs font-medium text-brand-text-secondary uppercase">Endereço</p>
                        <p className="text-brand-text-primary mt-1">{supplier.address}</p>
                      </div>
                    )}

                    {supplier.contactName && (
                      <div className="bg-brand-bg p-4 rounded-xl">
                        <p className="text-xs font-medium text-brand-text-secondary uppercase">Contato</p>
                        <p className="text-brand-text-primary mt-1">{supplier.contactName}</p>
                      </div>
                    )}

                    {supplier.notes && (
                      <div className="bg-brand-bg p-4 rounded-xl">
                        <p className="text-xs font-medium text-brand-text-secondary uppercase">Notas</p>
                        <p className="text-brand-text-primary mt-1">{supplier.notes}</p>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        setEditMode(true);
                        reset();
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-xl transition-colors"
                    >
                      <Edit2 size={18} />
                      Editar Informações
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-brand-text-primary mb-2">
                          Nome *
                        </label>
                        <Controller
                          name="name"
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="text"
                              className="w-full px-4 py-2 border border-brand-border rounded-xl bg-white text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-primary-600"
                            />
                          )}
                        />
                        {errors.name && (
                          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-brand-text-primary mb-2">
                          Nome Fantasia
                        </label>
                        <Controller
                          name="tradeName"
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="text"
                              className="w-full px-4 py-2 border border-brand-border rounded-xl bg-white text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-primary-600"
                            />
                          )}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-brand-text-primary mb-2">
                          CNPJ *
                        </label>
                        <Controller
                          name="cnpj"
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="text"
                              className="w-full px-4 py-2 border border-brand-border rounded-xl bg-white text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-primary-600"
                            />
                          )}
                        />
                        {errors.cnpj && (
                          <p className="text-red-500 text-xs mt-1">{errors.cnpj.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-brand-text-primary mb-2">
                          Telefone *
                        </label>
                        <Controller
                          name="phone"
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="tel"
                              className="w-full px-4 py-2 border border-brand-border rounded-xl bg-white text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-primary-600"
                            />
                          )}
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-brand-text-primary mb-2">
                        Email *
                      </label>
                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="email"
                            className="w-full px-4 py-2 border border-brand-border rounded-xl bg-white text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-primary-600"
                          />
                        )}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-brand-text-primary mb-2">
                          Cidade
                        </label>
                        <Controller
                          name="city"
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="text"
                              className="w-full px-4 py-2 border border-brand-border rounded-xl bg-white text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-primary-600"
                            />
                          )}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-brand-text-primary mb-2">
                          Estado
                        </label>
                        <Controller
                          name="state"
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="text"
                              maxLength={2}
                              className="w-full px-4 py-2 border border-brand-border rounded-xl bg-white text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-primary-600"
                            />
                          )}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-brand-text-primary mb-2">
                        Endereço
                      </label>
                      <Controller
                        name="address"
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            className="w-full px-4 py-2 border border-brand-border rounded-xl bg-white text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-primary-600"
                          />
                        )}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-brand-text-primary mb-2">
                        Nome do Contato
                      </label>
                      <Controller
                        name="contactName"
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            className="w-full px-4 py-2 border border-brand-border rounded-xl bg-white text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-primary-600"
                          />
                        )}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-brand-text-primary mb-2">
                        Notas
                      </label>
                      <Controller
                        name="notes"
                        control={control}
                        render={({ field }) => (
                          <textarea
                            {...field}
                            rows={3}
                            className="w-full px-4 py-2 border border-brand-border rounded-xl bg-white text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-primary-600"
                          />
                        )}
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={updateMutation.isPending}
                        className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-50"
                      >
                        {updateMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditMode(false)}
                        className="flex-1 bg-brand-bg hover:bg-gray-100 text-brand-text-primary font-medium py-3 rounded-xl transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            )}

            {activeTab === 'products' && (
              <motion.div
                key="products"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {supplier.products && supplier.products.length > 0 ? (
                  <div className="space-y-2">
                    {supplier.products.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-brand-bg p-4 rounded-xl hover:shadow-card transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-brand-text-primary">{product.name}</p>
                            {product.supplierSku && (
                              <p className="text-sm text-brand-text-secondary mt-1">
                                SKU: {product.supplierSku}
                              </p>
                            )}
                          </div>
                          {product.unitPrice && (
                            <div className="text-right">
                              <p className="text-sm text-brand-text-secondary">Preço Unitário</p>
                              <p className="font-bold text-primary-600">
                                R$ {product.unitPrice.toFixed(2)}
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package size={48} className="mx-auto text-brand-text-secondary/30 mb-3" />
                    <p className="text-brand-text-secondary">Nenhum produto vinculado</p>
                  </div>
                )}

                <button
                  onClick={() => setShowLinkProduct(true)}
                  className="w-full mt-6 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-xl transition-colors"
                >
                  <Link2 size={18} />
                  Vincular Novo Produto
                </button>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {supplier.orders && supplier.orders.length > 0 ? (
                  <div className="space-y-2">
                    {supplier.orders.map((order, index) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-brand-bg p-4 rounded-xl hover:shadow-card transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-brand-text-primary">
                              Pedido {order.orderNumber}
                            </p>
                            <p className="text-sm text-brand-text-secondary mt-1">
                              {new Date(order.date).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-primary-600">
                              R$ {order.total.toFixed(2)}
                            </p>
                            <span
                              className={cn(
                                'text-xs font-medium mt-1 inline-block px-2 py-1 rounded-full',
                                order.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : order.status === 'completed'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-700'
                              )}
                            >
                              {order.status === 'pending'
                                ? 'Pendente'
                                : order.status === 'completed'
                                  ? 'Concluído'
                                  : 'Cancelado'}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ShoppingCart size={48} className="mx-auto text-brand-text-secondary/30 mb-3" />
                    <p className="text-brand-text-secondary">Nenhuma compra registrada</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <LinkProductModal
        isOpen={showLinkProduct}
        onClose={() => setShowLinkProduct(false)}
        supplierId={supplier.id}
        onSuccess={() => setShowLinkProduct(false)}
        availableProducts={availableProducts}
      />
    </>
  );
}

// New Supplier Modal
function NewSupplierModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      name: '',
      tradeName: '',
      cnpj: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      state: '',
      contactName: '',
      notes: '',
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: SupplierFormData) => {
      return api.post('/suppliers', data);
    },
    onSuccess: () => {
      toast.success('Fornecedor criado com sucesso');
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      reset();
      onSuccess();
    },
    onError: () => {
      toast.error('Erro ao criar fornecedor');
    },
  });

  const onSubmit = async (data: SupplierFormData) => {
    await createMutation.mutateAsync(data);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-end z-50"
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ duration: 0.3 }}
        className="bg-white w-full rounded-t-3xl p-6 max-w-2xl mx-auto max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-white">
          <h3 className="text-xl font-bold text-brand-text-primary">Novo Fornecedor</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-brand-bg rounded-lg transition-colors"
          >
            <X size={20} className="text-brand-text-secondary" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-text-primary mb-2">
                Nome *
              </label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Razão Social"
                    className="w-full px-4 py-2 border border-brand-border rounded-xl bg-white text-brand-text-primary placeholder-brand-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                )}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-text-primary mb-2">
                Nome Fantasia
              </label>
              <Controller
                name="tradeName"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Nome Fantasia"
                    className="w-full px-4 py-2 border border-brand-border rounded-xl bg-white text-brand-text-primary placeholder-brand-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-text-primary mb-2">
                CNPJ *
              </label>
              <Controller
                name="cnpj"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="00.000.000/0000-00"
                    className="w-full px-4 py-2 border border-brand-border rounded-xl bg-white text-brand-text-primary placeholder-brand-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                )}
              />
              {errors.cnpj && <p className="text-red-500 text-xs mt-1">{errors.cnpj.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-text-primary mb-2">
                Telefone *
              </label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="tel"
                    placeholder="(11) 9999-9999"
                    className="w-full px-4 py-2 border border-brand-border rounded-xl bg-white text-brand-text-primary placeholder-brand-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                )}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-text-primary mb-2">
              Email *
            </label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="email"
                  placeholder="email@example.com"
                  className="w-full px-4 py-2 border border-brand-border rounded-xl bg-white text-brand-text-primary placeholder-brand-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              )}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-text-primary mb-2">
                Cidade
              </label>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="São Paulo"
                    className="w-full px-4 py-2 border border-brand-border rounded-xl bg-white text-brand-text-primary placeholder-brand-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-text-primary mb-2">
                Estado
              </label>
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    maxLength={2}
                    placeholder="SP"
                    className="w-full px-4 py-2 border border-brand-border rounded-xl bg-white text-brand-text-primary placeholder-brand-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                )}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-text-primary mb-2">
              Endereço
            </label>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="Rua exemplo, 123"
                  className="w-full px-4 py-2 border border-brand-border rounded-xl bg-white text-brand-text-primary placeholder-brand-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-text-primary mb-2">
              Nome do Contato
            </label>
            <Controller
              name="contactName"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="Nome do responsável"
                  className="w-full px-4 py-2 border border-brand-border rounded-xl bg-white text-brand-text-primary placeholder-brand-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-text-primary mb-2">
              Notas
            </label>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={3}
                  placeholder="Adicione informações adicionais..."
                  className="w-full px-4 py-2 border border-brand-border rounded-xl bg-white text-brand-text-primary placeholder-brand-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              )}
            />
          </div>

          <div className="flex gap-3 sticky bottom-0 bg-white pt-4">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              {createMutation.isPending ? 'Criando...' : 'Criar Fornecedor'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-brand-bg hover:bg-gray-100 text-brand-text-primary font-medium py-3 rounded-xl transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// Main Page Component
export default function SuppliersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const queryClient = useQueryClient();

  // Fetch suppliers
  const {
    data: suppliers = [],
    isLoading: suppliersLoading,
    error: suppliersError,
  } = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const response = await api.get('/suppliers');
      return response.data as Supplier[];
    },
  });

  // Fetch products for linking
  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await api.get('/products');
      return response.data;
    },
  });

  // Fetch supplier detail when selected
  const { data: supplierDetail } = useQuery({
    queryKey: ['supplier', selectedSupplier?.id],
    queryFn: async () => {
      const response = await api.get(`/suppliers/${selectedSupplier?.id}`);
      return response.data as Supplier;
    },
    enabled: !!selectedSupplier?.id,
  });

  // Calculate stats
  const stats: Stats = useMemo(
    () => ({
      total: suppliers.length,
      active: suppliers.filter((s) => s.active).length,
      totalProducts: suppliers.reduce((sum, s) => sum + (s.productCount || 0), 0),
      pendingOrders: suppliers.reduce((sum, s) => sum + (s.orderCount || 0), 0),
    }),
    [suppliers]
  );

  // Filter suppliers
  const filteredSuppliers = useMemo(
    () =>
      suppliers.filter(
        (supplier) =>
          supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          supplier.cnpj.includes(searchTerm) ||
          supplier.phone.includes(searchTerm)
      ),
    [suppliers, searchTerm]
  );

  if (suppliersError) {
    return (
      <div className="min-h-screen bg-brand-bg p-8">
        <div className="text-center">
          <p className="text-red-600">Erro ao carregar fornecedores</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      <Header title="Fornecedores" subtitle={`${stats.total} fornecedores cadastrados`} />

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<Package size={24} className="text-primary-600" />}
            label="Total de Fornecedores"
            value={stats.total}
            color="text-primary-600"
            index={0}
          />
          <StatCard
            icon={<CheckCircle size={24} className="text-green-600" />}
            label="Fornecedores Ativos"
            value={stats.active}
            color="text-green-600"
            index={1}
          />
          <StatCard
            icon={<Link2 size={24} className="text-blue-600" />}
            label="Produtos Vinculados"
            value={stats.totalProducts}
            color="text-blue-600"
            index={2}
          />
          <StatCard
            icon={<ShoppingCart size={24} className="text-amber-600" />}
            label="Pedidos Totais"
            value={stats.pendingOrders}
            color="text-amber-600"
            index={3}
          />
        </div>

        {/* Search and Create Button */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text-secondary"
            />
            <input
              type="text"
              placeholder="Buscar por nome, CNPJ ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-brand-border rounded-xl bg-white text-brand-text-primary placeholder-brand-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
          </div>
          <button
            onClick={() => setShowNewModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-3 rounded-xl transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Novo Fornecedor
          </button>
        </div>

        {/* Suppliers Grid */}
        {suppliersLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-brand-border border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-brand-text-secondary">Carregando fornecedores...</p>
            </div>
          </div>
        ) : filteredSuppliers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredSuppliers.map((supplier, index) => (
                <motion.div
                  key={supplier.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => setSelectedSupplier(supplierDetail || supplier)}
                  className="bg-white border border-brand-border rounded-2xl shadow-card hover:shadow-card-hover transition-all cursor-pointer overflow-hidden group"
                >
                  <div className="p-6 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-brand-text-primary text-lg">
                          {supplier.name}
                        </h3>
                        <p className="text-sm text-brand-text-secondary">{supplier.tradeName}</p>
                      </div>
                      <div
                        className={cn(
                          'px-3 py-1 rounded-full text-xs font-semibold',
                          supplier.active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        )}
                      >
                        {supplier.active ? 'Ativo' : 'Inativo'}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-brand-text-secondary">
                        <span className="font-medium">CNPJ:</span>
                        <span>{supplier.cnpj}</span>
                      </div>
                      <div className="flex items-center gap-2 text-brand-text-secondary">
                        <Phone size={16} />
                        <span>{supplier.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-brand-text-secondary">
                        <MapPin size={16} />
                        <span>
                          {supplier.city}, {supplier.state}
                        </span>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex gap-2 pt-2">
                      <div className="flex-1 bg-blue-50 rounded-lg p-3 text-center">
                        <p className="text-xs text-brand-text-secondary">Produtos</p>
                        <p className="font-bold text-primary-600">{supplier.productCount}</p>
                      </div>
                      <div className="flex-1 bg-amber-50 rounded-lg p-3 text-center">
                        <p className="text-xs text-brand-text-secondary">Compras</p>
                        <p className="font-bold text-amber-600">{supplier.orderCount}</p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button className="w-full mt-4 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 rounded-xl transition-colors group-hover:shadow-lg">
                      <Eye size={16} />
                      Ver Detalhes
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white border border-brand-border rounded-2xl shadow-card p-12 text-center"
          >
            <Package size={48} className="mx-auto text-brand-text-secondary/30 mb-3" />
            <p className="text-brand-text-secondary mb-4">
              {searchTerm ? 'Nenhum fornecedor encontrado' : 'Nenhum fornecedor cadastrado ainda'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowNewModal(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-2 rounded-xl transition-colors inline-flex items-center gap-2"
              >
                <Plus size={18} />
                Criar Primeiro Fornecedor
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        <NewSupplierModal
          isOpen={showNewModal}
          onClose={() => setShowNewModal(false)}
          onSuccess={() => setShowNewModal(false)}
        />

        {selectedSupplier && (
          <SupplierDetailModal
            isOpen={!!selectedSupplier}
            onClose={() => setSelectedSupplier(null)}
            supplier={supplierDetail || selectedSupplier}
            onUpdate={() => {}}
            availableProducts={products}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
