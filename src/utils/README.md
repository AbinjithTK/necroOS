# NecroOS Utilities

This directory contains utility functions and helpers for the NecroOS application.

## Audio System (`audio.ts`)

The audio system provides Web Audio API integration for playing sounds and managing audio state.

### Features

- **Web Audio API Integration**: Uses modern Web Audio API for precise audio control
- **Sound Management**: Load, play, stop, and manage multiple audio instances
- **Volume Control**: Master volume control with clamping to valid range (0-1)
- **Looping Support**: Sounds can be played once or looped continuously
- **Browser Autoplay Compliance**: Handles browser autoplay policies gracefully
- **Error Handling**: Graceful degradation when audio files are missing

### Available Sounds

- `ambient-hum`: Continuous ambient background sound
- `void-growl`: Deep growl for "The Void" interactions
- `jump-scare`: Screeching sound for jump scare events
- `ui-click`: Optional UI click sound
- `ui-error`: Optional UI error sound

### Usage

```typescript
import * as audio from './utils/audio';

// Initialize audio context (call after user interaction)
await audio.initAudioContext();

// Preload audio files
await audio.preloadAudio();

// Play a sound
const instanceId = audio.playSound('ambient-hum', true, 0.3); // loop at 30% volume

// Stop a sound
if (instanceId) {
  audio.stopSound(instanceId);
}

// Set master volume
audio.setVolume(0.7); // 70% volume

// Get current volume
const volume = audio.getVolume();
```

### Integration with Zustand Store

The audio system is integrated with the Zustand store for global state management:

```typescript
import { useNecroStore } from './store';

// In a component
const { audioEnabled, toggleAudio, playSound, setVolume } = useNecroStore();

// Enable audio (initializes context and starts ambient)
await toggleAudio();

// Play a sound through the store
playSound('void-growl', false, 0.5);

// Adjust volume
setVolume(0.8);
```

### Audio Files

Audio files should be placed in `public/audio/` directory. See `public/audio/README.md` for specifications.

### Testing

The audio system includes:
- **Unit Tests** (`audio.test.ts`): Test core functionality
- **Property-Based Tests** (`audio.property.test.ts`): Test properties across many inputs
  - Property 21: Reactive audio triggering
  - Property 22: Audio volume compliance

## Zalgo Text (`zalgo.ts`)

Utility for transforming text into "corrupted" Zalgo-style text with diacritical marks.

### Usage

```typescript
import { zalgoify } from './utils/zalgo';

const corrupted = zalgoify('Hello World', 0.5); // 50% intensity
```

See `zalgo.test.ts` for more examples.
