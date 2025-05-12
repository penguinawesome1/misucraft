import {BlockType, imageMap} from './assetLoader.js';
import * as Constants from './constants.js';
import {mouse} from './input.js';
import {worldToScreen} from './isometric-transform.js';
import {Hitbox2D, isCollision2D, Position2D, Position3D} from './physics.js';

type Chunk = {
  readonly position: Position2D; blocks: Uint16Array;
}

export class World {
  #worldChunks: Map<string, Chunk>;
  #ctx: CanvasRenderingContext2D;
  #hoverBlockIndex: number|null = null;
  #hoverBlockChunkPos: Position2D|null = null;

  constructor(ctx: CanvasRenderingContext2D) {
    this.#worldChunks = new Map();
    this.#ctx = ctx;
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
    if (position.x < 0 || position.x >= Constants.CHUNK_SIZE ||
        position.y < 0 || position.y >= Constants.CHUNK_SIZE ||
        position.z < 0 || position.z >= Constants.CHUNK_HEIGHT) {
      console.warn('Local block coordinates are out of bounds.');
      return undefined;
    }

    const index = position.z * Constants.CHUNK_SIZE * Constants.CHUNK_SIZE +
        position.y * Constants.CHUNK_SIZE + position.x;
    return chunk.blocks[index];
  }

  setBlock(chunk: Chunk, position: Position3D, blockValue: number): void {
    if (position.x < 0 || position.x >= Constants.CHUNK_SIZE ||
        position.y < 0 || position.y >= Constants.CHUNK_SIZE ||
        position.z < 0 || position.z >= Constants.CHUNK_HEIGHT) {
      console.warn('Local block coordinates are out of bounds.');
      return;
    }

    const index = position.z * Constants.CHUNK_SIZE * Constants.CHUNK_SIZE +
        position.y * Constants.CHUNK_SIZE + position.x;
    chunk.blocks[index] = blockValue;
  }

  makeChunks(distance: number, origin: Position2D) {
    for (let x = origin.x - distance; x <= origin.x + distance; x++) {
      for (let y = origin.y - distance; y <= origin.y + distance; y++) {
        const position = {x, y};

        if (this.getChunk(position)) return;

        const blocks = new Uint16Array(Constants.CHUNK_VOLUME);
        const chunk = {position, blocks};

        this.#populateChunk(chunk, Constants.WORLD_MODE);
        this.setChunk(chunk);
      }
    }
  }

  #populateChunk(chunk: Chunk, mode: string): void {
    const blocks = chunk.blocks;
    const chunkX = chunk.position.x * Constants.CHUNK_SIZE;
    const chunkY = chunk.position.y * Constants.CHUNK_SIZE;

    for (let z = 0; z < Constants.CHUNK_HEIGHT; z++) {
      for (let y = 0; y < Constants.CHUNK_SIZE; y++) {
        for (let x = 0; x < Constants.CHUNK_SIZE; x++) {
          const index = z * Constants.CHUNK_SIZE * Constants.CHUNK_SIZE +
              y * Constants.CHUNK_SIZE + x;
          const position: Position3D = {x: chunkX + x, y: chunkY + y, z};
          blocks[index] = this.#makeBlock(position, mode);
        }
      }
    }
  }

  #makeBlock(position: Position3D, mode: string) {
    return BlockType.MISSING;
    if (mode === 'flat') {
      if (position.z < 3) {
        return BlockType.DIRT;
      } else if (position.z === 3) {
        return BlockType.GRASS;
      } else {
        return BlockType.AIR;
      }
    } else if (mode === 'skyblock') {
      if (position.z < 3) {
        return BlockType.DIRT;
      } else if (position.z === 3) {
        return BlockType.GRASS;
      } else {
        return BlockType.AIR;
      }
    } else {  // 'normal'
      if (position.z < 3) {
        return BlockType.DIRT;
      } else if (position.z === 3) {
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

        for (let i = 0; i < Constants.CHUNK_VOLUME; i++) {
          const position = worldToScreen(this.#indexToWorld(i, chunkPos));
          const blockType = chunk.blocks[i];

          const hoverChunkPos = this.#hoverBlockChunkPos;

          if (i === this.#hoverBlockIndex && hoverChunkPos &&
              chunkPos.x === hoverChunkPos.x &&
              chunkPos.y === hoverChunkPos.y) {
            position.z += Constants.HOVER_HEIGHT;
          }

          this.#drawBlock(blockType, position);
        }
      }
    }
  };

  updateHoverBlockInfo(distance: number, origin: Position2D) {
    this.#hoverBlockIndex = null;
    this.#hoverBlockChunkPos = null;

    for (let x = origin.x - distance; x <= origin.x + distance; x++) {
      for (let y = origin.y - distance; y <= origin.y + distance; y++) {
        const chunk = this.getChunk({x, y});
        if (!chunk) continue;
        const chunkPos = chunk.position;

        for (let i = 0; i < Constants.CHUNK_VOLUME; i++) {
          if (chunk.blocks[i] == BlockType.AIR) continue;

          const screenPos = worldToScreen(this.#indexToWorld(i, chunkPos));
          const blockScreenHitbox: Hitbox2D = {
            x: screenPos.x,
            y: screenPos.y - screenPos.z,
            width: Constants.TILE_WIDTH,
            height: Constants.TILE_HEIGHT
          };

          const mousePos = mouse.offsetPosition;
          const mouseHitbox:
              Hitbox2D = {x: mousePos.x, y: mousePos.y, width: 0, height: 0};

          if (isCollision2D(blockScreenHitbox, mouseHitbox)) {
            this.#hoverBlockIndex = i;
            this.#hoverBlockChunkPos = {x, y};
          }
        }
      }
    }

    // console.log(this.#hoverBlockIndex, this.#hoverBlockChunkPos);
  }

  #indexToWorld(index: number, chunkPos: Position2D): Position3D {
    const z = Math.floor(index / (Constants.CHUNK_SIZE * Constants.CHUNK_SIZE));
    const remainderAfterZ =
        index % (Constants.CHUNK_SIZE * Constants.CHUNK_SIZE);
    const y = Math.floor(remainderAfterZ / Constants.CHUNK_SIZE);
    const x = remainderAfterZ % Constants.CHUNK_SIZE;

    return {
      x: chunkPos.x * Constants.CHUNK_SIZE + x,
      y: chunkPos.y * Constants.CHUNK_SIZE + y,
      z,
    };
  }

  #drawBlock(id: BlockType, position: Position3D) {
    if (id === BlockType.AIR) return;

    let image = imageMap[id];
    if (!(image instanceof HTMLImageElement)) {
      console.warn(`Image for block ID ${id} is not loaded yet or is invalid.`);
      return;
    }

    this.#ctx.drawImage(
        image, position.x, position.y - position.z, Constants.TILE_WIDTH,
        Constants.TILE_HEIGHT);
  }
}