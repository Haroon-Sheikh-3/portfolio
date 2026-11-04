const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const result = await page.evaluate(() => {
    const out = { webgl: false, vendor: '', renderer: '', version: '', maxTex: 0, extensions: [], errors: [] };
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (gl) {
        out.webgl = true;
        const dbg = gl.getExtension('WEBGL_debug_renderer_info');
        out.vendor = gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) || '';
        out.renderer = gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || '';
        out.version = gl.getParameter(gl.VERSION);
        out.maxTex = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        const exts = ['EXT_texture_filter_anisotropic','OES_texture_float','OES_texture_half_float','EXT_color_buffer_half_float','WEBGL_compressed_texture_s3tc','EXT_frag_depth'];
        out.extensions = exts.filter(e => gl.getExtension(e));
      }
    } catch (e) { out.errors.push(String(e)); }
    return out;
  });
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})();