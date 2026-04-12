'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Package, Plus, Search, AlertTriangle, ArrowUpCircle, ArrowDownCircle,
  BarChart2, Layers, ClipboardList, ShoppingCart, X, CheckCircle2,
  Truck, ChevronRight, RefreshCw, Wrench,
} from 'lucide-react';
import api from '@/lib/api';
import { cn } from '@/lib/cn';
import { Header } from '@/components/layout/header';

// ───────────────────────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────────────────────
type ProductType = 'RAW_MATERIAL' | 'SEMI_FINISHED' | 'FINISHED_GOOD' | 'SERVICE';

interface Product {
  id: string; name: string; sku: string; type: ProductType;
  unit: string; costPrice: number; salePrice: number;
  minStock: number; maxStock?: number; isActive: boolean;
  category?: { id: string; name: string; color: string };
  stockItems?: { quantity: number; locationId?: string }[];
  bom?: { id: string } | null;
}

interface StockItem { id: string; quantity: number; product: Product; location?: { name: string } }
interface StockMovement { id: string; type: string; quantity: number; product: Product; createdAt: string; reason?: string }
interface ProductionOrder { id: string; number: string; product: Product; quantity: number; status: string; createdAt: string; items: any[] }
interface SaleOrder { id: string; number: string; clientName: string; total: number; status: string; createdAt: string; items: any[] }

type Tab = 'catalog' | 'stock' | 'bom' | 'production' | 'sales' | 'movements';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'catalog',    label: 'Catálogo',      icon: Package },
  { id: 'stock',      label: 'Estoque',        icon: Layers },
  { id: 'bom',        label: 'Ficha Técnica',  icon: Wrench },
  { id: 'production', label: 'Produção',        icon: RefreshCw },
  { id: 'sales',      label: 'Vendas',          icon: ShoppingCart },
  { id: 'movements',  label: 'Movimentações',   icon: BarChart2 },
];

const TYPE_LABEL: Record<ProductType, string> = {
  RAW_MATERIAL: 'Matéria-prima', SEMI_FINISHED: 'Semiacabado',
  FINISHED_GOOD: 'Produto Acabado', SERVICE: 'Serviço',
};
const TYPE_COLOR: Record<ProductType, string> = {
  RAW_MATERIAL: 'text-amber-400 bg-amber-500/10',
  SEMI_FINISHED: 'text-orange-400 bg-orange-500/10',
  FINISHED_GOOD: 'text-emerald-400 bg-emerald-500/10',
  SERVICE: 'text-blue-400 bg-blue-500/10',
};
const STATUS_COLOR: Record<string, string> = {
  DRAFT: 'text-slate-500 bg-slate-100',
  CONFIRMED: 'text-blue-400 bg-blue-500/10',
  IN_PROGRESS: 'text-amber-400 bg-amber-500/10',
  COMPLETED: 'text-emerald-400 bg-emerald-500/10',
  CANCELLED: 'text-red-400 bg-red-500/10',
  DELIVERED: 'text-emerald-400 bg-emerald-500/10',
  INVOICED: 'text-purple-400 bg-purple-500/10',
  PARTIALLY_DELIVERED: 'text-orange-400 bg-orange-500/10',
};
const STATUS_LABEL: Record<string, string> = {
  DRAFT: 'Rascunho', CONFIRMED: 'Confirmado', IN_PROGRESS: 'Em Andamento',
  COMPLETED: 'Concluído', CANCELLED: 'Cancelado', DELIVERED: 'Entregue',
  INVOICED: 'Faturado', PARTIALLY_DELIVERED: 'Parcialmente Entregue',
};
const MOV_LABEL: Record<string, string> = {
  ENTRY: 'Entrada', EXIT: 'Saída', ADJUSTMENT: 'Ajuste', PRODUCTION_IN: 'Prod. Entrada',
  PRODUCTION_OUT: 'Prod. Saída', SALE_OUT: 'Saída Venda', TRANSFER_IN: 'Transferência In',
  TRANSFER_OUT: 'Transferência Out', LOSS: 'Perda',
};

// ───────────────────────────────────────────────────────────────
// Schemas
// ───────────────────────────────────────────────────────────────
const productSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  sku: z.string().min(1, 'SKU obrigatório'),
  type: z.enum(['RAW_MATERIAL', 'SEMI_FINISHED', 'FINISHED_GOOD', 'SERVICE']),
  unit: z.string(),
  costPrice: z.coerce.number().min(0),
  salePrice: z.coerce.number().min(0),
  minStock: z.coerce.number().min(0),
  categoryId: z.string().optional(),
  description: z.string().optional(),
});

type ProductForm = z.infer<typeof productSchema>;

const movementSchema = z.object({
  productId: z.string().min(1, 'Produto obrigatório'),
  type: z.enum(['ENTRY', 'EXIT', 'ADJUSTMENT', 'LOSS']),
  quantity: z.coerce.number().min(0.001, 'Quantidade obrigatória'),
  unitCost: z.coerce.number().optional(),
  reason: z.string().optional(),
});
type MovementForm = z.infer<typeof movementSchema>;

const prodOrderSchema = z.object({
  productId: z.string().min(1, 'Produto obrigatório'),
  quantity: z.coerce.number().min(0.001),
  notes: z.string().optional(),
});
type ProdOrderForm = z.infer<typeof prodOrderSchema>;

const saleSchema = z.object({
  clientName: z.string().min(1, 'Nome do cliente obrigatório'),
  clientDoc: z.string().optional(),
  clientEmail: z.string().email().optional().or(z.literal('')),
  clientPhone: z.string().optional(),
  notes: z.string().optional(),
});
type SaleForm = z.infer<typeof saleSchema>;

// ───────────────────────────────────────────────────────────────
// Page
// ───────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const [tab, setTab] = useState<Tab>('catalog');
  const [search, setSearch] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);
  const [showMovModal, setShowMovModal] = useState(false);
  const [showProdModal, setShowProdModal] = useState(false);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [bomProductId, setBomProductId] = useState<string>('');
  const qc = useQueryClient();

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => api.get('/products').then(r => r.data),
  });
  const { data: stock = [] } = useQuery<StockItem[]>({
    queryKey: ['inventory-stock'],
    queryFn: () => api.get('/inventory/stock').then(r => r.data),
    enabled: tab === 'stock',
  });
  const { data: alerts = [] } = useQuery<StockItem[]>({
    queryKey: ['stock-alerts'],
    queryFn: () => api.get('/inventory/stock/alerts').then(r => r.data),
  });
  const { data: movements = [] } = useQuery<StockMovement[]>({
    queryKey: ['inventory-movements'],
    queryFn: () => api.get('/inventory/movements').then(r => r.data),
    enabled: tab === 'movements',
  });
  const { data: productionOrders = [] } = useQuery<ProductionOrder[]>({
    queryKey: ['production-orders'],
    queryFn: () => api.get('/production-orders').then(r => r.data),
    enabled: tab === 'production',
  });
  const { data: saleOrders = [] } = useQuery<SaleOrder[]>({
    queryKey: ['sale-orders'],
    queryFn: () => api.get('/sale-orders').then(r => r.data),
    enabled: tab === 'sales',
  });
  const { data: bom, isLoading: bomLoading } = useQuery({
    queryKey: ['bom', bomProductId],
    queryFn: () => api.get(`/products/${bomProductId}/bom`).then(r => r.data),
    enabled: !!bomProductId && tab === 'bom',
  });

  // ──── Mutations ────
  const createProduct = useMutation({
    mutationFn: (data: ProductForm) => api.post('/products', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['products'] }); setShowProductModal(false); toast.success('Produto criado'); },
    onError: (e: any) => toast.error(e.response?.data?.message ?? 'Erro'),
  });

  const createMovement = useMutation({
    mutationFn: (data: MovementForm) => api.post('/inventory/movements', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['inventory-stock'] });
      qc.invalidateQueries({ queryKey: ['inventory-movements'] });
      qc.invalidateQueries({ queryKey: ['stock-alerts'] });
      setShowMovModal(false);
      toast.success('Movimentação registrada');
    },
    onError: (e: any) => toast.error(e.response?.data?.message ?? 'Erro'),
  });

  const createProdOrder = useMutation({
    mutationFn: (data: ProdOrderForm) => api.post('/production-orders', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['production-orders'] }); setShowProdModal(false); toast.success('Ordem de produção criada'); },
    onError: (e: any) => toast.error(e.response?.data?.message ?? 'Erro'),
  });

  const createSale = useMutation({
    mutationFn: (data: SaleForm & { items: { productId: string; quantity: number; unitPrice: number }[] }) => api.post('/sale-orders', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sale-orders'] }); setShowSaleModal(false); toast.success('Pedido de venda criado'); },
    onError: (e: any) => toast.error(e.response?.data?.message ?? 'Erro'),
  });

  const advanceOrder = useMutation({
    mutationFn: ({ id, action }: { id: string; action: string }) => api.patch(`/production-orders/${id}/${action}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['production-orders'] }); toast.success('Ordem atualizada'); },
    onError: (e: any) => toast.error(e.response?.data?.message ?? 'Erro ao avançar ordem'),
  });

  const advanceSale = useMutation({
    mutationFn: ({ id, action }: { id: string; action: string }) => api.patch(`/sale-orders/${id}/${action}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sale-orders'] }); toast.success('Pedido atualizado'); },
    onError: (e: any) => toast.error(e.response?.data?.message ?? 'Erro'),
  });

  // ──── Forms ────
  const productForm = useForm<ProductForm>({ resolver: zodResolver(productSchema), defaultValues: { type: 'FINISHED_GOOD', unit: 'UN' } });
  const movForm = useForm<MovementForm>({ resolver: zodResolver(movementSchema), defaultValues: { type: 'ENTRY' } });
  const prodForm = useForm<ProdOrderForm>({ resolver: zodResolver(prodOrderSchema) });
  const saleForm = useForm<SaleForm>({ resolver: zodResolver(saleSchema) });
  const [saleItems, setSaleItems] = useState<{ productId: string; quantity: number; unitPrice: number }[]>([]);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase()),
  );

  const totalQty = (p: Product) =>
    (p.stockItems ?? []).reduce((acc, s) => acc + (Number(s.quantity) || 0), 0);

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg">
      <Header title="Produtos & Estoque" />
      <main className="flex-1 p-6 max-w-[1400px] mx-auto w-full space-y-6">
        {/* Page title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-brand-text-primary">Produtos & Estoque</h1>
            <p className="text-sm text-brand-text-secondary mt-0.5">
              {products.length} produto{products.length !== 1 ? 's' : ''} cadastrado{products.length !== 1 ? 's' : ''}
            </p>
          </div>
          {alerts.length > 0 && (
            <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              <AlertTriangle className="w-3.5 h-3.5" /> {alerts.length} alerta{alerts.length !== 1 ? 's' : ''} de estoque
            </span>
          )}
        </div>

        {/* Tabs + action button */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-1 bg-slate-100/80 rounded-2xl p-1 overflow-x-auto">
            {TABS.map(t => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={cn('flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap',
                    active ? 'bg-white text-primary-700 shadow-sm' : 'text-brand-text-secondary hover:text-brand-text-primary hover:bg-white/60'
                  )}>
                  <Icon className={cn('w-4 h-4 flex-shrink-0', active ? 'text-primary-600' : '')} />{t.label}
                </button>
              );
            })}
          </div>
          <div>
            {tab === 'catalog' && (
              <button onClick={() => setShowProductModal(true)} className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white transition-colors">
                <Plus className="w-4 h-4" /> Novo Produto
              </button>
            )}
            {tab === 'stock' && (
              <button onClick={() => setShowMovModal(true)} className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white transition-colors">
                <ArrowUpCircle className="w-4 h-4" /> Movimentar
              </button>
            )}
            {tab === 'production' && (
              <button onClick={() => setShowProdModal(true)} className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white transition-colors">
                <Plus className="w-4 h-4" /> Nova Ordem
              </button>
            )}
            {tab === 'sales' && (
              <button onClick={() => setShowSaleModal(true)} className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white transition-colors">
                <Plus className="w-4 h-4" /> Novo Pedido
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div>

        {/* ── CATALOG ── */}
        {tab === 'catalog' && (
          <div>
            <div className="relative mb-5">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nome ou SKU..." className="w-full max-w-md bg-white border border-brand-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-brand-text-primary placeholder:text-brand-text-secondary focus:outline-none focus:border-primary-500" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map(product => {
                const qty = totalQty(product);
                const isLow = product.type !== 'SERVICE' && product.minStock && qty <= product.minStock;
                return (
                  <motion.div key={product.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-brand-border rounded-2xl p-4 hover:border-primary-300 shadow-card hover:shadow-card-hover transition-all cursor-pointer"
                    onClick={() => setSelectedProduct(product)}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-sm text-brand-text-primary">{product.name}</p>
                        <p className="text-xs text-brand-text-secondary font-mono mt-0.5">{product.sku}</p>
                      </div>
                      <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', TYPE_COLOR[product.type])}>
                        {TYPE_LABEL[product.type]}
                      </span>
                    </div>
                    {product.type !== 'SERVICE' && (
                      <div className={cn('flex items-center gap-2 text-sm font-semibold', isLow ? 'text-amber-600' : 'text-brand-text-primary')}>
                        {isLow && <AlertTriangle className="w-4 h-4" />}
                        {qty.toLocaleString('pt-BR', { maximumFractionDigits: 3 })} {product.unit}
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-brand-border">
                      <span className="text-xs text-brand-text-secondary">Venda: <span className="font-semibold text-brand-text-primary">{product.salePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></span>
                      {product.bom && <span className="text-xs text-primary-600 flex items-center gap-1"><Wrench className="w-3 h-3" />BOM</span>}
                    </div>
                  </motion.div>
                );
              })}
              {filteredProducts.length === 0 && (
                <div className="col-span-full text-center py-20 text-brand-text-secondary">
                  <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Nenhum produto encontrado</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── STOCK ── */}
        {tab === 'stock' && (
          <div>
            {alerts.length > 0 && (
              <div className="mb-5 p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <p className="text-sm font-semibold text-amber-700 mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Estoque Baixo</p>
                <div className="flex flex-wrap gap-2">
                  {alerts.map(a => (
                    <span key={a.id} className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                      {a.product.name} — {Number(a.quantity).toLocaleString('pt-BR', { maximumFractionDigits: 3 })} {a.product.unit}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="rounded-2xl border border-brand-border shadow-card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-brand-text-secondary text-xs uppercase tracking-wide">
                  <tr>
                    {['Produto', 'SKU', 'Tipo', 'Qtd em Estoque', 'Estoque Mín.', 'Localização', 'Status'].map(h => (
                      <th key={h} className="px-5 py-3 text-left font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stock.map(s => {
                    const isLow = s.product.minStock && Number(s.quantity) <= Number(s.product.minStock);
                    return (
                      <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3.5 font-medium">{s.product.name}</td>
                        <td className="px-5 py-3.5 text-brand-text-secondary font-mono text-xs">{s.product.sku}</td>
                        <td className="px-5 py-3.5"><span className={cn('text-xs px-2 py-0.5 rounded-full', TYPE_COLOR[s.product.type])}>{TYPE_LABEL[s.product.type]}</span></td>
                        <td className={cn('px-5 py-3.5 font-semibold', isLow ? 'text-amber-600' : 'text-brand-text-primary')}>
                          {Number(s.quantity).toLocaleString('pt-BR', { maximumFractionDigits: 3 })} <span className="text-xs text-brand-text-secondary">{s.product.unit}</span>
                        </td>
                        <td className="px-5 py-3.5 text-brand-text-secondary">{s.product.minStock ? `${Number(s.product.minStock)} ${s.product.unit}` : '—'}</td>
                        <td className="px-5 py-3.5 text-brand-text-secondary">{s.location?.name ?? 'Principal'}</td>
                        <td className="px-5 py-3.5">
                          {isLow ? (
                            <span className="flex items-center gap-1 text-xs text-amber-400"><AlertTriangle className="w-3.5 h-3.5" /> Baixo</span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs text-emerald-400"><CheckCircle2 className="w-3.5 h-3.5" /> OK</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {stock.length === 0 && (
                    <tr><td colSpan={7} className="text-center py-16 text-brand-text-secondary">Nenhum item em estoque</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── BOM ── */}
        {tab === 'bom' && (
          <div className="max-w-3xl">
            <div className="mb-5">
              <label className="block text-xs text-brand-text-secondary mb-2">Selecione o produto para ver/editar a ficha técnica</label>
              <select value={bomProductId} onChange={e => setBomProductId(e.target.value)}
                className="bg-slate-50 border border-brand-border rounded-xl px-4 py-2.5 text-sm text-brand-text-primary w-full max-w-sm focus:outline-none focus:border-primary-500">
                <option value="">— Selecione —</option>
                {products.filter(p => p.type !== 'RAW_MATERIAL' && p.type !== 'SERVICE').map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                ))}
              </select>
            </div>
            {bomLoading && <p className="text-brand-text-secondary text-sm">Carregando BOM...</p>}
            {bomProductId && !bomLoading && bom && (
              <div className="rounded-2xl border border-brand-border shadow-card overflow-hidden">
                <div className="bg-slate-50 px-5 py-4 border-b border-brand-border">
                  <p className="font-semibold text-sm text-brand-text-primary">Ficha Técnica — {products.find(p => p.id === bomProductId)?.name}</p>
                  <p className="text-xs text-brand-text-secondary mt-0.5">Rendimento por ciclo: {Number(bom.yield)} {products.find(p => p.id === bomProductId)?.unit}</p>
                </div>
                <table className="w-full text-sm">
                  <thead className="bg-slate-100 text-brand-text-secondary text-xs uppercase tracking-wide">
                    <tr>
                      {['Componente', 'SKU', 'Quantidade', 'Perda %', 'Qtd Real'].map(h => <th key={h} className="px-5 py-3 text-left font-medium">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {bom.items?.map((item: any) => {
                      const realQty = Number(item.quantity) * (1 + Number(item.lossPercent) / 100);
                      return (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="px-5 py-3.5 font-medium">{item.component.name}</td>
                          <td className="px-5 py-3.5 text-brand-text-secondary font-mono text-xs">{item.component.sku}</td>
                          <td className="px-5 py-3.5">{Number(item.quantity)} {item.unit}</td>
                          <td className="px-5 py-3.5 text-brand-text-secondary">{Number(item.lossPercent)}%</td>
                          <td className="px-5 py-3.5 text-amber-600">{realQty.toFixed(3)} {item.unit}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            {bomProductId && !bomLoading && !bom && (
              <div className="text-center py-12 text-brand-text-secondary">
                <Wrench className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Nenhuma ficha técnica cadastrada para este produto.</p>
                <p className="text-xs mt-1">Use a API para criar a BOM via POST /products/:id/bom</p>
              </div>
            )}
          </div>
        )}

        {/* ── PRODUCTION ── */}
        {tab === 'production' && (
          <div className="rounded-2xl border border-brand-border shadow-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-brand-text-secondary text-xs uppercase tracking-wide">
                <tr>
                  {['Nº Ordem', 'Produto', 'Quantidade', 'Status', 'Data', 'Ações'].map(h => (
                    <th key={h} className="px-5 py-3 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {productionOrders.map(o => (
                  <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-brand-text-secondary">{o.number}</td>
                    <td className="px-5 py-3.5 font-medium">{o.product.name}</td>
                    <td className="px-5 py-3.5">{Number(o.quantity)} {o.product.unit}</td>
                    <td className="px-5 py-3.5"><span className={cn('text-xs px-2.5 py-1 rounded-full font-medium', STATUS_COLOR[o.status])}>{STATUS_LABEL[o.status]}</span></td>
                    <td className="px-5 py-3.5 text-brand-text-secondary">{new Date(o.createdAt).toLocaleDateString('pt-BR')}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        {o.status === 'DRAFT' && (
                          <button onClick={() => advanceOrder.mutate({ id: o.id, action: 'start' })} className="text-xs px-2.5 py-1 rounded-lg text-blue-400 hover:bg-blue-900/20 transition-colors">Iniciar</button>
                        )}
                        {o.status === 'IN_PROGRESS' && (
                          <button onClick={() => advanceOrder.mutate({ id: o.id, action: 'complete' })} className="text-xs px-2.5 py-1 rounded-lg text-emerald-400 hover:bg-emerald-900/20 transition-colors">Concluir</button>
                        )}
                        {(o.status === 'DRAFT' || o.status === 'IN_PROGRESS') && (
                          <button onClick={() => advanceOrder.mutate({ id: o.id, action: 'cancel' })} className="text-xs px-2.5 py-1 rounded-lg text-red-400 hover:bg-red-900/20 transition-colors">Cancelar</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {productionOrders.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-16 text-brand-text-secondary">Nenhuma ordem de produção</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ── SALES ── */}
        {tab === 'sales' && (
          <div className="rounded-2xl border border-brand-border shadow-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-brand-text-secondary text-xs uppercase tracking-wide">
                <tr>
                  {['Nº Pedido', 'Cliente', 'Total', 'Status', 'Data', 'Ações'].map(h => (
                    <th key={h} className="px-5 py-3 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {saleOrders.map(o => (
                  <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-brand-text-secondary">{o.number}</td>
                    <td className="px-5 py-3.5 font-medium">{o.clientName}</td>
                    <td className="px-5 py-3.5">{Number(o.total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                    <td className="px-5 py-3.5"><span className={cn('text-xs px-2.5 py-1 rounded-full font-medium', STATUS_COLOR[o.status])}>{STATUS_LABEL[o.status]}</span></td>
                    <td className="px-5 py-3.5 text-brand-text-secondary">{new Date(o.createdAt).toLocaleDateString('pt-BR')}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        {o.status === 'DRAFT' && (
                          <button onClick={() => advanceSale.mutate({ id: o.id, action: 'confirm' })} className="text-xs px-2.5 py-1 rounded-lg text-blue-400 hover:bg-blue-900/20">Confirmar</button>
                        )}
                        {o.status === 'CONFIRMED' && (
                          <button onClick={() => advanceSale.mutate({ id: o.id, action: 'deliver' })} className="text-xs px-2.5 py-1 rounded-lg text-emerald-400 hover:bg-emerald-900/20">Entregar</button>
                        )}
                        {(o.status === 'DRAFT' || o.status === 'CONFIRMED') && (
                          <button onClick={() => advanceSale.mutate({ id: o.id, action: 'cancel' })} className="text-xs px-2.5 py-1 rounded-lg text-red-400 hover:bg-red-900/20">Cancelar</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {saleOrders.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-16 text-brand-text-secondary">Nenhum pedido de venda</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ── MOVEMENTS ── */}
        {tab === 'movements' && (
          <div className="rounded-2xl border border-brand-border shadow-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-brand-text-secondary text-xs uppercase tracking-wide">
                <tr>
                  {['Produto', 'Tipo', 'Quantidade', 'Motivo', 'Data'].map(h => (
                    <th key={h} className="px-5 py-3 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {movements.map(m => {
                  const isIn = ['ENTRY', 'PRODUCTION_IN', 'TRANSFER_IN'].includes(m.type);
                  return (
                    <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5 font-medium">{m.product.name}</td>
                      <td className="px-5 py-3.5">
                        <span className={cn('text-xs px-2 py-0.5 rounded-full flex items-center gap-1 w-fit', isIn ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10')}>
                          {isIn ? <ArrowUpCircle className="w-3 h-3" /> : <ArrowDownCircle className="w-3 h-3" />}
                          {MOV_LABEL[m.type] ?? m.type}
                        </span>
                      </td>
                      <td className={cn('px-5 py-3.5 font-semibold', isIn ? 'text-emerald-400' : 'text-red-400')}>
                        {isIn ? '+' : '-'}{Number(m.quantity).toLocaleString('pt-BR', { maximumFractionDigits: 3 })} {m.product.unit}
                      </td>
                      <td className="px-5 py-3.5 text-brand-text-secondary">{m.reason ?? '—'}</td>
                      <td className="px-5 py-3.5 text-brand-text-secondary">{new Date(m.createdAt).toLocaleString('pt-BR')}</td>
                    </tr>
                  );
                })}
                {movements.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-16 text-brand-text-secondary">Nenhuma movimentação registrada</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        </div>
      </main>

      {/* ──────────── MODALS ──────────── */}

      {/* Product Modal */}
      <AnimatePresence>
        {showProductModal && (
          <Modal title="Novo Produto" onClose={() => setShowProductModal(false)}>
            <form onSubmit={productForm.handleSubmit(d => createProduct.mutate(d))} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Nome do produto" error={productForm.formState.errors.name?.message}>
                  <input {...productForm.register('name')} placeholder="Ex: Parafuso M6" className={inputCls} />
                </Field>
                <Field label="SKU" error={productForm.formState.errors.sku?.message}>
                  <input {...productForm.register('sku')} placeholder="Ex: PAR-M6-001" className={inputCls} />
                </Field>
                <Field label="Tipo">
                  <select {...productForm.register('type')} className={inputCls}>
                    <option value="RAW_MATERIAL">Matéria-prima</option>
                    <option value="SEMI_FINISHED">Semiacabado</option>
                    <option value="FINISHED_GOOD">Produto Acabado</option>
                    <option value="SERVICE">Serviço</option>
                  </select>
                </Field>
                <Field label="Unidade">
                  <select {...productForm.register('unit')} className={inputCls}>
                    {['UN','KG','G','L','ML','M','CM','M2','M3','CX','PC','PR','FD','SC'].map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </Field>
                <Field label="Custo (R$)">
                  <input {...productForm.register('costPrice')} type="number" step="0.01" placeholder="0,00" className={inputCls} />
                </Field>
                <Field label="Preço de venda (R$)">
                  <input {...productForm.register('salePrice')} type="number" step="0.01" placeholder="0,00" className={inputCls} />
                </Field>
                <Field label="Estoque mínimo">
                  <input {...productForm.register('minStock')} type="number" step="0.001" placeholder="0" className={inputCls} />
                </Field>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowProductModal(false)} className="px-4 py-2 text-sm text-brand-text-secondary hover:text-brand-text-primary transition-colors">Cancelar</button>
                <button type="submit" disabled={createProduct.isPending} className="px-5 py-2 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors">
                  {createProduct.isPending ? 'Salvando...' : 'Criar Produto'}
                </button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      {/* Movement Modal */}
      <AnimatePresence>
        {showMovModal && (
          <Modal title="Nova Movimentação" onClose={() => setShowMovModal(false)}>
            <form onSubmit={movForm.handleSubmit(d => createMovement.mutate(d))} className="space-y-4">
              <Field label="Produto" error={movForm.formState.errors.productId?.message}>
                <select {...movForm.register('productId')} className={inputCls}>
                  <option value="">— Selecione —</option>
                  {products.filter(p => p.type !== 'SERVICE').map(p => <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>)}
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Tipo de movimentação">
                  <select {...movForm.register('type')} className={inputCls}>
                    <option value="ENTRY">Entrada</option>
                    <option value="EXIT">Saída</option>
                    <option value="ADJUSTMENT">Ajuste</option>
                    <option value="LOSS">Perda</option>
                  </select>
                </Field>
                <Field label="Quantidade" error={movForm.formState.errors.quantity?.message}>
                  <input {...movForm.register('quantity')} type="number" step="0.001" placeholder="0" className={inputCls} />
                </Field>
                <Field label="Custo unitário (R$)">
                  <input {...movForm.register('unitCost')} type="number" step="0.01" placeholder="0,00" className={inputCls} />
                </Field>
                <Field label="Motivo">
                  <input {...movForm.register('reason')} placeholder="Ex: Compra fornecedor" className={inputCls} />
                </Field>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowMovModal(false)} className="px-4 py-2 text-sm text-brand-text-secondary">Cancelar</button>
                <button type="submit" disabled={createMovement.isPending} className="px-5 py-2 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-xl">
                  {createMovement.isPending ? 'Registrando...' : 'Registrar'}
                </button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      {/* Production Order Modal */}
      <AnimatePresence>
        {showProdModal && (
          <Modal title="Nova Ordem de Produção" onClose={() => setShowProdModal(false)}>
            <form onSubmit={prodForm.handleSubmit(d => createProdOrder.mutate(d))} className="space-y-4">
              <Field label="Produto a produzir" error={prodForm.formState.errors.productId?.message}>
                <select {...prodForm.register('productId')} className={inputCls}>
                  <option value="">— Selecione —</option>
                  {products.filter(p => p.bom).map(p => <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>)}
                </select>
              </Field>
              <Field label="Quantidade" error={prodForm.formState.errors.quantity?.message}>
                <input {...prodForm.register('quantity')} type="number" step="0.001" placeholder="0" className={inputCls} />
              </Field>
              <Field label="Observações">
                <textarea {...prodForm.register('notes')} rows={2} className={inputCls + ' resize-none'} />
              </Field>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowProdModal(false)} className="px-4 py-2 text-sm text-brand-text-secondary">Cancelar</button>
                <button type="submit" disabled={createProdOrder.isPending} className="px-5 py-2 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-xl">
                  {createProdOrder.isPending ? 'Criando...' : 'Criar Ordem'}
                </button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      {/* Sale Order Modal */}
      <AnimatePresence>
        {showSaleModal && (
          <Modal title="Novo Pedido de Venda" onClose={() => setShowSaleModal(false)}>
            <form onSubmit={saleForm.handleSubmit(d => createSale.mutate({ ...d, items: saleItems }))} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Nome do cliente" error={saleForm.formState.errors.clientName?.message}>
                  <input {...saleForm.register('clientName')} placeholder="Nome ou razão social" className={inputCls} />
                </Field>
                <Field label="CPF/CNPJ">
                  <input {...saleForm.register('clientDoc')} placeholder="Opcional" className={inputCls} />
                </Field>
                <Field label="E-mail">
                  <input {...saleForm.register('clientEmail')} type="email" placeholder="Opcional" className={inputCls} />
                </Field>
                <Field label="Telefone">
                  <input {...saleForm.register('clientPhone')} placeholder="Opcional" className={inputCls} />
                </Field>
              </div>

              <div>
                <p className="text-xs text-brand-text-secondary mb-2 font-medium uppercase tracking-wide">Itens do pedido</p>
                {saleItems.map((item, idx) => {
                  const p = products.find(x => x.id === item.productId);
                  return (
                    <div key={idx} className="flex items-center gap-2 mb-2 text-sm">
                      <span className="flex-1 text-brand-text-primary">{p?.name ?? item.productId}</span>
                      <span className="text-brand-text-secondary">{item.quantity} × {item.unitPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                      <button type="button" onClick={() => setSaleItems(s => s.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-700"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  );
                })}
                <button type="button"
                  onClick={() => {
                    const p = products[0];
                    if (p) setSaleItems(s => [...s, { productId: p.id, quantity: 1, unitPrice: Number(p.salePrice) }]);
                  }}
                  className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1 mt-1">
                  <Plus className="w-3.5 h-3.5" /> Adicionar item
                </button>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => { setShowSaleModal(false); setSaleItems([]); }} className="px-4 py-2 text-sm text-brand-text-secondary">Cancelar</button>
                <button type="submit" disabled={createSale.isPending || saleItems.length === 0} className="px-5 py-2 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-xl disabled:opacity-50">
                  {createSale.isPending ? 'Criando...' : 'Criar Pedido'}
                </button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────────────────────
const inputCls = 'w-full bg-slate-50 border border-brand-border rounded-xl px-3.5 py-2.5 text-sm text-brand-text-primary placeholder:text-brand-text-secondary focus:outline-none focus:border-primary-500';

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <div>
      <label className="block text-xs text-brand-text-secondary mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-xl bg-white border border-brand-border rounded-2xl shadow-modal overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
          <h2 className="font-semibold text-sm text-brand-text-primary">{title}</h2>
          <button onClick={onClose} className="text-brand-text-secondary hover:text-brand-text-primary transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5">{children}</div>
      </motion.div>
    </motion.div>
  );
}
