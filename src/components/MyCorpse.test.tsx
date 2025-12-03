import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MyCorpse } from './MyCorpse';
import { useNecroStore } from '../store';

// Mock the store
vi.mock('../store', () => ({
  useNecroStore: vi.fn(),
}));

describe('MyCorpse', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders system statistics title', () => {
    (useNecroStore as any).mockReturnValue(0);
    
    render(<MyCorpse windowId="test-window" />);
    
    expect(screen.getByText(/SYSTEM AUTOPSY/i)).toBeInTheDocument();
  });

  it('displays Soul Integrity based on haunt level', () => {
    (useNecroStore as any).mockReturnValue(30);
    
    render(<MyCorpse windowId="test-window" />);
    
    // Soul Integrity = 100 - hauntLevel = 100 - 30 = 70%
    expect(screen.getByText('70%')).toBeInTheDocument();
  });

  it('displays Haunted RAM that increases with haunt level', () => {
    (useNecroStore as any).mockReturnValue(0);
    
    render(<MyCorpse windowId="test-window" />);
    
    // At haunt level 0, Haunted RAM should be 666 MB
    expect(screen.getByText(/666 MB/i)).toBeInTheDocument();
  });

  it('displays all system stats', () => {
    (useNecroStore as any).mockReturnValue(50);
    
    render(<MyCorpse windowId="test-window" />);
    
    expect(screen.getByText(/Haunted RAM:/i)).toBeInTheDocument();
    expect(screen.getByText(/Cursed CPU:/i)).toBeInTheDocument();
    expect(screen.getByText(/Damned Disk:/i)).toBeInTheDocument();
    expect(screen.getByText(/Possessed Processes:/i)).toBeInTheDocument();
    expect(screen.getByText(/Spectral Threads:/i)).toBeInTheDocument();
    expect(screen.getByText(/Unholy Uptime:/i)).toBeInTheDocument();
    expect(screen.getByText(/Corruption Level:/i)).toBeInTheDocument();
  });

  it('shows critical warning when soul integrity is below 30%', () => {
    // Haunt level 75 means soul integrity is 25%
    (useNecroStore as any).mockReturnValue(75);
    
    render(<MyCorpse windowId="test-window" />);
    
    expect(screen.getByText(/CRITICAL: SOUL INTEGRITY COMPROMISED/i)).toBeInTheDocument();
  });

  it('shows danger warning when haunt level exceeds 70', () => {
    (useNecroStore as any).mockReturnValue(80);
    
    render(<MyCorpse windowId="test-window" />);
    
    expect(screen.getByText(/DANGER: MAXIMUM CORRUPTION DETECTED/i)).toBeInTheDocument();
  });

  it('does not show warnings at low haunt levels', () => {
    (useNecroStore as any).mockReturnValue(20);
    
    render(<MyCorpse windowId="test-window" />);
    
    expect(screen.queryByText(/CRITICAL/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/DANGER/i)).not.toBeInTheDocument();
  });

  it('calculates soul integrity as inverse of haunt level', () => {
    (useNecroStore as any).mockReturnValue(40);
    
    render(<MyCorpse windowId="test-window" />);
    
    // Soul Integrity = 100 - 40 = 60%
    expect(screen.getByText('60%')).toBeInTheDocument();
  });

  it('displays corruption level matching haunt level', () => {
    (useNecroStore as any).mockReturnValue(55);
    
    render(<MyCorpse windowId="test-window" />);
    
    expect(screen.getByText(/55\/100/i)).toBeInTheDocument();
  });
});
