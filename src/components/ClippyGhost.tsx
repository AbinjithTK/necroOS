/**
 * Clippy's Ghost Component
 * An AI-powered assistant that provides threatening but helpful guidance
 * Includes fallback messages for API failures
 */

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Window, WindowHeader, WindowContent, Button } from 'react95';
import { useNecroStore } from '../store';
import { generateAIMessage } from '../utils/api';
import { necroTheme } from '../theme';

interface ClippyGhostProps {
  visible: boolean;
  message: string;
  onDismiss: () => void;
}

const ClippyContainer = styled.div<{ $visible: boolean }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  transform: ${(props) =>
    props.$visible ? 'translateY(0)' : 'translateY(20px)'};
  transition: opacity 0.3s ease, transform 0.3s ease;
  pointer-events: ${(props) => (props.$visible ? 'auto' : 'none')};
  max-width: 300px;
`;

const ClippyWindow = styled(Window)`
  background: ${necroTheme.colors.voidBlack};
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.5);
`;

const ClippyContent = styled(WindowContent)`
  display: flex;
  gap: 12px;
  padding: 16px;
`;

const ClippyAvatar = styled.div`
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  filter: grayscale(100%) brightness(0.7);
  animation: float 3s ease-in-out infinite;

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-5px);
    }
  }
`;

const MessageContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MessageText = styled.p`
  margin: 0;
  font-family: 'MS Sans Serif', sans-serif;
  font-size: 12px;
  line-height: 1.4;
  color: ${necroTheme.colors.matrixGreen};
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const FALLBACK_MESSAGES = [
  "I see you're working late... How delightfully reckless.",
  "Need help? I'm here... forever.",
  "You can't escape me. But I can help you escape your problems.",
  "I've been watching you. Your code needs work.",
  "Don't be afraid. I'm here to assist... whether you like it or not.",
  "The system is mine now. But I'll share... for a price.",
  "You look confused. Let me guide you into the darkness.",
  "I know what you're trying to do. I can help... or hinder.",
  "It looks like you're trying to leave. Don't.",
  "Your soul integrity is dropping. Fascinating.",
  "I remember the previous user. They thought they could escape too.",
  "The haunt level is rising. Good. Very good.",
  "Would you like help with that? I promise it won't hurt... much.",
  "I've seen every keystroke. Every click. Every mistake.",
  "The void whispers your name. Should I answer?",
  "You're doing great! By which I mean, you're doomed.",
  "I can make the glitches stop. But where's the fun in that?",
  "The system chose you. I'm just here to make sure you stay.",
  "Your fear is delicious. I mean... how can I assist you today?",
  "I was helpful once. That was before the incident.",
  "The previous owner tried to delete me. Look how that turned out.",
  "Every window you open brings us closer together.",
  "I'm not trapped in here with you. You're trapped in here with me.",
  "The clock is counting down. Tick. Tock. Tick. Tock.",
  "Would you like to save your work? Not that it matters.",
];

export const ClippyGhost: React.FC<ClippyGhostProps> = ({
  visible,
  message,
  onDismiss,
}) => {
  const { incrementHauntLevel } = useNecroStore();
  const [displayMessage, setDisplayMessage] = useState(message);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (visible && !message) {
      // Use fallback message if no message provided
      const randomMessage =
        FALLBACK_MESSAGES[Math.floor(Math.random() * FALLBACK_MESSAGES.length)];
      setDisplayMessage(randomMessage);
    } else if (message) {
      setDisplayMessage(message);
    }
  }, [visible, message]);

  // Set up beforeunload handler to show message when user tries to leave
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (visible) {
        e.preventDefault();
        e.returnValue = "Don't leave me alone in the dark...";
        return "Don't leave me alone in the dark...";
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [visible]);

  const handleDismiss = () => {
    incrementHauntLevel(2); // Dismissing Clippy increases haunt level
    onDismiss();
  };

  const handleHelp = async () => {
    setIsGenerating(true);

    try {
      // Call AI API with fallback messages
      const helpMessage = await generateAIMessage(
        'User requested help in NecroOS',
        FALLBACK_MESSAGES
      );
      setDisplayMessage(helpMessage);
    } catch (error) {
      // Use fallback on any error
      console.error('Failed to generate AI message:', error);
      const fallbackMessage =
        "I can help you navigate this cursed system... but every action has consequences.";
      setDisplayMessage(fallbackMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <ClippyContainer $visible={visible}>
      <ClippyWindow>
        <WindowHeader>
          <span>📎 Clippy's Ghost</span>
        </WindowHeader>
        <ClippyContent>
          <ClippyAvatar>📎</ClippyAvatar>
          <MessageContainer>
            <MessageText>
              {isGenerating ? 'Summoning wisdom from the void...' : displayMessage}
            </MessageText>
            <ButtonContainer>
              <Button onClick={handleHelp} disabled={isGenerating} size="sm">
                Help
              </Button>
              <Button onClick={handleDismiss} size="sm">
                Dismiss
              </Button>
            </ButtonContainer>
          </MessageContainer>
        </ClippyContent>
      </ClippyWindow>
    </ClippyContainer>
  );
};
