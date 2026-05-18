import type { CSSProperties, FC } from 'react';
import { createContext, useContext, useMemo } from 'react';
import type { LuminaTheme, LuminaThemeProviderProps } from '../types/lumina';

const defaultTheme: LuminaTheme = {
  colors: {
    background: '#0A0A0F',
    accent: '#F0C040',
    textPrimary: '#F5F5F7',
    textSecondary: '#B8B9C1',
    borderSubtle: 'rgba(255, 255, 255, 0.16)',
    surfaceGlass: 'rgba(255, 255, 255, 0.08)'
  },
  radiusMd: '12px',
  radiusLg: '20px',
  spacingUnitPx: 4
};

const LuminaThemeContext = createContext<LuminaTheme>(defaultTheme);

/**
 * Accesses the active Lumina theme.
 */
export const useLuminaTheme = (): LuminaTheme => useContext(LuminaThemeContext);

/**
 * Provides enterprise Lumina theme variables for Pi webview applications.
 */
export const LuminaThemeProvider: FC<LuminaThemeProviderProps> = ({
  children,
  themeOverrides,
  className,
  style
}) => {
  const mergedTheme = useMemo<LuminaTheme>(() => {
    if (!themeOverrides) {
      return defaultTheme;
    }

    return {
      ...defaultTheme,
      ...themeOverrides,
      colors: {
        ...defaultTheme.colors,
        ...themeOverrides.colors,
        background: '#0A0A0F',
        accent: '#F0C040'
      }
    };
  }, [themeOverrides]);

  const cssVariables = useMemo<CSSProperties>(
    () => ({
      '--lumina-color-bg': mergedTheme.colors.background,
      '--lumina-color-accent': mergedTheme.colors.accent,
      '--lumina-color-text-primary': mergedTheme.colors.textPrimary,
      '--lumina-color-text-secondary': mergedTheme.colors.textSecondary,
      '--lumina-color-border-subtle': mergedTheme.colors.borderSubtle,
      '--lumina-color-surface-glass': mergedTheme.colors.surfaceGlass,
      '--lumina-radius-md': mergedTheme.radiusMd,
      '--lumina-radius-lg': mergedTheme.radiusLg,
      '--lumina-spacing-unit': `${mergedTheme.spacingUnitPx}px`,
      color: mergedTheme.colors.textPrimary,
      backgroundColor: mergedTheme.colors.background,
      ...style
    }),
    [mergedTheme, style]
  );

  return (
    <LuminaThemeContext.Provider value={mergedTheme}>
      <div data-lumina-theme="root" className={className} style={cssVariables}>
        {children}
      </div>
    </LuminaThemeContext.Provider>
  );
};
