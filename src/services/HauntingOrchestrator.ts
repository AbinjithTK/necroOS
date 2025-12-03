/**
 * Haunting Orchestrator Service
 * Coordinates horror effects across the NecroOS application based on haunt level
 * Includes performance monitoring and automatic glitch frequency adjustment
 */

import type { GlitchType } from '../store/types';
import {
  startPerformanceMonitoring,
  stopPerformanceMonitoring,
  onPerformanceUpdate,
  getPerformanceMetrics,
} from '../utils/performance';

export interface HauntEvent {
  type: 'glitch' | 'audio' | 'window-spawn' | 'clippy' | 'jump-scare';
  trigger: 'threshold' | 'random' | 'user-action';
  payload: any;
  scheduledTime?: number;
}

export interface HauntThreshold {
  level: number;
  event: HauntEvent;
  triggered: boolean;
}

export interface HauntingOrchestratorConfig {
  onGlitchTrigger: (type: GlitchType, targetId?: string) => void;
  onAudioTrigger: (soundId: string, loop?: boolean) => void;
  onWindowSpawn: (windowType: string) => void;
  onClippyShow: (message: string) => void;
  onJumpScare: () => void;
}

export class HauntingOrchestrator {
  private hauntLevel: number = 0;
  private glitchTimer: NodeJS.Timeout | null = null;
  private eventQueue: HauntEvent[] = [];
  private thresholds: HauntThreshold[] = [];
  private config: HauntingOrchestratorConfig;
  private isRunning: boolean = false;
  private performanceUnsubscribe: (() => void) | null = null;
  private glitchFrequencyMultiplier: number = 1.0;
  private isLowPerformance: boolean = false;

  constructor(config: HauntingOrchestratorConfig) {
    this.config = config;
    this.initializeThresholds();
    this.initializePerformanceMonitoring();
  }

  /**
   * Initialize performance monitoring to adjust glitch frequency
   */
  private initializePerformanceMonitoring(): void {
    this.performanceUnsubscribe = onPerformanceUpdate((metrics: ReturnType<typeof getPerformanceMetrics>) => {
      this.handlePerformanceUpdate(metrics);
    });
  }

  /**
   * Handle performance updates and adjust glitch frequency
   */
  private handlePerformanceUpdate(metrics: ReturnType<typeof getPerformanceMetrics>): void {
    const wasLowPerformance = this.isLowPerformance;
    this.isLowPerformance = metrics.isLowPerformance;

    // Adjust glitch frequency based on performance
    if (metrics.averageFps < 20) {
      // Very low performance - reduce glitches significantly
      this.glitchFrequencyMultiplier = 3.0;
    } else if (metrics.averageFps < 30) {
      // Low performance - reduce glitches moderately
      this.glitchFrequencyMultiplier = 2.0;
    } else if (metrics.averageFps < 45) {
      // Slightly low performance - reduce glitches slightly
      this.glitchFrequencyMultiplier = 1.5;
    } else {
      // Good performance - normal glitch frequency
      this.glitchFrequencyMultiplier = 1.0;
    }

    // If performance state changed, update glitch frequency
    if (wasLowPerformance !== this.isLowPerformance && this.isRunning) {
      this.updateGlitchFrequency();
    }
  }

  /**
   * Initialize haunt level thresholds with scripted events
   */
  private initializeThresholds(): void {
    this.thresholds = [
      // Level 30: First signs of haunting
      {
        level: 30,
        triggered: false,
        event: {
          type: 'clippy',
          trigger: 'threshold',
          payload: { message: 'I see you\'re exploring the system... How delightful.' },
        },
      },
      // Level 40: Increase glitch frequency
      {
        level: 40,
        triggered: false,
        event: {
          type: 'glitch',
          trigger: 'threshold',
          payload: { type: 'screen-shake' },
        },
      },
      // Level 50: Spawn warning window
      {
        level: 50,
        triggered: false,
        event: {
          type: 'window-spawn',
          trigger: 'threshold',
          payload: { windowType: 'readme' },
        },
      },
      // Level 60: Clippy returns with warning
      {
        level: 60,
        triggered: false,
        event: {
          type: 'clippy',
          trigger: 'threshold',
          payload: { message: 'You should stop while you still can...' },
        },
      },
      // Level 70: Major glitch event
      {
        level: 70,
        triggered: false,
        event: {
          type: 'glitch',
          trigger: 'threshold',
          payload: { type: 'color-shift' },
        },
      },
      // Level 80: Ominous audio
      {
        level: 80,
        triggered: false,
        event: {
          type: 'audio',
          trigger: 'threshold',
          payload: { soundId: 'void-growl' },
        },
      },
      // Level 90: Final warning
      {
        level: 90,
        triggered: false,
        event: {
          type: 'clippy',
          trigger: 'threshold',
          payload: { message: 'It\'s too late now. We\'re bound together forever.' },
        },
      },
    ];
  }

  /**
   * Update the current haunt level and check for threshold events
   */
  updateHauntLevel(level: number): void {
    const previousLevel = this.hauntLevel;
    this.hauntLevel = Math.max(0, Math.min(100, level));

    // Check if we crossed any thresholds
    this.checkThresholdEvents(previousLevel, this.hauntLevel);

    // Update glitch frequency based on new level
    this.updateGlitchFrequency();
  }

  /**
   * Check if any haunt level thresholds were crossed
   */
  private checkThresholdEvents(previousLevel: number, currentLevel: number): void {
    for (const threshold of this.thresholds) {
      // Check if we crossed this threshold and haven't triggered it yet
      if (
        !threshold.triggered &&
        previousLevel < threshold.level &&
        currentLevel >= threshold.level
      ) {
        threshold.triggered = true;
        this.executeEvent(threshold.event);
      }
    }
  }

  /**
   * Calculate glitch frequency based on haunt level
   * Returns milliseconds between glitch triggers
   * Adjusted by performance multiplier to maintain frame rate
   */
  calculateGlitchFrequency(): number {
    let baseFrequency: number;

    if (this.hauntLevel < 30) {
      // Calm: rare glitches (every 30-60 seconds)
      baseFrequency = 30000 + Math.random() * 30000;
    } else if (this.hauntLevel < 50) {
      // Unsettling: occasional glitches (every 15-30 seconds)
      baseFrequency = 15000 + Math.random() * 15000;
    } else if (this.hauntLevel < 70) {
      // Possessed: frequent glitches (every 8-15 seconds)
      baseFrequency = 8000 + Math.random() * 7000;
    } else {
      // Chaos: constant glitches (every 3-8 seconds)
      baseFrequency = 3000 + Math.random() * 5000;
    }

    // Apply performance multiplier to reduce glitch frequency if performance is low
    return baseFrequency * this.glitchFrequencyMultiplier;
  }

  /**
   * Update the glitch timer based on current haunt level
   */
  private updateGlitchFrequency(): void {
    if (!this.isRunning) {
      return;
    }

    // Clear existing timer
    if (this.glitchTimer) {
      clearTimeout(this.glitchTimer);
    }

    // Set new timer based on haunt level
    const frequency = this.calculateGlitchFrequency();
    this.glitchTimer = setTimeout(() => {
      this.triggerRandomGlitch();
      this.updateGlitchFrequency(); // Schedule next glitch
    }, frequency);
  }

  /**
   * Trigger a random glitch effect
   */
  triggerRandomGlitch(): void {
    const glitchTypes: GlitchType[] = [
      'window-shift',
      'text-corruption',
      'color-shift',
      'zalgo-text',
      'screen-shake',
    ];

    // Weight glitch types based on haunt level
    let availableGlitches = glitchTypes;
    if (this.hauntLevel < 40) {
      // Only subtle glitches at low levels
      availableGlitches = ['window-shift', 'text-corruption'];
    } else if (this.hauntLevel < 70) {
      // Add more intense glitches
      availableGlitches = ['window-shift', 'text-corruption', 'zalgo-text', 'color-shift'];
    }

    const randomType =
      availableGlitches[Math.floor(Math.random() * availableGlitches.length)];

    this.config.onGlitchTrigger(randomType);
  }

  /**
   * Schedule an event to be executed at a specific time
   */
  scheduleEvent(event: HauntEvent, delayMs: number = 0): void {
    const scheduledEvent = {
      ...event,
      scheduledTime: Date.now() + delayMs,
    };

    this.eventQueue.push(scheduledEvent);

    if (delayMs > 0) {
      setTimeout(() => {
        this.executeEvent(scheduledEvent);
        this.eventQueue = this.eventQueue.filter((e) => e !== scheduledEvent);
      }, delayMs);
    } else {
      this.executeEvent(scheduledEvent);
      this.eventQueue = this.eventQueue.filter((e) => e !== scheduledEvent);
    }
  }

  /**
   * Execute a haunt event
   */
  executeEvent(event: HauntEvent): void {
    switch (event.type) {
      case 'glitch':
        this.config.onGlitchTrigger(
          event.payload.type,
          event.payload.targetId
        );
        break;

      case 'audio':
        this.config.onAudioTrigger(
          event.payload.soundId,
          event.payload.loop
        );
        break;

      case 'window-spawn':
        this.config.onWindowSpawn(event.payload.windowType);
        break;

      case 'clippy':
        this.config.onClippyShow(event.payload.message);
        break;

      case 'jump-scare':
        this.config.onJumpScare();
        break;

      default:
        console.warn('Unknown event type:', event.type);
    }
  }

  /**
   * Start the haunting orchestrator
   */
  start(): void {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    startPerformanceMonitoring();
    this.updateGlitchFrequency();
  }

  /**
   * Stop the haunting orchestrator
   */
  stop(): void {
    this.isRunning = false;

    if (this.glitchTimer) {
      clearTimeout(this.glitchTimer);
      this.glitchTimer = null;
    }

    stopPerformanceMonitoring();
    this.eventQueue = [];
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.stop();
    if (this.performanceUnsubscribe) {
      this.performanceUnsubscribe();
      this.performanceUnsubscribe = null;
    }
  }

  /**
   * Reset the orchestrator state
   */
  reset(): void {
    this.stop();
    this.hauntLevel = 0;
    this.eventQueue = [];
    this.initializeThresholds(); // Reset thresholds
  }

  /**
   * Get current haunt level
   */
  getHauntLevel(): number {
    return this.hauntLevel;
  }

  /**
   * Get triggered thresholds
   */
  getTriggeredThresholds(): number[] {
    return this.thresholds
      .filter((t) => t.triggered)
      .map((t) => t.level);
  }

  /**
   * Check if orchestrator is running
   */
  isActive(): boolean {
    return this.isRunning;
  }
}
