import './index.css';
'use strict';

(function () {
  let audio, animation, analyser;
  let audioUrl = 'https://dl.dropboxusercontent.com/s/guhhcmco0dtq8uk/Bensound-Sunny.mp3?dl=0';
  const colors = ['#592169', '#972F9C', '#DB479A'];
  const wavesNumber = 3;
  let heightDifference = 50;
  let isPlaying = false;
  let contextInitialized = false;

  let canvas = document.getElementById('canvas');
  let ctx = canvas.getContext('2d');
  let titleEl = document.getElementById('title');
  let playAudioNode = document.getElementById('play-audio');
  let pauseAudioNode = document.getElementById('pause-audio');
  let audioFileNode = document.getElementById('audio-file');

  audio = new Audio();
  audio.crossOrigin = 'anonymous';
  audio.src = audioUrl;
  audio.addEventListener( 'canplaythrough', audioLoaded, false );
  audio.loop = true; 

  resizeCanvas();

  for (let i = 0; i < wavesNumber; i++) {
    ctx.beginPath();
    ctx.strokeStyle = colors[i];
    ctx.lineTo(0, -canvas.height/2 + 15 + i*heightDifference);
    ctx.lineTo(canvas.width, -canvas.height/2 + 15 + i*heightDifference);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fillStyle = colors[i];
    ctx.fill();
  }

  titleEl.innerHTML = 'Loading song...';
  playAudioNode.disabled = true; 
  pauseAudioNode.disabled = true; 
  
  audioFileNode.addEventListener('change', function() {
    titleEl.innerHTML = 'Loading song...';
    let files = this.files;
    audio.src = URL.createObjectURL(files[0]);
    audioUrl = files[0].name;
    audio.load();
    audio.addEventListener( 'canplaythrough', audioLoaded, false );
    playAudio();
    isPlaying = true;
  }, false);
    
  playAudioNode.addEventListener('click', function() { 
    if (!isPlaying) { playAudio(); isPlaying = true; } 
  }, false);

  pauseAudioNode.addEventListener ('click', function() { 
    if (isPlaying) { pauseAudio(); isPlaying = false; }
  }, false);


  function audioLoaded() {
    titleEl.innerHTML = audioUrl.split('/').pop().split('.')[0];
    playAudioNode.disabled = false; 
    pauseAudioNode.disabled = false;
  }

  function resizeCanvas() {
    let controlsHeight = document.getElementById('controls').offsetHeight;
    if(canvas.width !== innerWidth || canvas.height !== innerHeight - controlsHeight){
      canvas.width = innerWidth;
      canvas.height = innerHeight - controlsHeight;
      ctx.translate(0, canvas.height);
    }
  }

  function drawCurve(points) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    let t = 1;
    for (let i = 0; i < points.length - 1; i++) {
      let p0 = (i > 0) ? points[i - 1] : points[0];
      let p1 = points[i];
      let p2 = points[i + 1];
      let p3 = (i != points.length - 2) ? points[i + 2] : p2;

      let cp1x = p1.x + (p2.x - p0.x) / 6 * t;
      let cp1y = p1.y + (p2.y - p0.y) / 6 * t;

      let cp2x = p2.x - (p3.x - p1.x) / 6 * t;
      let cp2y = p2.y - (p3.y - p1.y) / 6 * t;

      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
    }
    ctx.stroke();
  }

  function drawWave(points, color, waveHeight) {
    ctx.strokeStyle = color;
    drawCurve(points);
    ctx.lineTo(canvas.width, -canvas.height/2 + waveHeight + 13);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  function playAudio() {
    if(!contextInitialized) {
      let context = new AudioContext();
      let src = context.createMediaElementSource(audio);
      analyser = context.createAnalyser();
      src.connect(analyser);
      src.connect(context.destination);
      contextInitialized = true;
    } 
    analyser.fftSize = 256;
    let bufferLength = analyser.frequencyBinCount;
    let dataArray = new Uint8Array(bufferLength);
    
    function renderFrame() {
      animation = requestAnimationFrame(renderFrame);
      resizeCanvas();
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, -canvas.height, canvas.width, canvas.height*2);

      let points = {};
      let X = 0;
      let t = canvas.width/(analyser.fftSize/2) + 1; 
      for (let i = 0; i < wavesNumber; i++) {
        points[i] = [];
        for (let j = 0; j < bufferLength; j++) {
          let Y = -dataArray[j] - canvas.height/2 + 15 + heightDifference*i;
          let p = { x: X, y: Y };
          points[i].push(p);
          X = X + t;
        }
        X = 0;
      }
      ctx.setLineDash([0]);
      ctx.lineWidth = 1;
      for (let i in points) {
        drawWave(points[i], colors[i], i*heightDifference + 1);
      }
    }
    renderFrame();
    audio.play();
  }

  function pauseAudio() {
    audio.pause();
    cancelAnimationFrame(animation);
  }

})();
