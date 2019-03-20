function VisualizationModule(canvasId) {
	const colors = ['#592169', '#972F9C', '#DB479A'];
	const wavesNumber = 3;
	let heightDifference = 50;

	let canvas = document.getElementById(canvasId);
  let ctx = canvas.getContext('2d');
  
  function parsePoints(points) {
    let newPoints = {};
    let X = 0;
    let t = canvas.width/points.length + 1; 
    for (let i = 0; i < wavesNumber; i++) {
      newPoints[i] = [];
      for (let j = 0; j < points.length; j++) {
        let Y = -points[j] - canvas.height/2 + heightDifference*i;
        let p = { x: X, y: Y };
        newPoints[i].push(p);
        X = X + t;
      }
      X = 0;
    }
    return newPoints;
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

  function drawWaves(points) {
    ctx.clearRect(0, -canvas.height, canvas.width, canvas.height*2);
    resizeCanvas();
    points = parsePoints(points);
    for (let i = 0; i < wavesNumber; i++) {
      ctx.strokeStyle = colors[i];
      drawCurve(points[i]);
      ctx.lineTo(canvas.width, -canvas.height/2 + i*heightDifference);
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fillStyle = colors[i];
      ctx.fill();
    }
  }

  function resizeCanvas() {
    let controlsHeight = document.getElementById('controls').offsetHeight;
    if(canvas.width !== innerWidth || canvas.height !== innerHeight - controlsHeight){
      canvas.width = innerWidth;
      canvas.height = innerHeight - controlsHeight;
      ctx.translate(0, canvas.height);
    }
  }

  function initializeView() {
    for (let i = 0; i < wavesNumber; i++) {
      drawWaves([0]);
    }
  }

  return { drawWaves, initializeView }
}

export default VisualizationModule;