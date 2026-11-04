# Progress Log — Ember & Obsidian Portfolio

## Phase 0: Recon & Brief
- **Status:** Complete
- **Artifacts:** `docs/BRIEF.md`, `docs/ARCHITECTURE.md`, `docs/MOTION.md`, `docs/PRESERVATION.md`
- **Notes:** Established cinematic Awwwards-tier visual language, OKLCH palette, custom self-hosted fonts, and zero-compromise preservation contract.

## Phase 1: Static Composition First
- **Status:** Complete
- **Artifacts:**
  - `src/sections/Chapter1Hero.tsx`
  - `src/sections/Chapter2About.tsx`
  - `src/sections/Chapter3Skills.tsx`
  - `src/sections/Chapter4Projects.tsx`
  - `src/sections/Chapter5Experience.tsx`
  - `src/sections/Chapter6Contact.tsx`
  - `src/components/ChapterNav.tsx`
- **Notes:** All six chapters built as fully responsive DOM sections using real placeholder content from `src/content/content.ts`. Zero animation reliance for core readability.

## Phase 2: 3D Foundation
- **Status:** Complete
- **Artifacts:**
  - `src/scene/SceneCanvas.tsx`
  - `src/scene/CameraRig.tsx`
  - `src/scene/Artifact.tsx`
  - `src/shaders/materials.ts`
- **Notes:** Persistent fixed Canvas with adaptive DPR, CatmullRom spline camera journey, icosahedron monolith artifact with scroll-reactive glow and body darkening. Shader integrity verified.

## Phase 3: Choreography & Motion
- **Status:** Complete
- **Artifacts:**
  - `src/motion/choreography.ts` — centralized scroll-driven reveal engine (`reveal`, `pin`, `parallax`, `refreshAll`, `killAll`)
  - `src/App.tsx` — Lenis + GSAP ScrollTrigger bridge, shared `pointer` store, `__lenis` exposed for nav
  - `src/state/store.ts` — added shared `pointer` store (normalized -1..1)
  - `src/scene/CameraRig.tsx` — spline camera reads shared pointer; look-at targets now `THREE.Vector3`
  - `src/scene/Artifact.tsx` — damped tilt reads shared pointer; material attached via `<primitive>`
  - `src/sections/Chapter1Hero.tsx` — word-stagger name reveal + scroll-driven meta reveal
  - `src/sections/Chapter2About.tsx` — pinned narrative panel with staggered body reveal
  - `src/sections/Chapter3Skills.tsx` — staggered card grid reveal
  - `src/sections/Chapter4Projects.tsx` — staggered project card reveal
  - `src/sections/Chapter5Experience.tsx` — staggered milestone timeline reveal
  - `src/sections/Chapter6Contact.tsx` — headline + detail card stagger reveal
  - `src/components/ChapterNav.tsx` — active chapter indicator, Lenis-smooth chapter jumps
  - `src/components/CustomCursor.tsx` — ember dot + ring, damped, hover scaling
- **Notes:** All reveals are GSAP ScrollTrigger scrubbed timelines — no React state per scroll event. Content is never hidden by default; JS only animates toward visible states. `tsc --noEmit` green, `vite build` green.

## Next Steps
- Phase 4: Showpieces (case-study modal morph, shader-driven project planes, contact finale)
- Phase 5: Polish & QA hardening (Playwright verification, performance tuning)
- Phase 6: Lighthouse / bundle / perf budget verification
- Phase 7: Definition of done
- Phase 8: Final report