import { test, expect } from '@playwright/test';

const API = process.env.CAFE_API_URL || `http://localhost:${process.env.PW_API_PORT || 8081}`;
const SHOTS = 'e2e/screenshots';

test('api wiring: user header, badges from state, jobs stream', async ({ page, request }) => {
  const consoleErrors: string[] = [];
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', (e) => consoleErrors.push(String(e)));

  // Expected numbers come straight from the seeded state, using the prototype's rules.
  const state = await (await request.get(`${API}/api/state`, { headers: { 'X-Cafe-User': 'joe' } })).json();
  const plan = state.week.slots.filter((s: any) => s.kind === 'cook' && (s.status === 'suggested' || s.status === 'thinking')).length;
  const inbox = state.requests.new + (state.pantry.done ? 0 : 1);
  expect(plan).toBeGreaterThan(0);
  expect(inbox).toBeGreaterThan(0);

  await page.goto('/');
  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
  await page.reload();

  const apiHeaders: Array<string | undefined> = [];
  page.on('request', (r) => { if (r.url().includes('/api/state')) apiHeaders.push(r.headers()['x-cafe-user']); });
  const streamReq = page.waitForRequest((r) => r.url().includes('/api/jobs/stream'));
  const stateResp = page.waitForResponse((r) => r.url().includes('/api/state') && r.ok());

  await page.locator('[data-person="joe"]').click();
  const stream = await streamReq;
  expect(new URL(stream.url()).searchParams.get('user')).toBe('joe');
  await stateResp;
  expect(apiHeaders.length).toBeGreaterThan(0);
  expect(apiHeaders.every((h) => h === 'joe')).toBe(true);

  const nav = page.getByRole('navigation', { name: 'Main' });
  await expect(nav.locator('[data-tab="plan"]')).toContainText(String(plan));
  await expect(nav.locator('[data-tab="inbox"]')).toContainText(String(inbox));
  if (state.list.diff_count > 0) await expect(nav.locator('[data-tab="list"]')).toContainText('!');
  await page.waitForTimeout(1500); // let the stream settle
  await page.screenshot({ path: `${SHOTS}/04-badges.png` });

  expect(consoleErrors.filter((e) => /stream|EventSource|api\//i.test(e))).toEqual([]);
  expect(consoleErrors).toEqual([]);
});
