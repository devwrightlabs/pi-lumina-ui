import type { PiAccessibilityFinding } from '../types/lumina';

const SELECTOR_TO_SCAN = '[data-pi-payment], button, [role="button"]';

const getContrastRatio = (foreground: string, background: string): number => {
  const parseRgb = (value: string): readonly [number, number, number] => {
    const match = value.match(/\d+/g);
    if (!match || match.length < 3) {
      return [255, 255, 255];
    }
    return [Number(match[0]), Number(match[1]), Number(match[2])];
  };

  const luminance = ([r, g, b]: readonly [number, number, number]): number => {
    const rgb = [r, g, b].map((channel) => {
      const normalized = channel / 255;
      return normalized <= 0.03928
        ? normalized / 12.92
        : ((normalized + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  };

  const fg = luminance(parseRgb(foreground));
  const bg = luminance(parseRgb(background));
  const lighter = Math.max(fg, bg);
  const darker = Math.min(fg, bg);
  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Executes silent accessibility diagnostics for contrast and payment ARIA labeling.
 */
export const runPiAccessibilityScanner = (
  root: ParentNode = document,
  minContrast = 4.5
): readonly PiAccessibilityFinding[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  const findings: PiAccessibilityFinding[] = [];

  root.querySelectorAll<HTMLElement>(SELECTOR_TO_SCAN).forEach((element) => {
    const computed = getComputedStyle(element);
    const contrastRatio = getContrastRatio(computed.color, computed.backgroundColor);
    const selector = element.tagName.toLowerCase();

    if (contrastRatio < minContrast) {
      findings.push({
        severity: 'warning',
        message: `Text contrast (${contrastRatio.toFixed(2)}:1) below ${minContrast}:1.`,
        selector
      });
    }

    const isPaymentAction = element.dataset.piPayment === 'true' || /pay with pi/i.test(element.textContent ?? '');
    if (isPaymentAction && !element.getAttribute('aria-label')) {
      findings.push({
        severity: 'error',
        message: 'Payment action is missing aria-label.',
        selector
      });
    }
  });

  findings.forEach((finding) => {
    const method = finding.severity === 'error' ? 'error' : 'warn';
    // eslint-disable-next-line no-console
    console[method](`[PiAccessibilityScanner] ${finding.message} Target: ${finding.selector}`);
  });

  return findings;
};
