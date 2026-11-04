import { test, expect } from '@playwright/test';

const BASE = 'http://127.0.0.1:4173';

test('check R3F renderer internals', async ({ page }) => {
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // Take a screenshot to see what's actually displayed
  await page.screenshot({ path: 'qa-diag6-display.png' });

  const result = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return { error: 'NO CANVAS' };

    // Check all computed styles
    const cs = window.getComputedStyle(canvas);

    // Check the canvas parent chain
    let el = canvas;
    const chain: any[] = [];
    while (el && el.tagName !== 'BODY') {
      chain.push({
        tag: el.tagName,
        class: el.className,
        position: window.getComputedStyle(el).position,
        display: window.getComputedStyle(el).display,
        width: window.getComputedStyle(el).width,
        height: window.getComputedStyle(el).height,
        opacity: window.getComputedStyle(el).opacity,
        visibility: window.getComputedStyle(el).visibility,
        zIndex: window.getComputedStyle(el).zIndex,
        background: window.getComputedStyle(el).background,
        overflow: window.getComputedStyle(el).overflow,
      });
      el = el.parentElement!;
    }

    // Check if there's a WebGL context and what the renderer is doing
    const ctx = canvas.getContext('webgl2') as WebGL2RenderingContext;
    if (!ctx) return { error: 'NO CONTEXT', chain };

    const gl = ctx;

    // Check if there are any framebuffers created by R3F
    const fbCount = gl.getParameter(gl.FRAMEBUFFER_BINDING);

    // Check the WebGL context's version and extensions
    const version = gl.getParameter(gl.VERSION);
    const vendor = gl.getParameter(gl.VENDOR);
    const renderer = gl.getParameter(gl.RENDERER);

    // Check for the R3F-specific internal state
    // R3F v9 stores the renderer on the fiber root
    const rootEl = document.getElementById('root');
    const fiberKey = Object.keys(rootEl || {}).find(k => k.startsWith('__reactContainer'));
    const fiber = fiberKey ? (rootEl as any)[fiberKey] : null;

    // Walk the fiber tree to find the Canvas fiber
    let canvasFiber: any = null;
    let current = fiber;
    while (current) {
      // Check if this fiber's state has a renderer
      if (current.memoizedState) {
        const state = current.memoizedState;
        // R3F Canvas stores its state in the fiber
        if (state.renderer || state.gl || state.scene) {
          canvasFiber = {
            hasRenderer: !!state.renderer,
            hasGl: !!state.gl,
            hasScene: !!state.scene,
            hasCamera: !!state.camera,
            stateKeys: Object.keys(state).filter(k => !k.startsWith('_')),
          };
          break;
        }
      }
      // Also check linked list of fibers
      if (current.child) {
        current = current.child;
      } else if (current.sibling) {
        current = current.sibling;
      } else {
        // Go up
        let parent = current.return;
        while (parent && !parent.sibling) parent = parent.return;
        current = parent ? parent.sibling : null;
      }
    }

    return {
      chain,
      glInfo: { version, vendor, renderer },
      framebufferBinding: fbCount,
      canvasFiber,
      canvasSize: [canvas.width, canvas.height],
      canvasStyle: {
        display: cs.display,
        position: cs.position,
        width: cs.width,
        height: cs.height,
        opacity: cs.opacity,
        visibility: cs.visibility,
      },
    };
  });

  console.log('RENDERER INFO:', JSON.stringify(result, null, 2));
});