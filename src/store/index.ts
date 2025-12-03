import { create } from 'zustand';
import type { NecroOSState, WindowType, WindowState, GlitchType, GlitchEffect } from './types';
import * as audioUtils from '../utils/audio';

export * from './types';

let nextZIndex = 1;

/**
 * Helper function to trigger coordinated glitches across multiple windows
 * @param glitchTypes - Array of glitch types to apply
 * @param windowIds - Optional array of specific window IDs to target (if empty, affects all windows)
 * @param store - The store instance
 */
export function triggerMultiWindowGlitch(
  glitchTypes: GlitchType[],
  windowIds: string[],
  store: ReturnType<typeof useNecroStore.getState>
) {
  glitchTypes.forEach((type) => {
    if (windowIds.length === 0) {
      // Apply to all windows by not specifying targetId
      store.triggerGlitch(type);
    } else {
      // Apply to specific windows
      windowIds.forEach((windowId) => {
        store.triggerGlitch(type, windowId);
      });
    }
  });
}

export const useNecroStore = create<NecroOSState>((set, get) => ({
  // Haunt Level Management
  hauntLevel: 0,
  incrementHauntLevel: (amount: number) => {
    set((state) => ({
      hauntLevel: Math.min(100, state.hauntLevel + amount),
    }));
  },

  // Window Management
  windows: [],
  openWindow: (type: WindowType, props?: any) => {
    const currentWindows = get().windows;
    
    // Enforce window limit (max 10 windows)
    if (currentWindows.length >= 10) {
      console.warn('Maximum window limit reached (10 windows)');
      // Optionally show error message to user
      return;
    }

    const id = crypto.randomUUID();
    const titles: Record<WindowType, string> = {
      notepad: 'Notepad.exe (The Ouija Board)',
      minesweeper: 'Soul Sweeper',
      portfolio: 'The Graveyard',
      terminal: 'The Summoning Circle',
      'my-corpse': 'My Corpse',
      readme: 'Readme.txt',
      'dark-web': 'Dark Web Browser',
    };

    const newWindow: WindowState = {
      id,
      type,
      title: titles[type],
      position: { x: 100 + Math.random() * 200, y: 100 + Math.random() * 100 },
      size: { width: 600, height: 400 },
      zIndex: nextZIndex++,
      minimized: false,
      content: props,
    };

    set((state) => ({
      windows: [...state.windows, newWindow],
    }));
  },

  closeWindow: (id: string) => {
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
    }));
  },

  focusWindow: (id: string) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, zIndex: nextZIndex++ } : w
      ),
    }));
  },

  minimizeWindow: (id: string) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, minimized: true } : w
      ),
    }));
  },

  restoreWindow: (id: string) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, minimized: false } : w
      ),
    }));
  },

  // Audio Management
  audioEnabled: false,
  ambientPlaying: false,
  ambientInstanceId: null,
  volume: 0.5,
  
  playSound: (soundId: string, loop: boolean = false, volume?: number) => {
    if (!get().audioEnabled) {
      return null;
    }
    
    const instanceId = audioUtils.playSound(
      soundId as audioUtils.SoundId,
      loop,
      volume
    );
    
    return instanceId;
  },
  
  stopSound: (instanceId: string) => {
    audioUtils.stopSound(instanceId);
  },
  
  toggleAudio: async () => {
    const currentState = get().audioEnabled;
    const newState = !currentState;
    
    if (newState) {
      // Initialize audio context if needed
      const initialized = await audioUtils.initAudioContext();
      if (!initialized) {
        console.error('Failed to initialize audio');
        return;
      }
      
      // Start ambient sound
      const ambientId = audioUtils.playSound('ambient-hum', true, 0.3);
      set({
        audioEnabled: true,
        ambientPlaying: true,
        ambientInstanceId: ambientId,
      });
    } else {
      // Stop ambient sound
      const ambientId = get().ambientInstanceId;
      if (ambientId) {
        audioUtils.stopSound(ambientId);
      }
      
      set({
        audioEnabled: false,
        ambientPlaying: false,
        ambientInstanceId: null,
      });
    }
  },
  
  setAmbientPlaying: (playing: boolean) => {
    const currentAmbientId = get().ambientInstanceId;
    
    if (playing && !currentAmbientId && get().audioEnabled) {
      // Start ambient
      const ambientId = audioUtils.playSound('ambient-hum', true, 0.3);
      set({
        ambientPlaying: true,
        ambientInstanceId: ambientId,
      });
    } else if (!playing && currentAmbientId) {
      // Stop ambient
      audioUtils.stopSound(currentAmbientId);
      set({
        ambientPlaying: false,
        ambientInstanceId: null,
      });
    }
  },
  
  setVolume: (volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    audioUtils.setVolume(clampedVolume);
    set({ volume: clampedVolume });
  },

  // Glitch Management
  glitchIntensity: 0,
  activeGlitches: [],
  triggerGlitch: (type: GlitchType, targetId?: string) => {
    const glitch: GlitchEffect = {
      id: crypto.randomUUID(),
      type,
      intensity: get().hauntLevel / 100,
      duration: 1000 + Math.random() * 2000,
      targetId,
      startTime: Date.now(),
    };

    set((state) => ({
      activeGlitches: [...state.activeGlitches, glitch],
      glitchIntensity: state.hauntLevel / 100,
    }));

    // Apply window-shift glitch by updating window position offset
    if (type === 'window-shift' && targetId) {
      set((state) => ({
        windows: state.windows.map((w) =>
          w.id === targetId
            ? {
                ...w,
                glitchOffset: {
                  x: (Math.random() - 0.5) * 20,
                  y: (Math.random() - 0.5) * 20,
                },
              }
            : w
        ),
      }));

      // Clear glitch offset after duration
      setTimeout(() => {
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === targetId ? { ...w, glitchOffset: undefined } : w
          ),
        }));
      }, glitch.duration);
    }

    // Auto-remove glitch after duration
    setTimeout(() => {
      set((state) => ({
        activeGlitches: state.activeGlitches.filter((g) => g.id !== glitch.id),
      }));
    }, glitch.duration);
  },

  // Jump Scare Management
  lastJumpScareTime: 0,
  triggerJumpScare: () => {
    const now = Date.now();
    const timeSinceLastScare = now - get().lastJumpScareTime;

    // Rate limiting: prevent jump scares within 30 seconds
    if (timeSinceLastScare < 30000) {
      return;
    }

    set({
      lastJumpScareTime: now,
    });

    // Increase haunt level after jump scare
    get().incrementHauntLevel(5);

    // Trigger visual/audio effects (placeholder)
    console.log('JUMP SCARE!');
  },

  // Clippy State
  clippyVisible: false,
  clippyMessage: '',
  showClippy: (message: string) => {
    set({
      clippyVisible: true,
      clippyMessage: message,
    });
  },
  hideClippy: () => {
    set({
      clippyVisible: false,
      clippyMessage: '',
    });
  },
}));
