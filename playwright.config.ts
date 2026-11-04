import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: /qa-.*\.spec\.ts/,
  use: {
    headless: true,
    viewport: { width: 1440, height: 900 },
    screenshot: 'on',
  },
  workers: 1,
});