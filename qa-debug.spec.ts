import { test, expect } from '@playwright/test';

const BASE = 'http://127.0.0.1:4173';

test('debug black screen', async ({ page }) => {
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // Check root element
  const rootHTML = await page.evaluate(() => {
    const root = document.getElementById('root');
    return root ? root.innerHTML.slice(0, 500) : 'NO ROOT';
  });
  console.log('ROOT HTML:', rootHTML);

  // Check canvas
  const canvasInfo = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return 'NO CANVAS';
    return {
      width: canvas.width,
      height: canvas.height,
      style: canvas.getAttribute('style'),
      display: window.getComputedStyle(canvas).display
    };
  });
  console.log('CANVAS:', JSON.stringify(canvasInfo));

  // Check console errors
  const errors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(`[console.error] ${msg.text()}`);
  });
  page.on('pageerror', err => errors.push(`[pageerror] ${err.message}`));

  await page.waitForTimeout(2000);
  console.log('CONSOLE ERRORS:', JSON.stringify(errors));

  // Take screenshot
  await page.screenshot({ path: 'qa-debug.png', fullPage: true });
});