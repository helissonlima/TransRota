'use client';

import { useQuery } from '@tanstack/react-query';
import { Users, Shield, Clock } from 'lucide-react';
import adminApi from '@/lib/admin-api';
import { cn } from '@/lib/cn';

interface Admin {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

export default function AdminUsersPage() {
  const { data: admins = [], isLoading } = useQuery<Admin[]>({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const { data } = await adminApi.get('/admin/users');
      return data;
    },
  });

  const fmt = (iso: string | null) =>
    iso ? new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : '—';

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-white text-2xl font-bold">Usuários Admin</h1>
        <p className="text-[#64748b] text-sm mt-0.5">Super Admins com acesso ao painel</p>
      </div>

      <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1e2d4a]">
              <th className="text-left text-[#64748b] font-medium px-5 py-3">Usuário</th>
              <th className="text-left text-[#64748b] font-medium px-5 py-3">Função</th>
              <th className="text-left text-[#64748b] font-medium px-5 py-3">Último acesso</th>
              <th className="text-left text-[#64748b] font-medium px-5 py-3">Criado em</th>
              <th className="text-left text-[#64748b] font-medium px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-5 py-16 text-center">
                  <div className="flex justify-center">
                    <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                </td>
              </tr>
            ) : admins.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-[#64748b]">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p>Nenhum admin encontrado</p>
                </td>
              </tr>
            ) : (
              admins.map((admin) => (
                <tr key={admin.id} className="border-b border-[#0f1929] hover:bg-[#0f1929] transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-white font-medium">{admin.name}</p>
                    <p className="text-[#64748b] text-xs">{admin.email}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-1.5 text-xs text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full w-fit">
                      <Shield className="w-3 h-3" />
                      Super Admin
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-1.5 text-xs text-[#64748b]">
                      <Clock className="w-3 h-3" />
                      {fmt(admin.lastLoginAt)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[#64748b] text-xs">{fmt(admin.createdAt)}</td>
                  <td className="px-5 py-3.5">
                    <span className={cn('text-xs font-medium', admin.isActive ? 'text-emerald-400' : 'text-red-400')}>
                      {admin.isActive ? 'Ativo' : 'Inativo'}
                    </span>
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
