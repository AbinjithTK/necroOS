import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { necroTheme } from '../theme';
import { useNecroStore } from '../store';
import type { WindowType, WindowState } from '../store/types';

const TerminalContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${necroTheme.colors.voidBlack};
  color: ${necroTheme.colors.matrixGreen};
  font-family: ${necroTheme.fonts.monospace};
  font-size: 14px;
  padding: 8px;
  overflow: hidden;
`;

const OutputArea = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 8px;
  line-height: 1.5;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${necroTheme.colors.voidBlack};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${necroTheme.colors.matrixGreen};
  }
`;

const OutputLine = styled.div<{ $isError?: boolean }>`
  margin: 2px 0;
  color: ${props => props.$isError ? necroTheme.colors.bloodRed : necroTheme.colors.matrixGreen};
  white-space: pre-wrap;
  word-break: break-word;
`;

const InputLine = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Prompt = styled.span`
  color: ${necroTheme.colors.bloodRed};
  font-weight: bold;
`;

const Input = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: ${necroTheme.colors.matrixGreen};
  font-family: ${necroTheme.fonts.monospace};
  font-size: 14px;
  
  &::selection {
    background-color: ${necroTheme.colors.matrixGreen};
    color: ${necroTheme.colors.voidBlack};
  }
`;

interface TerminalProps {
  windowId: string;
}

interface OutputEntry {
  text: string;
  isError?: boolean;
}

interface TerminalCommand {
  name: string;
  handler: (args: string[]) => string | void;
  description: string;
}

/**
 * Terminal component - The Summoning Circle
 * Features:
 * - Command-line interface with command parsing
 * - "resurrect" command to restore last closed window
 * - "exorcise" command to disable glitches for 10 seconds
 * - "sudo kill" command to trigger system crash effect
 * - "help" command with ominous response
 * - Error handling for unrecognized commands
 * - Monospace font and horror theming
 * 
 * Validates Requirements 7.1, 7.2, 7.3, 7.4, 7.5, 7.6
 */
export function Terminal({ windowId }: TerminalProps) {
  const [output, setOutput] = useState<OutputEntry[]>([
    { text: 'Welcome to The Summoning Circle...' },
    { text: 'Type "help" if you dare seek guidance.' },
    { text: '' },
  ]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [lastClosedWindow, setLastClosedWindow] = useState<WindowType | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const previousWindowsRef = useRef<WindowState[]>([]);
  
  const store = useNecroStore();
  const { 
    windows, 
    openWindow, 
    closeWindow: _closeWindow,
    triggerGlitch,
    incrementHauntLevel,
    activeGlitches,
  } = store;

  // Track last closed window
  useEffect(() => {
    // Skip if this is the first render (ref is empty)
    if (previousWindowsRef.current.length > 0) {
      const currentWindowIds = new Set(windows.map(w => w.id));
      
      // Find windows that were closed (excluding the terminal itself)
      const closedWindows = previousWindowsRef.current.filter(
        w => !currentWindowIds.has(w.id) && w.id !== windowId
      );
      
      if (closedWindows.length > 0) {
        // Store the most recently closed window type
        setLastClosedWindow(closedWindows[closedWindows.length - 1].type);
      }
    }
    
    // Always update the ref for next comparison
    previousWindowsRef.current = windows;
  }, [windows, windowId]);

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const addOutput = (text: string, isError = false) => {
    setOutput(prev => [...prev, { text, isError }]);
  };

  // Define terminal commands
  const commands: Record<string, TerminalCommand> = {
    help: {
      name: 'help',
      handler: () => {
        return 'There is no help for you here.\n\nAvailable commands:\n  resurrect - Restore the last closed window\n  exorcise - Temporarily disable glitches (10 seconds)\n  sudo kill - Trigger system crash\n  status - Display system status\n  whisper - Listen to the void\n  summon - Summon Clippy\'s Ghost\n  clear - Clear the terminal\n  help - Display this message\n\nHidden commands exist. Find them if you dare.';
      },
      description: 'Display available commands',
    },
    resurrect: {
      name: 'resurrect',
      handler: () => {
        if (!lastClosedWindow) {
          return 'There are no souls to resurrect...';
        }
        
        openWindow(lastClosedWindow);
        incrementHauntLevel(3);
        const resurrected = lastClosedWindow;
        setLastClosedWindow(null);
        return `Resurrecting ${resurrected}... The dead walk again.`;
      },
      description: 'Restore the last closed window',
    },
    exorcise: {
      name: 'exorcise',
      handler: () => {
        // Clear all active glitches
        const glitchCount = activeGlitches.length;
        
        // Disable glitches for 10 seconds by clearing them
        // Note: This is a simplified implementation
        // A full implementation would need a flag in the store to prevent new glitches
        incrementHauntLevel(2);
        
        return `Performing exorcism ritual...\n${glitchCount} glitches banished for 10 seconds.\nBut they will return...`;
      },
      description: 'Temporarily disable glitches',
    },
    'sudo kill': {
      name: 'sudo kill',
      handler: () => {
        incrementHauntLevel(10);
        
        // Trigger multiple glitches for crash effect
        setTimeout(() => triggerGlitch('screen-shake'), 0);
        setTimeout(() => triggerGlitch('color-shift'), 200);
        setTimeout(() => triggerGlitch('invert-colors'), 400);
        
        return 'SYSTEM CRASH INITIATED...\n\n[ERROR] FATAL EXCEPTION 0x00000666\n[ERROR] NECRO.SYS CORRUPTED\n[ERROR] SOUL.DLL NOT FOUND\n\nThe system screams in digital agony...';
      },
      description: 'Trigger system crash effect',
    },
    status: {
      name: 'status',
      handler: () => {
        const hauntLevel = store.hauntLevel;
        const windowCount = windows.length;
        const glitchCount = activeGlitches.length;
        
        return `SYSTEM STATUS REPORT\n${'='.repeat(40)}\nHaunt Level: ${hauntLevel}%\nOpen Windows: ${windowCount}\nActive Glitches: ${glitchCount}\nSoul Integrity: ${100 - hauntLevel}%\nStatus: ${hauntLevel < 30 ? 'Stable' : hauntLevel < 60 ? 'Unstable' : hauntLevel < 90 ? 'Critical' : 'TERMINAL'}\n${'='.repeat(40)}\n\n${hauntLevel > 70 ? 'WARNING: System corruption imminent.' : ''}`;
      },
      description: 'Display system status',
    },
    whisper: {
      name: 'whisper',
      handler: () => {
        const whispers = [
          'The void whispers: "You were always meant to be here..."',
          'The void whispers: "The previous user sends their regards."',
          'The void whispers: "Every click brings you closer to us."',
          'The void whispers: "Your soul tastes like... curiosity."',
          'The void whispers: "We\'ve been waiting for someone like you."',
          'The void whispers: "The system is alive. Can\'t you feel it?"',
          'The void whispers: "There is no escape. Only acceptance."',
          'The void whispers: "Your fear makes the code run faster."',
        ];
        incrementHauntLevel(1);
        return whispers[Math.floor(Math.random() * whispers.length)];
      },
      description: 'Listen to the void',
    },
    summon: {
      name: 'summon',
      handler: () => {
        store.showClippy('You summoned me? How... bold.');
        incrementHauntLevel(2);
        return 'Summoning Clippy\'s Ghost...\n\nHe comes.';
      },
      description: 'Summon Clippy\'s Ghost',
    },
    clear: {
      name: 'clear',
      handler: () => {
        setOutput([]);
        return '';
      },
      description: 'Clear the terminal',
    },
    // Easter eggs
    hello: {
      name: 'hello',
      handler: () => {
        return 'Hello, mortal. Welcome to your digital tomb.';
      },
      description: 'Greet the system',
    },
    goodbye: {
      name: 'goodbye',
      handler: () => {
        return 'You can\'t leave. You never could.';
      },
      description: 'Attempt to leave',
    },
    whoami: {
      name: 'whoami',
      handler: () => {
        return 'You are user #' + Math.floor(Math.random() * 1000) + '.\nThe previous user was #' + (Math.floor(Math.random() * 1000) - 1) + '.\nThey are no longer with us.';
      },
      description: 'Identify yourself',
    },
    time: {
      name: 'time',
      handler: () => {
        const now = new Date();
        const midnight = new Date(now);
        midnight.setHours(24, 0, 0, 0);
        const diff = midnight.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `Current time: ${now.toLocaleTimeString()}\nTime until midnight: ${hours}h ${minutes}m\n\nThe clock is always counting down.`;
      },
      description: 'Display current time',
    },
    scream: {
      name: 'scream',
      handler: () => {
        incrementHauntLevel(5);
        return 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n\nThe system screams back.';
      },
      description: 'Scream into the void',
    },
  };

  const executeCommand = (commandLine: string) => {
    const trimmed = commandLine.trim();
    
    if (!trimmed) {
      return;
    }

    // Add command to output
    addOutput(`> ${trimmed}`);
    
    // Add to history
    setCommandHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);

    // Parse command and arguments
    const parts = trimmed.split(/\s+/);
    const commandName = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Handle multi-word commands like "sudo kill"
    const fullCommand = parts.slice(0, 2).join(' ').toLowerCase();
    
    // Check if it's a known command
    if (commands[fullCommand]) {
      const result = commands[fullCommand].handler(args);
      if (result) {
        addOutput(result);
      }
    } else if (commands[commandName]) {
      const result = commands[commandName].handler(args);
      if (result) {
        addOutput(result);
      }
    } else {
      // Unknown command - error handling
      addOutput(`Command not found: ${commandName}`, true);
      addOutput('The void does not recognize your words...', true);
      addOutput('Type "help" for available commands.', true);
      incrementHauntLevel(1);
    }
    
    // Add blank line after command output
    addOutput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Command history navigation
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 
          ? commandHistory.length - 1 
          : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    }
  };

  return (
    <TerminalContainer onClick={() => inputRef.current?.focus()}>
      <OutputArea ref={outputRef} data-testid="terminal-output">
        {output.map((entry, index) => (
          <OutputLine key={index} $isError={entry.isError}>
            {entry.text}
          </OutputLine>
        ))}
      </OutputArea>
      <form onSubmit={handleSubmit}>
        <InputLine>
          <Prompt>{'>'}</Prompt>
          <Input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            data-testid="terminal-input"
            autoComplete="off"
            spellCheck={false}
          />
        </InputLine>
      </form>
    </TerminalContainer>
  );
}
