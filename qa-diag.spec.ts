import { test, expect } from '@playwright/test';

const BASE = 'http://127.0.0.1:4173';

test('diagnose R3F rendering pipeline', async ({ page }) => {
  const errors: string[] = [];
  const logs: string[] = [];
  page.on('console', msg => {
    logs.push(`[${msg.type()}] ${msg.text()}`);
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(`PAGEERROR: ${err.message}`));

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(4000);

  // 1. Check if R3F is loaded at all
  const r3fState = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return { error: 'NO CANVAS' };

    // Try to find R3F's internal state
    const ctx = canvas.getContext('webgl2');
    if (!ctx) return { error: 'NO WEBGL2' };

    // Check the gl context's default framebuffer
    const gl = ctx as WebGL2RenderingContext;

    // Check current viewport
    const vp = gl.getParameter(gl.VIEWPORT);
    const viewport = vp ? Array.from(vp as number[]) : null;

    // Check current bound framebuffer (should be 0 for default/draw framebuffer)
    const fb = gl.getParameter(gl.FRAMEBUFFER_BINDING);

    // Check clear color
    const fillColor = gl.getParameter(gl.COLOR_CLEAR_VALUE);
    const fillArr = fillColor ? Array.from(fillColor as number[]) : null;

    // Check if there are any active programs
    let programInfo = 'unknown';
    try {
      const currentProgram = gl.getParameter(gl.CURRENT_PROGRAM);
      programInfo = currentProgram ? 'has program' : 'no program';
    } catch (e) {
      programInfo = `error: ${e}`;
    }

    return {
      canvasSize: [canvas.width, canvas.height],
      clientSize: [canvas.clientWidth, canvas.clientHeight],
      viewport,
      framebufferBinding: fb,
      fillColor: fillArr ? fillArr.map(v => Math.round(v * 255)) : null,
      programInfo,
      // Check if the canvas has a parent with proper dimensions
      parentWidth: canvas.parentElement?.offsetWidth,
      parentHeight: canvas.parentElement?.offsetHeight,
      // Check CSS
      canvasDisplay: window.getComputedStyle(canvas).display,
      canvasPosition: window.getComputedStyle(canvas).position,
    };
  });
  console.log('R3F STATE:', JSON.stringify(r3fState, null, 2));

  // 2. Check if Three.js scene graph exists by looking for the _events or internal props
  const threeRoot = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return 'NO CANVAS';

    // R3F stores its state on the canvas or in a fiber root
    // Try to find it via the React fiber
    const rootEl = document.getElementById('root');
    if (!rootEl) return 'NO ROOT';

    // Walk the React fiber tree (React 19 uses __reactProps$ or _reactInternal)
    const keys = Object.keys(rootEl).filter(k => k.startsWith('__react') || k.startsWith('_react'));
    return {
      rootKeys: keys.slice(0, 10),
      rootChildren: rootEl.children.length,
      canvasParent: canvas.parentElement?.tagName,
      canvasParentClass: canvas.parentElement?.className,
    };
  });
  console.log('THREE ROOT:', JSON.stringify(threeRoot, null, 2));

  // 3. Take a screenshot of just the canvas area
  await page.screenshot({ path: 'qa-diag-canvas.png' });

  // 4. Check for any visible content by sampling the rendered page
  const bodyHTML = await page.evaluate(() => document.body.innerHTML.slice(0, 800));
  console.log('BODY HTML:', bodyHTML);

  // 5. Check if there's a WebGL context loss
  const glLoss = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return 'NO CANVAS';
    const ctx = canvas.getContext('webgl2');
    if (!ctx) return 'NO CONTEXT';
    const ext = ctx.getExtension('KHR_robustness');
    return ext ? 'robustness ext available' : 'no robustness ext';
  });
  console.log('GL LOSS:', glLoss);

  console.log('CONSOLE LOGS:', JSON.stringify(logs.slice(0, 20), null, 2));
  console.log('CONSOLE ERRORS:', JSON.stringify(errors, null, 2));
});