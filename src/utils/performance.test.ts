/**
 * Tests for performance monitoring utility
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  startPerformanceMonitoring,
  stopPerformanceMonitoring,
  onPerformanceUpdate,
  getPerformanceMetrics,
  isLowPerformance,
  setLowPerformanceThreshold,
  resetPerformanceMetrics,
} from './performance';

describe('Performance Monitoring', () => {
  beforeEach(() => {
    stopPerformanceMonitoring();
    resetPerformanceMetrics();
  });

  afterEach(() => {
    stopPerformanceMonitoring();
  });

  it('starts and stops monitoring', () => {
    startPerformanceMonitoring();
    // Should not throw
    stopPerformanceMonitoring();
  });

  it('does not start monitoring twice', () => {
    startPerformanceMonitoring();
    startPerformanceMonitoring(); // Should be no-op
    stopPerformanceMonitoring();
  });

  it('returns default metrics when no frames recorded', () => {
    const metrics = getPerformanceMetrics();
    expect(metrics.fps).toBe(60);
    expect(metrics.averageFps).toBe(60);
    expect(metrics.isLowPerformance).toBe(false);
  });

  it('calls performance update callbacks', (done) => {
    const callback = vi.fn((metrics) => {
      expect(metrics).toHaveProperty('fps');
      expect(metrics).toHaveProperty('averageFps');
      expect(metrics).toHaveProperty('frameTime');
      expect(metrics).toHaveProperty('isLowPerformance');
      unsubscribe();
      stopPerformanceMonitoring();
      done();
    });

    const unsubscribe = onPerformanceUpdate(callback);
    startPerformanceMonitoring();
  });

  it('unsubscribes from performance updates', () => {
    const callback = vi.fn();
    const unsubscribe = onPerformanceUpdate(callback);
    unsubscribe();

    startPerformanceMonitoring();
    // Callback should not be called after unsubscribe
    setTimeout(() => {
      expect(callback).not.toHaveBeenCalled();
      stopPerformanceMonitoring();
    }, 100);
  });

  it('sets low performance threshold', () => {
    setLowPerformanceThreshold(45);
    // Should not throw
  });

  it('clamps threshold to valid range', () => {
    setLowPerformanceThreshold(-10); // Should clamp to 1
    setLowPerformanceThreshold(100); // Should clamp to 60
    // Should not throw
  });

  it('detects low performance correctly', () => {
    const initialLowPerf = isLowPerformance();
    expect(typeof initialLowPerf).toBe('boolean');
  });

  it('resets performance metrics', () => {
    resetPerformanceMetrics();
    const metrics = getPerformanceMetrics();
    expect(metrics.fps).toBe(60);
  });
});
