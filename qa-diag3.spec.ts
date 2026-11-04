import { test, expect } from '@playwright/test';

const BASE = 'http://127.0.0.1:4173';

test('check console logs for DIAG output', async ({ page }) => {
  const logs: string[] = [];
  page.on('console', msg => {
    if (msg.text().includes('DIAG')) logs.push(`[${msg.type()}] ${msg.text()}`);
  });

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);

  console.log('DIAG LOGS:', JSON.stringify(logs, null, 2));

  // Also check if the canvas is being cleared each frame by checking
  // the framebuffer contents at different times
  const pixelCheck = await page.evaluate(async () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return 'NO CANVAS';
    const ctx = canvas.getContext('webgl2');
    if (!ctx) return 'NO CONTEXT';
    const gl = ctx as WebGL2RenderingContext;

    const results: any[] = [];
    for (let i = 0; i < 5; i++) {
      await new Promise(r => setTimeout(r, 500));
      const pixel = new Uint8Array(4);
      gl.readPixels(720, 450, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
      results.push({ frame: i, pixel: Array.from(pixel) });
    }
    return results;
  });
  console.log('PIXELS OVER TIME:', JSON.stringify(pixelCheck, null, 2));
});