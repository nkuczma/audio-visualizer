'use strict'
import './index.css';


let audio = document.getElementById('audioElement'); 
document.getElementById('play-audio').onclick = function() { audio.play(); };
document.getElementById('pause-audio').onclick = function() { audio.pause(); };
