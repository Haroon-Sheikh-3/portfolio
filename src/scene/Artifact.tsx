// Artifact — the obsidian monolith at the heart of the space.
// A dark, faceted body with an ember fresnel rim and a warm specular key.
// Tilts toward the pointer with damped parallax; slow idle rotation.
// Mesh geometry is reused across instances via shared buffers.
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ArtifactMaterial } from '@shaders/materials';
import { scroll, pointer } from '@state/store';

export function Artifact() {
  const meshRef = useRef<THREE.Mesh>(null);

  // Icosahedron-ish faceted body. Low poly so the facets catch the rim light.
  const geometry = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(1.0, 2);
    // Slightly squash vertically so it reads as a standing monolith.
    g.scale(1.0, 1.15, 0.85);
    g.computeVertexNormals();
    return g;
  }, []);

  // The shader material is a three.js instance, not a React component —
  // attach it via <primitive> so R3F doesn't try to render it as one.
  const material = useMemo(() => new ArtifactMaterial(), []);
  const tilt = useRef(new THREE.Vector2(0, 0));
  const idleRot = useRef(0);

  useFrame((state, delta) => {
    const m = meshRef.current;
    if (!m) return;

    // DIAG: log first few frames to confirm rendering is alive
    if ((state as any).__diag !== undefined) {
      if ((state as any).__diag < 3) {
        console.log('[DIAG Artifact] frame', (state as any).__diag, 'mesh pos', m.position.x, m.position.y, m.position.z, 'rot', m.rotation.y, 'mat.uGlow', material.uGlow);
        (state as any).__diag++;
      }
    } else {
      (state as any).__diag = 0;
    }

    // Idle rotation: very slow, tied to scene logic.
    idleRot.current += delta * 0.15;
    m.rotation.y = idleRot.current;

    // Damped pointer tilt — tracks the shared pointer store, not a local ref.
    tilt.current.x += (pointer.x - tilt.current.x) * Math.min(1, delta * 2.5);
    tilt.current.y += (pointer.y - tilt.current.y) * Math.min(1, delta * 2.5);
    m.rotation.x = tilt.current.y * 0.6;
    m.rotation.z = -tilt.current.x * 0.6;

    // Scroll-reactive: as you scroll, the artifact breathes slightly and
    // its glow rises — a living light source, not a static prop.
    const s = scroll.progress;
    const glow = 0.35 + Math.sin(s * Math.PI) * 0.25 + 0.1;
    material.uGlow = glow;
    material.uBodyDarkness = 1.0 - s * 0.15;
    material.uTime = state.clock.elapsedTime;
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <primitive object={material} />
    </mesh>
  );
}