const { chromium } = require('playwright');
const path = 'C:\\Users\\HaroonSheikh\\Desktop\\claude test 2\\docs\\before';
const fs = require('fs');
fs.mkdirSync(path, { recursive: true });
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  try {
    await page.goto('https://mistral.ai', { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path + '\\mistral_hero.png', fullPage: false });
    const scrolls = [0, 400, 900, 1400, 2000, 2600, 3200, 4000, 4800, 5600];
    for (const y of scrolls) {
      await page.evaluate(py => window.scrollTo(0, py), y);
      await page.waitForTimeout(900);
      await page.screenshot({ path: path + `\\mistral_y${y}.png` });
    }
    console.log('HEIGHT:', await page.evaluate(() => document.body.scrollHeight));
  } catch (e) {
    console.log('ERROR:', e.message);
  }
  console.log('CONSOLE_ERRORS:', errors.slice(0, 10));
  await browser.close();
})();