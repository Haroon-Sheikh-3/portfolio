// Chapter 2: About — the origin story.
// A narrow vertical panel that pins in place while the user scrolls through
// the narrative, then releases. Fraunces intro headline, Sora body text,
// with a vertical divider. All content visible by default; the pin only
// holds the viewport so the copy can be read at a deliberate pace.
import { useEffect, useRef } from 'react';
import { resetStore } from '@state/store';
import { pin, reveal } from '@motion/choreography';
import { META } from '@content/content';

export default function Chapter2About() {
  const panelRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    resetStore();
    const cleanupPin = pin(panelRef.current, { scrub: 1 });
    const cleanupBody = reveal(bodyRef.current, { scrub: true, y: 32, duration: 0.8 });
    return () => {
      cleanupPin();
      cleanupBody();
    };
  }, []);

  return (
    <section
      id="chapter-about"
      ref={panelRef}
      className="relative min-h-screen overflow-hidden bg-[var(--bg)] pt-24 pb-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">

        {/* Horizontal rule divider — subtle, on-brand */}
        <hr className="border-t border-[var(--ember)] border-opacity-20 mb-12 max-w-2xl" />

        {/* Headline — huge Fraunces display */}
        <h2 className="font-display text-[var(--dim)] text-4xl sm:text-5xl lg:text-6xl xl:text-7xl mb-4 tracking-widest">
          Where it began
        </h2>

        {/* Name + role combo */}
        <div className="flex items-baseline gap-2 mb-16">
          <h1 className="font-display text-[var(--ember)] text-3xl sm:text-4xl">
            {META.name}
          </h1>
          <p className="font-body text-[var(--dim)] text-sm">
            {META.role}
          </p>
        </div>

        {/* Body copy — Sora text, max width, scroll-driven reveal */}
        <div ref={bodyRef} className="prose max-w-prose mb-16">
          {META.bio.map((para, i) => (
            <p key={i} data-reveal className="mb-4">
              {para}
            </p>
          ))}
        </div>

      </div>
    </section>
  );
}