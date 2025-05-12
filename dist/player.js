import * as constants from './constants.js';
import { screenToWorld } from './isometric-transform.js';
export class Player {
    #screenHitbox = { x: 0, y: 0, z: 0, width: 0, height: 0, depth: 0 };
    #gridHitbox = { x: 0, y: 0, z: 0, width: 0, height: 0, depth: 0 };
    #chunkPosition = { x: 0, y: 0 };
    #velocity = { x: 0, y: 0, z: 0 };
    #respawnPosition = { x: 0, y: 0, z: 0 };
    #ctx;
    #scale;
    #direction = 1 /* Direction.SOUTH */;
    #animations;
    #image;
    #elapsedFrames = 0;
    #currentFrame = 0;
    #animationKey = 'idle';
    #health = constants.MAX_HEALTH;
    #canJump = false;
    #isInvincible = constants.GAME_MODE === 'creative';
    input = { north: false, south: false, east: false, west: false };
    constructor(ctx, scale, animations) {
        this.#ctx = ctx;
        this.#scale = scale;
        this.#animations = animations;
        this.#image = new Image();
        this.#image.onload = () => {
            this.screenHitbox.width =
                (this.#image.width / this.currentAnimation.frameCount) * this.#scale;
            this.screenHitbox.height = this.#image.height * this.#scale;
        };
        this.#image.src = this.currentAnimation.imageSrc;
    }
    get screenHitbox() {
        return this.#screenHitbox;
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
        this.#velocity = velocity;
    }
    get cameraBox() {
        const width = 500;
        const height = 300;
        const { x, y, z } = this.screenHitbox;
        return { x: x - width / 2, y: y - z - height / 2, width, height };
    }
    set screenPosition(position) {
        this.#screenHitbox = { ...this.#screenHitbox, ...position };
        this.gridPosition = screenToWorld(this.screenHitbox);
        this.#chunkPosition = {
            x: Math.round(this.gridHitbox.x / constants.CHUNK_SIZE),
            y: Math.round(this.gridHitbox.y / constants.CHUNK_SIZE),
        };
        // const w = 1000 / scaledCanvas.scale;
        // const h = 600 / scaledCanvas.scale;
        // this.#cameraBox = {
        //   position: {
        //     x: this.screenPosition.x + this.screenHitbox.width / 2 - w / 2,
        //     y: this.screenPosition.y + this.screenHitbox.height / 2 - h / 2 -
        //         this.screenPosition.z,
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
    get currentAnimation() {
        return this.#animations[this.#animationKey];
    }
    set currentAnimation(name) {
        this.#animationKey = name;
    }
    update() {
        this.drawPlayer();
        this.#updateFrames();
        this.#addInputVelocity();
        // this.renderer.panCamera(this);
        this.#updateDirection();
        // apply friction
        this.velocity.x *= constants.FRICTION_MULTIPLIER;
        this.velocity.y *= constants.FRICTION_MULTIPLIER;
        // this.respondToFlatCollision();
        // apply gravity
        this.screenHitbox.z += this.velocity.z;
        // this.velocity.z -= constants.GRAVITY;
        // this.respondToDepthCollision();
        // update position
        this.screenHitbox.x += this.velocity.x;
        this.screenHitbox.y += this.velocity.y * 0.5;
        // this.checkForHit();
        // check for void damage
        if (this.screenHitbox.z < constants.VOID_DEPTH)
            this.health -= 2;
    }
    drawPlayer() {
        const frameCount = this.currentAnimation.frameCount;
        const hitbox = this.#screenHitbox;
        const sectionWidth = this.#image.width / frameCount;
        const cropbox = {
            position: {
                x: this.#currentFrame * sectionWidth,
                y: 0,
            },
            width: sectionWidth,
            height: this.#image.height,
        };
        this.#ctx.drawImage(this.#image, cropbox.position.x, cropbox.position.y, cropbox.width, cropbox.height, hitbox.x, hitbox.y - hitbox.z, hitbox.width, hitbox.height);
    }
    addInvicibiltyFrames(duration = constants.INVINCIBLE_DURATION) {
        this.isInvincible = true;
        setTimeout(() => {
            this.isInvincible = false;
        }, duration);
    }
    tryToJump() {
        if (!this.canJump) {
            this.canJump = false;
            this.velocity.z = constants.JUMP_STRENGTH;
        }
    }
    #triggerDeath() {
        this.#respawn();
    }
    #respawn() {
        this.screenPosition = this.respawnPosition;
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
        if (this.#elapsedFrames % this.currentAnimation.frameCount === 0) {
            if (this.#currentFrame < this.currentAnimation.fps - 1) {
                this.#currentFrame++;
            }
            else {
                this.#currentFrame = 0;
            }
        }
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
