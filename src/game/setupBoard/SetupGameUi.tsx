import { Brain } from 'lucide-react';
import { useState } from 'react';
import useGameStore from '../../store/gameStore';
import useSelectNumber from '../../store/selectNumbersStore';
import SetupGrid from './SetupGrid';
import SetupPanel from './SetupPanel';

function SetupGameUi() {
  const { numbers, setNumbers, selectedCells, setSelectedCells } =
    useSelectNumber();
  const { gameStatus, setGameStatus } = useGameStore();
  const [placedNumbers, setPlacedNumbers] = useState<Set<string | number>>(
    new Set()
  );

  const handleNumberPlaced = (num: string | number) => {
    setPlacedNumbers((prev) => new Set(prev).add(num));
  };

  const resetGame = () => {
    setGameStatus('gridSize');
    setNumbers([]);
    setPlacedNumbers(new Set());
    setSelectedCells({ start: null, end: null });
  };

  const goToMenu = () => {
    if (gameStatus === 'setupGrid' || numbers.length > 0) {
      if (
        confirm(
          'Are you sure you want to go back to the menu? Your progress will be lost.'
        )
      ) {
        resetGame();
      }
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-linear-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden p-4">
      <div className="absolute top-20 left-20 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse"></div>

      <div className="flex gap-6 items-start z-10 w-full max-w-7xl">
        {gameStatus === 'setupGrid' && (
          <SetupPanel
            placedNumbers={placedNumbers}
            setPlacedNumbers={setPlacedNumbers}
          />
        )}

        <div className="flex-1 flex flex-col gap-6 items-center">
          {/* Header */}
          <div className="flex items-center justify-between w-full">
            <button
              onClick={goToMenu}
              className="px-4 py-2 rounded-xl bg-slate-800/60 backdrop-blur-md border-2 border-slate-700/50 text-slate-300 hover:border-violet-500/50 hover:text-violet-300 transition-all flex items-center gap-2 hover:scale-105"
            >
              Menu
            </button>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Brain
                  className="w-10 h-10 text-rose-500 animate-pulse"
                  strokeWidth={2.5}
                />
                <div className="absolute inset-0 bg-rose-500/30 blur-xl rounded-full"></div>
              </div>
              <h1 className="text-4xl font-extrabold bg-linear-to-r from-rose-400 via-pink-400 to-violet-400 text-transparent bg-clip-text">
                Think then Link
              </h1>
            </div>
          </div>

          <SetupGrid onNumberPlaced={handleNumberPlaced} />

          <div className="text-slate-400 text-sm text-center max-w-md">
            {gameStatus === 'setupGrid' ? (
              selectedCells.start?.value ? (
                <div className="animate-pulse text-violet-300 font-semibold">
                  Click two cells on the grid to place "
                  {selectedCells.start.value}"
                </div>
              ) : (
                <div>
                  {numbers.length === 0
                    ? 'Add numbers to the list to begin setup'
                    : 'Select a number from the list, then place it on the grid'}
                </div>
              )
            ) : (
              <div className="flex flex-col gap-2">
                <div className="text-violet-300 font-semibold">
                  Click matching numbers to link them!
                </div>
                <div className="text-xs text-slate-500">
                  Create a path between matching numbers using adjacent cells
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
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

export default SetupGameUi;
