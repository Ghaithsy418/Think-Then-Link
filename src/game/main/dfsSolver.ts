import type { Grid } from "../../store/gameStore";
import type { NumbersForSolvingType } from "../../store/selectNumbersStore";
import GameState from "../gameState";
import { delayTime } from "./delay";
import { allGameStates } from "./StoringStates";

export async function dfsSolver(
  currentGameState: GameState,
  numbers: NumbersForSolvingType[],
  colsNumber: number,
  rowsNumber: number,
  setGrid: (newState: Grid) => void
) {
  if (currentGameState.isFinalState()) {
    console.log(allGameStates, [...allGameStates].length);
    allGameStates.clear();
    return true;
  }
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
    const newGrid = currentGameState.currentState.map((r) => [...r]);
    newGrid[row][col] = { value, position: "mid" };
    numbers.pop();
    setGrid(newGrid);
    const newGameState = new GameState(newGrid);
    if (delayTime !== 0)
      await new Promise((resolve) => setTimeout(resolve, delayTime));
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
    const newGrid = currentGameState.currentState.map((r) => [...r]);
    newGrid[move.row][move.col] = { value, position: "start" };
    newGrid[row][col] = { value, position: "mid" };
    setGrid(newGrid);
    const newGameState = new GameState(newGrid);
    const newNumbers = [
      ...numbers.slice(0, -1),
      { row: move.row, col: move.col, value },
    ];

    if (delayTime !== 0)
      await new Promise((resolve) => setTimeout(resolve, delayTime));

    if (
      await dfsSolver(newGameState, newNumbers, colsNumber, rowsNumber, setGrid)
    ) {
      return true;
    } else {
      currentGameState.markAsVisited();
      const newGrid = currentGameState.currentState.map((r) => [...r]);
      newGrid[move.row][move.col] = { value: null, position: "mid" };
      newGrid[row][col] = { value, position: "start" };
      new GameState(newGrid);
      if (delayTime !== 0)
        await new Promise((resolve) => setTimeout(resolve, delayTime));
      setGrid(newGrid);
      continue;
    }
  }
}
