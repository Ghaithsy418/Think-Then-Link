import { Brain, Gamepad2 } from 'lucide-react';
import type React from 'react';
import useGameStore from '../../store/gameStore';

function SelectBoardSize() {
  const {
    colsNumber,
    rowsNumber,
    setColsNumber,
    setRowsNumber,
    setGameStatus,
  } = useGameStore();

  function handleChangeCols(e: React.ChangeEvent<HTMLInputElement>) {
    setColsNumber(Number(e.target.value));
  }

  function handleChangeRows(e: React.ChangeEvent<HTMLInputElement>) {
    setRowsNumber(Number(e.target.value));
  }

  function handleStartingGame() {
    if (!colsNumber || !rowsNumber) return;

    setGameStatus('setupGrid');
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-linear-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      <div className="absolute top-20 left-20 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="flex flex-col gap-10 items-center z-10">
        <div className="flex flex-col gap-4 items-center">
          <div className="flex items-center gap-4 mb-2">
            <div className="relative">
              <Brain
                className="w-14 h-14 text-rose-500 animate-pulse"
                strokeWidth={2.5}
              />
              <div className="absolute inset-0 bg-rose-500/30 blur-xl rounded-full"></div>
            </div>
            <h1 className="text-7xl font-extrabold bg-linear-to-r from-rose-400 via-pink-400 to-violet-400 text-transparent bg-clip-text drop-shadow-2xl">
              Think then Link
            </h1>
            <div className="relative">
              <Gamepad2
                className="w-14 h-14 text-violet-500 animate-pulse"
                strokeWidth={2.5}
              />
              <div className="absolute inset-0 bg-violet-500/30 blur-xl rounded-full"></div>
            </div>
          </div>
          <p className="text-2xl text-slate-300 font-light tracking-wide">
            Please select the board size
          </p>
        </div>

        <div className="flex gap-6 items-center">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-400 font-medium ml-1">
              Columns
            </label>
            <input
              onChange={handleChangeCols}
              defaultValue={colsNumber}
              type="number"
              placeholder="4"
              min="2"
              max="10"
              className="w-32 border-2 rounded-2xl border-violet-500/40 bg-slate-800/60 backdrop-blur-md py-4 px-5 text-xl text-center text-violet-200 placeholder:text-violet-500/50 focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-500/20 transition-all shadow-lg shadow-violet-500/10 hover:border-violet-400/60 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          <div className="text-4xl text-slate-500 font-light">×</div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-400 font-medium ml-1">
              Rows
            </label>
            <input
              defaultValue={rowsNumber}
              onChange={handleChangeRows}
              type="number"
              placeholder="4"
              min="2"
              max="10"
              className="w-32 border-2 rounded-2xl border-violet-500/40 bg-slate-800/60 backdrop-blur-md py-4 px-5 text-xl text-center text-violet-200 placeholder:text-violet-500/50 focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-500/20 transition-all shadow-lg shadow-violet-500/10 hover:border-violet-400/60 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>

        <button
          onClick={handleStartingGame}
          className="group relative px-10 py-4 text-xl font-bold text-white rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <div className="absolute inset-0 bg-linear-to-r from-rose-600 via-pink-600 to-violet-600 transition-transform duration-300 group-hover:scale-110"></div>
          <div className="absolute inset-0 bg-linear-to-r from-rose-500 via-pink-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute inset-0 shadow-[0_0_30px_rgba(168,85,247,0.4)] group-hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] transition-shadow duration-300"></div>
          <span className="relative flex items-center gap-2">
            Start the Game
            <Gamepad2 className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
          </span>
        </button>
      </div>
    </div>
  );
}

export default SelectBoardSize;
