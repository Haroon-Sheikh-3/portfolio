import { test, expect } from '@playwright/test';

const BASE = 'http://127.0.0.1:4173';

test('test raw WebGL drawing to canvas', async ({ page }) => {
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  const result = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return { error: 'NO CANVAS' };

    const ctx = canvas.getContext('webgl2') as WebGL2RenderingContext;
    if (!ctx) return { error: 'NO CONTEXT' };

    const gl = ctx;

    // Save current state
    const savedViewport = gl.getParameter(gl.VIEWPORT);
    const savedFB = gl.getParameter(gl.FRAMEBUFFER_BINDING);

    // Try to clear to bright green and read back
    gl.clearColor(0.0, 1.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const pixel1 = new Uint8Array(4);
    gl.readPixels(720, 450, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel1);

    // Now try drawing a triangle with a simple shader
    const vertSrc = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;
    const fragSrc = `
      precision highp float;
      void main() {
        gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
      }
    `;

    function compile(type: number, src: string): WebGLShader | null {
      const sh = gl.createShader(type);
      if (!sh) return null;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        return null;
      }
      return sh;
    }

    const vs = compile(gl.VERTEX_SHADER, vertSrc);
    const fs = compile(gl.FRAGMENT_SHADER, fragSrc);

    if (!vs || !fs) return { error: 'shader compile failed' };

    const prog = gl.createProgram();
    if (!prog) return { error: 'program create failed' };
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      return { error: 'program link failed: ' + gl.getProgramInfoLog(prog) };
    }

    gl.useProgram(prog);

    const positions = new Float32Array([
      -1, -1,  1, -1,  -1, 1,
    ]);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const loc = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    const pixel2 = new Uint8Array(4);
    gl.readPixels(720, 450, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel2);

    // Restore
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.useProgram(null);

    return {
      pixelAfterClear: Array.from(pixel1),
      pixelAfterTriangle: Array.from(pixel2),
      savedViewport: Array.from(savedViewport as number[]),
      savedFB: savedFB,
    };
  });

  console.log('RAW GL RESULT:', JSON.stringify(result, null, 2));
});