"use client";

import { LayoutGrid, List, Table2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export type ViewMode = "grid" | "list";

export type ToggleOption<T extends string> = {
  key: T;
  label: string;
  icon: LucideIcon;
};

export const VIEW_TOGGLE_PRESETS = {
  gridList: [
    { key: "grid", icon: LayoutGrid, label: "Grade" },
    { key: "list", icon: List, label: "Lista" },
  ] as const,
  cardsList: [
    { key: "cards", icon: LayoutGrid, label: "Cards" },
    { key: "list", icon: List, label: "Lista" },
  ] as const,
  listCards: [
    { key: "list", icon: List, label: "Lista" },
    { key: "cards", icon: LayoutGrid, label: "Cards" },
  ] as const,
  tableCards: [
    { key: "table", icon: Table2, label: "Tabela" },
    { key: "cards", icon: LayoutGrid, label: "Cards" },
  ] as const,
};

interface ViewModeToggleProps<T extends string> {
  mode: T;
  onChange: (mode: T) => void;
  options: readonly ToggleOption<T>[];
  className?: string;
}

export function ViewModeToggle<T extends string>({
  mode,
  onChange,
  options,
  className,
}: ViewModeToggleProps<T>) {
  return (
    <div
      className={cn(
        "flex items-center rounded-lg border border-brand-border bg-white p-1",
        className,
      )}
    >
      {options.map((opt) => {
        const Icon = opt.icon;
        const active = mode === opt.key;

        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => onChange(opt.key)}
            title={opt.label}
            aria-label={`Mudar visualizacao para ${opt.label}`}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
              active
                ? "bg-slate-900 text-white"
                : "text-brand-text-secondary hover:bg-slate-100",
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

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
      <ViewModeToggle
        mode={mode}
        onChange={onChange}
        options={VIEW_TOGGLE_PRESETS.gridList}
        className="border-0 bg-transparent p-0"
      />
    </div>
  );
}
