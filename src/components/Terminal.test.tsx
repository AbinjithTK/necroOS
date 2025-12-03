import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Terminal } from './Terminal';
import { useNecroStore } from '../store';

describe('Terminal Component', () => {
  beforeEach(() => {
    // Reset store before each test
    const store = useNecroStore.getState();
    store.windows = [];
    store.hauntLevel = 0;
    store.activeGlitches = [];
  });

  it('renders terminal with welcome message', () => {
    render(<Terminal windowId="test-terminal" />);
    
    expect(screen.getByText(/Welcome to The Summoning Circle/i)).toBeInTheDocument();
    expect(screen.getByText(/Type "help" if you dare seek guidance/i)).toBeInTheDocument();
  });

  it('displays help command output', () => {
    render(<Terminal windowId="test-terminal" />);
    
    const input = screen.getByTestId('terminal-input');
    fireEvent.change(input, { target: { value: 'help' } });
    fireEvent.submit(input.closest('form')!);
    
    expect(screen.getByText(/There is no help for you here/i)).toBeInTheDocument();
    expect(screen.getByText(/Available commands:/i)).toBeInTheDocument();
  });

  it('handles unknown commands with error message', () => {
    render(<Terminal windowId="test-terminal" />);
    
    const input = screen.getByTestId('terminal-input');
    fireEvent.change(input, { target: { value: 'unknown' } });
    fireEvent.submit(input.closest('form')!);
    
    expect(screen.getByText(/Command not found: unknown/i)).toBeInTheDocument();
    expect(screen.getByText(/The void does not recognize your words/i)).toBeInTheDocument();
  });

  it('clears terminal with clear command', () => {
    render(<Terminal windowId="test-terminal" />);
    
    const input = screen.getByTestId('terminal-input');
    
    // First add some output
    fireEvent.change(input, { target: { value: 'help' } });
    fireEvent.submit(input.closest('form')!);
    
    // Then clear
    fireEvent.change(input, { target: { value: 'clear' } });
    fireEvent.submit(input.closest('form')!);
    
    // Welcome message should be gone
    expect(screen.queryByText(/Welcome to The Summoning Circle/i)).not.toBeInTheDocument();
  });

  it('resurrect command shows error when no windows closed', () => {
    render(<Terminal windowId="test-terminal" />);
    
    const input = screen.getByTestId('terminal-input');
    fireEvent.change(input, { target: { value: 'resurrect' } });
    fireEvent.submit(input.closest('form')!);
    
    expect(screen.getByText(/There are no souls to resurrect/i)).toBeInTheDocument();
  });

  it('resurrect command opens last closed window', async () => {
    const { openWindow, closeWindow } = useNecroStore.getState();
    
    // Render terminal first so it can track window closures
    const { rerender } = render(<Terminal windowId="test-terminal" />);
    
    // Open a window
    openWindow('notepad');
    const windowId = useNecroStore.getState().windows.find(w => w.type === 'notepad')?.id;
    
    if (!windowId) {
      throw new Error('Window not found');
    }
    
    // Force a re-render to ensure Terminal sees the new window
    rerender(<Terminal windowId="test-terminal" />);
    
    // Wait a bit for React to process
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Close the window
    closeWindow(windowId);
    
    // Force another re-render to ensure Terminal sees the closure
    rerender(<Terminal windowId="test-terminal" />);
    
    // Wait for Terminal to process the closure
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const input = screen.getByTestId('terminal-input');
    fireEvent.change(input, { target: { value: 'resurrect' } });
    fireEvent.submit(input.closest('form')!);
    
    await waitFor(() => {
      expect(screen.getByText(/Resurrecting notepad/i)).toBeInTheDocument();
    });
  });

  it('exorcise command displays success message', () => {
    render(<Terminal windowId="test-terminal" />);
    
    const input = screen.getByTestId('terminal-input');
    fireEvent.change(input, { target: { value: 'exorcise' } });
    fireEvent.submit(input.closest('form')!);
    
    expect(screen.getByText(/Performing exorcism ritual/i)).toBeInTheDocument();
    expect(screen.getByText(/But they will return/i)).toBeInTheDocument();
  });

  it('sudo kill command triggers crash effect', () => {
    render(<Terminal windowId="test-terminal" />);
    
    const input = screen.getByTestId('terminal-input');
    fireEvent.change(input, { target: { value: 'sudo kill' } });
    fireEvent.submit(input.closest('form')!);
    
    expect(screen.getByText(/SYSTEM CRASH INITIATED/i)).toBeInTheDocument();
    expect(screen.getByText(/FATAL EXCEPTION/i)).toBeInTheDocument();
  });

  it('clears input after command submission', () => {
    render(<Terminal windowId="test-terminal" />);
    
    const input = screen.getByTestId('terminal-input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'help' } });
    fireEvent.submit(input.closest('form')!);
    
    expect(input.value).toBe('');
  });

  it('navigates command history with arrow keys', () => {
    render(<Terminal windowId="test-terminal" />);
    
    const input = screen.getByTestId('terminal-input') as HTMLInputElement;
    
    // Execute two commands
    fireEvent.change(input, { target: { value: 'help' } });
    fireEvent.submit(input.closest('form')!);
    
    fireEvent.change(input, { target: { value: 'clear' } });
    fireEvent.submit(input.closest('form')!);
    
    // Press up arrow to get last command
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(input.value).toBe('clear');
    
    // Press up arrow again to get previous command
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(input.value).toBe('help');
    
    // Press down arrow to go forward
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(input.value).toBe('clear');
  });

  it('increments haunt level on command execution', () => {
    render(<Terminal windowId="test-terminal" />);
    
    const initialHauntLevel = useNecroStore.getState().hauntLevel;
    
    const input = screen.getByTestId('terminal-input');
    fireEvent.change(input, { target: { value: 'resurrect' } });
    fireEvent.submit(input.closest('form')!);
    
    // Haunt level should not increase for resurrect with no windows
    // But unknown commands should increase it
    fireEvent.change(input, { target: { value: 'badcommand' } });
    fireEvent.submit(input.closest('form')!);
    
    expect(useNecroStore.getState().hauntLevel).toBeGreaterThan(initialHauntLevel);
  });
});
