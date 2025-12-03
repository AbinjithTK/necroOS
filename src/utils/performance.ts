/**
 * Performance Monitoring Utility
 * Monitors frame rate and adjusts glitch frequency to maintain performance
 */

interface PerformanceMetrics {
  fps: number;
  averageFps: number;
  frameTime: number;
  isLowPerformance: boolean;
}

interface PerformanceMonitor {
  lastFrameTime: number;
  frameTimes: number[];
  maxSamples: number;
  lowPerformanceThreshold: number;
  callbacks: Set<(metrics: PerformanceMetrics) => void>;
  rafId: number | null;
}

const monitor: PerformanceMonitor = {
  lastFrameTime: performance.now(),
  frameTimes: [],
  maxSamples: 60, // Track last 60 frames (1 second at 60fps)
  lowPerformanceThreshold: 30, // Consider <30fps as low performance
  callbacks: new Set(),
  rafId: null,
};

/**
 * Calculate current performance metrics
 */
function calculateMetrics(): PerformanceMetrics {
  if (monitor.frameTimes.length === 0) {
    return {
      fps: 60,
      averageFps: 60,
      frameTime: 16.67,
      isLowPerformance: false,
    };
  }

  // Calculate average frame time
  const sum = monitor.frameTimes.reduce((a, b) => a + b, 0);
  const avgFrameTime = sum / monitor.frameTimes.length;
  const averageFps = 1000 / avgFrameTime;

  // Calculate current FPS from last frame
  const lastFrameTime = monitor.frameTimes[monitor.frameTimes.length - 1];
  const fps = 1000 / lastFrameTime;

  return {
    fps,
    averageFps,
    frameTime: avgFrameTime,
    isLowPerformance: averageFps < monitor.lowPerformanceThreshold,
  };
}

/**
 * Frame callback for performance monitoring
 */
function onFrame(timestamp: number): void {
  const frameTime = timestamp - monitor.lastFrameTime;
  monitor.lastFrameTime = timestamp;

  // Add frame time to buffer
  monitor.frameTimes.push(frameTime);

  // Keep only last N samples
  if (monitor.frameTimes.length > monitor.maxSamples) {
    monitor.frameTimes.shift();
  }

  // Calculate metrics and notify callbacks
  const metrics = calculateMetrics();
  monitor.callbacks.forEach((callback) => {
    try {
      callback(metrics);
    } catch (error) {
      console.error('Performance callback error:', error);
    }
  });

  // Continue monitoring
  monitor.rafId = requestAnimationFrame(onFrame);
}

/**
 * Start performance monitoring
 */
export function startPerformanceMonitoring(): void {
  if (monitor.rafId !== null) {
    return; // Already monitoring
  }

  monitor.lastFrameTime = performance.now();
  monitor.frameTimes = [];
  monitor.rafId = requestAnimationFrame(onFrame);
}

/**
 * Stop performance monitoring
 */
export function stopPerformanceMonitoring(): void {
  if (monitor.rafId !== null) {
    cancelAnimationFrame(monitor.rafId);
    monitor.rafId = null;
  }
}

/**
 * Subscribe to performance updates
 * @param callback - Function to call with performance metrics
 * @returns Unsubscribe function
 */
export function onPerformanceUpdate(
  callback: (metrics: PerformanceMetrics) => void
): () => void {
  monitor.callbacks.add(callback);

  return () => {
    monitor.callbacks.delete(callback);
  };
}

/**
 * Get current performance metrics
 */
export function getPerformanceMetrics(): PerformanceMetrics {
  return calculateMetrics();
}

/**
 * Check if performance is currently low
 */
export function isLowPerformance(): boolean {
  return calculateMetrics().isLowPerformance;
}

/**
 * Set the low performance threshold (FPS)
 */
export function setLowPerformanceThreshold(fps: number): void {
  monitor.lowPerformanceThreshold = Math.max(1, Math.min(60, fps));
}

/**
 * Reset performance metrics
 */
export function resetPerformanceMetrics(): void {
  monitor.frameTimes = [];
  monitor.lastFrameTime = performance.now();
}
