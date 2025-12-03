import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BootScreen } from './BootScreen';

describe('BootScreen', () => {
  it('should display BIOS messages progressively', async () => {
    const onBootComplete = vi.fn();
    render(<BootScreen onBootComplete={onBootComplete} />);

    // Initially should show first message
    await waitFor(() => {
      expect(screen.getByText(/NecroOS BIOS/i)).toBeInTheDocument();
    });
  });

  it('should show progress bar after key press', async () => {
    const onBootComplete = vi.fn();
    render(<BootScreen onBootComplete={onBootComplete} />);

    // Wait for all BIOS messages to appear
    await waitFor(() => {
      expect(screen.getByText(/Press any key to continue/i)).toBeInTheDocument();
    }, { timeout: 5000 });

    // Press a key
    fireEvent.keyDown(window, { key: 'Enter' });

    // Progress bar should appear
    await waitFor(() => {
      expect(screen.getByText(/Loading NecroOS/i)).toBeInTheDocument();
    });
  });

  it('should call onBootComplete when progress reaches 100%', async () => {
    const onBootComplete = vi.fn();
    render(<BootScreen onBootComplete={onBootComplete} />);

    // Wait for messages
    await waitFor(() => {
      expect(screen.getByText(/Press any key to continue/i)).toBeInTheDocument();
    }, { timeout: 5000 });

    // Trigger progress
    fireEvent.keyDown(window, { key: 'Enter' });

    // Wait for boot to complete (progress bar animation takes time)
    await waitFor(() => {
      expect(onBootComplete).toHaveBeenCalled();
    }, { timeout: 15000 });
  }, 20000); // Increase test timeout to 20 seconds

  it('should respond to click as well as keypress', async () => {
    const onBootComplete = vi.fn();
    render(<BootScreen onBootComplete={onBootComplete} />);

    // Wait for messages (needs longer timeout due to progressive display with random delays)
    await waitFor(() => {
      expect(screen.getByText(/Press any key to continue/i)).toBeInTheDocument();
    }, { timeout: 10000 });

    // Click instead of key press
    fireEvent.click(window);

    // Progress bar should appear
    await waitFor(() => {
      expect(screen.getByText(/Loading NecroOS/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  }, 20000); // Increase test timeout to 20 seconds
});
