const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--enable-gpu', '--use-gl=desktop'] });
  const page = await browser.newPage();
  const result = await page.evaluate(() => {
    const out = { webgl: false, vendor: '', renderer: '', version: '' };
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (gl) {
        out.webgl = true;
        const dbg = gl.getExtension('WEBGL_debug_renderer_info');
        out.vendor = dbg ? gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) : '';
        out.renderer = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : '';
        out.version = gl.getParameter(gl.VERSION);
      }
    } catch (e) { out.error = String(e); }
    return out;
  });
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})();
