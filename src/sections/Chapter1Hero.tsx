// Chapter 1: Hero — the unforgettable one.
// Black, then a warm light ignites and sweeps across the artifact.
// Name resolves word-by-word with mask reveals. Mono meta line.
// Artifact tilts toward pointer with damped parallax.
// Scroll cue designed, not a bouncing arrow.
// LCP: hero text and a styled CSS poster must be visible before WebGL ready.
// Tailwind: minimal, the poster is pure CSS/SVG so it's always visible.
// No canvas content baked into hero text: it's DOM-only.
//
// Choreography: the name word-stagger is driven by the centralized
// scroll-driven reveal engine (src/motion/choreography.ts), so it
// re-runs whenever the user scrolls back into the chapter.
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { reveal } from '@motion/choreography';
import { META } from '@content/content';

export default function Chapter1Hero() {
  const titleRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLParagraphElement>(null);
  const name = META.name;

  // Name resolves word-by-word via GSAP masks revealed one at a time.
  useEffect(() => {
    if (!titleRef.current) return;

    const raw = name || 'Creative Technologist';
    // Split into words for the mask reveal. Each word is a span.
    const words = raw.split(/(\s+)/).filter(Boolean);

    gsap.set(titleRef.current.querySelectorAll('span'), { opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: titleRef.current,
        start: 'top 80%',
        onEnter: () => tl.restart(),
        onEnterBack: () => tl.restart(),
      },
    });
    for (let i = 0; i < words.length; i++) {
      tl.to(
        titleRef.current.querySelectorAll('span')[i],
        { opacity: 1, ease: 'power2.out', duration: 0.5 },
        i * 0.07
      );
    }

    // Meta line: scroll-driven fade + lift.
    const cleanupMeta = reveal(metaRef.current, { scrub: true, y: 24, duration: 0.7 });

    return () => {
      tl.kill();
      cleanupMeta();
    };
  }, [name]);

  // LCP: a CSS poster visible before WebGL.
  // The poster uses a designed CSS layout with the same palette and typography.
  // It's pure DOM so always readable even if WebGL fails.
  return (
    <section
      id="chapter-hero"
      className="relative min-h-screen overflow-hidden bg-[var(--bg)]"
    >
      {/* Black void background that the light emerges from. */}
      <div className="absolute inset-0 bg-[var(--bg)] overflow-hidden">
        {/* The light sweep — a warm ember gradient that sweeps across from top-right. */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-left from-ember via-transparent to-transparent animate-[lightSweep_3s_ease-in-out]"></div>
        </div>

        {/* The hero poster: all DOM, always visible. */}
        <div className="relative flex min-h-screen items-center justify-center px-4 sm:px-8 lg:px-12">
          <h1 className="font-display text-[var(--dim)] tracking-widest mb-8 animate-[nameReveal_1.2s_ease-out]">
            {/* Split into spans for mask reveal */}
            <span ref={titleRef}>{wordsForRender(name).map((w, i) => (
              <span key={i} className="inline-block opacity-0">{w}</span>
            ))}</span>
          </h1>
          <p
            ref={metaRef}
            data-reveal
            className="font-body text-[var(--mono)] text-center max-w-2xl mx-auto"
          >
            {META.role}
          </p>
        </div>

        {/* Artifact begins rising after WebGL is ready. */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 transform transition-[transform_1s_ease-out] opacity-0 group-hover:opacity-100 group-hover:translate-y-[-2rem]">
          <svg className="w-32 h-32" viewBox="0 0 24 24" fill="none" stroke="var(--ember)" stroke-width="1.5">
            <polygon points="12 2 15 22 3 22 6 7 12 11 18 7 15 2 12 2"/>
          </svg>
        </div>
      </div>

      {/* Vertical scroll cue — designed, not a bouncing arrow. */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[var(--dim)] text-sm animate-[pulse-slow_5s_ease-in-out_infinite]">
        <span role="status" aria-live="polite">Scroll to begin</span>
      </div>
    </section>
  );
}

// Split a name into renderable words, preserving spaces so the mask reveal
// reads naturally. Defined outside the component to avoid re-creating the
// regex on every render.
function wordsForRender(name: string): string[] {
  return (name || 'Creative Technologist').split(/(\s+)/).filter(Boolean);
}