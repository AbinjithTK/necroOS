import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { renderHook, act } from '@testing-library/react';
import { useNecroStore } from '../store';

/**
 * Property-based tests for JumpScare system
 * Tests universal properties that should hold across all inputs
 */

describe('JumpScare Property Tests', () => {
  beforeEach(() => {
    // Reset store before each test
    const store = useNecroStore.getState();
    store.lastJumpScareTime = 0;
    store.hauntLevel = 0;
  });

  /**
   * Feature: necro-os, Property 8: Jump scare rate limiting
   * Validates: Requirements 10.5
   * 
   * For any sequence of jump scare triggers within 30 seconds,
   * only the first trigger should execute a jump scare.
   */
  it('should rate limit jump scares to prevent repeats within 30 seconds', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 0, max: 29000 }), { minLength: 2, maxLength: 10 }),
        (delays) => {
          const { result } = renderHook(() => useNecroStore());
          
          // Reset state
          act(() => {
            result.current.lastJumpScareTime = 0;
            result.current.hauntLevel = 0;
          });
          
          const initialTime = Date.now();
          let triggeredCount = 0;
          
          // Simulate multiple jump scare triggers with various delays
          for (const delay of delays) {
            // Mock Date.now() to simulate time passing
            const mockNow = initialTime + delay;
            const originalDateNow = Date.now;
            Date.now = () => mockNow;
            
            const lastJumpScareTimeBefore = result.current.lastJumpScareTime;
            
            act(() => {
              result.current.triggerJumpScare();
            });
            
            const lastJumpScareTimeAfter = result.current.lastJumpScareTime;
            
            // If lastJumpScareTime changed, a jump scare was triggered
            if (lastJumpScareTimeAfter !== lastJumpScareTimeBefore) {
              triggeredCount++;
            }
            
            // Restore Date.now
            Date.now = originalDateNow;
          }
          
          // Only the first trigger should execute (all delays are < 30 seconds)
          return triggeredCount === 1;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: necro-os, Property 8: Jump scare rate limiting (extended)
   * Validates: Requirements 10.5
   * 
   * For any sequence of jump scare triggers where some are > 30 seconds apart,
   * each trigger that is > 30 seconds from the last should execute.
   */
  it('should allow jump scares after 30 second cooldown', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            delay: fc.integer({ min: 0, max: 60000 }),
            shouldTrigger: fc.boolean(),
          }),
          { minLength: 2, maxLength: 5 }
        ),
        (events) => {
          const { result } = renderHook(() => useNecroStore());
          
          // Reset state
          act(() => {
            result.current.lastJumpScareTime = 0;
            result.current.hauntLevel = 0;
          });
          
          const initialTime = Date.now();
          let cumulativeDelay = 0;
          let lastSuccessfulTriggerTime = 0;
          let expectedTriggers = 0;
          let actualTriggers = 0;
          
          for (const event of events) {
            cumulativeDelay += event.delay;
            const mockNow = initialTime + cumulativeDelay;
            
            // Determine if this should trigger based on 30-second rule
            const timeSinceLastTrigger = mockNow - lastSuccessfulTriggerTime;
            const shouldActuallyTrigger = lastSuccessfulTriggerTime === 0 || timeSinceLastTrigger >= 30000;
            
            if (shouldActuallyTrigger) {
              expectedTriggers++;
            }
            
            // Mock Date.now()
            const originalDateNow = Date.now;
            Date.now = () => mockNow;
            
            const lastJumpScareTimeBefore = result.current.lastJumpScareTime;
            
            act(() => {
              result.current.triggerJumpScare();
            });
            
            const lastJumpScareTimeAfter = result.current.lastJumpScareTime;
            
            // Check if jump scare was actually triggered
            if (lastJumpScareTimeAfter !== lastJumpScareTimeBefore) {
              actualTriggers++;
              lastSuccessfulTriggerTime = mockNow;
            }
            
            // Restore Date.now
            Date.now = originalDateNow;
          }
          
          return actualTriggers === expectedTriggers;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: necro-os, Property 9: Jump scare haunt level increase
   * Validates: Requirements 10.4
   * 
   * For any jump scare event, the haunt level after the event
   * should be strictly greater than before the event.
   */
  it('should increase haunt level after jump scare', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 95 }), // Initial haunt level (max 95 to allow for increase)
        (initialHauntLevel) => {
          const { result } = renderHook(() => useNecroStore());
          
          // Set initial haunt level
          act(() => {
            result.current.hauntLevel = initialHauntLevel;
            result.current.lastJumpScareTime = 0;
          });
          
          const hauntLevelBefore = result.current.hauntLevel;
          
          // Trigger jump scare
          act(() => {
            result.current.triggerJumpScare();
          });
          
          const hauntLevelAfter = result.current.hauntLevel;
          
          // Haunt level should be strictly greater after jump scare
          return hauntLevelAfter > hauntLevelBefore;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: necro-os, Property 9: Jump scare haunt level increase (capped)
   * Validates: Requirements 10.4
   * 
   * For any jump scare event, the haunt level should increase but never exceed 100.
   */
  it('should cap haunt level at 100 after jump scare', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }),
        (initialHauntLevel) => {
          const { result } = renderHook(() => useNecroStore());
          
          // Set initial haunt level
          act(() => {
            result.current.hauntLevel = initialHauntLevel;
            result.current.lastJumpScareTime = 0;
          });
          
          // Trigger jump scare
          act(() => {
            result.current.triggerJumpScare();
          });
          
          const hauntLevelAfter = result.current.hauntLevel;
          
          // Haunt level should never exceed 100
          return hauntLevelAfter <= 100;
        }
      ),
      { numRuns: 100 }
    );
  });
});
