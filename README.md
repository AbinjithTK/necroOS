# NecroOS 💀

A browser-based horror-themed Windows 95 operating system simulation built with React, TypeScript, and Vite. Experience nostalgia with a dark twist as the system progressively becomes more unsettling with each interaction.

![NecroOS](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=flat&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?style=flat&logo=vite)

## 🎮 Features

### Boot Sequence
- **BIOS Screen** - Authentic retro boot sequence with flickering green text
- **Login Prompt** - Windows 95-style login (accepts any credentials)
- **Desktop Environment** - Full Windows 95 UI with horror theming

### Desktop Applications
- **📝 Notepad (The Ouija Board)** - Text editor with ominous auto-completions
- **💀 My Corpse** - System statistics showing Soul Integrity, Haunted RAM, and corruption levels
- **🕳️ The Void** - Drag-and-drop recycle bin (files are permanently deleted)
- **🕸️ Dark Web** - Browser with disturbing content
- **📄 Readme.txt** - Horror-themed manual from the "previous owner"
- **🎮 Soul Sweeper** - Minesweeper with a dark twist
- **⚰️ The Graveyard** - Portfolio manager
- **🔮 The Summoning Circle** - Terminal with special commands

### Horror Mechanics
- **Haunt Level System** - Increases with user interactions (0-100)
- **CRT Monitor Effects** - Authentic scanlines and screen curvature
- **Visual Glitches** - Window shifts, color distortions, text corruption
- **Jump Scares** - Ultra-fast red flash effects (150ms)
- **Countdown Clock** - Counts down to midnight with consequences
- **Corrupted Clippy** - Ghostly assistant with unsettling messages

### Window Management
- Draggable windows with title bar interaction
- Resizable windows (via react95)
- Focus management and z-index stacking
- Minimize/restore functionality
- Close windows with X button
- Maximum 10 windows open simultaneously

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/necroos.git
cd necroos

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to experience NecroOS.

## 🛠️ Tech Stack

- **React 19.2.0** - UI framework
- **TypeScript 5.9.3** - Type-safe development
- **Vite 7.2.4** - Build tool with HMR
- **react95 4.0.0** - Windows 95 component library
- **styled-components 6.1.19** - CSS-in-JS styling
- **zustand 5.0.9** - State management
- **vitest 4.0.14** - Testing framework
- **fast-check 4.3.0** - Property-based testing

## 📜 Available Scripts

```bash
# Development
npm run dev              # Start dev server

# Building
npm run build            # Type check + production build
npx tsc --noEmit         # Type check only

# Testing
npm test                 # Run tests once
npm run test:watch       # Run tests in watch mode
npm run test:ui          # Run tests with UI
npm run test:coverage    # Generate coverage report

# Code Quality
npm run lint             # Run ESLint

# Preview
npm run preview          # Preview production build
```

## 🎨 Project Structure

```
necroos/
├── src/
│   ├── components/      # React components
│   │   ├── BootScreen.tsx
│   │   ├── LoginPrompt.tsx
│   │   ├── DesktopEnvironment.tsx
│   │   ├── WindowManager.tsx
│   │   ├── Notepad.tsx
│   │   ├── MyCorpse.tsx
│   │   └── ...
│   ├── store/           # Zustand state management
│   ├── utils/           # Utility functions
│   ├── services/        # Service layer (HauntingOrchestrator)
│   ├── hooks/           # Custom React hooks
│   ├── theme/           # Theme configuration
│   ├── styles/          # Global styles
│   └── App.tsx          # Main application
├── public/              # Static assets
└── ...config files
```

## 🎯 Key Concepts

### Haunt Level
The haunt level increases with user interactions:
- Opening windows: +1
- Clicking SUMMON button: +2
- Dragging to The Void: +3
- Notepad auto-completions: +2

As the haunt level rises:
- CRT effects intensify
- Visual glitches become more frequent
- System becomes more unstable
- Soul Integrity decreases

### State Management
Uses Zustand for global state:
- Window management (open, close, focus, minimize)
- Haunt level tracking
- Audio management
- Glitch effects
- Jump scare triggers

## 🧪 Testing

Comprehensive test coverage with:
- Unit tests for all components
- Property-based tests with fast-check (100+ iterations)
- Integration tests for state management
- Accessibility tests

```bash
npm test                 # Run all tests
npm run test:coverage    # View coverage report
```

## 🎬 Demo

Perfect for:
- Portfolio projects showcasing React skills
- Horror game jams
- Retro computing nostalgia
- Creative coding experiments

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📝 License

MIT License - feel free to use this project for learning or your own creations.

## 🙏 Acknowledgments

- **react95** - For the authentic Windows 95 components
- **Windows 95** - For the nostalgic inspiration
- Horror games and creepypasta for the dark atmosphere

## ⚠️ Warning

This project contains:
- Flashing effects (jump scares)
- Horror themes and imagery
- Unsettling content

Not recommended for users sensitive to:
- Flashing lights
- Horror content
- Glitch effects

---

Built with 💀 and ⚰️ by [Your Name]

**P.S.** - Don't trust the Dark Web browser. It doesn't go where you think it does.
