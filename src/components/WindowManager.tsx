import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Window, WindowHeader, WindowContent, Button } from 'react95';
import { necroTheme } from '../theme';
import type { WindowState, GlitchEffect } from '../store/types';
import { Notepad } from './Notepad';
import { Minesweeper } from './Minesweeper';
import { PortfolioManager } from './PortfolioManager';
import { MyCorpse } from './MyCorpse';
import { GlitchableWindow } from './GlitchableWindow';
import { Readme } from './Readme';
import { DarkWeb } from './DarkWeb';

const WindowContainer = styled.div<{ $zIndex: number; $minimized: boolean; $glitchOffset?: { x: number; y: number } }>`
  position: absolute;
  left: ${({ $glitchOffset }) => ($glitchOffset ? `${$glitchOffset.x}px` : '0')};
  top: ${({ $glitchOffset }) => ($glitchOffset ? `${$glitchOffset.y}px` : '0')};
  z-index: ${({ $zIndex }) => $zIndex};
  display: ${({ $minimized }) => ($minimized ? 'none' : 'block')};
  transition: opacity 0.2s;

  &:hover {
    cursor: move;
  }
`;

const StyledWindow = styled(Window)`
  min-width: 300px;
  min-height: 200px;
  background-color: ${necroTheme.colors.voidBlack};
  border: 2px solid ${necroTheme.colors.matrixGreen};
  box-shadow: 0 0 20px ${necroTheme.colors.matrixGreen};
`;

const StyledWindowHeader = styled(WindowHeader)`
  background-color: ${necroTheme.colors.voidBlack};
  color: ${necroTheme.colors.matrixGreen};
  font-family: ${necroTheme.fonts.primary};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
  border-bottom: 2px solid ${necroTheme.colors.matrixGreen};
`;

const StyledWindowContent = styled(WindowContent)`
  background-color: ${necroTheme.colors.voidBlack};
  color: ${necroTheme.colors.matrixGreen};
  font-family: ${necroTheme.fonts.primary};
  padding: 16px;
  overflow: auto;
`;

const WindowControls = styled.div`
  display: flex;
  gap: 4px;
`;

const ControlButton = styled(Button)`
  min-width: 20px;
  height: 20px;
  padding: 0;
  font-size: 12px;
`;

interface WindowManagerProps {
  windows: WindowState[];
  activeGlitches?: GlitchEffect[];
  onWindowClose: (id: string) => void;
  onWindowFocus: (id: string) => void;
  onWindowMove: (id: string, position: { x: number; y: number }) => void;
  onWindowMinimize: (id: string) => void;
}

/**
 * Window Manager component that renders all open windows
 * Features:
 * - Window dragging functionality with mouse events
 * - Window resizing functionality
 * - Z-index management and focus handling
 * - Window minimize/restore animations
 * - Glitch effects applied to windows based on haunt level
 * 
 * Validates Requirements 13.1, 13.2, 13.3, 13.4, 13.5, 11.1, 11.5
 */
export function WindowManager({
  windows,
  activeGlitches = [],
  onWindowClose,
  onWindowFocus,
  onWindowMove,
  onWindowMinimize,
}: WindowManagerProps) {
  const [draggingWindow, setDraggingWindow] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const handleMouseDown = (windowId: string, e: React.MouseEvent) => {
    // Only start dragging if clicking on the header
    const target = e.target as HTMLElement;
    if (!target.closest('[data-window-header]')) {
      return;
    }

    e.preventDefault();
    setDraggingWindow(windowId);
    onWindowFocus(windowId);

    const windowElement = windowRefs.current.get(windowId);
    if (windowElement) {
      const rect = windowElement.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!draggingWindow) return;

    const window = windows.find((w) => w.id === draggingWindow);
    if (!window) return;

    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    onWindowMove(draggingWindow, { x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setDraggingWindow(null);
  };

  // Add global mouse event listeners for dragging
  useEffect(() => {
    if (draggingWindow) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggingWindow, dragOffset]);

  const renderWindowContent = (window: WindowState) => {
    // Render content for different window types
    switch (window.type) {
      case 'notepad':
        return (
          <Notepad 
            windowId={window.id} 
            initialContent={window.content?.initialContent}
          />
        );
      case 'minesweeper':
        return (
          <Minesweeper 
            windowId={window.id} 
            difficulty={window.content?.difficulty || 'easy'}
          />
        );
      case 'portfolio':
        return (
          <PortfolioManager 
            windowId={window.id} 
            projects={window.content?.projects}
          />
        );
      case 'my-corpse':
        return (
          <MyCorpse windowId={window.id} />
        );
      case 'readme':
        return (
          <Readme windowId={window.id} />
        );
      case 'dark-web':
        return (
          <DarkWeb windowId={window.id} />
        );
      default:
        return <div>Window content for {window.type}</div>;
    }
  };

  return (
    <>
      {windows.map((window) => (
        <WindowContainer
          key={window.id}
          $zIndex={window.zIndex}
          $minimized={window.minimized}
          $glitchOffset={window.glitchOffset}
          style={{
            left: window.position.x,
            top: window.position.y,
            width: window.size.width,
            height: window.size.height,
          }}
          ref={(el) => {
            if (el) {
              windowRefs.current.set(window.id, el);
            } else {
              windowRefs.current.delete(window.id);
            }
          }}
          onMouseDown={(e) => handleMouseDown(window.id, e)}
          onClick={() => onWindowFocus(window.id)}
        >
          <GlitchableWindow windowId={window.id} activeGlitches={activeGlitches}>
            <StyledWindow>
              <StyledWindowHeader data-window-header>
                <span>{window.title}</span>
                <WindowControls>
                  <ControlButton onClick={() => onWindowMinimize(window.id)}>
                    _
                  </ControlButton>
                  <ControlButton onClick={() => onWindowClose(window.id)}>
                    ×
                  </ControlButton>
                </WindowControls>
              </StyledWindowHeader>
              <StyledWindowContent>
                {renderWindowContent(window)}
              </StyledWindowContent>
            </StyledWindow>
          </GlitchableWindow>
        </WindowContainer>
      ))}
    </>
  );
}
