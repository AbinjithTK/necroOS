# Technology Stack

## Core Technologies

- **React 19.2.0** - UI framework
- **TypeScript 5.9.3** - Type-safe development with strict mode enabled
- **Vite 7.2.4** - Build tool and dev server with HMR

## UI & Styling

- **react95 4.0.0** - Windows 95 component library for authentic retro UI
- **styled-components 6.1.19** - CSS-in-JS for component styling

## State Management

- **zustand 5.0.9** - Lightweight state management library
  - Single global store pattern
  - Type definitions in `src/store/types.ts`
  - Store implementation in `src/store/index.ts`

## Testing

- **vitest 4.0.14** - Unit and property-based testing
- **@testing-library/react 16.3.0** - Component testing utilities
- **@testing-library/jest-dom 6.9.1** - Custom DOM matchers
- **fast-check 4.3.0** - Property-based testing (minimum 100 iterations per test)
- **jsdom 27.2.0** - DOM environment for tests

## Development Tools

- **ESLint** - Code linting with TypeScript and React rules
- **TypeScript ESLint** - TypeScript-specific linting

## Common Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:5173)

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
npm run preview          # Preview production build locally
```

## TypeScript Configuration

Strict mode enabled with:
- All strict type checking options
- No unused locals or parameters
- No fallthrough cases in switch statements
- Verbatim module syntax
- Target: ES2022
- Module resolution: bundler mode
