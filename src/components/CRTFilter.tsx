import styled, { keyframes } from 'styled-components';

interface CRTFilterProps {
  intensity?: number; // 0-1, increases with haunt level
}

// Flicker animation for CRT effect
const flicker = keyframes`
  0% { opacity: 0.98; }
  50% { opacity: 1; }
  100% { opacity: 0.98; }
`;

// Scanline animation
const scanline = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`;

const CRTOverlay = styled.div<{ $intensity: number }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  
  /* Scanlines effect */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.15),
      rgba(0, 0, 0, 0.15) 1px,
      transparent 1px,
      transparent 2px
    );
    animation: ${flicker} 0.15s infinite;
    opacity: ${props => 0.5 + (props.$intensity * 0.5)};
  }
  
  /* Moving scanline */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 10px;
    background: linear-gradient(
      to bottom,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    animation: ${scanline} 8s linear infinite;
    opacity: ${props => 0.3 + (props.$intensity * 0.3)};
  }
`;

const CRTScreen = styled.div<{ $intensity: number }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9998;
  
  /* Screen curvature */
  border-radius: ${props => 8 + (props.$intensity * 12)}px;
  overflow: hidden;
  
  /* Vignette effect */
  box-shadow: inset 0 0 ${props => 100 + (props.$intensity * 100)}px rgba(0, 0, 0, 0.5);
  
  /* Chromatic aberration simulation */
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: 
      radial-gradient(
        ellipse at center,
        transparent 0%,
        rgba(255, 0, 0, ${props => 0.02 + (props.$intensity * 0.03)}) 100%
      );
    mix-blend-mode: screen;
  }
`;

/**
 * CRT Filter component that applies retro monitor effects
 * Includes scanlines, chromatic aberration, screen curvature, and vignette
 */
export function CRTFilter({ intensity = 0.5 }: CRTFilterProps) {
  // Clamp intensity between 0 and 1
  const clampedIntensity = Math.max(0, Math.min(1, intensity));
  
  return (
    <>
      <CRTScreen $intensity={clampedIntensity} />
      <CRTOverlay $intensity={clampedIntensity} />
    </>
  );
}
