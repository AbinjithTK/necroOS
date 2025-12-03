import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import { Taskbar } from './Taskbar';
import { useNecroStore } from '../store';

describe('Taskbar Property-Based Tests', () => {
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

    // Use fake timers for consistent testing
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  /**
   * Feature: necro-os, Property 23: Countdown clock format
   * Validates: Requirements 2.2
   * 
   * For any time, the taskbar clock should display time remaining until midnight
   * in countdown format, not current time.
   */
  it('Property 23: Countdown clock format - should always display countdown to midnight in HH:MM:SS format', () => {
    fc.assert(
      fc.property(
        // Generate random times throughout the day
        fc.integer({ min: 0, max: 23 }), // hours
        fc.integer({ min: 0, max: 59 }), // minutes
        fc.integer({ min: 0, max: 59 }), // seconds
        (hours, minutes, seconds) => {
          // Set the system time to the generated time
          const testDate = new Date('2024-01-01');
          testDate.setHours(hours, minutes, seconds, 0);
          vi.setSystemTime(testDate);

          // Render the taskbar
          const { unmount } = render(<Taskbar />);

          // Get the clock display
          const clockElement = screen.getByText(/\d{2}:\d{2}:\d{2}/);
          const clockText = clockElement.textContent || '';

          // Verify format is HH:MM:SS
          const formatRegex = /^\d{2}:\d{2}:\d{2}$/;
          expect(clockText).toMatch(formatRegex);

          // Parse the displayed time
          const [displayHours, displayMinutes, displaySeconds] = clockText
            .split(':')
            .map(Number);

          // Calculate expected time until midnight
          const midnight = new Date(testDate);
          midnight.setHours(24, 0, 0, 0);
          const diff = midnight.getTime() - testDate.getTime();
          
          const expectedHours = Math.floor(diff / (1000 * 60 * 60));
          const expectedMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const expectedSeconds = Math.floor((diff % (1000 * 60)) / 1000);

          // Verify the countdown is correct (within 1 second tolerance for timing)
          expect(displayHours).toBe(expectedHours);
          expect(displayMinutes).toBe(expectedMinutes);
          expect(Math.abs(displaySeconds - expectedSeconds)).toBeLessThanOrEqual(1);

          // Verify it's showing countdown, not current time
          // If it were showing current time, hours would match input hours
          if (hours !== 0) {
            expect(displayHours).not.toBe(hours);
          }

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 23: Countdown clock format - should display valid time components', () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date('2024-01-01T00:00:00'), max: new Date('2024-01-01T23:59:59') }).filter(d => !isNaN(d.getTime())),
        (testDate) => {
          vi.setSystemTime(testDate);

          const { unmount } = render(<Taskbar />);

          const clockElement = screen.getByText(/\d{2}:\d{2}:\d{2}/);
          const clockText = clockElement.textContent || '';

          const [hours, minutes, seconds] = clockText.split(':').map(Number);

          // Hours should be 0-24 (countdown to midnight)
          expect(hours).toBeGreaterThanOrEqual(0);
          expect(hours).toBeLessThanOrEqual(24);

          // Minutes should be 0-59
          expect(minutes).toBeGreaterThanOrEqual(0);
          expect(minutes).toBeLessThanOrEqual(59);

          // Seconds should be 0-59
          expect(seconds).toBeGreaterThanOrEqual(0);
          expect(seconds).toBeLessThanOrEqual(59);

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 23: Countdown clock format - should use zero-padding for single digits', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 23 }),
        fc.integer({ min: 0, max: 59 }),
        fc.integer({ min: 0, max: 59 }),
        (hours, minutes, seconds) => {
          const testDate = new Date('2024-01-01');
          testDate.setHours(hours, minutes, seconds, 0);
          vi.setSystemTime(testDate);

          const { unmount } = render(<Taskbar />);

          const clockElement = screen.getByText(/\d{2}:\d{2}:\d{2}/);
          const clockText = clockElement.textContent || '';

          // Each component should be exactly 2 digits (zero-padded)
          const parts = clockText.split(':');
          expect(parts).toHaveLength(3);
          parts.forEach((part) => {
            expect(part).toHaveLength(2);
            expect(part).toMatch(/^\d{2}$/);
          });

          unmount();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
