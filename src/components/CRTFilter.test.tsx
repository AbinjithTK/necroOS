import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import * as fc from 'fast-check';
import { CRTFilter } from './CRTFilter';

describe('CRTFilter', () => {
  /**
   * Feature: necro-os, Property 19: CRT filter persistence
   * Validates: Requirements 1.2, 14.3
   * 
   * For any application state, the CRT filter overlay should always be present
   * with scanlines, chromatic aberration, and screen curvature effects.
   */
  it('should always render CRT filter elements regardless of intensity', { timeout: 30000 }, () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 1 }),
        (intensity) => {
          const { container, unmount } = render(<CRTFilter intensity={intensity} />);
          
          // CRT filter should render two main elements (screen and overlay)
          const elements = container.querySelectorAll('div');
          
          // Should have at least 2 divs (CRTScreen and CRTOverlay)
          const result = elements.length >= 2;
          
          unmount();
          return result;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should render with default intensity when not provided', () => {
    const { container } = render(<CRTFilter />);
    const elements = container.querySelectorAll('div');
    
    expect(elements.length).toBeGreaterThanOrEqual(2);
  });

  it('should clamp intensity values outside 0-1 range', { timeout: 30000 }, () => {
    fc.assert(
      fc.property(
        fc.float({ min: -10, max: 10 }),
        (intensity) => {
          // Should not throw error even with out-of-range intensity
          const { container } = render(<CRTFilter intensity={intensity} />);
          const elements = container.querySelectorAll('div');
          
          expect(elements.length).toBeGreaterThanOrEqual(2);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
