import './index.css';
import VisualizationModule from './js/VisualizationModule';
import AudioModule from './js/AudioModule';

'use strict';

let audioUrl = 'https://dl.dropboxusercontent.com/s/guhhcmco0dtq8uk/Bensound-Sunny.mp3?dl=0';
let animation;

let playAudioNode = document.getElementById('play-audio');
let pauseAudioNode = document.getElementById('pause-audio');
let audioFileNode = document.getElementById('audio-file');
let titleElement = document.getElementById('title');

let vis = VisualizationModule('canvas');
vis.initializeView();

let audio = AudioModule(audioUrl);
audio.initializeAudio();

function startAnimation() {
  function renderFrame() {
    animation = requestAnimationFrame(renderFrame);
    vis.drawWaves(audio.analyseAudio());
  }
  renderFrame();
}

function play() {
  playAudioNode.classList.add('active');
  pauseAudioNode.classList.remove('active');
  audio.playAudio();
  startAnimation();
}

function pause() {
  playAudioNode.classList.remove('active');
  pauseAudioNode.classList.add('active');
  audio.pauseAudio();
  cancelAnimationFrame(animation);
}

function onFileChange() {
  if(this.files.length !== 0) {
    titleElement.innerHTML = 'Loading song...';
    pauseAudioNode.classList.remove('active');
    playAudioNode.classList.remove('active');
    playAudioNode.disabled = true; 
    pauseAudioNode.disabled = true;
    let file = this.files;
    audio.loadAudio(file, audioIsLoaded);
  }
}

function audioIsLoaded(audioName) {
  titleElement.innerHTML = audioName.split('/').pop().split('.')[0];
  playAudioNode.disabled = false; 
  pauseAudioNode.disabled = false;
  playAudioNode.classList.add('active');
  audio.playAudio();
  startAnimation();
}

playAudioNode.addEventListener('click', play, false);
pauseAudioNode.addEventListener ('click', pause, false);
audioFileNode.addEventListener ('change', onFileChange, false);
titleElement.innerHTML = audioUrl.split('/').pop().split('.')[0];