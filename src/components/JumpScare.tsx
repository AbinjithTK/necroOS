import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { necroTheme } from '../theme';
import { useNecroStore } from '../store';

const flashAnimation = keyframes`
  0% { opacity: 0; }
  20% { opacity: 1; }
  40% { opacity: 0; }
  60% { opacity: 1; }
  80% { opacity: 0; }
  100% { opacity: 1; }
`;

const shakeAnimation = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  10% { transform: translate(-10px, -10px) rotate(-2deg); }
  20% { transform: translate(10px, 10px) rotate(2deg); }
  30% { transform: translate(-10px, 10px) rotate(-1deg); }
  40% { transform: translate(10px, -10px) rotate(1deg); }
  50% { transform: translate(-10px, -10px) rotate(-2deg); }
  60% { transform: translate(10px, 10px) rotate(2deg); }
  70% { transform: translate(-10px, 10px) rotate(-1deg); }
  80% { transform: translate(10px, -10px) rotate(1deg); }
  90% { transform: translate(-10px, -10px) rotate(-2deg); }
`;

const JumpScareOverlay = styled.div<{ $active: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${necroTheme.colors.bloodRed};
  z-index: 9999;
  pointer-events: ${({ $active }) => ($active ? 'all' : 'none')};
  opacity: ${({ $active }) => ($active ? 1 : 0)};
  animation: ${({ $active }) => ($active ? flashAnimation : 'none')} 0.1s ease-in-out 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease-out;
`;

const ShakeContainer = styled.div<{ $active: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  animation: ${({ $active }) => ($active ? shakeAnimation : 'none')} 0.5s ease-in-out;
  pointer-events: none;
`;

const ScareText = styled.div`
  font-family: ${necroTheme.fonts.primary};
  font-size: 72px;
  font-weight: bold;
  color: ${necroTheme.colors.voidBlack};
  text-shadow: 0 0 20px ${necroTheme.colors.voidBlack};
  animation: ${flashAnimation} 0.3s ease-in-out infinite;
`;

interface JumpScareProps {
  active: boolean;
  onComplete?: () => void;
}

/**
 * JumpScare component that displays a red screen overlay with audio
 * Features:
 * - Red screen flash effect
 * - Screen shake animation
 * - Screeching audio effect
 * - Auto-dismisses after duration
 * 
 * Validates Requirements 10.3
 */
export function JumpScare({ active, onComplete }: JumpScareProps) {
  const [isActive, setIsActive] = useState(false);
  const playSound = useNecroStore((state) => state.playSound);
  const audioEnabled = useNecroStore((state) => state.audioEnabled);

  useEffect(() => {
    if (active && !isActive) {
      setIsActive(true);

      // Play jump scare audio
      if (audioEnabled) {
        playSound('jump-scare', false, 0.6);
      }

      // Auto-dismiss after 0.15 seconds (millisecond flash)
      const timer = setTimeout(() => {
        setIsActive(false);
        if (onComplete) {
          onComplete();
        }
      }, 150);

      return () => clearTimeout(timer);
    }
    
    // Reset when active becomes false
    if (!active && isActive) {
      setIsActive(false);
    }
  }, [active, isActive, audioEnabled, playSound, onComplete]);

  if (!isActive) {
    return null;
  }

  return (
    <>
      <ShakeContainer $active={isActive} />
      <JumpScareOverlay $active={isActive}>
        <ScareText>FEAR</ScareText>
      </JumpScareOverlay>
    </>
  );
}
