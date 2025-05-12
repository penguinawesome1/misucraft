import { TILE_HEIGHT, TILE_WIDTH } from './constants.js';
import { ctx } from './viewport.js';
let imageMap = {};
let imagesLoaded = false;
async function loadAllImagesObjects() {
    const imageDefinitions = [
        { src: `../public/img/tiles/tile_021.png`, id: 2 /* BlockType.DIRT */ },
        { src: `../public/img/tiles/tile_023.png`, id: 1 /* BlockType.GRASS */ },
    ];
    const loadImage = (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    };
    for (const { src, id } of imageDefinitions) {
        imageMap[id] = await loadImage(src);
    }
    imagesLoaded = true;
}
loadAllImagesObjects();
export function drawPlayer(params) {
    const cropbox = {
        position: {
            x: params.frame * (params.image.width / params.frameCount),
            y: params.image.height,
        },
        width: params.image.width / params.frameCount,
        height: params.image.height,
    };
    ctx.drawImage(params.image, cropbox.position.x, cropbox.position.y, cropbox.width, cropbox.height, params.hitbox.x, params.hitbox.y - params.hitbox.z, params.hitbox.width, params.hitbox.height);
}
export function displayBlock(id, position) {
    if (id === 0 /* BlockType.AIR */ || !imagesLoaded)
        return;
    ctx.drawImage(imageMap[id], position.x, position.y - position.z, TILE_WIDTH, TILE_HEIGHT);
}
// class Renderer {
//   constructor({gameManager, world, zoom}) {
//     this.gameManager = gameManager;
//     this.zoom = zoom;
//     this.scaledCanvas = this.getScaledCanvas();
//     this.mouse = {
//       screenPosition: {x: 0, y: 0},
//       worldPosition: {x: 0, y: 0},
//     };
//     this.resizeCanvas();
//     window.addEventListener('resize', () => this.resizeCanvas());
//     this.setupImages();
//   }
//   async setupImages() {
//     this.imageMap = [];
//     this.imagesLoaded = false;
//     await this.loadAllImagesObjects();
//     this.imagesLoaded = true;
//   }
//   setInitialCameraPosition(player) {
//     this.camera = {
//       position: {
//         x: -player.position.x + this.scaledCanvas.width / 2,
//         y: -player.position.y + this.scaledCanvas.height / 2,
//       },
//     };
//   }
//   getScaledCanvas() {
//     const zoom = this.zoom;
//     return {
//       scale: zoom,
//       width: this.canvas.width / zoom,
//       height: this.canvas.height / zoom,
//     };
//   }
//   resizeCanvas() {
//     this.canvas.width = window.innerWidth;
//     this.canvas.height = window.innerHeight;
//     this.scaledCanvas = this.getScaledCanvas();
//   }
//   draw({blockNum, position}) {
//     if (blockNum === Renderer.AIR || !this.imagesLoaded) return;
//     this.c.drawImage(
//         this.imageMap[blockNum], position.x, position.y - position.z / 2, 32,
//         32);
//   }
//   animate() {
//     window.requestAnimationFrame(() => this.animate());
//     this.updateMouse();
//     if (this.gameManager.pause) return;
//     this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);
//     this.c.save();
//     this.c.scale(this.scaledCanvas.scale, this.scaledCanvas.scale);
//     this.c.translate(this.camera.position.x, this.camera.position.y);
//     this.world.update();
//     this.c.restore();
//   }
//   updateMouse(
//       x = this.mouse.screenPosition.x, y = this.mouse.screenPosition.y) {
//     this.mouse.screenPosition.x = x;
//     this.mouse.screenPosition.y = y;
//     const {x: cameraX, y: cameraY} = this.camera.position;
//     const scale = this.scaledCanvas.scale;
//     this.mouse.worldPosition.x = x / scale - cameraX;
//     this.mouse.worldPosition.y = y / scale - cameraY;
//   }
//   handleZoom(delta) {
//     const {x: cameraX, y: cameraY} = this.camera.position;
//     let {width: canvasWidth, height: canvasHeight} = this.scaledCanvas;
//     const originalCenterX = cameraX + canvasWidth / 2;
//     const originalCenterY = cameraY + canvasHeight / 2;
//     this.zoom =
//         Math.max(1.2, Math.min(2.8, this.zoom - delta * 0.1));  // Clamp zoom
//     this.scaledCanvas = this.getScaledCanvas();
//     ({width: canvasWidth, height: canvasHeight} = this.scaledCanvas);
//     const newCenterX = cameraX + canvasWidth / 2;
//     const newCenterY = cameraY + canvasHeight / 2;
//     const offsetX = originalCenterX - newCenterX;
//     const offsetY = originalCenterY - newCenterY;
//     this.camera.position.x -= offsetX;
//     this.camera.position.y -= offsetY;
//   }
//   panCamera(player) {
//     const {x: cameraX, y: cameraY} = this.camera.position;
//     const {width: canvasWidth, height: canvasHeight} = this.scaledCanvas;
//     const {x: boxX, y: boxY} = player.cameraBox.position;
//     const {width: boxWidth, height: boxHeight} = player.cameraBox;
//     const leftBoundary = -cameraX;
//     const rightBoundary = -cameraX + canvasWidth - boxWidth;
//     const topBoundary = -cameraY;
//     const bottomBoundary = -cameraY + canvasHeight - boxHeight;
//     if (boxX < leftBoundary) {
//       this.camera.position.x = -boxX;
//     } else if (boxX > rightBoundary) {
//       this.camera.position.x = -boxX + canvasWidth - boxWidth;
//     }
//     if (boxY < topBoundary) {
//       this.camera.position.y = -boxY;
//     } else if (boxY > bottomBoundary) {
//       this.camera.position.y = -boxY + canvasHeight - boxHeight;
//     }
//   }
// }
