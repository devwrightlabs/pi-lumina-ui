import type { CSSProperties } from 'react';

const ACCELERATION_CLASS = 'pi-lumina-hw-accel';

/**
 * Creates hardware accelerated style block for heavy UI elements.
 */
export const createHardwareAccelerationStyle = (): CSSProperties => ({
  transform: 'translateZ(0)',
  backfaceVisibility: 'hidden',
  perspective: 1000,
  willChange: 'transform, opacity'
});

/**
 * Applies compositing hints to force GPU acceleration where needed.
 */
export const applyHardwareAcceleration = (element: HTMLElement): void => {
  element.classList.add(ACCELERATION_CLASS);
  element.style.transform = element.style.transform || 'translateZ(0)';
  element.style.backfaceVisibility = 'hidden';
  element.style.willChange = 'transform, opacity';
};

/**
 * Removes compositing hints from previously accelerated element.
 */
export const removeHardwareAcceleration = (element: HTMLElement): void => {
  element.classList.remove(ACCELERATION_CLASS);
  element.style.transform = '';
  element.style.backfaceVisibility = '';
  element.style.willChange = '';
};
