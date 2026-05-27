import type { PiPCTComplianceInput, PiPCTComplianceIssue, PiPCTComplianceReport } from '../types/lumina';

const MIN_CONTRAST = 4.5;
const MIN_HORIZONTAL_PADDING = 16;
const MIN_VERTICAL_PADDING = 12;

/**
 * Validates payment-facing UI controls against Pi Core Team UX constraints.
 */
export const validatePiPCTCompliance = (input: PiPCTComplianceInput): PiPCTComplianceReport => {
  const issues: PiPCTComplianceIssue[] = [];

  if (input.contrastRatio < MIN_CONTRAST) {
    issues.push({
      code: 'CONTRAST_TOO_LOW',
      message: `Contrast ratio must be at least ${MIN_CONTRAST}:1 for payment safety.`
    });
  }

  if (input.horizontalPaddingPx < MIN_HORIZONTAL_PADDING) {
    issues.push({
      code: 'HORIZONTAL_PADDING_TOO_LOW',
      message: `Horizontal padding must be >= ${MIN_HORIZONTAL_PADDING}px.`
    });
  }

  if (input.verticalPaddingPx < MIN_VERTICAL_PADDING) {
    issues.push({
      code: 'VERTICAL_PADDING_TOO_LOW',
      message: `Vertical padding must be >= ${MIN_VERTICAL_PADDING}px.`
    });
  }

  if (input.role === 'payment_cta' && input.viewportPlacement !== 'bottom-safe-zone') {
    issues.push({
      code: 'PAYMENT_BUTTON_NOT_IN_SAFE_ZONE',
      message: 'Primary payment CTA should be placed in the bottom safe zone.'
    });
  }

  if (input.role === 'payment_cta' && input.label.trim().length === 0) {
    issues.push({
      code: 'MISSING_PAYMENT_LABEL',
      message: 'Payment CTA requires explicit action label (for example, Pay with Pi).'
    });
  }

  return {
    compliant: issues.length === 0,
    score: Math.max(0, 100 - issues.length * 20),
    issues
  };
};
