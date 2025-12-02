import { Menu } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { BiBulb } from "react-icons/bi";
import { RiRestartFill } from "react-icons/ri";
import useGameStore, { type Grid } from "../../store/gameStore";
import useSelectNumber from "../../store/selectNumbersStore";
import GridCell from "../GridCell";
import GameState from "../gameState";
import { bfsSolver } from "./bfsSolver";
import { dfsSolver } from "./dfsSolver";

export let firstGameGrid: Grid = [];

const MainGameUi: React.FC = () => {
  const [isSolving, setIsSolving] = useState(false);
  const {
    grid,
    firstGridState,
    initialGrid,
    colsNumber,
    rowsNumber,
    gameStatus,
    activeNumber,
    activePathCoords,
    setCurrentState,
    exitToMenu,
    setGrid,
    currentGameState,
  } = useGameStore();

  const { numbersForSolving } = useSelectNumber();

  const cellSize = useMemo(() => {
    const maxCells = Math.max(rowsNumber, colsNumber);
    if (maxCells <= 6) return "w-16 h-16 text-2xl";
    if (maxCells <= 10) return "w-12 h-12 text-xl";
    if (maxCells <= 15) return "w-10 h-10 text-lg";
    return "w-8 h-8 text-base";
  }, [rowsNumber, colsNumber]);

  const gapSize = useMemo(() => {
    const maxCells = Math.max(rowsNumber, colsNumber);
    if (maxCells <= 6) return "gap-2";
    if (maxCells <= 10) return "gap-1.5";
    if (maxCells <= 15) return "gap-1";
    return "gap-0.5";
  }, [rowsNumber, colsNumber]);

  const paddingSize = useMemo(() => {
    const maxCells = Math.max(rowsNumber, colsNumber);
    if (maxCells <= 6) return "p-6";
    if (maxCells <= 10) return "p-4";
    if (maxCells <= 15) return "p-3";
    return "p-2";
  }, [rowsNumber, colsNumber]);

  const isFinalState = currentGameState?.isFinalState() || false;

  useEffect(
    function () {
      const gameState = new GameState(initialGrid);
      setCurrentState(gameState);
    },
    [initialGrid, setCurrentState]
  );

  useEffect(
    function () {
      if (isFinalState) toast.success("Congratulations!!");
    },
    [isFinalState]
  );

  function handleRestartGame() {
    setGrid(firstGridState);
  }

  async function handleDfsSolver() {
    if (!currentGameState) return;

    const deepCloneNumbers = numbersForSolving.map((num) => num);

    setIsSolving(true);
    console.log("Timer Started");
    const before = Date.now();
    const result = await dfsSolver(
      currentGameState,
      deepCloneNumbers.reverse(),
      colsNumber,
      rowsNumber,
      setGrid
    );
    const after = Date.now();
    console.log(`It took: ${(after - before) / 1000} seconds`);
    setIsSolving(false);
    if (!result) toast.error("Something went wrong with DFS");
  }

  async function handleBfsSolver() {
    if (!currentGameState) return;

    const deepCloneNumbers = numbersForSolving.map((num) => num);

    setIsSolving(true);
    console.log("Timer Started");
    const before = Date.now();
    const result = await bfsSolver(
      currentGameState,
      deepCloneNumbers.reverse(),
      colsNumber,
      rowsNumber,
      setGrid
    );
    const after = Date.now();
    console.log(`It took: ${(after - before) / 1000} seconds`);
    setIsSolving(false);
    if (!result) toast.error("Something went wrong with DFS");
  }

  const isEndpoint = useCallback(
    (r: number, c: number, val: number | null) => {
      return initialGrid[r]?.[c]?.value === val && val !== null;
    },
    [initialGrid]
  );

  const checkIsActivePath = useCallback(
    (r: number, c: number) => {
      return activePathCoords.some((p) => p.row === r && p.col === c);
    },
    [activePathCoords]
  );

  if (gameStatus === "gridSize" || gameStatus === "setupGrid") return null;

  const canInteract = !isSolving && gameStatus === "gameStarted";

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[500px]">
      <div className="flex justify-between items-center w-full max-w-[90vh] mb-6 px-4">
        <div className="flex gap-3">
          <button
            onClick={exitToMenu}
            className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <button
            disabled={isSolving}
            onClick={handleDfsSolver}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm text-white shadow-lg transition-all border border-white/10 ${isSolving ? "bg-slate-700 cursor-wait opacity-80" : "bg-violet-600 hover:bg-violet-500 hover:scale-105 shadow-violet-500/30"} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSolving ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <BiBulb className="w-6 h-6" />
            )}
            {isSolving ? "Solving..." : "DFS Solver"}
          </button>
          <button
            disabled={isSolving}
            onClick={handleBfsSolver}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm text-white shadow-lg transition-all border border-white/10 ${isSolving ? "bg-slate-700 cursor-wait opacity-80" : "bg-violet-600 hover:bg-violet-500 hover:scale-105 shadow-violet-500/30"} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSolving ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <BiBulb className="w-6 h-6" />
            )}
            {isSolving ? "Solving..." : "BFS Solver"}
          </button>
          <button
            onClick={handleRestartGame}
            disabled={isSolving}
            className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm text-white bg-rose-600 hover:bg-rose-500 active:scale-95 shadow-lg shadow-rose-500/30 transition-all border border-white/10"
          >
            <RiRestartFill className="w-6 h-6" /> Retry
          </button>
        </div>
      </div>

      <div className="relative max-w-full overflow-hidden p-2">
        <div
          className={`
            grid ${gapSize} ${paddingSize} 
            rounded-3xl bg-slate-800/40 backdrop-blur-md 
            border-2 transition-all duration-500
            mx-auto
          `}
          style={{
            gridTemplateColumns: `repeat(${colsNumber}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rowsNumber}, minmax(0, 1fr))`,
            maxWidth: "min(90vw, 85vh)",
          }}
        >
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isActive = checkIsActivePath(rowIndex, colIndex);
              return (
                <GridCell
                  key={`${rowIndex}-${colIndex}`}
                  row={rowIndex}
                  col={colIndex}
                  cell={cell}
                  isActive={
                    cell?.value === activeNumber &&
                    gameStatus === "gameStarted" &&
                    isActive
                  }
                  isEndpoint={isEndpoint(rowIndex, colIndex, cell?.value)}
                  canInteract={canInteract}
                  cellSize={cellSize}
                />
              );
            })
          )}
        </div>
      </div>

      {/* <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(139, 92, 246, 0.3); border-radius: 10px; }
        .animate-bounce-slight { animation: bounce-slight 2s infinite ease-in-out; }
        @keyframes bounce-slight {
            0%, 100% { transform: translateY(0) rotate(-6deg); }
            50% { transform: translateY(-10px) rotate(-6deg); }
        }
      `}</style> */}
    </div>
  );
};

export default MainGameUi;
