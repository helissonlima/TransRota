'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Settings, CreditCard, Check, List, Hash, Save } from 'lucide-react';
import adminApi from '@/lib/admin-api';
import { cn } from '@/lib/cn';

export const LOGIN_DISPLAY_KEY = 'tr_admin_login_display'; // 'list' | 'uuid'

interface Plan {
  id: string;
  name: string;
  type: string;
  maxVehicles: number;
  maxDrivers: number;
  maxUsers: number;
  maxBranches: number;
  storageGb: number;
  priceMonthly: number;
  isActive: boolean;
}

export default function AdminSettingsPage() {
  const [loginDisplay, setLoginDisplay] = useState<'list' | 'uuid'>('list');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(LOGIN_DISPLAY_KEY);
    if (stored === 'uuid' || stored === 'list') setLoginDisplay(stored);
  }, []);

  const saveLoginDisplay = (value: 'list' | 'uuid') => {
    setLoginDisplay(value);
    localStorage.setItem(LOGIN_DISPLAY_KEY, value);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  const { data: plans = [], isLoading } = useQuery<Plan[]>({
    queryKey: ['admin', 'plans'],
    queryFn: async () => {
      const { data } = await adminApi.get('/admin/plans');
      return data;
    },
  });

  const planColor: Record<string, string> = {
    STARTER: 'border-blue-500/30 bg-blue-500/5',
    PROFESSIONAL: 'border-purple-500/30 bg-purple-500/5',
    ENTERPRISE: 'border-amber-500/30 bg-amber-500/5',
  };
  const planBadge: Record<string, string> = {
    STARTER: 'text-blue-400',
    PROFESSIONAL: 'text-purple-400',
    ENTERPRISE: 'text-amber-400',
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#0b1120] border border-[#1e2d4a] flex items-center justify-center">
          <Settings className="w-5 h-5 text-[#64748b]" />
        </div>
        <div>
          <h1 className="text-white text-2xl font-bold">Configurações</h1>
          <p className="text-[#64748b] text-sm mt-0.5">Planos e configurações globais do SaaS</p>
        </div>
      </div>

      {/* Login display config */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-4 h-4 text-[#64748b]" />
          <h2 className="text-white font-semibold">Tela de Login</h2>
        </div>
        <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-xl p-5 space-y-4">
          <p className="text-[#94a3b8] text-sm">Como a empresa deve ser identificada na tela de login:</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => saveLoginDisplay('list')}
              className={cn(
                'flex items-center gap-3 p-4 rounded-xl border text-left transition-all',
                loginDisplay === 'list'
                  ? 'border-primary-500 bg-primary-500/10 text-white'
                  : 'border-[#1e2d4a] text-[#64748b] hover:border-[#2e3d5a] hover:text-white',
              )}
            >
              <List className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm">Lista de empresas</p>
                <p className="text-xs mt-0.5 opacity-70">Exibe dropdown com nomes para seleção</p>
              </div>
              {loginDisplay === 'list' && <Check className="w-4 h-4 text-primary-400 ml-auto flex-shrink-0" />}
            </button>

            <button
              onClick={() => saveLoginDisplay('uuid')}
              className={cn(
                'flex items-center gap-3 p-4 rounded-xl border text-left transition-all',
                loginDisplay === 'uuid'
                  ? 'border-primary-500 bg-primary-500/10 text-white'
                  : 'border-[#1e2d4a] text-[#64748b] hover:border-[#2e3d5a] hover:text-white',
              )}
            >
              <Hash className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm">Digitar UUID</p>
                <p className="text-xs mt-0.5 opacity-70">Usuário informa o ID da empresa manualmente</p>
              </div>
              {loginDisplay === 'uuid' && <Check className="w-4 h-4 text-primary-400 ml-auto flex-shrink-0" />}
            </button>
          </div>
          {saved && (
            <p className="text-emerald-400 text-xs flex items-center gap-1.5">
              <Save className="w-3.5 h-3.5" /> Configuração salva
            </p>
          )}
        </div>
      </div>

      {/* Plans section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-4 h-4 text-[#64748b]" />
          <h2 className="text-white font-semibold">Planos Disponíveis</h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  'border rounded-xl p-5 space-y-4',
                  planColor[plan.type] ?? 'border-[#1e2d4a] bg-[#0b1120]',
                )}
              >
                <div className="flex items-center justify-between">
                  <span className={cn('text-sm font-bold', planBadge[plan.type] ?? 'text-white')}>
                    {plan.name}
                  </span>
                  <span className={cn('text-xs px-2 py-0.5 rounded-full border', plan.isActive ? 'text-emerald-400 border-emerald-500/30' : 'text-[#64748b] border-[#1e2d4a]')}>
                    {plan.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </div>

                <div>
                  <span className="text-white text-2xl font-bold">
                    R$ {Number(plan.priceMonthly).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[#64748b] text-xs ml-1">/mês</span>
                </div>

                <ul className="space-y-1.5 text-[#94a3b8] text-sm">
                  {[
                    `${plan.maxVehicles} veículos`,
                    `${plan.maxDrivers} motoristas`,
                    `${plan.maxUsers} usuários`,
                    `${plan.maxBranches} filiais`,
                    `${plan.storageGb} GB armazenamento`,
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info box */}
      <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-xl p-5 text-sm text-[#64748b]">
        <p className="text-white font-medium mb-1">Configurações avançadas</p>
        <p>SMTP, integrações e parâmetros globais serão disponibilizados em breve.</p>
      </div>
    </div>
  );
}
