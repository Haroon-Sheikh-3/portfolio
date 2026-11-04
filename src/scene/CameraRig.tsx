// CameraRig — the single camera journey.
// The camera travels along a CatmullRom spline whose parameter is driven by
// the master scroll progress (smoothed). Per-chapter look-at targets and a
// small damped pointer parallax give the space life without ever feeling
// chaotic. All motion here is in useFrame; nothing re-renders React.
import { useEffect, useRef, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CatmullRomCurve3 } from 'three';
import { scroll, chapter, pointer } from '@state/store';

// Spline control points. A slow, low, cinematic path that starts near the
// artifact, pushes in for the About pin, arcs around for Skills, sweeps
// laterally through the Projects gallery, and pulls back for Contact.
const PATH_POINTS: THREE.Vector3[] = [
  new THREE.Vector3(0.0, 1.2, 9.0),   // 0.00 Hero — looking at the artifact from the front
  new THREE.Vector3(-1.5, 0.6, 7.0),  // 0.18 Hero exit
  new THREE.Vector3(-2.5, 0.0, 5.0),  // 0.30 About — push in
  new THREE.Vector3(-2.0, -0.5, 3.5), // 0.45 About mid
  new THREE.Vector3(0.0, -1.0, 2.0),  // 0.60 Skills — orbit around
  new THREE.Vector3(3.0, -0.5, 2.5),  // 0.75 Projects — sweep laterally
  new THREE.Vector3(5.0, 0.0, 4.0),   // 0.90 Projects end
  new THREE.Vector3(3.5, 1.5, 7.0),   // 1.00 Contact — pull back to horizon
];

// Look-at targets per path parameter, for a smooth gaze.
const LOOK_TARGETS: THREE.Vector3[] = [
  new THREE.Vector3(0.0, 0.0, 0.0),
  new THREE.Vector3(0.0, 0.0, 0.0),
  new THREE.Vector3(0.0, 0.0, 0.0),
  new THREE.Vector3(0.0, 0.0, 0.0),
  new THREE.Vector3(0.0, 0.0, 0.0),
  new THREE.Vector3(0.0, 0.0, 0.0),
  new THREE.Vector3(0.0, 0.0, 0.0),
  new THREE.Vector3(0.0, 1.0, 0.0),
];

export function CameraRig() {
  const { camera } = useThree();
  const spline = useMemo(() => new CatmullRomCurve3(PATH_POINTS, false, 'catmullrom', 0.5), []);
  const target = useMemo(() => new THREE.Vector3(), []);
  const lookAt = useMemo(() => new THREE.Vector3(), []);
  const dampPointer = useRef(new THREE.Vector2(0, 0));
  const t = useRef(0); // smoothed path parameter
  const lastProgress = useRef(0);

  // Pointer parallax target (normalized -1..1). Written to the shared
  // store so the artifact can tilt too — one listener, not duplicates.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (window.matchMedia('(pointer: coarse)').matches) return;
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useFrame((_state, delta) => {
    if ((_state as any).__diagCam === undefined) (_state as any).__diagCam = 0;
    if ((_state as any).__diagCam < 3) {
      console.log('[DIAG CameraRig] frame', (_state as any).__diagCam, 'camera pos', camera.position.x, camera.position.y, camera.position.z);
      (_state as any).__diagCam++;
    }
    const p = scroll.progress;
    // Smooth the path parameter so the camera never snaps.
    t.current += (p - t.current) * Math.min(1, delta * 2.2);

    const pos = spline.getPoint(t.current, target);
    camera.position.lerp(pos, Math.min(1, delta * 6));

    // Damped pointer parallax: a small offset on the camera's right/up.
    dampPointer.current.x += (pointer.x - dampPointer.current.x) * Math.min(1, delta * 3);
    dampPointer.current.y += (pointer.y - dampPointer.current.y) * Math.min(1, delta * 3);
    camera.position.x += dampPointer.current.x * 0.5;
    camera.position.y += dampPointer.current.y * 0.35;

    // Look at a point interpolated along the look targets.
    const idx = Math.min(LOOK_TARGETS.length - 1, Math.floor(t.current * (LOOK_TARGETS.length - 1)));
    const frac = t.current * (LOOK_TARGETS.length - 1) - idx;
    const a = LOOK_TARGETS[idx];
    const b = LOOK_TARGETS[idx + 1] || a;
    lookAt.set(
      a.x + (b.x - a.x) * frac,
      a.y + (b.y - a.y) * frac,
      a.z + (b.z - a.z) * frac
    );
    lookAt.x += dampPointer.current.x * 0.4;
    lookAt.y += dampPointer.current.y * 0.25;

    camera.lookAt(lookAt);

    // Track direction for scroll velocity.
    scroll.direction = p > lastProgress.current ? 1 : p < lastProgress.current ? 0 : scroll.direction;
    scroll.velocity = (p - lastProgress.current) / Math.max(0.0001, delta);
    lastProgress.current = p;

    // Update chapter index from progress.
    const chIdx = Math.min(5, Math.floor(p * 6));
    if (chIdx !== chapter.index) chapter.index = chIdx;
    chapter.progress = (p * 6) - Math.floor(p * 6);
  });

  return null;
}