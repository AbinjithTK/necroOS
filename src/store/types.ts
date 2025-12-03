// Core type definitions for NecroOS state management

export type WindowType =
  | 'notepad'
  | 'minesweeper'
  | 'portfolio'
  | 'terminal'
  | 'my-corpse'
  | 'readme'
  | 'dark-web';

export type GlitchType =
  | 'window-shift'
  | 'text-corruption'
  | 'color-shift'
  | 'zalgo-text'
  | 'screen-shake'
  | 'transparency'
  | 'invert-colors';

export interface WindowState {
  id: string;
  type: WindowType;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  minimized: boolean;
  content?: any;
  glitchOffset?: { x: number; y: number };
}

export interface GlitchEffect {
  id: string;
  type: GlitchType;
  intensity: number;
  duration: number;
  targetId?: string;
  startTime: number;
}

export interface ActiveSound {
  id: string;
  type: 'ambient' | 'effect' | 'jump-scare';
  audioElement: HTMLAudioElement;
  loop: boolean;
}

export interface AudioState {
  enabled: boolean;
  ambientPlaying: boolean;
  activeSounds: ActiveSound[];
  volume: number;
}

export interface NecroOSState {
  // Haunt Level Management
  hauntLevel: number;
  incrementHauntLevel: (amount: number) => void;

  // Window Management
  windows: WindowState[];
  openWindow: (type: WindowType, props?: any) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;

  // Audio Management
  audioEnabled: boolean;
  ambientPlaying: boolean;
  ambientInstanceId: string | null;
  volume: number;
  playSound: (soundId: string, loop?: boolean, volume?: number) => string | null;
  stopSound: (instanceId: string) => void;
  toggleAudio: () => void;
  setAmbientPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;

  // Glitch Management
  glitchIntensity: number;
  activeGlitches: GlitchEffect[];
  triggerGlitch: (type: GlitchType, targetId?: string) => void;

  // Jump Scare Management
  lastJumpScareTime: number;
  triggerJumpScare: () => void;

  // Clippy State
  clippyVisible: boolean;
  clippyMessage: string;
  showClippy: (message: string) => void;
  hideClippy: () => void;
}
