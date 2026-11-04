import { test, expect } from '@playwright/test';

const BASE = 'http://127.0.0.1:4175';

test('check aria-expanded after click', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  const btn = page.locator('button[aria-label="Open navigation"]');
  console.log('aria-expanded before:', await btn.getAttribute('aria-expanded'));
  await btn.click();
  await page.waitForTimeout(500);
  console.log('aria-expanded after:', await btn.getAttribute('aria-expanded'));
});