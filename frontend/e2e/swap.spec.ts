import { test, expect, type Page } from '@playwright/test';

const SHOTS = 'e2e/screenshots';
const API = process.env.CAFE_API_URL || `http://localhost:${process.env.PW_API_PORT || 8081}`;
const H = { 'X-Cafe-User': 'joe' };
test.describe.configure({ mode: 'serial' });

async function open(page: Page, path: string, who = 'joe') {
  await page.goto('/');
  await page.evaluate((w) => { localStorage.setItem('cafe.user', w); }, who);
  await page.goto(path);
}
const state = async (request: any) => (await (await request.get(`${API}/api/state`, { headers: H })).json());

test('swap: tapping Ask repeatedly runs one job; the newest ask supersedes the opening one', async ({ page, request }) => {
  // Make Thursday an open night to pick for.
  const w = (await state(request)).week;
  const thu = w.slots.find((s: any) => s.day === 'thu');
  await request.post(`${API}/api/slots/${thu.id}/swap`, { headers: H, data: { kind: 'open' } });
  const before = Math.max(0, ...(await (await request.get(`${API}/api/jobs?active=false&limit=200`, { headers: H })).json()).map((j: any) => j.id));

  await open(page, '/plan');
  const card = page.getByTestId('slot-thu');
  await card.getByRole('button', { name: 'Pick a meal' }).click();
  const dlg = page.getByRole('dialog');
  await expect(dlg).toContainText('Swap Thursday');
  // The opening ask is running (the fake AI takes 1.5 s); type a request and tap Ask three times quickly.
  await expect(dlg.getByTestId('swap-thinking')).toContainText('Looking at deals and the pantry');
  await dlg.getByPlaceholder(/Or say it/).fill('use something in the pantry');
  const ask = dlg.getByRole('button', { name: /^Ask/ });
  await ask.click();
  await ask.click({ force: true });
  await ask.click({ force: true });
  await expect(ask).toHaveText('Asking…');
  await expect(ask).toBeDisabled();
  await expect(dlg.getByTestId('swap-thinking')).toContainText('Asking Café: “use something in the pantry”…');
  await expect(dlg.getByTestId('swap-elapsed')).toHaveText(/^\d+s$/);
  await page.screenshot({ path: `${SHOTS}/swap-asking.png` });

  await expect(dlg.getByTestId('swap-option')).toHaveCount(3, { timeout: 15_000 });
  await expect(dlg.getByTestId('swap-thinking')).toHaveCount(0);
  await expect(dlg.getByRole('button', { name: /^Ask$/ })).toBeVisible();

  const jobs = (await (await request.get(`${API}/api/jobs?active=false&limit=200`, { headers: H })).json())
    .filter((j: any) => j.id > before && j.type === 'swap_options' && j.payload.slot_id === thu.id);
  expect(jobs.filter((j: any) => j.status === 'done')).toHaveLength(1);
  expect(jobs.filter((j: any) => j.status === 'cancelled').length).toBeGreaterThanOrEqual(1);
  expect(jobs.every((j: any) => j.status === 'done' || j.status === 'cancelled')).toBe(true);
  expect(jobs.find((j: any) => j.status === 'done').payload.text).toBe('use something in the pantry');

  // Asking again keeps the old options on screen, dimmed, until the new ones arrive.
  await dlg.getByPlaceholder(/Or say it/).fill('something quick');
  await ask.click();
  await expect(dlg.getByTestId('swap-options')).toHaveAttribute('data-stale', 'true');
  await expect(dlg.getByTestId('swap-option')).toHaveCount(3);
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${SHOTS}/swap-dimmed.png` });
  await expect(dlg.getByTestId('swap-options')).toHaveAttribute('data-stale', 'false', { timeout: 15_000 });
});

test('swap: picking a new idea fills the night at once, then Café writes the recipe', async ({ page, request }) => {
  const thu = (await state(request)).week.slots.find((s: any) => s.day === 'thu');
  await open(page, '/plan');
  await page.getByTestId('slot-thu').getByRole('button', { name: 'Pick a meal' }).click();
  const dlg = page.getByRole('dialog');
  const idea = dlg.getByTestId('swap-option').filter({ hasText: 'New idea' });
  await expect(idea).toHaveCount(1, { timeout: 15_000 });
  const title = (await idea.locator('span').first().textContent())!;
  await idea.getByRole('button', { name: 'Use this' }).click();
  const card = page.getByTestId('slot-thu');
  await expect(card).toContainText(title);
  await expect(card.getByTestId('recipe-writing')).toContainText('Café is writing the recipe…');
  await expect(dlg).toBeHidden();
  await card.getByTestId('recipe-writing').scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${SHOTS}/swap-writing.png` });
  await expect(card.getByTestId('recipe-writing')).toHaveCount(0, { timeout: 15_000 });
  const after = (await state(request)).week.slots.find((s: any) => s.id === thu.id);
  expect(after.recipe.title).toBe(title);
  expect(after.recipe.detail_status).toBe('complete');
  expect(after.recipe.ingredients.length).toBeGreaterThan(0);
  expect(after.recipe.steps.length).toBeGreaterThan(0);
});
