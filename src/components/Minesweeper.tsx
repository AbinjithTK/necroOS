import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { necroTheme } from '../theme';
import { useNecroStore } from '../store';

const MinesweeperContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${necroTheme.colors.voidBlack};
  padding: 8px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background-color: ${necroTheme.colors.voidBlack};
  border: 2px solid ${necroTheme.colors.matrixGreen};
  margin-bottom: 8px;
  font-family: ${necroTheme.fonts.primary};
  color: ${necroTheme.colors.matrixGreen};
`;

const Counter = styled.div`
  font-size: 18px;
  font-weight: bold;
  min-width: 60px;
  text-align: center;
`;

const ResetButton = styled.button`
  background-color: ${necroTheme.colors.voidBlack};
  color: ${necroTheme.colors.matrixGreen};
  border: 2px solid ${necroTheme.colors.matrixGreen};
  font-family: ${necroTheme.fonts.primary};
  font-size: 16px;
  padding: 4px 12px;
  cursor: pointer;
  
  &:hover {
    background-color: ${necroTheme.colors.matrixGreen};
    color: ${necroTheme.colors.voidBlack};
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const Board = styled.div<{ rows: number; cols: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.cols}, 30px);
  grid-template-rows: repeat(${props => props.rows}, 30px);
  gap: 1px;
  background-color: ${necroTheme.colors.matrixGreen};
  border: 2px solid ${necroTheme.colors.matrixGreen};
  width: fit-content;
  margin: 0 auto;
`;

const Cell = styled.button<{ $revealed: boolean; $flagged: boolean; $hasMine: boolean }>`
  width: 30px;
  height: 30px;
  background-color: ${props => props.$revealed ? necroTheme.colors.voidBlack : '#1a1a1a'};
  border: ${props => props.$revealed ? 'none' : '1px solid ' + necroTheme.colors.matrixGreen};
  color: ${props => props.$hasMine ? necroTheme.colors.bloodRed : necroTheme.colors.matrixGreen};
  font-family: ${necroTheme.fonts.primary};
  font-size: 14px;
  font-weight: bold;
  cursor: ${props => props.$revealed ? 'default' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  
  &:hover {
    background-color: ${props => props.$revealed ? necroTheme.colors.voidBlack : '#2a2a2a'};
  }
  
  &:active {
    transform: ${props => props.$revealed ? 'none' : 'translateY(1px)'};
  }
`;

const StatusMessage = styled.div<{ $gameState: GameState }>`
  margin-top: 8px;
  padding: 8px;
  text-align: center;
  font-family: ${necroTheme.fonts.primary};
  font-size: 14px;
  color: ${props => props.$gameState === 'lost' ? necroTheme.colors.bloodRed : necroTheme.colors.matrixGreen};
  font-weight: bold;
`;

type GameState = 'playing' | 'won' | 'lost';
type Difficulty = 'easy' | 'medium' | 'hard';

interface CellData {
  hasMine: boolean;
  revealed: boolean;
  flagged: boolean;
  adjacentMines: number;
}

interface MinesweeperProps {
  windowId: string;
  difficulty?: Difficulty;
}

const DIFFICULTY_CONFIG = {
  easy: { rows: 8, cols: 8, mines: 10 },
  medium: { rows: 12, cols: 12, mines: 20 },
  hard: { rows: 16, cols: 16, mines: 40 },
};

/**
 * Minesweeper component - Soul Sweeper
 * Features:
 * - Classic Minesweeper game logic
 * - Skulls instead of mines, tombstones instead of flags
 * - Win/loss detection
 * - BSOD effect on game loss
 * - Horror theming
 * 
 * Validates Requirements 5.1, 5.2, 5.3, 5.4, 5.5
 */
export function Minesweeper({ windowId: _windowId, difficulty = 'easy' }: MinesweeperProps) {
  const config = DIFFICULTY_CONFIG[difficulty];
  const [board, setBoard] = useState<CellData[][]>([]);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [flagCount, setFlagCount] = useState(0);
  const [firstClick, setFirstClick] = useState(true);
  const incrementHauntLevel = useNecroStore((state) => state.incrementHauntLevel);

  // Initialize board
  useEffect(() => {
    initializeBoard();
  }, [difficulty]);

  const initializeBoard = () => {
    const newBoard: CellData[][] = [];
    for (let row = 0; row < config.rows; row++) {
      newBoard[row] = [];
      for (let col = 0; col < config.cols; col++) {
        newBoard[row][col] = {
          hasMine: false,
          revealed: false,
          flagged: false,
          adjacentMines: 0,
        };
      }
    }
    setBoard(newBoard);
    setGameState('playing');
    setFlagCount(0);
    setFirstClick(true);
  };

  // Place mines after first click to ensure first click is safe
  const placeMines = (excludeRow: number, excludeCol: number) => {
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    let minesPlaced = 0;

    while (minesPlaced < config.mines) {
      const row = Math.floor(Math.random() * config.rows);
      const col = Math.floor(Math.random() * config.cols);

      // Don't place mine on first click or if already has mine
      if ((row === excludeRow && col === excludeCol) || newBoard[row][col].hasMine) {
        continue;
      }

      newBoard[row][col].hasMine = true;
      minesPlaced++;
    }

    // Calculate adjacent mines for all cells
    for (let row = 0; row < config.rows; row++) {
      for (let col = 0; col < config.cols; col++) {
        if (!newBoard[row][col].hasMine) {
          newBoard[row][col].adjacentMines = countAdjacentMines(newBoard, row, col);
        }
      }
    }

    setBoard(newBoard);
    return newBoard;
  };

  // Count adjacent mines
  const countAdjacentMines = (board: CellData[][], row: number, col: number): number => {
    let count = 0;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const newRow = row + dr;
        const newCol = col + dc;
        if (
          newRow >= 0 &&
          newRow < config.rows &&
          newCol >= 0 &&
          newCol < config.cols &&
          board[newRow][newCol].hasMine
        ) {
          count++;
        }
      }
    }
    return count;
  };

  // Reveal cell
  const revealCell = (row: number, col: number) => {
    if (gameState !== 'playing') return;

    let currentBoard = board;

    // Place mines on first click
    if (firstClick) {
      currentBoard = placeMines(row, col);
      setFirstClick(false);
    }

    const cell = currentBoard[row][col];

    if (cell.revealed || cell.flagged) return;

    const newBoard = currentBoard.map(r => r.map(c => ({ ...c })));
    newBoard[row][col].revealed = true;

    // Hit a mine - game over
    if (cell.hasMine) {
      // Reveal all mines
      for (let r = 0; r < config.rows; r++) {
        for (let c = 0; c < config.cols; c++) {
          if (newBoard[r][c].hasMine) {
            newBoard[r][c].revealed = true;
          }
        }
      }
      setBoard(newBoard);
      setGameState('lost');
      incrementHauntLevel(10);
      
      // Trigger BSOD effect after a short delay
      setTimeout(() => {
        triggerBSOD();
      }, 1500);
      return;
    }

    // If no adjacent mines, reveal adjacent cells recursively
    if (cell.adjacentMines === 0) {
      revealAdjacentCells(newBoard, row, col);
    }

    setBoard(newBoard);

    // Check for win
    checkWinCondition(newBoard);
  };

  // Reveal adjacent cells recursively
  const revealAdjacentCells = (board: CellData[][], row: number, col: number) => {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const newRow = row + dr;
        const newCol = col + dc;
        if (
          newRow >= 0 &&
          newRow < config.rows &&
          newCol >= 0 &&
          newCol < config.cols &&
          !board[newRow][newCol].revealed &&
          !board[newRow][newCol].flagged &&
          !board[newRow][newCol].hasMine
        ) {
          board[newRow][newCol].revealed = true;
          if (board[newRow][newCol].adjacentMines === 0) {
            revealAdjacentCells(board, newRow, newCol);
          }
        }
      }
    }
  };

  // Toggle flag
  const toggleFlag = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    if (gameState !== 'playing') return;

    const cell = board[row][col];
    if (cell.revealed) return;

    const newBoard = board.map(r => r.map(c => ({ ...c })));
    newBoard[row][col].flagged = !cell.flagged;
    setBoard(newBoard);
    setFlagCount(flagCount + (cell.flagged ? -1 : 1));
  };

  // Check win condition
  const checkWinCondition = (board: CellData[][]) => {
    let allNonMinesRevealed = true;
    for (let row = 0; row < config.rows; row++) {
      for (let col = 0; col < config.cols; col++) {
        if (!board[row][col].hasMine && !board[row][col].revealed) {
          allNonMinesRevealed = false;
          break;
        }
      }
      if (!allNonMinesRevealed) break;
    }

    if (allNonMinesRevealed) {
      setGameState('won');
      incrementHauntLevel(5);
    }
  };

  // Trigger BSOD effect
  const triggerBSOD = () => {
    // Create BSOD overlay
    const bsod = document.createElement('div');
    bsod.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: #0000AA;
      color: white;
      font-family: 'Courier New', monospace;
      padding: 40px;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    `;
    
    bsod.innerHTML = `
      <div style="max-width: 600px; text-align: left;">
        <h1 style="margin-bottom: 20px;">A fatal exception has occurred at 0x666:DEADBEEF</h1>
        <p>SOUL_SWEEPER_EXCEPTION in module NECRO.EXE</p>
        <p style="margin-top: 20px;">* Press any key to restart your computer</p>
        <p>* You will lose any unsaved souls in all applications</p>
        <p style="margin-top: 40px; color: #FF0000;">The dead do not forgive mistakes...</p>
      </div>
    `;

    document.body.appendChild(bsod);

    // Remove BSOD and reload page after 3 seconds or on any key press
    const cleanup = () => {
      document.body.removeChild(bsod);
      window.location.reload();
    };

    setTimeout(cleanup, 3000);
    document.addEventListener('keydown', cleanup, { once: true });
    bsod.addEventListener('click', cleanup, { once: true });
  };

  // Render cell content
  const renderCellContent = (cell: CellData) => {
    if (cell.flagged) {
      return '🪦'; // Tombstone
    }
    if (!cell.revealed) {
      return '';
    }
    if (cell.hasMine) {
      return '💀'; // Skull
    }
    if (cell.adjacentMines === 0) {
      return '';
    }
    return cell.adjacentMines;
  };

  const getStatusMessage = () => {
    if (gameState === 'won') {
      return 'You survived... for now.';
    }
    if (gameState === 'lost') {
      return 'Your soul has been claimed.';
    }
    return '';
  };

  return (
    <MinesweeperContainer>
      <Header>
        <Counter>🪦 {flagCount}/{config.mines}</Counter>
        <ResetButton onClick={initializeBoard}>
          {gameState === 'playing' ? '😐' : gameState === 'won' ? '😎' : '💀'}
        </ResetButton>
        <Counter>⏱️ --:--</Counter>
      </Header>
      
      <Board rows={config.rows} cols={config.cols}>
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              $revealed={cell.revealed}
              $flagged={cell.flagged}
              $hasMine={cell.hasMine}
              onClick={() => revealCell(rowIndex, colIndex)}
              onContextMenu={(e) => toggleFlag(e, rowIndex, colIndex)}
              data-testid={`cell-${rowIndex}-${colIndex}`}
            >
              {renderCellContent(cell)}
            </Cell>
          ))
        )}
      </Board>

      {getStatusMessage() && (
        <StatusMessage $gameState={gameState}>
          {getStatusMessage()}
        </StatusMessage>
      )}
    </MinesweeperContainer>
  );
}
