// projectPlane.v.glsl — Vertex shader for project image planes.
// Passes UV and world position to the fragment shader.
// three.js built-ins: position, uv, modelMatrix, modelViewMatrix,
// projectionMatrix.

varying vec2 vUv;
varying vec3 vWorldPosition;

void main() {
  vUv = uv;
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}