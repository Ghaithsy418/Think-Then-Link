import { colors } from './colors';

export const getThemeClasses = (
  val: number | null,
  isActive: boolean,
  isEndpoint: boolean,
  isPossibleMove: boolean,
  selectedCellValue: number | undefined,
  lastNumber: boolean | undefined
) => {
  const theme = colors[val ?? 1] || colors[1];
  const base = `bg-gradient-to-br ${theme}`;

  if (lastNumber) return `${base} animate-bounce`;

  if (val === null) {
    return ` ${isPossibleMove && selectedCellValue ? `bg-gradient-to-br ${colors[selectedCellValue]} opacity-50` : 'bg-gradient-to-br from-slate-700/80 to-slate-800/80 border-violet-500/10 hover:border-violet-400/30'}`;
  }

  if (isEndpoint) {
    return `${base} ring-4 ring-white/20 scale-105 z-10 font-bold opacity-100`;
  }

  if (isActive) {
    return `${base} opacity-100 scale-100 shadow-lg`;
  }

  return `${base} opacity-80 hover:opacity-100`;
};
