'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Truck,
  Users,
  MapPin,
  ClipboardList,
  BarChart2,
  LogOut,
  Settings,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Route,
  CalendarDays,
  Receipt,
  Cpu,
  Wallet,
} from 'lucide-react';
import { logout } from '@/lib/auth';
import { cn } from '@/lib/cn';
import { useFeatures } from '@/lib/features-context';
import { Package } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
  feature?: string; // chave do feature flag (undefined = sempre visível)
}

const navGroups: { label?: string; items: NavItem[] }[] = [
  {
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Operações',
    items: [
      { label: 'Frota', href: '/fleet', icon: Truck, feature: 'fleet' },
      { label: 'Motoristas', href: '/drivers', icon: Users, feature: 'drivers' },
      { label: 'Rotas', href: '/routes', icon: MapPin, feature: 'routes' },
      { label: 'Checklists', href: '/checklists', icon: ClipboardList, feature: 'checklists' },
      { label: 'KM Diário', href: '/daily-km', icon: Route, feature: 'daily_km' },
      { label: 'Agendamento', href: '/bookings', icon: CalendarDays, feature: 'bookings' },
    ],
  },
  {
    label: 'Financeiro',
    items: [
      { label: 'Financeiro', href: '/financial', icon: Wallet, feature: 'financial' },
      { label: 'Fiscal / Taxas', href: '/fiscal', icon: Receipt, feature: 'fiscal' },
    ],
  },
  {
    label: 'Estoque',
    items: [
      { label: 'Produtos', href: '/products', icon: Package, feature: 'products' },
      { label: 'Equipamentos', href: '/equipment', icon: Cpu, feature: 'equipment' },
    ],
  },
  {
    label: 'Análise',
    items: [
      { label: 'Relatórios', href: '/reports', icon: BarChart2, feature: 'reports' },
    ],
  },
  {
    items: [
      { label: 'Configurações', href: '/settings', icon: Settings },
    ],
  },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ collapsed: externalCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const { hasFeature } = useFeatures();

  const collapsed = externalCollapsed ?? internalCollapsed;
  const toggle = onToggle ?? (() => setInternalCollapsed((c) => !c));

  const [userName, setUserName] = useState('Usuário');
  useEffect(() => {
    setUserName(localStorage.getItem('userName') ?? 'Usuário');
  }, []);
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.aside
      className={cn(
        'relative flex flex-col h-screen bg-sidebar shadow-sidebar z-20',
        'transition-none',
      )}
      animate={{ width: collapsed ? 68 : 260 }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      style={{ flexShrink: 0 }}
    >
      {/* Toggle button */}
      <button
        onClick={toggle}
        className={cn(
          'absolute -right-3 top-20 z-30 w-6 h-6 rounded-full',
          'bg-primary-600 text-white shadow-glow-sm',
          'flex items-center justify-center',
          'hover:bg-primary-700 transition-colors',
          'border-2 border-sidebar',
        )}
        aria-label={collapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Logo */}
      <div
        className={cn(
          'flex items-center gap-3 px-4 border-b border-white/5',
          collapsed ? 'justify-center py-4' : 'py-5',
        )}
      >
        <div className="relative flex-shrink-0 w-9 h-9 bg-gradient-brand rounded-xl flex items-center justify-center shadow-glow-sm">
          <Truck className="w-5 h-5 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col leading-tight">
                <span className="text-white font-bold text-base tracking-tight whitespace-nowrap">
                  TransRota
                </span>
                <span className="text-sidebar-text text-2xs whitespace-nowrap">
                  Gestão de Frota
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 scrollbar-dark overflow-y-auto">
        {navGroups.map((group, groupIdx) => {
          const visibleGroupItems = group.items.filter(item => !item.feature || hasFeature(item.feature));
          if (visibleGroupItems.length === 0) return null;

          return (
            <div key={groupIdx} className={groupIdx > 0 ? 'mt-3' : ''}>
              {/* Category label */}
              {group.label && !collapsed && (
                <div className="px-3 pb-1.5">
                  <span className="text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-sidebar-text/50">
                    {group.label}
                  </span>
                </div>
              )}
              <div className="space-y-0.5">
                {visibleGroupItems.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href || pathname.startsWith(item.href + '/');

                  return (
                    <Link key={item.href} href={item.href} className="block">
                      <div
                        className={cn(
                          'relative flex items-center gap-3 rounded-xl transition-all duration-200',
                          collapsed ? 'justify-center px-0 py-3' : 'px-3 py-2.5',
                          active
                            ? 'bg-primary-600/20 sidebar-glow'
                            : 'hover:bg-sidebar-hover text-sidebar-text hover:text-white',
                        )}
                        title={collapsed ? item.label : undefined}
                      >
                        {/* Active indicator */}
                        {active && (
                          <motion.div
                            className="absolute left-1 top-1.5 bottom-1.5 w-0.5 bg-primary-400 rounded-r-full shadow-glow-sm"
                            layoutId="sidebar-active"
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                          />
                        )}

                        <Icon
                          className={cn(
                            'w-5 h-5 flex-shrink-0 transition-colors',
                            active ? 'text-primary-400' : 'text-sidebar-text',
                            collapsed && 'mx-auto',
                          )}
                        />

                        <AnimatePresence>
                          {!collapsed && (
                            <motion.span
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: 'auto' }}
                              exit={{ opacity: 0, width: 0 }}
                              transition={{ duration: 0.15 }}
                              className={cn(
                                'text-sm font-medium whitespace-nowrap overflow-hidden flex-1',
                                active ? 'text-white' : 'text-sidebar-text',
                              )}
                            >
                              {item.label}
                            </motion.span>
                          )}
                        </AnimatePresence>

                        {/* Badge */}
                        {!collapsed && item.badge !== undefined && item.badge > 0 && (
                          <span className="flex-shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-accent-500 text-white text-[0.6rem] font-bold flex items-center justify-center">
                            {item.badge > 99 ? '99+' : item.badge}
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* User section */}
      <div className={cn('px-2 pb-4 pt-2 border-t border-white/5')}>
        {/* Logout */}
        <button
          onClick={logout}
          className={cn(
            'flex items-center gap-3 rounded-xl transition-all duration-200 w-full',
            'text-sidebar-text hover:bg-sidebar-hover hover:text-white',
            collapsed ? 'justify-center px-0 py-3' : 'px-3 py-2.5',
          )}
          title={collapsed ? 'Sair' : undefined}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                className="text-sm font-medium whitespace-nowrap overflow-hidden"
              >
                Sair
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* User avatar */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 px-3 py-2.5 rounded-xl bg-white/5 flex items-center gap-3 overflow-hidden"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-white truncate">{userName}</div>
                <div className="text-2xs text-sidebar-text truncate">Administrador</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {collapsed && (
          <div className="mt-3 flex justify-center">
            <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
