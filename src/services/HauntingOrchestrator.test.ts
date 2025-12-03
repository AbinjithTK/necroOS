import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { HauntingOrchestrator, type HauntingOrchestratorConfig } from './HauntingOrchestrator';

describe('HauntingOrchestrator', () => {
  let orchestrator: HauntingOrchestrator;
  let mockConfig: HauntingOrchestratorConfig;

  beforeEach(() => {
    vi.useFakeTimers();

    mockConfig = {
      onGlitchTrigger: vi.fn(),
      onAudioTrigger: vi.fn(),
      onWindowSpawn: vi.fn(),
      onClippyShow: vi.fn(),
      onJumpScare: vi.fn(),
    };

    orchestrator = new HauntingOrchestrator(mockConfig);
  });

  afterEach(() => {
    orchestrator.stop();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('initialization', () => {
    it('should start with haunt level 0', () => {
      expect(orchestrator.getHauntLevel()).toBe(0);
    });

    it('should not be running initially', () => {
      expect(orchestrator.isActive()).toBe(false);
    });

    it('should have no triggered thresholds initially', () => {
      expect(orchestrator.getTriggeredThresholds()).toEqual([]);
    });
  });

  describe('updateHauntLevel', () => {
    it('should update haunt level', () => {
      orchestrator.updateHauntLevel(50);
      expect(orchestrator.getHauntLevel()).toBe(50);
    });

    it('should clamp haunt level to 0-100 range', () => {
      orchestrator.updateHauntLevel(-10);
      expect(orchestrator.getHauntLevel()).toBe(0);

      orchestrator.updateHauntLevel(150);
      expect(orchestrator.getHauntLevel()).toBe(100);
    });

    it('should trigger threshold events when crossing thresholds', () => {
      orchestrator.updateHauntLevel(35);
      expect(mockConfig.onClippyShow).toHaveBeenCalledWith(
        expect.stringContaining('exploring')
      );
    });

    it('should not trigger threshold events twice', () => {
      orchestrator.updateHauntLevel(35);
      vi.clearAllMocks();
      orchestrator.updateHauntLevel(40);
      expect(mockConfig.onClippyShow).not.toHaveBeenCalled();
    });
  });

  describe('calculateGlitchFrequency', () => {
    it('should return longer intervals at low haunt levels', () => {
      orchestrator.updateHauntLevel(20);
      const frequency = orchestrator.calculateGlitchFrequency();
      expect(frequency).toBeGreaterThanOrEqual(30000);
      expect(frequency).toBeLessThanOrEqual(60000);
    });

    it('should return shorter intervals at high haunt levels', () => {
      orchestrator.updateHauntLevel(80);
      const frequency = orchestrator.calculateGlitchFrequency();
      expect(frequency).toBeGreaterThanOrEqual(3000);
      expect(frequency).toBeLessThanOrEqual(8000);
    });

    it('should have decreasing frequency as haunt level increases', () => {
      orchestrator.updateHauntLevel(20);
      const lowFreq = orchestrator.calculateGlitchFrequency();

      orchestrator.updateHauntLevel(80);
      const highFreq = orchestrator.calculateGlitchFrequency();

      expect(highFreq).toBeLessThan(lowFreq);
    });
  });

  describe('start and stop', () => {
    it('should start the orchestrator', () => {
      orchestrator.start();
      expect(orchestrator.isActive()).toBe(true);
    });

    it('should stop the orchestrator', () => {
      orchestrator.start();
      orchestrator.stop();
      expect(orchestrator.isActive()).toBe(false);
    });

    it('should trigger glitches when running', () => {
      orchestrator.updateHauntLevel(50);
      orchestrator.start();

      // Fast-forward time to trigger glitch
      vi.advanceTimersByTime(20000);

      expect(mockConfig.onGlitchTrigger).toHaveBeenCalled();
    });

    it('should not trigger glitches when stopped', () => {
      orchestrator.updateHauntLevel(50);
      orchestrator.start();
      orchestrator.stop();

      vi.clearAllMocks();
      vi.advanceTimersByTime(20000);

      expect(mockConfig.onGlitchTrigger).not.toHaveBeenCalled();
    });
  });

  describe('scheduleEvent', () => {
    it('should execute event immediately when delay is 0', () => {
      orchestrator.scheduleEvent({
        type: 'audio',
        trigger: 'user-action',
        payload: { soundId: 'test-sound' },
      });

      expect(mockConfig.onAudioTrigger).toHaveBeenCalledWith('test-sound', undefined);
    });

    it('should execute event after delay', () => {
      orchestrator.scheduleEvent(
        {
          type: 'glitch',
          trigger: 'user-action',
          payload: { type: 'screen-shake' },
        },
        5000
      );

      expect(mockConfig.onGlitchTrigger).not.toHaveBeenCalled();

      vi.advanceTimersByTime(5000);

      expect(mockConfig.onGlitchTrigger).toHaveBeenCalledWith('screen-shake', undefined);
    });
  });

  describe('executeEvent', () => {
    it('should execute glitch events', () => {
      orchestrator.executeEvent({
        type: 'glitch',
        trigger: 'user-action',
        payload: { type: 'window-shift', targetId: 'test-window' },
      });

      expect(mockConfig.onGlitchTrigger).toHaveBeenCalledWith('window-shift', 'test-window');
    });

    it('should execute audio events', () => {
      orchestrator.executeEvent({
        type: 'audio',
        trigger: 'user-action',
        payload: { soundId: 'void-growl', loop: true },
      });

      expect(mockConfig.onAudioTrigger).toHaveBeenCalledWith('void-growl', true);
    });

    it('should execute window spawn events', () => {
      orchestrator.executeEvent({
        type: 'window-spawn',
        trigger: 'threshold',
        payload: { windowType: 'readme' },
      });

      expect(mockConfig.onWindowSpawn).toHaveBeenCalledWith('readme');
    });

    it('should execute clippy events', () => {
      orchestrator.executeEvent({
        type: 'clippy',
        trigger: 'threshold',
        payload: { message: 'Test message' },
      });

      expect(mockConfig.onClippyShow).toHaveBeenCalledWith('Test message');
    });

    it('should execute jump scare events', () => {
      orchestrator.executeEvent({
        type: 'jump-scare',
        trigger: 'user-action',
        payload: {},
      });

      expect(mockConfig.onJumpScare).toHaveBeenCalled();
    });
  });

  describe('reset', () => {
    it('should reset haunt level to 0', () => {
      orchestrator.updateHauntLevel(75);
      orchestrator.reset();
      expect(orchestrator.getHauntLevel()).toBe(0);
    });

    it('should stop the orchestrator', () => {
      orchestrator.start();
      orchestrator.reset();
      expect(orchestrator.isActive()).toBe(false);
    });

    it('should reset triggered thresholds', () => {
      orchestrator.updateHauntLevel(50);
      expect(orchestrator.getTriggeredThresholds().length).toBeGreaterThan(0);

      orchestrator.reset();
      expect(orchestrator.getTriggeredThresholds()).toEqual([]);
    });
  });

  describe('threshold events', () => {
    it('should trigger events at correct thresholds', () => {
      const thresholds = [30, 40, 50, 60, 70, 80, 90];

      for (const threshold of thresholds) {
        vi.clearAllMocks();
        orchestrator.updateHauntLevel(threshold);

        // At least one callback should have been called
        const totalCalls =
          (mockConfig.onGlitchTrigger as any).mock.calls.length +
          (mockConfig.onAudioTrigger as any).mock.calls.length +
          (mockConfig.onWindowSpawn as any).mock.calls.length +
          (mockConfig.onClippyShow as any).mock.calls.length;

        expect(totalCalls).toBeGreaterThan(0);
      }
    });

    it('should track triggered thresholds', () => {
      orchestrator.updateHauntLevel(55);
      const triggered = orchestrator.getTriggeredThresholds();

      expect(triggered).toContain(30);
      expect(triggered).toContain(40);
      expect(triggered).toContain(50);
      expect(triggered).not.toContain(60);
    });
  });
});
