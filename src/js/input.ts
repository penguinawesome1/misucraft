// import {} as renderer from './renderer';
// import {} as gameManager from './game-manager'
import {player} from './game.js';

// window.addEventListener('mousemove', (e) => {
//   renderer.updateMouse(e.clientX, e.clientY);
// });

window.addEventListener('contextmenu', (e) => {
  if (e.button === 2) {
    e.preventDefault();
  }
});

// window.addEventListener('mousedown', (e) => {
//   switch (e.button) {
//     case 0:
//       for (const enemy of this.world.enemyList) {
//         if (enemy.tryToHit()) return;
//       }
//       this.world.deleteBlock('hover');
//       break;
//     case 1:
//       for (let i = 0; i < this.player.hotbar.length; i++) {
//         const hasItem =
//             this.player.hotbar[i].blockNum ===
//             this.world.hoverBlock.blockNum;
//         if (!hasItem) continue;

//         hotbar.children[this.gameManager.hotbarIndex].id = '';
//         this.gameManager.hotbarIndex = i;
//         hotbar.children[this.gameManager.hotbarIndex].id = 'selected';
//         break;
//       }
//       break;
//     case 2:
//       const blockNum =
//           this.player.hotbar[this.gameManager.hotbarIndex].blockNum;
//       if (blockNum) this.world.addBlock(blockNum);
//       break;
//   }
// });

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
      // case ' ':
      //   player.jump();
      //   break;
      // case 'ESCAPE':
      //   this.gameManager.togglePause();
      //   break;
      // case '1':
      //   this.gameManager.dev = !this.gameManager.dev;
      //   break;
  }
});

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

// window.addEventListener('wheel', (e) => handleWheel(e));

// const handleWheel = (e) => {
//   const delta = Math.sign(e.deltaY);

//   if (!e.shiftKey) {
//     gameManager.handleHotbarSelection(delta);
//     return;
//   }

//   renderer.handleZoom(delta);
// };