// Device capability detection. Runs once at app mount. No reactivity — the
// tier is read by scene components at init and by the performance gate.

export type Tier = 'high' | 'medium' | 'low';

export interface Device {
  tier: Tier;
  dpr: number;
  coarsePointer: boolean;
  reducedMotion: boolean;
  cores: number;
  memory: number; // GB, 0 if unknown
  webgl: boolean;
}

function detectWebgl(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

function guessCores(): number {
  return navigator.hardwareConcurrency || 4;
}

function guessMemory(): number {
  // deviceMemory is in GB; undefined on many browsers.
  const mem = (navigator as any).deviceMemory;
  return typeof mem === 'number' ? mem : 0;
}

export function detectDevice(): Device {
  const coarsePointer =
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: coarse)').matches;
  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const webgl = detectWebgl();
  const cores = guessCores();
  const memory = guessMemory();

  // Tiering. Conservative: this machine's SwiftShader backend is the binding
  // constraint, so even "high" is modest.
  let tier: Tier = 'high';
  if (reducedMotion || !webgl) tier = 'low';
  else if (coarsePointer || cores <= 4 || (memory > 0 && memory < 4)) {
    tier = 'low';
  } else if (cores <= 6 || (memory > 0 && memory < 8)) {
    tier = 'medium';
  }

  return {
    tier,
    dpr: tier === 'high' ? 1.75 : tier === 'medium' ? 1.5 : 1.25,
    coarsePointer,
    reducedMotion,
    cores,
    memory,
    webgl,
  };
}