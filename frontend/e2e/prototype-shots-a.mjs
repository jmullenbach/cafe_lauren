// Prototype shots for Home A, Plan A, the meal sheets, meal detail, cook mode and Ask Café.
// Usage: (cd ../design_handoff_cafe_lauren_app && python3 -m http.server 8098) & node e2e/prototype-shots-a.mjs
import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 402, height: 874 }, deviceScaleFactor: 2 });
await p.goto('http://localhost:8098/ui_kits/mobile/index.html');
await p.waitForSelector('[data-om-starter="ios-frame"]');
await p.waitForTimeout(1500);
const frame = p.locator('[data-om-starter="ios-frame"]');
const out = 'e2e/screenshots/proto-a';
const shot = async (n) => { await p.waitForTimeout(500); await frame.screenshot({ path: `${out}-${n}.png` }); };
const tab = (t) => frame.locator('nav button', { hasText: t }).click();
const scroll = (y) => frame.locator('.clm-scroll').first().evaluate((e, y) => e.scrollTo(0, y), y);
const closeSheet = async () => { const bx = await frame.boundingBox(); await p.mouse.click(bx.x + 200, bx.y + 40); await p.waitForTimeout(500); };
await tab('Home'); await shot('home');
await scroll(700); await shot('home-scrolled'); await scroll(0);
await frame.getByRole('button', { name: 'Swap' }).click(); await shot('swap'); await closeSheet();
await tab('Plan'); await shot('plan');
await scroll(5000); await shot('plan-scrolled'); await scroll(0);
await frame.getByRole('button', { name: 'Swap' }).first().click(); await shot('swap-plan');
await frame.locator('div[role=dialog]').evaluate((e) => { const s = e.querySelector('div[style*="overflow: auto"]'); if (s) s.scrollTo(0, 5000); }).catch(() => {});
await shot('swap-scrolled'); await closeSheet();
await frame.getByRole('button', { name: 'Not this' }).first().click(); await shot('reject'); await closeSheet();
await frame.getByRole('button', { name: 'Change' }).first().click(); await shot('edit'); await closeSheet();
// Meal detail for the kept Monday meal, then Wednesday with steps.
await frame.getByRole('heading', { name: 'Taco Tuesday' }).click(); await shot('meal-kept');
await scroll(5000); await shot('meal-kept-scrolled');
await frame.getByRole('button', { name: 'Back' }).click();
await frame.getByRole('heading', { name: /Sheet Pan Pork Chops/ }).click(); await shot('meal-suggested');
await scroll(5000); await shot('meal-suggested-scrolled');
await frame.getByRole('button', { name: 'Back' }).click();
await frame.getByRole('button', { name: 'Keep' }).first().click();
await frame.getByRole('heading', { name: /Sheet Pan Pork Chops/ }).click();
await frame.getByRole('button', { name: 'Edit' }).click(); await shot('meal-editing'); 
await frame.getByRole('button', { name: 'Cancel' }).click();
await frame.getByRole('button', { name: 'Start cooking' }).click();
await frame.getByRole('button', { name: 'Next step' }).click(); await scroll(900); await shot('cook-mode');
await frame.getByRole('button', { name: 'Back', exact: true }).first().click().catch(() => {});
// Ask Café with a proposal.
await tab('Home');
await p.getByRole('button', { name: 'Ask Café' }).click();
await frame.getByRole('button', { name: 'Make Thursday vegetarian' }).click();
await p.waitForTimeout(1500); await shot('chat-proposal');
await b.close();
