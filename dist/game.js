"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.player = void 0;
const player_1 = require("./js/player");
exports.player = new player_1.Player(document.getElementById('canvas'), 1, [
    { name: 'Idle', imageSrc: './public/img/player.png', fps: 0, frameCount: 1 }
]);
exports.player.update();
