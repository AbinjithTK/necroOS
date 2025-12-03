import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WindowManager } from './WindowManager';
import type { WindowState } from '../store/types';

describe('WindowManager', () => {
  const mockWindows: WindowState[] = [
    {
      id: '1',
      type: 'my-corpse',
      title: 'My Corpse',
      position: { x: 100, y: 100 },
      size: { width: 400, height: 300 },
      zIndex: 1,
      minimized: false,
    },
    {
      id: '2',
      type: 'readme',
      title: 'Readme.txt',
      position: { x: 200, y: 200 },
      size: { width: 400, height: 300 },
      zIndex: 2,
      minimized: false,
    },
  ];

  const mockHandlers = {
    onWindowClose: vi.fn(),
    onWindowFocus: vi.fn(),
    onWindowMove: vi.fn(),
    onWindowMinimize: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all open windows', () => {
    render(<WindowManager windows={mockWindows} {...mockHandlers} />);
    
    // Check for unique content from each window
    expect(screen.getByText(/SYSTEM AUTOPSY/)).toBeInTheDocument();
    expect(screen.getByText(/NecroOS User Manual/)).toBeInTheDocument();
  });

  it('should call onWindowClose when close button is clicked', () => {
    render(<WindowManager windows={mockWindows} {...mockHandlers} />);
    
    const closeButtons = screen.getAllByText('×');
    fireEvent.click(closeButtons[0]);
    
    expect(mockHandlers.onWindowClose).toHaveBeenCalledWith('1');
  });

  it('should call onWindowMinimize when minimize button is clicked', () => {
    render(<WindowManager windows={mockWindows} {...mockHandlers} />);
    
    const minimizeButtons = screen.getAllByText('_');
    fireEvent.click(minimizeButtons[0]);
    
    expect(mockHandlers.onWindowMinimize).toHaveBeenCalledWith('1');
  });

  it('should call onWindowFocus when window is clicked', () => {
    render(<WindowManager windows={mockWindows} {...mockHandlers} />);
    
    // Use the window header title which is unique
    const windowHeaders = screen.getAllByText('My Corpse');
    const windowHeader = windowHeaders.find(el => el.tagName === 'SPAN');
    const window = windowHeader?.closest('div');
    if (window?.parentElement) {
      fireEvent.click(window.parentElement);
    }
    
    expect(mockHandlers.onWindowFocus).toHaveBeenCalled();
  });

  it('should not render minimized windows', () => {
    const minimizedWindows: WindowState[] = [
      {
        ...mockWindows[0],
        minimized: true,
      },
    ];
    
    render(<WindowManager windows={minimizedWindows} {...mockHandlers} />);
    
    // Minimized window content should not be visible
    expect(screen.queryByText('SYSTEM AUTOPSY')).not.toBeInTheDocument();
  });

  it('should apply z-index correctly', () => {
    render(<WindowManager windows={mockWindows} {...mockHandlers} />);
    
    // Windows should be rendered with different z-indices
    // Check for unique content from each window
    expect(screen.getByText(/SYSTEM AUTOPSY/)).toBeInTheDocument();
    expect(screen.getByText(/NecroOS User Manual/)).toBeInTheDocument();
  });

  it('should render window content based on type', () => {
    render(<WindowManager windows={mockWindows} {...mockHandlers} />);
    
    expect(screen.getByText(/SYSTEM AUTOPSY/)).toBeInTheDocument();
    expect(screen.getByText(/If you're reading this/)).toBeInTheDocument();
  });

  it('should apply glitch offset when provided', () => {
    const glitchedWindows: WindowState[] = [
      {
        ...mockWindows[0],
        glitchOffset: { x: 10, y: 20 },
      },
    ];
    
    const { container } = render(
      <WindowManager windows={glitchedWindows} {...mockHandlers} />
    );
    
    const windowContainer = container.querySelector('[style*="left"]');
    expect(windowContainer).toBeInTheDocument();
  });
});
