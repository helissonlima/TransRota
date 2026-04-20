"use client";

import { useEffect, useCallback } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { X, Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";

// ============================================================================
// DETAIL PANEL — Sistema global de visualização de detalhes
//
// Uso: Qualquer página que precisa mostrar detalhes de um item selecionado
// pode usar este componente. Ele renderiza uma subtela centralizada (Modal)
// elegante com animação de zoom-in para manter o foco no contexto.
//
// Exemplo:
//   <DetailPanel
//     open={!!selectedItem}
//     onClose={() => setSelectedItem(null)}
//     title="Pedido #123"
//     subtitle="Cliente XYZ"
//     badges={[{ label: 'Confirmado', variant: 'info' }]}
//     actions={{ onEdit: () => ..., onDelete: () => ... }}
//   >
//     <DetailPanel.Section title="Informações">
//       <DetailPanel.Field label="Nome" value="..." />
//     </DetailPanel.Section>
//   </DetailPanel>
// ============================================================================

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "purple"
  | "orange"
  | "gray";

interface DetailBadge {
  label: string;
  variant?: BadgeVariant;
}

interface DetailPanelActions {
  onEdit?: () => void;
  onDelete?: () => void;
  extra?: React.ReactNode;
}

interface DetailPanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  badges?: DetailBadge[];
  actions?: DetailPanelActions;
  onEdit?: () => void;
  onDelete?: () => void;
  children: React.ReactNode;
  width?: "md" | "lg" | "xl" | "full";
  className?: string;
}

const sizeMaxWidth: Record<string, string> = {
  md: "max-w-xl",
  lg: "max-w-2xl",
  xl: "max-w-3xl",
  full: "max-w-5xl",
};

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const panelVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring" as const, damping: 28, stiffness: 380 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: { duration: 0.18 },
  },
};

const badgeVariantStyles: Record<BadgeVariant, string> = {
  default: "bg-primary-100 text-primary-700",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
  purple: "bg-purple-100 text-purple-700",
  orange: "bg-orange-100 text-orange-700",
  gray: "bg-slate-100 text-slate-600",
};

function DetailPanelRoot({
  open,
  onClose,
  title,
  subtitle,
  badges,
  actions: actionsProp,
  onEdit,
  onDelete,
  children,
  width = "lg",
  className,
}: DetailPanelProps) {
  // Merge top-level onEdit/onDelete into actions
  const actions =
    actionsProp ?? (onEdit || onDelete ? { onEdit, onDelete } : undefined);

  // ── Keyboard ──────────────────────────────────────────────────────────

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, handleKeyDown]);

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            {/* Backdrop */}
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                variants={backdropVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>

            {/* Centered Modal (Subtela) */}
            <Dialog.Content asChild>
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto pointer-events-none">
                <motion.div
                  className={cn(
                    "w-full bg-white shadow-modal flex flex-col rounded-2xl pointer-events-auto",
                    "max-h-[90vh] overflow-hidden border border-brand-border/60",
                    sizeMaxWidth[width] ?? "max-w-2xl",
                    className,
                  )}
                  variants={panelVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {/* Header */}
                  <div className="flex-shrink-0 border-b border-slate-200 bg-white">
                    <div className="flex items-start justify-between px-6 py-5">
                      <div className="min-w-0 flex-1">
                        <Dialog.Title className="text-lg font-bold text-slate-900 leading-tight">
                          {title}
                        </Dialog.Title>
                        {subtitle && (
                          <Dialog.Description className="text-sm text-slate-500 mt-0.5 truncate">
                            {subtitle}
                          </Dialog.Description>
                        )}
                        {badges && badges.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {badges.map((badge, i) => (
                              <span
                                key={i}
                                className={cn(
                                  "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold",
                                  badgeVariantStyles[
                                    badge.variant || "default"
                                  ],
                                )}
                              >
                                {badge.label}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0 ml-4">
                        {actions?.onEdit && (
                          <button
                            onClick={actions.onEdit}
                            className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                        )}
                        {actions?.onDelete && (
                          <button
                            onClick={actions.onDelete}
                            className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                        {actions?.extra}
                        <Dialog.Close asChild>
                          <button
                            onClick={onClose}
                            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                            aria-label="Fechar"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </Dialog.Close>
                      </div>
                    </div>
                  </div>

                  {/* Body (scrollable) */}
                  <div className="flex-1 overflow-y-auto scrollbar-thin">
                    {children}
                  </div>
                </motion.div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────

interface SectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

function Section({ title, children, className, noPadding }: SectionProps) {
  return (
    <div
      className={cn(
        !noPadding && "px-5 py-4",
        "border-b border-slate-100 last:border-0",
        className,
      )}
    >
      {title && (
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

// ─── Field ───────────────────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  value: React.ReactNode;
  className?: string;
  mono?: boolean;
}

function Field({ label, value, className, mono }: FieldProps) {
  return (
    <div className={cn("py-1.5", className)}>
      <dt className="text-xs text-slate-400 font-medium">{label}</dt>
      <dd
        className={cn(
          "text-sm text-slate-800 font-semibold mt-0.5",
          mono && "font-mono",
        )}
      >
        {value || <span className="text-slate-300">—</span>}
      </dd>
    </div>
  );
}

// ─── Grid ────────────────────────────────────────────────────────────────────

interface GridProps {
  cols?: 2 | 3 | 4;
  children: React.ReactNode;
  className?: string;
}

function Grid({ cols = 2, children, className }: GridProps) {
  const colsClass =
    cols === 2 ? "grid-cols-2" : cols === 3 ? "grid-cols-3" : "grid-cols-4";
  return (
    <dl className={cn("grid gap-x-4 gap-y-2", colsClass, className)}>
      {children}
    </dl>
  );
}

// ─── Item List ───────────────────────────────────────────────────────────────

interface ItemRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

function ItemRow({ children, className, onClick }: ItemRowProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm",
        onClick && "cursor-pointer hover:bg-slate-100 transition-colors",
        className,
      )}
    >
      {children}
    </div>
  );
}

// ─── Stat ────────────────────────────────────────────────────────────────────

interface StatProps {
  label: string;
  value: React.ReactNode;
  color?: string;
  className?: string;
}

function Stat({ label, value, color, className }: StatProps) {
  return (
    <div className={cn("rounded-xl bg-slate-50 p-3 text-center", className)}>
      <p className="text-xs text-slate-400 font-medium">{label}</p>
      <p className={cn("text-lg font-bold mt-0.5", color || "text-slate-800")}>
        {value}
      </p>
    </div>
  );
}

// ─── Export ──────────────────────────────────────────────────────────────────

export const DetailPanel = Object.assign(DetailPanelRoot, {
  Section,
  Field,
  Grid,
  ItemRow,
  Stat,
});
