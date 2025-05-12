export class Viewport {
    canvas;
    ctx;
    #position = { x: 0, y: 0 };
    #scale = 1;
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.#resetCanvasSize();
        this.position = {
            x: this.width / 2,
            y: this.height / 2,
        };
        window.addEventListener('wheel', (e) => {
            if (e.shiftKey)
                this.handleZoom(e.deltaY);
        });
        window.addEventListener('resize', () => this.#resetCanvasSize());
    }
    get scale() {
        return this.#scale;
    }
    get position() {
        return this.#position;
    }
    set position(position) {
        this.#position = position;
    }
    get width() {
        return this.canvas.width / this.#scale;
    }
    get height() {
        return this.canvas.height / this.#scale;
    }
    get center() {
        return {
            x: this.#position.x + this.width / 2,
            y: this.#position.y + this.height / 2,
        };
    }
    #resetCanvasSize() {
        const centerTemp = this.center;
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.#offsetByCenter(centerTemp);
    }
    #offsetByCenter(oldCenter) {
        const currCenter = this.center;
        this.#position.x += (currCenter.x - oldCenter.x);
        this.#position.y += (currCenter.y - oldCenter.y);
    }
    handleZoom(delta) {
        const centerTemp = this.center;
        this.#scale *= (1 - delta * 0.0005);
        this.#offsetByCenter(centerTemp);
    }
    panCamera(cameraBox) {
        const { x: boxX, y: boxY, width: boxWidth, height: boxHeight } = cameraBox;
        const position = this.position;
        const leftBoundary = -position.x;
        const rightBoundary = -position.x + this.width - boxWidth;
        const topBoundary = -position.y;
        const bottomBoundary = -position.y + this.height - boxHeight;
        if (boxX < leftBoundary) {
            this.#position.x = -boxX;
        }
        else if (boxX > rightBoundary) {
            this.#position.x = -boxX + this.width - boxWidth;
        }
        if (boxY < topBoundary) {
            this.#position.y = -boxY;
        }
        else if (boxY > bottomBoundary) {
            this.#position.y = -boxY + this.height - boxHeight;
        }
    }
}
