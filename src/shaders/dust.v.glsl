// dust.v.glsl — Vertex shader for dust particles.
// Point sprites with distance-attenuated size. three.js built-ins:
// position, modelViewMatrix, projectionMatrix, pointSize.

attribute float aSize;
attribute float aAlpha;
attribute vec3 aColor;

varying float vAlpha;
varying vec3 vColor;

uniform float uPixelRatio;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize * uPixelRatio * (120.0 / max(-mvPosition.z, 1.0));
  gl_Position = projectionMatrix * mvPosition;
  vAlpha = clamp(aAlpha, 0.0, 1.0);
  vColor = aColor;
}