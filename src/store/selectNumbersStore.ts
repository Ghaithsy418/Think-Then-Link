import { create } from 'zustand';

interface SelectedCells {
  start: { index: number; value?: number | null } | null;
  end: number | null;
}

export type NumbersForSolvingType = { row: number; col: number; value: number };

interface SelectNumberTypes {
  numbers: number[];
  numbersForSolving: NumbersForSolvingType[];
  setNumbers: (value: number | number[]) => void;
  selectedCells: SelectedCells;
  setNumbersForSolving: (value: NumbersForSolvingType) => void;
  setSelectedCells: (value: SelectedCells) => void;
}

const useSelectNumber = create<SelectNumberTypes>((set) => ({
  numbers: [],
  numbersForSolving: [],
  setNumbers: (value) =>
    set((state) => ({
      numbers:
        typeof value === 'number' ? [...state.numbers, value] : [...value],
    })),
  setNumbersForSolving: (newValue) =>
    set((state) => ({
      numbersForSolving: [...state.numbersForSolving, newValue],
    })),
  selectedCells: {
    start: null,
    end: null,
  },
  setSelectedCells: (value) => set({ selectedCells: value }),
}));

export default useSelectNumber;
