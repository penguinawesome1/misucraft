import './input.js';
import {Player} from './player.js';
import {World} from './world.js';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

export const player = new Player(1, [
  {name: 'Idle', imageSrc: '../public/img/player.png', fps: 0, frameCount: 1}
]);

export const world = new World();

const animate = () => {
  window.requestAnimationFrame(animate);
  // this.updateMouse();
  // if (this.gameManager.pause) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  // ctx.scale(this.scaledCanvas.scale, this.scaledCanvas.scale);
  // ctx.translate(this.camera.position.x, this.camera.position.y);

  // this.world.update();
  world.makeChunks(3, {x: 0, y: 0});
  world.renderChunks(3, {x: 0, y: 0});

  // player.update();

  ctx.restore();
};

animate();