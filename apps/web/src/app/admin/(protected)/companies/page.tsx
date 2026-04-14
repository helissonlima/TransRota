"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  Circle,
  Search,
  ToggleLeft,
  ToggleRight,
  ChevronRight,
  Plus,
  X,
  Eye,
  EyeOff,
  Trash2,
  LayoutGrid,
  Upload,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import adminApi, { uploadSmartRestore } from "@/lib/admin-api";
import { cn } from "@/lib/cn";

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
  const restoreInputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    name: "",
    cnpj: "",
    email: "",
    phone: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const { data: companies = [], isLoading } = useQuery<Company[]>({
    queryKey: ["admin", "companies"],
    queryFn: async () => {
      const { data } = await adminApi.get("/admin/companies");
      return data;
    },
  });

  const toggle = useMutation({
    mutationFn: (id: string) => adminApi.patch(`/admin/companies/${id}/toggle`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin", "companies"] }),
  });

  const createMutation = useMutation({
    mutationFn: () => {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";
      return import("axios").then(({ default: axios }) =>
        axios.post(`${baseUrl}/companies`, form),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "companies"] });
      setModalOpen(false);
      setForm({
        name: "",
        cnpj: "",
        email: "",
        phone: "",
        adminName: "",
        adminEmail: "",
        adminPassword: "",
      });
      setFormError("");
    },
    onError: (e: any) => {
      const msg = e?.response?.data?.message;
      setFormError(
        Array.isArray(msg) ? msg.join(", ") : (msg ?? "Erro ao criar empresa"),
      );
    },
  });

  const removeCompany = useMutation({
    mutationFn: (id: string) => adminApi.delete(`/admin/companies/${id}`),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["admin", "companies"] });
      const previous =
        queryClient.getQueryData<Company[]>(["admin", "companies"]) ?? [];
      queryClient.setQueryData<Company[]>(
        ["admin", "companies"],
        previous.filter((company) => company.id !== id),
      );
      return { previous };
    },
    onError: (error: any, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["admin", "companies"], context.previous);
      }
      const msg = error?.response?.data?.message;
      toast.error(
        Array.isArray(msg) ? msg.join(", ") : (msg ?? "Erro ao apagar empresa"),
      );
    },
    onSuccess: () => {
      toast.success("Empresa removida permanentemente");
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "companies"] });
      await queryClient.refetchQueries({
        queryKey: ["admin", "companies"],
        type: "active",
      });
    },
  });

  const restoreCompany = useMutation({
    mutationFn: (file: File) => uploadSmartRestore(file),
    onSuccess: async (result) => {
      if (result.type === "company") {
        toast.success(
          `${result.data.message}. Empresa ${result.data.companyId} disponível no superadmin.`,
        );
      } else {
        toast.success(
          `${result.data.message}. Empresas restauradas: ${result.data.tenantsRestored}.`,
        );
      }
      await queryClient.invalidateQueries({ queryKey: ["admin", "companies"] });
      await queryClient.refetchQueries({
        queryKey: ["admin", "companies"],
        type: "active",
      });
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message;
      toast.error(
        Array.isArray(msg)
          ? msg.join(", ")
          : (msg ?? "Erro ao restaurar backup da empresa"),
      );
    },
  });

  const filtered = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.cnpj.includes(search) ||
      c.email.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDeleteCompany = (company: Company) => {
    const phrase = window.prompt(
      `Para excluir PERMANENTEMENTE a empresa \"${company.name}\", digite APAGAR`,
    );

    if (phrase !== "APAGAR") {
      toast.error("Confirmação inválida. Digite APAGAR para excluir.");
      return;
    }
    removeCompany.mutate(company.id);
  };

  const planColor: Record<string, string> = {
    STARTER: "text-blue-400 bg-blue-500/10",
    PROFESSIONAL: "text-purple-400 bg-purple-500/10",
    ENTERPRISE: "text-amber-400 bg-amber-500/10",
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Empresas</h1>
          <p className="text-[#64748b] text-sm mt-0.5">
            {companies.length} empresa{companies.length !== 1 ? "s" : ""}{" "}
            cadastrada{companies.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => restoreInputRef.current?.click()}
            disabled={restoreCompany.isPending}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {restoreCompany.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {restoreCompany.isPending ? "Restaurando..." : "Restaurar Empresa"}
          </button>
          <button
            onClick={() => {
              setModalOpen(true);
              setFormError("");
            }}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nova Empresa
          </button>
          <input
            ref={restoreInputRef}
            type="file"
            accept=".zip"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) restoreCompany.mutate(file);
              e.target.value = "";
            }}
          />
        </div>
      </div>

      <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-xl px-4 py-3 text-sm text-[#94a3b8]">
        Use Restaurar Empresa para subir uma loja completa a partir de um ZIP de
        backup. Se a empresa ainda não existir no cadastro master, ela será
        recriada automaticamente.
      </div>

      {/* Modal Nova Empresa */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0d1b36] border border-[#1e2d4a] rounded-2xl w-full max-w-lg mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e2d4a] sticky top-0 bg-[#0d1b36] z-10">
              <h2 className="text-white font-bold text-lg">Nova Empresa</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-[#64748b] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {formError && (
                <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
                  {formError}
                </div>
              )}

              <p className="text-[#64748b] text-xs font-semibold uppercase tracking-wider">
                Dados da Empresa
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[#94a3b8] text-xs font-semibold mb-1.5">
                    Razão Social *
                  </label>
                  <input
                    value={form.name}
                    onChange={set("name")}
                    placeholder="Transportadora Exemplo Ltda"
                    className="w-full bg-[#0b1120] border border-[#1e2d4a] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#475569] outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[#94a3b8] text-xs font-semibold mb-1.5">
                    CNPJ *
                  </label>
                  <input
                    value={form.cnpj}
                    onChange={set("cnpj")}
                    placeholder="00.000.000/0001-00"
                    className="w-full bg-[#0b1120] border border-[#1e2d4a] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#475569] font-mono outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[#94a3b8] text-xs font-semibold mb-1.5">
                    Telefone
                  </label>
                  <input
                    value={form.phone}
                    onChange={set("phone")}
                    placeholder="(11) 99999-9999"
                    className="w-full bg-[#0b1120] border border-[#1e2d4a] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#475569] outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[#94a3b8] text-xs font-semibold mb-1.5">
                    E-mail da Empresa *
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    placeholder="contato@empresa.com"
                    className="w-full bg-[#0b1120] border border-[#1e2d4a] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#475569] outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
              </div>

              <div className="border-t border-[#1e2d4a] pt-5">
                <p className="text-[#64748b] text-xs font-semibold uppercase tracking-wider mb-4">
                  Usuário Administrador
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-[#94a3b8] text-xs font-semibold mb-1.5">
                      Nome do Admin *
                    </label>
                    <input
                      value={form.adminName}
                      onChange={set("adminName")}
                      placeholder="Nome completo"
                      className="w-full bg-[#0b1120] border border-[#1e2d4a] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#475569] outline-none focus:border-primary-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[#94a3b8] text-xs font-semibold mb-1.5">
                      E-mail do Admin *
                    </label>
                    <input
                      type="email"
                      value={form.adminEmail}
                      onChange={set("adminEmail")}
                      placeholder="admin@empresa.com"
                      className="w-full bg-[#0b1120] border border-[#1e2d4a] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#475569] outline-none focus:border-primary-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[#94a3b8] text-xs font-semibold mb-1.5">
                      Senha do Admin *
                    </label>
                    <div className="relative">
                      <input
                        type={showPass ? "text" : "password"}
                        value={form.adminPassword}
                        onChange={set("adminPassword")}
                        placeholder="Mínimo 8 caracteres"
                        className="w-full bg-[#0b1120] border border-[#1e2d4a] rounded-lg px-3 py-2.5 pr-10 text-sm text-white placeholder-[#475569] outline-none focus:border-primary-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#475569] hover:text-white transition-colors"
                      >
                        {showPass ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#1e2d4a] sticky bottom-0 bg-[#0d1b36]">
              <button
                onClick={() => setModalOpen(false)}
                className="text-[#94a3b8] hover:text-white text-sm px-4 py-2 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => createMutation.mutate()}
                disabled={
                  createMutation.isPending ||
                  !form.name ||
                  !form.cnpj ||
                  !form.email ||
                  !form.adminName ||
                  !form.adminEmail ||
                  form.adminPassword.length < 8
                }
                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                {createMutation.isPending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                Criar Empresa
              </button>
            </div>
          </div>
        </div>
      )}

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
              <th className="text-left text-[#64748b] font-medium px-5 py-3">
                Empresa
              </th>
              <th className="text-left text-[#64748b] font-medium px-5 py-3">
                CNPJ
              </th>
              <th className="text-left text-[#64748b] font-medium px-5 py-3">
                Plano
              </th>
              <th className="text-left text-[#64748b] font-medium px-5 py-3">
                Trial
              </th>
              <th className="text-left text-[#64748b] font-medium px-5 py-3">
                Status
              </th>
              <th className="text-left text-[#64748b] font-medium px-5 py-3">
                Ações
              </th>
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
                <td
                  colSpan={7}
                  className="px-5 py-12 text-center text-[#64748b]"
                >
                  <Building2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p>Nenhuma empresa encontrada</p>
                </td>
              </tr>
            ) : (
              filtered.map((company) => (
                <tr
                  key={company.id}
                  className="border-b border-[#0f1929] hover:bg-[#0f1929] transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <p className="text-white font-medium">{company.name}</p>
                    <p className="text-[#64748b] text-xs">{company.email}</p>
                    <p
                      className="text-[#475569] font-mono text-[10px] mt-0.5 cursor-pointer hover:text-[#94a3b8] transition-colors select-all"
                      title="Clique para selecionar"
                    >
                      {company.id}
                    </p>
                  </td>
                  <td className="px-5 py-3.5 text-[#94a3b8] font-mono text-xs">
                    {company.cnpj}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full font-medium",
                        planColor[company.plan.type] ??
                          "text-gray-400 bg-gray-500/10",
                      )}
                    >
                      {company.plan.name}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[#64748b] text-xs">
                    {company.trialEndsAt
                      ? new Date(company.trialEndsAt) > new Date()
                        ? `${Math.ceil((new Date(company.trialEndsAt).getTime() - Date.now()) / 86400000)}d restantes`
                        : "Expirado"
                      : "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={cn(
                        "flex items-center gap-1.5 text-xs font-medium w-fit",
                        company.isActive
                          ? "text-emerald-400"
                          : "text-[#64748b]",
                      )}
                    >
                      <Circle className="w-1.5 h-1.5 fill-current" />
                      {company.isActive ? "Ativa" : "Inativa"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggle.mutate(company.id)}
                        disabled={
                          toggle.isPending ||
                          removeCompany.isPending ||
                          restoreCompany.isPending
                        }
                        className={cn(
                          "flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg transition-colors",
                          company.isActive
                            ? "text-red-400 hover:bg-red-900/20"
                            : "text-emerald-400 hover:bg-emerald-900/20",
                        )}
                      >
                        {company.isActive ? (
                          <ToggleRight className="w-4 h-4" />
                        ) : (
                          <ToggleLeft className="w-4 h-4" />
                        )}
                        {company.isActive ? "Desativar" : "Ativar"}
                      </button>

                      <button
                        onClick={() =>
                          router.push(`/admin/companies/${company.id}/features`)
                        }
                        title="Gerenciar módulos habilitados"
                        className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg text-violet-400 hover:bg-violet-900/20 transition-colors"
                      >
                        <LayoutGrid className="w-4 h-4" />
                        Módulos
                      </button>

                      <button
                        onClick={() => handleDeleteCompany(company)}
                        disabled={
                          removeCompany.isPending || restoreCompany.isPending
                        }
                        title="Excluir empresa permanentemente"
                        className={cn(
                          "flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg transition-colors",
                          "text-rose-400 hover:bg-rose-900/20",
                        )}
                      >
                        <Trash2 className="w-4 h-4" />
                        Apagar
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() =>
                        router.push(`/admin/companies/${company.id}`)
                      }
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
