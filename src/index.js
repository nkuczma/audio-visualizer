'use strict'
import './index.css';

/////
let mock = [235, 245, 236, 212, 213, 193, 163, 133, 151, 164, 158, 142, 143, 139, 126, 134, 146, 154, 155, 146, 142, 151, 158, 154, 141, 135, 133, 130, 132, 135, 130, 130, 123, 104, 98, 92, 86, 87, 95, 96, 91, 90, 93, 102, 104, 98, 100, 103, 96, 99, 120, 125, 125, 125, 119, 107, 89, 96, 112, 115, 112, 112, 118, 114, 112, 116, 111, 94, 88, 93, 101, 102, 109, 117, 111, 96, 84, 73, 71, 61, 54, 69, 75, 72, 69, 72, 71, 65, 61, 55, 48, 48, 44, 41, 56, 59, 61, 63, 55, 31, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

/////

let audio, src, analyser, context;
let canvas = document.getElementById("canvas");
let isPlaying = false;
let contextStated = false;
let canPlay = false;
let animation;

function audioLoaded() {
  canPlay = true;
}

function initAudio() {
  audio = new Audio();
  audio.crossOrigin = "anonymous";
  audio.src = "https://lab.ma77os.com/audio-cloud/music/paradise_circus.mp3";
  audio.addEventListener( 'canplaythrough', audioLoaded, false );
}

function playAudio() {
  if(!contextStated) {
    context = new AudioContext();
    src = context.createMediaElementSource(audio);
    analyser = context.createAnalyser();
    src.connect(analyser);
    src.connect(context.destination);
    contextStated = true;
  }
  audio.play(); 
  analyser.fftSize = 256;
  let bufferLength = analyser.frequencyBinCount;
  let dataArray = new Uint8Array(bufferLength);


  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  let ctx = canvas.getContext("2d");

  let width = canvas.width;
  let height = canvas.height;
  ctx.translate(0, height);
  

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

  function renderFrame() {
    animation = requestAnimationFrame(renderFrame);
    analyser.getByteFrequencyData(dataArray);
    ctx.clearRect(0, -canvas.height, canvas.width, canvas.height*2);
    let points = [];
    let points2 = [];
    let X = 0;
    let t = 10; 
    for (let i = 0; i < bufferLength; i++) {
      // let Y = -mock[i] - height/2;
      // let Y2 = -mock[i] - height/2 +50;
      let Y = -dataArray[i]  - height/2;
      let Y2 = -dataArray[i] - height/2 +50;
      let p = { x: X, y: Y };
      let p2 = { x: X, y: Y2 };
      points.push(p);
      points2.push(p2);
      X = X + t;
    }
    // console.log(lines);
    ctx.setLineDash([0]);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "blue";
    drawCurve(points);
    ctx.lineTo(0 , -height/2 + 1);

    ctx.closePath();
    ctx.fillStyle = "blue";
    ctx.fill();

    drawCurve(points2);
    ctx.lineTo(0 , -height/2 + 51);

    ctx.closePath();
    ctx.fillStyle = "grey";
    ctx.fill();
  }
  renderFrame();
};

function pauseAudio() {
  analyser.disconnect();
  audio.pause();
  cancelAnimationFrame(animation);
}

initAudio();
document.getElementById('play-audio').onclick = function() { 
  if (!isPlaying && canPlay) { playAudio(); isPlaying = true; } 
};
document.getElementById('pause-audio').onclick = function() { 
  if (isPlaying) { pauseAudio(); isPlaying = false; }
};