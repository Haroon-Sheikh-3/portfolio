// ShaderMaterial wrappers for the three.js scene.
// Each material declares ONLY the uniforms its shader uses. Uniforms are
// updated from R3F useFrame via refs — no per-frame allocations.

import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import artifactV from '@shaders/artifact.v.glsl';
import artifactF from '@shaders/artifact.f.glsl';
import projectPlaneV from '@shaders/projectPlane.v.glsl';
import projectPlaneF from '@shaders/projectPlane.f.glsl';
import dustV from '@shaders/dust.v.glsl';
import dustF from '@shaders/dust.f.glsl';

export const ArtifactMaterial = shaderMaterial(
  {
    uTime: 0,
    uEmber: new THREE.Color(0.72, 0.16, 0.45),
    uRimPower: 2.4,
    uBodyDarkness: 1.0,
    uNoiseScale: 1.6,
    uGlow: 0.5,
    uLightPos: new THREE.Vector3(4, 5, 6),
    uLightColor: new THREE.Color(1.0, 0.72, 0.45),
  },
  artifactV,
  artifactF
);

export const ProjectPlaneMaterial = shaderMaterial(
  {
    uTexture: null,
    uTime: 0,
    uScrollVel: 0,
    uHover: 0,
    uRipple: 0,
    uChroma: 0.02,
    uBrightness: 1.0,
    uContrast: 1.15,
  },
  projectPlaneV,
  projectPlaneF
);

export const DustMaterial = shaderMaterial(
  {
    uPixelRatio: 1,
  },
  dustV,
  dustF
);

// Forward-declare types so consumers get TS types.
export type ArtifactMaterialImpl = typeof ArtifactMaterial;
export type ProjectPlaneMaterialImpl = typeof ProjectPlaneMaterial;
export type DustMaterialImpl = typeof DustMaterial;