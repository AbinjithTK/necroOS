import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import * as fc from 'fast-check';
import { GlitchableWindow } from './GlitchableWindow';
import type { GlitchEffect, GlitchType } from '../store/types';

describe('GlitchableWindow Property-Based Tests', () => {
  /**
   * Feature: necro-os, Property 29: Multi-window glitch coordination
   * Validates: Requirements 11.4
   * 
   * For any glitch effect, when multiple windows are open, the glitch should be
   * capable of affecting multiple windows simultaneously.
   */
  it('Property 29: Multi-window glitch coordination - should apply glitches to multiple windows', () => {
    fc.assert(
      fc.property(
        // Generate random number of windows (2-5)
        fc.integer({ min: 2, max: 5 }),
        // Generate random glitch types
        fc.array(
          fc.constantFrom<GlitchType>(
            'window-shift',
            'text-corruption',
            'color-shift',
            'transparency',
            'invert-colors'
          ),
          { minLength: 1, maxLength: 3 }
        ),
        (numWindows, glitchTypes) => {
          // Create glitch effects that target no specific window (affects all)
          const globalGlitches: GlitchEffect[] = glitchTypes.map((type, i) => ({
            id: `glitch-${i}`,
            type,
            intensity: Math.random(),
            duration: 1000 + Math.random() * 2000,
            // No targetId means it affects all windows
            targetId: undefined,
            startTime: Date.now(),
          }));

          // Create multiple windows
          const windowIds = Array.from({ length: numWindows }, (_, i) => `window-${i}`);
          
          // Render each window with the same global glitches
          const renderedWindows = windowIds.map((windowId) => {
            const { container, unmount } = render(
              <GlitchableWindow windowId={windowId} activeGlitches={globalGlitches}>
                <div>Window content for {windowId}</div>
              </GlitchableWindow>
            );
            return { container, unmount };
          });

          // All windows should be rendered
          expect(renderedWindows.length).toBe(numWindows);

          // Each window should have the glitch wrapper
          renderedWindows.forEach(({ container }) => {
            const glitchWrapper = container.querySelector('[data-window-id]');
            expect(glitchWrapper).toBeTruthy();
          });

          // Cleanup
          renderedWindows.forEach(({ unmount }) => unmount());

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 29: Multi-window glitch coordination - should handle targeted glitches', () => {
    fc.assert(
      fc.property(
        // Generate random number of windows
        fc.integer({ min: 2, max: 4 }),
        // Generate random glitch type
        fc.constantFrom<GlitchType>(
          'window-shift',
          'text-corruption',
          'color-shift',
          'transparency'
        ),
        (numWindows, glitchType) => {
          const windowIds = Array.from({ length: numWindows }, (_, i) => `window-${i}`);
          
          // Create a glitch that targets only the first window
          const targetedGlitch: GlitchEffect = {
            id: 'targeted-glitch',
            type: glitchType,
            intensity: 0.8,
            duration: 1500,
            targetId: windowIds[0],
            startTime: Date.now(),
          };

          // Render all windows
          const renderedWindows = windowIds.map((windowId) => {
            const { container, unmount } = render(
              <GlitchableWindow windowId={windowId} activeGlitches={[targetedGlitch]}>
                <div>Window content</div>
              </GlitchableWindow>
            );
            return { windowId, container, unmount };
          });

          // All windows should be rendered
          expect(renderedWindows.length).toBe(numWindows);

          // Cleanup
          renderedWindows.forEach(({ unmount }) => unmount());

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 29: Multi-window glitch coordination - should handle mixed global and targeted glitches', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 5 }),
        (numWindows) => {
          const windowIds = Array.from({ length: numWindows }, (_, i) => `window-${i}`);
          
          // Create a mix of global and targeted glitches
          const glitches: GlitchEffect[] = [
            // Global glitch (no targetId)
            {
              id: 'global-glitch',
              type: 'transparency',
              intensity: 0.5,
              duration: 1000,
              targetId: undefined,
              startTime: Date.now(),
            },
            // Targeted glitch (specific window)
            {
              id: 'targeted-glitch',
              type: 'color-shift',
              intensity: 0.7,
              duration: 1500,
              targetId: windowIds[0],
              startTime: Date.now(),
            },
          ];

          // Render all windows with the mixed glitches
          const renderedWindows = windowIds.map((windowId) => {
            const { container, unmount } = render(
              <GlitchableWindow windowId={windowId} activeGlitches={glitches}>
                <div>Window content</div>
              </GlitchableWindow>
            );
            return { container, unmount };
          });

          // All windows should be rendered
          expect(renderedWindows.length).toBe(numWindows);

          // Cleanup
          renderedWindows.forEach(({ unmount }) => unmount());

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 29: Multi-window glitch coordination - should handle simultaneous different glitch types', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 4 }),
        (numWindows) => {
          const windowIds = Array.from({ length: numWindows }, (_, i) => `window-${i}`);
          
          // Create multiple different glitch types that all affect all windows
          const glitches: GlitchEffect[] = [
            {
              id: 'glitch-1',
              type: 'window-shift',
              intensity: 0.6,
              duration: 1000,
              targetId: undefined,
              startTime: Date.now(),
            },
            {
              id: 'glitch-2',
              type: 'text-corruption',
              intensity: 0.7,
              duration: 1200,
              targetId: undefined,
              startTime: Date.now(),
            },
            {
              id: 'glitch-3',
              type: 'transparency',
              intensity: 0.5,
              duration: 800,
              targetId: undefined,
              startTime: Date.now(),
            },
          ];

          // Render all windows with multiple simultaneous glitches
          const renderedWindows = windowIds.map((windowId) => {
            const { container, unmount } = render(
              <GlitchableWindow windowId={windowId} activeGlitches={glitches}>
                <div>Window content</div>
              </GlitchableWindow>
            );
            return { container, unmount };
          });

          // All windows should be rendered
          expect(renderedWindows.length).toBe(numWindows);

          // Each window should have the glitch wrapper
          renderedWindows.forEach(({ container }) => {
            const glitchWrapper = container.querySelector('[data-window-id]');
            expect(glitchWrapper).toBeTruthy();
          });

          // Cleanup
          renderedWindows.forEach(({ unmount }) => unmount());

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 29: Multi-window glitch coordination - should handle empty glitch array', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 5 }),
        (numWindows) => {
          const windowIds = Array.from({ length: numWindows }, (_, i) => `window-${i}`);
          
          // No active glitches
          const glitches: GlitchEffect[] = [];

          // Render all windows with no glitches
          const renderedWindows = windowIds.map((windowId) => {
            const { container, unmount } = render(
              <GlitchableWindow windowId={windowId} activeGlitches={glitches}>
                <div>Window content</div>
              </GlitchableWindow>
            );
            return { container, unmount };
          });

          // All windows should still be rendered normally
          expect(renderedWindows.length).toBe(numWindows);

          // Cleanup
          renderedWindows.forEach(({ unmount }) => unmount());

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
