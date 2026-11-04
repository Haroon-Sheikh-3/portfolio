// projectPlane.f.glsl — Fragment shader for project image planes.
// Scroll-velocity distortion + chromatic split on hover, plus a soft
// reveal ripple. The image is sampled with a UV that shifts with scroll
// speed and ripples on hover, so the plane reads as a lit surface reacting
// to the room rather than a flat poster.
// three.js built-ins: vUv, vWorldPosition (varyings).

precision highp float;

varying vec2 vUv;
varying vec3 vWorldPosition;

uniform sampler2D uTexture;
uniform float uTime;
uniform float uScrollVel;
uniform float uHover;
uniform float uRipple;
uniform float uChroma;
uniform float uBrightness;
uniform float uContrast;

float hash(vec2 p) {
  vec3 h = vec3(p.x, p.y, 1.0) * vec3(127.1, 311.7, 74.7);
  return fract(fract(dot(h, vec3(17.0, 59.0, 113.0))) * 433.75);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

void main() {
  vec2 uv = vUv;

  // Scroll-velocity distortion: the image shears with scroll speed, stronger
  // at the edges (chromatic-ish split).
  float vel = clamp(uScrollVel * 0.0015, -0.05, 0.05);
  uv.x += vel * (vUv.y - 0.5) * 2.0;
  uv.y += vel * 0.25;

  // Hover ripple: concentric rings expanding from the plane centre.
  float ripple = uRipple;
  if (ripple > 0.0) {
    float d = distance(vUv, vec2(0.5, 0.5));
    float ring = abs(sin(d * 22.0 - uTime * 8.0 * ripple)) * ripple;
    uv.y += ring * 0.02 * (1.0 - d);
    uv.x += ring * 0.012 * (1.0 - d);
  }

  // Chromatic split on hover.
  float split = uChroma * uHover;
  vec2 off = vec2(split, 0.0);
  vec3 c;
  c.r = texture2D(uTexture, uv + off).r;
  c.g = texture2D(uTexture, uv).g;
  c.b = texture2D(uTexture, uv - off).b;

  // Brightness / contrast.
  c = (c - 0.5) * uContrast + 0.5;
  c = c * uBrightness;

  // Vignette the plane so it reads as a lit object, not a poster.
  float vig = 1.0 - smoothstep(0.55, 1.2, distance(vUv, vec2(0.5)));
  c *= mix(0.35, 1.0, vig);

  gl_FragColor = vec4(c, 1.0);
}