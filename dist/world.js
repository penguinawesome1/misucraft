import { imageMap } from './assetLoader.js';
import * as Constants from './constants.js';
import { mouse } from './input.js';
import { worldToScreen } from './isometric-transform.js';
import { isCollision2D } from './physics.js';
export class World {
    #worldChunks;
    #ctx;
    #hoverBlockIndex = null;
    #hoverBlockChunkPos = null;
    constructor(ctx) {
        this.#worldChunks = new Map();
        this.#ctx = ctx;
    }
    getChunkKey(position) {
        return `${position.x},${position.y}`;
    }
    getChunk(position) {
        return this.#worldChunks.get(this.getChunkKey(position));
    }
    setChunk(chunk) {
        this.#worldChunks.set(this.getChunkKey(chunk.position), chunk);
    }
    getBlock(chunk, position) {
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
    setBlock(chunk, position, blockValue) {
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
    makeChunks(distance, origin) {
        for (let x = origin.x - distance; x <= origin.x + distance; x++) {
            for (let y = origin.y - distance; y <= origin.y + distance; y++) {
                const position = { x, y };
                if (this.getChunk(position))
                    return;
                const blocks = new Uint16Array(Constants.CHUNK_VOLUME);
                const chunk = { position, blocks };
                this.#populateChunk(chunk, Constants.WORLD_MODE);
                this.setChunk(chunk);
            }
        }
    }
    #populateChunk(chunk, mode) {
        const blocks = chunk.blocks;
        const chunkX = chunk.position.x * Constants.CHUNK_SIZE;
        const chunkY = chunk.position.y * Constants.CHUNK_SIZE;
        for (let z = 0; z < Constants.CHUNK_HEIGHT; z++) {
            for (let y = 0; y < Constants.CHUNK_SIZE; y++) {
                for (let x = 0; x < Constants.CHUNK_SIZE; x++) {
                    const index = z * Constants.CHUNK_SIZE * Constants.CHUNK_SIZE +
                        y * Constants.CHUNK_SIZE + x;
                    const position = { x: chunkX + x, y: chunkY + y, z };
                    blocks[index] = this.#makeBlock(position, mode);
                }
            }
        }
    }
    #makeBlock(position, mode) {
        return 3 /* BlockType.MISSING */;
        if (mode === 'flat') {
            if (position.z < 3) {
                return 2 /* BlockType.DIRT */;
            }
            else if (position.z === 3) {
                return 1 /* BlockType.GRASS */;
            }
            else {
                return 0 /* BlockType.AIR */;
            }
        }
        else if (mode === 'skyblock') {
            if (position.z < 3) {
                return 2 /* BlockType.DIRT */;
            }
            else if (position.z === 3) {
                return 1 /* BlockType.GRASS */;
            }
            else {
                return 0 /* BlockType.AIR */;
            }
        }
        else { // 'normal'
            if (position.z < 3) {
                return 2 /* BlockType.DIRT */;
            }
            else if (position.z === 3) {
                return 1 /* BlockType.GRASS */;
            }
            else {
                return 0 /* BlockType.AIR */;
            }
        }
    }
    renderChunks(distance, origin) {
        for (let x = origin.x - distance; x <= origin.x + distance; x++) {
            for (let y = origin.y - distance; y <= origin.y + distance; y++) {
                const chunk = this.getChunk({ x, y });
                if (!chunk)
                    continue;
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
    }
    ;
    updateHoverBlockInfo(distance, origin) {
        this.#hoverBlockIndex = null;
        this.#hoverBlockChunkPos = null;
        for (let x = origin.x - distance; x <= origin.x + distance; x++) {
            for (let y = origin.y - distance; y <= origin.y + distance; y++) {
                const chunk = this.getChunk({ x, y });
                if (!chunk)
                    continue;
                const chunkPos = chunk.position;
                for (let i = 0; i < Constants.CHUNK_VOLUME; i++) {
                    if (chunk.blocks[i] == 0 /* BlockType.AIR */)
                        continue;
                    const screenPos = worldToScreen(this.#indexToWorld(i, chunkPos));
                    const blockScreenHitbox = {
                        x: screenPos.x,
                        y: screenPos.y - screenPos.z,
                        width: Constants.TILE_WIDTH,
                        height: Constants.TILE_HEIGHT
                    };
                    const mousePos = mouse.offsetPosition;
                    const mouseHitbox = { x: mousePos.x, y: mousePos.y, width: 0, height: 0 };
                    if (isCollision2D(blockScreenHitbox, mouseHitbox)) {
                        this.#hoverBlockIndex = i;
                        this.#hoverBlockChunkPos = { x, y };
                    }
                }
            }
        }
        // console.log(this.#hoverBlockIndex, this.#hoverBlockChunkPos);
    }
    #indexToWorld(index, chunkPos) {
        const z = Math.floor(index / (Constants.CHUNK_SIZE * Constants.CHUNK_SIZE));
        const remainderAfterZ = index % (Constants.CHUNK_SIZE * Constants.CHUNK_SIZE);
        const y = Math.floor(remainderAfterZ / Constants.CHUNK_SIZE);
        const x = remainderAfterZ % Constants.CHUNK_SIZE;
        return {
            x: chunkPos.x * Constants.CHUNK_SIZE + x,
            y: chunkPos.y * Constants.CHUNK_SIZE + y,
            z,
        };
    }
    #drawBlock(id, position) {
        if (id === 0 /* BlockType.AIR */)
            return;
        let image = imageMap[id];
        if (!(image instanceof HTMLImageElement)) {
            console.warn(`Image for block ID ${id} is not loaded yet or is invalid.`);
            return;
        }
        this.#ctx.drawImage(image, position.x, position.y - position.z, Constants.TILE_WIDTH, Constants.TILE_HEIGHT);
    }
}
