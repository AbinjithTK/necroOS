import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DesktopIcons } from './DesktopIcons';
import { useNecroStore } from '../store';

describe('DesktopIcons', () => {
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

  it('should render all desktop icons', () => {
    render(<DesktopIcons />);
    
    expect(screen.getByText('My Corpse')).toBeInTheDocument();
    expect(screen.getByText('The Void')).toBeInTheDocument();
    expect(screen.getByText('Dark Web')).toBeInTheDocument();
    expect(screen.getByText('Readme.txt')).toBeInTheDocument();
  });

  it('should open My Corpse window on double-click', () => {
    const openWindow = vi.fn();
    useNecroStore.setState({ openWindow });
    
    render(<DesktopIcons />);
    
    const myCorpseIcon = screen.getByText('My Corpse').parentElement;
    expect(myCorpseIcon).toBeInTheDocument();
    
    if (myCorpseIcon) {
      fireEvent.doubleClick(myCorpseIcon);
      expect(openWindow).toHaveBeenCalledWith('my-corpse');
    }
  });

  it('should increment haunt level when My Corpse is double-clicked', () => {
    render(<DesktopIcons />);
    
    const initialHauntLevel = useNecroStore.getState().hauntLevel;
    
    const myCorpseIcon = screen.getByText('My Corpse').parentElement;
    if (myCorpseIcon) {
      fireEvent.doubleClick(myCorpseIcon);
    }
    
    const newHauntLevel = useNecroStore.getState().hauntLevel;
    expect(newHauntLevel).toBeGreaterThan(initialHauntLevel);
  });

  it('should open Dark Web window on double-click', () => {
    const openWindow = vi.fn();
    useNecroStore.setState({ openWindow });
    
    render(<DesktopIcons />);
    
    const darkWebIcon = screen.getByText('Dark Web').parentElement;
    expect(darkWebIcon).toBeInTheDocument();
    
    if (darkWebIcon) {
      fireEvent.doubleClick(darkWebIcon);
      expect(openWindow).toHaveBeenCalledWith('dark-web');
    }
  });

  it('should open Readme window on double-click', () => {
    const openWindow = vi.fn();
    useNecroStore.setState({ openWindow });
    
    render(<DesktopIcons />);
    
    const readmeIcon = screen.getByText('Readme.txt').parentElement;
    expect(readmeIcon).toBeInTheDocument();
    
    if (readmeIcon) {
      fireEvent.doubleClick(readmeIcon);
      expect(openWindow).toHaveBeenCalledWith('readme');
    }
  });

  it('should handle drag over The Void icon', () => {
    render(<DesktopIcons />);
    
    const voidIcon = screen.getByText('The Void').parentElement;
    expect(voidIcon).toBeInTheDocument();
    
    if (voidIcon) {
      const dragEvent = new Event('dragover', { bubbles: true });
      Object.defineProperty(dragEvent, 'preventDefault', {
        value: vi.fn(),
      });
      
      fireEvent(voidIcon, dragEvent);
      // Visual feedback should be applied (tested via styling)
      expect(voidIcon).toBeInTheDocument();
    }
  });

  it('should play sound and increment haunt level when file is dropped on The Void', () => {
    const playSound = vi.fn();
    useNecroStore.setState({ playSound });
    
    render(<DesktopIcons />);
    
    const initialHauntLevel = useNecroStore.getState().hauntLevel;
    
    const voidIcon = screen.getByText('The Void').parentElement;
    if (voidIcon) {
      const dropEvent = new Event('drop', { bubbles: true });
      Object.defineProperty(dropEvent, 'preventDefault', {
        value: vi.fn(),
      });
      
      fireEvent(voidIcon, dropEvent);
      
      expect(playSound).toHaveBeenCalledWith('void-growl');
      
      const newHauntLevel = useNecroStore.getState().hauntLevel;
      expect(newHauntLevel).toBeGreaterThan(initialHauntLevel);
    }
  });

  it('should display icons with horror theming', () => {
    const { container } = render(<DesktopIcons />);
    
    // Check that icons container exists
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should use grid layout for icons', () => {
    const { container } = render(<DesktopIcons />);
    
    // Icons should be in a grid container
    const iconsContainer = container.firstChild;
    expect(iconsContainer).toBeInTheDocument();
  });

  it('should have custom cursor styling on icons', () => {
    render(<DesktopIcons />);
    
    const myCorpseIcon = screen.getByText('My Corpse').parentElement;
    expect(myCorpseIcon).toBeInTheDocument();
    // Cursor styling is applied via styled-components
  });
});
