import { describe, test, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { useNecroStore } from './index';
import type { WindowType } from './types';

describe('NecroOS Store Property Tests', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    const store = useNecroStore.getState();
    store.windows.forEach((w) => store.closeWindow(w.id));
    useNecroStore.setState({
      hauntLevel: 0,
      windows: [],
      activeGlitches: [],
      lastJumpScareTime: 0,
      clippyVisible: false,
      clippyMessage: '',
    });
  });

  // Feature: necro-os, Property 5: Haunt level monotonic increase
  // Validates: Requirements 9.1
  test('2.1 - haunt level never decreases', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 1, max: 10 }), { minLength: 1, maxLength: 20 }),
        (increments) => {
          const store = useNecroStore.getState();
          let previousLevel = store.hauntLevel;

          for (const increment of increments) {
            store.incrementHauntLevel(increment);
            const currentLevel = useNecroStore.getState().hauntLevel;

            if (currentLevel < previousLevel) {
              return false;
            }

            previousLevel = currentLevel;
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: necro-os, Property 1: Window creation uniqueness
  // Validates: Requirements 13.1
  test('2.2 - window IDs are always unique', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.constantFrom<WindowType>(
            'notepad',
            'terminal',
            'minesweeper',
            'portfolio',
            'my-corpse',
            'readme',
            'dark-web'
          ),
          { minLength: 1, maxLength: 10 }
        ),
        (windowTypes) => {
          // Reset store state for each property test iteration
          useNecroStore.setState({
            hauntLevel: 0,
            windows: [],
            activeGlitches: [],
            lastJumpScareTime: 0,
            clippyVisible: false,
            clippyMessage: '',
          });
          
          const store = useNecroStore.getState();
          const ids: string[] = [];

          for (const type of windowTypes) {
            store.openWindow(type);
            const windows = useNecroStore.getState().windows;
            ids.push(windows[windows.length - 1].id);
          }

          const uniqueIds = new Set(ids);
          return ids.length === uniqueIds.size;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: necro-os, Property 2: Z-index ordering consistency
  // Validates: Requirements 13.2
  test('2.3 - focused window always has highest z-index', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.constantFrom<WindowType>(
            'notepad',
            'terminal',
            'minesweeper',
            'portfolio',
            'my-corpse'
          ),
          { minLength: 2, maxLength: 5 }
        ),
        fc.integer({ min: 0, max: 4 }),
        (windowTypes, focusIndex) => {
          const store = useNecroStore.getState();

          // Open windows
          for (const type of windowTypes) {
            store.openWindow(type);
          }

          const windows = useNecroStore.getState().windows;
          if (windows.length === 0) return true;

          // Focus a window
          const indexToFocus = focusIndex % windows.length;
          const windowToFocus = windows[indexToFocus];
          store.focusWindow(windowToFocus.id);

          // Check that focused window has highest z-index
          const updatedWindows = useNecroStore.getState().windows;
          const focusedWindow = updatedWindows.find((w) => w.id === windowToFocus.id);
          const maxZIndex = Math.max(...updatedWindows.map((w) => w.zIndex));

          return focusedWindow?.zIndex === maxZIndex;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: necro-os, Property 3: Window state preservation on minimize/restore
  // Validates: Requirements 13.4, 13.5
  test('2.4 - minimizing then restoring preserves window state', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<WindowType>(
          'notepad',
          'terminal',
          'minesweeper',
          'portfolio',
          'my-corpse',
          'readme',
          'dark-web'
        ),
        (windowType) => {
          const store = useNecroStore.getState();

          // Open a window
          store.openWindow(windowType);
          const windows = useNecroStore.getState().windows;
          const originalWindow = windows[0];

          // Store original state
          const originalState = {
            type: originalWindow.type,
            title: originalWindow.title,
            position: { ...originalWindow.position },
            size: { ...originalWindow.size },
            content: originalWindow.content,
          };

          // Minimize then restore
          store.minimizeWindow(originalWindow.id);
          store.restoreWindow(originalWindow.id);

          // Check state preservation
          const restoredWindow = useNecroStore.getState().windows.find(
            (w) => w.id === originalWindow.id
          );

          if (!restoredWindow) return false;

          return (
            restoredWindow.type === originalState.type &&
            restoredWindow.title === originalState.title &&
            restoredWindow.position.x === originalState.position.x &&
            restoredWindow.position.y === originalState.position.y &&
            restoredWindow.size.width === originalState.size.width &&
            restoredWindow.size.height === originalState.size.height &&
            restoredWindow.minimized === false
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: necro-os, Property 4: Window cleanup on close
  // Validates: Requirements 13.3
  test('2.5 - closing window removes it from stack', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.constantFrom<WindowType>(
            'notepad',
            'terminal',
            'minesweeper',
            'portfolio',
            'my-corpse'
          ),
          { minLength: 1, maxLength: 5 }
        ),
        fc.integer({ min: 0, max: 4 }),
        (windowTypes, closeIndex) => {
          const store = useNecroStore.getState();

          // Open windows
          for (const type of windowTypes) {
            store.openWindow(type);
          }

          const windowsBefore = useNecroStore.getState().windows;
          if (windowsBefore.length === 0) return true;

          // Close a window
          const indexToClose = closeIndex % windowsBefore.length;
          const windowToClose = windowsBefore[indexToClose];
          store.closeWindow(windowToClose.id);

          // Verify window is removed
          const windowsAfter = useNecroStore.getState().windows;
          const windowStillExists = windowsAfter.some((w) => w.id === windowToClose.id);

          return !windowStillExists && windowsAfter.length === windowsBefore.length - 1;
        }
      ),
      { numRuns: 100 }
    );
  });
});
