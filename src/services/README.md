# NecroOS Services

This directory contains service layer components that coordinate complex behaviors across the application.

## Haunting Orchestrator (`HauntingOrchestrator.ts`)

The Haunting Orchestrator is the central coordinator for all horror effects in NecroOS. It monitors the haunt level and triggers glitches, audio effects, window spawns, and other haunting events based on thresholds and random intervals.

### Features

- **Haunt Level Monitoring**: Tracks the current haunt level (0-100) and responds to changes
- **Threshold Events**: Triggers scripted events when crossing specific haunt level thresholds
- **Dynamic Glitch Frequency**: Adjusts glitch frequency based on haunt level (higher = more frequent)
- **Event Scheduling**: Queue and schedule events to execute immediately or after a delay
- **Event Coordination**: Coordinates glitches, audio, window spawns, Clippy appearances, and jump scares

### Haunt Level Thresholds

The orchestrator triggers specific events at these haunt levels:

- **Level 30**: Clippy appears with first message
- **Level 40**: Screen shake glitch
- **Level 50**: Readme window spawns automatically
- **Level 60**: Clippy returns with warning
- **Level 70**: Color shift glitch
- **Level 80**: Ominous audio plays
- **Level 90**: Clippy's final warning

Each threshold event triggers exactly once when the level is crossed.

### Glitch Frequency Ranges

The orchestrator adjusts glitch frequency based on haunt level:

- **0-29 (Calm)**: Glitches every 30-60 seconds
- **30-49 (Unsettling)**: Glitches every 15-30 seconds
- **50-69 (Possessed)**: Glitches every 8-15 seconds
- **70-100 (Chaos)**: Glitches every 3-8 seconds

### Usage

```typescript
import { HauntingOrchestrator } from './services/HauntingOrchestrator';
import { useNecroStore } from './store';

// Create orchestrator with callbacks
const orchestrator = new HauntingOrchestrator({
  onGlitchTrigger: (type, targetId) => {
    store.triggerGlitch(type, targetId);
  },
  onAudioTrigger: (soundId, loop) => {
    store.playSound(soundId, loop);
  },
  onWindowSpawn: (windowType) => {
    store.openWindow(windowType);
  },
  onClippyShow: (message) => {
    store.showClippy(message);
  },
  onJumpScare: () => {
    store.triggerJumpScare();
  },
});

// Start the orchestrator
orchestrator.start();

// Update haunt level (triggers threshold checks)
orchestrator.updateHauntLevel(45);

// Schedule a custom event
orchestrator.scheduleEvent({
  type: 'glitch',
  trigger: 'user-action',
  payload: { type: 'window-shift' },
}, 5000); // Execute after 5 seconds

// Stop the orchestrator
orchestrator.stop();

// Reset to initial state
orchestrator.reset();
```

### Integration with Store

The orchestrator should be initialized in the Desktop Environment component and connected to the Zustand store:

```typescript
// In DesktopEnvironment.tsx
useEffect(() => {
  const orchestrator = new HauntingOrchestrator({
    onGlitchTrigger: triggerGlitch,
    onAudioTrigger: playSound,
    onWindowSpawn: openWindow,
    onClippyShow: showClippy,
    onJumpScare: triggerJumpScare,
  });

  orchestrator.start();

  return () => {
    orchestrator.stop();
  };
}, []);

// Update orchestrator when haunt level changes
useEffect(() => {
  orchestrator.updateHauntLevel(hauntLevel);
}, [hauntLevel]);
```

### Event Types

The orchestrator supports five event types:

1. **glitch**: Triggers visual glitch effects
   - Payload: `{ type: GlitchType, targetId?: string }`

2. **audio**: Plays sound effects
   - Payload: `{ soundId: string, loop?: boolean }`

3. **window-spawn**: Opens application windows
   - Payload: `{ windowType: WindowType }`

4. **clippy**: Shows Clippy's Ghost with a message
   - Payload: `{ message: string }`

5. **jump-scare**: Triggers jump scare sequence
   - Payload: `{}`

### Testing

The Haunting Orchestrator includes comprehensive testing:

- **Unit Tests** (`HauntingOrchestrator.test.ts`): 26 tests covering all functionality
- **Property-Based Tests** (`HauntingOrchestrator.property.test.ts`): 9 property tests with 100 iterations each
  - Property 6: Glitch frequency proportional to haunt level (Requirements 9.2)
  - Property 7: Threshold event triggering (Requirements 9.3)

### API Reference

#### Constructor

```typescript
constructor(config: HauntingOrchestratorConfig)
```

#### Methods

- `start()`: Start the orchestrator (begins random glitch triggering)
- `stop()`: Stop the orchestrator (clears timers and event queue)
- `reset()`: Reset to initial state (haunt level 0, no triggered thresholds)
- `updateHauntLevel(level: number)`: Update haunt level and check thresholds
- `calculateGlitchFrequency()`: Get current glitch interval in milliseconds
- `scheduleEvent(event: HauntEvent, delayMs?: number)`: Schedule an event
- `executeEvent(event: HauntEvent)`: Execute an event immediately
- `getHauntLevel()`: Get current haunt level
- `getTriggeredThresholds()`: Get array of triggered threshold levels
- `isActive()`: Check if orchestrator is running

### Design Considerations

1. **Separation of Concerns**: The orchestrator doesn't directly manipulate state; it uses callbacks
2. **Testability**: All behavior is deterministic except for random glitch timing
3. **Performance**: Uses single timer that reschedules itself rather than multiple timers
4. **Flexibility**: Event system allows easy addition of new event types
5. **State Management**: Tracks triggered thresholds to prevent duplicate events
