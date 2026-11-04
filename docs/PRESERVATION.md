# PRESERVATION.md — What Must Survive

Status at Phase 0: **No existing site or content exists.** The working directory
`C:\Users\HaroonSheikh\Desktop\claude test 2` was empty at project start.
There is no prior build to preserve, no legacy folder to keep, no `.git` repo.

This doc therefore defines the **preservation contract for the new site** —
everything that, once built, must never be lost or broken by later phases.

## 1. Real content (must be supplied by the owner — see final report)
The brief forbids inventing facts about the person, clients, metrics, jobs or
testimonials. The following slots are therefore **clearly-marked placeholders**
in the build and must be replaced with real material before launch:

| Slot | Placeholder marker | Owner must supply |
|---|---|---|
| Name | `[PLACEHOLDER: name]` | Real name |
| Role / what I do | `[PLACEHOLDER: role]` | One-line role |
| Location | `[PLACEHOLDER: location]` | City / timezone |
| Bio (2–3 sentences) | `[PLACEHOLDER: bio]` | Real biography |
| Projects (name, outcome, links) | `[PLACEHOLDER: project N]` | Real projects with live URLs |
| Skills / stacks actually used | `[PLACEHOLDER: stack]` | Real tech, grouped by category |
| Achievements / journey milestones | `[PLACEHOLDER: milestone N]` | Real shipped work |
| Contact method | `[PLACEHOLDER: contact]` | Email / form / socials |
| Social links | `[PLACEHOLDER: social]` | Real profile URLs |
| Availability status | `[PLACEHOLDER: availability]` | Real status |

## 2. Non-negotiable behaviour to preserve across all phases
- **Contact path** must remain working and obvious in Chapter 6 (contact).
- **Social links** and **project links** must be real, working, external URLs.
- **SEO / meta**: titles, descriptions, OG/Twitter image, canonical, structured
  data (`Person`), sitemap, robots.txt.
- **Favicon** — must exist and be designed, not a default browser icon.
- **Analytics** — if the owner wants it, wired in a way that does not block
  first paint (deferred/async, not render-blocking).
- **Resume download** — if a resume exists, a real downloadable file.
- **Existing URLs** — none exist yet; any URL chosen now becomes the canonical
  one and must not change without an update here.
- **`<noscript>` content** — every chapter must render meaningful content with
  JavaScript disabled.
- **No content hidden by default** — initial hidden states are applied by JS at
  runtime, never in CSS, so a non-JS or pre-render capture still sees all text.

## 3. Non-destructive working rules (obeyed throughout)
- All work happens on a new git branch. The existing state is never deleted or
  overwritten.
- No global installs, no force pushes, no destructive config changes.
- Every phase ends with a runnable site + git commit + PROGRESS.md update.

## 4. Verification checklist (walked item by item at the end)
- [ ] Every placeholder above is flagged in the final report.
- [ ] Contact path works (tested by click).
- [ ] Every project link is live.
- [ ] Every social link is live.
- [ ] `<title>`, meta description, OG image, canonical present.
- [ ] Structured `Person` data valid.
- [ ] Favicon present and distinct.
- [ ] `<noscript>` renders all chapters.
- [ ] No content is hidden behind JS in a no-JS capture.