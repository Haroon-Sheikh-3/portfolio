// Persistent navigation header — always visible as users scroll through chapters.
// Each nav link jumps to the corresponding chapter section via Lenis.
// Active chapter is indicated by the on-screen indicator (ember underline).
// Focus-visible rings are on-brand. Clicking a link scrolls to that chapter.
import { useEffect, useState } from 'react';
import { chapter } from '@state/store';
import { META } from '@content/content';

const CHAPTERS = [
  { id: 'hero', label: 'Hero', hash: '#chapter-hero' },
  { id: 'about', label: 'About', hash: '#chapter-about' },
  { id: 'skills', label: 'Skills', hash: '#chapter-skills' },
  { id: 'projects', label: 'Projects', hash: '#chapter-projects' },
  { id: 'experience', label: 'Experience', hash: '#chapter-experience' },
  { id: 'contact', label: 'Contact', hash: '#chapter-contact' },
];

export default function ChapterNav() {
  const [active, setActive] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  // Track the active chapter from the shared store (set by CameraRig).
  useEffect(() => {
    const id = setInterval(() => {
      if (chapter.index !== active) setActive(chapter.index);
    }, 120);
    return () => clearInterval(id);
  }, [active, chapter.index]);

  // Close the mobile menu when the active chapter changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [active]);

  const scrollTo = (hash: string) => {
    const el = document.getElementById(hash.replace('#', ''));
    if (!el) return;
    const lenis = (window as any).__lenis as { scrollTo: (el: HTMLElement, opts: { offset: number; duration: number; easing: (t: number) => number }) => void } | undefined;
    if (lenis) {
      lenis.scrollTo(el, { offset: -80, duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.exp(-5 * t)) });
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-[var(--bg)]/80 backdrop-blur-sm border-b border-[var(--mono)]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Brand/logo / name — always visible */}
        <div className="font-display text-[var(--ember)] text-lg tracking-wider">
          <span>{META.name}</span>
        </div>

        {/* Navigation links */}
        <nav className="hidden sm:flex items-center gap-8">
          {CHAPTERS.map((chap, i) => (
            <a
              key={chap.id}
              href={chap.hash}
              onClick={(e) => { e.preventDefault(); scrollTo(chap.hash); }}
              className={`font-body text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ember)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] rounded px-1 ${
                active === i
                  ? 'text-[var(--ember)]'
                  : 'text-[var(--dim)] hover:text-[var(--ember)]'
              }`}
            >
              {chap.label}
            </a>
          ))}
        </nav>

        {/* Mobile menu button — toggles the slide-in drawer below */}
        <button
          className="sm:hidden p-2 rounded-lg hover:bg-[var(--ember)]/10 cursor-pointer pointer-events-auto"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(v => !v);
          }}
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" onClick={(e)=>{e.stopPropagation(); setMenuOpen(v=>!v);}}>
            {menuOpen ? (
              <>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile nav drawer — slides in from the right, never hidden by default.
          The drawer is always mounted; the open state is applied at runtime. */}
      <div
        id="mobile-nav"
        aria-hidden={!menuOpen}
        className={`sm:hidden fixed inset-0 top-16 z-40 bg-[var(--bg)]/95 backdrop-blur-sm border-t border-[var(--mono)]/20 transition-transform duration-300 ease-out ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="flex flex-col items-center gap-6 py-8">
          {CHAPTERS.map((chap, i) => (
            <a
              key={chap.id}
              href={chap.hash}
              onClick={(e) => { e.preventDefault(); setMenuOpen(false); scrollTo(chap.hash); }}
              className={`font-body text-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ember)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] rounded px-2 ${
                active === i
                  ? 'text-[var(--ember)]'
                  : 'text-[var(--dim)] hover:text-[var(--ember)]'
              }`}
            >
              {chap.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}