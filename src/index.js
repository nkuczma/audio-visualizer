import './index.css';
import ControlsModule from './js/ControlsModule';
'use strict';

let audioUrl = 'https://dl.dropboxusercontent.com/s/guhhcmco0dtq8uk/Bensound-Sunny.mp3?dl=0';
const canvasRootNode = 'canvas';
const colors = ['#592169', '#972F9C', '#DB479A'];
const wavesNumber = 3;
const heightDifference = 50;
const controlsRoot = 'controls';

let control = ControlsModule({ 
  controlsRoot,
  canvasRootNode,
  colors, 
  wavesNumber, 
  heightDifference, 
  audioUrl
});
control.initialize();