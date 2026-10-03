// Prototype screenshots for the Inbox, Recipes and List screens.
// Usage: (cd ../design_handoff_cafe_lauren_app && python3 -m http.server 8097) & node e2e/prototype-shots-b.mjs
import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 402, height: 874 }, deviceScaleFactor: 2 });
await p.goto('http://localhost:8097/ui_kits/mobile/index.html');
await p.waitForSelector('[data-om-starter="ios-frame"]');
await p.waitForTimeout(1200);
const frame = p.locator('[data-om-starter="ios-frame"]');
const out = 'e2e/screenshots/proto-b';
const shot = async (n) => { await p.waitForTimeout(500); await frame.screenshot({ path: `${out}-${n}.png` }); };
const tab = async (t) => { await frame.locator('nav button', { hasText: t }).click(); await p.waitForTimeout(300); };
await tab('List'); await shot('list');
await frame.getByText('Change', { exact: true }).click(); await shot('store-sheet');
await p.reload(); await p.waitForSelector('[data-om-starter="ios-frame"]'); await p.waitForTimeout(1200);
await tab('Recipes'); await shot('recipes');
await frame.getByRole('button', { name: 'Add', exact: true }).click(); await shot('add-recipe');
await p.reload(); await p.waitForSelector('[data-om-starter="ios-frame"]'); await p.waitForTimeout(1200);
await tab('Inbox'); await shot('inbox');
await frame.getByRole('radio', { name: 'Pantry' }).click().catch(async () => { await frame.getByText('Pantry', { exact: true }).click(); });
await shot('inbox-pantry');
await frame.getByRole('button', { name: /Review what it found/ }).click(); await shot('pantry-review');
await b.close();
