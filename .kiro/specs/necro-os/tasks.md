# Implementation Plan

- [x] 1. Project setup and core infrastructure





  - Initialize Vite + React + TypeScript project
  - Install dependencies: react95, styled-components, zustand, fast-check, vitest
  - Configure TypeScript with strict mode
  - Set up Vitest configuration for unit and property tests
  - Create project directory structure (components, store, utils, assets)
  - _Requirements: All (foundation for entire application)_

- [x] 2. Implement global state management with Zustand





  - Create Zustand store with TypeScript interfaces for NecroOSState
  - Implement haunt level management (state, increment function, thresholds)
  - Implement window management (open, close, focus, minimize, restore)
  - Implement audio state management (enabled, playing sounds, volume)
  - Implement glitch state management (active glitches, intensity calculation)
  - Implement jump scare state (last trigger time, rate limiting)
  - Implement Clippy state (visible, message)
  - _Requirements: 9.1, 13.1, 13.2, 13.3, 13.4, 13.5, 15.1_

- [x] 2.1 Write property test for haunt level monotonic increase


  - **Property 5: Haunt level monotonic increase**
  - **Validates: Requirements 9.1**

- [x] 2.2 Write property test for window creation uniqueness


  - **Property 1: Window creation uniqueness**
  - **Validates: Requirements 13.1**

- [x] 2.3 Write property test for z-index ordering


  - **Property 2: Z-index ordering consistency**
  - **Validates: Requirements 13.2**

- [x] 2.4 Write property test for window state preservation


  - **Property 3: Window state preservation on minimize/restore**
  - **Validates: Requirements 13.4, 13.5**

- [x] 2.5 Write property test for window cleanup


  - **Property 4: Window cleanup on close**
  - **Validates: Requirements 13.3**

- [x] 3. Create CRT filter and visual effects system





  - Implement CRT Filter component with CSS effects (scanlines, chromatic aberration, curvature)
  - Create styled-components theme with color palette (Matrix Green, Void Black, Blood Red)
  - Implement custom cursor styles (hourglass, skeletal hand)
  - Create Zalgo text transformation utility function
  - Implement glitch effect CSS animations (window-shift, color-shift, screen-shake, text-corruption)
  - _Requirements: 1.2, 1.3, 1.5, 14.1, 14.3_

- [x] 3.1 Write property test for CRT filter persistence


  - **Property 19: CRT filter persistence**
  - **Validates: Requirements 1.2, 14.3**

- [x] 3.2 Write property test for consistent color palette


  - **Property 17: Consistent color palette application**
  - **Validates: Requirements 14.1, 2.4**

- [x] 3.3 Write property test for custom cursor


  - **Property 20: Custom cursor on interactive elements**
  - **Validates: Requirements 1.3**

- [x] 3.4 Write property test for Zalgo text transformation


  - **Property 33: Zalgo text transformation**
  - **Validates: Requirements 1.5**

- [x] 4. Build boot sequence and login flow





  - Create BootScreen component with BIOS-style animation
  - Create LoginPrompt component that accepts any password for "Guest"
  - Implement boot sequence state machine (boot → login → desktop)
  - Add loading progress indicator and "Loading NecroOS..." text
  - Implement transition animations between boot stages
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [x] 4.1 Write property test for login acceptance


  - **Property 14: Login acceptance**
  - **Validates: Requirements 12.4**

- [x] 5. Implement Desktop Environment container





  - Create DesktopEnvironment component as main container
  - Integrate CRT filter overlay
  - Set up desktop background with horror theming
  - Implement ambient audio initialization and looping
  - Connect to Zustand store for global state
  - _Requirements: 1.1, 15.1_

- [x] 6. Build Taskbar component



  - Create Taskbar component with Windows 95 styling
  - Implement "SUMMON" button with explosive glitch animation
  - Create countdown clock that counts to midnight (00:00)
  - Implement clock countdown logic and display formatting
  - Add jump scare trigger when countdown reaches 00:00
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 6.1 Write property test for countdown clock format


  - **Property 23: Countdown clock format**
  - **Validates: Requirements 2.2**

- [x] 7. Create Desktop Icons component



  - Implement DesktopIcons component with icon grid layout
  - Create "My Corpse" icon with double-click handler
  - Create "The Void" icon with drag-and-drop handler
  - Create "Dark Web" icon with double-click handler
  - Create "Readme.txt" icon with double-click handler
  - Style icons with horror theming and custom cursors
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 7.1 Write property test for The Void permanence


  - **Property 13: The Void permanence**
  - **Validates: Requirements 3.3**

- [x] 8. Implement Window Manager component




  - Create WindowManager component that renders all open windows
  - Implement window dragging functionality with mouse events
  - Implement window resizing functionality
  - Implement z-index management and focus handling
  - Add window minimize/restore animations
  - Apply glitch effects to windows based on haunt level
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 11.1, 11.5_

- [x] 8.1 Write property test for window dragging during glitches


  - **Property 16: Window dragging during glitches**
  - **Validates: Requirements 11.5**

- [x] 8.2 Write property test for window position glitch


  - **Property 28: Window position glitch application**
  - **Validates: Requirements 11.1**

- [x] 9. Build Notepad application





  - Create Notepad component with text editor functionality
  - Implement text input handling (typing, deleting, selecting)
  - Add AI auto-completion integration (call Kiro API on typing)
  - Implement ominous text appending based on AI responses
  - Style with MS Sans Serif font and horror theming
  - _Requirements: 4.1, 4.2, 4.4_

- [x] 9.1 Write property test for Notepad text editing


  - **Property 15: Notepad text editing operations**
  - **Validates: Requirements 4.4**

- [x] 10. Build Minesweeper (Soul Sweeper) game





  - Create Minesweeper component with game board grid
  - Implement classic Minesweeper game logic (cell revealing, flagging, mine detection)
  - Replace mine icons with skulls and flag icons with tombstones
  - Implement win/loss detection
  - Add BSOD effect trigger on game loss
  - Style with horror theming
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 10.1 Write property test for Minesweeper game logic


  - **Property 12: Minesweeper game logic correctness**
  - **Validates: Requirements 5.4**

- [x] 10.2 Write property test for Minesweeper icon theming


  - **Property 35: Minesweeper icon theming**
  - **Validates: Requirements 5.2**

- [x] 11. Build Portfolio Manager (The Graveyard)



  - Create PortfolioManager component with sections layout
  - Implement "Obituary" section (About Me) with horror theming
  - Implement "Cold Cases" section (Past Projects) with project list
  - Create project detail window with police report styling
  - Add project data structure and sample projects
  - Style with horror theming while maintaining readability
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 11.1 Write property test for portfolio project display


  - **Property 34: Portfolio project display**
  - **Validates: Requirements 6.3**

- [x] 12. Build Terminal (The Summoning Circle)





  - Create Terminal component with command-line interface
  - Implement command parsing and execution system
  - Add "resurrect" command to restore last closed window
  - Add "exorcise" command to disable glitches for 10 seconds
  - Add "sudo kill" command to trigger system crash effect
  - Add "help" command with ominous response
  - Implement error handling for unrecognized commands
  - Style with monospace font and horror theming
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [x] 12.1 Write property test for terminal resurrect command


  - **Property 11: Terminal resurrect inverse**
  - **Validates: Requirements 7.2**

- [x] 12.2 Write property test for terminal exorcise idempotence

  - **Property 10: Terminal command idempotence (exorcise)**
  - **Validates: Requirements 7.3**

- [x] 12.3 Write property test for terminal error handling

  - **Property 32: Terminal error handling**
  - **Validates: Requirements 7.6**

- [x] 13. Build My Corpse (System Stats) window





  - Create MyCorpse component displaying system statistics
  - Implement "Soul Integrity" percentage calculation based on haunt level
  - Implement "Haunted RAM" display with horror-themed values
  - Add additional spooky system stats (Cursed CPU, Damned Disk, etc.)
  - Style with horror theming and glitch effects
  - _Requirements: 3.1_

- [x] 14. Implement audio system





  - Set up Web Audio API context and audio loading
  - Create audio utility functions (playSound, stopSound, setVolume)
  - Add ambient hum audio file and looping logic
  - Add low growl audio for The Void drag events
  - Add screeching audio for jump scares
  - Add optional UI click/error sounds
  - Implement audio permission handling and user controls
  - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

- [x] 14.1 Write property test for reactive audio triggering


  - **Property 21: Reactive audio triggering**
  - **Validates: Requirements 15.2, 15.3, 15.4**

- [x] 14.2 Write property test for audio volume compliance


  - **Property 22: Audio volume compliance**
  - **Validates: Requirements 15.5**

- [x] 15. Implement Haunting Orchestrator service



  - Create HauntingOrchestrator class to coordinate horror effects
  - Implement haunt level monitoring and threshold detection
  - Implement glitch frequency calculation based on haunt level
  - Add random glitch triggering with frequency based on haunt level
  - Implement scripted event system for threshold-based events
  - Add event queue and scheduling system
  - _Requirements: 9.2, 9.3, 9.4, 9.5_

- [x] 15.1 Write property test for glitch frequency proportionality


  - **Property 6: Glitch frequency proportional to haunt level**
  - **Validates: Requirements 9.2**

- [x] 15.2 Write property test for threshold event triggering


  - **Property 7: Threshold event triggering**
  - **Validates: Requirements 9.3**

- [x] 16. Implement Clippy's Ghost AI assistant



  - Create ClippyGhost component with animated character
  - Integrate Kiro API for AI-generated responses
  - Implement context-aware message generation (threatening but helpful)
  - Add appearance triggers based on haunt level thresholds
  - Implement beforeunload event handler for tab close detection
  - Add dismissal functionality with re-summoning logic
  - Style with Windows 95 assistant aesthetic and horror theming
  - _Requirements: 8.1, 8.2, 8.5_

- [x] 16.1 Write property test for Clippy appearance on threshold


  - **Property 24: Clippy appearance on haunt threshold**
  - **Validates: Requirements 8.1**

- [x] 16.2 Write property test for Clippy dismissal and re-summoning


  - **Property 25: Clippy dismissal and re-summoning**
  - **Validates: Requirements 8.5**

- [x] 17. Implement jump scare system




  - Create jump scare effect component (red screen overlay, audio)
  - Implement rage click detection (5+ clicks within 1 second)
  - Implement mouse shake detection (rapid large movements)
  - Add jump scare rate limiting (prevent repeats within 30 seconds)
  - Implement haunt level increase after jump scare
  - Add jump scare trigger from countdown clock reaching 00:00
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 17.1 Write property test for jump scare rate limiting


  - **Property 8: Jump scare rate limiting**
  - **Validates: Requirements 10.5**

- [x] 17.2 Write property test for jump scare haunt level increase


  - **Property 9: Jump scare haunt level increase**
  - **Validates: Requirements 10.4**

- [x] 17.3 Write property test for rage click detection


  - **Property 26: Rage click detection**
  - **Validates: Requirements 10.1**

- [x] 17.4 Write property test for mouse shake detection



  - **Property 27: Mouse shake detection**
  - **Validates: Requirements 10.2**

- [x] 18. Implement advanced glitch effects





  - Create glitch effect application system for windows
  - Implement window-shift glitch (random position offsets)
  - Implement text-corruption glitch (Zalgo text on elements)
  - Implement color-shift glitch (change to blood red or matrix green)
  - Implement screen-shake glitch (viewport shake animation)
  - Implement transparency glitch (semi-transparent windows)
  - Add multi-window glitch coordination
  - _Requirements: 11.1, 11.2, 11.3, 11.4_

- [x] 18.1 Write property test for multi-window glitch coordination


  - **Property 29: Multi-window glitch coordination**
  - **Validates: Requirements 11.4**

- [x] 19. Implement typography and theming system





  - Set up styled-components theme provider with horror palette
  - Create global styles with MS Sans Serif font
  - Implement consistent typography across all components
  - Add error message styling with Blood Red color
  - Ensure WCAG AA contrast compliance for accessibility
  - Add prefers-reduced-motion support for accessibility
  - _Requirements: 1.4, 14.2, 14.4, 14.5_

- [x] 19.1 Write property test for consistent typography


  - **Property 18: Consistent typography**
  - **Validates: Requirements 1.4, 14.4**

- [x] 19.2 Write property test for error message styling


  - **Property 30: Error message styling**
  - **Validates: Requirements 14.2**

- [x] 19.3 Write property test for accessibility contrast


  - **Property 31: Accessibility contrast compliance**
  - **Validates: Requirements 14.5**

- [x] 20. Add content and polish





  - Write Readme.txt content (instruction manual from missing owner)
  - Write portfolio content (Obituary, Cold Cases with project details)
  - Create sample Minesweeper difficulty configurations
  - Add Dark Web window content (404 pages, developer lore)
  - Write Clippy's Ghost fallback messages
  - Add terminal command descriptions and easter eggs
  - _Requirements: 3.5, 6.2, 6.3, 6.4_

- [x] 21. Integration and error handling





  - Implement comprehensive error boundaries for React components
  - Add error handling for audio permission denied
  - Add error handling for Kiro API failures with fallbacks
  - Implement performance monitoring and glitch frequency adjustment
  - Add window limit enforcement (max 10 windows)
  - Test cross-browser compatibility (Chrome, Firefox, Safari)
  - _Requirements: All (error handling for entire application)_

- [x] 22. Final checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.
