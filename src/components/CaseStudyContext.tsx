// CaseStudyContext — shared state for the case-study morph modal.
// A project card captures its own rect on click and hands both to the
// context; the modal morphs from that rect into a full case-study view.
// One context, no prop drilling through six chapters.
import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Project } from '@content/content';

export interface CaseStudyValue {
  open: boolean;
  project: Project | null;
  rect: DOMRect | null;
  openProject: (project: Project, rect: DOMRect) => void;
  close: () => void;
}

const Ctx = createContext<CaseStudyValue | null>(null);

export function CaseStudyProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);

  return (
    <Ctx.Provider
      value={{
        open,
        project,
        rect,
        openProject: (p, r) => {
          setProject(p);
          setRect(r);
          setOpen(true);
        },
        close: () => {
          setOpen(false);
          setRect(null);
          setProject(null);
        },
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useCaseStudy() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error('useCaseStudy must be used within CaseStudyProvider');
  }
  return ctx;
}