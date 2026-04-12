'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { isAuthenticated } from '@/lib/auth';
import { isAdminAuthenticated } from '@/lib/admin-api';
import { cn } from '@/lib/cn';
import { FeaturesProvider } from '@/lib/features-context';

type ShellVariant = 'app' | 'admin';

interface ProtectedShellProps {
  children: React.ReactNode;
  variant: ShellVariant;
}

export function ProtectedShell({ children, variant }: ProtectedShellProps) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const authenticated = variant === 'app' ? isAuthenticated() : isAdminAuthenticated();
    if (!authenticated) {
      router.replace(variant === 'app' ? '/login' : '/admin/login');
      return;
    }

    setIsReady(true);
  }, [router, variant]);

  if (!isReady) {
    return (
      <div className={cn('min-h-screen flex items-center justify-center', variant === 'app' ? 'bg-dot-grid' : 'bg-gray-950')}>
        <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={cn('flex h-screen overflow-hidden', variant === 'app' ? 'bg-dot-grid' : 'bg-gray-950')}>
      {variant === 'app' ? (
        <FeaturesProvider>
          <Sidebar />
          <main className="flex-1 min-w-0 h-screen overflow-y-auto overflow-x-hidden scrollbar-thin">
            {children}
          </main>
        </FeaturesProvider>
      ) : (
        <>
          <AdminSidebar />
          <main className="flex-1 min-w-0 h-screen overflow-y-auto overflow-x-hidden bg-gray-950">
            {children}
          </main>
        </>
      )}
    </div>
  );
}