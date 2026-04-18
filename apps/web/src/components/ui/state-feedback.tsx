import { type ReactNode } from "react";
import { type LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/cn";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyStateCard({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed border-brand-border bg-slate-50/60",
        className,
      )}
    >
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
        <Icon className="w-6 h-6 text-slate-400" />
      </div>
      <p className="text-sm font-semibold text-brand-text-primary text-center px-4">
        {title}
      </p>
      {description && (
        <p className="text-xs text-brand-text-secondary mt-1 text-center px-4">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

interface SkeletonRowsProps {
  rows?: number;
  rowClassName?: string;
  containerClassName?: string;
}

export function SkeletonRows({
  rows = 4,
  rowClassName = "h-12 w-full",
  containerClassName,
}: SkeletonRowsProps) {
  return (
    <div className={cn("space-y-3", containerClassName)}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className={rowClassName} />
      ))}
    </div>
  );
}
