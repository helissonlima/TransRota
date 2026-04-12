'use client';

import { useEffect, useState, forwardRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Shield, Calendar, Key, Eye, EyeOff, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';
import { cn } from '@/lib/cn';

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Senha atual obrigatória'),
    newPassword: z.string().min(8, 'Mínimo 8 caracteres'),
    confirmPassword: z.string().min(1, 'Confirme a nova senha'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

type PasswordForm = z.infer<typeof passwordSchema>;

const profileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
});

type ProfileForm = z.infer<typeof profileSchema>;

const roleLabel: Record<string, string> = {
  ADMIN: 'Administrador',
  MANAGER: 'Gerente',
  OPERATOR: 'Operador',
  DRIVER: 'Motorista',
  VIEWER: 'Visualizador',
  SUPER_ADMIN: 'Super Admin',
};
const roleBadge: Record<string, 'default' | 'purple' | 'info' | 'orange' | 'gray'> = {
  ADMIN: 'default',
  MANAGER: 'purple',
  OPERATOR: 'info',
  DRIVER: 'orange',
  VIEWER: 'gray',
};

const AVATAR_COLORS = [
  'bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-orange-500',
  'bg-rose-500', 'bg-cyan-500', 'bg-amber-500', 'bg-indigo-500',
];
function getAvatarColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}
function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

const PasswordInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }>(
  function PasswordInput({ label, error, ...props }, ref) {
    const [show, setShow] = useState(false);
    return (
      <div>
        <label className="block text-sm font-medium text-brand-text-primary mb-1.5">{label}</label>
        <div className="relative">
          <input
            ref={ref}
            {...props}
            type={show ? 'text' : 'password'}
            className={cn('input-base pr-10', error && 'border-danger-400 focus:border-danger-500')}
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-secondary hover:text-brand-text-primary transition-colors"
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {error && <p className="text-danger-500 text-xs mt-1">{error}</p>}
      </div>
    );
  }
);

export default function ProfilePage() {
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [pwdSaved, setPwdSaved] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    reset: resetProfile,
    formState: { errors: profileErrors, isSubmitting: isSubmittingProfile, isDirty: profileDirty },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: '', email: '' },
  });

  useEffect(() => {
    const storedId = localStorage.getItem('userId') ?? '';
    const storedName = localStorage.getItem('userName') ?? '';
    const storedEmail = localStorage.getItem('userEmail') ?? '';
    const storedRole = localStorage.getItem('userRole') ?? '';
    const storedTenantId = localStorage.getItem('tenantId') ?? '';

    setUserId(storedId);
    setUserName(storedName);
    setUserEmail(storedEmail);
    setUserRole(storedRole);
    setTenantId(storedTenantId);
    resetProfile({ name: storedName, email: storedEmail });

    if (!storedId) return;

    setLoadingProfile(true);
    api
      .get(`/users/${storedId}`)
      .then((r) => {
        const data = r.data as { id: string; name: string; email: string; role: string };
        setUserName(data.name ?? storedName);
        setUserEmail(data.email ?? storedEmail);
        setUserRole(data.role ?? storedRole);
        resetProfile({
          name: data.name ?? storedName,
          email: data.email ?? storedEmail,
        });
        localStorage.setItem('userName', data.name ?? storedName);
        localStorage.setItem('userEmail', data.email ?? storedEmail);
        localStorage.setItem('userRole', data.role ?? storedRole);
      })
      .catch(() => {})
      .finally(() => setLoadingProfile(false));
  }, [resetProfile]);

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: isSubmittingPassword },
  } = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) });

  const onUpdateProfile = async (data: ProfileForm) => {
    if (!userId) {
      toast.error('Usuário não identificado. Faça login novamente.');
      return;
    }

    try {
      const resp = await api.patch(`/users/${userId}/profile`, data);
      const updated = resp.data as { name: string; email: string; role?: string };

      const nextName = updated.name ?? data.name;
      const nextEmail = updated.email ?? data.email;

      setUserName(nextName);
      setUserEmail(nextEmail);
      if (updated.role) setUserRole(updated.role);

      localStorage.setItem('userName', nextName);
      localStorage.setItem('userEmail', nextEmail);
      if (updated.role) localStorage.setItem('userRole', updated.role);

      resetProfile({ name: nextName, email: nextEmail });
      setProfileSaved(true);
      toast.success('Perfil atualizado com sucesso!');
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Erro ao atualizar perfil.');
    }
  };

  const onChangePassword = async (data: PasswordForm) => {
    try {
      await api.patch(`/users/${userId}/password`, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      resetPassword();
      setPwdSaved(true);
      toast.success('Senha alterada com sucesso!');
      setTimeout(() => setPwdSaved(false), 3000);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Senha atual incorreta');
    }
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Meu Perfil"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Meu Perfil' }]}
      />

      <div className="p-6 max-w-[700px] mx-auto space-y-6">

        {/* Avatar + Info */}
        <div className="card p-0 overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-brand-border">
            <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
              <User className="w-4 h-4 text-primary-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-brand-text-primary">Informações Pessoais</h2>
              <p className="text-xs text-brand-text-secondary">Detalhes da sua conta</p>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-5 mb-6">
              <div
                className={cn(
                  'w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0',
                  userName ? getAvatarColor(userName) : 'bg-slate-300',
                )}
              >
                {userName ? getInitials(userName) : '?'}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-brand-text-primary">{userName || '—'}</h3>
                <p className="text-sm text-brand-text-secondary mb-1.5">{userEmail || '—'}</p>
                <Badge variant={roleBadge[userRole] ?? 'gray'}>{roleLabel[userRole] ?? userRole ?? '—'}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-brand-border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Mail className="w-3.5 h-3.5 text-brand-text-secondary" />
                  <span className="text-xs text-brand-text-secondary font-medium">E-mail</span>
                </div>
                <p className="text-sm text-brand-text-primary truncate">{userEmail || '—'}</p>
              </div>

              <div className="bg-slate-50 border border-brand-border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-3.5 h-3.5 text-brand-text-secondary" />
                  <span className="text-xs text-brand-text-secondary font-medium">Função</span>
                </div>
                <p className="text-sm text-brand-text-primary">{roleLabel[userRole] ?? userRole ?? '—'}</p>
              </div>

              <div className="bg-slate-50 border border-brand-border rounded-lg p-3 sm:col-span-2">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-brand-text-secondary" />
                  <span className="text-xs text-brand-text-secondary font-medium">ID do Usuário</span>
                </div>
                <p className="text-xs text-brand-text-primary font-mono truncate select-all">{userId || '—'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Editar Perfil */}
        <div className="card p-0 overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-brand-border">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-brand-text-primary">Editar Perfil</h2>
              <p className="text-xs text-brand-text-secondary">Atualize seu nome e e-mail</p>
            </div>
          </div>

          <form onSubmit={handleSubmitProfile(onUpdateProfile)} className="p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-text-primary mb-1.5">Nome</label>
              <input
                {...registerProfile('name')}
                placeholder="Seu nome"
                className={cn('input-base', profileErrors.name && 'border-danger-400 focus:border-danger-500')}
              />
              {profileErrors.name && <p className="text-danger-500 text-xs mt-1">{profileErrors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-text-primary mb-1.5">E-mail</label>
              <input
                type="email"
                {...registerProfile('email')}
                placeholder="voce@empresa.com"
                className={cn('input-base', profileErrors.email && 'border-danger-400 focus:border-danger-500')}
              />
              {profileErrors.email && <p className="text-danger-500 text-xs mt-1">{profileErrors.email.message}</p>}
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="text-xs text-brand-text-secondary">
                {loadingProfile ? 'Carregando dados do perfil...' : `Tenant: ${tenantId || '—'}`}
              </span>
              <Button
                type="submit"
                variant={profileSaved ? 'success' : 'primary'}
                loading={isSubmittingProfile}
                disabled={!profileDirty && !profileSaved}
                leftIcon={profileSaved ? <Check className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
              >
                {profileSaved ? 'Perfil salvo!' : 'Salvar perfil'}
              </Button>
            </div>
          </form>
        </div>

        {/* Alterar Senha */}
        <div className="card p-0 overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-brand-border">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <Key className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-brand-text-primary">Alterar Senha</h2>
              <p className="text-xs text-brand-text-secondary">Redefina a senha da sua conta</p>
            </div>
          </div>

          <form onSubmit={handleSubmitPassword(onChangePassword)} className="p-5 space-y-4">
            <PasswordInput
              label="Senha atual"
              placeholder="••••••••"
              error={passwordErrors.currentPassword?.message}
              {...registerPassword('currentPassword')}
            />
            <PasswordInput
              label="Nova senha"
              placeholder="Mínimo 8 caracteres"
              error={passwordErrors.newPassword?.message}
              {...registerPassword('newPassword')}
            />
            <PasswordInput
              label="Confirmar nova senha"
              placeholder="Repita a nova senha"
              error={passwordErrors.confirmPassword?.message}
              {...registerPassword('confirmPassword')}
            />
            <div className="flex justify-end pt-1">
              <Button
                type="submit"
                variant={pwdSaved ? 'success' : 'primary'}
                loading={isSubmittingPassword}
                leftIcon={pwdSaved ? <Check className="w-4 h-4" /> : <Key className="w-4 h-4" />}
              >
                {pwdSaved ? 'Senha salva!' : 'Salvar nova senha'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
