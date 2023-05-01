function drawScene(gl, programInfo, positionBuffer, canvasWidth, canvasHeight, xMin, xMax, yMin, yMax, maxIterations) {
  // Mandelbrot viewport
  var xScale = (xMax - xMin) / canvasWidth;
  var yScale = (yMax - yMin) / canvasHeight;
  // setup WebGL drawing
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);  
  const projectionMatrix = mat4.create();
  var halfWidth = canvasWidth/2;
  var halfHeight = canvasHeight/2;
  mat4.ortho(projectionMatrix, -1, 1, 1, -1, -1, 1);
  const modelViewMatrix = mat4.create();
  mat4.scale(modelViewMatrix, modelViewMatrix, [halfWidth,halfHeight,0]);
  setPositionAttribute(gl, positionBuffer, programInfo);
  gl.useProgram(programInfo.program);
  // Set the shader uniforms
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix
  );
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix
  );
  gl.uniform2f(programInfo.uniformLocations.resolution, canvasWidth, canvasHeight);
  gl.uniform2f(programInfo.uniformLocations.min, xMin, yMin);
  gl.uniform2f(programInfo.uniformLocations.scale, xScale, yScale);
  gl.uniform1f(programInfo.uniformLocations.maxIterations, maxIterations);


  {
    const offset = 0;
    const vertexCount = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
  }
}

// Tell WebGL how to pull out the positions from the position
// buffer into the vertexPosition attribute.
function setPositionAttribute(gl, positionBuffer, programInfo) {
  const numComponents = 2; // pull out 2 values per iteration
  const type = gl.FLOAT; // the data in the buffer is 32bit floats
  const normalize = false; // don't normalize
  const stride = 0; // how many bytes to get from one set of values to the next
  // 0 = use type and numComponents above
  const offset = 0; // how many bytes inside the buffer to start from
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexPosition,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}



export { drawScene };
