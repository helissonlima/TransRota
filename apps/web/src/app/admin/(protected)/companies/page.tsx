'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Building2, Activity, Circle, Search, ToggleLeft, ToggleRight, ChevronRight } from 'lucide-react';
import adminApi from '@/lib/admin-api';
import { cn } from '@/lib/cn';

interface Company {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  phone: string | null;
  isActive: boolean;
  trialEndsAt: string | null;
  createdAt: string;
  plan: { name: string; type: string };
}

export default function AdminCompaniesPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [search, setSearch] = useState('');

  const { data: companies = [], isLoading } = useQuery<Company[]>({
    queryKey: ['admin', 'companies'],
    queryFn: async () => {
      const { data } = await adminApi.get('/admin/companies');
      return data;
    },
  });

  const toggle = useMutation({
    mutationFn: (id: string) => adminApi.patch(`/admin/companies/${id}/toggle`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'companies'] }),
  });

  const filtered = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.cnpj.includes(search) ||
      c.email.toLowerCase().includes(search.toLowerCase()),
  );

  const planColor: Record<string, string> = {
    STARTER: 'text-blue-400 bg-blue-500/10',
    PROFESSIONAL: 'text-purple-400 bg-purple-500/10',
    ENTERPRISE: 'text-amber-400 bg-amber-500/10',
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Empresas</h1>
          <p className="text-[#64748b] text-sm mt-0.5">{companies.length} empresa{companies.length !== 1 ? 's' : ''} cadastrada{companies.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome, CNPJ ou e-mail..."
          className="w-full bg-[#0b1120] border border-[#1e2d4a] rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-[#475569] outline-none focus:border-primary-500 transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1e2d4a]">
              <th className="text-left text-[#64748b] font-medium px-5 py-3">Empresa</th>
              <th className="text-left text-[#64748b] font-medium px-5 py-3">CNPJ</th>
              <th className="text-left text-[#64748b] font-medium px-5 py-3">Plano</th>
              <th className="text-left text-[#64748b] font-medium px-5 py-3">Trial</th>
              <th className="text-left text-[#64748b] font-medium px-5 py-3">Status</th>
              <th className="text-left text-[#64748b] font-medium px-5 py-3">Ações</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center">
                  <div className="flex justify-center">
                    <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-[#64748b]">
                  <Building2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p>Nenhuma empresa encontrada</p>
                </td>
              </tr>
            ) : (
              filtered.map((company) => (
                <tr key={company.id} className="border-b border-[#0f1929] hover:bg-[#0f1929] transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-white font-medium">{company.name}</p>
                    <p className="text-[#64748b] text-xs">{company.email}</p>
                    <p
                      className="text-[#475569] font-mono text-[10px] mt-0.5 cursor-pointer hover:text-[#94a3b8] transition-colors select-all"
                      title="Clique para selecionar"
                    >{company.id}</p>
                  </td>
                  <td className="px-5 py-3.5 text-[#94a3b8] font-mono text-xs">{company.cnpj}</td>
                  <td className="px-5 py-3.5">
                    <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', planColor[company.plan.type] ?? 'text-gray-400 bg-gray-500/10')}>
                      {company.plan.name}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[#64748b] text-xs">
                    {company.trialEndsAt
                      ? new Date(company.trialEndsAt) > new Date()
                        ? `${Math.ceil((new Date(company.trialEndsAt).getTime() - Date.now()) / 86400000)}d restantes`
                        : 'Expirado'
                      : '—'}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={cn('flex items-center gap-1.5 text-xs font-medium w-fit',
                      company.isActive ? 'text-emerald-400' : 'text-[#64748b]')}>
                      <Circle className="w-1.5 h-1.5 fill-current" />
                      {company.isActive ? 'Ativa' : 'Inativa'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => toggle.mutate(company.id)}
                      disabled={toggle.isPending}
                      className={cn(
                        'flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg transition-colors',
                        company.isActive
                          ? 'text-red-400 hover:bg-red-900/20'
                          : 'text-emerald-400 hover:bg-emerald-900/20',
                      )}
                    >
                      {company.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      {company.isActive ? 'Desativar' : 'Ativar'}
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => router.push(`/admin/companies/${company.id}`)}
                      className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 transition-colors"
                    >
                      Ver detalhes
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
