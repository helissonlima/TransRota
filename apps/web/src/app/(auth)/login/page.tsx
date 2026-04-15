"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Truck,
  Eye,
  EyeOff,
  ArrowRight,
  MapPin,
  Shield,
  Zap,
  BarChart2,
  Building2,
} from "lucide-react";
import { login } from "@/lib/auth";
import { cn } from "@/lib/cn";
import { useBrandSettings } from "@/lib/branding";

interface Company {
  id: string;
  name: string;
}

const loginSchema = z.object({
  tenantId: z.string().min(1, "Selecione ou informe a empresa"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha obrigatória"),
});

type LoginForm = z.infer<typeof loginSchema>;

const features = [
  {
    icon: MapPin,
    title: "Rastreamento em Tempo Real",
    desc: "Monitore sua frota 24/7 com atualizações ao vivo",
  },
  {
    icon: Shield,
    title: "Checklists Inteligentes",
    desc: "Garanta conformidade com inspeções automatizadas",
  },
  {
    icon: BarChart2,
    title: "Relatórios Avançados",
    desc: "Tome decisões baseadas em dados precisos",
  },
  {
    icon: Zap,
    title: "Alta Performance",
    desc: "Sistema responsivo e escalável para frotas de qualquer tamanho",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
} as const;

const REMEMBER_KEY = "tr_remember";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companiesLoading, setCompaniesLoading] = useState(true);
  const [loginDisplay, setLoginDisplay] = useState<"list" | "uuid">("list");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const selectedTenantId = watch("tenantId");
  const brand = useBrandSettings(selectedTenantId);

  useEffect(() => {
    const stored = localStorage.getItem("tr_admin_login_display");
    if (stored === "uuid") {
      setLoginDisplay("uuid");
      setCompaniesLoading(false);
      return;
    }
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "/api/v1";
    axios
      .get<Company[]>(`${apiUrl}/companies`)
      .then((r) => {
        setCompanies(r.data);
        if (r.data.length === 1) {
          setValue("tenantId", r.data[0].id);
        }
      })
      .catch(() => {
        /* silencia — usuário preencherá manualmente */
      })
      .finally(() => setCompaniesLoading(false));
  }, [setValue]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(REMEMBER_KEY);
      if (saved) {
        const { tenantId, email } = JSON.parse(saved);
        if (tenantId) setValue("tenantId", tenantId);
        if (email) setValue("email", email);
        setRememberMe(true);
      }
    } catch {}
  }, [setValue]);

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setError("");
    try {
      await login(data);
      if (rememberMe) {
        localStorage.setItem(
          REMEMBER_KEY,
          JSON.stringify({ tenantId: data.tenantId, email: data.email }),
        );
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }
      router.push("/dashboard");
    } catch {
      setError(
        "Credenciais inválidas. Verifique seus dados e tente novamente.",
      );
      setShake(true);
      setTimeout(() => setShake(false), 600);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel — brand ─────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[55%] xl:w-[60%] relative bg-sidebar overflow-hidden flex-col">
        {/* Background decoration */}
        <div className="absolute inset-0">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0b1120] via-[#0d1b36] to-[#0f2252]" />

          {/* Animated grid */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.04]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Glowing orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-16"
          >
            {brand.logoDataUrl ? (
              <img
                src={brand.logoDataUrl}
                alt="Logo da empresa"
                className="w-12 h-12 rounded-2xl object-cover shadow-glow"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-brand rounded-2xl flex items-center justify-center shadow-glow">
                <Truck className="w-7 h-7 text-white" />
              </div>
            )}
            <div>
              <span className="text-white font-bold text-2xl tracking-tight">
                {brand.name}
              </span>
              <div className="text-sidebar-text text-xs">
                Gestão de Frota e Rotas
              </div>
            </div>
          </motion.div>

          {/* Hero text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex-1 flex flex-col justify-center"
          >
            <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-4">
              Gerencie sua frota{" "}
              <span className="gradient-text">com inteligência</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed mb-12 max-w-md">
              Controle completo de veículos, motoristas e rotas em uma
              plataforma moderna e intuitiva.
            </p>

            {/* Feature list */}
            <div className="space-y-5">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">
                      {feature.title}
                    </div>
                    <div className="text-slate-500 text-xs mt-0.5">
                      {feature.desc}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Animated truck SVG illustration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12"
          >
            <svg
              viewBox="0 0 400 80"
              className="w-full max-w-sm opacity-20"
              fill="none"
            >
              {/* Road */}
              <path
                d="M0 70 L400 70"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="20 10"
              />
              {/* Truck body */}
              <rect
                x="20"
                y="30"
                width="120"
                height="35"
                rx="4"
                fill="white"
                fillOpacity="0.3"
              />
              <rect
                x="20"
                y="30"
                width="60"
                height="35"
                rx="4"
                fill="white"
                fillOpacity="0.5"
              />
              {/* Wheels */}
              <circle
                cx="60"
                cy="68"
                r="10"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeOpacity="0.6"
              />
              <circle
                cx="120"
                cy="68"
                r="10"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeOpacity="0.6"
              />
              {/* Window */}
              <rect
                x="25"
                y="35"
                width="30"
                height="18"
                rx="2"
                fill="white"
                fillOpacity="0.4"
              />
            </svg>
            <div className="mt-4 text-slate-600 text-xs">
              © {new Date().getFullYear()} {brand.name}. Todos os direitos
              reservados.
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Right panel — form ──────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-3 mb-8 lg:hidden"
          >
            {brand.logoDataUrl ? (
              <img
                src={brand.logoDataUrl}
                alt="Logo da empresa"
                className="w-10 h-10 rounded-xl object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-brand rounded-xl flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
            )}
            <span className="font-bold text-xl text-brand-text-primary">
              {brand.name}
            </span>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h2 className="text-3xl font-bold text-brand-text-primary">
              Bem-vindo de volta
            </h2>
            <p className="text-brand-text-secondary mt-2 text-sm">
              Faça login para acessar o painel de gestão
            </p>
          </motion.div>

          {/* Error alert */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={cn("mt-6 overflow-hidden", shake && "animate-shake")}
              >
                <div className="p-3 bg-danger-50 border border-danger-100 rounded-xl text-danger-700 text-sm">
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 space-y-5"
          >
            {/* Empresa */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">
                Empresa
              </label>

              {loginDisplay === "uuid" ? (
                /* Modo UUID — digitação manual */
                <>
                  <input
                    {...register("tenantId")}
                    placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    className={cn(
                      "input-base font-mono text-sm",
                      errors.tenantId &&
                        "border-danger-400 focus:!ring-danger-200 focus:!border-danger-400",
                    )}
                    autoComplete="organization"
                  />
                  <AnimatePresence>
                    {errors.tenantId && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="text-danger-500 text-xs mt-1.5 flex items-center gap-1"
                      >
                        {errors.tenantId.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </>
              ) : companiesLoading ? (
                <div className="input-base flex items-center gap-2 text-brand-text-secondary animate-pulse">
                  <span className="w-4 h-4 rounded-full bg-brand-border inline-block" />
                  Carregando empresas…
                </div>
              ) : companies.length === 1 ? (
                <>
                  <input type="hidden" {...register("tenantId")} />
                  <div className="input-base flex items-center gap-2 bg-slate-50 text-brand-text-primary cursor-default select-none">
                    <Building2 className="w-4 h-4 text-primary-500 flex-shrink-0" />
                    {companies[0].name}
                  </div>
                </>
              ) : companies.length > 1 ? (
                <>
                  <select
                    {...register("tenantId")}
                    className={cn(
                      "input-base",
                      errors.tenantId &&
                        "border-danger-400 focus:!ring-danger-200 focus:!border-danger-400",
                    )}
                  >
                    <option value="">Selecione a empresa…</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <AnimatePresence>
                    {errors.tenantId && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="text-danger-500 text-xs mt-1.5 flex items-center gap-1"
                      >
                        {errors.tenantId.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                /* fallback manual — API indisponível */
                <>
                  <input
                    {...register("tenantId")}
                    placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    className={cn(
                      "input-base font-mono text-sm",
                      errors.tenantId &&
                        "border-danger-400 focus:!ring-danger-200 focus:!border-danger-400",
                    )}
                    autoComplete="organization"
                  />
                  <AnimatePresence>
                    {errors.tenantId && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="text-danger-500 text-xs mt-1.5 flex items-center gap-1"
                      >
                        {errors.tenantId.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </>
              )}
            </motion.div>

            {/* Email */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">
                E-mail
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="admin@empresa.com"
                className={cn(
                  "input-base",
                  errors.email &&
                    "border-danger-400 focus:!ring-danger-200 focus:!border-danger-400",
                )}
                autoComplete="email"
              />
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-danger-500 text-xs mt-1.5"
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-semibold text-brand-text-primary mb-1.5">
                Senha
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={cn(
                    "input-base pr-10",
                    errors.password &&
                      "border-danger-400 focus:!ring-danger-200 focus:!border-danger-400",
                  )}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-secondary hover:text-brand-text-primary transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-danger-500 text-xs mt-1.5"
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Remember me */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={() => setRememberMe((v) => !v)}
                className={cn(
                  "w-4 h-4 rounded border flex items-center justify-center transition-colors flex-shrink-0",
                  rememberMe
                    ? "bg-primary-600 border-primary-600"
                    : "border-brand-border bg-white",
                )}
              >
                {rememberMe && (
                  <svg
                    className="w-2.5 h-2.5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
              <span
                className="text-sm text-brand-text-secondary cursor-pointer select-none"
                onClick={() => setRememberMe((v) => !v)}
              >
                Lembrar meu e-mail
              </span>
            </motion.div>

            {/* Submit */}
            <motion.div variants={itemVariants} className="pt-2">
              <motion.button
                type="submit"
                disabled={loading}
                whileTap={loading ? {} : { scale: 0.98 }}
                className={cn(
                  "w-full h-12 flex items-center justify-center gap-2",
                  "bg-gradient-brand text-white rounded-xl font-semibold text-sm",
                  "shadow-glow hover:shadow-glow transition-all duration-200",
                  "disabled:opacity-60 disabled:cursor-not-allowed",
                )}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Entrando...
                  </>
                ) : (
                  <>
                    Entrar na Plataforma
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </motion.div>
          </motion.form>

          <motion.p
            variants={itemVariants}
            className="mt-8 text-center text-xs text-brand-text-secondary"
          >
            Precisa de ajuda?{" "}
            <a
              href="mailto:suporte@transrota.com.br"
              className="text-primary-600 hover:underline font-medium"
            >
              Fale com o suporte
            </a>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
