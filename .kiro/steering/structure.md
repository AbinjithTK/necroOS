# Project Structure

## Directory Organization

```
necroos/
├── .kiro/
│   ├── specs/              # Feature specifications
│   └── steering/           # AI assistant guidance documents
├── src/
│   ├── assets/             # Static assets (images, fonts, audio)
│   ├── components/         # React components
│   ├── store/              # Zustand state management
│   │   ├── types.ts        # TypeScript type definitions
│   │   └── index.ts        # Store implementation
│   ├── utils/              # Utility functions and helpers
│   ├── test/               # Test configuration and utilities
│   │   ├── setup.ts        # Vitest setup file
│   │   └── setup.test.ts   # Setup verification
│   ├── App.tsx             # Main application component
│   ├── App.css             # Application styles
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── public/                 # Static public assets
└── [config files]          # Root-level configuration
```

## Key Conventions

### Component Organization

- Components go in `src/components/`
- Each component should be self-contained
- Use TypeScript for all components (`.tsx` extension)
- Export components as named exports

### State Management

- Single Zustand store defined in `src/store/index.ts`
- All state types defined in `src/store/types.ts`
- Store includes:
  - Haunt level management
  - Window management (open, close, focus, minimize, restore)
  - Audio management
  - Glitch effects
  - Jump scare triggers
  - Clippy assistant state

### Testing

- Test files use `.test.ts` or `.test.tsx` extension
- Place tests alongside the code they test
- Use property-based tests with fast-check (minimum 100 iterations)
- Test setup in `src/test/setup.ts`
- Coverage excludes: node_modules, test files, type definitions, config files

### File Naming

- Components: PascalCase (e.g., `WindowManager.tsx`)
- Utilities: camelCase (e.g., `audioHelpers.ts`)
- Types: camelCase with `.ts` extension (e.g., `types.ts`)
- Tests: match source file name with `.test` suffix

### Import Patterns

- Use ES modules (`import`/`export`)
- Relative imports for local files
- Absolute imports from node_modules
- Type imports use `import type` when possible

## Configuration Files

- `vite.config.ts` - Vite build configuration
- `vitest.config.ts` - Test runner configuration
- `tsconfig.json` - TypeScript project references
- `tsconfig.app.json` - App-specific TypeScript config
- `tsconfig.node.json` - Node-specific TypeScript config
- `eslint.config.js` - ESLint rules and plugins
- `package.json` - Dependencies and scripts
