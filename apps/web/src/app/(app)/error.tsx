'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[AppError]', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-dot-grid">
      <div className="flex flex-col items-center gap-4 text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-danger-50 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-danger-500" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-brand-text-primary">
            Algo deu errado
          </h2>
          <p className="text-sm text-brand-text-secondary mt-1">
            {error.message || 'Ocorreu um erro inesperado.'}
          </p>
        </div>
        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
