"use strict";
// const update = () => {
//   const {renderDistance, hoverBlock} = this;
//   const {x: playerChunkX, y: playerChunkY} = this.player.chunkPosition;
//   let newHoverBlock = null;
//   this.playerDrawn = false;
//   const minChunkX = playerChunkX - renderDistance;
//   const maxChunkX = playerChunkX + renderDistance;
//   const minChunkY = playerChunkY - renderDistance;
//   const maxChunkY = playerChunkY + renderDistance;
//   for (let chunkX = minChunkX; chunkX <= maxChunkX; chunkX++) {
//     for (let chunkY = minChunkY; chunkY <= maxChunkY; chunkY++) {
//       const chunk = this.chunkMap[`${chunkX},${chunkY}`];
//       if (!chunk) {
//         // generate any chunks that are missing
//         if (this.worldMode === 'default') this.generateOneChunk(chunkX,
//         chunkY); if (this.worldMode === 'flat')
//           this.generateOneChunkFlat(chunkX, chunkY);
//         if (this.worldMode === 'skyblock')
//           this.generateOneChunkAir(chunkX, chunkY);
//         continue;
//       }
//       for (let i = 0; i < chunk.length; i++) {
//         const block = chunk[i];
//         if (block === hoverBlock && this.isDeleteBlock) {
//           this.saveChunk(chunkX, chunkY);
//           this.updateVisibility(chunk);
//           this.isDeleteBlock = false;
//         }
//         // visually update blocks, place any if needed, load people when
//         needed if (this.tryToPlace(block)) {
//           this.saveChunk(chunkX, chunkY);
//           this.updateVisibility(chunk);
//         }
//         this.tryToUpdateLife(block);
//         if (block.visible) {
//           this.renderer.draw({
//             blockNum: block.blockNum,
//             position: block.position,
//           });
//         }
//         // changes hoverBlock up to last searched block in chunk
//         const shouldAccountForHover = block === this.hoverBlock;
//         if (block.blockNum !== Renderer.AIR &&
//             collisionCursor(block, shouldAccountForHover)) {
//           newHoverBlock = block;
//         }
//       }
//     }
//   }
//   this.clearOldHover();
//   this.setNewHover(newHoverBlock);
//   this.tryToAddZombie();
//   this.addBlockNum = null;
//   if (!this.playerDrawn) this.player.draw();
//   this.player.update();
// };
// function*
//     generateSpiral(centerX: number, centerY: number, maxDistance: number =
//     5):
//         Generator<{x: number; y: number}, void, unknown> {
//   let x = centerX, y = centerY;
//   let dx = 0, dy = -1;  // Start moving upwards
//   yield {x, y};
//   let limit = 1, steps = 0, turn = 0;
//   while (limit <= 2 * maxDistance) {
//     x += dx;
//     y += dy;
//     steps++;
//     yield {x, y};
//     if (steps === limit) {
//       steps = 0;
//       turn++;
//       [dx, dy] = [-dy, dx];
//       if (turn % 2 === 0) limit++;
//     }
//   }
// }
// for (const chunk of generateSpiralConcise(
//          playerChunkX, playerChunkY, renderDistance)) {
