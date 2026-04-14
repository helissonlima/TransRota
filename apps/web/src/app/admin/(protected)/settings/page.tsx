"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Settings,
  CreditCard,
  Check,
  List,
  Hash,
  Save,
  Database,
  Download,
  Upload,
  Loader2,
  Wallet,
  Building2,
} from "lucide-react";
import adminApi, {
  downloadFullBackup,
  uploadFullRestore,
} from "@/lib/admin-api";
import { cn } from "@/lib/cn";
import { toast } from "sonner";

const LOGIN_DISPLAY_KEY = "tr_admin_login_display"; // 'list' | 'uuid'

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

type PaymentProvider = "ASAAS" | "SICOOB" | "NONE";
type PaymentEnvironment = "SANDBOX" | "PRODUCTION";

interface PaymentSettings {
  provider: PaymentProvider;
  environment: PaymentEnvironment;
  asaasApiKey?: string | null;
  asaasWalletId?: string | null;
  asaasWebhookToken?: string | null;
  sicoobClientId?: string | null;
  sicoobClientSecret?: string | null;
  sicoobCertificateBase64?: string | null;
  sicoobPixKey?: string | null;
  isActive: boolean;
}

const EMPTY_PAYMENT_FORM: PaymentSettings = {
  provider: "ASAAS",
  environment: "SANDBOX",
  asaasApiKey: "",
  asaasWalletId: "",
  asaasWebhookToken: "",
  sicoobClientId: "",
  sicoobClientSecret: "",
  sicoobCertificateBase64: "",
  sicoobPixKey: "",
  isActive: true,
};

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const [loginDisplay, setLoginDisplay] = useState<"list" | "uuid">("list");
  const [saved, setSaved] = useState(false);
  const [paymentForm, setPaymentForm] =
    useState<PaymentSettings>(EMPTY_PAYMENT_FORM);
  const restoreInputRef = useRef<HTMLInputElement>(null);

  const backupMutation = useMutation({
    mutationFn: async () => downloadFullBackup(),
    onError: () =>
      toast.error("Não foi possível gerar o backup. Tente novamente."),
  });

  const restoreMutation = useMutation({
    mutationFn: (file: File) => uploadFullRestore(file),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "companies"] });
      await queryClient.refetchQueries({
        queryKey: ["admin", "companies"],
        type: "active",
      });

      const companies = data.companiesRestored ?? 0;
      if (companies === 0) {
        toast.warning(
          `${data.message}. Nenhuma empresa foi restaurada neste backup.`,
        );
        return;
      }
      toast.success(
        `${data.message} (${data.tenantsRestored} tenant(s), ${companies} empresa(s) restaurada(s))`,
      );
    },
    onError: (err: any) =>
      toast.error(
        err?.response?.data?.message ?? "Erro ao restaurar o backup.",
      ),
  });

  useEffect(() => {
    const stored = localStorage.getItem(LOGIN_DISPLAY_KEY);
    if (stored === "uuid" || stored === "list") setLoginDisplay(stored);
  }, []);

  const saveLoginDisplay = (value: "list" | "uuid") => {
    setLoginDisplay(value);
    localStorage.setItem(LOGIN_DISPLAY_KEY, value);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  const { data: plans = [], isLoading } = useQuery<Plan[]>({
    queryKey: ["admin", "plans"],
    queryFn: async () => {
      const { data } = await adminApi.get("/admin/plans");
      return data;
    },
  });

  const paymentSettingsQuery = useQuery<PaymentSettings>({
    queryKey: ["admin", "settings", "payment"],
    queryFn: async () => {
      const { data } = await adminApi.get("/admin/settings/payment");
      return data;
    },
  });

  useEffect(() => {
    if (!paymentSettingsQuery.data) return;
    setPaymentForm({
      provider: paymentSettingsQuery.data.provider,
      environment: paymentSettingsQuery.data.environment,
      asaasApiKey: paymentSettingsQuery.data.asaasApiKey ?? "",
      asaasWalletId: paymentSettingsQuery.data.asaasWalletId ?? "",
      asaasWebhookToken: paymentSettingsQuery.data.asaasWebhookToken ?? "",
      sicoobClientId: paymentSettingsQuery.data.sicoobClientId ?? "",
      sicoobClientSecret: paymentSettingsQuery.data.sicoobClientSecret ?? "",
      sicoobCertificateBase64:
        paymentSettingsQuery.data.sicoobCertificateBase64 ?? "",
      sicoobPixKey: paymentSettingsQuery.data.sicoobPixKey ?? "",
      isActive: paymentSettingsQuery.data.isActive,
    });
  }, [paymentSettingsQuery.data]);

  const updatePaymentSettings = useMutation({
    mutationFn: async () => {
      const { data } = await adminApi.patch(
        "/admin/settings/payment",
        paymentForm,
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Configurações de pagamento salvas");
      paymentSettingsQuery.refetch();
    },
    onError: (e: any) => {
      const msg = e?.response?.data?.message;
      toast.error(
        Array.isArray(msg)
          ? msg.join(", ")
          : (msg ?? "Erro ao salvar configurações de pagamento"),
      );
    },
  });

  const updatePaymentField = <K extends keyof PaymentSettings>(
    key: K,
    value: PaymentSettings[K],
  ) => {
    setPaymentForm((prev) => ({ ...prev, [key]: value }));
  };

  const planColor: Record<string, string> = {
    STARTER: "border-blue-500/30 bg-blue-500/5",
    PROFESSIONAL: "border-purple-500/30 bg-purple-500/5",
    ENTERPRISE: "border-amber-500/30 bg-amber-500/5",
  };
  const planBadge: Record<string, string> = {
    STARTER: "text-blue-400",
    PROFESSIONAL: "text-purple-400",
    ENTERPRISE: "text-amber-400",
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#0b1120] border border-[#1e2d4a] flex items-center justify-center">
          <Settings className="w-5 h-5 text-[#64748b]" />
        </div>
        <div>
          <h1 className="text-white text-2xl font-bold">Configurações</h1>
          <p className="text-[#64748b] text-sm mt-0.5">
            Planos e configurações globais do SaaS
          </p>
        </div>
      </div>

      {/* Login display config */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-4 h-4 text-[#64748b]" />
          <h2 className="text-white font-semibold">Tela de Login</h2>
        </div>
        <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-xl p-5 space-y-4">
          <p className="text-[#94a3b8] text-sm">
            Como a empresa deve ser identificada na tela de login:
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => saveLoginDisplay("list")}
              className={cn(
                "flex items-center gap-3 p-4 rounded-xl border text-left transition-all",
                loginDisplay === "list"
                  ? "border-primary-500 bg-primary-500/10 text-white"
                  : "border-[#1e2d4a] text-[#64748b] hover:border-[#2e3d5a] hover:text-white",
              )}
            >
              <List className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm">Lista de empresas</p>
                <p className="text-xs mt-0.5 opacity-70">
                  Exibe dropdown com nomes para seleção
                </p>
              </div>
              {loginDisplay === "list" && (
                <Check className="w-4 h-4 text-primary-400 ml-auto flex-shrink-0" />
              )}
            </button>

            <button
              onClick={() => saveLoginDisplay("uuid")}
              className={cn(
                "flex items-center gap-3 p-4 rounded-xl border text-left transition-all",
                loginDisplay === "uuid"
                  ? "border-primary-500 bg-primary-500/10 text-white"
                  : "border-[#1e2d4a] text-[#64748b] hover:border-[#2e3d5a] hover:text-white",
              )}
            >
              <Hash className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm">Digitar UUID</p>
                <p className="text-xs mt-0.5 opacity-70">
                  Usuário informa o ID da empresa manualmente
                </p>
              </div>
              {loginDisplay === "uuid" && (
                <Check className="w-4 h-4 text-primary-400 ml-auto flex-shrink-0" />
              )}
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
          <Wallet className="w-4 h-4 text-[#64748b]" />
          <h2 className="text-white font-semibold">Sistema de Pagamento</h2>
        </div>

        <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-xl p-5 space-y-5">
          <p className="text-[#94a3b8] text-sm">
            Escolha o gateway de pagamento e preencha as credenciais de
            integração.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => updatePaymentField("provider", "ASAAS")}
              className={cn(
                "flex items-center gap-2 p-3 rounded-xl border text-sm transition-colors",
                paymentForm.provider === "ASAAS"
                  ? "border-primary-500 bg-primary-500/10 text-white"
                  : "border-[#1e2d4a] text-[#94a3b8] hover:text-white hover:border-[#2e3d5a]",
              )}
            >
              <CreditCard className="w-4 h-4" /> Asaas
            </button>

            <button
              onClick={() => updatePaymentField("provider", "SICOOB")}
              className={cn(
                "flex items-center gap-2 p-3 rounded-xl border text-sm transition-colors",
                paymentForm.provider === "SICOOB"
                  ? "border-primary-500 bg-primary-500/10 text-white"
                  : "border-[#1e2d4a] text-[#94a3b8] hover:text-white hover:border-[#2e3d5a]",
              )}
            >
              <Building2 className="w-4 h-4" /> Sicoob
            </button>

            <button
              onClick={() => updatePaymentField("provider", "NONE")}
              className={cn(
                "flex items-center gap-2 p-3 rounded-xl border text-sm transition-colors",
                paymentForm.provider === "NONE"
                  ? "border-primary-500 bg-primary-500/10 text-white"
                  : "border-[#1e2d4a] text-[#94a3b8] hover:text-white hover:border-[#2e3d5a]",
              )}
            >
              <Settings className="w-4 h-4" /> Manual (sem gateway)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="space-y-1">
              <span className="text-[#94a3b8] text-xs font-semibold">
                Ambiente
              </span>
              <select
                value={paymentForm.environment}
                onChange={(e) =>
                  updatePaymentField(
                    "environment",
                    e.target.value as PaymentEnvironment,
                  )
                }
                className="w-full bg-[#0b1120] border border-[#1e2d4a] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-primary-500"
              >
                <option value="SANDBOX">Sandbox</option>
                <option value="PRODUCTION">Produção</option>
              </select>
            </label>

            <label className="space-y-1 flex items-end">
              <button
                type="button"
                onClick={() =>
                  updatePaymentField("isActive", !paymentForm.isActive)
                }
                className={cn(
                  "w-full px-3 py-2.5 rounded-lg border text-sm transition-colors",
                  paymentForm.isActive
                    ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                    : "text-[#94a3b8] border-[#1e2d4a] bg-[#0b1120]",
                )}
              >
                {paymentForm.isActive ? "Gateway ativo" : "Gateway inativo"}
              </button>
            </label>
          </div>

          {paymentForm.provider === "ASAAS" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="space-y-1 md:col-span-2">
                <span className="text-[#94a3b8] text-xs font-semibold">
                  API Key Asaas
                </span>
                <input
                  value={paymentForm.asaasApiKey ?? ""}
                  onChange={(e) =>
                    updatePaymentField("asaasApiKey", e.target.value)
                  }
                  placeholder="$aact_..."
                  className="w-full bg-[#0b1120] border border-[#1e2d4a] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-primary-500"
                />
              </label>
              <label className="space-y-1">
                <span className="text-[#94a3b8] text-xs font-semibold">
                  Wallet ID
                </span>
                <input
                  value={paymentForm.asaasWalletId ?? ""}
                  onChange={(e) =>
                    updatePaymentField("asaasWalletId", e.target.value)
                  }
                  placeholder="wallet_123"
                  className="w-full bg-[#0b1120] border border-[#1e2d4a] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-primary-500"
                />
              </label>
              <label className="space-y-1">
                <span className="text-[#94a3b8] text-xs font-semibold">
                  Webhook Token
                </span>
                <input
                  value={paymentForm.asaasWebhookToken ?? ""}
                  onChange={(e) =>
                    updatePaymentField("asaasWebhookToken", e.target.value)
                  }
                  placeholder="token_webhook"
                  className="w-full bg-[#0b1120] border border-[#1e2d4a] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-primary-500"
                />
              </label>
            </div>
          )}

          {paymentForm.provider === "SICOOB" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="space-y-1">
                <span className="text-[#94a3b8] text-xs font-semibold">
                  Client ID
                </span>
                <input
                  value={paymentForm.sicoobClientId ?? ""}
                  onChange={(e) =>
                    updatePaymentField("sicoobClientId", e.target.value)
                  }
                  className="w-full bg-[#0b1120] border border-[#1e2d4a] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-primary-500"
                />
              </label>
              <label className="space-y-1">
                <span className="text-[#94a3b8] text-xs font-semibold">
                  Client Secret
                </span>
                <input
                  value={paymentForm.sicoobClientSecret ?? ""}
                  onChange={(e) =>
                    updatePaymentField("sicoobClientSecret", e.target.value)
                  }
                  className="w-full bg-[#0b1120] border border-[#1e2d4a] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-primary-500"
                />
              </label>
              <label className="space-y-1 md:col-span-2">
                <span className="text-[#94a3b8] text-xs font-semibold">
                  Certificado Base64
                </span>
                <textarea
                  value={paymentForm.sicoobCertificateBase64 ?? ""}
                  onChange={(e) =>
                    updatePaymentField(
                      "sicoobCertificateBase64",
                      e.target.value,
                    )
                  }
                  rows={4}
                  className="w-full bg-[#0b1120] border border-[#1e2d4a] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-primary-500"
                />
              </label>
              <label className="space-y-1 md:col-span-2">
                <span className="text-[#94a3b8] text-xs font-semibold">
                  Chave PIX
                </span>
                <input
                  value={paymentForm.sicoobPixKey ?? ""}
                  onChange={(e) =>
                    updatePaymentField("sicoobPixKey", e.target.value)
                  }
                  className="w-full bg-[#0b1120] border border-[#1e2d4a] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-primary-500"
                />
              </label>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={() => updatePaymentSettings.mutate()}
              disabled={
                updatePaymentSettings.isPending ||
                paymentSettingsQuery.isLoading
              }
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {updatePaymentSettings.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {updatePaymentSettings.isPending
                ? "Salvando..."
                : "Salvar gateway"}
            </button>
          </div>
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
                  "border rounded-xl p-5 space-y-4",
                  planColor[plan.type] ?? "border-[#1e2d4a] bg-[#0b1120]",
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "text-sm font-bold",
                      planBadge[plan.type] ?? "text-white",
                    )}
                  >
                    {plan.name}
                  </span>
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full border",
                      plan.isActive
                        ? "text-emerald-400 border-emerald-500/30"
                        : "text-[#64748b] border-[#1e2d4a]",
                    )}
                  >
                    {plan.isActive ? "Ativo" : "Inativo"}
                  </span>
                </div>

                <div>
                  <span className="text-white text-2xl font-bold">
                    R${" "}
                    {Number(plan.priceMonthly).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
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

      <div>
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-4 h-4 text-[#64748b]" />
          <h2 className="text-white font-semibold">Backup</h2>
        </div>

        <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-xl p-5">
          <p className="text-[#94a3b8] text-sm mb-4">
            Gere um backup completo (ZIP com JSON) do banco master e de todos os
            schemas de tenants.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => backupMutation.mutate()}
              disabled={backupMutation.isPending || restoreMutation.isPending}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {backupMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {backupMutation.isPending
                ? "Gerando backup..."
                : "Baixar backup completo"}
            </button>

            <button
              onClick={() => restoreInputRef.current?.click()}
              disabled={restoreMutation.isPending || backupMutation.isPending}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium hover:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {restoreMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {restoreMutation.isPending
                ? "Restaurando..."
                : "Restaurar backup completo"}
            </button>

            <input
              ref={restoreInputRef}
              type="file"
              accept=".zip"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) restoreMutation.mutate(file);
                e.target.value = "";
              }}
            />
          </div>

          {backupMutation.isError && (
            <p className="text-red-400 text-xs mt-3">
              Não foi possível gerar o backup. Tente novamente.
            </p>
          )}
          {restoreMutation.isError && (
            <p className="text-red-400 text-xs mt-3">
              {(restoreMutation.error as any)?.response?.data?.message ??
                "Erro ao restaurar o backup."}
            </p>
          )}
        </div>
      </div>

      {/* Info box */}
      <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-xl p-5 text-sm text-[#64748b]">
        <p className="text-white font-medium mb-1">Configurações avançadas</p>
        <p>
          SMTP, integrações e parâmetros globais serão disponibilizados em
          breve.
        </p>
      </div>
    </div>
  );
}
