import { test, expect, type Page } from '@playwright/test';

const BASE = 'http://127.0.0.1:4175';

test('debug modal open', async ({ page }) => {
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  const projects = page.locator('#chapter-projects');
  await projects.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  // Click the first CaseStudyTrigger wrapper
  const trigger = page.locator('#chapter-projects > div > div').first();
  const box = await trigger.boundingBox();
  console.log('TRIGGER BOX:', box);

  // Dump the DOM structure
  const structure = await page.evaluate(() => {
    const proj = document.getElementById('chapter-projects')!;
    const children = Array.from(proj.children).map(c => ({
      tag: c.tagName,
      class: c.className.slice(0, 60),
      childCount: c.children.length,
      firstChildTag: c.children[0]?.tagName,
      firstChildClass: c.children[0]?.className.slice(0, 60)
    }));
    return children;
  });
  console.log('STRUCTURE:', JSON.stringify(structure, null, 2));

  if (box) {
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(1500);
  }

  const modalCount = await page.locator('.fixed.inset-0.z-50').count();
  console.log('MODAL COUNT:', modalCount);

  // Check for overlay
  const overlayCount = await page.locator('div.fixed.inset-0.bg-black\\/60').count();
  console.log('OVERLAY COUNT:', overlayCount);

  // Check for Close button
  const closeCount = await page.locator('button:has-text("Close")').count();
  console.log('CLOSE BUTTON COUNT:', closeCount);

  // Check for View project link
  const viewCount = await page.locator('text=View project').count();
  console.log('VIEW PROJECT COUNT:', viewCount);

  // Check for modal content
  const modalContent = await page.evaluate(() => {
    const modals = document.querySelectorAll('.fixed.inset-0.z-50');
    if (modals.length === 0) return 'NO MODAL';
    return modals[0].innerHTML.slice(0, 500);
  });
  console.log('MODAL CONTENT:', modalContent);
});