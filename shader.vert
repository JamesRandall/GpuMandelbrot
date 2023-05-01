#version 300 es
precision highp float;
in vec4 vertexPosition;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

void main(void) {
  gl_Position = uProjectionMatrix * uModelViewMatrix * vertexPosition - vec4(0,-0.5,0,0);
}
