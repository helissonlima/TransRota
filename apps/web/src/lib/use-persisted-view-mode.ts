"use client";

import { useEffect, useRef, useState } from "react";

type PersistedViewModeOptions<T extends string> = {
  defaultMode: T;
  allowedModes: readonly T[];
  storageKeyBase: string;
  legacyKeyBases?: readonly string[];
  tenantScoped?: boolean;
};

function resolveStorageKey(base: string, tenantScoped: boolean): string {
  if (!tenantScoped || typeof window === "undefined") return base;
  const tenantId = localStorage.getItem("tenantId") ?? "";
  return tenantId ? `${base}:${tenantId}` : base;
}

export function usePersistedViewMode<T extends string>({
  defaultMode,
  allowedModes,
  storageKeyBase,
  legacyKeyBases = [],
  tenantScoped = true,
}: PersistedViewModeOptions<T>) {
  const [mode, setMode] = useState<T>(defaultMode);

  // Usar ref para evitar que arrays literais inline causem re-render infinito
  const validModesRef = useRef(new Set<string>(allowedModes));

  useEffect(() => {
    if (typeof window === "undefined") return;

    const primaryKey = resolveStorageKey(storageKeyBase, tenantScoped);
    const legacyKeys = (legacyKeyBases ?? []).map((base) =>
      resolveStorageKey(base, tenantScoped),
    );

    const candidates = [
      localStorage.getItem(primaryKey),
      ...legacyKeys.map((key) => localStorage.getItem(key)),
    ].filter(Boolean) as string[];

    const saved = candidates.find((value) => validModesRef.current.has(value));
    if (saved) {
      setMode(saved as T);
      localStorage.setItem(primaryKey, saved);
      return;
    }

    localStorage.setItem(primaryKey, defaultMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKeyBase, tenantScoped]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const primaryKey = resolveStorageKey(storageKeyBase, tenantScoped);
    localStorage.setItem(primaryKey, mode);
  }, [mode, storageKeyBase, tenantScoped]);

  return [mode, setMode] as const;
}
