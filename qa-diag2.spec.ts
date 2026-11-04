import { test, expect } from '@playwright/test';

const BASE = 'http://127.0.0.1:4173';

test('check R3F internals and frame rendering', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', err => errors.push(`PAGEERROR: ${err.message}`));

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(4000);

  // Access Three.js scene graph through R3F internals
  const sceneInfo = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return { error: 'NO CANVAS' };

    // R3F stores the fiber root on the canvas element
    // Try to access via the Three.js renderer that R3F creates
    // In R3F v9+, the renderer is stored in a few possible places

    // Try to find the THREE namespace
    const w = window as any;
    const THREE = w.THREE;

    // Check if we can access the R3F store
    // R3F stores state in a fiber tree; try to access via canvas dataset
    const engineInfo = canvas.getAttribute('data-engine');

    // Try to get the renderer via the canvas context
    const ctx = canvas.getContext('webgl2') as WebGL2RenderingContext;

    // Check for the R3F fiber root
    const rootEl = document.getElementById('root');
    const fiberKey = Object.keys(rootEl || {}).find(k => k.startsWith('__reactContainer'));
    const fiber = fiberKey ? (rootEl as any)[fiberKey] : null;

    // Try to walk the fiber tree to find the Canvas component
    let sceneChildren = 'unknown';
    let cameraPos = 'unknown';
    let meshCount = 'unknown';

    if (fiber && fiber.child) {
      try {
        // Walk down the fiber tree looking for the Canvas
        let current = fiber.child;
        let depth = 0;
        while (current && depth < 20) {
          // Check if this is a Canvas fiber (has a memoizedState with renderer)
          if (current.memoizedState) {
            const state = current.memoizedState;
            // Look for the three.js scene in the state
            if (state.scene) {
              sceneChildren = state.scene.children.length;
              if (state.scene.children.length > 0) {
                sceneChildren = state.scene.children.map((c: any) => ({
                  type: c.type || 'unknown',
                  children: c.children?.length || 0,
                  position: c.position ? [c.position.x, c.position.y, c.position.z] : null,
                }));
              }
            }
            if (state.camera) {
              cameraPos = [state.camera.position.x, state.camera.position.y, state.camera.position.z];
            }
            if (state.objects) {
              meshCount = state.objects.length;
            }
          }
          current = current.child;
          depth++;
        }
      } catch (e) {
        sceneInfo = `error walking fiber: ${e}`;
      }
    }

    return {
      engine: engineInfo,
      fiberFound: !!fiber,
      fiberChildren: fiber ? 'has children' : 'no children',
      sceneChildren,
      cameraPos,
      meshCount,
      THREEAvailable: !!THREE,
    };
  });
  console.log('SCENE INFO:', JSON.stringify(sceneInfo, null, 2));

  // Alternative: poll the canvas pixels over time to see if anything changes
  const pixelPoll = await page.evaluate(async () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return 'NO CANVAS';
    const ctx = canvas.getContext('webgl2');
    if (!ctx) return 'NO CONTEXT';
    const gl = ctx as WebGL2RenderingContext;

    const results: { t: number; pixel: number[] }[] = [];
    for (let t = 0; t < 5; t++) {
      await new Promise(r => setTimeout(r, 500));
      const pixel = new Uint8Array(4);
      gl.readPixels(720, 450, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
      results.push({ t: t * 500, pixel: Array.from(pixel) });
    }
    return results;
  });
  console.log('PIXEL POLL:', JSON.stringify(pixelPoll, null, 2));

  console.log('ERRORS:', JSON.stringify(errors, null, 2));
});