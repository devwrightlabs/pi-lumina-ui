'use client';

import type { FC } from 'react';
import type { PiGlassmorphismCardProps } from '../types/lumina';

/**
 * Lightweight glassmorphism container tuned for mobile GPU stability.
 */
export const PiGlassmorphismCard: FC<PiGlassmorphismCardProps> = ({ children, className, style }) => (
  <section
    className={className}
    style={{
      borderRadius: 'var(--lumina-radius-lg, 20px)',
      border: '1px solid rgba(255, 255, 255, 0.24)',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04))',
      backdropFilter: 'blur(16px) saturate(130%)',
      WebkitBackdropFilter: 'blur(16px) saturate(130%)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
      transform: 'translateZ(0)',
      ...style
    }}
  >
    {children}
  </section>
);
