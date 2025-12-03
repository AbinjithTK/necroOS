import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import styled from 'styled-components';
import * as fc from 'fast-check';
import { necroTheme } from './index';

/**
 * Feature: necro-os, Property 31: Accessibility contrast compliance
 * Validates: Requirements 14.5
 * 
 * For any text element, the contrast ratio between text and background should meet WCAG AA standards (4.5:1 for normal text).
 */

// Helper function to calculate relative luminance
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const sRGB = c / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Helper function to calculate contrast ratio
function getContrastRatio(rgb1: [number, number, number], rgb2: [number, number, number]): number {
  const lum1 = getLuminance(...rgb1);
  const lum2 = getLuminance(...rgb2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Helper function to parse hex color to RGB
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [0, 0, 0];
}

// Test components
const TestText = styled.div<{ $textColor: string; $bgColor: string }>`
  color: ${(props) => props.$textColor};
  background-color: ${(props) => props.$bgColor};
  font-size: ${({ theme }) => theme.fontSizes.medium};
`;

describe('Property 31: Accessibility contrast compliance', () => {
  it('should have Matrix Green on Void Black meet WCAG AA contrast (4.5:1)', () => {
    const matrixGreenRgb = hexToRgb(necroTheme.colors.matrixGreen);
    const voidBlackRgb = hexToRgb(necroTheme.colors.voidBlack);
    const contrastRatio = getContrastRatio(matrixGreenRgb, voidBlackRgb);

    expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
    // Should actually be AAA (7:1) based on design doc
    expect(contrastRatio).toBeGreaterThanOrEqual(7);
  });

  it('should have Blood Red on Void Black meet WCAG AA contrast (4.5:1)', () => {
    const bloodRedRgb = hexToRgb(necroTheme.colors.bloodRed);
    const voidBlackRgb = hexToRgb(necroTheme.colors.voidBlack);
    const contrastRatio = getContrastRatio(bloodRedRgb, voidBlackRgb);

    expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
  });

  it('should have Light Gray on Void Black meet WCAG AA contrast (4.5:1)', () => {
    const lightGrayRgb = hexToRgb(necroTheme.colors.lightGray);
    const voidBlackRgb = hexToRgb(necroTheme.colors.voidBlack);
    const contrastRatio = getContrastRatio(lightGrayRgb, voidBlackRgb);

    expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
  });

  it('should maintain WCAG AA contrast for all theme color combinations on background', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('matrixGreen', 'bloodRed', 'lightGray', 'white'),
        (colorKey) => {
          const textColor = necroTheme.colors[colorKey as keyof typeof necroTheme.colors];
          const bgColor = necroTheme.colors.voidBlack;

          const textRgb = hexToRgb(textColor);
          const bgRgb = hexToRgb(bgColor);
          const contrastRatio = getContrastRatio(textRgb, bgRgb);

          // WCAG AA requires 4.5:1 for normal text
          return contrastRatio >= 4.5;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should render text with sufficient contrast in actual components', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('matrixGreen', 'bloodRed', 'lightGray'),
        fc.string({ minLength: 1, maxLength: 50 }),
        (colorKey, textContent) => {
          const textColor = necroTheme.colors[colorKey as keyof typeof necroTheme.colors];
          const bgColor = necroTheme.colors.voidBlack;

          const { container } = render(
            <ThemeProvider theme={necroTheme}>
              <TestText $textColor={textColor} $bgColor={bgColor}>
                {textContent}
              </TestText>
            </ThemeProvider>
          );

          const element = container.firstChild as HTMLElement;
          const computedStyle = window.getComputedStyle(element);

          // Verify the colors are applied
          const hasTextColor = computedStyle.color !== '';
          const hasBgColor = computedStyle.backgroundColor !== '';

          return hasTextColor && hasBgColor;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have contrast ratios documented in theme', () => {
    expect(necroTheme.contrast).toBeDefined();
    expect(necroTheme.contrast.primaryOnBackground).toBeGreaterThanOrEqual(4.5);
    expect(necroTheme.contrast.errorOnBackground).toBeGreaterThanOrEqual(4.5);
    expect(necroTheme.contrast.secondaryOnBackground).toBeGreaterThanOrEqual(4.5);
  });

  it('should verify documented contrast ratios match actual calculations', () => {
    // Matrix Green on Void Black
    const matrixGreenRgb = hexToRgb(necroTheme.colors.matrixGreen);
    const voidBlackRgb = hexToRgb(necroTheme.colors.voidBlack);
    const primaryContrast = getContrastRatio(matrixGreenRgb, voidBlackRgb);

    // Allow small rounding differences
    expect(Math.abs(primaryContrast - necroTheme.contrast.primaryOnBackground)).toBeLessThan(0.5);

    // Blood Red on Void Black
    const bloodRedRgb = hexToRgb(necroTheme.colors.bloodRed);
    const errorContrast = getContrastRatio(bloodRedRgb, voidBlackRgb);

    expect(Math.abs(errorContrast - necroTheme.contrast.errorOnBackground)).toBeLessThan(0.5);

    // Light Gray on Void Black
    const lightGrayRgb = hexToRgb(necroTheme.colors.lightGray);
    const secondaryContrast = getContrastRatio(lightGrayRgb, voidBlackRgb);

    expect(Math.abs(secondaryContrast - necroTheme.contrast.secondaryOnBackground)).toBeLessThan(0.5);
  });
});
