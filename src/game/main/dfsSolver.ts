import type { NumbersForSolvingType } from '../../store/selectNumbersStore';
import GameState from '../gameState';
import { allGameStates } from './StoringStates';

export function dfsSolver(
  currentGameState: GameState,
  numbers: NumbersForSolvingType[],
  colsNumber: number,
  rowsNumber: number
) {
  if (currentGameState.isFinalState()) return true;
  if (currentGameState.isVisitedState()) return false;

  console.log(currentGameState, currentGameState.isFinalState());

  currentGameState.markAsVisited();
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

  if (!possibleMoves) return false;

  possibleMoves.forEach((move) => {
    const newGrid = [...currentGameState.currentState];
    newGrid[move.row][move.col] = { value, position: 'start' };
    newGrid[row][col] = { value, position: 'mid' };
    const newGameState = new GameState(newGrid);
    const newNumbers = [
      ...numbers.slice(-1),
      { row: move.row, col: move.col, value },
    ];

    dfsSolver(newGameState, newNumbers, colsNumber, rowsNumber);
  });
}
