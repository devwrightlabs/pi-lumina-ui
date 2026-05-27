import type { PiFontDescriptor } from '../types/lumina';

const loadedFonts = new Set<string>();

/**
 * Preloads and registers optimized fonts to reduce FOIT in constrained networks.
 */
export const preloadOptimizedFonts = (fonts: readonly PiFontDescriptor[]): void => {
  if (typeof document === 'undefined') {
    return;
  }

  fonts.forEach((font) => {
    if (loadedFonts.has(font.href)) {
      return;
    }

    const preload = document.createElement('link');
    preload.rel = 'preload';
    preload.as = 'font';
    preload.href = font.href;
    preload.crossOrigin = 'anonymous';
    preload.type = font.type ?? 'font/woff2';
    document.head.appendChild(preload);

    const face = new FontFace(font.family, `url(${font.href})`, {
      weight: font.weight,
      style: font.style
    });

    face
      .load()
      .then((loadedFace) => {
        document.fonts.add(loadedFace);
      })
      .catch((error: unknown) => {
        // eslint-disable-next-line no-console
        console.warn('[PiFontOptimizer] Unable to preload font.', error);
      });

    loadedFonts.add(font.href);
  });
};
