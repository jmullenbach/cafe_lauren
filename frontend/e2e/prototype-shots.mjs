// Screenshots the handoff prototype at the same viewport, for side-by-side comparison.
// Usage: (cd ../design_handoff_cafe_lauren_app && python3 -m http.server 8099) & node e2e/prototype-shots.mjs
import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 402, height: 874 }, deviceScaleFactor: 2 });
await p.goto('http://localhost:8099/ui_kits/mobile/index.html');
await p.waitForSelector('[data-om-starter="ios-frame"]');
await p.waitForTimeout(1200);
const frame = p.locator('[data-om-starter="ios-frame"]');
const out = 'e2e/screenshots/proto';
for (const t of ['Home', 'Plan', 'List', 'Recipes', 'Inbox']) {
  await frame.locator('nav button', { hasText: t }).click();
  await p.waitForTimeout(300);
  await frame.screenshot({ path: `${out}-tab-${t.toLowerCase()}.png` });
}
await frame.locator('nav button', { hasText: 'Home' }).click();
await p.getByRole('button', { name: 'Ask Café' }).click();
await p.waitForTimeout(600);
await frame.screenshot({ path: `${out}-ask-sheet.png` });
await b.close();
