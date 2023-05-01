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

  function drag(ev) {
    const xDelta = (xMax - xMin) / canvas.width;
    const yDelta = (yMax - yMin) / canvas.height;
    xMin -= ev.movementX * xDelta;
    xMax -= ev.movementX * xDelta;
    yMin += ev.movementY * yDelta;
    yMax += ev.movementY * yDelta;
  }

  canvas.onpointerdown = (ev) => {
    canvas.setPointerCapture(ev.pointerId);
    canvas.onpointermove = drag;
  };
  canvas.onpointerup = (ev) => {
    canvas.onpointermove = null;
    canvas.releasePointerCapture(ev.pointerId);
  }

  canvas.onwheel = (ev) => {
    // A Google Maps style zoom and keep the point under the mouse in the same position type approach
    const xDelta = (xMax - xMin) / canvas.width;
    const yDelta = (yMax - yMin) / canvas.width;

    const mouseX = ev.clientX / canvas.width;
    const mouseY = (canvas.height - ev.clientY) / canvas.height;

    const viewWidth = xMax - xMin;
    const viewHeight = yMax - yMin;
    const viewMouseX = xMin + mouseX * viewWidth;
    const viewMouseY = yMin + mouseY * viewHeight;

    const newWidth = viewWidth - ev.deltaY * xDelta;
    const newHeight = viewHeight - ev.deltaY * yDelta;

    xMin = viewMouseX - mouseX * newWidth;
    yMin = viewMouseY - mouseY * newHeight;
    xMax = xMin + newWidth;
    yMax = yMin + newHeight;
  }

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