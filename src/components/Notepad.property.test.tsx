import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import * as fc from 'fast-check';
import { Notepad } from './Notepad';
import { useNecroStore } from '../store';

// Mock the store
vi.mock('../store', () => ({
  useNecroStore: vi.fn(),
}));

/**
 * Feature: necro-os, Property 15: Notepad text editing operations
 * Validates: Requirements 4.4
 * 
 * For any sequence of text editing operations (type, delete, select),
 * the Notepad content should reflect the operations correctly.
 */
describe('Notepad Property-Based Tests', () => {
  const mockIncrementHauntLevel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNecroStore as any).mockReturnValue({
      incrementHauntLevel: mockIncrementHauntLevel,
    });
  });

  it('Property 15: text editing operations are correctly reflected', () => {
    // Define text editing operations
    type EditOperation = 
      | { type: 'insert'; text: string }
      | { type: 'delete'; count: number }
      | { type: 'replace'; text: string };

    // Generator for edit operations
    const editOperationArb = fc.oneof(
      fc.record({
        type: fc.constant('insert' as const),
        text: fc.string({ minLength: 1, maxLength: 50 }),
      }),
      fc.record({
        type: fc.constant('delete' as const),
        count: fc.integer({ min: 1, max: 10 }),
      }),
      fc.record({
        type: fc.constant('replace' as const),
        text: fc.string({ minLength: 0, maxLength: 50 }),
      })
    );

    fc.assert(
      fc.property(
        fc.string({ maxLength: 100 }), // Initial content
        fc.array(editOperationArb, { minLength: 1, maxLength: 10 }), // Operations
        (initialContent, operations) => {
          // Render component
          const { unmount } = render(
            <Notepad windowId="test-prop" initialContent={initialContent} />
          );

          const textarea = screen.getByTestId('notepad-textarea') as HTMLTextAreaElement;

          // Verify initial content
          expect(textarea.value).toBe(initialContent);

          // Apply operations and track expected content
          let expectedContent = initialContent;

          for (const operation of operations) {
            switch (operation.type) {
              case 'insert':
                // Insert text at the end
                expectedContent = expectedContent + operation.text;
                fireEvent.change(textarea, { target: { value: expectedContent } });
                break;

              case 'delete':
                // Delete characters from the end (only if there's content to delete)
                if (expectedContent.length > 0) {
                  const deleteCount = Math.min(operation.count, expectedContent.length);
                  expectedContent = expectedContent.slice(0, -deleteCount);
                  fireEvent.change(textarea, { target: { value: expectedContent } });
                }
                break;

              case 'replace':
                // Replace entire content
                expectedContent = operation.text;
                fireEvent.change(textarea, { target: { value: expectedContent } });
                break;
            }

            // Verify content matches expected
            if (textarea.value !== expectedContent) {
              unmount();
              return false;
            }
          }

          // Verify final content
          const finalMatch = textarea.value === expectedContent;

          // Verify character count and line count from status bar
          const statusBarText = screen.getByText(/Lines: \d+ \| Characters: \d+/);
          const charCountMatch = statusBarText.textContent?.match(/Characters: (\d+)/);
          const lineCountMatch = statusBarText.textContent?.match(/Lines: (\d+)/);
          
          const displayedCharCount = charCountMatch ? parseInt(charCountMatch[1]) : -1;
          const displayedLineCount = lineCountMatch ? parseInt(lineCountMatch[1]) : -1;
          const expectedLineCount = expectedContent.split('\n').length;
          
          const charCountCorrect = displayedCharCount === expectedContent.length;
          const lineCountCorrect = displayedLineCount === expectedLineCount;

          unmount();

          return finalMatch && charCountCorrect && lineCountCorrect;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 15: typing operations preserve text integrity', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 10 }),
        (textSegments) => {
          const { unmount } = render(<Notepad windowId="test-prop-2" />);
          const textarea = screen.getByTestId('notepad-textarea') as HTMLTextAreaElement;

          let expectedContent = '';

          // Type each segment sequentially
          for (const segment of textSegments) {
            expectedContent += segment;
            fireEvent.change(textarea, { target: { value: expectedContent } });

            // Verify content after each operation
            if (textarea.value !== expectedContent) {
              unmount();
              return false;
            }
          }

          const result = textarea.value === expectedContent;
          unmount();
          return result;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 15: deletion operations maintain consistency', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 10, maxLength: 100 }),
        fc.array(fc.integer({ min: 1, max: 5 }), { minLength: 1, maxLength: 10 }),
        (initialContent, deleteCounts) => {
          const { unmount } = render(
            <Notepad windowId="test-prop-3" initialContent={initialContent} />
          );
          const textarea = screen.getByTestId('notepad-textarea') as HTMLTextAreaElement;

          let expectedContent = initialContent;

          // Apply deletions
          for (const deleteCount of deleteCounts) {
            const actualDeleteCount = Math.min(deleteCount, expectedContent.length);
            expectedContent = expectedContent.slice(0, -actualDeleteCount);
            fireEvent.change(textarea, { target: { value: expectedContent } });

            // Verify content after each deletion
            if (textarea.value !== expectedContent) {
              unmount();
              return false;
            }

            // Stop if content is empty
            if (expectedContent.length === 0) {
              break;
            }
          }

          const result = textarea.value === expectedContent;
          unmount();
          return result;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 15: character count always matches content length', () => {
    fc.assert(
      fc.property(
        fc.string({ maxLength: 200 }),
        (content) => {
          const { unmount } = render(
            <Notepad windowId="test-prop-4" initialContent={content} />
          );

          // Find the status bar text that contains character count
          const statusBarText = screen.getByText(/Lines: \d+ \| Characters: \d+/);
          const charCountMatch = statusBarText.textContent?.match(/Characters: (\d+)/);
          const displayedCharCount = charCountMatch ? parseInt(charCountMatch[1]) : -1;
          
          const result = displayedCharCount === content.length;
          unmount();
          return result;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 15: line count always matches newline count', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ maxLength: 50 }), { maxLength: 20 }),
        (lines) => {
          const content = lines.join('\n');
          const { unmount } = render(
            <Notepad windowId="test-prop-5" initialContent={content} />
          );

          const statusBarText = screen.getByText(/Lines: \d+ \| Characters: \d+/);
          const lineCountMatch = statusBarText.textContent?.match(/Lines: (\d+)/);
          const displayedLineCount = lineCountMatch ? parseInt(lineCountMatch[1]) : -1;
          const expectedLineCount = content.split('\n').length;
          
          const result = displayedLineCount === expectedLineCount;
          unmount();
          return result;
        }
      ),
      { numRuns: 100 }
    );
  });
});
