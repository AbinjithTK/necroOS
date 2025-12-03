/**
 * Property-Based Tests for ClippyGhost Component
 * Feature: necro-os
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { render, screen, fireEvent, cleanup, within } from '@testing-library/react';
import { ClippyGhost } from './ClippyGhost';

// Mock the store
const mockIncrementHauntLevel = vi.fn();
vi.mock('../store', () => ({
  useNecroStore: () => ({
    incrementHauntLevel: mockIncrementHauntLevel,
  }),
}));

describe('ClippyGhost Property Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  /**
   * Property 24: Clippy appearance on haunt threshold
   * For any haunt level increase that crosses a threshold, Clippy's Ghost should become
   * visible with a contextual message.
   * Validates: Requirements 8.1
   */
  describe('Property 24: Clippy appearance on haunt threshold', () => {
    it('should be visible when visible prop is true', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 5, maxLength: 100 }).filter(s => s.trim().length >= 5),
          (message) => {
            const mockOnDismiss = vi.fn();
            const { container } = render(
              <ClippyGhost visible={true} message={message} onDismiss={mockOnDismiss} />
            );

            // Component should be rendered (not null)
            const result = container.firstChild !== null;
            cleanup();
            return result;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not be visible when visible prop is false', () => {
      fc.assert(
        fc.property(
          fc.string(),
          (message) => {
            const mockOnDismiss = vi.fn();
            const { container } = render(
              <ClippyGhost visible={false} message={message} onDismiss={mockOnDismiss} />
            );

            // Component should return null when not visible
            const result = container.firstChild === null;
            cleanup();
            return result;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should always display some message when visible', () => {
      fc.assert(
        fc.property(
          fc.string(),
          (message) => {
            const mockOnDismiss = vi.fn();
            const { container } = render(
              <ClippyGhost visible={true} message={message} onDismiss={mockOnDismiss} />
            );

            // Should display either the provided message or a fallback
            const messageElement = container.querySelector('p');
            const result = messageElement !== null && messageElement.textContent !== '';
            cleanup();
            return result;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 25: Clippy dismissal and re-summoning
   * For any Clippy dismissal, the system should allow hiding Clippy, but Clippy may
   * reappear if haunt level conditions are met.
   * Validates: Requirements 8.5
   */
  describe('Property 25: Clippy dismissal and re-summoning', () => {
    it('should call onDismiss when dismiss button is clicked', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1 }),
          (message) => {
            const mockOnDismiss = vi.fn();
            const { container } = render(
              <ClippyGhost visible={true} message={message} onDismiss={mockOnDismiss} />
            );

            const dismissButton = within(container).getByRole('button', { name: /dismiss/i });
            fireEvent.click(dismissButton);

            const result = mockOnDismiss.mock.calls.length === 1;
            cleanup();
            return result;
          }
        ),
        { numRuns: 100 }
      );
    }, 15000); // Increase timeout for property test with many renders

    it('should increment haunt level when dismissed', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1 }),
          (message) => {
            mockIncrementHauntLevel.mockClear();
            const mockOnDismiss = vi.fn();

            const { container } = render(
              <ClippyGhost visible={true} message={message} onDismiss={mockOnDismiss} />
            );

            const dismissButton = within(container).getByRole('button', { name: /dismiss/i });
            fireEvent.click(dismissButton);

            // Should increment haunt level when dismissed
            const result = mockIncrementHauntLevel.mock.calls.length === 1;
            cleanup();
            return result;
          }
        ),
        { numRuns: 100 }
      );
    }, 15000); // Increase timeout for property test with many renders

    it('should allow re-summoning after dismissal by changing visible prop', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1 }),
          fc.string({ minLength: 1 }),
          (firstMessage, secondMessage) => {
            const mockOnDismiss = vi.fn();

            // First render - visible
            const { rerender, container } = render(
              <ClippyGhost visible={true} message={firstMessage} onDismiss={mockOnDismiss} />
            );

            // Dismiss
            const dismissButton = within(container).getByRole('button', { name: /dismiss/i });
            fireEvent.click(dismissButton);

            // Simulate dismissal by setting visible to false
            rerender(
              <ClippyGhost visible={false} message={firstMessage} onDismiss={mockOnDismiss} />
            );

            // Should not be visible
            const hiddenState = container.firstChild === null;

            // Re-summon with new message
            rerender(
              <ClippyGhost visible={true} message={secondMessage} onDismiss={mockOnDismiss} />
            );

            // Should be visible again
            const visibleAgain = container.firstChild !== null;

            cleanup();
            return hiddenState && visibleAgain;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should update message content when re-summoned', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 10, maxLength: 50 }).filter(s => s.trim().length >= 10),
          fc.string({ minLength: 10, maxLength: 50 }).filter(s => s.trim().length >= 10),
          (firstMessage, secondMessage) => {
            // Ensure messages are different
            if (firstMessage.trim() === secondMessage.trim()) {
              return true; // Skip this case
            }

            const mockOnDismiss = vi.fn();

            // First appearance
            const { rerender, container } = render(
              <ClippyGhost visible={true} message={firstMessage} onDismiss={mockOnDismiss} />
            );

            const messageElement = container.querySelector('p');
            const firstContent = messageElement?.textContent || '';

            // Re-summon with different message
            rerender(
              <ClippyGhost visible={true} message={secondMessage} onDismiss={mockOnDismiss} />
            );

            const secondContent = messageElement?.textContent || '';

            // Content should have changed
            const result = firstContent !== secondContent;
            cleanup();
            return result;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
