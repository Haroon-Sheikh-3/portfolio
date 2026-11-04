import { test, expect } from '@playwright/test';

const BASE = 'http://127.0.0.1:4173';

test('verify site renders correctly', async ({ page }) => {
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // Check that root has content
  const rootText = await page.evaluate(() => {
    const root = document.getElementById('root');
    if (!root) return 'NO ROOT';
    return root.textContent?.slice(0, 200) || 'EMPTY';
  });
  console.log('ROOT TEXT:', rootText);

  // Check for chapter sections
  const chapters = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[id^="chapter-"]')).map(el => ({
      id: el.id,
      visible: el.offsetParent !== null,
      text: el.textContent?.slice(0, 80)
    }));
  });
  console.log('CHAPTERS:', JSON.stringify(chapters, null, 2));

  // Check canvas is rendering (not black)
  const canvasPixels = await page.evaluate(() => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    if (!canvas) return 'NO CANVAS';
    const ctx = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!ctx) return 'NO WEBGL CONTEXT';
    // Read a pixel from center
    const gl = ctx as WebGL2RenderingContext;
    const pixel = new Uint8Array(4);
    gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
    return { pixel: Array.from(pixel), canvasSize: [canvas.width, canvas.height] };
  });
  console.log('CANVAS PIXELS:', JSON.stringify(canvasPixels));

  // Check for hero content
  const heroHeading = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    return h1 ? h1.textContent : 'NO H1';
  });
  console.log('HERO H1:', heroHeading);

  // Take viewport screenshot
  await page.screenshot({ path: 'qa-verify.png' });
});