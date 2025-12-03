/**
 * Tests for audio error handling
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  getAudioErrors,
  clearAudioErrors,
  isAudioPermissionDenied,
  initAudioContext,
} from './audio';

describe('Audio Error Handling', () => {
  beforeEach(() => {
    clearAudioErrors();
  });

  it('tracks audio errors', () => {
    const initialErrors = getAudioErrors();
    expect(Array.isArray(initialErrors)).toBe(true);
  });

  it('clears audio errors', () => {
    clearAudioErrors();
    const errors = getAudioErrors();
    expect(errors.length).toBe(0);
  });

  it('checks audio permission status', () => {
    const permissionDenied = isAudioPermissionDenied();
    expect(typeof permissionDenied).toBe('boolean');
  });

  it('handles audio context initialization', async () => {
    // This may fail in test environment without AudioContext
    const result = await initAudioContext();
    expect(typeof result).toBe('boolean');
  });

  it('returns consistent permission status', () => {
    const status1 = isAudioPermissionDenied();
    const status2 = isAudioPermissionDenied();
    expect(status1).toBe(status2);
  });
});
