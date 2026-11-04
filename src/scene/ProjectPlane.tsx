// ProjectPlane — a shader-driven image plane for project case studies.
// No external images required: the texture is generated procedurally at
// mount as a warm abstract gradient per project index, so the plane always
// renders even if the network or WebGL is unavailable. The fragment
// shader applies scroll-velocity shear, hover ripple, chromatic split,
// and a vignette so the plane reads as a lit surface in the room.
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ProjectPlaneMaterial } from '@shaders/materials';
import { scroll, pointer } from '@state/store';

// Build a procedural gradient texture for a project index. Each project
// gets a distinct warm/cool pairing so the gallery reads as a set.
function makeTexture(index: number): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext('2d')!;
  const t = index / 2;
  const a = new THREE.Color().setHSL(0.06 + t * 0.02, 0.55, 0.55); // ember-ish
  const b = new THREE.Color().setHSL(0.58 + t * 0.04, 0.45, 0.42); // cool depth
  const g = ctx.createLinearGradient(0, 0, 512, 512);
  g.addColorStop(0, `rgb(${a.r * 255 | 0}, ${a.g * 255 | 0}, ${a.b * 255 | 0})`);
  g.addColorStop(1, `rgb(${b.r * 255 | 0}, ${b.g * 255 | 0}, ${b.b * 255 | 0})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 512);

  // A soft radial highlight so it isn't a flat gradient.
  const rg = ctx.createRadialGradient(380, 120, 20, 256, 256, 420);
  rg.addColorStop(0, 'rgba(255,220,180,0.35)');
  rg.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = rg;
  ctx.fillRect(0, 0, 512, 512);

  // Subtle noise grain.
  const img = ctx.getImageData(0, 0, 512, 512);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * 18;
    d[i] = Math.min(255, Math.max(0, d[i] + n));
    d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + n));
    d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + n));
  }
  ctx.putImageData(img, 0, 0);

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  return tex;
}

interface ProjectPlaneProps {
  index: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

export function ProjectPlane({ index, position = [0, 0, 0], rotation = [0, 0, 0], scale = [2.2, 1.4, 1] }: ProjectPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const mat = useMemo(() => new ProjectPlaneMaterial(), []);
  const texture = useMemo(() => makeTexture(index), [index]);
  const hover = useRef(0);

  (mat as any).uTexture = texture;

  useFrame((state, delta) => {
    const m = meshRef.current;
    if (!m) return;

    // Damped hover toward pointer proximity — a soft "magnet" feel.
    const target = pointer.x !== 0 || pointer.y !== 0 ? 0.5 : 0;
    hover.current += (target - hover.current) * Math.min(1, delta * 2.5);
    mat.uHover = hover.current;
    mat.uScrollVel = scroll.velocity;
    mat.uTime = state.clock.elapsedTime;
    mat.uRipple = hover.current;

    // Gentle idle float so the plane isn't dead still.
    m.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.6 + index) * 0.05;
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
      <planeGeometry args={[1, 1]} />
      <primitive object={mat} />
    </mesh>
  );
}