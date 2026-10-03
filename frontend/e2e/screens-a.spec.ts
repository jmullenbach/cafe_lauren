import { test, expect, type Page } from '@playwright/test';

const SHOTS = 'e2e/screenshots';
const API = process.env.CAFE_API_URL || `http://localhost:${process.env.PW_API_PORT || 8081}`;
test.describe.configure({ mode: 'serial' });

// Wednesday afternoon, like the prototype, so "tonight" is the Wednesday slot.
async function open(page: Page, path: string, who = 'joe') {
  await page.clock.setFixedTime(new Date('2026-08-26T15:00:00'));
  await page.goto('/');
  await page.evaluate((w) => { localStorage.setItem('cafe.user', w); }, who);
  await page.goto(path);
}
const slot = (page: Page, day: string) => page.getByTestId(`slot-${day}`);
const week = async (request: any) => (await (await request.get(`${API}/api/state`, { headers: { 'X-Cafe-User': 'joe' } })).json()).week;

test('home: tonight and needs you', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await open(page, '/home');
  await expect(page.getByRole('heading', { name: 'Good afternoon, Joe' })).toBeVisible();
  const tonight = page.getByTestId('tonight');
  await expect(tonight).toContainText('Sheet Pan Pork Chops with Roasted Veggies');
  await expect(tonight).toContainText('Start by 5:20 for dinner at 6');
  await expect(tonight.getByRole('button', { name: 'Start cooking' })).toBeVisible();
  const needs = page.getByTestId('needs-you');
  await expect(needs).toContainText('suggested meals to review');
  await expect(needs).toContainText('Check what Café found in the pantry');
  await expect(needs).toContainText('new requests');
  await expect(page.getByText('This week', { exact: true })).toBeVisible();
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${SHOTS}/a-home.png` });
  await page.getByTestId('needs-you').scrollIntoViewIfNeeded();
  await page.locator('[data-screen]').evaluate((e) => e.scrollTo(0, 700));
  await page.waitForTimeout(200);
  await page.screenshot({ path: `${SHOTS}/a-home-scrolled.png` });
  expect(errors).toEqual([]);
});

test('plan: week, keep, vote, swap resets votes', async ({ page, request }) => {
  await open(page, '/plan');
  await expect(page.getByRole('heading', { name: 'The plan' })).toBeVisible();
  await expect(slot(page, 'wed')).toHaveAttribute('data-status', 'suggested');
  await expect(slot(page, 'sat')).toHaveAttribute('data-status', 'suggested');
  await expect(slot(page, 'wed').getByText('Suggested', { exact: true })).toBeVisible();
  await expect(slot(page, 'wed')).toContainText('Pork chops on sale');
  await expect(page.getByRole('button', { name: 'Keep the other 2 and approve' })).toBeVisible();
  await expect(slot(page, 'tue')).toContainText('Taco leftovers');
  await expect(slot(page, 'thu')).toContainText('Leidy cooks');
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${SHOTS}/a-plan.png` });
  await page.locator('[data-screen]').evaluate((e) => e.scrollTo(0, 5000));
  await page.waitForTimeout(200);
  await page.screenshot({ path: `${SHOTS}/a-plan-scrolled.png` });
  await page.locator('[data-screen]').evaluate((e) => e.scrollTo(0, 0));

  // Keep Saturday; it becomes votable.
  await slot(page, 'sat').getByRole('button', { name: 'Keep' }).click();
  await expect(slot(page, 'sat')).toHaveAttribute('data-status', 'kept');
  await expect(page.getByRole('button', { name: 'Keep the other 1 and approve' })).toBeVisible();
  // Vote up then down on Saturday (Joe had voted down in the seed; toggling changes the counts).
  const down = slot(page, 'sat').getByRole('button', { name: 'Not this week' });
  await down.click();
  await expect(down).toHaveAttribute('aria-pressed', 'true');
  const up = slot(page, 'sat').getByRole('button', { name: 'Yes please' });
  await up.click();
  await expect(up).toHaveAttribute('aria-pressed', 'true');
  await expect(down).toHaveAttribute('aria-pressed', 'false');

  // Swap Wednesday: Café's options come back through the job stream.
  await slot(page, 'wed').getByRole('button', { name: 'Swap' }).click();
  await expect(page.getByRole('dialog')).toContainText('Swap Wednesday');
  await expect(page.getByTestId('swap-option').first()).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${SHOTS}/a-swap.png` });
  await page.getByRole('dialog').locator('div[style*="overflow: auto"]').evaluate((e) => e.scrollTo(0, 5000));
  await page.waitForTimeout(200);
  await page.screenshot({ path: `${SHOTS}/a-swap-scrolled.png` });
  await page.getByRole('dialog').locator('div[style*="overflow: auto"]').evaluate((e) => e.scrollTo(0, 0));
  const title = (await page.getByTestId('swap-option').first().locator('span').first().textContent())!;
  await page.getByTestId('swap-option').first().getByRole('button', { name: 'Use this' }).click();
  await expect(slot(page, 'wed')).toContainText(title);
  await expect(slot(page, 'wed')).toHaveAttribute('data-status', 'edited');
  // Votes reset: only the swapper's thumbs-up remains.
  await expect(slot(page, 'wed').getByRole('button', { name: 'Yes please' })).toHaveAttribute('aria-pressed', 'true');
  await expect(slot(page, 'wed').getByRole('button', { name: 'Yes please' })).toContainText('1');
  await expect(slot(page, 'wed').getByRole('button', { name: 'Not this week' })).not.toContainText('1');
  const w = await week(request);
  const wed = w.slots.find((s: any) => s.day === 'wed');
  expect(Object.keys(wed.votes)).toEqual(['joe']);
});

test('plan: reject with reasons, open night, move, approve', async ({ page, request }) => {
  await open(page, '/plan');
  // Reject Saturday -> leave the night open.
  await slot(page, 'sat').getByRole('button', { name: 'More' }).count();
  await slot(page, 'sat').getByRole('button', { name: 'Change' }).click();
  await expect(page.getByRole('dialog')).toContainText('Change Saturday');
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${SHOTS}/a-edit.png` });
  await page.getByRole('dialog').getByText('Take it off the plan').click();
  await expect(page.getByRole('dialog')).toContainText('Tell Café why');
  await page.getByRole('dialog').getByRole('button', { name: 'Too much work' }).click();
  await page.getByRole('dialog').getByPlaceholder(/Anything else/).fill('Long week');
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${SHOTS}/a-reject.png` });
  await page.getByRole('button', { name: 'Leave night open' }).click();
  await expect(slot(page, 'sat')).toHaveAttribute('data-kind', 'open');
  await expect(slot(page, 'sat')).toContainText('Not this week: Too much work · Long week');
  const fb = (await week(request)).slots.find((s: any) => s.day === 'sat');
  expect(fb.kind).toBe('open');

  // Move Friday's shrimp to Saturday (swaps with the open night).
  await slot(page, 'fri').getByRole('button', { name: 'Change' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Sat' }).click();
  await expect(slot(page, 'sat')).toContainText('Basil Shrimp with Feta and Orzo');
  await expect(slot(page, 'fri')).toHaveAttribute('data-kind', 'open');

  // Approve the week.
  await page.getByRole('button', { name: /approve/i }).click();
  await expect(page.getByTestId('approved-note')).toContainText('Approved by Joe');
  await expect(page.getByRole('button', { name: /approve/i })).toHaveCount(0);
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${SHOTS}/a-plan-approved.png` });
});

test('plan: reject with another asks Café for a replacement', async ({ page, request }) => {
  await open(page, '/plan');
  // Wed was swapped (edited). Take it off the plan, ask for another.
  await slot(page, 'wed').getByRole('button', { name: 'Change' }).click();
  await page.getByRole('dialog').getByText('Take it off the plan').click();
  await page.getByRole('dialog').getByRole('button', { name: 'Had it recently' }).click();
  await page.getByRole('button', { name: 'Suggest another' }).click();
  // Either thinking shows up first, or the fake AI is quick: the slot ends up as a new suggestion.
  await expect(slot(page, 'wed')).toHaveAttribute('data-status', 'suggested', { timeout: 20_000 });
  await expect(slot(page, 'wed')).toContainText('Had it recently');
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${SHOTS}/a-plan-replaced.png` });
});

test('meal detail: edit an ingredient, cook mode, check a step', async ({ page, request }) => {
  await open(page, '/plan');
  // The basil shrimp (moved to Saturday above) is approved and has steps in the seed.
  const w = await week(request);
  const shrimp = w.slots.find((s: any) => s.recipe && s.recipe.title.startsWith('Basil Shrimp'));
  const day = shrimp.day;
  await open(page, `/meal/${shrimp.recipe_id}?day=${day}`);
  await expect(page.getByRole('heading', { name: 'Basil Shrimp with Feta and Orzo' })).toBeVisible();
  await expect(page.getByTestId('ingredient').first()).toBeVisible();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${SHOTS}/a-meal.png` });
  await page.locator('[data-screen]').evaluate((e) => e.scrollTo(0, 5000));
  await page.waitForTimeout(200);
  await page.screenshot({ path: `${SHOTS}/a-meal-scrolled.png` });
  await page.locator('[data-screen]').evaluate((e) => e.scrollTo(0, 0));

  // Edit: remove one ingredient and add one; the PATCH lands in ingredients_override.
  const before = await page.getByTestId('ingredient').count();
  await page.getByRole('button', { name: 'Edit', exact: true }).click();
  await page.getByRole('button', { name: /^Remove / }).first().click();
  await page.getByPlaceholder('Add an ingredient').fill('2 cups chicken stock');
  await page.getByRole('button', { name: 'Add', exact: true }).click();
  await expect(page.getByTestId('ingredient')).toHaveCount(before);
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${SHOTS}/a-meal-editing.png` });
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByText('Marked as edited. The grocery list follows.')).toBeVisible();
  const after = (await week(request)).slots.find((s: any) => s.day === day);
  expect(after.ingredients_edited).toBe(true);
  expect(after.ingredients.some((i: any) => i.name === 'chicken stock')).toBe(true);

  // Cook mode.
  await page.locator('[data-screen]').evaluate((e) => e.scrollTo(0, 0));
  await page.getByRole('button', { name: 'Start cooking' }).click();
  await expect(page.getByText('Step 1 of')).toBeVisible();
  await page.getByRole('button', { name: 'Next step' }).click();
  await expect(page.getByText('Step 2 of')).toBeVisible();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${SHOTS}/a-cook.png` });
  // Tap the first step's circle: it is done (check icon) while step 2 is active.
  await expect(page.locator('svg.lucide-check').first()).toBeVisible();
});

test('ask café: send a message, apply a proposal', async ({ page, request }) => {
  await open(page, '/home');
  await page.getByRole('button', { name: 'Ask Café' }).click();
  const dlg = page.getByRole('dialog');
  await expect(dlg).toContainText('Nothing changes until you say so');
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${SHOTS}/a-chat.png` });
  await dlg.getByRole('button', { name: 'Make Thursday vegetarian' }).click();
  await expect(dlg.getByTestId('chat-typing')).toBeVisible();
  await expect(dlg.getByTestId('proposal')).toBeVisible({ timeout: 20_000 });
  await expect(dlg.getByTestId('proposal')).toHaveAttribute('data-state', 'pending');
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${SHOTS}/a-chat-proposal.png` });
  // Plan is untouched until Apply.
  const thu0 = (await week(request)).slots.find((s: any) => s.day === 'thu');
  await dlg.getByRole('button', { name: 'Apply' }).click();
  await expect(dlg.getByTestId('proposal')).toHaveAttribute('data-state', 'applied');
  const thu = (await week(request)).slots.find((s: any) => s.day === 'thu');
  expect(JSON.stringify(thu)).not.toBe(JSON.stringify(thu0));
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${SHOTS}/a-chat-applied.png` });
  // Free-text message, then dismiss.
  await dlg.getByPlaceholder(/Swap Friday/).fill('Something cheaper please');
  await dlg.getByRole('button', { name: 'Send' }).click();
  await expect(dlg.getByTestId('proposal')).toHaveCount(2, { timeout: 20_000 });
  await dlg.getByRole('button', { name: 'Not that' }).last().click();
  await expect(dlg.getByTestId('proposal').last()).toHaveAttribute('data-state', 'dismissed');
});
