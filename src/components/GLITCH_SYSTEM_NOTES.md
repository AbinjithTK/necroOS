# Advanced Glitch Effects System

## Overview

The advanced glitch effects system provides a comprehensive way to apply visual distortions to windows in NecroOS. The system supports multiple glitch types that can be applied individually or simultaneously to create an unsettling, possessed interface.

## Architecture

### Components

1. **GlitchableWindow** - Wrapper component that applies glitch effects to window content
2. **WindowManager** - Updated to integrate GlitchableWindow and pass active glitches
3. **Store (Zustand)** - Manages active glitch effects and coordinates their application

### Glitch Types

The system supports the following glitch types:

- **window-shift**: Random position offsets that make windows appear to jump around
- **color-shift**: Changes window colors to blood red or matrix green
- **text-corruption**: Applies visual distortion with skewing and color separation
- **transparency**: Makes windows semi-transparent
- **invert-colors**: Inverts the color scheme
- **zalgo-text**: Applies diacritical marks to text for a corrupted appearance

## Usage

### Triggering Glitches

```typescript
import { useNecroStore } from '../store';

// Trigger a glitch on a specific window
const triggerGlitch = useNecroStore((state) => state.triggerGlitch);
triggerGlitch('window-shift', 'window-id-123');

// Trigger a glitch on all windows (no targetId)
triggerGlitch('color-shift');
```

### Multi-Window Coordination

```typescript
import { useNecroStore, triggerMultiWindowGlitch } from '../store';

const store = useNecroStore.getState();
const windowIds = store.windows.map(w => w.id);

// Apply multiple glitch types to multiple windows
triggerMultiWindowGlitch(
  ['window-shift', 'transparency', 'text-corruption'],
  windowIds,
  store
);

// Apply to all windows (empty array)
triggerMultiWindowGlitch(
  ['color-shift'],
  [],
  store
);
```

### Glitch Duration

Glitches are automatically removed after their duration expires. The duration is randomly generated between 1-3 seconds when triggered.

## Implementation Details

### Window-Shift Glitch

When a window-shift glitch is triggered, the store updates the window's `glitchOffset` property:

```typescript
glitchOffset: {
  x: (Math.random() - 0.5) * 20,  // -10 to +10 pixels
  y: (Math.random() - 0.5) * 20,  // -10 to +10 pixels
}
```

The WindowManager applies this offset to the window's position.

### Visual Glitches

Visual glitches (color-shift, text-corruption, transparency, invert-colors) are applied via CSS animations and filters in the GlitchableWindow component.

### Zalgo Text

The zalgo-text glitch temporarily modifies text content by adding diacritical marks. The original text is stored and restored after the glitch duration.

## Testing

### Property-Based Tests

The system includes comprehensive property-based tests that verify:

- Multi-window glitch coordination (Property 29)
- Glitches can affect multiple windows simultaneously
- Targeted glitches only affect specific windows
- Global glitches affect all windows
- Mixed global and targeted glitches work correctly

### Unit Tests

Unit tests verify:
- Rendering with different glitch types
- Multiple simultaneous glitches
- Glitch targeting logic

## Performance Considerations

- CSS animations are used for better performance
- Glitches are automatically cleaned up after duration
- The system limits glitch intensity based on haunt level
- DOM manipulation for zalgo text is minimized

## Integration with Haunting Orchestrator

The HauntingOrchestrator service can trigger glitches based on haunt level:

```typescript
// In HauntingOrchestrator
if (hauntLevel > 50) {
  const glitchTypes = ['window-shift', 'color-shift', 'transparency'];
  const randomType = glitchTypes[Math.floor(Math.random() * glitchTypes.length)];
  store.triggerGlitch(randomType);
}
```

## Requirements Validation

This implementation validates the following requirements:

- **11.1**: Windows shift position by small random amounts
- **11.2**: Visual distortions including color shifts, text corruption, and transparency
- **11.3**: Subtle movements create unease
- **11.4**: Multi-window glitch coordination
- **11.5**: Windows remain draggable during glitches

## Future Enhancements

Potential improvements:
- Glitch intensity scaling based on haunt level
- More glitch types (screen-shake at viewport level, audio distortion)
- Glitch chaining (one glitch triggers another)
- Persistent glitch effects that don't auto-clear
- User-configurable glitch intensity
