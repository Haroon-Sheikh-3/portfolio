// dust.f.glsl — Fragment shader for dust particles.
// Soft circular alpha, additive blending. three.js built-in: gl_PointCoord.

precision highp float;

varying float vAlpha;
varying vec3 vColor;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  float alpha = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(vColor * alpha, alpha * vAlpha);
}