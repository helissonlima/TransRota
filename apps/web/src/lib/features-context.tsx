'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import api from '@/lib/api';

interface FeaturesContextValue {
  features: string[];
  hasFeature: (key: string) => boolean;
  isLoaded: boolean;
}

const FeaturesContext = createContext<FeaturesContextValue>({
  features: [],
  hasFeature: () => true,
  isLoaded: false,
});

export function FeaturesProvider({ children }: { children: ReactNode }) {
  const [features, setFeatures] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    api
      .get('/auth/tenant-config')
      .then((r) => setFeatures(r.data.features ?? []))
      .catch(() => setFeatures([]))
      .finally(() => setIsLoaded(true));
  }, []);

  const hasFeature = (key: string) => {
    if (!isLoaded || features.length === 0) return true; // fail-open: mostra tudo até carregar
    return features.includes(key);
  };

  return (
    <FeaturesContext.Provider value={{ features, hasFeature, isLoaded }}>
      {children}
    </FeaturesContext.Provider>
  );
}

export const useFeatures = () => useContext(FeaturesContext);
