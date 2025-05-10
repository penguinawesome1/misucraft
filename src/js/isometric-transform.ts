import {TILE_HEIGHT, TILE_WIDTH} from './constants.js';
import {Position3D} from './physics.js';

// --- Configuration ---
const HALF_TILE_WIDTH = 0.5 * TILE_WIDTH;
const HALF_TILE_HEIGHT = 0.5 * TILE_HEIGHT;

// --- Transformation Matrix Components ---
const isoMatrix = {
  xToScreenX: 1 * HALF_TILE_WIDTH,
  xToScreenY: 0.5 * HALF_TILE_HEIGHT,
  yToScreenX: -1 * HALF_TILE_WIDTH,
  yToScreenY: 0.5 * HALF_TILE_HEIGHT,
  zToScreenZ: HALF_TILE_HEIGHT,
};

// --- Pre-calculate Inverse for toGridCoordinate ---
const det = isoMatrix.xToScreenX * isoMatrix.yToScreenY -
    isoMatrix.yToScreenX * isoMatrix.xToScreenY;

let invDet: number;
let invMatrix: {a: number; b: number; c: number; d: number;};

invDet = 1 / det;
invMatrix = {
  a: invDet * isoMatrix.yToScreenY,   // inv_a
  b: invDet * -isoMatrix.yToScreenX,  // inv_b
  c: invDet * -isoMatrix.xToScreenY,  // inv_c
  d: invDet * isoMatrix.xToScreenX,   // inv_d
};

export function worldToScreen(worldPos: Position3D): Position3D {
  return {
    x: worldPos.x * isoMatrix.xToScreenX + worldPos.y * isoMatrix.yToScreenX,
    y: worldPos.x * isoMatrix.xToScreenY + worldPos.y * isoMatrix.yToScreenY,
    z: worldPos.z * isoMatrix.zToScreenZ,
  };
}

export function screenToWorld(screenPos: Position3D): Position3D {
  const worldX = screenPos.x * invMatrix.a + screenPos.y * invMatrix.b;
  const worldY = screenPos.x * invMatrix.c + screenPos.y * invMatrix.d;
  const worldZ =
      isoMatrix.zToScreenZ === 0 ? 0 : screenPos.z / isoMatrix.zToScreenZ;

  return {
    x: Math.round(worldX),
    y: Math.round(worldY),
    z: Math.round(worldZ),
  };
}