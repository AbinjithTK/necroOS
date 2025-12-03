import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { necroTheme } from '../theme';

interface BootScreenProps {
  onBootComplete: () => void;
}

// Flicker animation for BIOS text
const flicker = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
`;

// Cursor blink animation
const blink = keyframes`
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
`;

const BootContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${necroTheme.colors.voidBlack};
  color: ${necroTheme.colors.matrixGreen};
  font-family: ${necroTheme.fonts.monospace};
  font-size: 14px;
  padding: 20px;
  overflow: hidden;
  z-index: 10000;
`;

const BIOSText = styled.div`
  animation: ${flicker} 0.3s infinite;
  white-space: pre-wrap;
  line-height: 1.4;
`;

const LoadingText = styled.div`
  margin-top: 40px;
  font-size: 16px;
`;

const ProgressBar = styled.div`
  width: 400px;
  height: 20px;
  border: 2px solid ${necroTheme.colors.matrixGreen};
  margin-top: 20px;
  position: relative;
  background-color: ${necroTheme.colors.voidBlack};
`;

const ProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${props => props.$progress}%;
  background-color: ${necroTheme.colors.matrixGreen};
  transition: width 0.3s ease-out;
`;

const Cursor = styled.span`
  display: inline-block;
  width: 8px;
  height: 14px;
  background-color: ${necroTheme.colors.matrixGreen};
  animation: ${blink} 1s infinite;
  margin-left: 2px;
`;

const biosMessages = [
  'NecroOS BIOS v6.66',
  'Copyright (C) 19̴9̷5̸ ̶D̴a̷r̸k̷ ̴T̷e̸c̷h̸n̷o̸l̷o̸g̷i̸e̷s̸',
  '',
  'Detecting hardware...',
  'CPU: Cursed Pentium 666 MHz',
  'RAM: 128 MB (Haunted)',
  'HDD: 13 GB (Corrupted)',
  '',
  'WARNING: System integrity compromised',
  'WARNING: Supernatural activity detected',
  '',
  'Press any key to continue...',
];

export function BootScreen({ onBootComplete }: BootScreenProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [keyPressed, setKeyPressed] = useState(false);

  // Display BIOS messages line by line
  useEffect(() => {
    if (currentLineIndex < biosMessages.length) {
      const timer = setTimeout(() => {
        setDisplayedLines(prev => [...prev, biosMessages[currentLineIndex]]);
        setCurrentLineIndex(prev => prev + 1);
      }, 200 + Math.random() * 300); // Random delay for authenticity

      return () => clearTimeout(timer);
    }
  }, [currentLineIndex]);

  // Wait for key press after all messages displayed
  useEffect(() => {
    if (currentLineIndex >= biosMessages.length && !keyPressed) {
      const handleKeyPress = () => {
        setKeyPressed(true);
        setShowProgress(true);
      };

      window.addEventListener('keydown', handleKeyPress);
      window.addEventListener('click', handleKeyPress);

      return () => {
        window.removeEventListener('keydown', handleKeyPress);
        window.removeEventListener('click', handleKeyPress);
      };
    }
  }, [currentLineIndex, keyPressed]);

  // Progress bar animation
  useEffect(() => {
    if (showProgress && progress < 100) {
      const timer = setTimeout(() => {
        setProgress(prev => {
          const increment = Math.random() * 15 + 5;
          return Math.min(100, prev + increment);
        });
      }, 200 + Math.random() * 300);

      return () => clearTimeout(timer);
    } else if (progress >= 100) {
      const timer = setTimeout(() => {
        onBootComplete();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [showProgress, progress, onBootComplete]);

  return (
    <BootContainer>
      <BIOSText>
        {displayedLines.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
        {currentLineIndex < biosMessages.length && <Cursor />}
      </BIOSText>

      {showProgress && (
        <>
          <LoadingText>
            Loading NecroOS...
            <Cursor />
          </LoadingText>
          <ProgressBar>
            <ProgressFill $progress={progress} />
          </ProgressBar>
        </>
      )}
    </BootContainer>
  );
}
