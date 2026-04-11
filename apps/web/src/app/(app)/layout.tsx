'use client';

import { ProtectedShell } from '@/components/layout/protected-shell';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedShell variant="app">{children}</ProtectedShell>;
}
