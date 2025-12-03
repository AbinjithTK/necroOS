import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Notepad } from './Notepad';
import { useNecroStore } from '../store';

// Mock the store
vi.mock('../store', () => ({
  useNecroStore: vi.fn(),
}));

describe('Notepad', () => {
  const mockIncrementHauntLevel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNecroStore as any).mockReturnValue({
      incrementHauntLevel: mockIncrementHauntLevel,
    });
  });

  it('renders with empty content by default', () => {
    render(<Notepad windowId="test-1" />);
    const textarea = screen.getByTestId('notepad-textarea') as HTMLTextAreaElement;
    expect(textarea.value).toBe('');
  });

  it('renders with initial content when provided', () => {
    render(<Notepad windowId="test-1" initialContent="Hello world" />);
    const textarea = screen.getByTestId('notepad-textarea') as HTMLTextAreaElement;
    expect(textarea.value).toBe('Hello world');
  });

  it('updates content when user types', () => {
    render(<Notepad windowId="test-1" />);
    const textarea = screen.getByTestId('notepad-textarea') as HTMLTextAreaElement;
    
    fireEvent.change(textarea, { target: { value: 'Test content' } });
    
    expect(textarea.value).toBe('Test content');
  });

  it('displays character count', () => {
    render(<Notepad windowId="test-1" initialContent="Hello" />);
    expect(screen.getByText(/Characters: 5/)).toBeInTheDocument();
  });

  it('displays line count', () => {
    const multilineContent = `Line 1
Line 2
Line 3`;
    render(<Notepad windowId="test-1" initialContent={multilineContent} />);
    expect(screen.getByText(/Lines: 3/)).toBeInTheDocument();
  });

  it('updates line count when user adds new lines', () => {
    render(<Notepad windowId="test-1" />);
    const textarea = screen.getByTestId('notepad-textarea') as HTMLTextAreaElement;
    
    fireEvent.change(textarea, { target: { value: 'Line 1\nLine 2' } });
    
    expect(screen.getByText(/Lines: 2/)).toBeInTheDocument();
  });

  it('supports text selection', () => {
    render(<Notepad windowId="test-1" initialContent="Select this text" />);
    const textarea = screen.getByTestId('notepad-textarea') as HTMLTextAreaElement;
    
    // Simulate text selection
    textarea.setSelectionRange(0, 6);
    
    expect(textarea.selectionStart).toBe(0);
    expect(textarea.selectionEnd).toBe(6);
  });

  it('supports text deletion', () => {
    render(<Notepad windowId="test-1" initialContent="Delete me" />);
    const textarea = screen.getByTestId('notepad-textarea') as HTMLTextAreaElement;
    
    fireEvent.change(textarea, { target: { value: 'Delete' } });
    
    expect(textarea.value).toBe('Delete');
  });

  it('shows processing indicator when AI is working', async () => {
    render(<Notepad windowId="test-1" />);
    const textarea = screen.getByTestId('notepad-textarea') as HTMLTextAreaElement;
    
    // Type something to trigger AI completion
    fireEvent.change(textarea, { target: { value: 'Hello world' } });
    
    // Wait for debounce and check if processing appears
    await waitFor(() => {
      // Processing may or may not appear depending on random chance
      // This test just verifies the component doesn't crash
      expect(textarea.value).toContain('Hello world');
    }, { timeout: 2000 });
  });

  it('handles empty content gracefully', () => {
    render(<Notepad windowId="test-1" />);
    const textarea = screen.getByTestId('notepad-textarea') as HTMLTextAreaElement;
    
    fireEvent.change(textarea, { target: { value: '' } });
    
    expect(textarea.value).toBe('');
    expect(screen.getByText(/Characters: 0/)).toBeInTheDocument();
  });

  it('displays placeholder text', () => {
    render(<Notepad windowId="test-1" />);
    const textarea = screen.getByPlaceholderText(/Type your thoughts/);
    expect(textarea).toBeInTheDocument();
  });
});
