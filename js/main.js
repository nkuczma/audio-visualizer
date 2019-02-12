'use strict';

function Audio(id) {

  let audio = document.getElementById(id); 

  function playAudio() { 
    audio.play(); 
  }

  function pauseAudio() { 
    audio.pause(); 
  }

  let publicAPI = {
    play: playAudio,
    pause: pauseAudio
  }
  
  return publicAPI;
}

let audioEl = Audio("audioElement");
