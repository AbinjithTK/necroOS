# NecroOS - Project Setup Documentation

## Overview

NecroOS is a browser-based horror-themed Windows 95 operating system simulation built with React, TypeScript, and Vite.

## Technology Stack

### Core Framework
- **React 19.2.0** - UI library
- **TypeScript 5.9.3** - Type safety with strict mode enabled
- **Vite 7.2.4** - Build tool and dev server

### UI & Styling
- **react95 4.0.0** - Windows 95 component library
- **styled-components 6.1.19** - CSS-in-JS styling

### State Management
- **zustand 5.0.9** - Lightweight state management

### Testing
- **vitest 4.0.14** - Unit and property-based testing framework
- **@testing-library/react 16.3.0** - React component testing utilities
- **@testing-library/jest-dom 6.9.1** - Custom DOM matchers
- **fast-check 4.3.0** - Property-based testing library
- **jsdom 27.2.0** - DOM implementation for testing

## Project Structure

```
necroos/
├── .kiro/
│   └── specs/
│       └── necro-os/
│           ├── requirements.md
│           ├── design.md
│           └── tasks.md
├── src/
│   ├── assets/          # Images, fonts, audio files
│   ├── components/      # React components
│   ├── store/           # Zustand state management
│   │   ├── types.ts     # TypeScript type definitions
│   │   └── index.ts     # Store exports
│   ├── utils/           # Utility functions
│   ├── test/            # Test setup and utilities
│   │   ├── setup.ts     # Vitest setup file
│   │   └── setup.test.ts # Setup verification tests
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
├── public/              # Static assets
├── vitest.config.ts     # Vitest configuration
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration (root)
├── tsconfig.app.json    # TypeScript configuration (app)
└── package.json         # Dependencies and scripts
```

## TypeScript Configuration

TypeScript is configured with **strict mode** enabled:
- `strict: true` - All strict type checking options enabled
- `noUnusedLocals: true` - Report unused local variables
- `noUnusedParameters: true` - Report unused parameters
- `noFallthroughCasesInSwitch: true` - Report fallthrough cases in switch

## Available Scripts

```bash
# Development
npm run dev              # Start Vite dev server

# Building
npm run build            # Build for production

# Testing
npm test                 # Run all tests once
npm run test:watch       # Run tests in watch mode
npm run test:ui          # Run tests with UI
npm run test:coverage    # Run tests with coverage report

# Linting
npm run lint             # Run ESLint

# Preview
npm run preview          # Preview production build
```

## Testing Setup

### Vitest Configuration
- **Environment**: jsdom (for DOM testing)
- **Globals**: Enabled (describe, it, expect available globally)
- **Setup File**: `src/test/setup.ts`
- **Test Pattern**: `**/*.{test,spec}.{ts,tsx}`
- **Coverage**: v8 provider with text, json, and html reporters

### Test Types
1. **Unit Tests**: Test individual components and functions
2. **Property-Based Tests**: Test universal properties using fast-check (minimum 100 iterations)

### Running Tests
```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Development Workflow

1. **Start Development Server**
   ```bash
   npm run dev
   ```
   Opens at http://localhost:5173/

2. **Run Tests in Watch Mode**
   ```bash
   npm run test:watch
   ```

3. **Type Check**
   ```bash
   npx tsc --noEmit
   ```

4. **Lint Code**
   ```bash
   npm run lint
   ```

## Next Steps

The project infrastructure is now ready. The next tasks involve:
1. Implementing global state management with Zustand (Task 2)
2. Creating CRT filter and visual effects (Task 3)
3. Building the boot sequence and login flow (Task 4)
4. And continuing through the implementation plan...

## Verification

To verify the setup is working correctly:

```bash
# Run the setup test
npm test

# Check TypeScript compilation
npx tsc --noEmit

# Start dev server
npm run dev
```

All commands should complete successfully without errors.
