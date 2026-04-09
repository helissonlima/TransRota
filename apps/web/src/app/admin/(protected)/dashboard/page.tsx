'use client';

import { useQuery } from '@tanstack/react-query';
import { Building2, Users, CreditCard, TrendingUp, Activity, Circle } from 'lucide-react';
import adminApi from '@/lib/admin-api';
import { cn } from '@/lib/cn';

interface Company {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  isActive: boolean;
  trialEndsAt: string | null;
  createdAt: string;
  plan: { name: string; type: string };
}

interface Stats {
  totalCompanies: number;
  activeCompanies: number;
  trialCompanies: number;
}

export default function AdminDashboardPage() {
  const { data: companies = [], isLoading } = useQuery<Company[]>({
    queryKey: ['admin', 'companies'],
    queryFn: async () => {
      const { data } = await adminApi.get('/admin/companies');
      return data;
    },
  });

  const stats: Stats = {
    totalCompanies: companies.length,
    activeCompanies: companies.filter((c) => c.isActive).length,
    trialCompanies: companies.filter(
      (c) => c.trialEndsAt && new Date(c.trialEndsAt) > new Date(),
    ).length,
  };

  const statCards = [
    { label: 'Total de Empresas', value: stats.totalCompanies, icon: Building2, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Empresas Ativas', value: stats.activeCompanies, icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Em Trial', value: stats.trialCompanies, icon: CreditCard, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Taxa de Ativação', value: stats.totalCompanies ? `${Math.round((stats.activeCompanies / stats.totalCompanies) * 100)}%` : '—', icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-white text-2xl font-bold">Dashboard</h1>
        <p className="text-[#64748b] text-sm mt-0.5">Visão geral do SaaS TransRota</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-[#0b1120] border border-[#1e2d4a] rounded-xl p-5">
            <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center mb-3', bg)}>
              <Icon className={cn('w-5 h-5', color)} />
            </div>
            <p className="text-[#64748b] text-xs mb-1">{label}</p>
            <p className="text-white text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      {/* Companies table */}
      <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1e2d4a] flex items-center justify-between">
          <h2 className="text-white font-semibold text-sm">Empresas Cadastradas</h2>
          <span className="text-[#64748b] text-xs">{companies.length} registros</span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : companies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-[#64748b]">
            <Building2 className="w-8 h-8 mb-2 opacity-40" />
            <p className="text-sm">Nenhuma empresa cadastrada</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1e2d4a]">
                  {['Empresa', 'CNPJ', 'Plano', 'Trial até', 'Status', 'Criado em'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs text-[#64748b] font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {companies.map((c) => (
                  <tr key={c.id} className="border-b border-[#1e2d4a]/50 hover:bg-[#0f1a2e]/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-white font-medium">{c.name}</p>
                      <p className="text-[#64748b] text-xs">{c.email}</p>
                    </td>
                    <td className="px-5 py-3.5 text-[#94a3b8] font-mono text-xs">{c.cnpj}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary-600/10 text-primary-400 text-xs border border-primary-600/20">
                        {c.plan?.name ?? c.plan?.type ?? '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[#94a3b8] text-xs">
                      {c.trialEndsAt
                        ? new Date(c.trialEndsAt).toLocaleDateString('pt-BR')
                        : '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium', c.isActive ? 'text-emerald-400' : 'text-red-400')}>
                        <Circle className="w-1.5 h-1.5 fill-current" />
                        {c.isActive ? 'Ativa' : 'Inativa'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[#64748b] text-xs">
                      {new Date(c.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
