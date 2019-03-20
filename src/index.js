import './index.css';
import VisualizationModule from './js/VisualizationModule';
import AudioModule from './js/AudioModule';

'use strict';

//let mock = [235, 245, 236, 212, 213, 193, 163, 133, 151, 164, 158, 142, 143, 139, 126, 134, 146, 154, 155, 146, 142, 151, 158, 154, 141, 135, 133, 130, 132, 135, 130, 130, 123, 104, 98, 92, 86, 87, 95, 96, 91, 90, 93, 102, 104, 98, 100, 103, 96, 99, 120, 125, 125, 125, 119, 107, 89, 96, 112, 115, 112, 112, 118, 114, 112, 116, 111, 94, 88, 93, 101, 102, 109, 117, 111, 96, 84, 73, 71, 61, 54, 69, 75, 72, 69, 72, 71, 65, 61, 55, 48, 48, 44, 41, 56, 59, 61, 63, 55, 31, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

// function Controls() {
// 	let titleEl = document.getElementById('title');
// 	let playAudioNode = document.getElementById('play-audio');
// 	let pauseAudioNode = document.getElementById('pause-audio');
// 	let audioFileNode = document.getElementById('audio-file');    
// }

let animation;
let vis = VisualizationModule('canvas');
vis.initializeView();

let audio = AudioModule('https://dl.dropboxusercontent.com/s/guhhcmco0dtq8uk/Bensound-Sunny.mp3?dl=0');

let playAudioNode = document.getElementById('play-audio');
let pauseAudioNode = document.getElementById('pause-audio');
let audioFileNode = document.getElementById('audio-file');
let titleElement = document.getElementById('title');


playAudioNode.addEventListener('click', function() { 
  audio.playAudio();
  function renderFrame() {
    animation = requestAnimationFrame(renderFrame);
    vis.drawWaves(audio.analyseAudio());
  }
  renderFrame();
}, false);

pauseAudioNode.addEventListener ('click', function() { 
  audio.pauseAudio();
  cancelAnimationFrame(animation);
}, false);

audioFileNode.addEventListener ('change', function() { 
  audio.loadAudio();
 }, false);