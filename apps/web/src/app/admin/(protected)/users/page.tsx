'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, Shield, Clock, Plus, X, Eye, EyeOff } from 'lucide-react';
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
  const qc = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [formError, setFormError] = useState('');

  const { data: admins = [], isLoading } = useQuery<Admin[]>({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const { data } = await adminApi.get('/admin/users');
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: () => adminApi.post('/admin/users', form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
      setModalOpen(false);
      setForm({ name: '', email: '', password: '' });
      setFormError('');
    },
    onError: (e: any) => {
      setFormError(e?.response?.data?.message ?? 'Erro ao criar usuário');
    },
  });

  const fmt = (iso: string | null) =>
    iso ? new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : '—';

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Usuários Admin</h1>
          <p className="text-[#64748b] text-sm mt-0.5">Super Admins com acesso ao painel</p>
        </div>
        <button
          onClick={() => { setModalOpen(true); setFormError(''); }}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Admin
        </button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0d1b36] border border-[#1e2d4a] rounded-2xl w-full max-w-md mx-4 shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e2d4a]">
              <h2 className="text-white font-bold text-lg">Novo Super Admin</h2>
              <button onClick={() => setModalOpen(false)} className="text-[#64748b] hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {formError && (
                <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
                  {formError}
                </div>
              )}
              <div>
                <label className="block text-[#94a3b8] text-xs font-semibold mb-1.5">Nome</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Nome completo"
                  className="w-full bg-[#0b1120] border border-[#1e2d4a] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#475569] outline-none focus:border-primary-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[#94a3b8] text-xs font-semibold mb-1.5">E-mail</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="admin@transrota.com"
                  className="w-full bg-[#0b1120] border border-[#1e2d4a] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#475569] outline-none focus:border-primary-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[#94a3b8] text-xs font-semibold mb-1.5">Senha</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    placeholder="Mínimo 8 caracteres"
                    className="w-full bg-[#0b1120] border border-[#1e2d4a] rounded-lg px-3 py-2.5 pr-10 text-sm text-white placeholder-[#475569] outline-none focus:border-primary-500 transition-colors"
                  />
                  <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#475569] hover:text-white transition-colors">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#1e2d4a]">
              <button onClick={() => setModalOpen(false)} className="text-[#94a3b8] hover:text-white text-sm px-4 py-2 rounded-lg transition-colors">
                Cancelar
              </button>
              <button
                onClick={() => createMutation.mutate()}
                disabled={createMutation.isPending || !form.name || !form.email || form.password.length < 8}
                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                {createMutation.isPending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                Criar Admin
              </button>
            </div>
          </div>
        </div>
      )}


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
