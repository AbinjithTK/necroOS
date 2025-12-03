import { useState } from 'react';
import styled from 'styled-components';
import { necroTheme } from '../theme';
import { useNecroStore } from '../store';

const IconsContainer = styled.div`
  position: fixed;
  top: 80px;
  left: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  z-index: 1001;
  pointer-events: auto;
`;

const IconWrapper = styled.div<{ $isDragging?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
  opacity: ${({ $isDragging }) => ($isDragging ? 0.5 : 1)};

  &:hover {
    background-color: rgba(0, 255, 65, 0.1);
  }

  &:active {
    background-color: rgba(0, 255, 65, 0.2);
  }
`;

const IconImage = styled.div<{ $iconType: string }>`
  width: 48px;
  height: 48px;
  background-color: rgba(0, 255, 65, 0.2);
  border: 2px solid ${necroTheme.colors.matrixGreen};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 4px;
  box-shadow: 0 0 15px ${necroTheme.colors.matrixGreen};

  ${({ $iconType }) => {
    switch ($iconType) {
      case 'notepad':
        return `
          &::before {
            content: '📝';
          }
        `;
      case 'my-corpse':
        return `
          &::before {
            content: '💀';
          }
        `;
      case 'the-void':
        return `
          background-color: ${necroTheme.colors.voidBlack};
          border-color: ${necroTheme.colors.bloodRed};
          box-shadow: 0 0 10px ${necroTheme.colors.bloodRed};
          &::before {
            content: '🕳️';
          }
        `;
      case 'dark-web':
        return `
          &::before {
            content: '🕸️';
          }
        `;
      case 'readme':
        return `
          &::before {
            content: '📄';
          }
        `;
      default:
        return '';
    }
  }}
`;

const IconLabel = styled.div`
  font-family: ${necroTheme.fonts.primary};
  font-size: 11px;
  color: ${necroTheme.colors.matrixGreen};
  text-align: center;
  text-shadow: 0 0 5px ${necroTheme.colors.matrixGreen};
  word-wrap: break-word;
  max-width: 80px;
`;

const DropZone = styled.div<{ $isOver: boolean }>`
  ${({ $isOver }) =>
    $isOver &&
    `
    background-color: rgba(255, 0, 0, 0.2);
    box-shadow: 0 0 20px ${necroTheme.colors.bloodRed};
  `}
`;

interface Icon {
  id: string;
  label: string;
  type: 'notepad' | 'my-corpse' | 'the-void' | 'dark-web' | 'readme';
  onDoubleClick?: () => void;
  onDrop?: (e: React.DragEvent) => void;
}

/**
 * Desktop Icons component with icon grid layout
 * Features:
 * - My Corpse icon with double-click handler
 * - The Void icon with drag-and-drop handler
 * - Dark Web icon with double-click handler
 * - Readme.txt icon with double-click handler
 * - Horror theming and custom cursors
 * 
 * Validates Requirements 3.1, 3.2, 3.3, 3.4, 3.5
 */
export function DesktopIcons() {
  const [dragOverVoid, setDragOverVoid] = useState(false);
  const openWindow = useNecroStore((state) => state.openWindow);
  const playSound = useNecroStore((state) => state.playSound);
  const incrementHauntLevel = useNecroStore((state) => state.incrementHauntLevel);

  const handleNotepadDoubleClick = () => {
    openWindow('notepad');
    incrementHauntLevel(1);
  };

  const handleMyCorpseDoubleClick = () => {
    openWindow('my-corpse');
    incrementHauntLevel(1);
  };

  const handleDarkWebDoubleClick = () => {
    openWindow('dark-web');
    incrementHauntLevel(1);
  };

  const handleReadmeDoubleClick = () => {
    openWindow('readme');
    incrementHauntLevel(1);
  };

  const handleVoidDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverVoid(true);
  };

  const handleVoidDragLeave = () => {
    setDragOverVoid(false);
  };

  const handleVoidDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverVoid(false);

    // Play low growl audio effect
    playSound('void-growl');

    // Increment haunt level
    incrementHauntLevel(3);

    // Show notification that file is permanently removed
    console.log('File dragged to The Void - permanently removed');
  };

  const icons: Icon[] = [
    {
      id: 'notepad',
      label: 'Notepad',
      type: 'notepad',
      onDoubleClick: handleNotepadDoubleClick,
    },
    {
      id: 'my-corpse',
      label: 'My Corpse',
      type: 'my-corpse',
      onDoubleClick: handleMyCorpseDoubleClick,
    },
    {
      id: 'the-void',
      label: 'The Void',
      type: 'the-void',
      onDrop: handleVoidDrop,
    },
    {
      id: 'dark-web',
      label: 'Dark Web',
      type: 'dark-web',
      onDoubleClick: handleDarkWebDoubleClick,
    },
    {
      id: 'readme',
      label: 'Readme.txt',
      type: 'readme',
      onDoubleClick: handleReadmeDoubleClick,
    },
  ];

  return (
    <IconsContainer>
      {icons.map((icon) => {
        const isVoid = icon.type === 'the-void';

        return (
          <IconWrapper
            key={icon.id}
            onDoubleClick={icon.onDoubleClick}
            onDragOver={isVoid ? handleVoidDragOver : undefined}
            onDragLeave={isVoid ? handleVoidDragLeave : undefined}
            onDrop={isVoid ? icon.onDrop : undefined}
          >
            {isVoid ? (
              <DropZone $isOver={dragOverVoid}>
                <IconImage $iconType={icon.type} />
              </DropZone>
            ) : (
              <IconImage $iconType={icon.type} />
            )}
            <IconLabel>{icon.label}</IconLabel>
          </IconWrapper>
        );
      })}
    </IconsContainer>
  );
}
