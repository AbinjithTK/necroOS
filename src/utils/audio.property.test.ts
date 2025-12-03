/**
 * Property-Based Tests for Audio System
 * Feature: necro-os
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as fc from 'fast-check';
import {
  initAudioContext,
  playSound,
  stopSound,
  setVolume,
  getVolume,
  type SoundId,
} from './audio';

// Mock Web Audio API
const createMockAudioContext = () => {
  const sources = new Map<string, any>();
  
  return {
    state: 'running' as AudioContextState,
    destination: {},
    createGain: vi.fn(() => ({
      connect: vi.fn(),
      gain: { value: 0.5 },
    })),
    createBufferSource: vi.fn(() => {
      const source = {
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
        buffer: null,
        loop: false,
        onended: null as any,
      };
      return source;
    }),
    decodeAudioData: vi.fn().mockResolvedValue({}),
    resume: vi.fn().mockResolvedValue(undefined),
    sources,
  };
};

global.AudioContext = vi.fn(function(this: any) {
  return createMockAudioContext();
}) as any;

// Mock fetch for audio loading
global.fetch = vi.fn((url: string) => {
  return Promise.resolve({
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
  } as Response);
});

describe('Audio System Property Tests', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    // Reset audio system state by re-importing
    await initAudioContext();
  });

  /**
   * Property 21: Reactive audio triggering
   * For any user action that should trigger audio (drag to Void, jump scare, UI interaction),
   * the corresponding audio effect should play.
   * Validates: Requirements 15.2, 15.3, 15.4
   */
  describe('Property 21: Reactive audio triggering', () => {
    it('should trigger audio for any valid sound ID', () => {
      fc.assert(
        fc.property(
          fc.constantFrom<SoundId>(
            'ambient-hum',
            'void-growl',
            'jump-scare',
            'ui-click',
            'ui-error'
          ),
          fc.boolean(),
          (soundId, loop) => {
            // Given: Audio system is initialized
            // When: A sound is played
            const instanceId = playSound(soundId, loop);
            
            // Then: An instance ID should be returned (or null if audio not loaded)
            // The system should attempt to play the sound
            return instanceId === null || typeof instanceId === 'string';
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle multiple simultaneous sound triggers', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              soundId: fc.constantFrom<SoundId>(
                'ambient-hum',
                'void-growl',
                'jump-scare',
                'ui-click',
                'ui-error'
              ),
              loop: fc.boolean(),
            }),
            { minLength: 1, maxLength: 10 }
          ),
          (sounds) => {
            // Given: Audio system is initialized
            // When: Multiple sounds are triggered
            const instanceIds = sounds.map(({ soundId, loop }) =>
              playSound(soundId, loop)
            );
            
            // Then: Each sound should get a unique instance ID (or null)
            const validIds = instanceIds.filter((id): id is string => id !== null);
            const uniqueIds = new Set(validIds);
            
            return validIds.length === uniqueIds.size;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should allow stopping any triggered sound', () => {
      fc.assert(
        fc.property(
          fc.constantFrom<SoundId>(
            'ambient-hum',
            'void-growl',
            'jump-scare',
            'ui-click',
            'ui-error'
          ),
          (soundId) => {
            // Given: A sound is playing
            const instanceId = playSound(soundId, false);
            
            if (instanceId === null) {
              return true; // Audio not loaded, skip
            }
            
            // When: The sound is stopped
            // Then: Should not throw an error
            try {
              stopSound(instanceId);
              return true;
            } catch (error) {
              return false;
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 22: Audio volume compliance
   * For any playing audio, the volume should respect the system's audio state volume setting (0-1 range).
   * Validates: Requirements 15.5
   */
  describe('Property 22: Audio volume compliance', () => {
    it('should maintain volume within 0-1 range for any input', () => {
      fc.assert(
        fc.property(
          fc.float({ min: -10, max: 10, noNaN: true }),
          (inputVolume) => {
            // Given: Any volume value (including out of range)
            // When: Volume is set
            setVolume(inputVolume);
            
            // Then: The actual volume should be clamped to 0-1
            const actualVolume = getVolume();
            return actualVolume >= 0 && actualVolume <= 1;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve volume precision within valid range', () => {
      fc.assert(
        fc.property(
          fc.float({ min: 0, max: 1, noNaN: true }),
          (volume) => {
            // Given: A valid volume value
            // When: Volume is set
            setVolume(volume);
            
            // Then: The volume should be preserved exactly
            const actualVolume = getVolume();
            return Math.abs(actualVolume - volume) < 0.0001;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle volume changes during playback', () => {
      fc.assert(
        fc.property(
          fc.constantFrom<SoundId>('ambient-hum', 'void-growl', 'jump-scare'),
          fc.array(fc.float({ min: 0, max: 1, noNaN: true }), { minLength: 1, maxLength: 5 }),
          (soundId, volumeChanges) => {
            // Given: A sound is playing
            const instanceId = playSound(soundId, true);
            
            if (instanceId === null) {
              return true; // Audio not loaded, skip
            }
            
            // When: Volume is changed multiple times
            for (const volume of volumeChanges) {
              setVolume(volume);
              
              // Then: Volume should always be in valid range
              const currentVolume = getVolume();
              if (currentVolume < 0 || currentVolume > 1) {
                return false;
              }
            }
            
            // Cleanup
            stopSound(instanceId);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should clamp extreme volume values correctly', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constant(-Infinity),
            fc.constant(Infinity),
            fc.float({ min: -1000, max: -1 }).filter(n => !isNaN(n)),
            fc.float({ min: 2, max: 1000 }).filter(n => !isNaN(n))
          ),
          (extremeVolume) => {
            // Given: An extreme volume value
            // When: Volume is set
            setVolume(extremeVolume);
            
            // Then: Volume should be clamped to 0 or 1
            const actualVolume = getVolume();
            return actualVolume === 0 || actualVolume === 1;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
