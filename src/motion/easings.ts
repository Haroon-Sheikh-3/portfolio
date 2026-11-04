// Custom easings. Defined once, used everywhere. No linear-default sloppiness.

// Long cinematic ease-out. Starts fast, settles slowly — the "camera" feel.
export const cinematicOut = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  if (t === 0) return 0;
  if (t === 1) return 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

// Snappy UI ease. 400ms feel, slight overshoot.
export const snappy = (t: number) => {
  const c1 = 1.4;
  const c3 = c1 + 1;
  if (t === 0) return 0;
  if (t === 1) return 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

// Springy overshoot — used rarely, for the one "pop" moment.
export const springy = (t: number) => {
  const c1 = 1.2;
  const c3 = c1 + 1;
  if (t === 0) return 0;
  if (t === 1) return 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

// Soft ease-in-out for camera interpolation.
export const softInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

// GSAP Power2-style ease-out, used for scroll-tied reveals.
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

// Map a 0..1 progress to a delayed window [start, end].
export function windowProgress(p: number, start: number, end: number): number {
  if (p <= start) return 0;
  if (p >= end) return 1;
  return (p - start) / (end - start);
}

// Durations (ms)
export const DUR = {
  ui: 280,
  uiFast: 180,
  reveal: 900,
  revealFast: 600,
  camera: 1400,
  transition: 1100,
} as const;

// Stagger (ms)
export const STAGGER = {
  word: 70,
  line: 130,
  node: 90,
} as const;