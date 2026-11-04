import { test, expect } from '@playwright/test';

const BASE = 'http://127.0.0.1:4173';

test('check framebuffer state during R3F render', async ({ page }) => {
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  const result = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return { error: 'NO CANVAS' };

    const ctx = canvas.getContext('webgl2') as WebGL2RenderingContext;
    if (!ctx) return { error: 'NO CONTEXT' };

    const gl = ctx;

    // Check all framebuffer-related state
    const drawFB = gl.getParameter(gl.DRAW_FRAMEBUFFER_BINDING);
    const readFB = gl.getParameter(gl.READ_FRAMEBUFFER_BINDING);

    // Check what's currently bound
    const currentProgram = gl.getParameter(gl.CURRENT_PROGRAM);
    const currentVAO = gl.getParameter(gl.VERTEX_ARRAY_BINDING);

    // Check the canvas's own framebuffer
    // In some setups, the default framebuffer might not be 0
    // Let's try to read from it explicitly

    // First, try reading without any modifications
    const pixelBefore = new Uint8Array(4);
    gl.readPixels(720, 450, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixelBefore);

    // Now try to clear the DRAW framebuffer
    gl.clearColor(1.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const pixelAfterClear = new Uint8Array(4);
    gl.readPixels(720, 450, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixelAfterClear);

    // Try binding the draw framebuffer explicitly to null (default)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.clearColor(0.0, 1.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const pixelAfterRebind = new Uint8Array(4);
    gl.readPixels(720, 450, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixelAfterRebind);

    // Check viewport after rebinding
    const vp = gl.getParameter(gl.VIEWPORT);

    return {
      drawFB,
      readFB,
      currentProgram: currentProgram ? 'bound' : 'none',
      currentVAO: currentVAO ? 'bound' : 'none',
      pixelBefore: Array.from(pixelBefore),
      pixelAfterClear: Array.from(pixelAfterClear),
      pixelAfterRebind: Array.from(pixelAfterRebind),
      viewport: Array.from(vp as number[]),
    };
  });

  console.log('FRAMEBUFFER STATE:', JSON.stringify(result, null, 2));
});