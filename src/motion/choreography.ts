// Choreography — the single scroll-driven reveal engine.
// Everything here is driven by GSAP ScrollTrigger, which is synced to Lenis
// in App.tsx. No React state per scroll event: ScrollTrigger handles the
// scrubbing, and we only kill/refresh on resize.
//
// Three primitives:
//   reveal(el, opts)     — fade + translate in as the element enters the viewport
//   pin(el, opts)        — pin an element while a scrubbed timeline plays
//   stagger(el, opts)    — reveal children one at a time as you scroll through
//
// All start states are applied inline so content is never hidden if JS fails;
// the GSAP timeline only animates TO the visible state.

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export interface RevealOpts {
  start?: string;
  end?: string;
  scrub?: boolean | number;
  y?: number;
  opacity?: number;
  duration?: number;
  stagger?: number;
  scale?: number;
  toggleActions?: string;
}

// Reveal one element (or its [data-reveal] children) as it enters the viewport.
export function reveal(el: HTMLElement | null, opts: RevealOpts = {}): () => void {
  if (!el) return () => {};

  const {
    start = 'top 88%',
    end = 'bottom 12%',
    scrub = true,
    y = 64,
    opacity = 0,
    duration = 0.9,
    stagger = 0,
    scale = 1,
    toggleActions = 'play none none none',
  } = opts;

  const children = el.querySelectorAll('[data-reveal]') as NodeListOf<HTMLElement>;
  const targets: HTMLElement[] = children.length ? Array.from(children) : [el];

  // Start every target in its hidden state. If JS never runs, the inline
  // style keeps it visible — this is the preservation contract.
  gsap.set(targets, { opacity, y, scale });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: el,
      start,
      end,
      scrub,
      toggleActions,
    },
  });

  targets.forEach((t, i) => {
    tl.to(
      t,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: scrub ? 1 : duration,
        ease: 'power2.out',
      },
      stagger ? i * stagger : 0
    );
  });

  return () => {
    tl.kill();
  };
}

export interface PinOpts {
  scrub?: number | boolean;
  start?: string;
  end?: string;
  endTrigger?: string | HTMLElement | null;
}

// Pin an element in place while a scrubbed timeline plays through its content.
// The pin holds the element at the top of the viewport for the duration.
export function pin(el: HTMLElement | null, opts: PinOpts = {}): () => void {
  if (!el) return () => {};

  const { scrub = 1, start = 'top 0', end = 'bottom+=140%' } = opts;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: el,
      start,
      end,
      pin: true,
      scrub,
      anticipate: 0.5,
    } as any,
  });

  // Fade the pinned element's own children in as the pin holds.
  const kids = el.querySelectorAll('[data-reveal]') as NodeListOf<HTMLElement>;
  if (kids.length) {
    gsap.set(kids, { opacity: 0, y: 40 });
    tl.to(
      Array.from(kids),
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.12 },
      0.1
    );
  }

  return () => {
    tl.kill();
  };
}

// Parallax a background layer against scroll — subtle, never distracting.
export function parallax(el: HTMLElement | null, factor = 0.18): () => void {
  if (!el) return () => {};

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });

  tl.to(el, { y: -window.innerHeight * factor, ease: 'none', duration: 1 });

  return () => {
    tl.kill();
  };
}

// Refresh all ScrollTrigger instances — call on resize / orientation change.
export function refreshAll(): void {
  ScrollTrigger.refresh();
}

// Kill every ScrollTrigger — call on unmount or route change.
export function killAll(): void {
  ScrollTrigger.getAll().forEach(t => t.kill());
}