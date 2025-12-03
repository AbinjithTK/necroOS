import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { GlitchableWindow } from './GlitchableWindow';
import type { GlitchEffect } from '../store/types';

describe('GlitchableWindow', () => {
  it('should render children without glitches', () => {
    const { container } = render(
      <GlitchableWindow windowId="test-window" activeGlitches={[]}>
        <div>Test content</div>
      </GlitchableWindow>
    );

    expect(container.textContent).toContain('Test content');
  });

  it('should render with window-shift glitch', () => {
    const glitch: GlitchEffect = {
      id: 'glitch-1',
      type: 'window-shift',
      intensity: 0.5,
      duration: 1000,
      targetId: 'test-window',
      startTime: Date.now(),
    };

    const { container } = render(
      <GlitchableWindow windowId="test-window" activeGlitches={[glitch]}>
        <div>Test content</div>
      </GlitchableWindow>
    );

    expect(container.textContent).toContain('Test content');
  });

  it('should render with color-shift glitch', () => {
    const glitch: GlitchEffect = {
      id: 'glitch-1',
      type: 'color-shift',
      intensity: 0.7,
      duration: 1500,
      targetId: 'test-window',
      startTime: Date.now(),
    };

    const { container } = render(
      <GlitchableWindow windowId="test-window" activeGlitches={[glitch]}>
        <div>Test content</div>
      </GlitchableWindow>
    );

    expect(container.textContent).toContain('Test content');
  });

  it('should render with transparency glitch', () => {
    const glitch: GlitchEffect = {
      id: 'glitch-1',
      type: 'transparency',
      intensity: 0.6,
      duration: 1200,
      targetId: 'test-window',
      startTime: Date.now(),
    };

    const { container } = render(
      <GlitchableWindow windowId="test-window" activeGlitches={[glitch]}>
        <div>Test content</div>
      </GlitchableWindow>
    );

    expect(container.textContent).toContain('Test content');
  });

  it('should render with multiple simultaneous glitches', () => {
    const glitches: GlitchEffect[] = [
      {
        id: 'glitch-1',
        type: 'window-shift',
        intensity: 0.5,
        duration: 1000,
        targetId: 'test-window',
        startTime: Date.now(),
      },
      {
        id: 'glitch-2',
        type: 'transparency',
        intensity: 0.6,
        duration: 1200,
        targetId: 'test-window',
        startTime: Date.now(),
      },
    ];

    const { container } = render(
      <GlitchableWindow windowId="test-window" activeGlitches={glitches}>
        <div>Test content</div>
      </GlitchableWindow>
    );

    expect(container.textContent).toContain('Test content');
  });

  it('should apply glitches to all windows when targetId is undefined', () => {
    const glitch: GlitchEffect = {
      id: 'glitch-1',
      type: 'text-corruption',
      intensity: 0.8,
      duration: 1000,
      targetId: undefined, // Global glitch
      startTime: Date.now(),
    };

    const { container } = render(
      <GlitchableWindow windowId="test-window" activeGlitches={[glitch]}>
        <div>Test content</div>
      </GlitchableWindow>
    );

    expect(container.textContent).toContain('Test content');
  });

  it('should not apply glitches targeted at other windows', () => {
    const glitch: GlitchEffect = {
      id: 'glitch-1',
      type: 'window-shift',
      intensity: 0.5,
      duration: 1000,
      targetId: 'other-window', // Different window
      startTime: Date.now(),
    };

    const { container } = render(
      <GlitchableWindow windowId="test-window" activeGlitches={[glitch]}>
        <div>Test content</div>
      </GlitchableWindow>
    );

    expect(container.textContent).toContain('Test content');
  });
});
