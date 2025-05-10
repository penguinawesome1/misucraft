import {Player} from './js/player';

export const player =
    new Player(document.getElementById('canvas') as HTMLCanvasElement, 1, [
      {name: 'Idle', imageSrc: './public/img/player.png', fps: 0, frameCount: 1}
    ]);

player.update();