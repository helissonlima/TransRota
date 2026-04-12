'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreditCard, Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import adminApi from '@/lib/admin-api';
import { cn } from '@/lib/cn';

interface Plan {
  id: string;
  name: string;
  type: string;
  maxVehicles: number;
  maxDrivers: number;
  maxUsers: number;
  maxBranches: number;
  storageGb: number;
  priceMonthly: string;
  isActive: boolean;
  createdAt: string;
}

const emptyForm = {
  name: '',
  type: 'STARTER',
  maxVehicles: 10,
  maxDrivers: 10,
  maxUsers: 5,
  maxBranches: 1,
  storageGb: 5,
  priceMonthly: 0,
};

const planTypeLabels: Record<string, { label: string; color: string }> = {
  STARTER: { label: 'Starter', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  PROFESSIONAL: { label: 'Professional', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  ENTERPRISE: { label: 'Enterprise', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
};

export default function AdminPlansPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [form, setForm] = useState({ ...emptyForm });

  const { data: plans = [], isLoading } = useQuery<Plan[]>({
    queryKey: ['admin', 'plans'],
    queryFn: async () => {
      const { data } = await adminApi.get('/admin/plans');
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof emptyForm) => adminApi.post('/admin/plans', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'plans'] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<typeof emptyForm> }) =>
      adminApi.patch(`/admin/plans/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'plans'] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.delete(`/admin/plans/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'plans'] }),
  });

  function openCreate() {
    setEditingPlan(null);
    setForm({ ...emptyForm });
    setModalOpen(true);
  }

  function openEdit(plan: Plan) {
    setEditingPlan(plan);
    setForm({
      name: plan.name,
      type: plan.type,
      maxVehicles: plan.maxVehicles,
      maxDrivers: plan.maxDrivers,
      maxUsers: plan.maxUsers,
      maxBranches: plan.maxBranches,
      storageGb: plan.storageGb,
      priceMonthly: Number(plan.priceMonthly),
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingPlan(null);
    setForm({ ...emptyForm });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingPlan) {
      updateMutation.mutate({ id: editingPlan.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  }

  const inputClass =
    'w-full bg-[#0f1a2e] border border-[#1e2d4a] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary-500 transition-colors';

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Planos</h1>
          <p className="text-[#64748b] text-sm mt-0.5">Gerencie os planos de assinatura</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Plano
        </button>
      </div>

      {/* Plans grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-[#64748b]">
          <CreditCard className="w-8 h-8 mb-2 opacity-40" />
          <p className="text-sm">Nenhum plano cadastrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {plans.map((plan) => {
            const pt = planTypeLabels[plan.type] ?? {
              label: plan.type,
              color: 'text-gray-400 bg-gray-500/10 border-gray-500/20',
            };
            return (
              <div
                key={plan.id}
                className={cn(
                  'bg-[#0b1120] border rounded-xl p-6 relative',
                  plan.isActive ? 'border-[#1e2d4a]' : 'border-red-900/30 opacity-60',
                )}
              >
                {!plan.isActive && (
                  <span className="absolute top-3 right-3 text-[10px] text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                    Inativo
                  </span>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', pt.color.split(' ')[1])}>
                    <CreditCard className={cn('w-5 h-5', pt.color.split(' ')[0])} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{plan.name}</h3>
                    <span className={cn('text-xs px-2 py-0.5 rounded-full border', pt.color)}>
                      {pt.label}
                    </span>
                  </div>
                </div>

                <p className="text-3xl font-bold text-white mb-4">
                  R$ {Number(plan.priceMonthly).toFixed(2)}
                  <span className="text-sm text-[#64748b] font-normal">/mês</span>
                </p>

                <ul className="space-y-2 text-sm text-[#94a3b8] mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Até {plan.maxVehicles} veículos
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Até {plan.maxDrivers} motoristas
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Até {plan.maxUsers} usuários
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    {plan.maxBranches} {plan.maxBranches === 1 ? 'filial' : 'filiais'}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    {plan.storageGb} GB armazenamento
                  </li>
                </ul>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(plan)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm text-[#94a3b8] hover:bg-[#1a2744] hover:text-white transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Tem certeza que deseja excluir este plano?')) {
                        deleteMutation.mutate(plan.id);
                      }
                    }}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm text-[#94a3b8] hover:bg-red-900/30 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <form
            onSubmit={handleSubmit}
            className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-6 w-full max-w-lg space-y-4 mx-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-white font-semibold text-lg">
                {editingPlan ? 'Editar Plano' : 'Novo Plano'}
              </h2>
              <button type="button" onClick={closeModal} className="text-[#64748b] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-[#94a3b8] text-xs mb-1 block">Nome do Plano</label>
                <input
                  className={inputClass}
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="text-[#94a3b8] text-xs mb-1 block">Tipo</label>
                <select
                  className={inputClass}
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                >
                  <option value="STARTER">Starter</option>
                  <option value="PROFESSIONAL">Professional</option>
                  <option value="ENTERPRISE">Enterprise</option>
                </select>
              </div>
              <div>
                <label className="text-[#94a3b8] text-xs mb-1 block">Preço Mensal (R$)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className={inputClass}
                  value={form.priceMonthly}
                  onChange={(e) => setForm((f) => ({ ...f, priceMonthly: parseFloat(e.target.value) || 0 }))}
                  required
                />
              </div>
              <div>
                <label className="text-[#94a3b8] text-xs mb-1 block">Máx. Veículos</label>
                <input
                  type="number"
                  min="1"
                  className={inputClass}
                  value={form.maxVehicles}
                  onChange={(e) => setForm((f) => ({ ...f, maxVehicles: parseInt(e.target.value) || 1 }))}
                  required
                />
              </div>
              <div>
                <label className="text-[#94a3b8] text-xs mb-1 block">Máx. Motoristas</label>
                <input
                  type="number"
                  min="1"
                  className={inputClass}
                  value={form.maxDrivers}
                  onChange={(e) => setForm((f) => ({ ...f, maxDrivers: parseInt(e.target.value) || 1 }))}
                  required
                />
              </div>
              <div>
                <label className="text-[#94a3b8] text-xs mb-1 block">Máx. Usuários</label>
                <input
                  type="number"
                  min="1"
                  className={inputClass}
                  value={form.maxUsers}
                  onChange={(e) => setForm((f) => ({ ...f, maxUsers: parseInt(e.target.value) || 1 }))}
                  required
                />
              </div>
              <div>
                <label className="text-[#94a3b8] text-xs mb-1 block">Máx. Filiais</label>
                <input
                  type="number"
                  min="1"
                  className={inputClass}
                  value={form.maxBranches}
                  onChange={(e) => setForm((f) => ({ ...f, maxBranches: parseInt(e.target.value) || 1 }))}
                  required
                />
              </div>
              <div>
                <label className="text-[#94a3b8] text-xs mb-1 block">Armazenamento (GB)</label>
                <input
                  type="number"
                  min="1"
                  className={inputClass}
                  value={form.storageGb}
                  onChange={(e) => setForm((f) => ({ ...f, storageGb: parseInt(e.target.value) || 1 }))}
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm text-[#94a3b8] hover:bg-[#1a2744] transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white disabled:opacity-50 transition-colors"
              >
                {createMutation.isPending || updateMutation.isPending
                  ? 'Salvando...'
                  : editingPlan
                    ? 'Salvar'
                    : 'Criar Plano'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
