// artifact.v.glsl — Vertex shader for the obsidian artifact.
// Passes world position, world normal, and view position to the fragment.
// three.js built-ins: position, normal, modelMatrix, normalMatrix,
// modelViewMatrix, projectionMatrix.

varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec3 vViewPosition;

uniform float uTime;

void main() {
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;
  vViewPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}