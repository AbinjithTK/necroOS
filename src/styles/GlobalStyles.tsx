import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    font-family: ${({ theme }) => theme.fonts.primary};
    font-size: ${({ theme }) => theme.fontSizes.medium};
    line-height: ${({ theme }) => theme.lineHeights.normal};
    background-color: ${({ theme }) => theme.colors.voidBlack};
    color: ${({ theme }) => theme.colors.matrixGreen};
  }

  #root {
    width: 100%;
    height: 100%;
  }

  /* Typography styles */
  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.primary};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    line-height: ${({ theme }) => theme.lineHeights.tight};
    margin: 0;
    padding: 0;
  }

  h1 {
    font-size: ${({ theme }) => theme.fontSizes.xlarge};
  }

  h2 {
    font-size: ${({ theme }) => theme.fontSizes.large};
  }

  h3, h4, h5, h6 {
    font-size: ${({ theme }) => theme.fontSizes.medium};
  }

  p {
    font-family: ${({ theme }) => theme.fonts.primary};
    font-size: ${({ theme }) => theme.fontSizes.medium};
    line-height: ${({ theme }) => theme.lineHeights.normal};
    margin: 0;
    padding: 0;
  }

  code, pre {
    font-family: ${({ theme }) => theme.fonts.monospace};
    font-size: ${({ theme }) => theme.fontSizes.small};
  }

  /* Custom cursor styles */
  body {
    cursor: default;
  }

  button, a, [role="button"], .interactive {
    cursor: pointer;
    font-family: ${({ theme }) => theme.fonts.primary};
  }

  /* Hourglass cursor for loading states */
  .cursor-hourglass, .loading {
    cursor: wait;
  }

  /* Skeletal hand cursor for interactive elements (fallback to pointer) */
  .cursor-skeletal-hand, .clickable {
    cursor: pointer;
  }

  /* Disable text selection for UI elements */
  .no-select {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }

  /* Accessibility: Respect reduced motion preference */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }

  /* Ensure proper font rendering */
  body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  /* Scrollbar styling for horror theme */
  ::-webkit-scrollbar {
    width: 16px;
    height: 16px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.voidBlack};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.darkGray};
    border: 2px solid ${({ theme }) => theme.colors.voidBlack};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.matrixGreen};
  }

  /* Error message styling - Blood Red for errors */
  .error-message, .error, [role="alert"] {
    color: ${({ theme }) => theme.colors.bloodRed};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    font-family: ${({ theme }) => theme.fonts.primary};
  }

  /* Focus styles for accessibility */
  *:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.matrixGreen};
    outline-offset: 2px;
  }

  /* Ensure buttons and inputs use consistent typography */
  button, input, textarea, select {
    font-family: ${({ theme }) => theme.fonts.primary};
    font-size: ${({ theme }) => theme.fontSizes.medium};
  }
`;
