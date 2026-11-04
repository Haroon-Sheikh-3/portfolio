# ARCHITECTURE.md — Stack & Ownership

## Stack decisions
| Layer | Choice | Why |
|---|---|---|
| Build | Vite 8 + TypeScript | Fast dev, ES2020 target, code-splitting by route/chunk |
| UI | React 18 + Tailwind v4 | Component model for a one-page experience; Tailwind for tokens + layout only |
| Routing | none (SPA) | One continuous experience; no real routes needed |
| 3D | three 0.187 + R3F 9 + drei 10 | Declarative scene; drei for helpers only (PerformanceMonitor, useProgress, Preload, Html) |
| Motion | GSAP 3 + ScrollTrigger + Lenis | Single owner of scroll choreography; Lenis for smooth scroll synced to GSAP |
| Shaders | GLSL via vite-plugin-glsl, `src/shaders/*.glsl` | Custom, commented, each earns its place |
| State | Plain mutable module (`src/state`) | No per-scroll React re-renders |
| Fonts | Self-hosted subset, Fontshare/Google Fonts | `font-display: swap`, preload critical weights |

## What was deliberately left out
- **framer-motion** — no job GSAP can't do cleanly. Two animation systems on one
  element is a bug.
- **anime.js, Locomotive, Barba, jQuery** — overlapping scroll/motion libs.
- **Heavy HDR/IBL environment** — procedural Lightformer-based lighting instead.
  Ships ~0 bytes of environment texture.
- **Postprocessing stack** — none unless justified. If used: minimal
  (bloom + vignette/grain), tier-gated, off on low.
- **MeshTransmissionMaterial** — expensive; avoided entirely, the look is faked
  with fresnel + rim + haze.
- **Second 3D library** — only three + R3F + drei.

## Ownership matrix
| Concern | Owner |
|---|---|
| Scroll progress, pinning, DOM reveals, section transitions | GSAP ScrollTrigger |
| Smooth scroll | Lenis, synced to GSAP |
| Per-frame 3D (idle, pointer, camera, uniforms) | R3F `useFrame` |
| Scroll → 3D bridge | ONE master `scroll.progress` in `src/state/store.ts` |
| Static styling, focus rings, hover transitions | CSS / Tailwind |

## Scene architecture
- ONE persistent fixed `<Canvas>` behind the DOM, behind a full-page container.
- Camera rig follows a CatmullRom spline path; position along path driven by
  master progress.
- Per-chapter scene states: light colour/intensity, fog density, object
  visibility/transform.
- Canvas pauses when tab hidden / off-screen, caps DPR (1–1.75 adaptive), degrades
  by tier.

## Folder structure
```
src/
  app/            App shell, providers, providers
  scene/          Rig, Artifact, Environment, Particles, Skills, ProjectPlanes
  shaders/        .glsl files with headers
  sections/       Chapter components (Hero, About, Skills, Projects, Experience, Contact)
  components/     Nav, Cursor, Magnetic, SplitText, Loader, Button
  motion/         easings, durations, hooks, choreography per chapter
  state/          scroll store, device tier
  content/        typed content data — the ONLY place copy lives
public/
  fonts/          self-hosted font files
  models/         optimised GLB (Draco/meshopt)
  images/         project images, OG image
```

## Performance budgets
- Initial JS before the 3D chunk: < ~200 KB gzip
- 3D + motion lazy-loaded
- CLS < 0.05; LCP < 2.5 s on throttled mobile; 60 fps target mid laptop,
  ≥ 30 fps mid phone; INP < 200 ms
- WebGL failure → beautiful static CSS/SVG fallback, all content usable
- No per-frame allocations; dispose resources on unmount

## Dependency justification
- `three` / `@react-three/fiber` / `@react-three/drei` — the 3D scene.
- `gsap` / `@gsap/react` — scroll choreography.
- `lenis` — smooth scroll.
- `maath` — damp/easing helpers for 3D.
- `vite-plugin-glsl` — compile GLSL at build.
- `tailwindcss` v4 + `@tailwindcss/postcss` — tokens/layout.
- No other dependencies. `lil-gui`/`leva` are dev-only and removed before final.