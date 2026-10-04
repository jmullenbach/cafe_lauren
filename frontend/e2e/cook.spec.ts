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
const week = async (request: any) => (await (await request.get(`${API}/api/state`, { headers: H })).json()).week;
const slotOf = (w: any, day: string) => w.slots.find((s: any) => s.day === day);

// The specs share one seeded database, so put back what these tests change.
test.afterAll(async ({ request }) => {
  const w = await week(request);
  const set = (day: string, cook: string | null) => request.post(`${API}/api/slots/${slotOf(w, day).id}/cook`, { headers: H, data: { cook } });
  await set('wed', 'joe'); await set('fri', 'lauren'); await set('sat', null);
  const recipes = await (await request.get(`${API}/api/recipes`, { headers: H })).json();
  const soup = (recipes.items ?? recipes).find((r: any) => r.title === 'Instant Pot Chicken Tortilla Soup');
  await request.patch(`${API}/api/recipes/${soup.id}`, { headers: H, data: { default_cook: null } });
  const tue = slotOf(w, 'tue');
  if (tue.kind !== 'leftover') await request.post(`${API}/api/slots/${tue.id}/swap`, { headers: H, data: { kind: 'leftover', text: 'Taco leftovers → taco-salad bowls' } });
  await request.post(`${API}/api/queue`, { headers: H, data: { recipe_id: soup.id } });
});

test('plan shows cook chips, color coded; change Wednesday to Leidy keeps votes', async ({ page, request }) => {
  const before = slotOf(await week(request), 'wed');
  await open(page, '/plan');
  await expect(page.getByTestId('slot-mon').getByTestId('cook-chip')).toHaveText('Joe cooks');
  await expect(page.getByTestId('slot-fri').getByTestId('cook-chip')).toHaveText('Lauren cooks');
  await expect(page.getByTestId('slot-thu').getByTestId('cook-chip')).toHaveAttribute('data-cook', 'leidy');
  await expect(page.getByTestId('slot-sat').getByTestId('cook-chip')).toHaveText("Who's cooking?");
  await expect(page.getByTestId('slot-tue').getByTestId('cook-chip')).toHaveCount(0); // leftovers
  await page.screenshot({ path: `${SHOTS}/cook-plan-top.png` });

  const wed = page.getByTestId('slot-wed');
  const chip = wed.getByTestId('cook-chip');
  const bgBefore = await chip.evaluate((e) => getComputedStyle(e).backgroundColor);
  await chip.click();
  const dlg = page.getByRole('dialog');
  await expect(dlg).toContainText("Who's cooking Wednesday?");
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${SHOTS}/cook-picker.png` });
  await dlg.getByTestId('cook-option-leidy').click();
  await expect(page.getByText('Leidy is cooking Wednesday')).toBeVisible();
  await expect(chip).toHaveText('Leidy cooks');
  await expect(chip).toHaveAttribute('data-cook', 'leidy');
  expect(await chip.evaluate((e) => getComputedStyle(e).backgroundColor)).not.toBe(bgBefore);
  await page.getByTestId('slot-sun').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${SHOTS}/cook-plan-scrolled.png` });

  const after = slotOf(await week(request), 'wed');
  expect(after.cook).toBe('leidy');
  expect(after.votes).toEqual(before.votes);
  expect(after.status).toBe(before.status);
});

test('anyone can set anyone, and Not decided clears it', async ({ page, request }) => {
  await open(page, '/plan', 'leidy');
  const sat = page.getByTestId('slot-sat');
  await sat.getByTestId('cook-chip').click();
  await page.getByRole('dialog').getByTestId('cook-option-joe').click();
  await expect(sat.getByTestId('cook-chip')).toHaveText('Joe cooks');
  await sat.getByTestId('cook-chip').click();
  await page.getByRole('dialog').getByTestId('cook-option-none').click();
  await expect(sat.getByTestId('cook-chip')).toHaveText("Who's cooking?");
  expect(slotOf(await week(request), 'sat').cook).toBeNull();
});

test('meal detail and Home show the chip; Plan changes flow to Home', async ({ page, request }) => {
  await open(page, '/plan');
  await page.getByTestId('slot-fri').getByRole('heading').click();
  await expect(page.getByTestId('cook-chip').first()).toHaveText('Lauren cooks');
  await page.screenshot({ path: `${SHOTS}/cook-meal-detail.png` });
  await page.getByTestId('cook-chip').first().click();
  await expect(page.getByRole('dialog')).toContainText("Who's cooking Friday?");
  await page.getByRole('dialog').getByTestId('cook-option-joe').click();
  await expect(page.getByTestId('cook-chip').first()).toHaveText('Joe cooks');

  await page.goto('/');
  const fri = page.getByTestId('week-row-fri');
  await expect(fri.getByTestId('cook-chip')).toHaveText('Joe');
  await expect(page.getByTestId('week-row-mon').getByTestId('cook-chip')).toHaveText('Joe');
  await expect(page.getByTestId('week-row-thu').getByTestId('cook-chip')).toHaveAttribute('data-cook', 'leidy');
  await expect(page.getByTestId('week-row-tue').getByTestId('cook-chip')).toHaveCount(0);
  // Tonight's card carries the chip whenever tonight is a cook night (it is a leftovers night on some days).
  if (await page.getByTestId('tonight').count()) await expect(page.getByTestId('tonight').getByTestId('cook-chip')).toBeVisible();
  await page.screenshot({ path: `${SHOTS}/cook-home.png` });
  await page.getByTestId('week-row-sat').evaluate((e) => e.scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${SHOTS}/cook-home-week.png` });
  // Tapping the chip on Home opens the same picker, without opening the meal.
  await fri.getByTestId('cook-chip').click();
  await expect(page.getByRole('dialog')).toContainText("Who's cooking Friday?");
  await page.getByRole('dialog').getByTestId('cook-option-lauren').click();
  await expect(fri.getByTestId('cook-chip')).toHaveText('Lauren');
  await expect(page).toHaveURL(/\/home$/);
});

test('recipe default cook carries onto a night', async ({ page, request }) => {
  const tue = slotOf(await week(request), 'tue');
  await request.post(`${API}/api/slots/${tue.id}/swap`, { headers: H, data: { kind: 'open' } });
  const recipes = await (await request.get(`${API}/api/recipes`, { headers: H })).json();
  const soup = (recipes.items ?? recipes).find((r: any) => r.title === 'Instant Pot Chicken Tortilla Soup');
  await open(page, `/recipes/${soup.id}`);
  const row = page.getByTestId('default-cook');
  await expect(row).toContainText('Usually cooked by');
  await expect(row).toContainText("doesn't change nights already planned");
  await row.getByRole('radio', { name: 'Joe' }).click();
  await expect(page.getByText('Joe usually cooks this')).toBeVisible();
  await expect(row.getByRole('radio', { name: 'Joe' })).toHaveAttribute('aria-checked', 'true');
  await page.screenshot({ path: `${SHOTS}/cook-recipe-detail.png` });

  await page.getByRole('button', { name: 'Put on a night' }).click();
  await page.getByRole('dialog').getByText('Tuesday', { exact: true }).click();
  await open(page, '/plan');
  await expect(page.getByTestId('slot-tue').getByTestId('cook-chip')).toHaveText('Joe cooks');
  expect(slotOf(await week(request), 'tue').cook).toBe('joe');
});
