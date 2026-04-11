'use client';

import { ProtectedShell } from '@/components/layout/protected-shell';

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedShell variant="admin">{children}</ProtectedShell>;
}
