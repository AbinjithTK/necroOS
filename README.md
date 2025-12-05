# NecroOS 💀

> **Where nostalgia meets nightmare** - A horror-themed Windows 95 simulator built with React, TypeScript, and Kiro AI

A browser-based operating system simulation that starts as a nostalgic Windows 95 experience and progressively becomes more haunted with each interaction. Built for the Kiro Hackathon to demonstrate AI-assisted development at scale.

![NecroOS](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=flat&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?style=flat&logo=vite)
![Tests](https://img.shields.io/badge/Tests-160%2B%20Passing-success)
![Coverage](https://img.shields.io/badge/Coverage-95%25%2B-brightgreen)

## 🎯 Why NecroOS?

### For Developers
- **Portfolio Template**: Showcase your work in a memorable, interactive way
- **Learning Resource**: Study production-quality React patterns and state management
- **Code Reference**: See how to build complex UI systems with proper testing

### For the Hackathon
- **Demonstrates Kiro's Power**: Spec-driven development, property-based testing, and AI-assisted coding
- **Production Quality**: 95%+ test coverage, strict TypeScript, comprehensive error handling
- **Creative Innovation**: Unique blend of nostalgia, horror, and technical excellence

## 🚀 Quick Start

```bash
# Clone and install
git clone https://github.com/yourusername/necroos.git
cd necroos
npm install

# Run locally
npm run dev

# Build for production
npm run build
```

Visit `http://localhost:5173` to experience NecroOS.

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

## 🤖 Built with Kiro AI

NecroOS showcases the power of AI-assisted development:

- **Spec-Driven Development**: Formal requirements and design documents guided implementation
- **Property-Based Testing**: 35 correctness properties with 100+ iterations each
- **Steering Rules**: Consistent patterns across 15+ components without repetition
- **95%+ Test Coverage**: Comprehensive testing generated automatically
- **2 Weeks Development**: What would take 2-3 months solo

**See the full impact:** [KIRO_IMPACT_SHOWCASE.md](./KIRO_IMPACT_SHOWCASE.md)

### Key Metrics
- **160+ Tests** - All passing with property-based coverage
- **Zero TypeScript Errors** - Strict mode enabled
- **8,000+ Lines of Code** - Production-ready quality
- **45+ Bugs Caught** - Before release via property tests

## 💡 Use Cases

### For Developers
- **Portfolio Template**: Fork and customize for your own horror-themed portfolio
- **Learning Resource**: Study production React patterns, state management, and testing
- **Code Reference**: See how to build complex UI systems with proper architecture

### For Educators
- **Teaching Tool**: Demonstrate React 19, TypeScript, Zustand, and Vite
- **Testing Examples**: Show property-based testing with fast-check
- **AI Development**: Illustrate spec-driven development with AI assistance

### For Fun
- **Interactive Experience**: Nostalgic Windows 95 with progressive horror
- **Game Elements**: Haunt level system, jump scares, corrupted Clippy
- **Shareable**: Send to friends who love retro computing and horror

## 📚 Documentation

- [Kiro Impact Showcase](./KIRO_IMPACT_SHOWCASE.md) - How Kiro transformed development
- [Hackathon Blog Post](./KIRO_HACKATHON_BLOG.md) - Full development story
- [Demo Verification](./DEMO_VERIFICATION.md) - Feature checklist
- [Project Setup](./PROJECT_SETUP.md) - Technical details

## 🤝 Contributing

Contributions welcome! This project demonstrates:
- Spec-driven development
- Property-based testing
- AI-assisted coding
- Production-quality patterns

Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Fork for your own portfolio

## 📝 License

MIT License - Free to use for learning, portfolios, or your own creations.

## 🙏 Acknowledgments

- **Kiro AI** - For revolutionizing the development process
- **react95** - Authentic Windows 95 components
- **fast-check** - Property-based testing library
- **Windows 95** - Nostalgic inspiration

## ⚠️ Content Warning

Contains:
- Flashing effects (jump scares)
- Horror themes and imagery
- Glitch effects

Not recommended for users sensitive to flashing lights or horror content.

---

**Built with Kiro AI for the Kiro Hackathon**

*Demonstrating AI-assisted development at scale*

**P.S.** - Don't trust the Dark Web browser. It doesn't go where you think it does. 💀
