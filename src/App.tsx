// Main application composing all 6 chapters as a single-page scroll journey.
// Each chapter is a fully responsive DOM section with real placeholder content.
// The 3D scene (SceneCanvas + CameraRig + Artifact) sits behind all chapters.
// Master scroll.progress (0..1) is driven by Lenis/GSAP and used by the CameraRig
// and artifact shader uniforms. No React state per scroll event — R3F reads
// the mutable store in useFrame.
//
// Layout flow:
// Chapter 1 (Hero) — top, black void + warm light emergence
// Chapter 2 (About) — intro narrative panel
// Chapter 3 (Skills) — skill card grid
// Chapter 4 (Projects) — project gallery
// Chapter 5 (Experience) — milestone timeline
// Chapter 6 (Contact) — get in touch
import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { resetStore, scroll } from '@state/store';
import { detectDevice } from '@state/device';

import Chapter1Hero from '@sections/Chapter1Hero';
import Chapter2About from '@sections/Chapter2About';
import Chapter3Skills from '@sections/Chapter3Skills';
import Chapter4Projects from '@sections/Chapter4Projects';
import Chapter5Experience from '@sections/Chapter5Experience';
import Chapter6Contact from '@sections/Chapter6Contact';

import ChapterNav from '@components/ChapterNav';
import CustomCursor from '@components/CustomCursor';
import { CaseStudyProvider } from '@components/CaseStudyContext';
import { SceneCanvas } from '@scene/SceneCanvas';
import { CameraRig } from '@scene/CameraRig';
import { Artifact } from '@scene/Artifact';
import { ProjectPlane } from '@scene/ProjectPlane';

export default function App() {
  const device = detectDevice();
  const [reducedMotion, setReducedMotion] = useState(device.reducedMotion);

  useEffect(() => {
    resetStore();
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: reducedMotion ? 0 : 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.exp(-5 * t)),
    });

    // Sync Lenis scroll to GSAP ScrollTrigger.
    lenis.on('scroll', (e: any) => {
      scroll.progress = e.progress;
      scroll.direction = e.direction;
      scroll.velocity = e.velocity;
    });

    // Expose the Lenis instance for the nav to use (smooth chapter jumps).
    (window as any).__lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      ScrollTrigger.update();
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      (window as any).__lenis = null;
      lenis.destroy();
    };
  }, [reducedMotion]);

  return (
    <div
      className="relative min-h-screen overflow-x-hidden bg-back p-4"
      data-reduced-motion={reducedMotion}
    >
      {/* Custom cursor — ember dot + ring, follows pointer with damping.
          Disabled entirely in reduced-motion or coarse-pointer modes. */}
      <CustomCursor
        reducedMotion={device.reducedMotion}
        coarsePointer={device.coarsePointer}
      />

      {/* Persistent 3D canvas — fixed behind all chapters */}
      <div className="fixed inset-0 z-0">
        <SceneCanvas>
          <CameraRig />
          <Artifact />
          <ProjectPlane index={0} position={[2.6, -0.4, 2.2]} rotation={[0.2, 0.5, 0]} scale={[2.0, 1.3, 1]} />
          <ProjectPlane index={1} position={[4.4, 0.1, 3.6]} rotation={[-0.2, -0.4, 0]} scale={[2.0, 1.3, 1]} />
          <ProjectPlane index={2} position={[3.2, 0.8, 5.4]} rotation={[0.1, 0.3, 0]} scale={[2.0, 1.3, 1]} />
        </SceneCanvas>
      </div>

      {/* Chapter content sections — above the canvas */}
      <div className="relative z-10">
        <CaseStudyProvider>
          <Chapter1Hero />
          <Chapter2About />
          <Chapter3Skills />
          <Chapter4Projects />
          <Chapter5Experience />
          <Chapter6Contact />
        </CaseStudyProvider>
      </div>

      {/* Persistent navigation header — on top of everything */}
      <ChapterNav />

      {/* Film grain + vignette — fixed, below cursor, above canvas */}
      <div className="vignette" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      {/* Reduced-motion mode banner — full screen when active, dismissible.
          Content is never hidden: this is an overlay, not a replacement. */}
      {reducedMotion && (
        <div
          data-reduced-motion-banner
          className="fixed inset-0 bg-[var(--bg)] z-50 flex items-center justify-center pointer-events-auto"
        >
          <p className="font-body text-[var(--dim)] text-sm">
            Reduced motion mode active — static content only
          </p>
          <button
            onClick={() => setReducedMotion(false)}
            className="absolute top-4 right-4 font-mono text-[var(--dim)] text-xs hover:text-[var(--ember)]"
          >
            Disable
          </button>
        </div>
      )}
    </div>
  );
}