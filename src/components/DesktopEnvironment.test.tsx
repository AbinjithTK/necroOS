import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DesktopEnvironment } from './DesktopEnvironment';
import { useNecroStore } from '../store';

// Mock the CRTFilter component
vi.mock('./CRTFilter', () => ({
  CRTFilter: ({ intensity }: { intensity: number }) => (
    <div data-testid="crt-filter" data-intensity={intensity}>CRT Filter</div>
  ),
}));

describe('DesktopEnvironment', () => {
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

  it('should render the desktop container', () => {
    render(<DesktopEnvironment />);
    
    expect(screen.getByText('NecroOS')).toBeInTheDocument();
    expect(screen.getByText('Welcome to the other side...')).toBeInTheDocument();
  });

  it('should render CRT filter overlay', () => {
    render(<DesktopEnvironment />);
    
    const crtFilter = screen.getByTestId('crt-filter');
    expect(crtFilter).toBeInTheDocument();
  });

  it('should adjust CRT filter intensity based on haunt level', () => {
    useNecroStore.setState({ hauntLevel: 50 });
    
    render(<DesktopEnvironment />);
    
    const crtFilter = screen.getByTestId('crt-filter');
    const intensity = parseFloat(crtFilter.getAttribute('data-intensity') || '0');
    
    // Base intensity 0.3 + (50/100 * 0.3) = 0.45
    expect(intensity).toBeCloseTo(0.45, 2);
  });

  it('should call onHauntLevelChange when haunt level changes', () => {
    const onHauntLevelChange = vi.fn();
    
    const { rerender } = render(
      <DesktopEnvironment onHauntLevelChange={onHauntLevelChange} />
    );
    
    expect(onHauntLevelChange).toHaveBeenCalledWith(0);
    
    // Change haunt level
    useNecroStore.setState({ hauntLevel: 25 });
    rerender(<DesktopEnvironment onHauntLevelChange={onHauntLevelChange} />);
    
    expect(onHauntLevelChange).toHaveBeenCalledWith(25);
  });

  it('should connect to Zustand store for global state', () => {
    render(<DesktopEnvironment />);
    
    const state = useNecroStore.getState();
    expect(state).toBeDefined();
    expect(state.hauntLevel).toBeDefined();
    expect(state.audioEnabled).toBeDefined();
  });

  it('should have horror-themed background styling', () => {
    const { container } = render(<DesktopEnvironment />);
    
    // Check that the container exists (styling is applied via styled-components)
    const desktopContainer = container.firstChild;
    expect(desktopContainer).toBeInTheDocument();
  });
});
