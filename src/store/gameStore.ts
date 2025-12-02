// store/gameStore.ts

import { create } from 'zustand';
import GameState from '../game/gameState';
import type { PossibleMovesType } from '../types/types';

export type gameStatusType = 'gridSize' | 'setupGrid' | 'gameStarted';
export type Coords = { row: number; col: number };

export type GridCell = {
  value: number | null;
  position: 'start' | 'end' | 'mid';
};
export type Grid = GridCell[][];

type SelectedCellType = {
  row: number;
  col: number;
  value: number;
  possibleMoves: PossibleMovesType;
  lastNumber?: { row: number; col: number } | null;
  previousNumber?: { row: number; col: number } | null;
};

interface GameStoreTypes {
  colsNumber: number;
  rowsNumber: number;
  gameStatus: gameStatusType;

  currentGameState: GameState | null;
  selectedCell: SelectedCellType | null;

  initialGrid: Grid;
  firstGridState: Grid;
  grid: Grid;

  activeNumber: number | null;
  activePathCoords: Coords[];
  lastPosition: Coords | null;
  completedNumbers: number[];
  totalPairs: number;

  setColsNumber: (value: number) => void;
  setRowsNumber: (value: number) => void;
  setGameStatus: (value: gameStatusType) => void;
  setCurrentState: (newValue: GameState) => void;
  setSelectedCell: (newValue: SelectedCellType | null) => void;
  initializeGrid: () => void;
  setGrid: (grid: Grid) => void;
  setFirstGridState: (grid: Grid) => void;
  startGame: () => void;

  exitToMenu: () => void;
  restartLevel: () => void;
}

const useGameStore = create<GameStoreTypes>((set, get) => ({
  colsNumber: 0,
  rowsNumber: 0,
  gameStatus: 'gridSize',
  initialGrid: [],
  grid: [[{ value: null, position: 'start' }]],
  firstGridState: [],
  activeNumber: null,
  activePathCoords: [],
  lastPosition: null,
  completedNumbers: [],
  totalPairs: 0,

  selectedCell: null,
  currentGameState: null,

  setColsNumber: (value) => set({ colsNumber: value }),
  setRowsNumber: (value) => set({ rowsNumber: value }),
  setGameStatus: (value) => set({ gameStatus: value }),

  setCurrentState: (newValue) => set({ currentGameState: newValue }),
  setSelectedCell: (newValue) => set({ selectedCell: newValue }),

  initializeGrid: () => {
    const { rowsNumber, colsNumber } = get();
    const emptyGrid = Array.from({ length: rowsNumber }, () =>
      Array(colsNumber).fill({ position: 'mid', value: null })
    );
    set({
      initialGrid: emptyGrid,
      grid: emptyGrid,
      activeNumber: null,
      activePathCoords: [],
      lastPosition: null,
      completedNumbers: [],
      totalPairs: 0,
      gameStatus: 'setupGrid',
    });
  },

  setGrid: (incomingGrid) => {
    const distinctNumbers = new Set<GridCell>();
    incomingGrid.flat().forEach((val) => {
      if (val !== null)
        distinctNumbers.add({ position: val.position, value: val.value });
    });

    const initialClone = incomingGrid.map((row) => [...row]);
    const gridClone = incomingGrid.map((row) => [...row]);

    set({
      initialGrid: initialClone,
      grid: gridClone,
      totalPairs: distinctNumbers.size / 2,
      completedNumbers: [],
    });
  },

  setFirstGridState: (incomingGrid) => {
    const distinctNumbers = new Set<GridCell>();
    incomingGrid.flat().forEach((val) => {
      if (val !== null)
        distinctNumbers.add({ position: val.position, value: val.value });
    });

    const gridClone = incomingGrid.map((row) => [...row]);

    set({
      firstGridState: gridClone,
    });
  },

  startGame: () => set({ gameStatus: 'gameStarted' }),

  exitToMenu: () => {
    set({
      colsNumber: 0,
      rowsNumber: 0,
      gameStatus: 'gridSize',
      initialGrid: [],
      grid: [],
      activeNumber: null,
      activePathCoords: [],
      lastPosition: null,
      completedNumbers: [],
      totalPairs: 0,
    });
  },

  restartLevel: () => {
    const { initialGrid } = get();

    const cleanGrid = [...initialGrid]

    set({
      grid: cleanGrid,
      activeNumber: null,
      activePathCoords: [],
      lastPosition: null,
      completedNumbers: [],
      gameStatus: 'gameStarted',
    });
  },
}));

export default useGameStore;
