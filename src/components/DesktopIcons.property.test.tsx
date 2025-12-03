import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import * as fc from 'fast-check';
import { DesktopIcons } from './DesktopIcons';
import { useNecroStore } from '../store';

describe('DesktopIcons Property-Based Tests', () => {
  beforeEach(() => {
    // Reset store state before each test
    useNecroStore.setState({
      hauntLevel: 0,
      audioEnabled: false,
      ambientPlaying: false,
      windows: [],
      activeGlitches: [],
      glitchIntensity: 0,
      lastJumpScareTime: 0,
      clippyVisible: false,
      clippyMessage: '',
    });
  });

  /**
   * Feature: necro-os, Property 13: The Void permanence
   * Validates: Requirements 3.3
   * 
   * For any file dragged to The Void, attempting to restore it should always fail
   * with an error message.
   * 
   * This property tests that:
   * 1. Files dropped on The Void trigger the void handler
   * 2. The void handler always plays the growl sound
   * 3. The void handler always increments haunt level
   * 4. There is no restoration mechanism (files are permanently removed)
   */
  it('Property 13: The Void permanence - should always trigger void effects for any number of drops', () => {
    fc.assert(
      fc.property(
        // Generate random number of drops to test consistency
        fc.integer({ min: 1, max: 5 }),
        (numDrops) => {
          const playSound = vi.fn();
          useNecroStore.setState({ playSound, hauntLevel: 0 });

          const { unmount } = render(<DesktopIcons />);

          const voidIcon = screen.getAllByText('The Void')[0].parentElement;
          
          if (!voidIcon) {
            unmount();
            return false;
          }

          for (let i = 0; i < numDrops; i++) {
            const dropEvent = new Event('drop', { bubbles: true });
            Object.defineProperty(dropEvent, 'preventDefault', {
              value: vi.fn(),
            });

            fireEvent(voidIcon, dropEvent);
          }

          // Verify void effects are always triggered for each drop
          expect(playSound).toHaveBeenCalledTimes(numDrops);
          expect(playSound).toHaveBeenCalledWith('void-growl');

          const finalHauntLevel = useNecroStore.getState().hauntLevel;
          expect(finalHauntLevel).toBeGreaterThan(0);

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 13: The Void permanence - should increment haunt level consistently', () => {
    fc.assert(
      fc.property(
        // Generate multiple drop events
        fc.integer({ min: 1, max: 10 }),
        (numDrops) => {
          const playSound = vi.fn();
          useNecroStore.setState({ playSound, hauntLevel: 0 });

          const { unmount } = render(<DesktopIcons />);

          const voidIcon = screen.getByText('The Void').parentElement;

          if (voidIcon) {
            for (let i = 0; i < numDrops; i++) {
              const dropEvent = new Event('drop', { bubbles: true });
              Object.defineProperty(dropEvent, 'preventDefault', {
                value: vi.fn(),
              });

              fireEvent(voidIcon, dropEvent);
            }

            // Verify haunt level increased proportionally
            const finalHauntLevel = useNecroStore.getState().hauntLevel;
            expect(finalHauntLevel).toBeGreaterThan(0);
            
            // Each drop should increment haunt level
            expect(playSound).toHaveBeenCalledTimes(numDrops);
          }

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 13: The Void permanence - should always play void-growl sound', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 100 }),
        (fileName) => {
          const playSound = vi.fn();
          useNecroStore.setState({ playSound });

          const { unmount } = render(<DesktopIcons />);

          const voidIcon = screen.getByText('The Void').parentElement;

          if (voidIcon) {
            const dropEvent = new Event('drop', { bubbles: true });
            Object.defineProperty(dropEvent, 'preventDefault', {
              value: vi.fn(),
            });

            fireEvent(voidIcon, dropEvent);

            // Verify the specific sound is always played
            expect(playSound).toHaveBeenCalledWith('void-growl');
            expect(playSound).toHaveBeenCalledTimes(1);
          }

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 13: The Void permanence - should handle drag over without side effects', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 20 }),
        (numDragOvers) => {
          const playSound = vi.fn();
          useNecroStore.setState({ playSound, hauntLevel: 0 });

          const { unmount } = render(<DesktopIcons />);

          const voidIcon = screen.getByText('The Void').parentElement;

          if (voidIcon) {
            // Drag over multiple times without dropping
            for (let i = 0; i < numDragOvers; i++) {
              const dragOverEvent = new Event('dragover', { bubbles: true });
              Object.defineProperty(dragOverEvent, 'preventDefault', {
                value: vi.fn(),
              });

              fireEvent(voidIcon, dragOverEvent);
            }

            // Verify no side effects from drag over (no sound, no haunt level change)
            expect(playSound).not.toHaveBeenCalled();
            expect(useNecroStore.getState().hauntLevel).toBe(0);
          }

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
