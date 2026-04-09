'use client';

import { cn } from '@/lib/cn';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'orange' | 'gray';

interface BadgeProps {
  variant?: BadgeVariant;
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-primary-100 text-primary-700 border-primary-200',
  success: 'bg-success-50 text-success-700 border-success-100',
  warning: 'bg-warning-50 text-warning-700 border-warning-100',
  danger: 'bg-danger-50 text-danger-600 border-danger-100',
  info: 'bg-blue-50 text-blue-700 border-blue-100',
  purple: 'bg-purple-50 text-purple-700 border-purple-100',
  orange: 'bg-orange-50 text-orange-700 border-orange-100',
  gray: 'bg-slate-100 text-slate-600 border-slate-200',
};

const dotStyles: Record<BadgeVariant, string> = {
  default: 'bg-primary-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  danger: 'bg-danger-500',
  info: 'bg-blue-500',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
  gray: 'bg-slate-400',
};

export function Badge({ variant = 'default', dot = false, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'badge border',
        variantStyles[variant],
        className,
      )}
    >
      {dot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', dotStyles[variant])}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}

/* Convenience exports for known status maps */
export function VehicleStatusBadge({ status }: { status: string }) {
  const map: Record<string, { variant: BadgeVariant; label: string }> = {
    ACTIVE: { variant: 'success', label: 'Ativo' },
    MAINTENANCE: { variant: 'warning', label: 'Manutenção' },
    INACTIVE: { variant: 'gray', label: 'Inativo' },
  };
  const config = map[status] ?? { variant: 'gray', label: status };
  return <Badge variant={config.variant} dot>{config.label}</Badge>;
}

export function DriverStatusBadge({ status }: { status: string }) {
  const map: Record<string, { variant: BadgeVariant; label: string }> = {
    ACTIVE: { variant: 'success', label: 'Ativo' },
    INACTIVE: { variant: 'gray', label: 'Inativo' },
    SUSPENDED: { variant: 'danger', label: 'Suspenso' },
    ON_LEAVE: { variant: 'info', label: 'Licença' },
  };
  const config = map[status] ?? { variant: 'gray', label: status };
  return <Badge variant={config.variant} dot>{config.label}</Badge>;
}

export function RouteStatusBadge({ status }: { status: string }) {
  const map: Record<string, { variant: BadgeVariant; label: string }> = {
    DRAFT: { variant: 'gray', label: 'Rascunho' },
    SCHEDULED: { variant: 'info', label: 'Agendada' },
    IN_PROGRESS: { variant: 'warning', label: 'Em Andamento' },
    COMPLETED: { variant: 'success', label: 'Concluída' },
    CANCELLED: { variant: 'danger', label: 'Cancelada' },
  };
  const config = map[status] ?? { variant: 'gray', label: status };
  return <Badge variant={config.variant} dot>{config.label}</Badge>;
}

export function LicenseCategoryBadge({ category }: { category: string }) {
  const map: Record<string, BadgeVariant> = {
    A: 'purple',
    B: 'info',
    C: 'warning',
    D: 'orange',
    E: 'danger',
    AB: 'purple',
  };
  return (
    <Badge variant={map[category] ?? 'gray'} className="font-mono font-bold">
      {category}
    </Badge>
  );
}
