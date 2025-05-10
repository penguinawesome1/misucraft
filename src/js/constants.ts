type GameMode = 'creative'|'survival'|'spectator';
type WorldMode = 'normal'|'flat'|'skyblock';

const isValidGameMode = (mode: string|null): mode is GameMode =>
    mode !== null &&
    (mode === 'creative' || mode === 'survival' || mode === 'spectator');

const isValidWorldMode = (mode: string|null): mode is WorldMode =>
    mode !== null &&
    (mode === 'normal' || mode === 'flat' || mode === 'skyblock');

const getGameMode = (): GameMode => {
  const stored = localStorage.getItem('gamemode');
  return isValidGameMode(stored) ? stored : 'creative';
};

const getWorldMode = (): WorldMode => {
  const stored = localStorage.getItem('worldmode');
  return isValidWorldMode(stored) ? stored : 'normal';
};

export const GAME_MODE = getGameMode();
export const WORLD_MODE = getWorldMode();
export const MAX_HEALTH = 3;
export const VOID_DEPTH = -10;
export const INVINCIBLE_DURATION = 500;
export const PLAYER_SPEED = 0.35;
export const JUMP_STRENGTH = 5;
export const TILE_WIDTH = 32;
export const TILE_HEIGHT = 32;
export const CHUNK_SIZE = 16;
export const FRICTION_MULTIPLIER = 0.8;
export const GRAVITY = 0.3;