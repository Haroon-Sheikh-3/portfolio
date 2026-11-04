import { test, expect } from '@playwright/test';

const BASE = 'http://127.0.0.1:4173';

test('simple R3F drawing test', async ({ page }) => {
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  const result = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return { error: 'NO CANVAS' };

    const ctx = canvas.getContext('webgl2') as WebGL2RenderingContext;
    if (!ctx) return { error: 'NO CONTEXT' };

    const gl = ctx;

    // Read a pixel from center
    const pixel = new Uint8Array(4);
    gl.readPixels(720, 450, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);

    // Now try to manually create a simple shader and draw
    const vertSrc = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragSrc = `
      precision highp float;
      void main() {
        gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
      }
    `;

    function compileShader(type: number, source: string): WebGLShader {
      const shader = gl.createShader(type);
      if (!shader) throw new Error('Could not create shader');
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const info = gl.getShaderInfoLog(shader);
        throw new Error('Shader compile error: ' + info);
      }
      return shader;
    }

    const vertShader = compileShader(gl.VERTEX_SHADER, vertSrc);
    const fragShader = compileShader(gl.FRAGMENT_SHADER, fragSrc);

    const program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(program);
      throw new Error('Program link error: ' + info);
    }

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Clear to red
    gl.clearColor(1.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const redPixel = new Uint8Array(4);
    gl.readPixels(720, 450, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, redPixel);

    // Draw triangle
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    const trianglePixel = new Uint8Array(4);
    gl.readPixels(720, 450, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, trianglePixel);

    // Check what the background pixels are now
    const bgPixel = new Uint8Array(4);
    gl.readPixels(10, 10, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, bgPixel);

    return {
      initialPixel: Array.from(pixel),
      redPixel: Array.from(redPixel),
      trianglePixel: Array.from(trianglePixel),
      bgPixel: Array.from(bgPixel),
    };
  });

  console.log('SIMPLE TEST RESULT:', JSON.stringify(result, null, 2));
});