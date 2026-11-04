import { test, expect } from '@playwright/test';

const BASE = 'http://127.0.0.1:4173';

test('check GL state and try direct clear', async ({ page }) => {
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  const result = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return { error: 'NO CANVAS' };

    const ctx = canvas.getContext('webgl2') as WebGL2RenderingContext;
    if (!ctx) return { error: 'NO CONTEXT' };

    const gl = ctx;

    // Check all relevant GL state
    const scissorTest = gl.getParameter(gl.SCISSOR_TEST);
    const colorMask = gl.getParameter(gl.COLOR_WRITEMASK);
    const depthTest = gl.getParameter(gl.DEPTH_TEST);
    const blend = gl.getParameter(gl.BLEND);
    const stencilTest = gl.getParameter(gl.STENCIL_TEST);
    const dither = gl.getParameter(gl.DITHER);

    // Check viewport and scissor box
    const viewport = gl.getParameter(gl.VIEWPORT);
    const scissorBox = gl.getParameter(gl.SCISSOR_BOX);

    // Check clear color
    const fillColor = gl.getParameter(gl.COLOR_CLEAR_VALUE);

    // Check if there's a bound framebuffer
    const fb = gl.getParameter(gl.FRAMEBUFFER_BINDING);

    // Check the drawing framebuffer
    const drawFB = gl.getParameter(gl.DRAW_FRAMEBUFFER_BINDING);
    const readFB = gl.getParameter(gl.READ_FRAMEBUFFER_BINDING);

    // Check sample coverage
    const sampleCoverage = gl.getParameter(gl.SAMPLE_COVERAGE);

    return {
      state: {
        scissorTest,
        colorMask: Array.from(colorMask as number[]),
        depthTest,
        blend,
        stencilTest,
        dither,
        sampleCoverage,
      },
      boxes: {
        viewport: Array.from(viewport as number[]),
        scissorBox: Array.from(scissorBox as number[]),
      },
      values: {
        fillColor: Array.from(fillColor as number[]),
        framebufferBinding: fb,
        drawFramebufferBinding: drawFB,
        readFramebufferBinding: readFB,
      },
      canvas: {
        width: canvas.width,
        height: canvas.height,
        clientWidth: canvas.clientWidth,
        clientHeight: canvas.clientHeight,
      },
    };
  });

  console.log('GL STATE:', JSON.stringify(result, null, 2));
});