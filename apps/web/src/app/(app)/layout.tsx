'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { Sidebar } from '@/components/layout/sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="flex min-h-screen bg-dot-grid">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-auto scrollbar-thin">
        {children}
      </main>
    </div>
  );
}
