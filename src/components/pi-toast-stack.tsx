'use client';

import type { FC, PropsWithChildren } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';
import type { PiToastMessage } from '../types/lumina';

interface PiToastContextValue {
  readonly toasts: readonly PiToastMessage[];
  readonly pushToast: (toast: Omit<PiToastMessage, 'id'>) => string;
  readonly removeToast: (id: string) => void;
}

const PiToastContext = createContext<PiToastContextValue | null>(null);

/**
 * Hook for interacting with the Pi toast queue.
 */
export const usePiToast = (): PiToastContextValue => {
  const context = useContext(PiToastContext);
  if (!context) {
    throw new Error('usePiToast must be used within PiToastProvider.');
  }
  return context;
};

/**
 * Provider for non-blocking toast notifications.
 */
export const PiToastProvider: FC<PropsWithChildren> = ({ children }) => {
  const [toasts, setToasts] = useState<readonly PiToastMessage[]>([]);

  const value = useMemo<PiToastContextValue>(
    () => ({
      toasts,
      pushToast: (toast) => {
        const id = crypto.randomUUID();
        const payload: PiToastMessage = { id, durationMs: 3000, tone: 'info', ...toast };
        setToasts((prev) => [payload, ...prev]);
        window.setTimeout(() => {
          setToasts((prev) => prev.filter((item) => item.id !== id));
        }, payload.durationMs);
        return id;
      },
      removeToast: (id) => {
        setToasts((prev) => prev.filter((item) => item.id !== id));
      }
    }),
    [toasts]
  );

  return <PiToastContext.Provider value={value}>{children}</PiToastContext.Provider>;
};

/**
 * Renders stacked toast notifications near top safe area.
 */
export const PiToastViewport: FC<{ readonly className?: string }> = ({ className }) => {
  const { toasts, removeToast } = usePiToast();

  return (
    <div
      className={className}
      aria-live="polite"
      style={{
        position: 'fixed',
        top: 'max(env(safe-area-inset-top), 8px)',
        left: 8,
        right: 8,
        zIndex: 1300,
        display: 'grid',
        gap: 8,
        pointerEvents: 'none'
      }}
    >
      {toasts.map((toast) => (
        <button
          key={toast.id}
          type="button"
          onClick={() => removeToast(toast.id)}
          style={{
            textAlign: 'left',
            pointerEvents: 'auto',
            border: '1px solid rgba(255,255,255,0.18)',
            borderRadius: 12,
            background: 'rgba(12,12,18,0.94)',
            color: '#F5F5F7',
            padding: '10px 12px'
          }}
        >
          <strong style={{ display: 'block' }}>{toast.title}</strong>
          {toast.description ? <span style={{ opacity: 0.85 }}>{toast.description}</span> : null}
        </button>
      ))}
    </div>
  );
};
