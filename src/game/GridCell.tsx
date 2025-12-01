import React from 'react';
import useGameStore from '../store/gameStore';
import { getThemeClasses } from '../utils/getThemeClasses';

interface GridCellProps {
  row: number;
  col: number;
  cell: { position: 'start' | 'end' | 'mid'; value: number | null };
  isActive: boolean;
  isEndpoint: boolean;
  canInteract: boolean;
  cellSize: string;
}

const GridCell = React.memo(
  ({
    row,
    col,
    cell,
    isActive,
    isEndpoint,
    canInteract,
    cellSize,
  }: GridCellProps) => {
    const {
      currentGameState,
      colsNumber,
      rowsNumber,
      selectedCell,
      setSelectedCell,
      setGrid,
      grid,
    } = useGameStore();
    const { value: val, position } = cell;

    function detectLastNumber() {
      if (!selectedCell || !selectedCell?.lastNumber) return null;

      const lastNum = selectedCell.lastNumber;
      return {
        isLast: lastNum.col === col && lastNum.row === row,
        row: lastNum.row,
        col: lastNum.col,
      };
    }

    function detectPossibleMoves() {
      if (!selectedCell || selectedCell?.lastNumber) return false;
      const { possibleMoves } = selectedCell;

      return possibleMoves.some((move) => move.col === col && move.row === row);
    }

    function handleSelectNumber(
      value: number | null,
      alwaysTrue: boolean = false
    ) {
      if (!currentGameState || !value || (position !== 'start' && !alwaysTrue))
        return;

      if (selectedCell?.col === col && selectedCell?.row === row)
        return setSelectedCell(null);

      const parameters = {
        rowIndex: row,
        colIndex: col,
        rowsNumber,
        colsNumber,
        currValue: value,
      };

      const { lastNumber, previousNumber } =
        currentGameState.getLastNumber(parameters);

      const possibleMoves = currentGameState.getPossibleMoves(parameters);
      setSelectedCell({
        row,
        col,
        possibleMoves,
        lastNumber,
        previousNumber,
        value,
      });
    }

    function handleSetNumber() {
      if (!selectedCell) return;

      const newGrid = [...grid];

      if (!detectPossibleMoves()) return;

      newGrid[row][col] = { position: 'start', value: selectedCell.value };
      newGrid[selectedCell.row][selectedCell.col].position = 'mid';

      setGrid(newGrid);

      handleSelectNumber(selectedCell.value, true);
    }

    function handleInteract() {
      if (val === null) return handleSetNumber();

      if (
        selectedCell &&
        selectedCell?.lastNumber &&
        selectedCell.lastNumber.row === row &&
        selectedCell.lastNumber.col === col
      ) {
        const newGrid = [...grid];
        if (
          newGrid[selectedCell.lastNumber.row][selectedCell.lastNumber.col]
            .position === 'end'
        ) {
          newGrid[selectedCell.row][selectedCell.col] = {
            position: 'end',
            value: selectedCell.value,
          };
          setGrid(newGrid);

          return setSelectedCell(null);
        }
      }

      if (
        selectedCell &&
        selectedCell?.previousNumber &&
        selectedCell.previousNumber.row === row &&
        selectedCell.previousNumber.col === col
      ) {
        const newGrid = [...grid];

        const value = selectedCell.value;

        newGrid[selectedCell.previousNumber.row][
          selectedCell.previousNumber.col
        ] = { value, position: 'start' };
        newGrid[selectedCell.row][selectedCell.col] = {
          position: 'mid',
          value: null,
        };
        setGrid(newGrid);
        setSelectedCell(null);
        return handleSelectNumber(value);
      }

      handleSelectNumber(val);
    }

    const isSelected =
      selectedCell && selectedCell.row === row && selectedCell.col === col;

    return (
      <div
        className={`
        relative group flex items-center justify-center 
        transition-all duration-300 ease-out select-none touch-none
        ${cellSize}  rounded-xl 
        ${getThemeClasses(val, isActive, isEndpoint, detectPossibleMoves(), selectedCell?.value, detectLastNumber()?.isLast)}
        ${isSelected ? 'border-5 ' : 'border'}
        ${!canInteract ? 'cursor-default' : 'cursor-pointer'}
      `}
        onPointerDown={(e) => {
          if (canInteract) {
            e.preventDefault();
            handleInteract();
          }
        }}
      >
        <div className="absolute inset-0 rounded-xl bg-linear-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        {val !== null && (isEndpoint || isActive) && (
          <span className="text-white font-extrabold drop-shadow-md z-10 pointer-events-none">
            {val}
          </span>
        )}
      </div>
    );
  }
);

export default GridCell;
