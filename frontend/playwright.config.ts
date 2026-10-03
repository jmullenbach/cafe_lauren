import { defineConfig } from '@playwright/test';
import path from 'node:path';

// PW_API_PORT / PW_WEB_PORT / PW_TMP let parallel agents run isolated stacks.
const API_PORT = Number(process.env.PW_API_PORT || 8081);
const WEB_PORT = Number(process.env.PW_WEB_PORT || 5173);
const API_URL = `http://localhost:${API_PORT}`;
// Tests run against their own seeded database so the demo data in data/cafe.db is never touched.
const TMP = path.resolve(process.cwd(), process.env.PW_TMP || 'e2e/.tmp');
const backendEnv = {
  CAFE_DB_PATH: path.join(TMP, 'cafe-e2e.db'),
  CAFE_MEDIA_DIR: path.join(TMP, 'media'),
  CAFE_AI: 'fake',
  CAFE_START_SCHEDULER: 'false',
  // Slow the fake AI a little so the swap specs can see thinking states and superseded asks.
  CAFE_FAKE_SWAP_DELAY: process.env.PW_FAKE_SWAP_DELAY || '1.5',
  CAFE_FAKE_FILL_DELAY: process.env.PW_FAKE_FILL_DELAY || '1.5',
};

export default defineConfig({
  testDir: './e2e',
  outputDir: './e2e/.results',
  reporter: 'list',
  workers: 1,
  use: {
    baseURL: `http://localhost:${WEB_PORT}`,
    viewport: { width: 402, height: 874 },
    deviceScaleFactor: 2,
  },
  webServer: [
    {
      // Seed the test database, then serve it. (Seeding first avoids racing the running app.)
      command: `sh -c "rm -f ${backendEnv.CAFE_DB_PATH} && uv run python -m cafe.seed_demo --reset && uv run uvicorn cafe.main:create_app --factory --port ${API_PORT}"`,
      cwd: '../backend',
      env: backendEnv,
      url: `${API_URL}/api/health`,
      reuseExistingServer: true,
      timeout: 90_000,
    },
    {
      command: `npm run dev -- --port ${WEB_PORT} --strictPort`,
      env: { CAFE_API_URL: API_URL },
      url: `http://localhost:${WEB_PORT}`,
      reuseExistingServer: true,
      timeout: 60_000,
    },
  ],
});
