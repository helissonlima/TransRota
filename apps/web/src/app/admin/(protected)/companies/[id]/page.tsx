'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowLeft, Building2, Users, UserPlus, X, Circle,
  Shield, Clock, Trash2, Eye, EyeOff,
} from 'lucide-react';
import adminApi from '@/lib/admin-api';
import { cn } from '@/lib/cn';

interface Company {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  phone: string | null;
  isActive: boolean;
  schemaName: string;
  trialEndsAt: string | null;
  createdAt: string;
  plan: { name: string; type: string; maxUsers: number; maxVehicles: number; maxDrivers: number };
}

interface TenantUser {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLoginAt: string | null;
  createdAt: string;
}

const userSchema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  role: z.enum(['ADMIN', 'MANAGER', 'OPERATOR', 'VIEWER', 'DRIVER']),
});

type UserForm = z.infer<typeof userSchema>;

const roleLabel: Record<string, string> = {
  ADMIN: 'Administrador',
  MANAGER: 'Gerente',
  OPERATOR: 'Operador',
  DRIVER: 'Motorista',
  VIEWER: 'Visualizador',
};

const roleColor: Record<string, string> = {
  ADMIN: 'text-red-400 bg-red-500/10',
  MANAGER: 'text-purple-400 bg-purple-500/10',
  OPERATOR: 'text-blue-400 bg-blue-500/10',
  DRIVER: 'text-amber-400 bg-amber-500/10',
  VIEWER: 'text-gray-400 bg-gray-500/10',
};

export default function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const { data: company, isLoading: loadingCompany } = useQuery<Company>({
    queryKey: ['admin', 'companies', id],
    queryFn: async () => {
      const { data } = await adminApi.get(`/admin/companies/${id}`);
      return data;
    },
  });

  const { data: users = [], isLoading: loadingUsers } = useQuery<TenantUser[]>({
    queryKey: ['admin', 'companies', id, 'users'],
    queryFn: async () => {
      const { data } = await adminApi.get(`/admin/companies/${id}/users`);
      return data;
    },
  });

  const createUser = useMutation({
    mutationFn: (dto: UserForm) => adminApi.post(`/admin/companies/${id}/users`, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'companies', id, 'users'] });
      setShowModal(false);
      reset();
      setServerError('');
    },
    onError: (err: any) => {
      setServerError(err?.response?.data?.message ?? 'Erro ao criar usuário');
    },
  });

  const deactivateUser = useMutation({
    mutationFn: (userId: string) => adminApi.delete(`/admin/companies/${id}/users/${userId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'companies', id, 'users'] }),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<UserForm>({
    resolver: zodResolver(userSchema),
    defaultValues: { role: 'OPERATOR' },
  });

  const fmt = (iso: string | null) =>
    iso ? new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : '—';

  const planColor: Record<string, string> = {
    STARTER: 'text-blue-400',
    PROFESSIONAL: 'text-purple-400',
    ENTERPRISE: 'text-amber-400',
  };

  if (loadingCompany) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="p-6 text-center text-[#64748b]">
        <Building2 className="w-10 h-10 mx-auto mb-2 opacity-30" />
        <p>Empresa não encontrada</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/admin/companies')}
          className="w-9 h-9 rounded-lg border border-[#1e2d4a] flex items-center justify-center text-[#64748b] hover:text-white hover:border-[#2e3d5a] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-white text-2xl font-bold">{company.name}</h1>
          <p className="text-[#64748b] text-sm">{company.cnpj}</p>
        </div>
        <span className={cn('ml-auto flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border',
          company.isActive
            ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5'
            : 'text-red-400 border-red-500/30 bg-red-500/5')}>
          <Circle className="w-1.5 h-1.5 fill-current" />
          {company.isActive ? 'Ativa' : 'Inativa'}
        </span>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'ID (UUID)', value: company.id, mono: true },
          { label: 'E-mail', value: company.email },
          { label: 'Plano', value: company.plan.name, className: planColor[company.plan.type] },
          { label: 'Schema DB', value: company.schemaName, mono: true },
          { label: 'Criado em', value: fmt(company.createdAt) },
        ].map(({ label, value, className, mono }) => (
          <div key={label} className="bg-[#0b1120] border border-[#1e2d4a] rounded-xl px-4 py-3">
            <p className="text-[#64748b] text-xs mb-0.5">{label}</p>
            <p className={cn('text-sm font-medium truncate', mono ? 'font-mono text-xs text-[#94a3b8]' : 'text-white', className)}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Users section */}
      <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1e2d4a] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#64748b]" />
            <h2 className="text-white font-semibold text-sm">Usuários</h2>
            <span className="text-[#64748b] text-xs">({users.length}/{company.plan.maxUsers})</span>
          </div>
          <button
            onClick={() => { setShowModal(true); setServerError(''); reset(); }}
            className="flex items-center gap-2 text-xs bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Novo usuário
          </button>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1e2d4a]">
              <th className="text-left text-[#64748b] font-medium px-5 py-3">Usuário</th>
              <th className="text-left text-[#64748b] font-medium px-5 py-3">Função</th>
              <th className="text-left text-[#64748b] font-medium px-5 py-3">Último acesso</th>
              <th className="text-left text-[#64748b] font-medium px-5 py-3">Criado em</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {loadingUsers ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center">
                  <div className="flex justify-center">
                    <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-[#64748b]">
                  <Users className="w-7 h-7 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Nenhum usuário cadastrado</p>
                  <p className="text-xs mt-0.5">Clique em "Novo usuário" para adicionar</p>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-b border-[#0f1929] hover:bg-[#0f1929] transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-white font-medium">{user.name}</p>
                    <p className="text-[#64748b] text-xs">{user.email}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', roleColor[user.role] ?? 'text-gray-400 bg-gray-500/10')}>
                      {roleLabel[user.role] ?? user.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-1.5 text-xs text-[#64748b]">
                      <Clock className="w-3 h-3" />
                      {fmt(user.lastLoginAt)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[#64748b] text-xs">{fmt(user.createdAt)}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => {
                        if (confirm(`Desativar "${user.name}"?`)) deactivateUser.mutate(user.id);
                      }}
                      className="text-[#475569] hover:text-red-400 transition-colors"
                      title="Desativar usuário"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-white font-semibold">Novo Usuário</h3>
                <p className="text-[#64748b] text-xs mt-0.5">{company.name}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-[#64748b] hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit((data) => createUser.mutate(data))} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs text-[#94a3b8] mb-1.5">Nome completo</label>
                <input
                  {...register('name')}
                  placeholder="João da Silva"
                  className={cn(
                    'w-full bg-[#0f1a2e] border rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-[#334155] outline-none transition-colors',
                    errors.name ? 'border-red-500' : 'border-[#1e2d4a] focus:border-primary-500',
                  )}
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs text-[#94a3b8] mb-1.5">E-mail</label>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="joao@empresa.com"
                  className={cn(
                    'w-full bg-[#0f1a2e] border rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-[#334155] outline-none transition-colors',
                    errors.email ? 'border-red-500' : 'border-[#1e2d4a] focus:border-primary-500',
                  )}
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs text-[#94a3b8] mb-1.5">Senha inicial</label>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mínimo 8 caracteres"
                    className={cn(
                      'w-full bg-[#0f1a2e] border rounded-lg px-3.5 py-2.5 pr-10 text-sm text-white placeholder-[#334155] outline-none transition-colors',
                      errors.password ? 'border-red-500' : 'border-[#1e2d4a] focus:border-primary-500',
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#94a3b8]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs text-[#94a3b8] mb-1.5">Função</label>
                <select
                  {...register('role')}
                  className="w-full bg-[#0f1a2e] border border-[#1e2d4a] focus:border-primary-500 rounded-lg px-3.5 py-2.5 text-sm text-white outline-none transition-colors"
                >
                  <option value="ADMIN">Administrador</option>
                  <option value="MANAGER">Gerente</option>
                  <option value="OPERATOR">Operador</option>
                  <option value="DRIVER">Motorista</option>
                  <option value="VIEWER">Visualizador</option>
                </select>
              </div>

              {serverError && (
                <p className="text-red-400 text-sm bg-red-900/20 border border-red-900/30 rounded-lg px-3 py-2">
                  {serverError}
                </p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-[#1e2d4a] text-[#94a3b8] hover:text-white text-sm transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createUser.isPending}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {createUser.isPending ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      Criar usuário
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
