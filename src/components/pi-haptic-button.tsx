'use client';

import type { FC } from 'react';
import type { PiHapticButtonProps, PiHapticImpact } from '../types/lumina';

const impactToPattern = (impact: PiHapticImpact): number | number[] => {
  if (impact === 'light') {
    return 12;
  }
  if (impact === 'medium') {
    return [16, 12, 18];
  }
  return [24, 12, 24];
};

/**
 * Haptic-first action button tuned for payment confirmations.
 */
export const PiHapticButton: FC<PiHapticButtonProps> = ({
  children,
  impact = 'heavy',
  disabled,
  className,
  style,
  type = 'button',
  onClick,
  ariaLabel
}) => (
  <button
    type={type}
    className={className}
    disabled={disabled}
    data-pi-payment="true"
    aria-label={ariaLabel}
    onClick={() => {
      if (!disabled && typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        navigator.vibrate(impactToPattern(impact));
      }
      onClick?.();
    }}
    style={{
      border: 0,
      borderRadius: 'var(--lumina-radius-md, 12px)',
      minHeight: 48,
      padding: '12px 16px',
      background: '#F0C040',
      color: '#101012',
      fontWeight: 700,
      width: '100%',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.55 : 1,
      transform: 'translateZ(0)',
      ...style
    }}
  >
    {children}
  </button>
);
