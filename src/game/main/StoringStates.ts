import type GameState from '../gameState';

export const allGameStates = new Set<GameState>();

export function addNewState(newValue: GameState) {
  allGameStates.add(newValue);
}
