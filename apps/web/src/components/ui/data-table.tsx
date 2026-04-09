'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown, ChevronsUpDown, SearchX } from 'lucide-react';
import { cn } from '@/lib/cn';
import { SkeletonTableRows } from './skeleton';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  className?: string;
  headerClassName?: string;
  cell?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyIcon?: React.ElementType;
  emptyTitle?: string;
  emptyDescription?: string;
  rowKey?: (row: T) => string;
  onRowClick?: (row: T) => void;
  className?: string;
  stickyHeader?: boolean;
  skeletonRows?: number;
}

type SortDir = 'asc' | 'desc' | null;

function SortIcon({ dir }: { dir: SortDir }) {
  if (dir === 'asc') return <ChevronUp className="w-3.5 h-3.5" />;
  if (dir === 'desc') return <ChevronDown className="w-3.5 h-3.5" />;
  return <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />;
}

function getNestedValue<T>(obj: T, key: string): unknown {
  return key.split('.').reduce((acc: unknown, k) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[k];
    return undefined;
  }, obj);
}

export function DataTable<T>({
  columns,
  data,
  loading = false,
  emptyIcon: EmptyIcon = SearchX,
  emptyTitle = 'Nenhum resultado encontrado',
  emptyDescription = 'Tente ajustar os filtros para ver mais resultados.',
  rowKey,
  onRowClick,
  className,
  stickyHeader = true,
  skeletonRows = 5,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);

  function handleSort(col: Column<T>) {
    if (!col.sortable) return;
    const key = String(col.key);
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : d === 'desc' ? null : 'asc'));
      if (sortDir === 'desc') setSortKey(null);
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  const sorted = sortKey && sortDir
    ? [...data].sort((a, b) => {
        const va = getNestedValue(a, sortKey);
        const vb = getNestedValue(b, sortKey);
        const cmp = String(va ?? '').localeCompare(String(vb ?? ''), 'pt-BR', { numeric: true });
        return sortDir === 'asc' ? cmp : -cmp;
      })
    : data;

  return (
    <div className={cn('card overflow-hidden', className)}>
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead>
            <tr
              className={cn(
                'border-b border-brand-border bg-slate-50/80',
                stickyHeader && 'sticky top-0 z-10',
              )}
            >
              {columns.map((col) => {
                const key = String(col.key);
                const dir = sortKey === key ? sortDir : null;
                return (
                  <th
                    key={key}
                    className={cn(
                      'text-left px-4 py-3 text-xs font-semibold text-brand-text-secondary uppercase tracking-wide whitespace-nowrap',
                      col.sortable && 'cursor-pointer select-none hover:text-brand-text-primary',
                      col.headerClassName,
                    )}
                    onClick={() => handleSort(col)}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.header}
                      {col.sortable && <SortIcon dir={dir} />}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <SkeletonTableRows rows={skeletonRows} cols={columns.length} />
            ) : sorted.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <div className="flex flex-col items-center justify-center py-16 text-brand-text-secondary">
                    <EmptyIcon className="w-10 h-10 mb-3 opacity-30" />
                    <p className="font-medium text-sm">{emptyTitle}</p>
                    {emptyDescription && (
                      <p className="text-xs mt-1 opacity-70">{emptyDescription}</p>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              sorted.map((row, idx) => (
                <motion.tr
                  key={rowKey ? rowKey(row) : idx}
                  className={cn(
                    'border-b border-brand-border/40 transition-colors',
                    onRowClick
                      ? 'cursor-pointer hover:bg-primary-50/50'
                      : 'hover:bg-slate-50/70',
                  )}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.02 }}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => {
                    const key = String(col.key);
                    const rawValue = getNestedValue(row, key);
                    return (
                      <td
                        key={key}
                        className={cn('px-4 py-3 text-brand-text-primary', col.className)}
                      >
                        {col.cell ? col.cell(row) : String(rawValue ?? '—')}
                      </td>
                    );
                  })}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
