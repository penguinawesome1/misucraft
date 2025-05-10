import { Player } from './player.js';
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
export const player = new Player(canvas, 1, [
    { name: 'Idle', imageSrc: '../public/img/player.png', fps: 0, frameCount: 1 }
]);
const animate = () => {
    window.requestAnimationFrame(animate);
    // this.updateMouse();
    // if (this.gameManager.pause) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    // ctx.scale(this.scaledCanvas.scale, this.scaledCanvas.scale);
    // ctx.translate(this.camera.position.x, this.camera.position.y);
    // this.world.update();
    player.update();
    ctx.restore();
};
animate();
document.addEventListener('keydown', (e) => {
    console.log('hiii');
});
