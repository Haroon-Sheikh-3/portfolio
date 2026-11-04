// Mutable store. R3F reads these in useFrame; GSAP writes them on scroll.
// No React state per scroll event — that would re-render the whole tree.

export const scroll = {
  progress: 0, // 0..1 master progress along the whole page
  velocity: 0, // current scroll velocity (px/frame-ish), signed
  direction: 0, // -1 up, +1 down
};

export const chapter = {
  index: 0, // which chapter is active
  progress: 0, // 0..1 within the active chapter
};

// Pointer position, normalized -1..1. Updated on pointermove in App.tsx.
// Read by the artifact's tilt in useFrame — no React state per move.
export const pointer = {
  x: 0,
  y: 0,
};

// Device / motion state — updated once at mount, read by components.
export const device = {
  reducedMotion: false,
  tier: 'high' as 'high' | 'medium' | 'low',
};

// React hook to subscribe to device changes. Simple: we read once at mount.
import { useState, useEffect } from 'react';
import { detectDevice } from '@state/device';

export function useStore() {
  const [reducedMotion, setReducedMotion] = useState(device.reducedMotion);
  const [tier, setTier] = useState(device.tier);

  useEffect(() => {
    const d = detectDevice();
    device.reducedMotion = d.reducedMotion;
    device.tier = d.tier;
    setReducedMotion(d.reducedMotion);
    setTier(d.tier);
  }, []);

  return { reducedMotion, tier };
}

// Reset both. Called on route change / resize / reduced-motion toggle.
export function resetStore() {
  scroll.progress = 0;
  scroll.velocity = 0;
  scroll.direction = 0;
  chapter.index = 0;
  chapter.progress = 0;
  pointer.x = 0;
  pointer.y = 0;
}