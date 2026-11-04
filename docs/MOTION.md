# MOTION.md — Choreography Language

## Ownership
- **GSAP ScrollTrigger**: scroll progress, pinning, DOM reveals, section
  transitions, page transitions. Single source of truth for scroll.
- **R3F `useFrame`**: per-frame 3D — idle motion, pointer damping, camera
  interpolation, uniforms.
- **CSS**: static styling, focus rings, simple hover transitions.
- **Lenis**: smooth scroll, synced to GSAP. Native scroll on touch.

## Easings (custom, defined in `src/motion/easings.ts`)
| Name | Curve | Use |
|---|---|---|
| `cinematicOut` | long ease-out, ~1.2s feel | reveals, camera moves, section transitions |
| `snappy` | 400ms ease-out, slight overshoot | UI taps, magnetic pull, button states |
| `springy` | spring overshoot, used rarely | the one "pop" moment — e.g. artifact fracture |
| `linear` | linear | continuous idle orbits, dust drift, grain |

## Duration scale
- UI: 200–450 ms
- Reveals: 700–1400 ms
- Camera moves: tied to scroll, smoothed (never 1:1 — lagSmoothing)
- Idle: slow, small, tied to scene logic (1–2 deg/s rotation, breathing light)

## Stagger logic
- Words stagger ~60–90 ms, lines ~120 ms.
- Group by semantic unit (a sentence = one stagger group), not by character.
- At any moment ONE thing is the hero of motion; everything else is calm.

## Hierarchy of motion
1. **Hero of motion** — the thing the eye is meant to follow right now.
2. **Supporting** — moving, but slower/quieter, clearly secondary.
3. **Calm** — static or imperceptible idle (dust, grain, 1 deg/s orbit).

## Scroll → 3D bridge
One master `scroll.progress` (0..1) written by GSAP into `src/state/store.ts`.
R3F reads it in `useFrame`. Never push scroll ticks through React state.

## Per-chapter choreography

### Ch1 Hero
- Light ignites and sweeps across the artifact as `progress` 0 → 0.18.
- Name resolves word-by-word with mask reveal, `progress` 0.05 → 0.30.
- Mono meta line fades in at `progress` 0.22 → 0.40.
- Artifact tilts toward pointer with damped parallax (always, idle).
- Dust motes drift through the light beam (continuous, slow).
- Scroll cue designed, not a bouncing arrow, appears at `progress` 0.55.

### Ch2 About (pinned)
- Section pins. Camera pushes toward artifact as sentences reveal word-by-word,
  tied to scroll. Words light up dim → full as you scroll.
- Supporting facts appear as small mono annotations floating around the artifact
  like instrument labels.
- Exit: artifact dissolves as the camera passes through (springy overshoot).

### Ch3 Skills
- Orbital instrument, grouped by real categories. Slow idle orbit (linear).
- Hover/focus brings a node forward (snappy), reveals what's been built.
- Magnetic pull toward pointer (damped spring, bounded radius).
- Keyboard + screen-reader DOM list integrated, visually the same nodes.

### Ch4 Projects
- Pinned horizontal passage. Each project a lit plane with a custom shader:
  scroll-velocity distortion + chromatic split, hover ripple.
- Click morphs into case study via GSAP Flip shared-element + camera dolly.
- Mobile: vertical thumb-friendly sequence, same atmosphere.

### Ch5 Experience
- Lit path / timeline the camera travels along. Light trail advances with scroll.
- Milestones appear as annotations along the path.

### Ch6 Contact
- Camera pulls back to a lit horizon. Huge display line, magnetic CTA.
- Copy-email-to-clipboard with animated feedback.
- Footer is a designed finale.

## Reduced motion
When `prefers-reduced-motion: reduce`:
- No smooth-scroll hijack, no pinning, no parallax, no kinetic text.
- Scene becomes a calm, mostly static composition with gentle crossfades.
- Visible in-page toggle to re-enable (off by default in reduced mode).