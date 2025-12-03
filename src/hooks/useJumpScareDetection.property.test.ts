import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { renderHook, act } from '@testing-library/react';
import { useJumpScareDetection } from './useJumpScareDetection';

/**
 * Property-based tests for jump scare detection hooks
 * Tests rage click and mouse shake detection
 */

describe('useJumpScareDetection Property Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  /**
   * Feature: necro-os, Property 26: Rage click detection
   * Validates: Requirements 10.1
   * 
   * For any sequence of rapid clicks (5+ clicks within 1 second),
   * the system should detect it as rage clicking and trigger a callback.
   */
  it('should detect rage clicking when 5+ clicks occur within 1 second', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 5, max: 20 }), // Number of clicks
        fc.integer({ min: 0, max: 999 }), // Total time window (< 1 second)
        (numClicks, totalTime) => {
          let rageClickDetected = false;
          const onRageClick = () => {
            rageClickDetected = true;
          };

          const { result } = renderHook(() =>
            useJumpScareDetection({ onRageClick })
          );

          // Simulate rapid clicks
          const timePerClick = totalTime / numClicks;
          for (let i = 0; i < numClicks; i++) {
            act(() => {
              vi.advanceTimersByTime(timePerClick);
              document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            });
          }

          // Should detect rage click since we have 5+ clicks within 1 second
          return rageClickDetected === true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: necro-os, Property 26: Rage click detection (negative case)
   * Validates: Requirements 10.1
   * 
   * For any sequence of clicks that doesn't meet the threshold,
   * rage clicking should not be detected.
   */
  it('should not detect rage clicking when clicks are too few', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 4 }), // Too few clicks
        fc.integer({ min: 0, max: 999 }), // Within 1 second
        (numClicks, totalTime) => {
          let rageClickDetected = false;
          const onRageClick = () => {
            rageClickDetected = true;
          };

          const { result } = renderHook(() =>
            useJumpScareDetection({ onRageClick })
          );

          // Simulate clicks
          const timePerClick = totalTime / numClicks;
          for (let i = 0; i < numClicks; i++) {
            act(() => {
              vi.advanceTimersByTime(timePerClick);
              document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            });
          }

          // Should NOT detect rage click (too few clicks)
          return rageClickDetected === false;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: necro-os, Property 26: Rage click detection (rate limiting)
   * Validates: Requirements 10.1
   * 
   * For any sequence of rage click events within 2 seconds,
   * the callback should only be triggered once.
   */
  it('should rate limit rage click detection to prevent multiple triggers within 2 seconds', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 4 }), // Number of rage click sequences
        (numSequences) => {
          let rageClickCount = 0;
          const onRageClick = () => {
            rageClickCount++;
          };

          const { result, unmount } = renderHook(() =>
            useJumpScareDetection({ onRageClick })
          );

          // Simulate multiple rage click sequences within 2 seconds total
          // Each sequence takes ~400ms (5 clicks * 80ms)
          // With 4 sequences max, total time is ~1600ms (< 2000ms)
          for (let seq = 0; seq < numSequences; seq++) {
            // Each sequence: 5 clicks within 400ms
            for (let i = 0; i < 5; i++) {
              act(() => {
                vi.advanceTimersByTime(80);
                document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
              });
            }
          }

          unmount();

          // Should only trigger once due to rate limiting
          // (all sequences happen within 2 seconds of the first trigger)
          return rageClickCount === 1;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: necro-os, Property 27: Mouse shake detection
   * Validates: Requirements 10.2
   * 
   * For any sequence of rapid large mouse movements (distance > threshold in short time),
   * the system should detect it as mouse shaking and trigger a callback.
   */
  it('should detect mouse shaking when rapid large movements occur', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 15, max: 30 }), // Number of mouse movements
        fc.integer({ min: 30, max: 50 }), // Distance per movement
        (numMovements, distancePerMove) => {
          let mouseShakeDetected = false;
          const onMouseShake = () => {
            mouseShakeDetected = true;
          };

          const { result, unmount } = renderHook(() =>
            useJumpScareDetection({ 
              onMouseShake,
              mouseShakeThreshold: 300, // Default threshold
              mouseShakeWindow: 500, // 500ms window
            })
          );

          // Simulate rapid mouse movements
          let x = 100;
          let y = 100;
          for (let i = 0; i < numMovements; i++) {
            // Alternate direction to create shake effect
            const prevX = x;
            const prevY = y;
            x += (i % 2 === 0 ? 1 : -1) * distancePerMove;
            y += (i % 2 === 0 ? 1 : -1) * distancePerMove;
            
            act(() => {
              vi.advanceTimersByTime(20); // 20ms between movements
              document.dispatchEvent(
                new MouseEvent('mousemove', {
                  bubbles: true,
                  clientX: x,
                  clientY: y,
                })
              );
            });
          }

          unmount();

          // Calculate expected total distance (diagonal movements)
          const distancePerDiagonalMove = distancePerMove * Math.sqrt(2);
          const totalDistance = numMovements * distancePerDiagonalMove;
          
          // Should detect mouse shake if total distance > threshold
          return mouseShakeDetected === (totalDistance > 300);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: necro-os, Property 27: Mouse shake detection (negative case)
   * Validates: Requirements 10.2
   * 
   * For any sequence of slow or small mouse movements,
   * mouse shaking should not be detected.
   */
  it('should not detect mouse shaking when movements are too small', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 5, max: 15 }), // Number of mouse movements
        fc.integer({ min: 1, max: 10 }), // Small distance per movement
        (numMovements, distancePerMove) => {
          let mouseShakeDetected = false;
          const onMouseShake = () => {
            mouseShakeDetected = true;
          };

          const { result, unmount } = renderHook(() =>
            useJumpScareDetection({ 
              onMouseShake,
              mouseShakeThreshold: 300,
              mouseShakeWindow: 500,
            })
          );

          // Simulate small mouse movements
          let x = 100;
          let y = 100;
          for (let i = 0; i < numMovements; i++) {
            x += distancePerMove;
            y += distancePerMove;
            
            act(() => {
              vi.advanceTimersByTime(50);
              document.dispatchEvent(
                new MouseEvent('mousemove', {
                  bubbles: true,
                  clientX: x,
                  clientY: y,
                })
              );
            });
          }

          unmount();

          // Calculate total distance
          const totalDistance = numMovements * distancePerMove * Math.sqrt(2);
          
          // Should NOT detect mouse shake (distance too small)
          return mouseShakeDetected === false || totalDistance > 300;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: necro-os, Property 27: Mouse shake detection (rate limiting)
   * Validates: Requirements 10.2
   * 
   * For any sequence of mouse shake events, the callback should not
   * be triggered multiple times within 2 seconds.
   */
  it('should rate limit mouse shake detection to prevent multiple triggers', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 4 }), // Number of shake sequences
        (numSequences) => {
          let mouseShakeCount = 0;
          const onMouseShake = () => {
            mouseShakeCount++;
          };

          const { result, unmount } = renderHook(() =>
            useJumpScareDetection({ 
              onMouseShake,
              mouseShakeThreshold: 300,
              mouseShakeWindow: 500,
            })
          );

          // Simulate multiple shake sequences within 2 seconds
          for (let seq = 0; seq < numSequences; seq++) {
            // Each shake: rapid movements totaling > 300px
            let x = 100;
            let y = 100;
            for (let i = 0; i < 10; i++) {
              x += (i % 2 === 0 ? 1 : -1) * 40;
              y += (i % 2 === 0 ? 1 : -1) * 40;
              
              act(() => {
                vi.advanceTimersByTime(20);
                document.dispatchEvent(
                  new MouseEvent('mousemove', {
                    bubbles: true,
                    clientX: x,
                    clientY: y,
                  })
                );
              });
            }
            // Small delay between sequences
            act(() => {
              vi.advanceTimersByTime(200);
            });
          }

          unmount();

          // Should only trigger once due to rate limiting
          return mouseShakeCount === 1;
        }
      ),
      { numRuns: 100 }
    );
  });
});
