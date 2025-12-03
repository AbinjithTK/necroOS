import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ClippyGhost } from './ClippyGhost';

// Mock the store
vi.mock('../store', () => ({
  useNecroStore: () => ({
    incrementHauntLevel: vi.fn(),
  }),
}));

// Mock the API
vi.mock('../utils/api', () => ({
  generateAIMessage: vi.fn().mockResolvedValue(
    "I can help you navigate this cursed system... but every action has consequences."
  ),
}));

describe('ClippyGhost', () => {
  const mockOnDismiss = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderClippy = (visible: boolean, message: string = '') => {
    return render(
      <ClippyGhost visible={visible} message={message} onDismiss={mockOnDismiss} />
    );
  };

  describe('visibility', () => {
    it('should render when visible is true', () => {
      renderClippy(true, 'Test message');
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('should not render when visible is false', () => {
      renderClippy(false, 'Test message');
      expect(screen.queryByText('Test message')).not.toBeInTheDocument();
    });

    it('should display window header with title', () => {
      renderClippy(true, 'Test message');
      expect(screen.getByText(/Clippy's Ghost/i)).toBeInTheDocument();
    });
  });

  describe('message display', () => {
    it('should display provided message', () => {
      renderClippy(true, 'Custom message');
      expect(screen.getByText('Custom message')).toBeInTheDocument();
    });

    it('should display fallback message when no message provided', () => {
      renderClippy(true, '');
      // Should display one of the fallback messages
      const messageElement = screen.getByRole('paragraph');
      expect(messageElement.textContent).toBeTruthy();
      expect(messageElement.textContent?.length).toBeGreaterThan(0);
    });

    it('should update message when prop changes', () => {
      const { rerender } = renderClippy(true, 'First message');
      expect(screen.getByText('First message')).toBeInTheDocument();

      rerender(
        <ClippyGhost
          visible={true}
          message="Second message"
          onDismiss={mockOnDismiss}
        />
      );

      expect(screen.getByText('Second message')).toBeInTheDocument();
    });
  });

  describe('user interactions', () => {
    it('should call onDismiss when dismiss button is clicked', () => {
      renderClippy(true, 'Test message');
      const dismissButton = screen.getByRole('button', { name: /dismiss/i });
      fireEvent.click(dismissButton);
      expect(mockOnDismiss).toHaveBeenCalledTimes(1);
    });

    it('should show help message when help button is clicked', async () => {
      renderClippy(true, 'Test message');
      const helpButton = screen.getByRole('button', { name: /help/i });

      fireEvent.click(helpButton);

      // Should show loading message
      expect(screen.getByText(/summoning wisdom/i)).toBeInTheDocument();

      // Wait for help message to appear
      await waitFor(
        () => {
          expect(screen.getByText(/can help you navigate/i)).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it('should disable help button while generating', async () => {
      renderClippy(true, 'Test message');
      const helpButton = screen.getByRole('button', { name: /help/i });

      fireEvent.click(helpButton);

      expect(helpButton).toBeDisabled();

      await waitFor(
        () => {
          expect(helpButton).not.toBeDisabled();
        },
        { timeout: 2000 }
      );
    });
  });

  describe('beforeunload handler', () => {
    it('should set up beforeunload handler when visible', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

      renderClippy(true, 'Test message');

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'beforeunload',
        expect.any(Function)
      );
    });

    it('should clean up beforeunload handler on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { unmount } = renderClippy(true, 'Test message');
      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'beforeunload',
        expect.any(Function)
      );
    });
  });

  describe('avatar', () => {
    it('should display paperclip emoji as avatar', () => {
      renderClippy(true, 'Test message');
      expect(screen.getByText('📎')).toBeInTheDocument();
    });
  });

  describe('buttons', () => {
    it('should render both Help and Dismiss buttons', () => {
      renderClippy(true, 'Test message');
      expect(screen.getByRole('button', { name: /help/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /dismiss/i })).toBeInTheDocument();
    });
  });
});
