import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  initAudioContext,
  setVolume,
  getVolume,
  isAudioInitialized,
  getAudioContextState,
} from './audio';

// Mock Web Audio API
const createMockAudioContext = () => ({
  state: 'running' as AudioContextState,
  destination: {},
  createGain: vi.fn(() => ({
    connect: vi.fn(),
    gain: { value: 0.5 },
  })),
  createBufferSource: vi.fn(() => ({
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    buffer: null,
    loop: false,
    onended: null,
  })),
  decodeAudioData: vi.fn(),
  resume: vi.fn().mockResolvedValue(undefined),
});

// Mock global AudioContext
global.AudioContext = vi.fn(function(this: any) {
  return createMockAudioContext();
}) as any;

describe('Audio System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initAudioContext', () => {
    it('should initialize audio context successfully', async () => {
      const result = await initAudioContext();
      expect(result).toBe(true);
      expect(isAudioInitialized()).toBe(true);
    });

    it('should return true if already initialized', async () => {
      await initAudioContext();
      const result = await initAudioContext();
      expect(result).toBe(true);
    });
  });

  describe('setVolume and getVolume', () => {
    it('should set and get volume correctly', () => {
      setVolume(0.7);
      expect(getVolume()).toBe(0.7);
    });

    it('should clamp volume to 0-1 range', () => {
      setVolume(1.5);
      expect(getVolume()).toBe(1);

      setVolume(-0.5);
      expect(getVolume()).toBe(0);
    });

    it('should handle boundary values', () => {
      setVolume(0);
      expect(getVolume()).toBe(0);

      setVolume(1);
      expect(getVolume()).toBe(1);
    });
  });

  describe('getAudioContextState', () => {
    it('should return audio context state', async () => {
      await initAudioContext();
      const state = getAudioContextState();
      expect(state).toBe('running');
    });
  });
});
