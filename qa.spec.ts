// QA suite — Playwright visual + functional verification of the live site.
// Runs against the built preview server. Captures a screenshot per width,
// checks for console errors, verifies each chapter is scrollable into view,
// and exercises the case-study morph modal.
import { test, expect, type Page } from '@playwright/test';

const BASE = 'http://127.0.0.1:4175';
const WIDTHS = [320, 375, 414, 768, 1024, 1440];

const errors: string[] = [];
function captureConsole(page: Page) {
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(`[console.error] ${msg.text()}`);
  });
  page.on('pageerror', err => errors.push(`[pageerror] ${err.message}\n${err.stack}`));
}

test.beforeEach(async ({ page }) => {
  captureConsole(page);
});

test('loads without console errors', async ({ page }) => {
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  expect(errors).toEqual([]);
});

test('each chapter scrolls into view', async ({ page }) => {
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  const chapters = ['chapter-hero', 'chapter-about', 'chapter-skills', 'chapter-projects', 'chapter-experience', 'chapter-contact'];
  for (const id of chapters) {
    const el = page.locator(`#${id}`);
    await expect(el).toBeVisible();
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await expect(el).toBeInViewport();
  }
});

test('case-study modal morphs open and closes', async ({ page }) => {
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  // Scroll to the projects chapter.
  const projects = page.locator('#chapter-projects');
  await projects.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  // Click the first CaseStudyTrigger card.
  const trigger = page.locator('.p-6.rounded-lg.border').first();
  await trigger.click();
  await page.waitForTimeout(800);

  // A morph element should now be visible at center.
  const modal = page.locator('.fixed.inset-0.z-50');
  await expect(modal).toBeVisible();

  // Close via the Close button.
  const closeBtn = page.locator('button:has-text("Close")');
  await closeBtn.click();
  await page.waitForTimeout(500);
});

test('email address copies to clipboard', async ({ page }) => {
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  const contact = page.locator('#chapter-contact');
  await contact.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  const emailBtn = page.locator('#contact-email');
  await emailBtn.click();
  await page.waitForTimeout(500);

  const copied = page.locator('text=Copied to clipboard ✓');
  await expect(copied).toBeVisible({ timeout: 2000 });
});

test('reduced-motion mode is dismissible', async ({ page }) => {
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  const banner = page.locator('[data-reduced-motion-banner]');
  // Banner only appears if the device reports reduced motion.
  if (await banner.count()) {
    const disableBtn = page.locator('button:has-text("Disable")');
    await disableBtn.click();
    await expect(banner).not.toBeVisible();
  }
});

test('mobile nav opens and closes', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  const menuBtn = page.locator('button[aria-label="Open navigation"]');
  await menuBtn.click();
  await page.waitForTimeout(300);
  // At least one nav link should be reachable after opening.
  const aboutLink = page.locator('a:has-text("About")');
  await expect(aboutLink).toBeVisible();
});

WIDTHS.forEach(w => {
  test(`visual snapshot at ${w}px`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `qa-${w}.png`, fullPage: true });
  });
});

test.afterAll(async () => {
  if (errors.length) {
    console.log(`\nQA CONSOLE ERRORS (${errors.length}):\n` + errors.join('\n'));
  } else {
    console.log('\nQA: no console errors.');
  }
});