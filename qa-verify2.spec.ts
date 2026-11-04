import { test, expect } from '@playwright/test';

const BASE = 'http://127.0.0.1:4173';

test('check canvas rendering', async ({ page }) => {
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // Check multiple pixels across the canvas
  const pixels = await page.evaluate(() => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    if (!canvas) return 'NO CANVAS';
    const ctx = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!ctx) return 'NO WEBGL CONTEXT';
    const gl = ctx as WebGL2RenderingContext;
    const results: { x: number; y: number; pixel: number[] }[] = [];
    const points = [
      [0, 0], [720, 450], [1439, 899], [100, 100], [1300, 800], [720, 100], [720, 800]
    ];
    for (const [x, y] of points) {
      const pixel = new Uint8Array(4);
      gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
      results.push({ x, y, pixel: Array.from(pixel) });
    }
    return results;
  });
  console.log('PIXELS:', JSON.stringify(pixels));

  // Check if there's a WebGL context and its state
  const glInfo = await page.evaluate(() => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    if (!canvas) return 'NO CANVAS';
    const ctx = canvas.getContext('webgl2');
    if (!ctx) return 'NO WEBGL2';
    const debugInfo = ctx.getExtension('WEBGL_debug_renderer_info');
    return {
      vendor: debugInfo ? ctx.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'n/a',
      renderer: debugInfo ? ctx.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'n/a',
      version: ctx.getParameter(ctx.VERSION),
      shadingLanguageVersion: ctx.getParameter(ctx.SHADING_LANGUAGE_VERSION)
    };
  });
  console.log('GL INFO:', JSON.stringify(glInfo));

  // Check if the scene is actually rendering by checking if there are any Three.js objects
  const threeInfo = await page.evaluate(() => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    if (!canvas) return 'NO CANVAS';
    const ctx = canvas.getContext('webgl2');
    if (!ctx) return 'NO WEBGL2';
    // Check for any active programs
    return {
      programCount: (ctx as any).getContextStats ? 'has stats' : 'no stats',
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      clientWidth: canvas.clientWidth,
      clientHeight: canvas.clientHeight
    };
  });
  console.log('THREE INFO:', JSON.stringify(threeInfo));
});