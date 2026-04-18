import { cn } from "@/lib/cn";

export type UxCardTone = "default" | "danger";

export function uxSelectableCardClass({
  selected,
  tone = "default",
}: {
  selected?: boolean;
  tone?: UxCardTone;
} = {}) {
  return cn(
    "text-left rounded-2xl border bg-white p-4 shadow-card transition-all hover:shadow-card-hover",
    selected
      ? "ring-2 ring-primary-200 border-primary-400"
      : "border-brand-border",
    tone === "danger" && "bg-danger-50/20 border-danger-200",
  );
}

export const UX_CARD_SECTION = {
  header: "flex items-start justify-between gap-3",
  infoStack: "mt-3 space-y-1.5",
  metaGrid: "mt-3 grid grid-cols-2 gap-2 text-xs",
  footer:
    "mt-3 pt-3 border-t border-brand-border flex items-center justify-between",
  metricMuted: "bg-slate-50 rounded-lg p-2",
  metricMutedCompact: "bg-slate-50 rounded-lg px-2.5 py-2",
  metricPrimary: "bg-primary-50 rounded-lg px-2.5 py-2",
  metricSubtle: "bg-slate-100 rounded-lg px-2.5 py-2",
} as const;
