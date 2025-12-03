import styled, { keyframes, css } from 'styled-components';
import { necroTheme } from '../theme';

// Window shift glitch - random position offsets
const windowShift = keyframes`
  0% { transform: translate(0, 0); }
  10% { transform: translate(-5px, 2px); }
  20% { transform: translate(3px, -4px); }
  30% { transform: translate(-2px, 3px); }
  40% { transform: translate(4px, -1px); }
  50% { transform: translate(-3px, -2px); }
  60% { transform: translate(2px, 4px); }
  70% { transform: translate(-4px, -3px); }
  80% { transform: translate(5px, 1px); }
  90% { transform: translate(-1px, -5px); }
  100% { transform: translate(0, 0); }
`;

// Color shift glitch - change to blood red or matrix green
const colorShiftRed = keyframes`
  0% { filter: hue-rotate(0deg) saturate(1); }
  25% { filter: hue-rotate(0deg) saturate(2) brightness(1.2); }
  50% { filter: hue-rotate(0deg) saturate(3) brightness(1.5); }
  75% { filter: hue-rotate(0deg) saturate(2) brightness(1.2); }
  100% { filter: hue-rotate(0deg) saturate(1); }
`;

const colorShiftGreen = keyframes`
  0% { filter: hue-rotate(0deg) saturate(1); }
  25% { filter: hue-rotate(90deg) saturate(2) brightness(1.2); }
  50% { filter: hue-rotate(90deg) saturate(3) brightness(1.5); }
  75% { filter: hue-rotate(90deg) saturate(2) brightness(1.2); }
  100% { filter: hue-rotate(0deg) saturate(1); }
`;

// Screen shake glitch - shake entire viewport
const screenShake = keyframes`
  0% { transform: translate(0, 0) rotate(0deg); }
  10% { transform: translate(-10px, 5px) rotate(-1deg); }
  20% { transform: translate(8px, -8px) rotate(1deg); }
  30% { transform: translate(-5px, 10px) rotate(-0.5deg); }
  40% { transform: translate(12px, -3px) rotate(0.5deg); }
  50% { transform: translate(-8px, -10px) rotate(-1deg); }
  60% { transform: translate(10px, 8px) rotate(1deg); }
  70% { transform: translate(-12px, -5px) rotate(-0.5deg); }
  80% { transform: translate(5px, 12px) rotate(0.5deg); }
  90% { transform: translate(-3px, -8px) rotate(-0.5deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
`;

// Text corruption glitch - distort text
const textCorruption = keyframes`
  0% { 
    text-shadow: 0 0 0 transparent;
    transform: skew(0deg);
  }
  20% { 
    text-shadow: 
      -2px 0 ${necroTheme.colors.bloodRed},
      2px 0 ${necroTheme.colors.matrixGreen};
    transform: skew(-2deg);
  }
  40% { 
    text-shadow: 
      2px 0 ${necroTheme.colors.bloodRed},
      -2px 0 ${necroTheme.colors.matrixGreen};
    transform: skew(2deg);
  }
  60% { 
    text-shadow: 
      -1px 0 ${necroTheme.colors.bloodRed},
      1px 0 ${necroTheme.colors.matrixGreen};
    transform: skew(-1deg);
  }
  80% { 
    text-shadow: 
      1px 0 ${necroTheme.colors.bloodRed},
      -1px 0 ${necroTheme.colors.matrixGreen};
    transform: skew(1deg);
  }
  100% { 
    text-shadow: 0 0 0 transparent;
    transform: skew(0deg);
  }
`;

// Glitch effect mixins for styled-components
export const glitchMixins = {
  windowShift: css`
    animation: ${windowShift} 0.3s ease-in-out;
  `,
  
  colorShiftRed: css`
    animation: ${colorShiftRed} 0.5s ease-in-out;
  `,
  
  colorShiftGreen: css`
    animation: ${colorShiftGreen} 0.5s ease-in-out;
  `,
  
  screenShake: css`
    animation: ${screenShake} 0.5s ease-in-out;
  `,
  
  textCorruption: css`
    animation: ${textCorruption} 0.4s ease-in-out;
  `,
  
  transparency: css`
    opacity: 0.7;
    transition: opacity 0.3s ease-in-out;
  `,
};

// Styled component for elements that can glitch
interface GlitchableProps {
  $glitchType?: 'window-shift' | 'color-shift-red' | 'color-shift-green' | 'text-corruption' | 'transparency' | 'none';
}

export const GlitchableElement = styled.div<GlitchableProps>`
  ${props => {
    switch (props.$glitchType) {
      case 'window-shift':
        return glitchMixins.windowShift;
      case 'color-shift-red':
        return glitchMixins.colorShiftRed;
      case 'color-shift-green':
        return glitchMixins.colorShiftGreen;
      case 'text-corruption':
        return glitchMixins.textCorruption;
      case 'transparency':
        return glitchMixins.transparency;
      default:
        return '';
    }
  }}
`;

// Screen shake wrapper - applies to entire viewport
export const ScreenShakeWrapper = styled.div<{ $isShaking: boolean }>`
  ${props => props.$isShaking && glitchMixins.screenShake}
`;
