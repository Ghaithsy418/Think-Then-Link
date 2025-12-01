import type { Grid } from '../store/gameStore';
import type { PossibleMovesType } from '../types/types';

type parametersType = {
  rowIndex: number;
  colIndex: number;
  rowsNumber: number;
  colsNumber: number;
  currValue: number;
};

export default class GameState {
  private isVisited = false;
  public currentState: Grid;

  constructor(state: Grid) {
    this.currentState = state;
  }

  public getPossibleMoves(parameters: parametersType) {
    const { rowIndex, colIndex, rowsNumber, colsNumber, currValue } =
      parameters;
    const possibleMoves: PossibleMovesType = [];

    const directions = [
      { dRow: 1, dCol: 0 },
      { dRow: -1, dCol: 0 },
      { dRow: 0, dCol: 1 },
      { dRow: 0, dCol: -1 },
    ];

    directions.forEach((dir) => {
      const nextRow = rowIndex + dir.dRow;
      const nextCol = colIndex + dir.dCol;

      const isTrue =
        nextRow < rowsNumber &&
        nextRow >= 0 &&
        nextCol < colsNumber &&
        nextCol >= 0;

      if (isTrue) {
        const neighbor = this.currentState[nextRow][nextCol];
        if (
          neighbor.value === null ||
          (neighbor.value === currValue && neighbor.position === 'end')
        )
          possibleMoves.push({ row: nextRow, col: nextCol });
      }
    });

    return possibleMoves;
  }

  public getLastNumber(parameters: parametersType) {
    const { rowIndex, colIndex, rowsNumber, colsNumber, currValue } =
      parameters;
    let lastNumber: { row: number; col: number } | null = null;
    let previousNumber: { row: number; col: number } | null = null;

    const directions = [
      { dRow: 1, dCol: 0 },
      { dRow: -1, dCol: 0 },
      { dRow: 0, dCol: 1 },
      { dRow: 0, dCol: -1 },
    ];

    directions.forEach((dir) => {
      const nextRow = rowIndex + dir.dRow;
      const nextCol = colIndex + dir.dCol;

      const isTrue =
        nextRow < rowsNumber &&
        nextRow >= 0 &&
        nextCol < colsNumber &&
        nextCol >= 0;

      if (isTrue) {
        const neighbor = this.currentState[nextRow][nextCol];

        if (neighbor.value === currValue && neighbor.position === 'end') {
          lastNumber = { row: nextRow, col: nextCol };
        }

        if (neighbor.value === currValue && neighbor.position === 'mid') {
          previousNumber = { row: nextRow, col: nextCol };
        }
      }
    });

    return { lastNumber, previousNumber };
  }

  public isFinalState() {
    let isDone = false;
    this.currentState.forEach((rows) => {
      if (isDone) return;

      for (const cell of rows) {
        if (cell.position === 'start') {
          isDone = true;
          break;
        }
      }
    });

    return !isDone;
  }

  public getHashOfState() {}

  public isVisitedState() {
    return this.isVisited;
  }

  public markAsVisited() {
    this.isVisited = true;
  }

  public copyState() {}
}
