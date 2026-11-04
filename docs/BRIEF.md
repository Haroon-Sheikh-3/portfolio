# BRIEF.md — Creative Direction

## Concept: "Ember & Obsidian"
A vast dark room with one warm, living light source. An obsidian/glass artifact
floats in volumetric haze, rim-lit in ember tones, reacting to the pointer. The
camera moves through the space as you scroll. Each section is a *place*, not a
slide.

**Why this concept** (default, per brief section 4): the project has no existing
content to draw a competing concept from, and the brief explicitly permits the
default. The concept is also a direct metaphor for the work itself — a developer
who builds clean, deliberate interfaces: dark canvas, one warm light of
functionality, glass and obsidian precision. It is *not* a template concept; it is
a lighting and material study, which is what a cinematic portfolio should be.

## Palette (OKLCH, CSS variables)
| Role | Value | Use |
|---|---|---|
| Obsidian base | `oklch(0.055 0.008 270)` | Page background, canvas void |
| Ash | `oklch(0.13 0.01 270)` | Section surfaces, card backs |
| Ember warm | `oklch(0.72 0.16 45)` | Primary accent — the light source |
| Ember glow | `oklch(0.85 0.18 45)` | Highlight, rim light, CTA |
| Cool depth | `oklch(0.62 0.10 235)` | Counter-tone for depth, secondary links |
| Warm white | `oklch(0.93 0.03 70)` | Body text |
| Dim white | `oklch(0.55 0.02 70)` | Secondary text, meta |
| Mono ink | `oklch(0.20 0.005 270)` | Utility text on light surfaces |

Never pure `#000` or `#fff`. Never purple/blue AI gradients. Never neon cyan.

## Typography
- **Display**: *Fraunces* (Fontshare) — a serif with real character, used for
  hero and chapter titles. Variable-ish; display weights only.
- **Text**: *Inter Tight* (self-hosted from Google Fonts) — wait, banned. Use
  **Neue Haas Grotesk Display / Helvetica Now** — no, banned list is Inter, Roboto,
  Poppins, Space Grotesk, system-ui. Choose **Sora** (display-ish) + **JetBrains
  Mono** for utility. Final: **Sora** (Fontshare) for text, **Fraunces** for
  display, **JetBrains Mono** for utility/labels.
- Self-hosted, subset, `font-display: swap`, preload critical weights.
- Fluid scale with `clamp()`, 6+ steps. Display sizes genuinely huge on desktop,
  controlled on mobile. Tuned letter-spacing and line-height. `text-wrap:
  balance`, curly quotes, real dashes, tabular numerals.

## Lighting language
- Key: warm ember, soft, from upper-front-right, falloff.
- Rim: ember, on the artifact edge, fresnel-driven.
- Fill: cool depth, very low, from the left — gives the dark room temperature.
- Volumetric: haze layers at varying depth, not a flat fog.
- Shadows: cast with depth, soft at the edges.
- Film grain + vignette layer, GPU-cheap, very subtle.

## Layout language
- Real grid. Dramatic scale contrast: tiny mono meta vs enormous display.
- Asymmetry, overlap, generous negative space.
- Never a centered hero with two buttons.
- Never icon-title-blurb rows, never skill bars, never rounded card grids.

## Five signature moments (spec)
1. **Hero ignite** — black, warm light sweeps across the artifact, name resolves
   word-by-word with mask reveals, quiet mono meta line. Dust motes drift.
2. **About pin** — camera pushes in; 2–3 sentences reveal word-by-word tied to
   scroll; supporting facts as floating mono annotations. Exit: artifact
   dissolves as camera passes through.
3. **Skills constellation** — physical orbital arrangement grouped by real
   categories; hover/focus brings a node forward with what's been built; magnetic
   pull; slow idle orbit. Keyboard + screen-reader DOM list integrated.
4. **Projects gallery** — pinned horizontal passage, each project a lit plane with
   scroll-velocity distortion shader; click morphs into case study via shared
   element + camera dolly.
5. **Contact finale** — camera pulls back to lit horizon; huge display line,
   magnetic CTA, copy-email-to-clipboard with animated feedback, availability,
   socials, designed footer.