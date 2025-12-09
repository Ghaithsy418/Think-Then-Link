import type { Grid } from '../../store/gameStore';
import type { NumbersForSolvingType } from '../../store/selectNumbersStore';
import GameState from '../gameState';
import { delayTime } from './delay';
import { allGameStates } from './StoringStates';

type QueueItem = {
  state: GameState;
  heads: NumbersForSolvingType[];
};

export const queue: QueueItem[] = [];

export async function bfsSolver(
  initialState: GameState,
  numbers: NumbersForSolvingType[],
  colsNumber: number,
  rowsNumber: number,
  setGrid: (newState: Grid) => void
) {
  queue.length = 0;
  const visited = new Set<string>();

  queue.push({
    state: initialState,
    heads: numbers,
  });

  while (queue.length > 0) {
    const { state, heads } = queue.shift()!;

    setGrid(state.currentState);
    await new Promise((resolve) => setTimeout(resolve, delayTime));

    if (state.isFinalState()) {
      console.log([...allGameStates], [...allGameStates].length);
      allGameStates.clear();
      return true;
    }

    const stateHash = state.getHashOfState();
    if (visited.has(stateHash)) continue;
    visited.add(stateHash);

    allGameStates.add(state);

    const activeNumberIndex = heads.length - 1;
    if (activeNumberIndex < 0) continue;

    const { row, col, value } = heads[activeNumberIndex];

    const parameters = {
      rowIndex: row,
      colIndex: col,
      colsNumber,
      rowsNumber,
      currValue: value,
    };

    const possibleMoves = state.getPossibleMoves(parameters);
    const { lastNumber } = state.getLastNumber(parameters);

    if (lastNumber) {
      const newGrid = state.currentState.map((r) => [...r]);
      newGrid[row][col] = { position: 'mid', value };
      heads.pop();
      const newState = new GameState(newGrid);
      queue.push({ state: newState, heads });
      continue;
    }

    if (possibleMoves && !lastNumber) {
      for (const move of possibleMoves) {
        const newGrid = state.currentState.map((r) => [...r]);

        newGrid[row][col] = { position: 'mid', value };
        newGrid[move.row][move.col] = { position: 'start', value };

        const newState = new GameState(newGrid);

        const newHeads = [
          ...heads.slice(0, -1),
          { row: move.row, col: move.col, value },
        ];

        queue.push({
          state: newState,
          heads: newHeads,
        });
      }
    }
  }

  return false;
}
