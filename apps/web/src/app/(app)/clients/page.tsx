"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import api from "@/lib/api";
import { Search, Plus, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { toast } from "sonner";

interface Client {
  id: string;
  name: string;
  doc?: string;
  email?: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  _count?: { saleOrders: number };
}

interface ClientFormState {
  id?: string;
  name: string;
  doc: string;
  email: string;
  phone: string;
  address: string;
}

const emptyForm: ClientFormState = {
  name: "",
  doc: "",
  email: "",
  phone: "",
  address: "",
};

export default function ClientsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<ClientFormState>(emptyForm);

  const { data: clients = [], isLoading } = useQuery<Client[]>({
    queryKey: ["clients", search],
    queryFn: async () => {
      const res = await api.get("/clients", {
        params: {
          q: search.length >= 3 ? search : undefined,
          limit: 100,
        },
      });
      return res.data;
    },
  });

  const filtered = useMemo(() => {
    if (search.length < 3) return clients;
    const term = search.toLowerCase();
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        (c.doc || "").toLowerCase().includes(term) ||
        (c.phone || "").toLowerCase().includes(term),
    );
  }, [clients, search]);

  const saveMutation = useMutation({
    mutationFn: async (payload: ClientFormState) => {
      const body = {
        name: payload.name,
        doc: payload.doc || undefined,
        email: payload.email || undefined,
        phone: payload.phone || undefined,
        address: payload.address || undefined,
      };

      if (payload.id) {
        const res = await api.put(`/clients/${payload.id}`, body);
        return res.data;
      }

      const res = await api.post("/clients", body);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Cliente salvo com sucesso");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      setIsOpen(false);
      setForm(emptyForm);
    },
    onError: () => toast.error("Erro ao salvar cliente"),
  });

  const openCreate = () => {
    setForm(emptyForm);
    setIsOpen(true);
  };

  const openEdit = (client: Client) => {
    setForm({
      id: client.id,
      name: client.name || "",
      doc: client.doc || "",
      email: client.email || "",
      phone: client.phone || "",
      address: client.address || "",
    });
    setIsOpen(true);
  };

  return (
    <div className="min-h-screen bg-brand-bg">
      <Header title="Clientes" />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-brand-text-primary">
              Clientes
            </h1>
            <p className="text-brand-text-secondary mt-1">
              Cadastro e consulta de clientes para uso nas vendas.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="bg-primary-600 hover:bg-primary-700 text-white rounded-xl px-5 py-2.5 font-semibold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Novo Cliente
          </button>
        </div>

        <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-card">
          <div className="relative max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar cliente (nome, documento, telefone)"
              className="w-full bg-slate-50 border border-brand-border rounded-xl pl-10 pr-3.5 py-2.5 text-sm focus:outline-none focus:border-primary-500"
            />
          </div>
          <p className="text-xs text-brand-text-secondary mt-2">
            A busca no servidor é ativada a partir de 3 caracteres.
          </p>
        </div>

        <div className="bg-white border border-brand-border rounded-2xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-brand-bg border-b border-brand-border">
                <tr>
                  {[
                    "Nome",
                    "Documento",
                    "Telefone",
                    "Email",
                    "Pedidos",
                    "Ações",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-text-secondary"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/50">
                {isLoading && (
                  <tr>
                    <td
                      className="px-4 py-6 text-center text-brand-text-secondary"
                      colSpan={6}
                    >
                      <Loader2 className="inline-block w-4 h-4 animate-spin mr-2" />{" "}
                      Carregando...
                    </td>
                  </tr>
                )}

                {!isLoading && filtered.length === 0 && (
                  <tr>
                    <td
                      className="px-4 py-6 text-center text-brand-text-secondary"
                      colSpan={6}
                    >
                      Nenhum cliente encontrado.
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  filtered.map((client) => (
                    <tr
                      key={client.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="px-4 py-3 font-semibold text-brand-text-primary">
                        {client.name}
                      </td>
                      <td className="px-4 py-3 text-brand-text-secondary">
                        {client.doc || "-"}
                      </td>
                      <td className="px-4 py-3 text-brand-text-secondary">
                        {client.phone || "-"}
                      </td>
                      <td className="px-4 py-3 text-brand-text-secondary">
                        {client.email || "-"}
                      </td>
                      <td className="px-4 py-3 text-brand-text-secondary">
                        {client._count?.saleOrders ?? 0}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => openEdit(client)}
                          className="rounded-lg border border-brand-border px-3 py-1.5 text-xs font-semibold hover:bg-slate-50"
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/45"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-lg border border-brand-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-brand-text-primary">
                {form.id ? "Editar Cliente" : "Novo Cliente"}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-brand-text-secondary hover:text-brand-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Nome"
                className="col-span-2 bg-slate-50 border border-brand-border rounded-xl px-3.5 py-2.5 text-sm"
              />
              <input
                value={form.doc}
                onChange={(e) =>
                  setForm((p) => ({ ...p, doc: e.target.value }))
                }
                placeholder="CPF/CNPJ"
                className="bg-slate-50 border border-brand-border rounded-xl px-3.5 py-2.5 text-sm"
              />
              <input
                value={form.phone}
                onChange={(e) =>
                  setForm((p) => ({ ...p, phone: e.target.value }))
                }
                placeholder="Telefone"
                className="bg-slate-50 border border-brand-border rounded-xl px-3.5 py-2.5 text-sm"
              />
              <input
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                placeholder="Email"
                className="col-span-2 bg-slate-50 border border-brand-border rounded-xl px-3.5 py-2.5 text-sm"
              />
              <input
                value={form.address}
                onChange={(e) =>
                  setForm((p) => ({ ...p, address: e.target.value }))
                }
                placeholder="Endereço"
                className="col-span-2 bg-slate-50 border border-brand-border rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>

            <button
              onClick={() => {
                if (!form.name.trim()) {
                  toast.error("Nome do cliente é obrigatório");
                  return;
                }
                saveMutation.mutate(form);
              }}
              disabled={saveMutation.isPending}
              className={cn(
                "mt-5 w-full rounded-xl py-2.5 font-semibold text-white",
                "bg-primary-600 hover:bg-primary-700 disabled:opacity-50",
              )}
            >
              {saveMutation.isPending ? "Salvando..." : "Salvar Cliente"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
