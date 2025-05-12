import {initListeners, isPaused} from './input.js';
import {Player} from './player.js';
import {Viewport} from './viewport.js';
import {World} from './world.js';

export const viewport = new Viewport();

export const player = new Player(viewport.ctx, 1, {
  idle: {imageSrc: './img/player.png', fps: 0, frameCount: 1},
  run: {imageSrc: './img/player.png', fps: 0, frameCount: 1}
});

export const world = new World(viewport.ctx);

world.makeChunks(1, {x: 0, y: 0});

initListeners(viewport, player, world);

const animate = () => {
  window.requestAnimationFrame(animate);
  if (isPaused) return;

  const {canvas, scale, position, ctx} = viewport;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.scale(scale, scale);
  ctx.translate(position.x, position.y);

  // this.world.update();

  world.updateHoverBlockInfo(1, {x: 0, y: 0});
  world.renderChunks(5, {x: 0, y: 0});

  player.update();

  viewport.panCamera(player.cameraBox);

  ctx.restore();
};

animate();