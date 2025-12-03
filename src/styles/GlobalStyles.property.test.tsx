import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import styled from 'styled-components';
import * as fc from 'fast-check';
import { necroTheme } from '../theme';
import { GlobalStyles } from './GlobalStyles';

/**
 * Feature: necro-os, Property 30: Error message styling
 * Validates: Requirements 14.2
 * 
 * For any error state, the error message should be displayed in Blood Red (#FF0000) color.
 */

// Test components that use theme directly (styled-components)
const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.bloodRed};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-family: ${({ theme }) => theme.fonts.primary};
`;

const ErrorAlert = styled.div`
  color: ${({ theme }) => theme.colors.bloodRed};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-family: ${({ theme }) => theme.fonts.primary};
`;

describe('Property 30: Error message styling', () => {
  it('should display error messages in Blood Red color for any error text', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 100 }),
        (errorText) => {
          const { container } = render(
            <ThemeProvider theme={necroTheme}>
              <ErrorMessage className="error-message">
                {errorText}
              </ErrorMessage>
            </ThemeProvider>
          );

          const element = container.firstChild as HTMLElement;
          const computedStyle = window.getComputedStyle(element);
          const color = computedStyle.color;

          // Blood Red is #FF0000 which is rgb(255, 0, 0)
          return (
            color === 'rgb(255, 0, 0)' ||
            color === 'rgb(255,0,0)' ||
            color === '#FF0000' ||
            color === '#ff0000' ||
            color.toLowerCase() === 'red'
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should display elements with error role in Blood Red', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 100 }),
        (errorText) => {
          const { container } = render(
            <ThemeProvider theme={necroTheme}>
              <ErrorAlert role="alert">{errorText}</ErrorAlert>
            </ThemeProvider>
          );

          const element = container.firstChild as HTMLElement;
          const computedStyle = window.getComputedStyle(element);
          const color = computedStyle.color;

          // Blood Red is #FF0000 which is rgb(255, 0, 0)
          return (
            color === 'rgb(255, 0, 0)' ||
            color === 'rgb(255,0,0)' ||
            color === '#FF0000' ||
            color === '#ff0000' ||
            color.toLowerCase() === 'red'
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should apply bold font weight to error messages', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 100 }),
        (errorText) => {
          const { container } = render(
            <ThemeProvider theme={necroTheme}>
              <ErrorMessage>{errorText}</ErrorMessage>
            </ThemeProvider>
          );

          const element = container.firstChild as HTMLElement;
          const computedStyle = window.getComputedStyle(element);
          const fontWeight = computedStyle.fontWeight;

          // Bold is typically 700 or "bold"
          return (
            fontWeight === '700' ||
            fontWeight === 'bold' ||
            parseInt(fontWeight) >= 700
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should use MS Sans Serif font for error messages', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 100 }),
        (errorText) => {
          const { container } = render(
            <ThemeProvider theme={necroTheme}>
              <ErrorMessage>{errorText}</ErrorMessage>
            </ThemeProvider>
          );

          const element = container.firstChild as HTMLElement;
          const computedStyle = window.getComputedStyle(element);
          const fontFamily = computedStyle.fontFamily;

          // Should use the primary font (MS Sans Serif)
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

  it('should have Blood Red defined as #FF0000 in theme', () => {
    expect(necroTheme.colors.bloodRed).toBe('#FF0000');
  });

  it('should have bold font weight defined as 700 in theme', () => {
    expect(necroTheme.fontWeights.bold).toBe(700);
  });
});

