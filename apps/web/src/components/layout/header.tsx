'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Search,
  ChevronRight,
  LogOut,
  Settings,
  User,
  X,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { logout } from '@/lib/auth';
import { cn } from '@/lib/cn';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface HeaderProps {
  title: string;
  breadcrumbs?: Breadcrumb[];
  notificationCount?: number;
  notifications?: Notification[];
}

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info';
  title: string;
  description: string;
  time: string;
}

const notifIcons = {
  success: { icon: CheckCircle2, color: 'text-success-500', bg: 'bg-success-50' },
  warning: { icon: AlertTriangle, color: 'text-warning-500', bg: 'bg-warning-50' },
  info: { icon: Info, color: 'text-primary-500', bg: 'bg-primary-50' },
};

export function Header({ title, breadcrumbs, notificationCount, notifications = [] }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const [userName, setUserName] = useState('Usuário');
  useEffect(() => {
    setUserName(localStorage.getItem('userName') ?? 'Usuário');
  }, []);
  const initials = userName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  const unreadCount = notificationCount ?? notifications.length;

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Cmd+K shortcut
  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchRef.current?.focus(), 50);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setNotifOpen(false);
        setUserOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, []);

  return (
    <header className="sticky top-0 z-10 h-16 bg-white/90 backdrop-blur-md border-b border-brand-border flex items-center justify-between px-6 gap-4">
      {/* Left: title + breadcrumbs */}
      <div className="flex items-center gap-2 min-w-0">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav className="flex items-center gap-1 text-sm min-w-0" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, idx) => (
              <span key={idx} className="flex items-center gap-1 min-w-0">
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-brand-text-secondary flex-shrink-0" />}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="text-brand-text-secondary hover:text-brand-text-primary transition-colors truncate"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-semibold text-brand-text-primary truncate">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        ) : (
          <h1 className="text-lg font-semibold text-brand-text-primary truncate">{title}</h1>
        )}
      </div>

      {/* Right: search + notifications + user */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Search */}
        <div className="relative">
          <AnimatePresence>
            {searchOpen ? (
              <motion.div
                initial={{ width: 40, opacity: 0 }}
                animate={{ width: 240, opacity: 1 }}
                exit={{ width: 40, opacity: 0 }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className="flex items-center"
              >
                <Search className="absolute left-3 w-4 h-4 text-brand-text-secondary pointer-events-none" />
                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar..."
                  className="w-full h-9 pl-9 pr-8 bg-slate-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition-all"
                />
                <button
                  onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                  className="absolute right-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ) : (
              <button
                onClick={() => { setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 50); }}
                className="h-9 px-3 flex items-center gap-2 text-sm text-brand-text-secondary hover:text-brand-text-primary bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <Search className="w-4 h-4" />
                <span className="hidden md:inline text-xs">Buscar</span>
              </button>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setNotifOpen((o) => !o); setUserOpen(false); }}
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

        {/* User dropdown */}
        <div ref={userRef} className="relative">
          <button
            onClick={() => { setUserOpen((o) => !o); setNotifOpen(false); }}
            className="flex items-center gap-2 h-9 px-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Menu do usuário"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-brand flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
            <span className="hidden md:block text-sm font-medium text-brand-text-primary max-w-[120px] truncate">
              {userName}
            </span>
          </button>

          <AnimatePresence>
            {userOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-modal border border-brand-border overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-brand-border">
                  <p className="text-sm font-semibold text-brand-text-primary truncate">{userName}</p>
                  <p className="text-xs text-brand-text-secondary">Administrador</p>
                </div>
                <div className="py-1">
                  {[
                    { icon: User, label: 'Meu Perfil', href: '/profile' },
                    { icon: Settings, label: 'Configurações', href: '/settings' },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-text-secondary hover:bg-slate-50 hover:text-brand-text-primary transition-colors"
                      onClick={() => setUserOpen(false)}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  ))}
                </div>
                <div className="py-1 border-t border-brand-border">
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-danger-600 hover:bg-danger-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair
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
