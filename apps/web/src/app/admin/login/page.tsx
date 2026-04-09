'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Shield, Eye, EyeOff, Loader2 } from 'lucide-react';
import { adminLogin } from '@/lib/admin-api';
import { cn } from '@/lib/cn';

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
});

type FormData = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError('');
    try {
      await adminLogin(data.email, data.password);
      router.push('/admin/dashboard');
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(msg ?? 'Credenciais inválidas. Verifique e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary-600/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Card */}
        <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-600/10 border border-primary-600/20 mb-4">
              <Shield className="w-7 h-7 text-primary-400" />
            </div>
            <h1 className="text-white text-2xl font-bold">Painel Administrativo</h1>
            <p className="text-[#64748b] text-sm mt-1">Acesso restrito — Super Admin</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm text-[#94a3b8] mb-1.5">E-mail</label>
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                placeholder="superadmin@transrota.com"
                className={cn(
                  'w-full bg-[#0f1a2e] border rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-[#334155] outline-none transition-colors',
                  errors.email
                    ? 'border-red-500 focus:border-red-400'
                    : 'border-[#1e2d4a] focus:border-primary-500',
                )}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-[#94a3b8] mb-1.5">Senha</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={cn(
                    'w-full bg-[#0f1a2e] border rounded-lg px-3.5 py-2.5 pr-10 text-sm text-white placeholder-[#334155] outline-none transition-colors',
                    errors.password
                      ? 'border-red-500 focus:border-red-400'
                      : 'border-[#1e2d4a] focus:border-primary-500',
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#94a3b8] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-900/20 border border-red-800/50 rounded-lg px-3.5 py-2.5">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium rounded-lg py-2.5 text-sm transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Entrando…
                </>
              ) : (
                'Entrar no Painel'
              )}
            </button>
          </form>

          {/* Back link */}
          <p className="text-center mt-6">
            <a href="/login" className="text-[#64748b] text-xs hover:text-[#94a3b8] transition-colors">
              ← Voltar para o login do tenant
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
