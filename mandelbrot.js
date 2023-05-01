import { initBuffers } from "./initBuffers.js";
import { drawScene } from "./drawScene.js";
import { getShaderProgram } from "./shader.js";

const aspectRatio = 1.6;

main();

async function main() {
  const canvas = document.querySelector("#glcanvas");
  
  // Initialize the GL context
  const gl = canvas.getContext("webgl2");
  // Only continue if WebGL is available and working
  if (gl === null) {
    alert(
      "A browser supporting WebGL2 is required to run this demo."
    );
    return;
  }
  const programInfo = await getShaderProgram(gl, 500);
  const positionBuffer = initBuffers(gl);

  var xMin = -2.1;
  var xMax = 0.9;
  var yMin = -1.0;
  var yMax = 1.0;

  function drag(movementX, movementY) {
    const xDelta = (xMax - xMin) / canvas.width;
    const yDelta = (yMax - yMin) / canvas.height;
    xMin -= movementX * xDelta;
    xMax -= movementX * xDelta;
    yMin += movementY * yDelta;
    yMax += movementY * yDelta;
  }

  function zoom(clientX, clientY, evDeltaY) {
    // A Google Maps style zoom and keep the point under the mouse in the same position type approach
    const xDelta = (xMax - xMin) / canvas.width;
    const yDelta = (yMax - yMin) / canvas.width;

    const mouseX = clientX / canvas.width;
    const mouseY = (canvas.height - clientY) / canvas.height;

    const viewWidth = xMax - xMin;
    const viewHeight = yMax - yMin;
    const viewMouseX = xMin + mouseX * viewWidth;
    const viewMouseY = yMin + mouseY * viewHeight;

    const newWidth = viewWidth - evDeltaY * xDelta;
    const newHeight = viewHeight - evDeltaY * yDelta;

    xMin = viewMouseX - mouseX * newWidth;
    yMin = viewMouseY - mouseY * newHeight;
    xMax = xMin + newWidth;
    yMax = yMin + newHeight;
  }

  // Touch and mouse events
  var activeTouchRegion = ZingTouch.Region(canvas);
  activeTouchRegion.bind(canvas, 'distance', function(event){
    event.preventDefault();
    zoom(event.detail.center.x, event.detail.center.y, event.detail.change*5);
  });

  activeTouchRegion.bind(canvas, 'pan', function(event){
    event.preventDefault();
    var movementX = event.detail.data[0].change.x;
    var movementY = event.detail.data[0].change.y;
    drag(movementX, movementY);
  });
  canvas.onwheel = ev => zoom(ev.clientX, ev.clientY, ev.deltaY);

  function draw() {
    if (canvas.width != window.innerWidth || canvas.height != window.innerHeight) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // you have to reset the viewport every time the canvas size changes so that the clipping matches the canvas size
      gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    }
    const contrainedYMinMax = constrainYMinMax(yMin, yMax, window.innerWidth, window.innerHeight);
    drawScene(gl, programInfo, positionBuffer, canvas.width, canvas.height, xMin, xMax, contrainedYMinMax.yMin, contrainedYMinMax.yMax, 1000.0);
    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
}

function constrainYMinMax(yMinSeed, yMaxSeed, canvasWidth, canvasHeight) {
  const yCenter = yMinSeed + (yMaxSeed - yMinSeed) / 2;
  const yProportion = canvasHeight / canvasWidth;
  const visibleSeedHeight = (yMaxSeed - yMinSeed) * yProportion * aspectRatio;
  const min = yCenter - visibleSeedHeight / 2;
  const max = min + visibleSeedHeight;
  return { yMin: min, yMax: max };
}