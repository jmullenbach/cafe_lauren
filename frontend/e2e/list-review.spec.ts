import { test, expect, type Page } from '@playwright/test';

const SHOTS = 'e2e/screenshots';
const API = process.env.CAFE_API_URL || `http://localhost:${process.env.PW_API_PORT || 8081}`;

async function open(page: Page, path: string, who = 'joe') {
  await page.clock.setFixedTime(new Date('2026-08-26T15:00:00'));
  await page.goto('/');
  await page.evaluate((w) => { localStorage.setItem('cafe.user', w); }, who);
  await page.goto(path);
}
const items = async (request: any) => {
  const h = { headers: { 'X-Cafe-User': 'joe' } };
  const monday = (await (await request.get(`${API}/api/state`, h)).json()).week.monday;
  const list = await (await request.get(`${API}/api/weeks/${monday}/list`, h)).json();
  return list.sections.flatMap((s: any) => s.items) as Array<{ key: string; name: string; qty: string | null }>;
};

test('ask café: review grocery list changes in the list, edit one, approve the rest', async ({ page, request }) => {
  const before = await items(request);
  await open(page, '/list');
  await page.getByTestId('ask-fab').click();
  const dlg = page.getByRole('dialog');
  await dlg.getByPlaceholder(/Swap Friday/).fill('Can you check the grocery list?');
  await dlg.getByRole('button', { name: 'Send' }).click();
  const card = dlg.getByTestId('list-changes').last();
  await expect(card).toHaveAttribute('data-pending', '3', { timeout: 20_000 });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${SHOTS}/list-changes-card.png` });
  expect(await items(request)).toEqual(before); // nothing changes until approved

  await card.getByRole('button', { name: 'Review in list' }).click();
  const review = page.getByTestId('list-review');
  await expect(review.getByTestId('list-change')).toHaveCount(3);
  await expect(review.getByTestId('list-context').first()).toBeVisible(); // the rest of the list, for context
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${SHOTS}/list-review.png` });

  // Edit the add, then approve just that one.
  await review.getByRole('button', { name: 'Edit chicken thighs' }).click();
  await review.getByPlaceholder('Amount').fill('4 lbs');
  await review.getByRole('button', { name: 'Use this' }).click();
  await review.getByRole('button', { name: 'Approve chicken thighs' }).click();
  await expect(review.locator('[data-testid="list-change"][data-op="add"]')).toHaveAttribute('data-state', 'applied');
  const mid = await items(request);
  expect(mid.find((i) => i.name === 'chicken thighs')?.qty).toBe('4 lbs');
  expect(mid.length).toBe(before.length + 1);

  // Dismiss the removal, approve what is left.
  await review.locator('[data-testid="list-change"][data-op="remove"]').getByRole('button', { name: /^Dismiss/ }).click();
  await page.getByRole('button', { name: /Approve all · 1/ }).click();
  await expect(page.getByRole('dialog').getByTestId('list-changes').last()).toHaveAttribute('data-pending', '0');
  const after = await items(request);
  expect(after.length).toBe(before.length + 1);
  const changed = after.filter((i) => before.some((b) => b.key === i.key && b.qty !== i.qty));
  expect(changed.map((i) => i.qty)).toEqual(['3 lbs']); // the approved amount change, and only that
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${SHOTS}/list-changes-done.png` });
});
