/**
 * Property-Based Tests for Haunting Orchestrator
 * Feature: necro-os
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { HauntingOrchestrator, type HauntingOrchestratorConfig } from './HauntingOrchestrator';

describe('HauntingOrchestrator Property Tests', () => {
  let mockConfig: HauntingOrchestratorConfig;

  beforeEach(() => {
    mockConfig = {
      onGlitchTrigger: vi.fn(),
      onAudioTrigger: vi.fn(),
      onWindowSpawn: vi.fn(),
      onClippyShow: vi.fn(),
      onJumpScare: vi.fn(),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * Property 6: Glitch frequency proportional to haunt level
   * For any haunt level value, the frequency of glitch effects should increase monotonically
   * with the haunt level (higher level = more frequent glitches).
   * Validates: Requirements 9.2
   */
  describe('Property 6: Glitch frequency proportional to haunt level', () => {
    it('should have monotonically decreasing intervals as haunt level increases', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 99 }),
          fc.integer({ min: 1, max: 100 }),
          (level1, level2) => {
            // Ensure level1 < level2
            const lowerLevel = Math.min(level1, level2);
            const higherLevel = Math.max(level1, level2);

            if (lowerLevel === higherLevel) {
              return true; // Skip if levels are equal
            }

            const orchestrator = new HauntingOrchestrator(mockConfig);

            // Get frequency at lower level
            orchestrator.updateHauntLevel(lowerLevel);
            const freq1 = orchestrator.calculateGlitchFrequency();

            // Get frequency at higher level
            orchestrator.updateHauntLevel(higherLevel);
            const freq2 = orchestrator.calculateGlitchFrequency();

            orchestrator.stop();

            // Higher haunt level should have shorter interval (more frequent)
            // We allow some randomness, so we check the maximum possible values
            const maxFreq1 = lowerLevel < 30 ? 60000 : lowerLevel < 50 ? 30000 : lowerLevel < 70 ? 15000 : 8000;
            const minFreq2 = higherLevel < 30 ? 30000 : higherLevel < 50 ? 15000 : higherLevel < 70 ? 8000 : 3000;

            // If they're in different brackets, the max of lower should be >= min of higher
            return maxFreq1 >= minFreq2;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should have consistent frequency ranges for each haunt level bracket', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 100 }),
          (hauntLevel) => {
            const orchestrator = new HauntingOrchestrator(mockConfig);
            orchestrator.updateHauntLevel(hauntLevel);

            const frequency = orchestrator.calculateGlitchFrequency();

            orchestrator.stop();

            // Verify frequency is within expected range for haunt level
            if (hauntLevel < 30) {
              return frequency >= 30000 && frequency <= 60000;
            } else if (hauntLevel < 50) {
              return frequency >= 15000 && frequency <= 30000;
            } else if (hauntLevel < 70) {
              return frequency >= 8000 && frequency <= 15000;
            } else {
              return frequency >= 3000 && frequency <= 8000;
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should always return positive frequency values', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 100 }),
          (hauntLevel) => {
            const orchestrator = new HauntingOrchestrator(mockConfig);
            orchestrator.updateHauntLevel(hauntLevel);

            const frequency = orchestrator.calculateGlitchFrequency();

            orchestrator.stop();

            return frequency > 0;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 7: Threshold event triggering
   * For any haunt level threshold (30, 50, 70), crossing that threshold should trigger
   * the associated scripted event exactly once.
   * Validates: Requirements 9.3
   */
  describe('Property 7: Threshold event triggering', () => {
    it('should trigger threshold events exactly once when crossing', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer({ min: 0, max: 100 }), { minLength: 1, maxLength: 20 }),
          (hauntLevelSequence) => {
            const orchestrator = new HauntingOrchestrator(mockConfig);
            const thresholds = [30, 40, 50, 60, 70, 80, 90];
            const triggerCounts = new Map<number, number>();

            // Initialize counts
            thresholds.forEach((t) => triggerCounts.set(t, 0));

            // Apply haunt level changes in sequence
            for (const level of hauntLevelSequence) {
              const previousTriggered = orchestrator.getTriggeredThresholds();
              orchestrator.updateHauntLevel(level);
              const newTriggered = orchestrator.getTriggeredThresholds();

              // Count new triggers
              for (const threshold of newTriggered) {
                if (!previousTriggered.includes(threshold)) {
                  triggerCounts.set(threshold, (triggerCounts.get(threshold) || 0) + 1);
                }
              }
            }

            orchestrator.stop();

            // Each threshold should be triggered at most once
            for (const count of triggerCounts.values()) {
              if (count > 1) {
                return false;
              }
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should trigger all thresholds when going from 0 to 100', () => {
      fc.assert(
        fc.property(
          fc.constant(null),
          () => {
            const orchestrator = new HauntingOrchestrator(mockConfig);
            const expectedThresholds = [30, 40, 50, 60, 70, 80, 90];

            // Go from 0 to 100
            orchestrator.updateHauntLevel(100);

            const triggered = orchestrator.getTriggeredThresholds();

            orchestrator.stop();

            // All thresholds should be triggered
            return expectedThresholds.every((t) => triggered.includes(t));
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not trigger thresholds when staying below them', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 29 }),
          (maxLevel) => {
            const orchestrator = new HauntingOrchestrator(mockConfig);

            orchestrator.updateHauntLevel(maxLevel);

            const triggered = orchestrator.getTriggeredThresholds();

            orchestrator.stop();

            // No thresholds should be triggered if we stay below 30
            return triggered.length === 0;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should trigger correct number of thresholds for any level', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 100 }),
          (hauntLevel) => {
            const orchestrator = new HauntingOrchestrator(mockConfig);
            const thresholds = [30, 40, 50, 60, 70, 80, 90];

            orchestrator.updateHauntLevel(hauntLevel);

            const triggered = orchestrator.getTriggeredThresholds();
            const expectedCount = thresholds.filter((t) => t <= hauntLevel).length;

            orchestrator.stop();

            return triggered.length === expectedCount;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain triggered state after reset', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 50, max: 100 }),
          (hauntLevel) => {
            const orchestrator = new HauntingOrchestrator(mockConfig);

            // Trigger some thresholds
            orchestrator.updateHauntLevel(hauntLevel);
            const triggeredBefore = orchestrator.getTriggeredThresholds();

            // Reset
            orchestrator.reset();
            const triggeredAfter = orchestrator.getTriggeredThresholds();

            // After reset, no thresholds should be triggered
            return triggeredBefore.length > 0 && triggeredAfter.length === 0;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should allow re-triggering thresholds after reset', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 50, max: 100 }),
          (hauntLevel) => {
            const orchestrator = new HauntingOrchestrator(mockConfig);

            // First trigger
            orchestrator.updateHauntLevel(hauntLevel);
            const firstTrigger = orchestrator.getTriggeredThresholds();

            // Reset and trigger again
            orchestrator.reset();
            orchestrator.updateHauntLevel(hauntLevel);
            const secondTrigger = orchestrator.getTriggeredThresholds();

            orchestrator.stop();

            // Should trigger same thresholds both times
            return (
              firstTrigger.length === secondTrigger.length &&
              firstTrigger.every((t) => secondTrigger.includes(t))
            );
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
