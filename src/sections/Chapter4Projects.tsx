// Chapter 4: Projects — case studies and outcomes.
// Case-study morph modal integrated.
// A gallery of project cards with images and outcome summaries.
// Modal opens from card click with shared-element morph animation.
//
// Choreography: cards stagger into view as the user scrolls into the
// chapter. The grid itself is pinned briefly at the top so the stagger
// reads as a deliberate reveal rather than a scroll-by accident.
import { useEffect, useRef } from 'react';
import { resetStore } from '@state/store';
import { reveal } from '@motion/choreography';
import { PROJECTS, type Project } from '@content/content';
import { CaseStudyProvider } from '@components/CaseStudyContext';
import { CaseStudyModal, CaseStudyTrigger } from '@components/CaseStudyModal';

// Project card component
function ProjectCard({ project }: { project: Project }) {
  const border =
    project.index === '01' ? 'border-[var(--ember)]' :
    project.index === '02' ? 'border-[var(--depth)]' :
    'border-[var(--obsidian)]';

  return (
    <article
      data-reveal
      className={`p-6 rounded-lg border group transition-all duration-300 ease-out hover:border-opacity-100 hover:bg-[var(--ember)]/5 ${border}`}
    >
      <img
        src={project.image}
        alt={project.title}
        className="w-full h-40 object-cover rounded-lg mb-4 group-hover:opacity-90 transition-opacity"
      />
      <h3 className="font-display text-[var(--ember)] text-lg mb-2 group-hover:text-[var(--warm-white)] transition-colors">
        {project.title}
      </h3>
      <p className="font-body text-[var(--dim)] text-sm line-clamp-2 mb-3">
        {project.outcome}
      </p>
      <div className="flex gap-2 text-[var(--dim)] text-xs">
        {project.stack.map((tag, i) => (
          <span key={i} className="flex-1 px-2 py-1 rounded bg-[var(--mono)]/30">{tag}</span>
        ))}
      </div>
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 font-semibold text-[var(--ember)] underline group-hover:underline"
      >
        View project
      </a>
    </article>
  );
}

export default function Chapter4Projects() {
  const gridRef = useRef<HTMLElement>(null);

  useEffect(() => {
    resetStore();
    const cleanup = reveal(gridRef.current, {
      scrub: true,
      y: 56,
      stagger: 0.11,
      duration: 0.9,
    });
    return () => {
      cleanup();
    };
  }, []);

  return (
    <CaseStudyProvider>
      <section
        id="chapter-projects"
        ref={gridRef}
        className="relative min-h-screen overflow-hidden bg-[var(--bg)] pt-24 pb-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">

          <h2 className="font-display text-[var(--dim)] text-4xl sm:text-5xl lg:text-6xl xl:text-7xl mb-16 tracking-widest">
            Projects
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {PROJECTS.map(project => (
              <CaseStudyTrigger project={project} key={project.index}>
                <ProjectCard project={project} />
              </CaseStudyTrigger>
            ))}

          </div>

          <CaseStudyModal />

        </div>
      </section>
    </CaseStudyProvider>
  );
}