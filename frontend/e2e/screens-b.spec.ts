import { test, expect, type Page } from '@playwright/test';
import path from 'node:path';

const SHOTS = 'e2e/screenshots';
const FIXTURE = path.resolve(process.cwd(), '../images/pantry/PXL_20260301_150525718.jpg');

async function asJoe(page: Page, route: string) {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('cafe.user', 'joe'));
  await page.goto(route);
}
const settle = (page: Page) => page.waitForTimeout(400);

test('list: sections, quick add, edit, check, copy, store sheet, instacart', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => {});
  await asJoe(page, '/list');
  await expect(page.getByRole('heading', { name: 'Grocery list' })).toBeVisible();
  await expect(page.getByTestId('list-section').first()).toBeVisible();
  const keys = await page.getByTestId('list-section').evaluateAll((els) => els.map((e) => e.getAttribute('data-section')));
  const order = ['produce', 'frozen', 'meat', 'dry', 'dairy', 'beverages'];
  expect(keys.length).toBeGreaterThan(0);
  expect(keys).toEqual(order.filter((k) => keys.includes(k)));
  expect(keys.length).toBe(6);
  await settle(page);
  await page.screenshot({ path: `${SHOTS}/b-list.png` });

  // Quick add lands in Produce.
  await page.getByPlaceholder(/2 lbs apples/).fill('2 lbs apples');
  await page.getByRole('button', { name: 'Add', exact: true }).first().click();
  const produce = page.locator('[data-section="produce"]');
  const apples = produce.getByTestId('list-item').filter({ hasText: 'apples' });
  await expect(apples).toHaveCount(1);
  await expect(apples).toContainText('2 lbs');

  // Edit it.
  await produce.getByRole('button', { name: 'Edit apples' }).click();
  await page.getByPlaceholder('Item').first().fill('green apples');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(produce.getByText('green apples')).toBeVisible();

  // Check it.
  const row = produce.getByTestId('list-item').filter({ hasText: 'green apples' });
  await row.getByText('green apples').click();
  await expect(row.getByRole('checkbox')).toBeChecked();
  await page.reload();
  await expect(page.locator('[data-section="produce"]').getByTestId('list-item').filter({ hasText: 'green apples' }).getByRole('checkbox')).toBeChecked();

  // Delete it.
  await page.locator('[data-section="produce"]').getByRole('button', { name: 'Edit green apples' }).click();
  await page.getByRole('button', { name: 'Remove' }).click();
  await expect(page.getByText('green apples')).toHaveCount(0);

  // Copy.
  await page.getByRole('button', { name: 'Copy', exact: true }).click();
  await expect(page.getByText('List copied')).toBeVisible();

  // Store sheet.
  await page.getByText('Change', { exact: true }).click();
  const sheet = page.getByRole('dialog');
  await expect(sheet.getByRole('heading', { name: 'Store & ordering' })).toBeVisible();
  await settle(page);
  await page.screenshot({ path: `${SHOTS}/b-store-sheet.png` });
  await sheet.getByText('Instacart pickup').click();
  await expect(sheet.locator('[aria-pressed="true"]', { hasText: 'Instacart pickup' })).toBeVisible();
  await sheet.getByText('Instacart delivery').click();
  await expect(sheet.locator('[aria-pressed="true"]', { hasText: 'Instacart delivery' })).toBeVisible();
  // Amazon is not available.
  await expect(sheet.locator('[aria-disabled="true"]', { hasText: 'Amazon delivery' })).toBeVisible();
  await sheet.getByRole('button', { name: 'Open in Instacart' }).click();
  await expect(sheet.getByTestId('instacart-not-set-up')).toContainText('Not set up yet');
  await expect(sheet.getByRole('button', { name: 'Copy list' })).toBeVisible();
  await expect(sheet.getByRole('button', { name: 'Send the list', exact: true })).toBeVisible();
  await settle(page);
  await page.screenshot({ path: `${SHOTS}/b-store-sheet-instacart.png` });

  // Send sheet.
  await sheet.getByRole('button', { name: 'Send the list', exact: true }).click();
  await settle(page);
  await expect(page.getByRole('dialog').getByRole('heading', { name: 'Send the list' })).toBeVisible();
  await page.screenshot({ path: `${SHOTS}/b-send-sheet.png` });
});

test('inbox: request create and answer, pantry upload, read, resolve unsure, confirm', async ({ page }) => {
  await asJoe(page, '/inbox');
  await expect(page.getByRole('heading', { name: 'Inbox' })).toBeVisible();
  await settle(page);
  await page.screenshot({ path: `${SHOTS}/b-inbox-requests.png` });

  await page.getByPlaceholder('Something with salmon?').fill('Something with salmon?');
  await page.getByRole('button', { name: 'Send', exact: true }).click();
  const mine = page.getByTestId('request-row').filter({ hasText: 'Something with salmon?' });
  await expect(mine).toBeVisible();
  await mine.getByRole('button', { name: 'Add to plan' }).click();
  await expect(mine.getByText('Café will work it in')).toBeVisible();

  // Pantry tab.
  await page.getByRole('radio', { name: 'Pantry' }).click();
  await expect(page.locator('figure').first()).toBeVisible();
  const before = await page.locator('figure').count();
  await page.getByTestId('pantry-file').setInputFiles([FIXTURE]);
  await expect(page.getByText(/photo added/)).toBeVisible();
  await expect.poll(() => page.locator('figure').count()).toBe(before + 1);
  await settle(page);
  await page.screenshot({ path: `${SHOTS}/b-inbox-pantry.png` });

  // Read the pantry (job). Needs the AI layer.
  const read = page.getByRole('button', { name: /Read the pantry/ });
  await expect(read).toBeVisible();
  await read.click();
  await expect(page.getByRole('button', { name: /Review what it found/ })).toBeVisible({ timeout: 30_000 });
  await page.getByRole('button', { name: /Review what it found/ }).click();
  await expect(page).toHaveURL(/\/inbox\/pantry$/);
  await settle(page);
  await page.screenshot({ path: `${SHOTS}/b-pantry-review.png` });

  // Every AI item shows the dashed tag; unsure ones block "confirm all".
  await expect(page.getByTestId('pantry-row').first()).toBeVisible();
  const unsureRows = page.locator('[data-testid="pantry-row"][data-state="unsure"]');
  const unsure = await unsureRows.count();
  if (unsure > 0) {
    await expect(page.getByRole('button', { name: /unsure item/ })).toBeDisabled();
    // Fix one by editing, confirm one, remove the rest.
    await unsureRows.first().getByText(/./).first().click();
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    while ((await unsureRows.count()) > 0) {
      const n = await unsureRows.count();
      await unsureRows.first().getByRole('button', { name: /is not there/ }).click();
      await expect.poll(() => unsureRows.count()).toBeLessThan(n);
    }
  }
  // Add a missed item.
  await page.getByPlaceholder('Half a bag of rice').fill('Half a bag of rice');
  await page.getByRole('button', { name: 'Add', exact: true }).last().click();
  await expect(page.getByText('Half a bag of rice')).toBeVisible();
  const confirm = page.getByRole('button', { name: /^Confirm \d+ items$/ });
  await expect(confirm).toBeEnabled();
  await confirm.click();
  await expect(page).toHaveURL(/\/inbox\?seg=pantry$/);
  await expect(page.getByText(/^Confirmed/)).toBeVisible();
});

test('recipes: search, filter, open, up next, add recipe draft', async ({ page }) => {
  await asJoe(page, '/recipes');
  await expect(page.getByRole('heading', { name: 'Recipe box' })).toBeVisible();
  await expect(page.getByTestId('recipe-list').getByTestId('recipe-row').first()).toBeVisible();
  await settle(page);
  await page.screenshot({ path: `${SHOTS}/b-recipes.png` });
  const all = await page.getByTestId('recipe-list').getByTestId('recipe-row').count();

  await page.getByPlaceholder('Search recipes').fill('chili');
  await expect.poll(() => page.getByTestId('recipe-list').getByTestId('recipe-row').count()).toBeLessThan(all);
  await expect(page.getByTestId('recipe-list').getByTestId('recipe-row').first()).toContainText(/chili/i);
  await page.getByPlaceholder('Search recipes').fill('zzzzqq');
  await expect(page.getByText(/No recipes match/)).toBeVisible();
  await page.getByPlaceholder('Search recipes').fill('');
  await page.getByRole('button', { name: '5 stars' }).click();
  await expect.poll(() => page.getByTestId('recipe-list').getByTestId('recipe-row').count()).toBeGreaterThan(0);
  await expect(page.getByTestId('recipe-list')).toHaveAttribute('data-busy', 'false');
  const n5 = await page.getByTestId('recipe-list').getByTestId('recipe-row').count();
  expect(n5).toBeLessThan(all);
  await page.getByRole('button', { name: 'All', exact: true }).click();
  await expect.poll(() => page.getByTestId('recipe-list').getByTestId('recipe-row').count()).toBe(all);

  // Open one, add to Up next.
  await page.getByTestId('recipe-list').getByTestId('recipe-row').first().click();
  await expect(page).toHaveURL(/\/recipes\/\d+$/);
  await expect(page.getByTestId('recipe-title')).toBeVisible();
  await settle(page);
  await page.screenshot({ path: `${SHOTS}/b-recipe-detail.png` });
  const upNext = page.getByRole('button', { name: /Add to Up next|In Up next/ });
  if ((await upNext.textContent())?.includes('In Up next')) { await upNext.click(); await expect(page.getByRole('button', { name: 'Add to Up next' })).toBeVisible(); }
  await page.getByRole('button', { name: 'Add to Up next' }).click();
  await expect(page.getByRole('button', { name: 'In Up next' })).toBeVisible();

  // Mark cooked with stars.
  await page.getByRole('button', { name: 'Mark cooked' }).click();
  await page.getByLabel('0 of 5 stars').locator('span').nth(3).click();
  await page.getByRole('button', { name: 'Mark as cooked' }).click();
  await expect(page.getByText('Marked as cooked')).toBeVisible();

  // Add a recipe: describe it.
  await page.getByRole('button', { name: 'Back' }).click();
  await page.getByRole('button', { name: 'Add', exact: true }).click();
  const sheet = page.getByRole('dialog');
  await expect(sheet.getByRole('heading', { name: 'Add a recipe' })).toBeVisible();
  await settle(page);
  await page.screenshot({ path: `${SHOTS}/b-add-recipe.png` });
  await sheet.locator('textarea').fill('Our tortilla soup, but in the slow cooker');
  await sheet.getByRole('button', { name: 'Write a draft' }).click();
  await expect(page).toHaveURL(/\/recipes\/\d+$/, { timeout: 30_000 });
  await expect(page.getByTestId('draft-banner')).toBeVisible();
  await settle(page);
  await page.screenshot({ path: `${SHOTS}/b-recipe-draft.png` });
  await page.getByRole('button', { name: 'Save to recipe box' }).click();
  await expect(page.getByText('Saved to the recipe box')).toBeVisible();
  await expect(page.getByTestId('draft-banner')).toHaveCount(0);
});

test('settings: health and exports', async ({ page }) => {
  await asJoe(page, '/inbox');
  await page.getByTestId('open-settings').click();
  await expect(page).toHaveURL(/\/settings$/);
  await expect(page.getByTestId('health')).toContainText('Database');
  await expect(page.getByTestId('health')).toContainText('Not set up yet');
  await settle(page);
  await page.screenshot({ path: `${SHOTS}/b-settings.png` });
  for (const [name, re] of [['Everything (JSON)', /\.json$/], ['Recipes (zip)', /\.zip$/], ['Database file', /\.db$/], ['This week (Markdown)', /\.md$/]] as const) {
    const [dl] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name }).click()]);
    expect(dl.suggestedFilename()).toMatch(re);
  }
  // Save a change.
  await page.getByRole('button', { name: 'Fri' }).click();
  await page.getByRole('button', { name: 'Save settings' }).click();
  await expect(page.getByText('Settings saved')).toBeVisible();
});
