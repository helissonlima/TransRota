"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowLeft,
  Edit2,
  Trash2,
  MoreVertical,
  GripVertical,
} from "lucide-react";
import { cn } from "@/lib/cn";

// ============================================================================
// DETAIL PANEL — Sistema global de visualização de detalhes
//
// Uso: Qualquer página que precisa mostrar detalhes de um item selecionado
// pode usar este componente. Ele renderiza um painel lateral elegante com
// animação slide-in que substitui modais e side drawers inconsistentes.
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

const defaultWidths: Record<string, number> = {
  md: 512,
  lg: 672,
  xl: 768,
  full: typeof window !== "undefined" ? window.innerWidth * 0.85 : 1200,
};

const MIN_PANEL_WIDTH = 360;
const MAX_PANEL_RATIO = 0.92; // max 92% of viewport

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

// ─── Main Panel ──────────────────────────────────────────────────────────────

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

  // ── Resize logic ──────────────────────────────────────────────────────
  const getDefaultWidth = useCallback(() => {
    if (width === "full")
      return Math.min(window.innerWidth * 0.85, window.innerWidth - 40);
    return defaultWidths[width] ?? 672;
  }, [width]);

  const [panelWidth, setPanelWidth] = useState<number>(() =>
    typeof window !== "undefined" ? getDefaultWidth() : 672,
  );
  const isResizing = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  // Reset width when width prop changes or panel opens
  useEffect(() => {
    if (open) setPanelWidth(getDefaultWidth());
  }, [open, width, getDefaultWidth]);

  const handleResizeStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      isResizing.current = true;
      startWidth.current = panelWidth;
      startX.current = "touches" in e ? e.touches[0].clientX : e.clientX;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      const handleMove = (ev: MouseEvent | TouchEvent) => {
        if (!isResizing.current) return;
        const currentX = "touches" in ev ? ev.touches[0].clientX : ev.clientX;
        const delta = startX.current - currentX; // dragging left = wider
        const maxW = window.innerWidth * MAX_PANEL_RATIO;
        const newWidth = Math.max(
          MIN_PANEL_WIDTH,
          Math.min(maxW, startWidth.current + delta),
        );
        setPanelWidth(newWidth);
      };

      const handleEnd = () => {
        isResizing.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseup", handleEnd);
        window.removeEventListener("touchmove", handleMove);
        window.removeEventListener("touchend", handleEnd);
      };

      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleEnd);
      window.addEventListener("touchmove", handleMove);
      window.addEventListener("touchend", handleEnd);
    },
    [panelWidth],
  );

  // Double-click resize handle to toggle between default and full
  const handleDoubleClick = useCallback(() => {
    const def = getDefaultWidth();
    const full = window.innerWidth * 0.85;
    setPanelWidth((prev) => (prev < full * 0.9 ? full : def));
  }, [getDefaultWidth]);

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
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            style={{ width: panelWidth }}
            className={cn(
              "fixed right-0 top-0 z-50 h-full bg-white shadow-2xl flex flex-col",
              className,
            )}
          >
            {/* Resize handle */}
            <div
              onMouseDown={handleResizeStart}
              onTouchStart={handleResizeStart}
              onDoubleClick={handleDoubleClick}
              className="absolute left-0 top-0 bottom-0 w-2 z-[60] cursor-col-resize group flex items-center"
              title="Arraste para redimensionar • Clique duplo para expandir"
            >
              {/* Visual indicator */}
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-transparent group-hover:bg-primary-400 group-active:bg-primary-500 transition-colors" />
              {/* Grip icon centered */}
              <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-white border border-slate-200 rounded-md shadow-sm p-0.5">
                  <GripVertical className="h-4 w-3 text-slate-400" />
                </div>
              </div>
            </div>
            {/* Header */}
            <div className="flex-shrink-0 border-b border-slate-200 bg-white">
              <div className="flex items-start justify-between p-5">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <button
                    onClick={onClose}
                    className="mt-0.5 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors flex-shrink-0"
                    aria-label="Fechar"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-bold text-slate-900 truncate">
                      {title}
                    </h2>
                    {subtitle && (
                      <p className="text-sm text-slate-500 mt-0.5 truncate">
                        {subtitle}
                      </p>
                    )}
                    {badges && badges.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {badges.map((badge, i) => (
                          <span
                            key={i}
                            className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold",
                              badgeVariantStyles[badge.variant || "default"],
                            )}
                          >
                            {badge.label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0 ml-3">
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
                  <button
                    onClick={onClose}
                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                    aria-label="Fechar"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Body (scrollable) */}
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
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
