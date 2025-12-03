# NecroOS Design Document

## Overview

NecroOS is a React-based browser application that simulates a haunted Windows 95 operating system. The architecture emphasizes progressive enhancement of horror elements through a centralized "Haunt Level" state system that coordinates visual glitches, AI interactions, and audio effects. The application uses React95 as a UI foundation, extended with custom components for horror theming and dynamic corruption effects.

The system is designed around three core pillars:
1. **Immersive Presentation Layer** - CRT filters, glitch effects, and Windows 95 aesthetics
2. **Interactive Application Layer** - Notepad, Minesweeper, Terminal, Portfolio, and system utilities
3. **Haunting Orchestration Layer** - AI-driven behaviors, progressive corruption, and event triggers

## Architecture

### High-Level Component Structure

```
┌─────────────────────────────────────────────────────────────┐
│                     NecroOS Application                      │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────┐  │
│  │            Boot Sequence Component                    │  │
│  │  (BIOS Screen → Login → Desktop Transition)          │  │
│  └───────────────────────────────────────────────────────┘  │
│                            ↓                                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │          Desktop Environment Container                │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  CRT Filter Overlay (CSS Effects Layer)         │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  Taskbar (SUMMON button, Countdown Clock)       │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  Desktop Icons (My Corpse, The Void, etc.)      │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  Window Manager (Application Windows)           │  │  │
│  │  │    - Notepad                                     │  │  │
│  │  │    - Minesweeper                                 │  │  │
│  │  │    - Portfolio Manager                           │  │  │
│  │  │    - Terminal                                    │  │  │
│  │  │    - My Corpse (System Stats)                    │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  Clippy's Ghost (AI Assistant)                  │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│                            ↕                                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         Global State (Zustand Store)                  │  │
│  │  - Haunt Level (0-100)                                │  │
│  │  - Window Stack (open windows, z-index)               │  │
│  │  - Audio State (playing sounds, volume)               │  │
│  │  - Glitch State (active effects, timers)              │  │
│  └───────────────────────────────────────────────────────┘  │
│                            ↕                                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │      Haunting Orchestrator (Effect Coordinator)       │  │
│  │  - Monitors Haunt Level                               │  │
│  │  - Triggers glitches, audio, AI interactions          │  │
│  │  - Manages jump scare events                          │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Frontend Framework**: React 18+ with Vite for fast development and optimized builds
- **UI Library**: react95 (Windows 95 component library) with styled-components for theming
- **State Management**: Zustand for global state (Haunt Level, windows, audio)
- **Styling**: styled-components with CSS-in-JS for dynamic theming and glitch effects
- **Audio**: Web Audio API for ambient sounds and reactive effects
- **AI Integration**: Kiro API for Clippy's Ghost responses and Notepad auto-completion
- **Build Tool**: Vite with React plugin
- **Type Safety**: TypeScript for all components and state management

## Components and Interfaces

### Core State Interface (Zustand Store)

```typescript
interface NecroOSState {
  // Haunt Level Management
  hauntLevel: number; // 0-100
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
  playSound: (soundId: string) => void;
  toggleAudio: () => void;
  
  // Glitch Management
  glitchIntensity: number; // Derived from hauntLevel
  activeGlitches: GlitchEffect[];
  triggerGlitch: (type: GlitchType) => void;
  
  // Jump Scare Management
  lastJumpScareTime: number;
  triggerJumpScare: () => void;
  
  // Clippy State
  clippyVisible: boolean;
  clippyMessage: string;
  showClippy: (message: string) => void;
  hideClippy: () => void;
}

interface WindowState {
  id: string;
  type: WindowType;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  minimized: boolean;
  content?: any;
}

type WindowType = 
  | 'notepad'
  | 'minesweeper'
  | 'portfolio'
  | 'terminal'
  | 'my-corpse'
  | 'readme'
  | 'dark-web';

type GlitchType =
  | 'window-shift'
  | 'text-corruption'
  | 'color-shift'
  | 'zalgo-text'
  | 'screen-shake';

interface GlitchEffect {
  id: string;
  type: GlitchType;
  intensity: number;
  duration: number;
  targetId?: string; // Optional window/element ID
}
```

### Desktop Environment Component

The main container that orchestrates all visual elements and manages the overall layout.

```typescript
interface DesktopEnvironmentProps {
  onHauntLevelChange?: (level: number) => void;
}

// Responsibilities:
// - Render CRT filter overlay
// - Manage desktop background
// - Coordinate taskbar and desktop icons
// - Host window manager
// - Apply global glitch effects
```

### Window Manager Component

Manages the lifecycle and rendering of all application windows with z-index stacking.

```typescript
interface WindowManagerProps {
  windows: WindowState[];
  onWindowClose: (id: string) => void;
  onWindowFocus: (id: string) => void;
  onWindowMove: (id: string, position: { x: number; y: number }) => void;
}

// Responsibilities:
// - Render all open windows
// - Handle window dragging and resizing
// - Manage z-index stacking order
// - Apply per-window glitch effects
// - Coordinate window animations
```

### Application Components

#### Notepad Component

```typescript
interface NotepadProps {
  windowId: string;
  initialContent?: string;
}

// Responsibilities:
// - Render text editor with MS Sans Serif font
// - Detect user typing and trigger AI auto-completion
// - Apply text glitch effects based on haunt level
// - Maintain text state locally
```

#### Minesweeper Component

```typescript
interface MinesweeperProps {
  windowId: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

// Responsibilities:
// - Implement classic Minesweeper game logic
// - Render skulls instead of mines, tombstones instead of flags
// - Trigger BSOD effect on game loss
// - Track game state (playing, won, lost)
```

#### Portfolio Manager Component

```typescript
interface PortfolioManagerProps {
  windowId: string;
  projects: ProjectData[];
}

interface ProjectData {
  title: string;
  description: string;
  techStack: string[];
  caseNumber: string; // For "Cold Case" theming
}

// Responsibilities:
// - Display "Obituary" (About Me section)
// - List "Cold Cases" (Past Projects)
// - Open police report-styled project detail windows
// - Apply horror theming to portfolio content
```

#### Terminal Component

```typescript
interface TerminalProps {
  windowId: string;
}

interface TerminalCommand {
  command: string;
  handler: (args: string[]) => string | void;
  description?: string;
}

// Responsibilities:
// - Render command-line interface
// - Parse and execute commands (resurrect, exorcise, sudo kill, help)
// - Maintain command history
// - Display ominous responses
// - Trigger system-wide effects based on commands
```

### Haunting Orchestrator

A service layer that monitors haunt level and coordinates horror effects across the application.

```typescript
class HauntingOrchestrator {
  private hauntLevel: number;
  private glitchTimer: NodeJS.Timeout | null;
  private eventQueue: HauntEvent[];
  
  // Monitor haunt level and trigger effects
  updateHauntLevel(level: number): void;
  
  // Schedule and execute haunting events
  scheduleEvent(event: HauntEvent): void;
  executeEvent(event: HauntEvent): void;
  
  // Glitch coordination
  triggerRandomGlitch(): void;
  calculateGlitchFrequency(): number; // Based on haunt level
  
  // Scripted events at haunt level thresholds
  checkThresholdEvents(): void;
}

interface HauntEvent {
  type: 'glitch' | 'audio' | 'window-spawn' | 'clippy' | 'jump-scare';
  trigger: 'threshold' | 'random' | 'user-action';
  payload: any;
  scheduledTime?: number;
}
```

### Clippy's Ghost (AI Assistant)

```typescript
interface ClippyGhostProps {
  visible: boolean;
  message: string;
  onDismiss: () => void;
}

// AI Integration:
// - Uses Kiro API for generating contextual, threatening messages
// - Maintains conversation history for coherent interactions
// - Triggers based on user actions (closing tab, errors, help requests)
// - Personality: Helpful but ominous, never breaks character
```

### CRT Filter Component

A pure CSS overlay that applies retro monitor effects.

```typescript
interface CRTFilterProps {
  intensity?: number; // 0-1, increases with haunt level
}

// CSS Effects:
// - Scanlines (repeating horizontal lines)
// - Chromatic aberration (RGB color separation)
// - Screen curvature (border-radius and transform)
// - Vignette (darkened edges)
// - Flicker animation (subtle opacity changes)
```

## Data Models

### Window State Model

```typescript
interface WindowState {
  id: string; // UUID
  type: WindowType;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  minimized: boolean;
  content?: any; // Application-specific data
  glitchOffset?: { x: number; y: number }; // For window-shift glitch
}
```

### Haunt Level Model

```typescript
interface HauntLevelState {
  current: number; // 0-100
  lastIncrement: number; // Timestamp
  thresholdsReached: number[]; // Track which thresholds have fired events
}

// Haunt Level Thresholds:
// 0-30: Calm (occasional glitches, rare Clippy)
// 31-50: Unsettling (frequent glitches, window shifts, Clippy appears)
// 51-70: Possessed (constant glitches, auto-opening windows, aggressive Clippy)
// 71-100: Chaos (maximum glitches, jump scares, BSOD threats)
```

### Audio State Model

```typescript
interface AudioState {
  enabled: boolean;
  ambientPlaying: boolean;
  activeSounds: ActiveSound[];
  volume: number; // 0-1
}

interface ActiveSound {
  id: string;
  type: 'ambient' | 'effect' | 'jump-scare';
  audioElement: HTMLAudioElement;
  loop: boolean;
}
```

### Glitch Effect Model

```typescript
interface GlitchEffect {
  id: string;
  type: GlitchType;
  intensity: number; // 0-1
  duration: number; // milliseconds
  targetId?: string; // Window or element ID
  startTime: number;
}

type GlitchType =
  | 'window-shift' // Move window by random offset
  | 'text-corruption' // Apply Zalgo text transformation
  | 'color-shift' // Change colors to blood red or matrix green
  | 'zalgo-text' // Add diacritical marks to text
  | 'screen-shake' // Shake entire viewport
  | 'transparency' // Make windows semi-transparent
  | 'invert-colors'; // Invert color scheme briefly
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property Reflection

After analyzing all acceptance criteria, several redundancies were identified:
- Window creation tests with specific titles can be unified into a single property
- Font and color palette tests appear in multiple requirements and can be consolidated
- Audio effect tests share common behavior and can be combined
- CRT filter tests are duplicated and can be merged

The following properties represent the unique, non-redundant correctness guarantees:

### Core Properties

**Property 1: Window creation uniqueness**
*For any* application type, when a window is opened, the system should create a window with a unique identifier that doesn't conflict with existing windows.
**Validates: Requirements 13.1**

**Property 2: Z-index ordering consistency**
*For any* set of open windows, the focused window should always have the highest z-index value.
**Validates: Requirements 13.2**

**Property 3: Window state preservation on minimize/restore**
*For any* window, minimizing then restoring should preserve its content, position, and size exactly.
**Validates: Requirements 13.4, 13.5**

**Property 4: Window cleanup on close**
*For any* window, closing it should remove it from the window stack and the window should no longer be accessible.
**Validates: Requirements 13.3**

**Property 5: Haunt level monotonic increase**
*For any* sequence of user interactions, the haunt level should never decrease (only increase or stay the same).
**Validates: Requirements 9.1**

**Property 6: Glitch frequency proportional to haunt level**
*For any* haunt level value, the frequency of glitch effects should increase monotonically with the haunt level (higher level = more frequent glitches).
**Validates: Requirements 9.2**

**Property 7: Threshold event triggering**
*For any* haunt level threshold (30, 50, 70), crossing that threshold should trigger the associated scripted event exactly once.
**Validates: Requirements 9.3**

**Property 8: Jump scare rate limiting**
*For any* sequence of jump scare triggers within 30 seconds, only the first trigger should execute a jump scare.
**Validates: Requirements 10.5**

**Property 9: Jump scare haunt level increase**
*For any* jump scare event, the haunt level after the event should be strictly greater than before the event.
**Validates: Requirements 10.4**

**Property 10: Terminal command idempotence (exorcise)**
*For any* state, executing "exorcise" command twice in succession should have the same effect as executing it once (glitches disabled for 10 seconds).
**Validates: Requirements 7.3**

**Property 11: Terminal resurrect inverse**
*For any* window, closing it then executing "resurrect" should restore a window with the same type and content.
**Validates: Requirements 7.2**

**Property 12: Minesweeper game logic correctness**
*For any* valid Minesweeper board configuration, clicking a cell should reveal the correct number of adjacent mines.
**Validates: Requirements 5.4**

**Property 13: The Void permanence**
*For any* file dragged to The Void, attempting to restore it should always fail with an error message.
**Validates: Requirements 3.3**

**Property 14: Login acceptance**
*For any* password string, logging in with username "Guest" and that password should succeed.
**Validates: Requirements 12.4**

**Property 15: Notepad text editing operations**
*For any* sequence of text editing operations (type, delete, select), the Notepad content should reflect the operations correctly.
**Validates: Requirements 4.4**

**Property 16: Window dragging during glitches**
*For any* window experiencing glitch effects, the user should still be able to drag it to a new position.
**Validates: Requirements 11.5**

**Property 17: Consistent color palette application**
*For any* UI component, the rendered colors should only use values from the defined palette (Matrix Green #00FF41, Void Black #080808, Blood Red #FF0000).
**Validates: Requirements 14.1, 2.4**

**Property 18: Consistent typography**
*For any* text element, the font-family should be MS Sans Serif unless explicitly overridden for effect.
**Validates: Requirements 1.4, 14.4**

**Property 19: CRT filter persistence**
*For any* application state, the CRT filter overlay should always be present with scanlines, chromatic aberration, and screen curvature effects.
**Validates: Requirements 1.2, 14.3**

**Property 20: Custom cursor on interactive elements**
*For any* interactive element (button, link, icon), hovering should display the custom cursor (hourglass or skeletal hand).
**Validates: Requirements 1.3**

**Property 21: Reactive audio triggering**
*For any* user action that should trigger audio (drag to Void, jump scare, UI interaction), the corresponding audio effect should play.
**Validates: Requirements 15.2, 15.3, 15.4**

**Property 22: Audio volume compliance**
*For any* playing audio, the volume should respect the system's audio state volume setting (0-1 range).
**Validates: Requirements 15.5**

**Property 23: Countdown clock format**
*For any* time, the taskbar clock should display time remaining until midnight in countdown format, not current time.
**Validates: Requirements 2.2**

**Property 24: Clippy appearance on haunt threshold**
*For any* haunt level increase that crosses a threshold, Clippy's Ghost should become visible with a contextual message.
**Validates: Requirements 8.1**

**Property 25: Clippy dismissal and re-summoning**
*For any* Clippy dismissal, the system should allow hiding Clippy, but Clippy may reappear if haunt level conditions are met.
**Validates: Requirements 8.5**

**Property 26: Rage click detection**
*For any* sequence of rapid clicks (5+ clicks within 1 second), the system should detect it as rage clicking and trigger a jump scare.
**Validates: Requirements 10.1**

**Property 27: Mouse shake detection**
*For any* sequence of rapid mouse movements (large distance in short time), the system should detect it as mouse shaking and trigger a jump scare.
**Validates: Requirements 10.2**

**Property 28: Window position glitch application**
*For any* window, when a window-shift glitch is triggered, the window position should change by a small random offset.
**Validates: Requirements 11.1**

**Property 29: Multi-window glitch coordination**
*For any* glitch effect, when multiple windows are open, the glitch should be capable of affecting multiple windows simultaneously.
**Validates: Requirements 11.4**

**Property 30: Error message styling**
*For any* error state, the error message should be displayed in Blood Red (#FF0000) color.
**Validates: Requirements 14.2**

**Property 31: Accessibility contrast compliance**
*For any* text element, the contrast ratio between text and background should meet WCAG AA standards (4.5:1 for normal text).
**Validates: Requirements 14.5**

**Property 32: Terminal error handling**
*For any* unrecognized terminal command, the system should display an error message rather than crashing or hanging.
**Validates: Requirements 7.6**

**Property 33: Zalgo text transformation**
*For any* text element with hover-triggered Zalgo effect, the transformed text should contain diacritical marks while preserving the base characters.
**Validates: Requirements 1.5**

**Property 34: Portfolio project display**
*For any* project in the portfolio data, the project should be displayed in the "Cold Cases" list with horror theming.
**Validates: Requirements 6.3**

**Property 35: Minesweeper icon theming**
*For any* Minesweeper game cell, mines should be rendered as skulls and flags should be rendered as tombstones.
**Validates: Requirements 5.2**

## Error Handling

### Window Management Errors

- **Window Not Found**: When attempting to focus, close, or minimize a non-existent window, log error and fail gracefully
- **Invalid Window Type**: When attempting to open an unsupported window type, show error dialog and prevent creation
- **Z-Index Overflow**: If z-index exceeds safe integer limits, reset all z-indices while maintaining relative order

### Audio Errors

- **Audio Permission Denied**: If browser blocks audio, show subtle notification and disable audio features
- **Audio File Load Failure**: If audio files fail to load, log error and continue without audio
- **Audio Context Suspended**: If Web Audio API context is suspended, attempt to resume on user interaction

### State Management Errors

- **Haunt Level Overflow**: Cap haunt level at 100, prevent overflow
- **Invalid State Transition**: If state update fails validation, rollback to previous state and log error
- **Zustand Store Corruption**: If store becomes corrupted, reset to initial state and show warning

### AI Integration Errors

- **Kiro API Timeout**: If AI request times out (>5s), use fallback pre-written responses
- **Kiro API Error**: If API returns error, log it and use fallback responses
- **Rate Limiting**: If API rate limit is hit, queue requests and show "Clippy is thinking..." message

### Glitch Effect Errors

- **CSS Animation Failure**: If CSS animations don't work, fall back to JavaScript-based animations
- **Performance Degradation**: If frame rate drops below 30fps, reduce glitch frequency automatically
- **Memory Leak**: Monitor glitch effect cleanup, ensure timers and event listeners are cleared

### User Input Errors

- **Invalid Terminal Command**: Show error message in terminal, don't crash
- **Drag and Drop Failure**: If drag/drop API fails, show error and allow retry
- **Click Event Failure**: If click handlers fail, log error and maintain UI responsiveness

## Testing Strategy

### Unit Testing Approach

NecroOS will use **Vitest** as the testing framework for unit tests, chosen for its speed, Vite integration, and modern API.

**Unit Test Coverage:**

1. **Component Rendering Tests**
   - Verify each component renders without crashing
   - Test that props are correctly applied
   - Verify conditional rendering logic
   - Example: Test that Notepad component renders with correct title

2. **State Management Tests**
   - Test Zustand store actions (openWindow, closeWindow, incrementHauntLevel)
   - Verify state updates are immutable
   - Test derived state calculations (glitchIntensity from hauntLevel)
   - Example: Test that closeWindow removes window from array

3. **Event Handler Tests**
   - Test click handlers, drag handlers, keyboard handlers
   - Verify event handlers call correct state updates
   - Test event handler edge cases (double-click, rapid clicks)
   - Example: Test that SUMMON button click opens start menu

4. **Utility Function Tests**
   - Test pure functions (Zalgo text transformation, color utilities)
   - Test command parsing in Terminal
   - Test haunt level threshold calculations
   - Example: Test that Zalgo transform adds diacritical marks

5. **Integration Tests**
   - Test interactions between components (opening window from desktop icon)
   - Test state changes propagating to UI updates
   - Test audio playing in response to events
   - Example: Test that dragging to Void plays audio and removes file

**Unit Test Guidelines:**
- Keep tests focused on single units of functionality
- Use React Testing Library for component tests
- Mock external dependencies (Kiro API, Web Audio API)
- Aim for fast test execution (<100ms per test)
- Write descriptive test names that explain what is being tested

### Property-Based Testing Approach

NecroOS will use **fast-check** as the property-based testing library, chosen for its TypeScript support and comprehensive generator library.

**Property-Based Test Configuration:**
- Each property test should run a minimum of 100 iterations
- Use custom generators for domain-specific types (WindowState, HauntLevel, GlitchEffect)
- Configure shrinking to find minimal failing examples
- Set seed for reproducible test runs during debugging

**Property Test Coverage:**

Each correctness property listed above will be implemented as a property-based test. The tests will:

1. **Generate Random Inputs**: Use fast-check generators to create random but valid test data
   - Example: Generate random window configurations, haunt levels, user interactions

2. **Execute Operations**: Perform the operations described in the property
   - Example: Open windows, trigger glitches, execute terminal commands

3. **Assert Invariants**: Verify the property holds for all generated inputs
   - Example: Assert focused window always has highest z-index

4. **Tag with Property Reference**: Each test must include a comment linking to the design property
   - Format: `// Feature: necro-os, Property 2: Z-index ordering consistency`

**Property Test Examples:**

```typescript
// Feature: necro-os, Property 1: Window creation uniqueness
test('window IDs are always unique', () => {
  fc.assert(
    fc.property(
      fc.array(fc.constantFrom('notepad', 'terminal', 'minesweeper'), { minLength: 1, maxLength: 10 }),
      (windowTypes) => {
        const store = createStore();
        const ids = windowTypes.map(type => {
          store.openWindow(type);
          return store.windows[store.windows.length - 1].id;
        });
        const uniqueIds = new Set(ids);
        return ids.length === uniqueIds.size;
      }
    ),
    { numRuns: 100 }
  );
});

// Feature: necro-os, Property 5: Haunt level monotonic increase
test('haunt level never decreases', () => {
  fc.assert(
    fc.property(
      fc.array(fc.integer({ min: 1, max: 10 }), { minLength: 1, maxLength: 20 }),
      (increments) => {
        const store = createStore();
        let previousLevel = store.hauntLevel;
        for (const increment of increments) {
          store.incrementHauntLevel(increment);
          const currentLevel = store.hauntLevel;
          if (currentLevel < previousLevel) return false;
          previousLevel = currentLevel;
        }
        return true;
      }
    ),
    { numRuns: 100 }
  );
});

// Feature: necro-os, Property 11: Terminal resurrect inverse
test('closing then resurrecting restores window', () => {
  fc.assert(
    fc.property(
      fc.constantFrom('notepad', 'terminal', 'minesweeper', 'portfolio'),
      (windowType) => {
        const store = createStore();
        store.openWindow(windowType);
        const originalWindow = store.windows[0];
        const originalType = originalWindow.type;
        
        store.closeWindow(originalWindow.id);
        executeTerminalCommand(store, 'resurrect');
        
        const restoredWindow = store.windows[store.windows.length - 1];
        return restoredWindow.type === originalType;
      }
    ),
    { numRuns: 100 }
  );
});
```

**Custom Generators:**

```typescript
// Generator for valid window states
const windowStateArbitrary = fc.record({
  id: fc.uuid(),
  type: fc.constantFrom('notepad', 'terminal', 'minesweeper', 'portfolio', 'my-corpse'),
  title: fc.string(),
  position: fc.record({ x: fc.integer({ min: 0, max: 1920 }), y: fc.integer({ min: 0, max: 1080 }) }),
  size: fc.record({ width: fc.integer({ min: 200, max: 800 }), height: fc.integer({ min: 150, max: 600 }) }),
  zIndex: fc.integer({ min: 1, max: 1000 }),
  minimized: fc.boolean()
});

// Generator for haunt levels
const hauntLevelArbitrary = fc.integer({ min: 0, max: 100 });

// Generator for glitch effects
const glitchEffectArbitrary = fc.record({
  id: fc.uuid(),
  type: fc.constantFrom('window-shift', 'text-corruption', 'color-shift', 'zalgo-text', 'screen-shake'),
  intensity: fc.float({ min: 0, max: 1 }),
  duration: fc.integer({ min: 100, max: 5000 }),
  targetId: fc.option(fc.uuid()),
  startTime: fc.integer({ min: 0, max: Date.now() })
});
```

**Property Test Organization:**
- Group tests by domain (window-management.property.test.ts, haunt-level.property.test.ts)
- Each test file should test related properties
- Use descriptive test names that reference the property number
- Include comments explaining the property being tested

### End-to-End Testing

While not part of the core implementation tasks, E2E tests can be added later using Playwright to test:
- Full user journeys (boot → login → interact → haunting escalation)
- Cross-browser compatibility
- Performance under sustained interaction
- Audio/visual effects in real browser environment

### Testing Best Practices

1. **Test Isolation**: Each test should be independent and not rely on other tests
2. **Fast Feedback**: Unit tests should run in <5 seconds total
3. **Clear Failures**: Test failures should clearly indicate what went wrong
4. **Maintainability**: Tests should be easy to update when requirements change
5. **Coverage Goals**: Aim for >80% code coverage, 100% property coverage
6. **Continuous Integration**: Run tests on every commit
7. **Property Test Debugging**: When property tests fail, use the shrunk example to debug

## Implementation Notes

### Performance Considerations

1. **Glitch Effect Optimization**
   - Use CSS transforms instead of position changes for better performance
   - Batch DOM updates using requestAnimationFrame
   - Limit number of simultaneous glitch effects based on device capabilities
   - Use will-change CSS property for animated elements

2. **Audio Management**
   - Preload audio files on boot sequence
   - Use Web Audio API for precise timing and mixing
   - Implement audio sprite for multiple sound effects in single file
   - Respect browser autoplay policies

3. **State Updates**
   - Use Zustand's shallow equality checking to prevent unnecessary re-renders
   - Memoize expensive computations (glitch frequency calculations)
   - Debounce rapid state updates (haunt level increments)

4. **Window Management**
   - Virtualize off-screen windows to reduce render cost
   - Use CSS containment for window isolation
   - Limit maximum number of open windows (e.g., 10)

### Accessibility Considerations

While NecroOS is intentionally unsettling, it should still be accessible:

1. **Keyboard Navigation**: All interactive elements should be keyboard accessible
2. **Screen Reader Support**: Provide aria-labels for custom components
3. **Reduced Motion**: Respect prefers-reduced-motion media query to disable animations
4. **Color Contrast**: Ensure text meets WCAG AA standards despite horror theming
5. **Audio Control**: Provide mute button for users who need silence
6. **Seizure Warning**: Display warning about flashing effects on boot screen

### Browser Compatibility

Target modern browsers with ES2020+ support:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

Graceful degradation for:
- Older browsers: Disable advanced CSS effects, maintain core functionality
- Mobile devices: Adapt touch interactions, reduce glitch intensity

### Development Workflow

1. **Component Development**: Build components in isolation using Storybook (optional)
2. **State Management**: Implement Zustand store with TypeScript for type safety
3. **Styling**: Use styled-components with theme provider for consistent styling
4. **Testing**: Write tests alongside implementation (TDD approach)
5. **Integration**: Connect components to global state and test interactions
6. **Polish**: Add glitch effects, audio, and AI integration
7. **Optimization**: Profile performance and optimize bottlenecks

### Deployment Considerations

- **Static Hosting**: Application can be deployed as static files (Vite build output)
- **CDN**: Use CDN for audio files and assets
- **Environment Variables**: Configure Kiro API endpoint via environment variables
- **Analytics**: Optional analytics to track user engagement and haunt level progression
- **Error Tracking**: Integrate error tracking (Sentry) for production debugging

## Future Enhancements

Potential features for future iterations:

1. **Persistent Haunt Level**: Save haunt level to localStorage, continue haunting across sessions
2. **Multiple Endings**: Different outcomes based on final haunt level
3. **Achievements**: Unlock hidden features by triggering specific events
4. **Multiplayer**: Share haunted desktop state with other users
5. **Custom Themes**: Allow users to create their own horror themes
6. **Mobile App**: Native mobile version with touch-optimized interactions
7. **VR Mode**: Immersive VR experience of the haunted desktop
8. **Procedural Glitches**: AI-generated glitch effects based on user behavior patterns
