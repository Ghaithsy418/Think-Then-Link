import { Play, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { useState, type Dispatch, type SetStateAction } from 'react';
import useGameStore from '../../store/gameStore';
import useSelectNumber from '../../store/selectNumbersStore';

interface SetupPanelProps {
  placedNumbers: Set<string | number>;
  setPlacedNumbers: Dispatch<SetStateAction<Set<string | number>>>;
}

function SetupPanel({ placedNumbers, setPlacedNumbers }: SetupPanelProps) {
  const [newNumberValue, setNewNumberValue] = useState('');
  const { startGame, grid, setFirstGridState } = useGameStore((state) => state);
  const { numbers, setNumbers, selectedCells, setSelectedCells } =
    useSelectNumber();

  const handleStart = () => {
    startGame();
    setFirstGridState(grid)
  }

  const resetSetup = () => {
    setPlacedNumbers(new Set());
    setSelectedCells({ start: null, end: null });
  };

  const addNumber = () => {
    const trimmedValue = newNumberValue.trim();
    if (trimmedValue && !numbers.includes(Number(trimmedValue))) {
      setNumbers(Number(trimmedValue));
      setNewNumberValue('');
    }
  };

  const removeNumber = (num: string | number) => {
    setNumbers(numbers.filter((n) => n !== num));
    setPlacedNumbers((prev) => {
      const newSet = new Set(prev);
      newSet.delete(num);
      return newSet;
    });

    if (selectedCells.start?.value === num) {
      setSelectedCells({ start: null, end: null });
    }
  };

  const selectNumberForStart = (num: string | number) => {
    if (placedNumbers.has(num)) {
      alert('This number has already been placed on the grid!');
      return;
    }

    setSelectedCells({
      start: { index: -1, value: num as number | null },
      end: null,
    });
  };

  return (
    <div className="flex flex-col gap-4 w-100 animate-in slide-in-from-left duration-500">
      <div className="p-6 rounded-3xl bg-slate-800/60 backdrop-blur-md border-2 border-violet-500/40 shadow-2xl shadow-violet-500/20">
        <h2 className="text-2xl font-bold text-violet-300 mb-4 flex items-center gap-2">
          <Plus className="w-6 h-6" />
          Add Numbers
        </h2>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newNumberValue}
            onChange={(e) => setNewNumberValue(e.target.value)}
            placeholder="Enter number"
            className="flex-1 border-2 rounded-xl border-violet-500/40 bg-slate-900/60 backdrop-blur-md py-2 px-4 text-violet-200 placeholder:text-violet-500/50 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 transition-all"
            onKeyDown={(e) => e.key === 'Enter' && addNumber()}
          />
          <button
            onClick={addNumber}
            disabled={!newNumberValue.trim()}
            className="px-4 py-2 rounded-xl bg-linear-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto custom-scrollbar">
          {numbers.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              No numbers added yet
            </div>
          ) : (
            numbers.map((num, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all
                        ${placedNumbers.has(num)
                    ? 'bg-green-900/30 border-green-500/50'
                    : 'bg-slate-900/60 border-violet-500/30 group hover:border-violet-400/60'
                  }`}
              >
                <span
                  className={`font-semibold ${placedNumbers.has(num) ? 'text-green-300' : 'text-violet-300'}`}
                >
                  {num} {placedNumbers.has(num) && '✓'}
                </span>
                <button
                  onClick={() => removeNumber(num)}
                  className="text-rose-400 hover:text-rose-300 transition-colors"
                  title="Remove number"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-slate-800/60 backdrop-blur-md border-2 border-violet-500/40 shadow-2xl shadow-violet-500/20">
        <h3 className="text-lg font-bold text-violet-300 mb-3">
          How to Place:
        </h3>
        <ol className="text-sm text-slate-300 space-y-2">
          <li className="flex items-start gap-2">
            <span className="font-bold text-violet-400">1.</span>
            <span>Click a number from the list above</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-violet-400">2.</span>
            <span>Click a cell for START position</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-violet-400">3.</span>
            <span>Click another cell for END position</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-violet-400">4.</span>
            <span>Repeat for all numbers</span>
          </li>
        </ol>

        {selectedCells.start?.value && (
          <div className="mt-4 p-3 rounded-xl bg-violet-500/20 border border-violet-400/50 animate-in fade-in duration-300">
            <p className="text-sm text-violet-200 font-semibold mb-2">
              Selected:{' '}
              <span className="text-lg text-violet-100">
                {selectedCells.start.value}
              </span>
            </p>
            <p className="text-xs text-slate-300">
              Now click two cells on the grid to place this number
            </p>
          </div>
        )}

        {!selectedCells.start?.value && numbers.length > 0 && (
          <div className="mt-4 p-3 rounded-xl bg-blue-500/20 border border-blue-400/50">
            <p className="text-sm text-blue-200 font-semibold mb-2">
              Select a number to place:
            </p>
            <div className="flex flex-wrap gap-2">
              {numbers
                .filter((num) => !placedNumbers.has(num))
                .map((num, idx) => (
                  <button
                    key={idx}
                    onClick={() => selectNumberForStart(num)}
                    className="px-3 py-1 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold transition-all hover:scale-105"
                  >
                    {num}
                  </button>
                ))}
            </div>
            {numbers.filter((num) => !placedNumbers.has(num)).length === 0 && (
              <p className="text-xs text-green-300 mt-2">
                All numbers placed! ✓
              </p>
            )}
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <button
            onClick={resetSetup}
            className="flex-1 px-4 py-2 rounded-xl bg-slate-700/60 hover:bg-slate-600/60 text-slate-300 transition-all flex items-center justify-center gap-2 hover:scale-105"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={handleStart}
            disabled={
              placedNumbers.size !== numbers.length || numbers.length === 0
            }
            className="flex-1 px-4 py-2 rounded-xl bg-linear-to-r from-rose-600 to-violet-600 hover:from-rose-500 hover:to-violet-500 text-white font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
          >
            <Play className="w-4 h-4" />
            Start
          </button>
        </div>

        {numbers.length > 0 && (
          <div className="mt-3 text-xs text-slate-400 text-center">
            {placedNumbers.size}/{numbers.length} numbers placed
          </div>
        )}
      </div>
    </div>
  );
}

export default SetupPanel;
