// Chapter 3: Skills and Technology — the tools of the trade.
// A grid of skill cards arranged in a subtle pattern, each with its own
// accent color from the OKLCH palette. Real content from placeholder data.
// Scroll-driven reveal: each card fades in with a stagger as you scroll
// through the chapter. The artifact's glow intensity tracks scroll.progress
// within this chapter.
import { useEffect, useRef } from 'react';
import { resetStore } from '@state/store';
import { reveal } from '@motion/choreography';
import { STACK } from '@content/content';

// Flatten the grouped stack into the card grid. Each item keeps its group
// label and an accent from the OKLCH palette.
export const SKILLS = STACK.flatMap((group, gi) =>
  group.items.map((item, ii) => ({
    id: `${gi + 1}.${ii + 1}`,
    title: item.name,
    group: group.group,
    years: item.years,
    note: item.note,
    accent: (['ember', 'depth', 'ink', 'obsidian'] as const)[(gi + ii) % 4],
  }))
);

function SkillCard({ skill }: { skill: (typeof SKILLS)[number] }) {
  const border =
    skill.accent === 'ember' ? 'border-[var(--ember)]' :
    skill.accent === 'depth' ? 'border-[var(--depth)]' :
    skill.accent === 'ink' ? 'border-[var(--ink)]' :
    'border-[var(--obsidian)]';
  const hover =
    skill.accent === 'ember' ? 'hover:border-[var(--ember)] hover:bg-[var(--ember)]/10' :
    skill.accent === 'depth' ? 'hover:border-[var(--depth)] hover:bg-[var(--depth)]/10' :
    skill.accent === 'ink' ? 'hover:border-[var(--ink)] hover:bg-[var(--ink)]/10' :
    'hover:border-[var(--obsidian)] hover:bg-[var(--obsidian)]/10';

  return (
    <div
      data-reveal
      className={`p-6 rounded-lg border group transition-all duration-300 ease-out ${border} ${hover}`}
    >
      <h3 className="font-display text-[var(--ember)] text-xl mb-2 tracking-wider">
        {skill.title}
      </h3>
      <p className="font-body text-[var(--dim)] text-sm leading-relaxed">
        {skill.note}
      </p>
      <p className="font-mono text-[var(--mono)] text-xs mt-2">
        {skill.group} — {skill.years}
      </p>
    </div>
  );
}

export default function Chapter3Skills() {
  const gridRef = useRef<HTMLElement>(null);

  useEffect(() => {
    resetStore();
    const cleanup = reveal(gridRef.current, {
      scrub: true,
      y: 48,
      stagger: 0.09,
      duration: 0.8,
    });
    return () => {
      cleanup();
    };
  }, []);

  return (
    <section
      id="chapter-skills"
      ref={gridRef}
      className="relative min-h-screen overflow-hidden bg-[var(--bg)] pt-24 pb-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">

        <h2 className="font-display text-[var(--dim)] text-4xl sm:text-5xl lg:text-6xl xl:text-7xl mb-16 tracking-widest">
          Skills and Technology
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

          {SKILLS.map(skill => (
            <SkillCard key={skill.id} skill={skill} />
          ))}

        </div>

      </div>
    </section>
  );
}