import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { necroTheme } from '../theme';
import { CRTFilter } from './CRTFilter';
import { Taskbar } from './Taskbar';
import { DesktopIcons } from './DesktopIcons';
import { WindowManagerContainer } from './WindowManagerContainer';
import { JumpScare } from './JumpScare';
import { useNecroStore } from '../store';
// import { useJumpScareDetection } from '../hooks/useJumpScareDetection';

const DesktopContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${necroTheme.colors.voidBlack};
  background-image: 
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0, 255, 65, 0.08) 2px,
      rgba(0, 255, 65, 0.08) 4px
    ),
    radial-gradient(
      ellipse at center,
      rgba(0, 255, 65, 0.15) 0%,
      transparent 70%
    );
  overflow: hidden;
  cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="white" stroke="black" d="M0,0 L0,12 L4,8 L6,13 L8,12 L6,7 L10,7 Z"/></svg>'), auto;
`;

const DesktopContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const DesktopMain = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  color: ${necroTheme.colors.matrixGreen};
  font-family: ${necroTheme.fonts.primary};
`;



interface DesktopEnvironmentProps {
  onHauntLevelChange?: (level: number) => void;
}

/**
 * Desktop Environment - Main container for the NecroOS interface
 * Integrates CRT filter overlay, desktop background with horror theming,
 * ambient audio initialization and looping, and connects to Zustand store
 * 
 * Validates Requirements 1.1, 15.1, 10.1, 10.2, 10.3, 10.4, 10.5
 */
export function DesktopEnvironment({ onHauntLevelChange }: DesktopEnvironmentProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [jumpScareActive, setJumpScareActive] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const hauntLevel = useNecroStore((state) => state.hauntLevel);
  const audioEnabled = useNecroStore((state) => state.audioEnabled);
  const ambientPlaying = useNecroStore((state) => state.ambientPlaying);
  const toggleAudio = useNecroStore((state) => state.toggleAudio);
  const setAmbientPlaying = useNecroStore((state) => state.setAmbientPlaying);
  const triggerJumpScare = useNecroStore((state) => state.triggerJumpScare);

  // Disable jump scares completely for now - too annoying
  useEffect(() => {
    // Never enable jump scares
    setIsInitialized(false);
  }, []);

  // Handle jump scare trigger (only after initialization)
  // const handleJumpScare = () => {
  //   if (!isInitialized) return;
  //   triggerJumpScare();
  //   setJumpScareActive(true);
  // };

  // Disable rage click and mouse shake detection completely
  // useJumpScareDetection({
  //   onRageClick: handleJumpScare,
  //   onMouseShake: handleJumpScare,
  // });

  // Initialize ambient audio on mount
  useEffect(() => {
    // Create audio element for ambient hum
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0.2; // Low volume for ambient sound
    audioRef.current = audio;

    // For now, we'll use a data URL for a simple ambient tone
    // In production, this would be replaced with an actual audio file
    // This creates a silent audio element that can be replaced later
    audio.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';

    // Attempt to enable audio on first user interaction
    const enableAudio = () => {
      if (!audioEnabled) {
        toggleAudio();
      }
      document.removeEventListener('click', enableAudio);
      document.removeEventListener('keydown', enableAudio);
    };

    document.addEventListener('click', enableAudio);
    document.addEventListener('keydown', enableAudio);

    return () => {
      document.removeEventListener('click', enableAudio);
      document.removeEventListener('keydown', enableAudio);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioEnabled, toggleAudio]);

  // Handle audio playback based on audioEnabled state
  useEffect(() => {
    if (audioRef.current) {
      if (audioEnabled && !ambientPlaying) {
        audioRef.current.play()
          .then(() => {
            setAmbientPlaying(true);
          })
          .catch((error) => {
            // Handle audio permission denied gracefully
            console.warn('Audio playback failed - user may need to interact with page:', error);
            // Don't show error to user, just silently fail
            // Audio will be enabled on next user interaction
          });
      } else if (!audioEnabled && ambientPlaying) {
        audioRef.current.pause();
        setAmbientPlaying(false);
      }
    }
  }, [audioEnabled, ambientPlaying, setAmbientPlaying]);

  // Notify parent of haunt level changes
  useEffect(() => {
    if (onHauntLevelChange) {
      onHauntLevelChange(hauntLevel);
    }
  }, [hauntLevel, onHauntLevelChange]);

  return (
    <DesktopContainer>
      <CRTFilter intensity={0.2 + (hauntLevel / 100) * 0.2} />
      <DesktopContent>
        <DesktopMain>
          <DesktopIcons />
          <WindowManagerContainer />
        </DesktopMain>
        <Taskbar />
      </DesktopContent>
      <JumpScare 
        active={jumpScareActive} 
        onComplete={() => setJumpScareActive(false)} 
      />
    </DesktopContainer>
  );
}
