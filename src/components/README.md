# Components

This directory contains all React components for NecroOS:

- Desktop Environment
- Window Manager
- Taskbar
- Desktop Icons
- Application Windows (Notepad, Minesweeper, Terminal, Portfolio, etc.)
- CRT Filter ✓
- Clippy's Ghost
- Boot Sequence
- Glitch Effects ✓

## Implemented Components

### BootScreen ✓
BIOS-style boot screen with flickering text, progressive message display, and loading progress indicator. Implements the boot sequence state machine (boot → login → desktop).

### LoginPrompt ✓
Login interface that accepts any password for username "Guest" (case-insensitive). Features horror-themed styling with matrix green and void black colors.

### DesktopEnvironment ✓
Main container for the NecroOS desktop interface. Currently a placeholder that will be expanded with taskbar, desktop icons, and window manager in future tasks.

### CRTFilter ✓
Applies retro CRT monitor effects including scanlines, chromatic aberration, screen curvature, vignette, and flicker animation.

### GlitchEffects ✓
Provides glitch animation mixins and components for window-shift, color-shift, screen-shake, text-corruption, and transparency effects.
