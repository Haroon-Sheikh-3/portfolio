// Custom cursor — the ember dot that follows the pointer with damping.
// Scales up on hoverable elements. Respects reduced-motion and coarse pointer.
// Never overlays text — it sits above the content as a pointer indicator.
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface CursorProps {
  reducedMotion?: boolean;
  coarsePointer?: boolean;
}

export default function CustomCursor({ reducedMotion = false, coarsePointer = false }: CursorProps) {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion || coarsePointer) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let smooth = { x: mouse.x, y: mouse.y };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;
    };

    const onHover = () => {
      gsap.to(ring, { scale: 2.5, duration: 0.4, ease: 'power2.out' });
      gsap.to(dot, { scale: 0.6, duration: 0.3, ease: 'power2.out' });
    };

    const onLeave = () => {
      gsap.to(ring, { scale: 1, duration: 0.4, ease: 'power2.out' });
      gsap.to(dot, { scale: 1, duration: 0.3, ease: 'power2.out' });
    };

    const raf = () => {
      smooth.x += (mouse.x - smooth.x) * 0.15;
      smooth.y += (mouse.y - smooth.y) * 0.15;
      ring.style.transform = `translate3d(${smooth.x}px, ${smooth.y}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // Attach hover listeners to interactive elements.
    const interactive = document.querySelectorAll('a, button, [role="button"], input, textarea');
    interactive.forEach(el => {
      el.addEventListener('mouseenter', onHover);
      el.addEventListener('mouseleave', onLeave);
    });

    window.addEventListener('mousemove', onMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      interactive.forEach(el => {
        el.removeEventListener('mouseenter', onHover);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, [reducedMotion, coarsePointer]);

  if (reducedMotion || coarsePointer) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[var(--ember)] pointer-events-none z-[9999]"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[var(--ember)] pointer-events-none z-[9998]"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
    </>
  );
}