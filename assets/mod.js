import { ModPlayer } from 'https://atornblad.se/files/js-mod-player/player.js';

const player = new ModPlayer(new AudioContext());
await player.load("/assets/mortimers_chipdisko.mod");
player.play();
document.head.innerHTML += '<link rel="stylesheet" href="/assets/rainbow.css">';
