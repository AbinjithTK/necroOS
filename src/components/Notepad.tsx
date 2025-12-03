import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { necroTheme } from '../theme';
import { useNecroStore } from '../store';

const NotepadContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${necroTheme.colors.voidBlack};
`;

const TextArea = styled.textarea`
  flex: 1;
  width: 100%;
  background-color: ${necroTheme.colors.voidBlack};
  color: ${necroTheme.colors.matrixGreen};
  font-family: ${necroTheme.fonts.primary};
  font-size: 14px;
  border: none;
  outline: none;
  padding: 8px;
  resize: none;
  line-height: 1.5;
  
  &::selection {
    background-color: ${necroTheme.colors.matrixGreen};
    color: ${necroTheme.colors.voidBlack};
  }

  &:focus {
    box-shadow: inset 0 0 10px rgba(0, 255, 65, 0.3);
  }
`;

const StatusBar = styled.div`
  padding: 4px 8px;
  background-color: ${necroTheme.colors.voidBlack};
  border-top: 1px solid ${necroTheme.colors.matrixGreen};
  color: ${necroTheme.colors.matrixGreen};
  font-family: ${necroTheme.fonts.primary};
  font-size: 11px;
  display: flex;
  justify-content: space-between;
`;

interface NotepadProps {
  windowId: string;
  initialContent?: string;
}

/**
 * Notepad component - The Ouija Board
 * Features:
 * - Text editor with MS Sans Serif font
 * - Text input handling (typing, deleting, selecting)
 * - AI auto-completion integration (Kiro API)
 * - Ominous text appending based on AI responses
 * - Horror theming
 * 
 * Validates Requirements 4.1, 4.2, 4.4
 */
export function Notepad({ windowId, initialContent = '' }: NotepadProps) {
  const [content, setContent] = useState(initialContent);
  const [isProcessing, setIsProcessing] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastContentRef = useRef(initialContent);
  const incrementHauntLevel = useNecroStore((state) => state.incrementHauntLevel);

  // Handle text changes
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Check if user is typing (content increased)
    const isTyping = newContent.length > lastContentRef.current.length;
    lastContentRef.current = newContent;

    // Only trigger AI completion when typing, not deleting
    if (isTyping && newContent.trim().length > 0) {
      // Debounce AI calls - wait 1 second after user stops typing
      typingTimeoutRef.current = setTimeout(() => {
        triggerAICompletion(newContent);
      }, 1000);
    }
  };

  // Trigger AI auto-completion
  const triggerAICompletion = async (currentText: string) => {
    // Only trigger occasionally (30% chance) to avoid being too aggressive
    if (Math.random() > 0.3) {
      return;
    }

    setIsProcessing(true);

    try {
      // Call Kiro API for ominous completion
      const completion = await getOminousCompletion(currentText);
      
      if (completion && textAreaRef.current) {
        // Append the ominous text
        const newContent = currentText + completion;
        setContent(newContent);
        lastContentRef.current = newContent;

        // Move cursor to end
        setTimeout(() => {
          if (textAreaRef.current) {
            textAreaRef.current.selectionStart = newContent.length;
            textAreaRef.current.selectionEnd = newContent.length;
            textAreaRef.current.focus();
          }
        }, 0);

        // Increment haunt level
        incrementHauntLevel(2);
      }
    } catch (error) {
      console.error('AI completion error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Get ominous completion from AI
  const getOminousCompletion = async (text: string): Promise<string> => {
    // Fallback ominous completions if API fails
    const fallbackCompletions = [
      '...but they never came back.',
      '...or so they thought.',
      '...is coming to an end.',
      '...was the last thing they ever wrote.',
      '...echoes in the void.',
      '...will be forgotten.',
      '...watches from the shadows.',
      '...cannot be undone.',
      '...was a mistake.',
      '...leads only to darkness.',
    ];

    try {
      // TODO: Integrate with actual Kiro API
      // For now, use fallback completions
      const randomCompletion = fallbackCompletions[Math.floor(Math.random() * fallbackCompletions.length)];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return randomCompletion;
    } catch (error) {
      // Return random fallback on error
      return fallbackCompletions[Math.floor(Math.random() * fallbackCompletions.length)];
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const charCount = content.length;
  const lineCount = content.split('\n').length;

  return (
    <NotepadContainer>
      <TextArea
        ref={textAreaRef}
        value={content}
        onChange={handleChange}
        placeholder="Type your thoughts... if you dare..."
        spellCheck={false}
        data-testid="notepad-textarea"
      />
      <StatusBar>
        <span>Lines: {lineCount} | Characters: {charCount}</span>
        {isProcessing && <span>Processing...</span>}
      </StatusBar>
    </NotepadContainer>
  );
}
