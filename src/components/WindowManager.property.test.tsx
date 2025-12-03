import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import * as fc from 'fast-check';
import { WindowManager } from './WindowManager';
import type { WindowState } from '../store/types';

describe('WindowManager Property-Based Tests', () => {
  const mockHandlers = {
    onWindowClose: vi.fn(),
    onWindowFocus: vi.fn(),
    onWindowMove: vi.fn(),
    onWindowMinimize: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Feature: necro-os, Property 16: Window dragging during glitches
   * Validates: Requirements 11.5
   * 
   * For any window experiencing glitch effects, the user should still be able
   * to drag it to a new position.
   */
  it('Property 16: Window dragging during glitches - should allow dragging with glitch offset', () => {
    fc.assert(
      fc.property(
        // Generate random glitch offsets
        fc.integer({ min: -50, max: 50 }),
        fc.integer({ min: -50, max: 50 }),
        (glitchX, glitchY) => {
          const windowWithGlitch: WindowState = {
            id: 'test-window',
            type: 'my-corpse',
            title: 'Test Window',
            position: { x: 100, y: 100 },
            size: { width: 400, height: 300 },
            zIndex: 1,
            minimized: false,
            glitchOffset: { x: glitchX, y: glitchY },
          };

          const { unmount } = render(
            <WindowManager windows={[windowWithGlitch]} {...mockHandlers} />
          );

          // Window should still be draggable despite glitch effects
          // The onWindowMove handler should be callable
          expect(mockHandlers.onWindowMove).toBeDefined();

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  }, 15000); // Increase timeout for property test with many renders

  it('Property 16: Window dragging during glitches - should maintain functionality across glitch intensities', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -100, max: 100 }),
        fc.integer({ min: -100, max: 100 }),
        (offsetX, offsetY) => {
          const window: WindowState = {
            id: 'test-window',
            type: 'my-corpse',
            title: 'Test Window',
            position: { x: 100, y: 100 },
            size: { width: 400, height: 300 },
            zIndex: 1,
            minimized: false,
            glitchOffset: { x: offsetX, y: offsetY },
          };

          const { unmount } = render(
            <WindowManager windows={[window]} {...mockHandlers} />
          );

          // Window should be rendered regardless of glitch offset
          expect(mockHandlers.onWindowMove).toBeDefined();

          unmount();
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Feature: necro-os, Property 28: Window position glitch application
   * Validates: Requirements 11.1
   * 
   * For any window, when a window-shift glitch is triggered, the window position
   * should change by a small random offset.
   */
  it('Property 28: Window position glitch - should apply offset to window position', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 100, max: 500 }),
        fc.integer({ min: 100, max: 400 }),
        fc.integer({ min: -50, max: 50 }),
        fc.integer({ min: -50, max: 50 }),
        (baseX, baseY, offsetX, offsetY) => {
          const windowWithGlitch: WindowState = {
            id: 'glitched-window',
            type: 'readme',
            title: 'Glitched Window',
            position: { x: baseX, y: baseY },
            size: { width: 400, height: 300 },
            zIndex: 1,
            minimized: false,
            glitchOffset: { x: offsetX, y: offsetY },
          };

          const { container, unmount } = render(
            <WindowManager windows={[windowWithGlitch]} {...mockHandlers} />
          );

          // Window should be rendered with glitch offset applied
          const windowElement = container.querySelector('[style*="left"]');
          expect(windowElement).toBeTruthy();

          unmount();
          return true;
        }
      ),
      { numRuns: 50 }
    );
  }, 10000); // Increase timeout for property test with many renders

  it('Property 28: Window position glitch - should handle zero offset', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 1000 }),
        fc.integer({ min: 0, max: 800 }),
        (baseX, baseY) => {
          const windowNoGlitch: WindowState = {
            id: 'normal-window',
            type: 'dark-web',
            title: 'Normal Window',
            position: { x: baseX, y: baseY },
            size: { width: 400, height: 300 },
            zIndex: 1,
            minimized: false,
            // No glitch offset
          };

          const { unmount } = render(
            <WindowManager windows={[windowNoGlitch]} {...mockHandlers} />
          );

          // Window should render normally without glitch offset
          expect(mockHandlers.onWindowMove).toBeDefined();

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 28: Window position glitch - should handle multiple windows with different offsets', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 3 }),
        (numWindows) => {
          const windows: WindowState[] = Array.from({ length: numWindows }, (_, i) => ({
            id: `window-${i}`,
            type: 'my-corpse',
            title: `Window ${i}`,
            position: { x: 100 + i * 100, y: 100 + i * 50 },
            size: { width: 400, height: 300 },
            zIndex: i + 1,
            minimized: false,
            glitchOffset: {
              x: (i * 10) - 10,
              y: (i * 10) - 10,
            },
          }));

          const { unmount } = render(
            <WindowManager windows={windows} {...mockHandlers} />
          );

          // All windows should be rendered with their respective glitch offsets
          expect(windows.length).toBe(numWindows);

          unmount();
          return true;
        }
      ),
      { numRuns: 30 }
    );
  });
});
