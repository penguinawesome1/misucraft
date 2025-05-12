import {Hitbox2D, Position2D} from './physics';

export class Viewport {
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  #position: Position2D = {x: 0, y: 0};
  #scale = 1;

  constructor() {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

    this.#resetCanvasSize();

    this.position = {
      x: this.width / 2,
      y: this.height / 2,
    };

    window.addEventListener('wheel', (e) => {
      if (e.shiftKey) this.handleZoom(e.deltaY);
    });
    window.addEventListener('resize', () => this.#resetCanvasSize());
  }

  get scale(): number {
    return this.#scale;
  }

  get position(): Position2D {
    return this.#position;
  }
  set position(position: Position2D) {
    this.#position = position;
  }

  get width(): number {
    return this.canvas.width / this.#scale;
  }

  get height(): number {
    return this.canvas.height / this.#scale;
  }

  get center(): Position2D {
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

  #offsetByCenter(oldCenter: Position2D) {
    const currCenter = this.center;
    this.#position.x += (currCenter.x - oldCenter.x);
    this.#position.y += (currCenter.y - oldCenter.y);
  }

  handleZoom(delta: number) {
    const centerTemp = this.center;
    this.#scale *= (1 - delta * 0.0005);
    this.#offsetByCenter(centerTemp);
  }

  panCamera(cameraBox: Hitbox2D) {
    const {x: boxX, y: boxY, width: boxWidth, height: boxHeight} = cameraBox;

    const position = this.position;
    const leftBoundary = -position.x;
    const rightBoundary = -position.x + this.width - boxWidth;
    const topBoundary = -position.y;
    const bottomBoundary = -position.y + this.height - boxHeight;

    if (boxX < leftBoundary) {
      this.#position.x = -boxX;
    } else if (boxX > rightBoundary) {
      this.#position.x = -boxX + this.width - boxWidth;
    }

    if (boxY < topBoundary) {
      this.#position.y = -boxY;
    } else if (boxY > bottomBoundary) {
      this.#position.y = -boxY + this.height - boxHeight;
    }
  }
}