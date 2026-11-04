// artifact.f.glsl — Fragment shader for the obsidian artifact.
// Fresnel ember rim, dark obsidian body with internal noise, warm specular.
// three.js built-ins: vWorldPosition, vNormal, vViewPosition (varyings).

precision highp float;

varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec3 vViewPosition;

uniform float uTime;
uniform vec3 uEmber;
uniform float uRimPower;
uniform float uBodyDarkness;
uniform float uNoiseScale;
uniform float uGlow;
uniform vec3 uLightPos;
uniform vec3 uLightColor;

float hash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash(i + vec3(0.0,0.0,0.0)), hash(i + vec3(1.0,0.0,0.0)), f.x),
        mix(hash(i + vec3(0.0,1.0,0.0)), hash(i + vec3(1.0,1.0,0.0)), f.x), f.y),
    mix(mix(hash(i + vec3(0.0,0.0,1.0)), hash(i + vec3(1.0,0.0,1.0)), f.x),
        mix(hash(i + vec3(0.0,1.0,1.0)), hash(i + vec3(1.0,1.0,1.0)), f.x), f.y),
    f.z
  );
}

void main() {
  // DIAG: force solid bright color to test if shader/geometry is rendering at all
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}