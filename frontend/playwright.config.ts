import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  outputDir: './e2e/.results',
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    viewport: { width: 402, height: 874 },
    deviceScaleFactor: 2,
  },
  webServer: {
    command: 'npm run dev -- --port 5173 --strictPort',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
