// Chapter 6: Contact — get in touch.
// A full-width contact section with a large display headline, CTA button,
// and contact details. The CTA uses the ember accent color.
// A subtle form-inspired layout with real-looking placeholder fields.
// The artifact body darkness is at its maximum here (scroll near 1.0).
//
// Choreography: the headline and CTA fade up as the chapter enters; the
// detail cards stagger in behind them. The email address copies to the
// clipboard with animated feedback on click.
import { useEffect, useRef, useState } from 'react';
import { resetStore } from '@state/store';
import { reveal } from '@motion/choreography';
import { CONTACT } from '@content/content';

export default function Chapter6Contact() {
  const headRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback: select the text so the user can copy manually.
      const sel = window.getSelection();
      const range = document.createRange();
      const emailEl = document.getElementById('contact-email');
      if (emailEl && sel) {
        range.selectNodeContents(emailEl);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  };

  useEffect(() => {
    resetStore();
    const cleanupHead = reveal(headRef.current, { scrub: true, y: 32, duration: 0.8 });
    const cleanupGrid = reveal(gridRef.current, { scrub: true, y: 40, stagger: 0.1, duration: 0.8 });
    return () => {
      cleanupHead();
      cleanupGrid();
    };
  }, []);

  return (
    <section
      id="chapter-contact"
      className="relative min-h-screen overflow-hidden bg-[var(--bg)] pt-24 pb-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">

        <h2
          ref={headRef}
          data-reveal
          className="font-display text-[var(--dim)] text-4xl sm:text-5xl lg:text-6xl xl:text-8xl xl:text-9xl tracking-widest mb-8"
        >
          {CONTACT.headline}
        </h2>

        {/* CTA button — prominent ember accent */}
        <a
          href={CONTACT.ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-block rounded-full px-8 py-3 bg-[var(--ember)] text-[var(--bg)] font-display text-lg font-medium tracking-wider hover:bg-[var(--ember-glow)] transition-colors duration-300 ease-out`}
        >
          {CONTACT.cta}
        </a>

        {/* Availability line */}
        <p className="font-body text-[var(--dim)] text-sm mt-6 line-clamp-1">
          {CONTACT.availability}
        </p>

        {/* Contact details grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"
        >

          {/* Email card — copies to clipboard on click with animated feedback */}
          <div
            data-reveal
            className="p-6 rounded-lg border border-[var(--mono)]/30 bg-[var(--mono)]/10"
          >
            <p className="font-mono text-[var(--mono)] text-sm mb-1">Email</p>
            <button
              id="contact-email"
              onClick={copyEmail}
              className="font-body text-[var(--dim)] hover:text-[var(--ember)] transition-colors text-left"
              aria-label={`Copy ${CONTACT.email} to clipboard`}
            >
              {CONTACT.email}
            </button>
            <span
              className={`block font-mono text-[var(--ember)] text-xs mt-2 transition-opacity duration-300 ${
                copied ? 'opacity-100' : 'opacity-0'
              }`}
            >
              Copied to clipboard ✓
            </span>
          </div>

          {/* Social links */}
          {CONTACT.socialLinks.map((link, i) => (
            <div
              key={i}
              data-reveal
              className="p-3 rounded-lg border border-[var(--mono)]/30 bg-[var(--mono)]/10"
            >
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-[var(--dim)] hover:text-[var(--ember)] transition-colors"
              >
                {link.handle}
              </a>
            </div>
          ))}
        </div>

        {/* Local time display */}
        <p className="font-mono text-[var(--mono)] text-xs mt-8 block">
          {CONTACT.localTime}
        </p>

      </div>

      {/* Designed footer — a final signature, not a template block. */}
      <footer className="max-w-4xl mx-auto mt-24 pt-8 border-t border-[var(--mono)]/20">
        <div className="flex items-center justify-between">
          <p className="font-display text-[var(--dim)] text-sm tracking-widest">
            © {new Date().getFullYear()} — Crafted in the dark.
          </p>
          <a
            href="#chapter-hero"
            onClick={(e) => {
              e.preventDefault();
              const lenis = (window as any).__lenis;
              if (lenis) lenis.scrollTo(0, { duration: 1.4, easing: (t: number) => Math.min(1, 1.001 - Math.exp(-5 * t)) });
              else window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="font-mono text-[var(--dim)] text-xs hover:text-[var(--ember)] transition-colors"
          >
            Back to top ↑
          </a>
        </div>
      </footer>
    </section>
  );
}