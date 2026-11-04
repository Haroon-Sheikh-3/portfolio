// SceneCanvas — the ONE persistent fixed Canvas behind the DOM.
// Renders behind a full-page container. Pauses when tab hidden, caps DPR
// adaptively, degrades by device tier. A single instance for the whole site.
import { forwardRef, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { detectDevice } from '@state/device';

interface SceneCanvasProps {
  children: React.ReactNode;
}

export const SceneCanvas = forwardRef<HTMLCanvasElement, SceneCanvasProps>(
  ({ children }, ref) => {
    const device = detectDevice();
    const [dpr, setDpr] = useState<[number, number]>([1, device.dpr]);
    const internalRef = useRef<HTMLCanvasElement>(null);
    const canvasRef = (ref as React.Ref<HTMLCanvasElement>) || internalRef;

    // Pause rendering when the tab is hidden via context loss.
    useEffect(() => {
      const onVisibility = () => {
        const gl = (canvasRef as any)?.current?.getContext?.('webgl2');
        if (!gl) return;
        if (document.hidden) {
          const ext = gl.getExtension('KHR_robustness');
          if (ext) gl.forceContextLoss();
        }
      };
      document.addEventListener('visibilitychange', onVisibility);
      return () => document.removeEventListener('visibilitychange', onVisibility);
    }, [canvasRef]);

    return (
      <Canvas
        ref={canvasRef}
        gl={{
          antialias: device.tier === 'high',
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
          alpha: true,
          preserveDrawingBuffer: false,
        }}
        dpr={dpr}
        camera={{ position: [0, 2, 8], fov: 42, near: 0.1, far: 200 }}
        style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', display: 'block' }}
      >
        <PerformanceMonitor
          onFallback={() => setDpr([1, 1])}
          onIncline={() => setDpr([1, device.dpr])}
          onDecline={() => setDpr([1, 1])}
        >
          {children}
        </PerformanceMonitor>
      </Canvas>
    );
  }
);

SceneCanvas.displayName = 'SceneCanvas';