import type { CSSProperties, PropsWithChildren, ReactNode } from 'react';

/**
 * Two-dimensional coordinate used by spatial interactions.
 */
export interface SpatialCoordinate {
  readonly x: number;
  readonly y: number;
}

/**
 * Rectangle bounds used for layout and viewport collision checks.
 */
export interface SpatialRect extends SpatialCoordinate {
  readonly width: number;
  readonly height: number;
}

/**
 * Theme tokens enforced by the Lumina design system.
 */
export interface LuminaColorTokens {
  readonly background: '#0A0A0F';
  readonly accent: '#F0C040';
  readonly textPrimary: string;
  readonly textSecondary: string;
  readonly borderSubtle: string;
  readonly surfaceGlass: string;
}

/**
 * Runtime theme options for the master provider.
 */
export interface LuminaTheme {
  readonly colors: LuminaColorTokens;
  readonly radiusMd: string;
  readonly radiusLg: string;
  readonly spacingUnitPx: number;
}

/**
 * Props for the LuminaThemeProvider.
 */
export interface LuminaThemeProviderProps extends PropsWithChildren {
  readonly themeOverrides?: Partial<LuminaTheme>;
  readonly className?: string;
  readonly style?: CSSProperties;
}

/**
 * PCT payment rule input.
 */
export interface PiPCTComplianceInput {
  readonly role: 'payment_cta' | 'secondary_cta' | 'status';
  readonly label: string;
  readonly contrastRatio: number;
  readonly horizontalPaddingPx: number;
  readonly verticalPaddingPx: number;
  readonly viewportPlacement: 'top' | 'middle' | 'bottom-safe-zone';
}

/**
 * PCT validation issue returned by compliance checks.
 */
export interface PiPCTComplianceIssue {
  readonly code:
    | 'CONTRAST_TOO_LOW'
    | 'HORIZONTAL_PADDING_TOO_LOW'
    | 'VERTICAL_PADDING_TOO_LOW'
    | 'PAYMENT_BUTTON_NOT_IN_SAFE_ZONE'
    | 'MISSING_PAYMENT_LABEL';
  readonly message: string;
}

/**
 * Validation report for PCT compliance.
 */
export interface PiPCTComplianceReport {
  readonly compliant: boolean;
  readonly score: number;
  readonly issues: readonly PiPCTComplianceIssue[];
}

/**
 * Viewport safe-area metrics for the Pi webview container.
 */
export interface PiViewportInsets {
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
  readonly keyboardOffset: number;
}

/**
 * Metrics returned from viewport lock calculations.
 */
export interface PiViewportLockMetrics {
  readonly viewportWidth: number;
  readonly viewportHeight: number;
  readonly insets: PiViewportInsets;
  readonly safeContentWidth: number;
  readonly safeContentHeight: number;
}

/**
 * Profile entry for render timing diagnostics.
 */
export interface PiRenderProfileEntry {
  readonly id: string;
  readonly renderMs: number;
  readonly thresholdMs: number;
  readonly timestamp: number;
}

/**
 * Props for the render profiler overlay.
 */
export interface PiRenderProfilerProps {
  readonly enabled?: boolean;
  readonly thresholdMs?: number;
  readonly maxEntries?: number;
  readonly className?: string;
  readonly onProfile?: (entry: PiRenderProfileEntry) => void;
}

/**
 * Props for the blank screen killer boundary.
 */
export interface PiBlankScreenKillerProps extends PropsWithChildren {
  readonly title?: string;
  readonly onRecover?: () => void;
}

/**
 * Output record from accessibility scan.
 */
export interface PiAccessibilityFinding {
  readonly severity: 'warning' | 'error';
  readonly message: string;
  readonly selector: string;
}

/**
 * Schema node used to generate skeleton placeholders.
 */
export interface PiSkeletonNode {
  readonly key: string;
  readonly width: string | number;
  readonly height: string | number;
  readonly borderRadius?: string | number;
  readonly children?: readonly PiSkeletonNode[];
}

/**
 * Props for the schema-driven skeleton wrapper.
 */
export interface PiSkeletonForgeProps {
  readonly loading: boolean;
  readonly schema: readonly PiSkeletonNode[];
  readonly children: ReactNode;
  readonly className?: string;
  readonly style?: CSSProperties;
}

/**
 * Props for optimized lazy image rendering.
 */
export interface PiLazyImageProps {
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
  readonly className?: string;
  readonly quality?: number;
  readonly decoding?: 'sync' | 'async' | 'auto';
  readonly loading?: 'lazy' | 'eager';
  readonly blurDataUrl?: string;
  readonly onLoad?: () => void;
}

/**
 * Supported haptic button impact patterns.
 */
export type PiHapticImpact = 'light' | 'medium' | 'heavy';

/**
 * Props for haptic button interactions.
 */
export interface PiHapticButtonProps extends PropsWithChildren {
  readonly impact?: PiHapticImpact;
  readonly disabled?: boolean;
  readonly className?: string;
  readonly style?: CSSProperties;
  readonly type?: 'button' | 'submit' | 'reset';
  readonly onClick?: () => void;
  readonly ariaLabel?: string;
}

/**
 * Toast message payload.
 */
export interface PiToastMessage {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly tone?: 'info' | 'success' | 'warning' | 'error';
  readonly durationMs?: number;
}

/**
 * Bottom sheet component props.
 */
export interface PiBottomSheetProps {
  readonly isOpen: boolean;
  readonly title: string;
  readonly children: ReactNode;
  readonly className?: string;
  readonly closeOnBackdrop?: boolean;
  readonly onClose: () => void;
}

/**
 * Pull-to-refresh container props.
 */
export interface PiPullToRefreshProps extends PropsWithChildren {
  readonly onRefresh: () => Promise<void>;
  readonly thresholdPx?: number;
  readonly className?: string;
}

/**
 * Glassmorphism card props.
 */
export interface PiGlassmorphismCardProps extends PropsWithChildren {
  readonly className?: string;
  readonly style?: CSSProperties;
}

/**
 * Font preload descriptor for FOIT prevention.
 */
export interface PiFontDescriptor {
  readonly family: string;
  readonly href: string;
  readonly weight?: string;
  readonly style?: 'normal' | 'italic';
  readonly type?: 'font/woff2' | 'font/woff' | 'font/ttf';
}
