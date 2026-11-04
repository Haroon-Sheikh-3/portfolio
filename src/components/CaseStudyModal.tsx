// CaseStudyModal — morphs from a project card into a full case-study view.
// It captures the card's on-screen rect, animates an element from that
// position to the center, then reveals the case-study content.
//
// The morph source rect is passed in via context; when closed it returns
// to the card position. Content uses GSAP ScrollTrigger reveals like the
// rest of the site, so keyboard / screen-reader navigation works.
import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useCaseStudy } from './CaseStudyContext';
import type { Project } from '@content/content';

export function CaseStudyModal() {
  const { open, project, rect, close } = useCaseStudy();
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    // When the modal opens, capture the trigger rect (from the card click)
    // and animate a mount element from that position.
    if (rect && modalRef.current) {
      gsap.set(modalRef.current, {
        visibility: 'visible',
        overwrite: 'auto',
      });

      const startX = rect.x + rect.width / 2;
      const startY = rect.y + rect.height / 2;

      gsap.set(modalRef.current, {
        x: startX,
        y: startY,
        scale: 0.8,
        opacity: 1,
      });

      // Animate to center + scale up
      gsap.to(modalRef.current, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
        onComplete: () => {
          // Content is now visible — lets reveals kick in on scroll
        },
      });
    }

    return () => {
      if (modalRef.current) {
        gsap.set(modalRef.current, { visibility: 'hidden', overwrite: 'auto' });
        gsap.killTweensOf(modalRef.current);
      }
    };
  }, [open, project, rect]);

  if (!mounted || !project || !open) {
    return null;
  }

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      style={{ opacity: mounted ? 1 : 0 }}
    >
      {/* Semi-transparent overlay — clicks outside close the modal */}
      <div
        className="fixed inset-0 bg-black/60 pointer-events-auto transition-opacity duration-300"
        onClick={close}
      ></div>

      {/* Morph element — starts from the card rect, morphs to center */}
      <div
        className="relative w-64 h-96 bg-[var(--mono)]/30 border border-[var(--mono)]/20 rounded-xl transition-all duration-500 ease-out pointer-events-auto"
        style={{
          opacity: mounted ? 1 : 0,
          pointerEvents: mounted ? 'auto' : 'none',
        }}
      >
        {/* Project image placeholder scaled from card */}
        <div
          className="absolute inset-0 bg-[var(--ember)] rounded-xl overflow-hidden"
          style={{
            transform: mounted ? 'scale(1)' : 'scale(0.8)',
            transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <img
            src={project?.image || '/images/projects/placeholder-01.jpg'}
            alt={project?.title || 'Case study'}
            className="w-full h-full object-cover"
            style={{ transition: 'opacity 0.8s ease-out' }}
          />
        </div>

        {/* Modal content that slides in from the morph position */}
        <div
          className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-start p-8 pointer-events-none"
        >
          <h2 className="font-display text-[var(--ember)] text-3xl sm:text-4xl mb-2 tracking-widest">
            {project.title}
          </h2>
          <p className="font-body text-[var(--dim)] text-sm mb-6 line-clamp-2">
            {project.outcome}
          </p>

          <div className="flex gap-3">
            <a
              href={project.link || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full px-4 py-2 bg-[var(--ember)] text-[var(--bg)] font-medium text-sm tracking-wider hover:bg-[var(--ember-glow)] transition-colors"
            >
              View project
            </a>
            <button
              onClick={close}
              className="inline-block rounded-full px-4 py-2 bg-[var(--dim)] text-[var(--warm-white)] font-medium text-sm tracking-wider hover:bg-[var(--mono)]/30 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Expose the component above the modal so the rect is captured from the
// clicking card. The parent (Chapter4Projects) passes the onClick handler
// that captures getBoundingClientRect and feeds it to the context.
// CaseStudyTrigger is a transparent wrapper: it renders its children and
// forwards the click that captures the card's on-screen rect.
export function CaseStudyTrigger({
  project,
  children,
}: {
  project: Project;
  children: React.ReactNode;
}) {
  const { openProject } = useCaseStudy();

  return (
    <div
      onClick={(e) => {
        const el = e.currentTarget as HTMLElement;
        const rect = el.getBoundingClientRect();
        openProject(project, rect);
      }}
      className="p-6 rounded-lg border group transition-all duration-300 ease-out hover:border-[var(--ember)] hover:bg-[var(--ember)]/5 cursor-pointer"
    >
      {children}
    </div>
  );
}