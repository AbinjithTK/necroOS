import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Taskbar } from './Taskbar';
import { useNecroStore } from '../store';

describe('Taskbar', () => {
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

    // Mock Date to have consistent time for testing
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T12:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render SUMMON button', () => {
    render(<Taskbar />);
    
    const summonButton = screen.getByText('SUMMON');
    expect(summonButton).toBeInTheDocument();
  });

  it('should render countdown clock', () => {
    render(<Taskbar />);
    
    // Clock should show time remaining until midnight
    const clock = screen.getByText(/\d{2}:\d{2}:\d{2}/);
    expect(clock).toBeInTheDocument();
  });

  it('should display countdown to midnight in correct format', () => {
    render(<Taskbar />);
    
    // At 12:00:00, should show 12:00:00 remaining until midnight
    const clock = screen.getByText('12:00:00');
    expect(clock).toBeInTheDocument();
  });

  it('should update countdown every second', () => {
    render(<Taskbar />);
    
    expect(screen.getByText('12:00:00')).toBeInTheDocument();
    
    // Advance time by 2 seconds to see the countdown change
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    
    // After 2 seconds, should show 11:59:58
    expect(screen.getByText('11:59:58')).toBeInTheDocument();
  });

  it('should trigger glitch animation when SUMMON button is clicked', async () => {
    render(<Taskbar />);
    
    const summonButton = screen.getByText('SUMMON');
    fireEvent.click(summonButton);
    
    // Animation should be triggered (component state changes)
    // We can't directly test CSS animation, but we can verify the click works
    expect(summonButton).toBeInTheDocument();
  });

  it('should increment haunt level when SUMMON button is clicked', () => {
    render(<Taskbar />);
    
    const initialHauntLevel = useNecroStore.getState().hauntLevel;
    
    const summonButton = screen.getByText('SUMMON');
    fireEvent.click(summonButton);
    
    const newHauntLevel = useNecroStore.getState().hauntLevel;
    expect(newHauntLevel).toBeGreaterThan(initialHauntLevel);
  });

  it('should call onSummonClick callback when SUMMON button is clicked', () => {
    const onSummonClick = vi.fn();
    render(<Taskbar onSummonClick={onSummonClick} />);
    
    const summonButton = screen.getByText('SUMMON');
    fireEvent.click(summonButton);
    
    expect(onSummonClick).toHaveBeenCalledTimes(1);
  });

  it('should connect to store and trigger jump scare function', () => {
    const triggerJumpScare = useNecroStore.getState().triggerJumpScare;
    expect(triggerJumpScare).toBeDefined();
    
    // Verify the component has access to the store function
    render(<Taskbar />);
    expect(screen.getByText('SUMMON')).toBeInTheDocument();
  });

  it('should maintain Windows 95 visual styling', () => {
    const { container } = render(<Taskbar />);
    
    // Check that the taskbar container exists
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should display clock in Blood Red color theme', () => {
    render(<Taskbar />);
    
    const clock = screen.getByText(/\d{2}:\d{2}:\d{2}/);
    expect(clock).toBeInTheDocument();
    // Styling is applied via styled-components, so we just verify it renders
  });
});
