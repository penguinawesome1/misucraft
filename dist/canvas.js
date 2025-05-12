const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
export { canvas, ctx };
const dpr = window.devicePixelRatio || 1;
let desiredWidth = window.innerWidth;
let desiredHeight = window.innerHeight;
canvas.width = desiredWidth * dpr;
canvas.height = desiredHeight * dpr;
const camera = {
    position: { x: canvas.width / (dpr * 2), y: canvas.height / (dpr * 2) },
    scale: dpr,
    get width() {
        return canvas.width / this.scale;
    },
    get height() {
        return canvas.height / this.scale;
    },
};
export const getCamera = () => {
    return camera;
};
const getCameraCenter = () => {
    return {
        x: camera.position.x + camera.width / 2,
        y: camera.position.y + camera.height / 2
    };
};
const handleWheel = (e) => {
    if (!e.shiftKey)
        return;
    const originalCenter = getCameraCenter();
    camera.scale -= e.deltaY * 0.0005;
    const newCenter = getCameraCenter();
    camera.position.x -= originalCenter.x - newCenter.x;
    camera.position.y -= originalCenter.y - newCenter.y;
};
window.addEventListener('wheel', handleWheel);
// window.addEventListener('resize', () => handleResize());
// const handleResize = () => {
//   const width = window.innerWidth;
//   const height = window.innerHeight;
//   canvas.width = width * dpr;
//   canvas.height = height * dpr;
//   canvas.style.width = `${width}px`;
//   canvas.style.height = `${height}px`;
//   const oldCenterX = (width / 2 - camera.position.x) / camera.scale;
//   const oldCenterY = (height / 2 - camera.position.y) / camera.scale;
//   camera.position.x = width / 2 - oldCenterX * camera.scale;
//   camera.position.y = height / 2 - oldCenterY * camera.scale;
// };
