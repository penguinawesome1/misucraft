import * as constants from './constants.js';
import { screenToWorld } from './isometric-transform.js';
export class Player {
    #pixelHitbox;
    #gridHitbox;
    #chunkPosition;
    #velocity;
    #respawnPosition;
    #canvas;
    #ctx;
    #scale;
    #direction;
    #animations;
    #image;
    #elapsedFrames;
    #currentFrame;
    #health;
    #canJump;
    #isInvincible;
    input;
    constructor(canvas, scale, animations) {
        this.#pixelHitbox = { x: 0, y: 0, z: 0, width: 0, height: 0, depth: 0 };
        this.#gridHitbox = { x: 0, y: 0, z: 0, width: 0, height: 0, depth: 0 };
        this.#chunkPosition = { x: 0, y: 0 };
        this.#velocity = { x: 0, y: 0, z: 0 };
        this.#respawnPosition = { x: 0, y: 0, z: 0 };
        this.#canvas = canvas;
        this.#ctx = this.#canvas.getContext('2d');
        this.#scale = scale;
        this.#direction = 1 /* Direction.SOUTH */;
        this.#animations = animations;
        this.#elapsedFrames = 0;
        this.#currentFrame = 0;
        this.#health = constants.MAX_HEALTH;
        this.#canJump = true;
        this.#isInvincible = constants.GAME_MODE === 'creative';
        this.input = { north: false, south: false, east: false, west: false };
        this.#image = new Image();
        this.#image.onload = () => {
            this.pixelHitbox.width =
                (this.#image.width / this.#animations[0].frameCount) * this.#scale;
            this.pixelHitbox.height = this.#image.height * this.#scale;
        };
        this.#image.src = animations[0].imageSrc;
    }
    get pixelHitbox() {
        return this.#pixelHitbox;
    }
    get gridHitbox() {
        return this.#gridHitbox;
    }
    set gridPosition(position) {
        this.#gridHitbox = { ...this.#gridHitbox, ...position };
    }
    get respawnPosition() {
        return this.#respawnPosition;
    }
    get velocity() {
        return this.#velocity;
    }
    set velocity(velocity) {
        this.#velocity = { ...this.#velocity, ...velocity };
    }
    set pixelPosition(position) {
        this.#pixelHitbox = { ...this.#pixelHitbox, ...position };
        this.gridPosition = screenToWorld(this.pixelHitbox);
        this.#chunkPosition = {
            x: Math.round(this.gridHitbox.x / constants.CHUNK_SIZE),
            y: Math.round(this.gridHitbox.y / constants.CHUNK_SIZE),
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
    get health() {
        return this.#health;
    }
    set health(value) {
        this.#health = Math.min(value, constants.MAX_HEALTH);
        // console.log(`Player health updated to ${this.#health}`);
        if (this.#health < 0) {
            this.#triggerDeath();
        }
        if (value < 0)
            this.addInvicibiltyFrames();
    }
    get canJump() {
        return this.#canJump;
    }
    set canJump(value) {
        this.#canJump = value;
    }
    get isInvincible() {
        return this.#isInvincible;
    }
    set isInvincible(value) {
        this.#isInvincible = value;
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
        if (this.pixelHitbox.z < constants.VOID_DEPTH)
            this.health -= 2;
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
    #triggerDeath() {
        this.#respawn();
    }
    #respawn() {
        this.pixelPosition = this.respawnPosition;
        this.velocity = { x: 0, y: 0, z: 0 };
        this.health = constants.MAX_HEALTH;
    }
    #addInputVelocity() {
        if (!this.input.west && !this.input.east && !this.input.north &&
            !this.input.south) {
            return;
        }
        let velocityX = 0;
        let velocityY = 0;
        if (this.input.west)
            velocityX--;
        if (this.input.east)
            velocityX++;
        if (this.input.north)
            velocityY--;
        if (this.input.south)
            velocityY++;
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
            }
            else {
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
        this.#ctx.drawImage(this.#image, cropbox.position.x, cropbox.position.y, cropbox.width, cropbox.height, this.pixelHitbox.x, this.pixelHitbox.y - this.pixelHitbox.z, this.pixelHitbox.width, this.pixelHitbox.height);
    }
    #updateDirection() {
        if (this.input.north) {
            if (this.input.west) {
                this.#direction = 1 /* Direction.NORTH_WEST */;
            }
            else if (this.input.east) {
                this.#direction = 0 /* Direction.NORTH_EAST */;
            }
        }
        else if (this.input.south) {
            if (this.input.west) {
                this.#direction = 3 /* Direction.SOUTH_WEST */;
            }
            else if (this.input.east) {
                this.#direction = 2 /* Direction.SOUTH_EAST */;
            }
        }
    }
}
