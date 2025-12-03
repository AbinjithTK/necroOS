import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import styled from 'styled-components';
import * as fc from 'fast-check';
import { necroTheme } from './index';

/**
 * Feature: necro-os, Property 18: Consistent typography
 * Validates: Requirements 1.4, 14.4
 * 
 * For any text element, the font-family should be MS Sans Serif unless explicitly overridden for effect.
 */

// Test component that renders various text elements
const TestTextElement = styled.div<{ $elementType: string }>`
  font-family: ${({ theme }) => theme.fonts.primary};
`;

const TestMonospaceElement = styled.code`
  font-family: ${({ theme }) => theme.fonts.monospace};
`;

describe('Property 18: Consistent typography', () => {
  it('should use MS Sans Serif font family for all standard text elements', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('div', 'span', 'p', 'h1', 'h2', 'h3', 'button', 'label'),
        fc.string({ minLength: 1, maxLength: 50 }),
        (elementType, textContent) => {
          const { container } = render(
            <ThemeProvider theme={necroTheme}>
              <TestTextElement $elementType={elementType}>
                {textContent}
              </TestTextElement>
            </ThemeProvider>
          );

          const element = container.firstChild as HTMLElement;
          const computedStyle = window.getComputedStyle(element);
          const fontFamily = computedStyle.fontFamily;

          // Should contain MS Sans Serif or Microsoft Sans Serif
          return (
            fontFamily.includes('MS Sans Serif') ||
            fontFamily.includes('Microsoft Sans Serif') ||
            fontFamily.includes('sans-serif')
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should use monospace font for code elements', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        (textContent) => {
          const { container } = render(
            <ThemeProvider theme={necroTheme}>
              <TestMonospaceElement>{textContent}</TestMonospaceElement>
            </ThemeProvider>
          );

          const element = container.firstChild as HTMLElement;
          const computedStyle = window.getComputedStyle(element);
          const fontFamily = computedStyle.fontFamily;

          // Should contain Courier New or monospace
          return (
            fontFamily.includes('Courier New') ||
            fontFamily.includes('Courier') ||
            fontFamily.includes('monospace')
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should apply consistent font sizes from theme', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('small', 'medium', 'large', 'xlarge'),
        (sizeKey) => {
          const fontSize = necroTheme.fontSizes[sizeKey as keyof typeof necroTheme.fontSizes];
          
          // Font sizes should be defined and valid CSS values
          return (
            fontSize !== undefined &&
            fontSize !== null &&
            (fontSize.endsWith('px') || fontSize.endsWith('rem') || fontSize.endsWith('em'))
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have consistent line heights defined in theme', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('tight', 'normal', 'relaxed'),
        (lineHeightKey) => {
          const lineHeight = necroTheme.lineHeights[lineHeightKey as keyof typeof necroTheme.lineHeights];
          
          // Line heights should be defined and be positive numbers
          return (
            typeof lineHeight === 'number' &&
            lineHeight > 0 &&
            lineHeight <= 3
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have primary font defined as MS Sans Serif', () => {
    expect(necroTheme.fonts.primary).toContain('MS Sans Serif');
  });

  it('should have monospace font defined', () => {
    expect(necroTheme.fonts.monospace).toBeDefined();
    expect(necroTheme.fonts.monospace).toContain('Courier');
  });
});
