import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import type { PiViewportInsets, PiViewportLockMetrics } from '../types/lumina';

const DEFAULT_INSETS: PiViewportInsets = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  keyboardOffset: 0
};

const getViewportMetrics = (): PiViewportLockMetrics => {
  const viewport = window.visualViewport;
  const viewportWidth = viewport?.width ?? window.innerWidth;
  const viewportHeight = viewport?.height ?? window.innerHeight;
  const keyboardOffset = Math.max(0, window.innerHeight - viewportHeight - (viewport?.offsetTop ?? 0));

  const insets: PiViewportInsets = {
    ...DEFAULT_INSETS,
    top: Math.max(0, viewport?.offsetTop ?? 0),
    left: Math.max(0, viewport?.offsetLeft ?? 0),
    right: Math.max(0, window.innerWidth - viewportWidth - (viewport?.offsetLeft ?? 0)),
    bottom: keyboardOffset,
    keyboardOffset
  };

  return {
    viewportWidth,
    viewportHeight,
    insets,
    safeContentWidth: Math.max(0, viewportWidth - insets.left - insets.right),
    safeContentHeight: Math.max(0, viewportHeight - insets.top - insets.bottom)
  };
};

/**
 * Creates viewport lock metrics and updates them during viewport changes.
 */
export const createViewportLockEngine = (
  onChange: (metrics: PiViewportLockMetrics) => void
): (() => void) => {
  const update = (): void => onChange(getViewportMetrics());

  update();
  window.addEventListener('resize', update, { passive: true });
  window.visualViewport?.addEventListener('resize', update, { passive: true });
  window.visualViewport?.addEventListener('scroll', update, { passive: true });

  return () => {
    window.removeEventListener('resize', update);
    window.visualViewport?.removeEventListener('resize', update);
    window.visualViewport?.removeEventListener('scroll', update);
  };
};

/**
 * React hook for safe-area aware styles in Pi webview contexts.
 */
export const usePiViewportLock = (): {
  metrics: PiViewportLockMetrics | null;
  safePaddingStyle: CSSProperties;
} => {
  const [metrics, setMetrics] = useState<PiViewportLockMetrics | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const destroy = createViewportLockEngine(setMetrics);
    return destroy;
  }, []);

  const safePaddingStyle = useMemo<CSSProperties>(() => {
    if (!metrics) {
      return {};
    }

    return {
      paddingTop: `${metrics.insets.top}px`,
      paddingBottom: `${metrics.insets.bottom}px`,
      paddingLeft: `${metrics.insets.left}px`,
      paddingRight: `${metrics.insets.right}px`
    };
  }, [metrics]);

  return { metrics, safePaddingStyle };
};
