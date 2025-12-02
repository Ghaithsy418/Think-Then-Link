import type { Grid } from '../../store/gameStore';
import type { NumbersForSolvingType } from '../../store/selectNumbersStore';
import GameState from '../gameState';
import { allGameStates } from './StoringStates';

export async function dfsSolver(
  currentGameState: GameState,
  numbers: NumbersForSolvingType[],
  colsNumber: number,
  rowsNumber: number,
  setGrid: (newState: Grid) => void
) {
  if (currentGameState.isFinalState()) return true;
  if (currentGameState.isVisitedState()) return false;

  allGameStates.add(currentGameState);

  const { row, col, value } = numbers[numbers.length - 1];

  const parameters = {
    rowIndex: row,
    colIndex: col,
    colsNumber,
    rowsNumber,
    currValue: value,
  };

  const possibleMoves = currentGameState.getPossibleMoves(parameters);
  const { lastNumber } = currentGameState.getLastNumber(parameters);

  if (lastNumber) {
    const newGrid = [...currentGameState.currentState];
    newGrid[row][col] = { value, position: 'mid' };
    numbers.pop();
    setGrid(newGrid);
    const newGameState = new GameState(newGrid);
    await new Promise((resolve) => setTimeout(resolve, 500));
    currentGameState.markAsVisited();
    return await dfsSolver(
      newGameState,
      numbers,
      colsNumber,
      rowsNumber,
      setGrid
    );
  }

  if (!possibleMoves) {
    currentGameState.markAsVisited();
    return false;
  }

  for (const move of possibleMoves) {
    const newGrid = [...currentGameState.currentState];
    newGrid[move.row][move.col] = { value, position: 'start' };
    newGrid[row][col] = { value, position: 'mid' };
    setGrid(newGrid);
    const newGameState = new GameState(newGrid);
    const newNumbers = [
      ...numbers.slice(0, -1),
      { row: move.row, col: move.col, value },
    ];

    await new Promise((resolve) => setTimeout(resolve, 100));

    if (
      await dfsSolver(newGameState, newNumbers, colsNumber, rowsNumber, setGrid)
    ) {
      return true;
    } else {
      currentGameState.markAsVisited();
      const newGrid = [...currentGameState.currentState];
      newGrid[move.row][move.col] = { value: null, position: 'mid' };
      newGrid[row][col] = { value, position: 'start' };
      new GameState(newGrid);
      await new Promise((resolve) => setTimeout(resolve, 100));
      setGrid(newGrid);
      continue;
    }
  }
}
