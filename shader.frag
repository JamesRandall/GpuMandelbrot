#version 300 es
precision highp float;
uniform vec2 uResolution;
uniform vec2 uScale;
uniform vec2 uMin;
uniform float maxIterations;
out vec4 fragColor;

const vec3 baseColor0 = vec3(0.0,7.0,100.0) / 255.0;
const vec3 baseColor1 = vec3(32.0,107.0,203.0) / 255.0;
const vec3 baseColor2 = vec3(237.0,255.0,255.0) / 255.0;
const vec3 baseColor3 = vec3(255.0,170.0,0.0) / 255.0;
const vec3 baseColor4 = vec3(0.0,2.0,0.0) / 255.0;

//const vec3 baseColor0 = vec3(32.0, 0.0, 0.0) / 255.0;
//const vec3 baseColor1 = vec3(64.0, 0.0, 0.0) / 255.0;
//const vec3 baseColor2 = vec3(128.0, 0.0, 0.0) / 255.0;
//const vec3 baseColor3 = vec3(192.0, 0.0, 0.0) / 255.0;
//const vec3 baseColor4 = vec3(255.0, 0.0, 0.0) / 255.0;

vec3 interpolate(vec3 color1, vec3 color2, float fraction) {  
  return color1 + (color2 - color1) * fraction;
}

// Colour picking could do with some work
vec3 rgbColorFromIteration(float iteration) {
  float fractionalIteration = iteration / maxIterations;
  if (fractionalIteration <= 0.16) return interpolate(baseColor0, baseColor1, fractionalIteration / 0.16);
  if (fractionalIteration <= 0.42) return interpolate(baseColor1, baseColor2, (fractionalIteration - 0.16) / (0.42-0.16));
  if (fractionalIteration <= 0.6425) return interpolate(baseColor2, baseColor3, (fractionalIteration - 0.42) / (0.6425-0.42));
  if (fractionalIteration <= 0.8575) return interpolate(baseColor3, baseColor4, (fractionalIteration - 0.6425) / (0.8575-0.6425));
  return baseColor4;
}

vec3 mandelbrot() {
  vec2 scaled = vec2(gl_FragCoord.x * uScale.x + uMin.x, gl_FragCoord.y * uScale.y + uMin.y);
  vec2 c = vec2(0.0,0.0);

  for (float iteration=0.0; iteration < maxIterations; iteration++) {
    if (dot(c,c) > 4.0) return rgbColorFromIteration(iteration);
    c = vec2(c.x*c.x - c.y*c.y + scaled.x, 2.0 * c.x * c.y + scaled.y);        
  }
  return vec3(0,0,0);
}

void main(void) {
  fragColor = vec4(mandelbrot(), 1);
}