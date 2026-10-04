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

test('plan: Lunches & breakfast holds the staples; edit them for this week', async ({ page, request }) => {
  await open(page, '/plan');
  const card = page.getByTestId('slot-extra');
  await expect(page.getByRole('heading', { name: 'Lunches & breakfast' })).toBeVisible();
  await expect(card).toContainText('Staples');
  await expect(card).toContainText('8 items');
  await card.scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${SHOTS}/extra-plan.png` });

  // Open it, take milk off for this week; the grocery list follows.
  await card.getByRole('heading', { name: 'Staples' }).click();
  await expect(page.getByText('Lunches & breakfast', { exact: true })).toBeVisible();
  await expect(page.getByTestId('ingredient')).toHaveCount(8);
  await page.getByRole('button', { name: 'Edit', exact: true }).click();
  await page.getByRole('button', { name: 'Remove Milk' }).click();
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByTestId('ingredient')).toHaveCount(7);
  await page.screenshot({ path: `${SHOTS}/extra-detail.png` });
  const x = (await week(request)).extra;
  expect(x.ingredients_edited).toBe(true);
  await page.goto('/list');
  await expect(page.getByTestId('list-item').filter({ hasText: 'Eggs' })).toHaveCount(1);
  await expect(page.getByTestId('list-item').filter({ hasText: /^Milk/ })).toHaveCount(0);
  await request.patch(`${API}/api/slots/${x.id}`, { headers: H, data: { reset_ingredients: true } });
});

test('swap: search the recipe box, and the Staples chip', async ({ page, request }) => {
  await open(page, '/plan');
  // A night: search finds a recipe by name without waiting for Café.
  await page.getByTestId('slot-sun').getByRole('button', { name: 'Change' }).click();
  await page.getByRole('dialog').getByText('Swap for a different meal').click();
  const dlg = page.getByRole('dialog').filter({ has: page.getByPlaceholder('Search the recipe box') });
  await expect(dlg).toContainText('Swap Sunday');
  await dlg.getByPlaceholder('Search the recipe box').fill('chili');
  await expect(dlg.getByTestId('swap-box')).toContainText("Lauren's Chili");
  await expect(dlg.getByTestId('swap-box-row')).toHaveCount(1);
  await page.screenshot({ path: `${SHOTS}/swap-search.png` });
  await dlg.getByPlaceholder('Search the recipe box').fill('zzzz');
  await expect(dlg.getByTestId('swap-box-empty')).toContainText('Nothing in the recipe box matches');
  // The Staples chip narrows the box to staples recipes.
  await dlg.getByPlaceholder('Search the recipe box').fill('');
  await dlg.getByText('Staples', { exact: true }).click();
  await expect(dlg.getByTestId('swap-box-row')).toHaveCount(0);
  await expect(dlg.getByTestId('swap-box-empty')).toBeVisible(); // the only one is already on the week
  await page.keyboard.press('Escape');

  // Lunches & breakfast: opens on staples, never asks Café, can be left empty.
  await open(page, '/plan');
  await page.getByTestId('slot-extra').getByRole('button', { name: 'Change' }).click();
  const x = page.getByRole('dialog').filter({ has: page.getByPlaceholder('Search the recipe box') });
  await expect(x.getByRole('heading', { name: 'Lunches & breakfast' })).toBeVisible();
  await expect(x.getByTestId('swap-thinking')).toHaveCount(0);
  await expect(x.getByPlaceholder(/Or say it/)).toHaveCount(0);
  await x.getByRole('button', { name: 'Leave it empty this week' }).click();
  await expect(page.getByTestId('slot-extra')).toContainText('Nothing here this week');
  // Pick the staples again from the chip.
  await page.getByTestId('slot-extra').getByRole('button', { name: 'Pick staples' }).click();
  await expect(x.getByTestId('swap-box-row')).toHaveCount(1);
  await x.getByTestId('swap-box-row').getByText('Staples', { exact: true }).first().click();
  await expect(page.getByTestId('slot-extra')).toContainText('8 items');
  expect((await week(request)).extra.recipe.title).toBe('Staples');
});
