'use client';

import { useState, useEffect, useRef, type ReactNode, type Dispatch, type SetStateAction } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Search,
  ChevronRight,
  X,
  CheckCircle2,
  AlertTriangle,
  Info,
  Pencil,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/cn';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info';
  title: string;
  description: string;
  time: string;
}

interface HeaderProps {
  title: string;
  breadcrumbs?: Breadcrumb[];
  notificationCount?: number;
  notifications?: Notification[];
  /** Controlled search value (page-scoped) */
  searchQuery?: string;
  onSearchQueryChange?: Dispatch<SetStateAction<string>>;
  searchPlaceholder?: string;
  /** Extra actions rendered after search (e.g. "Cadastrar Veículo" button) */
  actions?: ReactNode;
  /** Label of the currently selected item for edit/delete */
  selectedItemLabel?: string | null;
  onEditSelected?: () => void;
  onDeleteSelected?: () => void;
}

const notifIcons = {
  success: { icon: CheckCircle2, color: 'text-success-500', bg: 'bg-success-50' },
  warning: { icon: AlertTriangle, color: 'text-warning-500', bg: 'bg-warning-50' },
  info: { icon: Info, color: 'text-primary-500', bg: 'bg-primary-50' },
};

export function Header({
  title,
  breadcrumbs,
  notificationCount,
  notifications = [],
  searchQuery: controlledSearch,
  onSearchQueryChange,
  searchPlaceholder = 'Buscar...',
  actions,
  selectedItemLabel,
  onEditSelected,
  onDeleteSelected,
}: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [internalSearch, setInternalSearch] = useState('');
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const searchValue = controlledSearch ?? internalSearch;
  const setSearchValue = onSearchQueryChange ?? setInternalSearch;

  const unreadCount = notificationCount ?? notifications.length;
  const breadcrumbLinks = (breadcrumbs ?? []).filter((crumb) => !!crumb.href);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Cmd+K shortcut to focus search
  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setNotifOpen(false);
        searchRef.current?.blur();
      }
    }
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, []);

  return (
    <header className="sticky top-0 z-10 h-16 bg-white/90 backdrop-blur-md border-b border-brand-border grid grid-cols-[1fr_auto_1fr] items-center px-6 gap-4">
      {/* Left: title + breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        {breadcrumbLinks.length > 0 ? (
          <nav className="flex items-center gap-1.5 min-w-0" aria-label="Breadcrumb">
            {breadcrumbLinks.map((crumb, idx) => (
              <span key={idx} className="flex items-center gap-1.5 min-w-0">
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-brand-text-secondary flex-shrink-0" />}
                <Link
                  href={crumb.href as string}
                  className="text-sm text-brand-text-secondary hover:text-brand-text-primary transition-colors truncate"
                >
                  {crumb.label}
                </Link>
              </span>
            ))}
          </nav>
        ) : null}

        {/* Selected item actions */}
        <AnimatePresence>
          {selectedItemLabel && (onEditSelected || onDeleteSelected) && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="flex items-center gap-1.5 ml-2 pl-3 border-l border-brand-border"
            >
              <span className="text-sm text-brand-text-secondary mr-1 hidden md:inline">{selectedItemLabel}</span>
              {onEditSelected && (
                <button
                  onClick={onEditSelected}
                  className="h-8 w-8 flex items-center justify-center rounded-lg text-brand-text-secondary hover:text-primary-600 hover:bg-primary-50 transition-colors"
                  title="Editar"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}
              {onDeleteSelected && (
                <button
                  onClick={onDeleteSelected}
                  className="h-8 w-8 flex items-center justify-center rounded-lg text-brand-text-secondary hover:text-danger-600 hover:bg-danger-50 transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Center: always-visible page title */}
      <div className="min-w-0 max-w-[40vw]">
        <h1 className="text-xl font-bold text-brand-text-primary truncate text-center">{title}</h1>
      </div>

      {/* Right: actions + search + notifications */}
      <div className="flex items-center justify-end gap-2 flex-shrink-0">
        {/* Page actions (e.g. Cadastrar Veículo) */}
        {actions && <div className="flex items-center gap-2">{actions}</div>}

        {/* Search — always visible */}
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-brand-text-secondary pointer-events-none" />
          <input
            ref={searchRef}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-56 h-9 pl-9 pr-8 bg-slate-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition-all"
          />
          {searchValue && (
            <button
              onClick={() => setSearchValue('')}
              className="absolute right-2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative h-9 w-9 flex items-center justify-center rounded-lg text-brand-text-secondary hover:text-brand-text-primary hover:bg-slate-100 transition-colors"
            aria-label="Notificações"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full"
              />
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-modal border border-brand-border overflow-hidden z-50"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-brand-border">
                  <h3 className="font-semibold text-sm text-brand-text-primary">Notificações</h3>
                  <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-semibold">
                    {unreadCount} novas
                  </span>
                </div>
                <div className="divide-y divide-brand-border/50">
                  {notifications.length > 0 ? (
                    notifications.map((n) => {
                      const { icon: NIcon, color, bg } = notifIcons[n.type];
                      return (
                        <div key={n.id} className="flex gap-3 px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer">
                          <div className={cn('w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center', bg)}>
                            <NIcon className={cn('w-4 h-4', color)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-brand-text-primary leading-tight">{n.title}</p>
                            <p className="text-xs text-brand-text-secondary mt-0.5 line-clamp-2">{n.description}</p>
                          </div>
                          <span className="text-2xs text-brand-text-secondary flex-shrink-0 mt-1">{n.time}</span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="px-4 py-8 text-center text-sm text-brand-text-secondary">
                      Sem notificações no momento.
                    </div>
                  )}
                </div>
                <div className="px-4 py-2 border-t border-brand-border">
                  <button className="w-full text-xs text-primary-600 font-medium hover:text-primary-700 transition-colors py-1">
                    Ver todas as notificações
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
