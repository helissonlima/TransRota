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
  const legacySignature = legacyKeyBases.join("|");

  // Usar ref para evitar que arrays literais inline causem re-render infinito
  const validModesRef = useRef(new Set<string>(allowedModes));
  const storageKeysRef = useRef<{
    primaryKey: string;
    legacyKeys: string[];
  } | null>(null);

  useEffect(() => {
    validModesRef.current = new Set<string>(allowedModes);
  }, [allowedModes]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    storageKeysRef.current = {
      primaryKey: resolveStorageKey(storageKeyBase, tenantScoped),
      legacyKeys: (legacyKeyBases ?? []).map((base) =>
        resolveStorageKey(base, tenantScoped),
      ),
    };

    const { primaryKey, legacyKeys } = storageKeysRef.current;

    const candidates = [
      localStorage.getItem(primaryKey),
      ...legacyKeys.map((key) => localStorage.getItem(key)),
    ].filter(Boolean) as string[];

    const saved = candidates.find((value) => validModesRef.current.has(value));
    if (saved) {
      setMode((current) => (current === saved ? current : (saved as T)));
      localStorage.setItem(primaryKey, saved);
      return;
    }

    localStorage.setItem(primaryKey, defaultMode);
    setMode((current) =>
      current === defaultMode ? current : (defaultMode as T),
    );
  }, [defaultMode, legacySignature, storageKeyBase, tenantScoped]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const primaryKey =
      storageKeysRef.current?.primaryKey ??
      resolveStorageKey(storageKeyBase, tenantScoped);
    localStorage.setItem(primaryKey, mode);
  }, [mode, storageKeyBase, tenantScoped]);

  return [mode, setMode] as const;
}
