"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GRAVITY = exports.FRICTION_MULTIPLIER = exports.CHUNK_SIZE = exports.TILE_HEIGHT = exports.TILE_WIDTH = exports.JUMP_STRENGTH = exports.PLAYER_SPEED = exports.INVINCIBLE_DURATION = exports.VOID_DEPTH = exports.MAX_HEALTH = exports.WORLD_MODE = exports.GAME_MODE = void 0;
const isValidGameMode = (mode) => mode !== null &&
    (mode === 'creative' || mode === 'survival' || mode === 'spectator');
const isValidWorldMode = (mode) => mode !== null &&
    (mode === 'normal' || mode === 'flat' || mode === 'skyblock');
const getGameMode = () => {
    const stored = localStorage.getItem('gamemode');
    return isValidGameMode(stored) ? stored : 'creative';
};
const getWorldMode = () => {
    const stored = localStorage.getItem('worldmode');
    return isValidWorldMode(stored) ? stored : 'normal';
};
exports.GAME_MODE = getGameMode();
exports.WORLD_MODE = getWorldMode();
exports.MAX_HEALTH = 3;
exports.VOID_DEPTH = -10;
exports.INVINCIBLE_DURATION = 500;
exports.PLAYER_SPEED = 0.35;
exports.JUMP_STRENGTH = 5;
exports.TILE_WIDTH = 32;
exports.TILE_HEIGHT = 32;
exports.CHUNK_SIZE = 16;
exports.FRICTION_MULTIPLIER = 0.8;
exports.GRAVITY = 0.3;
