import { test, expect } from '@playwright/test';

const BASE = 'http://127.0.0.1:4173';

test('intercept gl.scissor calls', async ({ page }) => {
  // Intercept and log all gl.scissor and gl.viewport calls before R3F starts
  await page.addInitScript(() => {
    const originalScissor = WebGL2RenderingContext.prototype.scissor;
    const originalViewport = WebGL2RenderingContext.prototype.viewport;
    const originalBindFramebuffer = WebGL2RenderingContext.prototype.bindFramebuffer;

    const scissorCalls: any[] = [];
    const viewportCalls: any[] = [];
    const fbCalls: any[] = [];

    WebGL2RenderingContext.prototype.scissor = function(...args: any[]) {
      scissorCalls.push({ args: Array.from(args), stack: new Error().stack?.split('\n').slice(1, 6).join(' | ') });
      return originalScissor.apply(this, args);
    };

    WebGL2RenderingContext.prototype.viewport = function(...args: any[]) {
      viewportCalls.push({ args: Array.from(args) });
      return originalViewport.apply(this, args);
    };

    WebGL2RenderingContext.prototype.bindFramebuffer = function(target: any, fb: any) {
      fbCalls.push({ target, fb });
      return originalBindFramebuffer.call(this, target, fb);
    };

    (window as any).__scissorCalls = scissorCalls;
    (window as any).__viewportCalls = viewportCalls;
    (window as any).__fbCalls = fbCalls;
  });

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(4000);

  const result = await page.evaluate(() => {
    const w = window as any;
    return {
      scissorCalls: w.__scissorCalls || [],
      viewportCalls: w.__viewportCalls || [],
      fbCalls: w.__fbCalls || [],
    };
  });

  console.log('SCISSOR CALLS:', JSON.stringify(result.scissorCalls, null, 2));
  console.log('VIEWPORT CALLS:', JSON.stringify(result.viewportCalls, null, 2));
  console.log('FB CALLS:', JSON.stringify(result.fbCalls, null, 2));
});