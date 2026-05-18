# @devright/pi-lumina-ui

`@devright/pi-lumina-ui` is a strictly typed TypeScript UI toolkit designed for Pi Network native mobile webviews (React / Next.js App Router). It includes premium spatial components, rendering safeguards for low-end Android devices, and Pi Core Team (PCT)-focused payment flow compliance utilities.

## Highlights

- **PCT-aligned payment UX validation** for button spacing, contrast, and placement.
- **Universal rendering reliability** helpers for safe-area handling, hardware acceleration, FOIT prevention, and layout-shift-resistant skeletons.
- **Debug tooling** to prevent blank screens, profile expensive paints, and scan accessibility constraints in development.
- **Premium mobile-first components** including bottom sheets, pull-to-refresh, toast stacks, and haptic payment actions.

## Installation

```bash
npm install @devright/pi-lumina-ui
```

Peer dependencies:

- `react`
- `react-dom`
- `framer-motion`

## Quick Start

```tsx
'use client';

import {
  LuminaThemeProvider,
  PiHapticButton,
  PiBottomSheet,
  validatePiPCTCompliance
} from '@devright/pi-lumina-ui';

export default function Checkout() {
  const report = validatePiPCTCompliance({
    role: 'payment_cta',
    contrastRatio: 5.4,
    horizontalPaddingPx: 16,
    verticalPaddingPx: 12,
    viewportPlacement: 'bottom-safe-zone',
    label: 'Pay with Pi'
  });

  return (
    <LuminaThemeProvider>
      <PiHapticButton disabled={!report.compliant}>Pay with Pi</PiHapticButton>
      <PiBottomSheet isOpen title="Order Summary" onClose={() => undefined}>
        <p>Subtotal: 3.50 Pi</p>
      </PiBottomSheet>
    </LuminaThemeProvider>
  );
}
```

## PCT-Compliant Payment Flows

Use `validatePiPCTCompliance()` to assert payment CTA spacing, minimum contrast ratio, and safe-zone placement before rendering a transaction action.

Recommended baseline:

- Horizontal padding: **>= 16px**
- Vertical padding: **>= 12px**
- Contrast ratio: **>= 4.5:1**
- Placement: **bottom-safe-zone** for primary payment actions
- Label: explicit and action-oriented (example: `Pay with Pi`)

## Universal Rendering Fixes

- `createViewportLockEngine()` and `usePiViewportLock()` compute dynamic insets from `visualViewport`, safe-area env vars, and keyboard shifts.
- `applyHardwareAcceleration()` and `createHardwareAccelerationStyle()` force GPU compositing for heavy surfaces (`translateZ(0)`).
- `preloadOptimizedFonts()` minimizes FOIT through preload + fallback strategy.
- `PiSkeletonForge` provides schema-driven skeleton placeholders to avoid layout shifts.

## Debugging Suite

- `PiBlankScreenKiller`: Error boundary with in-app crash diagnostics.
- `PiRenderProfiler`: paint-time overlay to detect laggy components.
- `runPiAccessibilityScanner()`: dev-time checks for contrast and missing payment `aria-label` attributes.

## Component API (Summary)

- `PiGlassmorphismCard`
- `PiBottomSheet`
- `PiPullToRefresh`
- `PiToastProvider` / `PiToastViewport` / `usePiToast`
- `PiHapticButton`
- `PiLazyImage`
- `PiSkeletonForge`

See exported TypeScript types for complete prop contracts.

## Scripts

```bash
npm run build
npm run typecheck
npm run dev
```

## License

MIT
