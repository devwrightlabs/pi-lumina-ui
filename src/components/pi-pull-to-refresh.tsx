'use client';

import type { FC, TouchEvent } from 'react';
import { useMemo, useRef, useState } from 'react';
import type { PiPullToRefreshProps } from '../types/lumina';

/**
 * Smooth pull-to-refresh wrapper with physics-like drag resistance.
 */
export const PiPullToRefresh: FC<PiPullToRefreshProps> = ({
  children,
  onRefresh,
  thresholdPx = 72,
  className
}) => {
  const [offset, setOffset] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startYRef = useRef<number | null>(null);

  const pullRatio = useMemo(() => Math.min(1, offset / thresholdPx), [offset, thresholdPx]);

  const onTouchStart = (event: TouchEvent<HTMLDivElement>): void => {
    if (window.scrollY > 0 || refreshing) {
      return;
    }
    startYRef.current = event.touches[0]?.clientY ?? null;
  };

  const onTouchMove = (event: TouchEvent<HTMLDivElement>): void => {
    if (startYRef.current === null) {
      return;
    }

    const currentY = event.touches[0]?.clientY ?? startYRef.current;
    const delta = Math.max(0, currentY - startYRef.current);
    const eased = Math.sqrt(delta) * 8;
    setOffset(Math.min(thresholdPx * 1.6, eased));
  };

  const onTouchEnd = async (): Promise<void> => {
    if (offset >= thresholdPx) {
      setRefreshing(true);
      await onRefresh();
      setRefreshing(false);
    }
    setOffset(0);
    startYRef.current = null;
  };

  return (
    <div
      className={className}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={() => {
        void onTouchEnd();
      }}
      style={{ transform: `translateY(${offset}px)`, transition: 'transform 180ms ease', willChange: 'transform' }}
    >
      <div
        aria-hidden="true"
        style={{
          height: 32,
          opacity: offset > 0 || refreshing ? 1 : 0,
          transition: 'opacity 180ms ease',
          display: 'grid',
          placeItems: 'center',
          color: '#F0C040'
        }}
      >
        {refreshing ? 'Refreshing…' : `Pull ${(pullRatio * 100).toFixed(0)}%`}
      </div>
      {children}
    </div>
  );
};
