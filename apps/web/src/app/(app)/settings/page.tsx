"use client";

import { useEffect, useState, forwardRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  User,
  Building2,
  Shield,
  Key,
  Eye,
  EyeOff,
  UserPlus,
  Trash2,
  Clock,
  Copy,
  Check,
  Hash,
  Tractor,
  ImagePlus,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";
import { cn } from "@/lib/cn";
import { getBrandSettings, saveBrandSettings } from "@/lib/branding";

interface TenantUser {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLoginAt: string | null;
  createdAt: string;
}

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Senha atual obrigatória"),
    newPassword: z.string().min(8, "Mínimo 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirme a nova senha"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

const userSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  role: z.enum(["ADMIN", "MANAGER", "OPERATOR", "VIEWER", "DRIVER"]),
});

type PasswordForm = z.infer<typeof passwordSchema>;
type UserForm = z.infer<typeof userSchema>;

const roleLabel: Record<string, string> = {
  ADMIN: "Administrador",
  MANAGER: "Gerente",
  OPERATOR: "Operador",
  DRIVER: "Motorista",
  VIEWER: "Visualizador",
  SUPER_ADMIN: "Super Admin",
};
const roleBadge: Record<
  string,
  "default" | "purple" | "info" | "orange" | "gray"
> = {
  ADMIN: "default",
  MANAGER: "purple",
  OPERATOR: "info",
  DRIVER: "orange",
  VIEWER: "gray",
};
const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-orange-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-amber-500",
  "bg-indigo-500",
];
function getAvatarColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}
function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
function fmtDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function CopyField({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <div>
      <p className="text-xs text-brand-text-secondary mb-1">{label}</p>
      <div className="flex items-center gap-2 bg-slate-50 border border-brand-border rounded-lg px-3 py-2 group">
        <p
          className={cn(
            "flex-1 text-sm text-brand-text-primary truncate",
            mono && "font-mono text-xs",
          )}
        >
          {value || "—"}
        </p>
        <button
          onClick={() => {
            navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-brand-text-secondary hover:text-primary-600"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-success-600" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}

const PasswordInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    error?: string;
  }
>(function PasswordInput({ label, error, ...props }, ref) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-sm font-medium text-brand-text-primary mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          ref={ref}
          {...props}
          type={show ? "text" : "password"}
          className={cn(
            "input-base pr-10",
            error && "border-danger-400 focus:border-danger-500",
          )}
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
});

export default function SettingsPage() {
  const qc = useQueryClient();
  const [tenantId, setTenantId] = useState("");
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [headerSearch, setHeaderSearch] = useState("");
  const [userModal, setUserModal] = useState(false);
  const [pwdSaved, setPwdSaved] = useState(false);
  const [heavyMachinesEnabled, setHeavyMachinesEnabled] = useState(false);
  const [brandName, setBrandName] = useState("TransRota");
  const [brandLogoDataUrl, setBrandLogoDataUrl] = useState<string | null>(null);
  const heavyMachinesStorageKey = tenantId
    ? `feature:heavy-machines-enabled:${tenantId}`
    : "feature:heavy-machines-enabled";

  useEffect(() => {
    const tId = localStorage.getItem("tenantId") ?? "";
    setTenantId(tId);
    setUserId(localStorage.getItem("userId") ?? "");
    setUserName(localStorage.getItem("userName") ?? "");
    setUserRole(localStorage.getItem("userRole") ?? "");
    const key = tId
      ? `feature:heavy-machines-enabled:${tId}`
      : "feature:heavy-machines-enabled";
    setHeavyMachinesEnabled(localStorage.getItem(key) === "true");

    const branding = getBrandSettings(tId);
    setBrandName(branding.name);
    setBrandLogoDataUrl(branding.logoDataUrl);
  }, []);

  const toggleHeavyMachines = (enabled: boolean) => {
    setHeavyMachinesEnabled(enabled);
    localStorage.setItem(heavyMachinesStorageKey, String(enabled));
    toast.success(
      enabled
        ? "Máquinas pesadas habilitadas no cadastro da frota."
        : "Máquinas pesadas desabilitadas no cadastro da frota.",
    );
  };

  const saveBranding = () => {
    const normalizedName = brandName.trim();
    if (!normalizedName) {
      toast.error("Informe um nome para o sistema.");
      return;
    }

    saveBrandSettings(tenantId || null, {
      name: normalizedName,
      logoDataUrl: brandLogoDataUrl,
    });
    setBrandName(normalizedName);
    toast.success("Nome e logo atualizados com sucesso.");
  };

  const onBrandLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Selecione um arquivo de imagem válido.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setBrandLogoDataUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const { data: users = [], isLoading: loadingUsers } = useQuery<TenantUser[]>({
    queryKey: ["settings", "users"],
    queryFn: () => api.get("/users").then((r) => r.data),
  });

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(headerSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(headerSearch.toLowerCase()),
  );

  const createUserMutation = useMutation({
    mutationFn: (dto: UserForm) => api.post("/users", dto),
    onSuccess: () => {
      toast.success("Usuário criado com sucesso!");
      qc.invalidateQueries({ queryKey: ["settings", "users"] });
      setUserModal(false);
      resetUser();
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message ?? "Erro ao criar usuário"),
  });

  const deactivateMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/users/${id}`),
    onSuccess: () => {
      toast.success("Usuário desativado");
      qc.invalidateQueries({ queryKey: ["settings", "users"] });
    },
    onError: () => toast.error("Erro ao desativar usuário"),
  });

  const {
    register: regPwd,
    handleSubmit: submitPwd,
    reset: resetPwd,
    formState: { errors: pwdErrors, isSubmitting: pwdSubmitting },
  } = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) });

  const onChangePassword = async (data: PasswordForm) => {
    try {
      await api.patch(`/users/${userId}/password`, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      resetPwd();
      setPwdSaved(true);
      toast.success("Senha alterada com sucesso!");
      setTimeout(() => setPwdSaved(false), 3000);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Senha atual incorreta");
    }
  };

  const {
    register: regUser,
    handleSubmit: submitUser,
    reset: resetUser,
    formState: { errors: userErrors },
  } = useForm<UserForm>({
    resolver: zodResolver(userSchema),
    defaultValues: { role: "OPERATOR" },
  });

  return (
    <div className="min-h-screen">
      <Header
        title="Configurações"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Configurações" },
        ]}
        searchQuery={headerSearch}
        onSearchQueryChange={setHeaderSearch}
        searchPlaceholder="Buscar por nome ou e-mail..."
      />

      <div className="p-6 max-w-[1100px] mx-auto space-y-6">
        {/* Conta + Empresa */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-0 overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-brand-border">
              <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                <User className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-brand-text-primary">
                  Minha Conta
                </h2>
                <p className="text-xs text-brand-text-secondary">
                  Informações do seu perfil
                </p>
              </div>
            </div>
            <div className="p-5 space-y-3">
              <CopyField label="Nome / E-mail" value={userName} />
              <div>
                <p className="text-xs text-brand-text-secondary mb-1">Função</p>
                <Badge variant={roleBadge[userRole] ?? "gray"}>
                  {roleLabel[userRole] ?? userRole}
                </Badge>
              </div>
              <CopyField label="ID do Usuário" value={userId} mono />
            </div>
          </div>

          <div className="card p-0 overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-brand-border">
              <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-violet-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-brand-text-primary">
                  Empresa (Tenant)
                </h2>
                <p className="text-xs text-brand-text-secondary">
                  Use este ID para integrar com a API
                </p>
              </div>
            </div>
            <div className="p-5 space-y-3">
              <CopyField
                label="ID da Empresa (x-tenant-id)"
                value={tenantId}
                mono
              />
              <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2.5 flex items-start gap-2">
                <Hash className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-primary-700 leading-relaxed">
                  Envie este ID no header{" "}
                  <code className="font-mono bg-blue-100 px-1 rounded">
                    x-tenant-id
                  </code>{" "}
                  em todas as requisições à API.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-0 overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-brand-border">
            <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center">
              <ImagePlus className="w-4 h-4 text-sky-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-brand-text-primary">
                Identidade da Empresa
              </h2>
              <p className="text-xs text-brand-text-secondary">
                Defina o nome e o logo exibidos no sistema e na tela de login
              </p>
            </div>
          </div>

          <div className="p-5 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-5 items-start">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-text-primary mb-1.5">
                  Nome exibido no sistema
                </label>
                <input
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="input-base"
                  placeholder="Ex.: Efrat Agro Log"
                  maxLength={60}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-text-primary mb-1.5">
                  Logo da empresa
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-brand-border bg-white hover:bg-slate-50 text-sm cursor-pointer transition-colors">
                    <ImagePlus className="w-4 h-4 text-primary-600" />
                    Enviar imagem
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={onBrandLogoChange}
                    />
                  </label>

                  {brandLogoDataUrl && (
                    <button
                      type="button"
                      onClick={() => setBrandLogoDataUrl(null)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-danger-200 text-danger-600 hover:bg-danger-50 text-sm transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Remover logo
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-1">
                <Button size="sm" onClick={saveBranding}>
                  Salvar identidade visual
                </Button>
              </div>
            </div>

            <div className="w-full md:w-[220px] rounded-xl border border-brand-border bg-slate-50 p-4">
              <p className="text-xs font-semibold text-brand-text-secondary uppercase tracking-wide mb-3">
                Pré-visualização
              </p>
              <div className="flex items-center gap-3">
                {brandLogoDataUrl ? (
                  <img
                    src={brandLogoDataUrl}
                    alt="Logo da empresa"
                    className="w-11 h-11 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-xl bg-gradient-brand" />
                )}
                <div>
                  <p className="text-sm font-semibold text-brand-text-primary leading-tight">
                    {brandName.trim() || "TransRota"}
                  </p>
                  <p className="text-xs text-brand-text-secondary">
                    Gestão de Frota
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-0 overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-brand-border">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <Tractor className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-brand-text-primary">
                Operação de Máquinas Pesadas
              </h2>
              <p className="text-xs text-brand-text-secondary">
                Ative para cadastrar tratores, escavadeiras e máquinas sem placa
                na frota
              </p>
            </div>
          </div>

          <div className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-brand-text-primary">
                Exibir máquinas sem placa no cadastro de veículos
              </p>
              <p className="text-xs text-brand-text-secondary mt-1">
                Quando ativo, o sistema habilita modo sem placa e controle de
                manutenção por horas trabalhadas.
              </p>
            </div>

            <button
              type="button"
              onClick={() => toggleHeavyMachines(!heavyMachinesEnabled)}
              className={cn(
                "relative inline-flex h-7 w-12 items-center rounded-full transition-colors",
                heavyMachinesEnabled ? "bg-primary-600" : "bg-slate-300",
              )}
              aria-pressed={heavyMachinesEnabled}
            >
              <span
                className={cn(
                  "inline-block h-5 w-5 transform rounded-full bg-white transition-transform",
                  heavyMachinesEnabled ? "translate-x-6" : "translate-x-1",
                )}
              />
            </button>
          </div>
        </div>

        {/* Usuários */}
        <div className="card p-0 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Shield className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-brand-text-primary">
                  Usuários do Sistema
                </h2>
                <p className="text-xs text-brand-text-secondary">
                  {users.length} usuário{users.length !== 1 ? "s" : ""} ativo
                  {users.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              leftIcon={<UserPlus className="w-4 h-4" />}
              onClick={() => {
                setUserModal(true);
                resetUser();
              }}
            >
              Novo usuário
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50/80">
                  {["Usuário", "Função", "Último acesso", "Criado em", ""].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left text-xs font-semibold text-brand-text-secondary uppercase tracking-wide px-5 py-3"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {loadingUsers ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Skeleton className="w-8 h-8 rounded-full" />
                          <div className="space-y-1.5">
                            <Skeleton className="h-3.5 w-32" />
                            <Skeleton className="h-3 w-44" />
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <Skeleton className="h-5 w-20 rounded-full" />
                      </td>
                      <td className="px-5 py-3.5">
                        <Skeleton className="h-3.5 w-28" />
                      </td>
                      <td className="px-5 py-3.5">
                        <Skeleton className="h-3.5 w-24" />
                      </td>
                      <td className="px-5 py-3.5" />
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-12 text-center text-brand-text-secondary"
                    >
                      <Shield className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p className="text-sm font-medium">
                        Nenhum usuário encontrado
                      </p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((user) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={cn(
                        "hover:bg-slate-50/70 transition-colors",
                        user.id === userId && "bg-primary-50/40",
                      )}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0",
                              getAvatarColor(user.name),
                            )}
                          >
                            {getInitials(user.name)}
                          </div>
                          <div>
                            <p className="font-medium text-brand-text-primary text-sm leading-tight">
                              {user.name}
                              {user.id === userId && (
                                <span className="ml-1.5 text-[10px] text-primary-600 bg-primary-50 border border-primary-100 px-1.5 py-0.5 rounded-full align-middle">
                                  você
                                </span>
                              )}
                            </p>
                            <p className="text-brand-text-secondary text-xs">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant={roleBadge[user.role] ?? "gray"}>
                          {roleLabel[user.role] ?? user.role}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="flex items-center gap-1.5 text-xs text-brand-text-secondary">
                          <Clock className="w-3 h-3 flex-shrink-0" />
                          {fmtDate(user.lastLoginAt)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-brand-text-secondary">
                        {fmtDate(user.createdAt)}
                      </td>
                      <td className="px-5 py-3.5">
                        {user.id !== userId && (
                          <button
                            onClick={() => {
                              if (confirm(`Desativar "${user.name}"?`))
                                deactivateMutation.mutate(user.id);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-danger-500 hover:bg-danger-50 transition-colors"
                            title="Desativar usuário"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alterar senha */}
        <div className="card p-0 overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-brand-border">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <Key className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-brand-text-primary">
                Alterar Senha
              </h2>
              <p className="text-xs text-brand-text-secondary">
                Altere a senha da sua conta
              </p>
            </div>
          </div>
          <form
            onSubmit={submitPwd(onChangePassword)}
            className="p-5 space-y-4 max-w-md"
          >
            <PasswordInput
              label="Senha atual"
              placeholder="••••••••"
              error={pwdErrors.currentPassword?.message}
              {...regPwd("currentPassword")}
            />
            <PasswordInput
              label="Nova senha"
              placeholder="Mínimo 8 caracteres"
              error={pwdErrors.newPassword?.message}
              {...regPwd("newPassword")}
            />
            <PasswordInput
              label="Confirmar nova senha"
              placeholder="Repita a nova senha"
              error={pwdErrors.confirmPassword?.message}
              {...regPwd("confirmPassword")}
            />
            <div className="flex justify-end pt-1">
              <Button
                type="submit"
                variant={pwdSaved ? "success" : "primary"}
                loading={pwdSubmitting}
                leftIcon={
                  pwdSaved ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Key className="w-4 h-4" />
                  )
                }
              >
                {pwdSaved ? "Senha salva!" : "Salvar nova senha"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal novo usuário */}
      <Modal
        open={userModal}
        onClose={() => setUserModal(false)}
        title="Novo Usuário"
        description="Crie um acesso para um membro da equipe"
        size="md"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setUserModal(false)}>
              Cancelar
            </Button>
            <Button
              form="user-form"
              type="submit"
              loading={createUserMutation.isPending}
              leftIcon={<UserPlus className="w-4 h-4" />}
            >
              Criar usuário
            </Button>
          </div>
        }
      >
        <form
          id="user-form"
          onSubmit={submitUser((d) => createUserMutation.mutate(d))}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-brand-text-primary mb-1.5">
              Nome completo
            </label>
            <input
              {...regUser("name")}
              placeholder="João da Silva"
              className={cn(
                "input-base",
                userErrors.name && "border-danger-400",
              )}
            />
            {userErrors.name && (
              <p className="text-danger-500 text-xs mt-1">
                {userErrors.name.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text-primary mb-1.5">
              E-mail
            </label>
            <input
              {...regUser("email")}
              type="email"
              placeholder="joao@empresa.com"
              className={cn(
                "input-base",
                userErrors.email && "border-danger-400",
              )}
            />
            {userErrors.email && (
              <p className="text-danger-500 text-xs mt-1">
                {userErrors.email.message}
              </p>
            )}
          </div>
          <PasswordInput
            label="Senha inicial"
            placeholder="Mínimo 8 caracteres"
            error={userErrors.password?.message}
            {...regUser("password")}
          />
          <div>
            <label className="block text-sm font-medium text-brand-text-primary mb-1.5">
              Função
            </label>
            <select {...regUser("role")} className="input-base">
              <option value="ADMIN">Administrador — acesso total</option>
              <option value="MANAGER">Gerente — gerencia filial</option>
              <option value="OPERATOR">Operador — cria e gerencia rotas</option>
              <option value="DRIVER">Motorista — somente app</option>
              <option value="VIEWER">Visualizador — somente leitura</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
}
