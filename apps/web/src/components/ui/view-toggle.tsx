"use client";

import { motion } from "framer-motion";
import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/cn";

export type ViewMode = "grid" | "list";

interface ViewToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export function ViewToggle({ mode, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center bg-white border border-brand-border rounded-xl p-1 gap-1">
      <span className="text-xs font-medium text-brand-text-secondary pl-2 pr-1">
        Visualização:
      </span>
      {[
        { key: "grid" as const, icon: LayoutGrid, label: "Grade" },
        { key: "list" as const, icon: List, label: "Lista" },
      ].map((opt) => (
        <button
          key={opt.key}
          onClick={() => onChange(opt.key)}
          title={opt.label}
          aria-label={`Mudar visualização para ${opt.label}`}
          className={cn(
            "relative px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1.5 text-sm font-medium",
            mode === opt.key
              ? "text-white"
              : "text-brand-text-secondary hover:text-brand-text-primary hover:bg-slate-50",
          )}
        >
          {mode === opt.key && (
            <motion.span
              layoutId="view-toggle-bg"
              className="absolute inset-0 bg-primary-600 rounded-lg shadow-sm"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <opt.icon className="w-4 h-4 relative z-10" />
          <span className="relative z-10">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}
