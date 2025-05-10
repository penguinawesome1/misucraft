import {BlockType, CHUNK_HEIGHT, CHUNK_SIZE, CHUNK_VOLUME, WORLD_MODE} from './constants';
import {worldToScreen} from './isometric-transform';
import {Position2D, Position3D} from './physics';
import {displayBlock} from './renderer';

type Chunk = {
  readonly position: Position2D; blocks: Uint16Array;
}

export class World {
  #worldChunks: Map<string, Chunk>;

  constructor() {
    this.#worldChunks = new Map();
  }

  getChunkKey(position: Position2D): string {
    return `${position.x},${position.y}`;
  }

  getChunk(position: Position2D): Chunk|undefined {
    return this.#worldChunks.get(this.getChunkKey(position));
  }
  setChunk(chunk: Chunk) {
    this.#worldChunks.set(this.getChunkKey(chunk.position), chunk);
  }

  getBlock(chunk: Chunk, position: Position3D): number|undefined {
    if (position.x < 0 || position.x >= CHUNK_SIZE || position.y < 0 ||
        position.y >= CHUNK_SIZE || position.z < 0 ||
        position.z >= CHUNK_HEIGHT) {
      console.warn('Local block coordinates are out of bounds.');
      return undefined;
    }

    const index = position.z * CHUNK_SIZE * CHUNK_SIZE +
        position.y * CHUNK_SIZE + position.x;
    return chunk.blocks[index];
  }

  setBlock(chunk: Chunk, position: Position3D, blockValue: number): void {
    if (position.x < 0 || position.x >= CHUNK_SIZE || position.y < 0 ||
        position.y >= CHUNK_SIZE || position.z < 0 ||
        position.z >= CHUNK_HEIGHT) {
      console.warn('Local block coordinates are out of bounds.');
      return;
    }

    const index = position.z * CHUNK_SIZE * CHUNK_SIZE +
        position.y * CHUNK_SIZE + position.x;
    chunk.blocks[index] = blockValue;
  }

  makeChunks(distance: number, origin: Position2D) {
    for (let x = origin.x - distance; x <= origin.x + distance; x++) {
      for (let y = origin.y - distance; y <= origin.y + distance; y++) {
        const position = {x, y};

        if (this.getChunk(position)) return;

        const blocks = new Uint16Array(CHUNK_VOLUME);
        const chunk = {position, blocks};

        this.populateChunk(chunk, WORLD_MODE);
        this.setChunk(chunk);
      }
    }
  }

  populateChunk(chunk: Chunk, mode: string): void {
    const blocks = chunk.blocks;
    const chunkX = chunk.position.x * CHUNK_SIZE;
    const chunkY = chunk.position.y * CHUNK_SIZE;

    for (let z = 0; z < CHUNK_HEIGHT; z++) {
      for (let y = 0; y < CHUNK_SIZE; y++) {
        for (let x = 0; x < CHUNK_SIZE; x++) {
          const index = z * CHUNK_SIZE * CHUNK_SIZE + y * CHUNK_SIZE + x;
          const position: Position3D = {x: chunkX + x, y: chunkY + y, z};
          blocks[index] = this.makeBlock(position, mode);
        }
      }
    }
  }

  makeBlock(position: Position3D, mode: string) {
    if (mode === 'flat') {
      if (position.z < 20) {
        return BlockType.DIRT;
      } else if (position.z === 20) {
        return BlockType.GRASS;
      } else {
        return BlockType.AIR;
      }
    } else if (mode === 'skyblock') {
      if (position.z < 20) {
        return BlockType.DIRT;
      } else if (position.z === 20) {
        return BlockType.GRASS;
      } else {
        return BlockType.AIR;
      }
    } else {  // 'normal'
      if (position.z < 20) {
        return BlockType.DIRT;
      } else if (position.z === 20) {
        return BlockType.GRASS;
      } else {
        return BlockType.AIR;
      }
    }
  }

  renderChunks(distance: number, origin: Position2D) {
    for (let x = origin.x - distance; x <= origin.x + distance; x++) {
      for (let y = origin.y - distance; y <= origin.y + distance; y++) {
        const chunk = this.getChunk({x, y});
        if (!chunk) continue;
        const chunkPos = chunk.position;

        for (let i = 0; i < CHUNK_VOLUME; i++) {
          const screenPosition = worldToScreen(this.indexToWorld(i, chunkPos));
          displayBlock(chunk.blocks[i], screenPosition);
        }
      }
    }
  };

  indexToWorld(index: number, chunkPos: Position2D) {
    const z = Math.floor(index / (CHUNK_SIZE * CHUNK_SIZE));
    const remainderAfterZ = index % (CHUNK_SIZE * CHUNK_SIZE);
    const y = Math.floor(remainderAfterZ / CHUNK_SIZE);
    const x = remainderAfterZ % CHUNK_SIZE;

    return {
      x: chunkPos.x * CHUNK_SIZE + x,
      y: chunkPos.y * CHUNK_SIZE + y,
      z,
    };
  }
}