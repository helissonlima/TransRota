import { useEffect, useMemo, useState } from "react";

export interface BrandSettings {
  name: string;
  logoDataUrl: string | null;
}

const DEFAULT_BRANDING: BrandSettings = {
  name: "TransRota",
  logoDataUrl: null,
};

const BRANDING_EVENT = "transrota:branding-updated";

function buildBrandingStorageKey(tenantId?: string | null) {
  if (!tenantId) return "branding:global";
  return `branding:${tenantId}`;
}

export function getBrandSettings(tenantId?: string | null): BrandSettings {
  if (typeof window === "undefined") return DEFAULT_BRANDING;

  const key = buildBrandingStorageKey(tenantId);
  const raw = localStorage.getItem(key);

  if (!raw) return DEFAULT_BRANDING;

  try {
    const parsed = JSON.parse(raw) as Partial<BrandSettings>;
    return {
      name:
        (parsed.name ?? DEFAULT_BRANDING.name).trim() || DEFAULT_BRANDING.name,
      logoDataUrl: parsed.logoDataUrl ?? null,
    };
  } catch {
    return DEFAULT_BRANDING;
  }
}

export function saveBrandSettings(
  tenantId: string | null | undefined,
  settings: BrandSettings,
) {
  if (typeof window === "undefined") return;

  const key = buildBrandingStorageKey(tenantId);
  localStorage.setItem(key, JSON.stringify(settings));
  window.dispatchEvent(
    new CustomEvent(BRANDING_EVENT, {
      detail: { tenantId: tenantId ?? null },
    }),
  );
}

export function useBrandSettings(tenantId?: string | null) {
  const tenantKey = useMemo(() => tenantId ?? null, [tenantId]);
  const [settings, setSettings] = useState<BrandSettings>(DEFAULT_BRANDING);

  useEffect(() => {
    setSettings(getBrandSettings(tenantKey));
  }, [tenantKey]);

  useEffect(() => {
    function syncFromStorage(event: StorageEvent) {
      if (!event.key) return;
      if (event.key !== buildBrandingStorageKey(tenantKey)) return;
      setSettings(getBrandSettings(tenantKey));
    }

    function syncFromCustomEvent(event: Event) {
      const detail = (event as CustomEvent<{ tenantId: string | null }>).detail;
      if ((detail?.tenantId ?? null) !== tenantKey) return;
      setSettings(getBrandSettings(tenantKey));
    }

    window.addEventListener("storage", syncFromStorage);
    window.addEventListener(
      BRANDING_EVENT,
      syncFromCustomEvent as EventListener,
    );

    return () => {
      window.removeEventListener("storage", syncFromStorage);
      window.removeEventListener(
        BRANDING_EVENT,
        syncFromCustomEvent as EventListener,
      );
    };
  }, [tenantKey]);

  return settings;
}
