/**
 * Audio System for NecroOS
 * Manages Web Audio API context, sound loading, and playback
 * Includes comprehensive error handling for audio permission denied,
 * file loading failures, and context suspension
 */

export type SoundId = 
  | 'ambient-hum'
  | 'void-growl'
  | 'jump-scare'
  | 'ui-click'
  | 'ui-error';

export type AudioErrorType =
  | 'permission-denied'
  | 'context-failed'
  | 'file-not-found'
  | 'decode-failed'
  | 'playback-failed';

export interface AudioError {
  type: AudioErrorType;
  message: string;
  originalError?: Error;
}

interface AudioManager {
  context: AudioContext | null;
  sounds: Map<SoundId, AudioBuffer>;
  activeSources: Map<string, AudioBufferSourceNode>;
  gainNode: GainNode | null;
  volume: number;
  initialized: boolean;
  permissionDenied: boolean;
  errors: AudioError[];
}

const audioManager: AudioManager = {
  context: null,
  sounds: new Map(),
  activeSources: new Map(),
  gainNode: null,
  volume: 0.5,
  initialized: false,
  permissionDenied: false,
  errors: [],
};

/**
 * Log an audio error
 */
function logAudioError(error: AudioError): void {
  audioManager.errors.push(error);
  console.error(`[Audio Error] ${error.type}: ${error.message}`, error.originalError);
}

/**
 * Get all audio errors
 */
export function getAudioErrors(): AudioError[] {
  return [...audioManager.errors];
}

/**
 * Clear audio errors
 */
export function clearAudioErrors(): void {
  audioManager.errors = [];
}

/**
 * Check if audio permission was denied
 */
export function isAudioPermissionDenied(): boolean {
  return audioManager.permissionDenied;
}

/**
 * Initialize the Web Audio API context
 * Must be called after user interaction due to browser autoplay policies
 * Includes comprehensive error handling for permission denied and context failures
 */
export async function initAudioContext(): Promise<boolean> {
  if (audioManager.initialized) {
    return true;
  }

  try {
    // Check if AudioContext is supported
    if (!window.AudioContext && !(window as any).webkitAudioContext) {
      logAudioError({
        type: 'context-failed',
        message: 'Web Audio API not supported in this browser',
      });
      return false;
    }

    // Create audio context
    audioManager.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create master gain node for volume control
    audioManager.gainNode = audioManager.context.createGain();
    audioManager.gainNode.connect(audioManager.context.destination);
    audioManager.gainNode.gain.value = audioManager.volume;

    // Resume context if suspended (browser autoplay policy)
    if (audioManager.context.state === 'suspended') {
      try {
        await audioManager.context.resume();
      } catch (resumeError) {
        logAudioError({
          type: 'permission-denied',
          message: 'Audio context resume failed - user interaction may be required',
          originalError: resumeError as Error,
        });
        audioManager.permissionDenied = true;
        return false;
      }
    }

    // Check if context is running
    if (audioManager.context.state === 'running') {
      audioManager.initialized = true;
      audioManager.permissionDenied = false;
      return true;
    } else {
      logAudioError({
        type: 'permission-denied',
        message: `Audio context in ${audioManager.context.state} state - user interaction required`,
      });
      audioManager.permissionDenied = true;
      return false;
    }
  } catch (error) {
    logAudioError({
      type: 'context-failed',
      message: 'Failed to initialize audio context',
      originalError: error as Error,
    });
    audioManager.permissionDenied = true;
    return false;
  }
}

/**
 * Load an audio file and decode it into an AudioBuffer
 * Includes error handling for file not found and decode failures
 */
async function loadSound(soundId: SoundId, url: string): Promise<void> {
  if (!audioManager.context) {
    logAudioError({
      type: 'context-failed',
      message: 'Cannot load sound - audio context not initialized',
    });
    throw new Error('Audio context not initialized');
  }

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      logAudioError({
        type: 'file-not-found',
        message: `Audio file not found: ${url} (${response.status})`,
      });
      throw new Error(`Failed to fetch audio file: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    
    try {
      const audioBuffer = await audioManager.context.decodeAudioData(arrayBuffer);
      audioManager.sounds.set(soundId, audioBuffer);
    } catch (decodeError) {
      logAudioError({
        type: 'decode-failed',
        message: `Failed to decode audio file: ${soundId}`,
        originalError: decodeError as Error,
      });
      throw decodeError;
    }
  } catch (error) {
    if (error instanceof TypeError) {
      logAudioError({
        type: 'file-not-found',
        message: `Network error loading audio file: ${url}`,
        originalError: error,
      });
    }
    throw error;
  }
}

/**
 * Preload all audio files
 * Call this during boot sequence to avoid delays during playback
 */
export async function preloadAudio(): Promise<void> {
  if (!audioManager.context) {
    await initAudioContext();
  }

  // Note: In a real implementation, these would be actual audio file URLs
  // For now, we'll create placeholder entries
  const soundUrls: Record<SoundId, string> = {
    'ambient-hum': '/audio/ambient-hum.mp3',
    'void-growl': '/audio/void-growl.mp3',
    'jump-scare': '/audio/jump-scare.mp3',
    'ui-click': '/audio/ui-click.mp3',
    'ui-error': '/audio/ui-error.mp3',
  };

  const loadPromises = Object.entries(soundUrls).map(([soundId, url]) =>
    loadSound(soundId as SoundId, url).catch(() => {
      // Silently fail for missing audio files in development
      console.warn(`Audio file not found: ${url}`);
    })
  );

  await Promise.all(loadPromises);
}

/**
 * Play a sound effect
 * @param soundId - The sound to play
 * @param loop - Whether to loop the sound
 * @param volume - Optional volume override (0-1)
 * @returns A unique identifier for this sound instance, or null if playback failed
 * Includes error handling for playback failures
 */
export function playSound(
  soundId: SoundId,
  loop: boolean = false,
  volume?: number
): string | null {
  if (!audioManager.context || !audioManager.gainNode) {
    // Silently fail if audio not initialized (user may have denied permission)
    return null;
  }

  const buffer = audioManager.sounds.get(soundId);
  if (!buffer) {
    // Sound not loaded - this is expected for missing audio files in development
    return null;
  }

  try {
    // Create source node
    const source = audioManager.context.createBufferSource();
    source.buffer = buffer;
    source.loop = loop;

    // Create gain node for this sound
    const soundGain = audioManager.context.createGain();
    soundGain.gain.value = volume !== undefined ? volume : 1.0;

    // Connect: source -> soundGain -> masterGain -> destination
    source.connect(soundGain);
    soundGain.connect(audioManager.gainNode);

    // Generate unique ID for this sound instance
    const instanceId = `${soundId}-${Date.now()}-${Math.random()}`;

    // Store reference
    audioManager.activeSources.set(instanceId, source);

    // Clean up when sound ends
    source.onended = () => {
      audioManager.activeSources.delete(instanceId);
    };

    // Start playback
    source.start(0);

    return instanceId;
  } catch (error) {
    logAudioError({
      type: 'playback-failed',
      message: `Failed to play sound: ${soundId}`,
      originalError: error as Error,
    });
    return null;
  }
}

/**
 * Stop a specific sound instance
 */
export function stopSound(instanceId: string): void {
  const source = audioManager.activeSources.get(instanceId);
  if (source) {
    try {
      source.stop();
      audioManager.activeSources.delete(instanceId);
    } catch (error) {
      // Sound may have already ended
      console.warn('Failed to stop sound:', error);
    }
  }
}

/**
 * Stop all currently playing sounds
 */
export function stopAllSounds(): void {
  audioManager.activeSources.forEach((source) => {
    try {
      source.stop();
    } catch (error) {
      // Ignore errors for sounds that already ended
    }
  });
  audioManager.activeSources.clear();
}

/**
 * Set the master volume
 * @param volume - Volume level (0-1)
 */
export function setVolume(volume: number): void {
  audioManager.volume = Math.max(0, Math.min(1, volume));
  if (audioManager.gainNode) {
    audioManager.gainNode.gain.value = audioManager.volume;
  }
}

/**
 * Get the current master volume
 */
export function getVolume(): number {
  return audioManager.volume;
}

/**
 * Check if audio system is initialized
 */
export function isAudioInitialized(): boolean {
  return audioManager.initialized;
}

/**
 * Get the audio context state
 */
export function getAudioContextState(): AudioContextState | null {
  return audioManager.context?.state || null;
}

/**
 * Resume audio context (needed after browser suspends it)
 */
export async function resumeAudioContext(): Promise<void> {
  if (audioManager.context && audioManager.context.state === 'suspended') {
    await audioManager.context.resume();
  }
}
