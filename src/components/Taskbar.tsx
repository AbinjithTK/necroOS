import { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { AppBar, Toolbar, Button } from 'react95';
import { necroTheme } from '../theme';
import { useNecroStore } from '../store';

const glitchAnimation = keyframes`
  0%, 100% {
    transform: translate(0, 0) scale(1);
    filter: hue-rotate(0deg);
  }
  10% {
    transform: translate(-5px, 2px) scale(1.05);
    filter: hue-rotate(90deg);
  }
  20% {
    transform: translate(3px, -3px) scale(0.95);
    filter: hue-rotate(180deg);
  }
  30% {
    transform: translate(-2px, 4px) scale(1.1);
    filter: hue-rotate(270deg);
  }
  40% {
    transform: translate(4px, -2px) scale(0.9);
    filter: hue-rotate(360deg);
  }
  50% {
    transform: translate(-3px, 3px) scale(1.05);
    filter: hue-rotate(180deg) brightness(1.5);
  }
  60% {
    transform: translate(2px, -4px) scale(0.95);
    filter: hue-rotate(90deg);
  }
  70% {
    transform: translate(-4px, 2px) scale(1.1);
    filter: hue-rotate(270deg);
  }
  80% {
    transform: translate(3px, -3px) scale(0.9);
    filter: hue-rotate(0deg);
  }
  90% {
    transform: translate(-2px, 4px) scale(1.05);
    filter: hue-rotate(180deg);
  }
`;

const StyledAppBar = styled(AppBar)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: ${necroTheme.colors.voidBlack} !important;
  border-top: 2px solid ${necroTheme.colors.matrixGreen} !important;
`;

const StyledToolbar = styled(Toolbar)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
  background-color: ${necroTheme.colors.voidBlack} !important;
`;

const SummonButton = styled(Button)<{ $isGlitching: boolean }>`
  font-family: ${necroTheme.fonts.primary};
  font-weight: bold;
  color: ${necroTheme.colors.matrixGreen} !important;
  background-color: ${necroTheme.colors.voidBlack} !important;
  border: 2px solid ${necroTheme.colors.matrixGreen} !important;
  padding: 4px 16px;
  cursor: pointer;
  text-shadow: 0 0 5px ${necroTheme.colors.matrixGreen};
  
  ${({ $isGlitching }) =>
    $isGlitching &&
    css`
      animation: ${glitchAnimation} 0.5s ease-in-out;
    `}

  &:hover {
    background-color: rgba(0, 255, 65, 0.1) !important;
    box-shadow: 0 0 10px ${necroTheme.colors.matrixGreen};
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ClockDisplay = styled.div`
  font-family: ${necroTheme.fonts.primary};
  color: ${necroTheme.colors.bloodRed};
  font-size: 14px;
  font-weight: bold;
  padding: 4px 12px;
  background-color: ${necroTheme.colors.voidBlack};
  border: 2px solid ${necroTheme.colors.bloodRed};
  text-shadow: 0 0 5px ${necroTheme.colors.bloodRed};
  min-width: 80px;
  text-align: center;
  letter-spacing: 1px;
`;

interface TaskbarProps {
  onSummonClick?: () => void;
}

/**
 * Taskbar component with Windows 95 styling
 * Features:
 * - SUMMON button with explosive glitch animation
 * - Countdown clock to midnight (00:00)
 * - Jump scare trigger when countdown reaches 00:00
 * 
 * Validates Requirements 2.1, 2.2, 2.3, 2.4
 */
export function Taskbar({ onSummonClick }: TaskbarProps) {
  const [isGlitching, setIsGlitching] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');
  const triggerJumpScare = useNecroStore((state) => state.triggerJumpScare);
  const incrementHauntLevel = useNecroStore((state) => state.incrementHauntLevel);

  // Calculate time remaining until midnight
  useEffect(() => {
    let hasTriggered = false;
    
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      
      const diff = midnight.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeRemaining('00:00:00');
        // Trigger jump scare when countdown reaches 00:00 (only once)
        if (!hasTriggered) {
          hasTriggered = true;
          triggerJumpScare();
        }
        return;
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeRemaining(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [triggerJumpScare]);

  const handleSummonClick = () => {
    // Trigger glitch animation
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 500);
    
    // Increment haunt level
    incrementHauntLevel(2);
    
    // Call parent handler if provided
    if (onSummonClick) {
      onSummonClick();
    }
  };

  return (
    <StyledAppBar>
      <StyledToolbar>
        <SummonButton
          $isGlitching={isGlitching}
          onClick={handleSummonClick}
        >
          SUMMON
        </SummonButton>
        <ClockDisplay>{timeRemaining}</ClockDisplay>
      </StyledToolbar>
    </StyledAppBar>
  );
}
