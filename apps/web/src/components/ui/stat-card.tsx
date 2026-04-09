'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Skeleton } from './skeleton';

type IconColor = 'blue' | 'emerald' | 'violet' | 'orange' | 'rose' | 'amber' | 'cyan';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ElementType;
  iconColor?: IconColor;
  trend?: { value: number; label?: string };
  glass?: boolean;
  loading?: boolean;
  delay?: number;
  prefix?: string;
  suffix?: string;
  formatter?: (v: number) => string;
}

const iconBg: Record<IconColor, string> = {
  blue: 'bg-blue-500/10 text-blue-600',
  emerald: 'bg-emerald-500/10 text-emerald-600',
  violet: 'bg-violet-500/10 text-violet-600',
  orange: 'bg-orange-500/10 text-orange-600',
  rose: 'bg-rose-500/10 text-rose-600',
  amber: 'bg-amber-500/10 text-amber-600',
  cyan: 'bg-cyan-500/10 text-cyan-600',
};

function useCountUp(target: number, duration = 1200, start = false) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!start || target === 0) {
      setCount(target);
      return;
    }
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setCount(target);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, start]);

  return count;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'blue',
  trend,
  glass = false,
  loading = false,
  delay = 0,
  prefix = '',
  suffix = '',
  formatter,
}: StatCardProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const numericValue = typeof value === 'number' ? value : parseFloat(String(value)) || 0;
  const isNumeric = typeof value === 'number';
  const displayCount = useCountUp(numericValue, 1000, hasStarted && isNumeric);

  const displayValue = isNumeric
    ? `${prefix}${formatter ? formatter(displayCount) : displayCount.toLocaleString('pt-BR')}${suffix}`
    : String(value);

  if (loading) {
    return (
      <div className={cn('card p-5', glass && 'glass')}>
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="w-10 h-10 rounded-xl" />
        </div>
        <Skeleton className="h-9 w-20 mb-2" />
        <Skeleton className="h-3 w-24" />
      </div>
    );
  }

  return (
    <motion.div
      className={cn(
        'card-lift cursor-default select-none',
        'bg-white rounded-2xl border border-brand-border p-5',
        'shadow-card',
        glass && 'glass',
      )}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.08, ease: 'easeOut' }}
      whileHover={{ y: -2, boxShadow: '0 10px 25px -3px rgba(0,0,0,0.1)' }}
      onViewportEnter={() => setHasStarted(true)}
      viewport={{ once: true }}
    >
      {/* Top row */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-brand-text-secondary">{title}</span>
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', iconBg[iconColor])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {/* Value */}
      <div className="stat-number mb-1">{displayValue}</div>

      {/* Bottom */}
      <div className="flex items-center gap-2 mt-2">
        {trend !== undefined && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-md',
              trend.value >= 0
                ? 'bg-success-50 text-success-700'
                : 'bg-danger-50 text-danger-600',
            )}
          >
            {trend.value >= 0 ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {Math.abs(trend.value)}%
          </span>
        )}
        {subtitle && (
          <span className="text-xs text-brand-text-secondary">{subtitle}</span>
        )}
      </div>
    </motion.div>
  );
}
