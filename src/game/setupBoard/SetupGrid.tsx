import { useEffect, useMemo } from 'react';
import useGameStore from '../../store/gameStore';
import useSelectNumber from '../../store/selectNumbersStore';

interface GameGridProps {
  onNumberPlaced?: (num: string | number) => void;
}

function SetupGrid({ onNumberPlaced }: GameGridProps) {
  const { rowsNumber, colsNumber, grid, initializeGrid, setGrid } =
    useGameStore();
  const { selectedCells, setSelectedCells, setNumbersForSolving } =
    useSelectNumber();

  useEffect(
    function () {
      initializeGrid();
    },
    [initializeGrid]
  );

  const cellSize = useMemo(() => {
    const maxCells = Math.max(rowsNumber, colsNumber);
    if (maxCells <= 6) return 'w-16 h-16 text-2xl';
    if (maxCells <= 10) return 'w-12 h-12 text-xl';
    if (maxCells <= 15) return 'w-10 h-10 text-lg';
    return 'w-8 h-8 text-base';
  }, [rowsNumber, colsNumber]);

  const gapSize = useMemo(() => {
    const maxCells = Math.max(rowsNumber, colsNumber);
    if (maxCells <= 6) return 'gap-2';
    if (maxCells <= 10) return 'gap-1.5';
    if (maxCells <= 15) return 'gap-1';
    return 'gap-0.5';
  }, [rowsNumber, colsNumber]);

  const paddingSize = useMemo(() => {
    const maxCells = Math.max(rowsNumber, colsNumber);
    if (maxCells <= 6) return 'p-6';
    if (maxCells <= 10) return 'p-4';
    if (maxCells <= 15) return 'p-3';
    return 'p-2';
  }, [rowsNumber, colsNumber]);

  const handleCellClick = (row: number, col: number) => {
    handleSetupMode(row, col);
  };

  const handleSetupMode = (row: number, col: number) => {
    if (grid[row][col].value !== null) return;

    if (!selectedCells.start) {
      return;
    } else if (!selectedCells.start.value) {
      setSelectedCells({
        start: { ...selectedCells.start, index: row * colsNumber + col },
        end: null,
      });
    } else if (selectedCells.start.index === -1) {
      setSelectedCells({
        start: { ...selectedCells.start, index: row * colsNumber + col },
        end: null,
      });
    } else {
      const startRow = Math.floor(selectedCells.start.index / colsNumber);
      const startCol = selectedCells.start.index % colsNumber;

      if (row === startRow && col === startCol) return;

      const newGrid = grid.map((r) => [...r]);
      const value = selectedCells.start.value;
      newGrid[startRow][startCol] = { position: 'start', value };
      setNumbersForSolving({ row: startRow, col: startCol, value });
      newGrid[row][col] = { position: 'end', value };

      setGrid(newGrid);

      if (onNumberPlaced && value) {
        onNumberPlaced(value);
      }

      setSelectedCells({ start: null, end: null });
    }
  };

  const getCellClassName = (
    row: number,
    col: number,
    cell: number | null
  ): string => {
    const currentIndex = row * colsNumber + col;
    const isStartSelection =
      selectedCells.start?.index === currentIndex ||
      (!selectedCells.start?.value && selectedCells.start?.index === -1);
    const hasValue = cell !== null;

    let className = `group relative ${cellSize} rounded-xl border-2 transition-all duration-300 shadow-lg `;

    if (isStartSelection) {
      className +=
        'border-yellow-400 bg-yellow-500/30 scale-105 ring-4 ring-yellow-400/30 ';
    } else if (hasValue) {
      className +=
        'border-violet-400/60 bg-gradient-to-br from-violet-600/40 to-rose-600/40 hover:scale-105 hover:shadow-violet-500/30 ';
    } else {
      className +=
        'border-violet-500/30 bg-gradient-to-br from-slate-700/80 to-slate-800/80 hover:border-violet-400/60 hover:scale-105 ';
    }

    if (!hasValue) {
      className += 'cursor-pointer ';
    } else {
      className += 'opacity-50 cursor-not-allowed';
    }

    return className;
  };

  return (
    <div className="max-w-full overflow-auto custom-scrollbar">
      <div
        className={`grid ${gapSize} ${paddingSize} rounded-3xl bg-slate-800/40 backdrop-blur-md border-2 border-violet-500/30 shadow-2xl shadow-violet-500/20 mx-auto`}
        style={{
          gridTemplateColumns: `repeat(${colsNumber}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rowsNumber}, minmax(0, 1fr))`,
          maxWidth: 'min(90vw, 90vh)',
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const currentIndex = rowIndex * colsNumber + colIndex;
            const isStartSelection =
              selectedCells.start?.index === currentIndex;
            const hasValue = cell.value !== null;

            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                disabled={hasValue}
                className={getCellClassName(rowIndex, colIndex, cell?.value)}
              >
                <div className="absolute inset-0 rounded-xl bg-linear-to-br from-violet-500/0 to-rose-500/0 group-hover:from-violet-500/20 group-hover:to-rose-500/20 transition-all duration-300"></div>

                <div className="relative w-full h-full flex items-center justify-center font-bold transition-colors">
                  {cell !== null ? (
                    <span className="text-violet-200 transition-all duration-300">
                      {cell.value}
                    </span>
                  ) : isStartSelection ? (
                    <span className="text-yellow-300 animate-pulse">?</span>
                  ) : null}
                </div>
              </button>
            );
          })
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(71, 85, 105, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.7);
        }
      `}</style>
    </div>
  );
}

export default SetupGrid;
