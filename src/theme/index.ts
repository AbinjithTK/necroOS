// NecroOS Theme Configuration
export const necroTheme = {
  colors: {
    matrixGreen: '#00FF41',
    voidBlack: '#080808',
    bloodRed: '#FF0000',
    // Additional shades for UI elements
    darkGray: '#1a1a1a',
    lightGray: '#c0c0c0',
    white: '#ffffff',
  },
  fonts: {
    primary: '"MS Sans Serif", "Microsoft Sans Serif", sans-serif',
    monospace: '"Courier New", Courier, monospace',
  },
  fontSizes: {
    small: '11px',
    medium: '13px',
    large: '16px',
    xlarge: '20px',
  },
  fontWeights: {
    normal: 400,
    bold: 700,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
  },
  cursors: {
    default: 'default',
    pointer: 'pointer',
    hourglass: 'wait',
    skeletalHand: 'pointer', // Will be replaced with custom cursor image
  },
  // Accessibility: Contrast ratios for WCAG AA compliance
  // These are calculated values based on the actual color values
  contrast: {
    // Matrix Green (#00FF41) on Void Black (#080808): 14.67:1 (AAA)
    primaryOnBackground: 14.67,
    // Blood Red (#FF0000) on Void Black (#080808): 5.01:1 (AA)
    errorOnBackground: 5.01,
    // Light Gray (#c0c0c0) on Void Black (#080808): 11.01:1 (AAA)
    secondaryOnBackground: 11.01,
  },
} as const;

export type NecroTheme = typeof necroTheme;

// Styled-components theme type declaration
declare module 'styled-components' {
  export interface DefaultTheme extends NecroTheme {}
}
