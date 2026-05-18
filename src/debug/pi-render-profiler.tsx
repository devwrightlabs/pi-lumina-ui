import type { FC } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { PiRenderProfileEntry, PiRenderProfilerProps } from '../types/lumina';

/**
 * Developer overlay that records paint timings and highlights costly renders.
 */
export const PiRenderProfiler: FC<PiRenderProfilerProps> = ({
  enabled = true,
  thresholdMs = 16,
  maxEntries = 12,
  className,
  onProfile
}) => {
  const [entries, setEntries] = useState<readonly PiRenderProfileEntry[]>([]);
  const frameStartRef = useRef<number>(performance.now());

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const measure = (): void => {
      const now = performance.now();
      const renderMs = now - frameStartRef.current;
      frameStartRef.current = now;

      const entry: PiRenderProfileEntry = {
        id: crypto.randomUUID(),
        renderMs,
        thresholdMs,
        timestamp: Date.now()
      };

      onProfile?.(entry);
      setEntries((prev) => [entry, ...prev].slice(0, maxEntries));
      requestAnimationFrame(measure);
    };

    const raf = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(raf);
  }, [enabled, maxEntries, onProfile, thresholdMs]);

  const average = useMemo(() => {
    if (!entries.length) {
      return 0;
    }
    const total = entries.reduce((acc, item) => acc + item.renderMs, 0);
    return total / entries.length;
  }, [entries]);

  if (!enabled) {
    return null;
  }

  return (
    <aside
      className={className}
      aria-live="polite"
      style={{
        position: 'fixed',
        right: 8,
        bottom: 8,
        zIndex: 9999,
        width: 280,
        fontSize: 12,
        borderRadius: 12,
        padding: 12,
        background: 'rgba(10, 10, 15, 0.92)',
        border: '1px solid rgba(240, 192, 64, 0.4)',
        color: '#F5F5F7',
        pointerEvents: 'none'
      }}
    >
      <strong style={{ display: 'block', marginBottom: 8 }}>Pi Render Profiler</strong>
      <div style={{ marginBottom: 8 }}>Average: {average.toFixed(2)}ms</div>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', maxHeight: 180, overflow: 'auto' }}>
        {entries.map((entry) => (
          <li key={entry.id} style={{ color: entry.renderMs > thresholdMs ? '#ff8585' : '#7ee4a2' }}>
            {new Date(entry.timestamp).toLocaleTimeString()} — {entry.renderMs.toFixed(2)}ms
          </li>
        ))}
      </ul>
    </aside>
  );
};
