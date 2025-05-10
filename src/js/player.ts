import {Animation} from './animation';
import * as constants from './constants';
import {screenToWorld} from './isometric-transform';
import {Hitbox3D, Position2D, Position3D, Velocity3D} from './physics';
// import {} as gameManager from './game-manager';

const enum Direction {
  NORTH = -1,
  SOUTH = 1,
  EAST = 1,
  WEST = -1,
  NORTH_EAST,
  NORTH_WEST,
  SOUTH_EAST,
  SOUTH_WEST
}

export class Player {
  #pixelHitbox: Hitbox3D;
  #gridHitbox: Hitbox3D;
  #chunkPosition: Position2D;
  #velocity: Velocity3D;

  #canvas: HTMLCanvasElement;
  #ctx: CanvasRenderingContext2D;

  #scale: number;
  #direction: Direction;
  #animations: Animation[];
  #image: HTMLImageElement;
  #elapsedFrames: number;
  #currentFrame: number;

  #health: number;
  #canJump: boolean;
  #isInvincible: boolean;

  input: {north: boolean; south: boolean; east: boolean; west: boolean;}

  constructor(
      canvas: HTMLCanvasElement, scale: number, animations: Animation[]) {
    this.#pixelHitbox = {x: 0, y: 0, z: 0, width: 0, height: 0, depth: 0};
    this.#gridHitbox = {x: 0, y: 0, z: 0, width: 0, height: 0, depth: 0};
    this.#chunkPosition = {x: 0, y: 0};
    this.#velocity = {x: 0, y: 0, z: 0};

    this.#canvas = canvas;
    this.#ctx = canvas.getContext('2D') as CanvasRenderingContext2D;
    this.#scale = scale;
    this.#direction = Direction.SOUTH;
    this.#animations = animations;
    this.#elapsedFrames = 0;
    this.#currentFrame = 0;

    this.#health = constants.MAX_HEALTH;
    this.#canJump = true;
    this.#isInvincible = constants.GAME_MODE === 'creative';

    this.input = {north: false, south: false, east: false, west: false};

    this.#image = new Image();
    this.#image.onload = () => {
      this.pixelHitbox.width =
          (this.#image.width / this.#animations[0].frameCount) * this.#scale;
      this.pixelHitbox.height = this.#image.height * this.#scale;
    };
  }

  get pixelHitbox(): Hitbox3D {
    return this.#pixelHitbox;
  }

  get gridHitbox(): Hitbox3D {
    return this.#gridHitbox;
  }

  set gridPosition(position: Position3D) {
    this.#gridHitbox = {...this.#gridHitbox, ...position};
  }

  get velocity(): Velocity3D {
    return this.#velocity;
  }
  set velocity(velocity: Velocity3D) {
    this.#velocity = {...this.#velocity, ...velocity};
  }

  get pixelPosition(): Position3D {
    return {
      x: this.#pixelHitbox.x,
      y: this.#pixelHitbox.y,
      z: this.#pixelHitbox.z
    };
  }
  set pixelPosition(position: Position3D) {
    this.#pixelHitbox = {...this.#pixelHitbox, ...position};

    this.gridPosition = screenToWorld(this.pixelHitbox);

    this.#chunkPosition = {
      x: Math.round(this.gridPosition.x / constants.CHUNK_SIZE),
      y: Math.round(this.gridPosition.y / constants.CHUNK_SIZE),
    };

    // const w = 1000 / scaledCanvas.scale;
    // const h = 600 / scaledCanvas.scale;
    // this.#cameraBox = {
    //   position: {
    //     x: this.pixelPosition.x + this.pixelHitbox.width / 2 - w / 2,
    //     y: this.pixelPosition.y + this.pixelHitbox.height / 2 - h / 2 -
    //         this.pixelPosition.z,
    //   },
    //   width: w,
    //   height: h,
    // };
  }

  get gridPosition(): Position3D {
    return {
      x: this.#gridHitbox.x,
      y: this.#gridHitbox.y,
      z: this.#gridHitbox.z
    };
  }

  get health(): number {
    return this.#health;
  }
  set health(value: number) {
    this.#health = Math.min(constants.MAX_HEALTH, value);
    if (this.#health < 0) {
      // toggleDeath();
      // respawnPlayer(this);
    }
    if (value < 0) this.addInvicibiltyFrames();
    console.log(`Player health updated to ${this.#health}`);
  }

  get canJump(): boolean {
    return this.#canJump;
  }
  set canJump(value: boolean) {
    this.#canJump = value;
  }

  get isInvincible(): boolean {
    return this.#isInvincible;
  }
  set isInvincible(value: boolean) {
    this.isInvincible = value;
  }

  update() {
    this.#draw();
    this.#updateFrames();
    this.#addInputVelocity();

    // this.renderer.panCamera(this);
    this.#updateDirection();

    // apply friction
    this.velocity.x *= constants.FRICTION_MULTIPLIER;
    this.velocity.y *= constants.FRICTION_MULTIPLIER;

    // this.respondToFlatCollision();

    // apply gravity
    this.pixelHitbox.z += this.velocity.z;
    this.velocity.z -= constants.GRAVITY;

    // this.respondToDepthCollision();

    // update position
    this.pixelHitbox.x += this.velocity.x;
    this.pixelHitbox.y += this.velocity.y * 0.5;

    // this.checkForHit();

    // check for void damage
    if (this.gridHitbox.z < constants.VOID_DEPTH) this.health -= 2;
  }

  addInvicibiltyFrames(duration = constants.INVINCIBLE_DURATION) {
    this.isInvincible = true;
    setTimeout(() => {
      this.isInvincible = false;
    }, duration);
  }

  tryToJump() {
    if (this.canJump) {
      this.canJump = false;
      this.velocity.z = constants.JUMP_STRENGTH;
    }
  }

  #addInputVelocity() {
    if (!this.input.west && !this.input.east && !this.input.north &&
        !this.input.south) {
      return;
    }

    let velocityX = 0;
    let velocityY = 0;

    if (this.input.west) velocityX--;
    if (this.input.east) velocityX++;
    if (this.input.north) velocityY--;
    if (this.input.south) velocityY++;

    velocityX *= constants.PLAYER_SPEED;
    velocityY *= constants.PLAYER_SPEED;

    if (velocityX && velocityY) {
      velocityX *= Math.SQRT1_2;
      velocityY *= Math.SQRT1_2;
    }

    this.velocity.x += velocityX;
    this.velocity.y += velocityY;
  }

  #updateFrames() {
    this.#elapsedFrames++;

    if (this.#elapsedFrames % this.#animations[0].frameCount === 0) {
      if (this.#currentFrame < this.#animations[0].fps - 1) {
        this.#currentFrame++;
      } else {
        this.#currentFrame = 0;
      }
    }
  }

  #draw() {
    const cropbox = {
      position: {
        x: this.#currentFrame *
            (this.#image.width / this.#animations[0].frameCount),
        y: this.#direction * this.#image.height * 0.25,
      },
      width: this.#image.width / this.#animations[0].frameCount,
      height: this.#image.height,
    };

    this.#ctx.drawImage(
        this.#image, cropbox.position.x, cropbox.position.y, cropbox.width,
        cropbox.height, this.pixelHitbox.x,
        this.pixelHitbox.y - this.pixelHitbox.z, this.pixelHitbox.width,
        this.pixelHitbox.height);
  }

  #updateDirection() {
    if (this.input.north) {
      if (this.input.west) {
        this.#direction = Direction.NORTH_WEST;
      } else if (this.input.east) {
        this.#direction = Direction.NORTH_EAST;
      }
    } else if (this.input.south) {
      if (this.input.west) {
        this.#direction = Direction.SOUTH_WEST;
      } else if (this.input.east) {
        this.#direction = Direction.SOUTH_EAST;
      }
    }
  }
}