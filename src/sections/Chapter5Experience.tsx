// Chapter 5: Experience and Achievements — milestones and impact.
// A vertically scrolling timeline of milestones, each with a year, label,
// and a brief description. Content is all DOM, fully readable without WebGL.
// The artifact's glow reaches its peak during this chapter.
//
// Choreography: each milestone reveals as it scrolls into the viewport,
// with a staggered lift so the timeline reads as a sequence, not a wall.
import { useEffect, useRef } from 'react';
import { resetStore } from '@state/store';
import { reveal } from '@motion/choreography';
import { MILESTONES } from '@content/content';

function MilestoneItem({ milestone }: { milestone: (typeof MILESTONES)[number] }) {
  return (
    <div
      data-reveal
      className="mb-16 pt-16 border-t border-[var(--ember)] border-opacity-20"
    >
      <h3 className="font-display text-[var(--dim)] text-3xl sm:text-4xl mb-2">
        {milestone.year}
      </h3>
      <p className="font-body text-[var(--dim)] text-sm">
        {milestone.label}
      </p>
      <p className="font-body text-[var(--dim)] text-sm mt-1 line-clamp-2">
        {milestone.description}
      </p>
    </div>
  );
}

export default function Chapter5Experience() {
  const listRef = useRef<HTMLElement>(null);

  useEffect(() => {
    resetStore();
    const cleanup = reveal(listRef.current, {
      scrub: true,
      y: 40,
      stagger: 0.14,
      duration: 0.8,
    });
    return () => {
      cleanup();
    };
  }, []);

  return (
    <section
      id="chapter-experience"
      ref={listRef}
      className="relative min-h-screen overflow-hidden bg-[var(--bg)] pt-24 pb-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">

        <h2 className="font-display text-[var(--dim)] text-4xl sm:text-5xl lg:text-6xl xl:text-7xl mb-16 tracking-widest">
          Experience & Achievements
        </h2>

        <div className="space-y-16">

          {MILESTONES.map((milestone, i) => (
            <MilestoneItem key={i} milestone={milestone} />
          ))}

        </div>

      </div>
    </section>
  );
}