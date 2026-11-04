const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('https://mistral.ai', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(2000);
  const data = await page.evaluate(() => {
    const getStyle = (el) => { try { return window.getComputedStyle(el); } catch(e){ return null; } };
    const body = getStyle(document.body);
    const nav = document.querySelector('nav, header, [class*="nav"], [class*="header"]') || {};
    const headings = Array.from(document.querySelectorAll('h1,h2,h3')).slice(0, 15).map(h => ({
      tag: h.tagName, text: h.textContent.trim().slice(0, 120),
      color: getStyle(h) ? getStyle(h).color : '', fontSize: getStyle(h) ? getStyle(h).fontSize : ''
    }));
    const buttons = Array.from(document.querySelectorAll('a, button')).slice(0, 20).map(b => ({
      text: b.textContent.trim().slice(0, 60), tag: b.tagName,
      bg: getStyle(b) ? getStyle(b).backgroundColor : '', color: getStyle(b) ? getStyle(b).color : ''
    })).filter(b => b.text.length > 2);
    const imgs = Array.from(document.querySelectorAll('img')).slice(0, 10).map(i => ({
      alt: i.alt, src: (i.src || '').slice(0, 90), w: i.naturalWidth, h: i.naturalHeight
    }));
    const fontFamilies = Array.from(document.querySelectorAll('*')).slice(0, 200)
      .map(el => getStyle(el) ? getStyle(el).fontFamily : '').filter(Boolean);
    const uniq = [...new Set(fontFamilies)].slice(0, 10);
    return {
      bodyBg: body ? body.backgroundColor : '', bodyColor: body ? body.color : '',
      headings, buttons, imgs, fontFamilies: uniq,
      scrollHeight: document.body.scrollHeight,
      sections: Array.from(document.querySelectorAll('section')).slice(0, 12).map(s => ({
        text: s.textContent.trim().slice(0, 80), h: s.offsetHeight
      }))
    };
  });
  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})();