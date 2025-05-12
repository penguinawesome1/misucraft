class Mouse {
    #screenPosition = { x: 0, y: 0 };
    #viewport = null;
    set viewport(viewport) {
        this.#viewport = viewport;
    }
    set position(position) {
        this.#screenPosition = position;
    }
    get position() {
        return this.#screenPosition;
    }
    get offsetPosition() {
        if (!this.#viewport)
            throw new Error('Viewport is not set, cannot calculate offset position.');
        const { scale, position } = this.#viewport;
        const { x: screenX, y: screenY } = this.position;
        return { x: screenX / scale - position.x, y: screenY / scale - position.y };
    }
    get offsetBounds() {
        const { x, y } = this.offsetPosition;
        return { x, y, width: 0, height: 0 };
    }
}
export const mouse = new Mouse();
export let isPaused = false;
export function initListeners(viewport, player, world) {
    mouse.viewport = viewport;
    // track mouse object
    window.addEventListener('mousemove', (e) => {
        mouse.position = { x: e.clientX, y: e.clientY };
    });
    // stop right click from opening menu to allow it for block placing
    window.addEventListener('contextmenu', (e) => {
        if (e.button === 2) {
            e.preventDefault();
        }
    });
    // movement and abilities
    document.addEventListener('keydown', (e) => {
        switch (e.key.toUpperCase()) {
            case 'D':
                player.input.east = true;
                break;
            case 'A':
                player.input.west = true;
                break;
            case 'S':
                player.input.south = true;
                break;
            case 'W':
                player.input.north = true;
                break;
            case ' ':
                player.tryToJump();
                break;
            case 'ESCAPE':
                isPaused = !isPaused;
                break;
        }
    });
    // stop movement
    document.addEventListener('keyup', (e) => {
        switch (e.key.toUpperCase()) {
            case 'D':
                player.input.east = false;
                break;
            case 'A':
                player.input.west = false;
                break;
            case 'S':
                player.input.south = false;
                break;
            case 'W':
                player.input.north = false;
                break;
        }
    });
    window.addEventListener('mousedown', (e) => {
        switch (e.button) {
            case 0:
                // for (const enemy of world.enemyList) {
                //   if (enemy.tryToHit()) return;
                // }
                // world.deleteBlock('hover');
                break;
            case 1:
                // for (let i = 0; i < this.player.hotbar.length; i++) {
                //   const hasItem =
                //       player.hotbar[i].blockNum === world.hoverBlock.blockNum;
                //   if (!hasItem) continue;
                //   hotbar.children[this.gameManager.hotbarIndex].id = '';
                //   this.gameManager.hotbarIndex = i;
                //   hotbar.children[this.gameManager.hotbarIndex].id = 'selected';
                //   break;
                // }
                break;
            case 2:
                // const blockNum = player.hotbar[gameManager.hotbarIndex].blockNum;
                // if (blockNum) world.addBlock(blockNum);
                break;
        }
    });
}
