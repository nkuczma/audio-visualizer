import './index.css';
'use strict'
/////
var mock = [235, 245, 236, 212, 213, 193, 163, 133, 151, 164, 158, 142, 143, 139, 126, 134, 146, 154, 155, 146, 142, 151, 158, 154, 141, 135, 133, 130, 132, 135, 130, 130, 123, 104, 98, 92, 86, 87, 95, 96, 91, 90, 93, 102, 104, 98, 100, 103, 96, 99, 120, 125, 125, 125, 119, 107, 89, 96, 112, 115, 112, 112, 118, 114, 112, 116, 111, 94, 88, 93, 101, 102, 109, 117, 111, 96, 84, 73, 71, 61, 54, 69, 75, 72, 69, 72, 71, 65, 61, 55, 48, 48, 44, 41, 56, 59, 61, 63, 55, 31, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
/////


let audio, src, analyser, context;
let audioUrl = "https://lab.ma77os.com/audio-cloud/music/paradise_circus.mp3";
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let isPlaying = false;
let contextInitialized = false;
let canPlay = false;
let animation;
let controlsHeight = document.getElementById("controls").offsetHeight;
let colors = ["#592169", "#972F9C", "#DB479A"];
let wavesNumber = 3;
let heightDifference = 50;

function audioLoaded() {
  canPlay = true;
  document.getElementById('title').innerHTML = audioUrl.split('/').pop().split('.')[0];
};

function initAudio() {
  audio = new Audio();
  audio.crossOrigin = "anonymous";
  audio.src = audioUrl;
  audio.addEventListener( 'canplaythrough', audioLoaded, false );
  audio.loop = true; 
};

function resizeCanvas() {
  if(canvas.width !== innerWidth || canvas.height !== innerHeight - controlsHeight){
    canvas.width = innerWidth;
    canvas.height = innerHeight - controlsHeight;
    ctx.translate(0, canvas.height);
  }
};

function playAudio() {
  if(!contextInitialized) {
    context = new AudioContext();
    src = context.createMediaElementSource(audio);
    analyser = context.createAnalyser();
    src.connect(analyser);
    src.connect(context.destination);
    contextInitialized = true;
  } 
  analyser.fftSize = 256;
  let bufferLength = analyser.frequencyBinCount;
  let dataArray = new Uint8Array(bufferLength);

  
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight - controlsHeight;
  ctx.translate(0, canvas.height);
  
  function drawCurve(points) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    var t = 1;
    for (var i = 0; i < points.length - 1; i++) {
        var p0 = (i > 0) ? points[i - 1] : points[0];
        var p1 = points[i];
        var p2 = points[i + 1];
        var p3 = (i != points.length - 2) ? points[i + 2] : p2;

        var cp1x = p1.x + (p2.x - p0.x) / 6 * t;
        var cp1y = p1.y + (p2.y - p0.y) / 6 * t;

        var cp2x = p2.x - (p3.x - p1.x) / 6 * t;
        var cp2y = p2.y - (p3.y - p1.y) / 6 * t;

        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
    }
    ctx.stroke();
  }
  function drawWave(points, color, waveHeight, allwavesHeight) {
    ctx.strokeStyle = color;
    drawCurve(points);
    ctx.lineTo(canvas.width, -canvas.height/2 + waveHeight);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  function renderFrame() {
    animation = requestAnimationFrame(renderFrame);
    resizeCanvas();
    analyser.getByteFrequencyData(dataArray);
    ctx.clearRect(0, -canvas.height, canvas.width, canvas.height*2);
    let points = {};
    let X = 0;
    let t = canvas.width/(analyser.fftSize/2); 
    for (let i = 0; i < wavesNumber; i++) {
      points[i] = [];
      for (let j = 0; j < bufferLength; j++) {
        let Y = -dataArray[j] - canvas.height/2 + heightDifference*i;
        // let Y = -mock[j] - height/2 + heightDifference*i;
        let p = { x: X, y: Y };
        points[i].push(p);
        X = X + t;
      }
      X = 0;
    }
    ctx.setLineDash([0]);
    ctx.lineWidth = 1;
    let allWavesHeight = wavesNumber * heightDifference;
    for (let i in points) {
      drawWave(points[i], colors[i], i*heightDifference + 1, allWavesHeight);
    }
  }
  renderFrame();
  audio.play();
};

function pauseAudio() {
  analyser.disconnect();
  audio.pause();
  console.log(audio);
  // cancelAnimationFrame(animation);
};


document.getElementById('play-audio').onclick = function() { 
  if (!isPlaying && canPlay) { playAudio(); isPlaying = true; } 
};
document.getElementById('pause-audio').onclick = function() { 
  if (isPlaying) { pauseAudio(); isPlaying = false; }
};
window.onload = function() {
  initAudio();
  resizeCanvas();
  
  for (let i = 0; i < wavesNumber; i++) {
    ctx.beginPath();
    ctx.strokeStyle = colors[i];
    ctx.lineTo(0, -canvas.height/2 + i*heightDifference);
    ctx.lineTo(canvas.width, -canvas.height/2 + i*heightDifference);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fillStyle = colors[i];
    ctx.fill();
  }
  document.getElementById('title').innerHTML = "Loading song...";
};

let file = document.getElementById("audio-file");
file.onchange = function() {
  canPlay = false;
  document.getElementById('title').innerHTML = "Loading song...";
  var files = this.files;
  audio.src = URL.createObjectURL(files[0]);
  audioUrl = files[0].name;
  audio.load();
  audio.addEventListener( 'canplaythrough', audioLoaded, false );
  playAudio();
  isPlaying = true;
}