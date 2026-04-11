'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Building2, Users, Settings, LogOut, Shield } from 'lucide-react';
import { adminLogout, getAdminUser } from '@/lib/admin-api';
import { cn } from '@/lib/cn';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/companies', label: 'Empresas', icon: Building2 },
  { href: '/admin/users', label: 'Usuários', icon: Users },
  { href: '/admin/settings', label: 'Configurações', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const user = getAdminUser();

  return (
    <aside className="w-60 flex-shrink-0 bg-[#0b1120] border-r border-[#1e2d4a] flex flex-col">
      <div className="h-16 flex items-center gap-3 px-5 border-b border-[#1e2d4a]">
        <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
          <Shield className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-white text-sm font-semibold leading-none">TransRota</p>
          <p className="text-[#64748b] text-[10px] mt-0.5">Super Admin</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
              pathname === href
                ? 'bg-primary-600/20 text-primary-400 font-medium'
                : 'text-[#94a3b8] hover:bg-[#1a2744] hover:text-white',
            )}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-[#1e2d4a]">
        <div className="px-3 py-2 mb-1">
          <p className="text-white text-sm font-medium truncate">{user?.name ?? 'Super Admin'}</p>
          <p className="text-[#64748b] text-xs truncate">{user?.email}</p>
        </div>
        <button
          onClick={adminLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#94a3b8] hover:bg-red-900/30 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}