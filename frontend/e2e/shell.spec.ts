import { test, expect } from '@playwright/test';

const SHOTS = 'e2e/screenshots';
const TABS = [
  { id: 'home', label: 'Home' },
  { id: 'plan', label: 'Plan' },
  { id: 'list', label: 'List' },
  { id: 'recipes', label: 'Recipes' },
  { id: 'inbox', label: 'Inbox' },
];

test('shell: picker, tabs, ask sheet (backend not required)', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
  await page.reload();

  // Picker shows on first load.
  await expect(page.getByTestId('who-are-you')).toBeVisible();
  await expect(page.getByRole('heading', { name: /who.s this/i })).toBeVisible();
  await page.screenshot({ path: `${SHOTS}/01-picker.png` });

  // Pick Joe; choice persists under cafe.user.
  await page.locator('[data-person="joe"]').click();
  await expect(page.getByTestId('who-are-you')).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem('cafe.user'))).toBe('joe');

  // Tab bar renders with every tab, and each can be switched to.
  const nav = page.getByRole('navigation', { name: 'Main' });
  await expect(nav).toBeVisible();
  for (const t of TABS) await expect(nav.getByRole('button', { name: t.label })).toBeVisible();
  for (const t of TABS) {
    await nav.getByRole('button', { name: t.label }).click();
    await expect(page).toHaveURL(new RegExp(`/${t.id}$`));
    await expect(nav.getByRole('button', { name: t.label })).toHaveAttribute('aria-current', 'page');
    await page.waitForTimeout(150);
    await page.screenshot({ path: `${SHOTS}/02-tab-${t.id}.png` });
  }

  // Ask Café: shown on every tab except Plan; opens and closes.
  await nav.getByRole('button', { name: 'Plan' }).click();
  await expect(page.getByTestId('ask-fab')).toHaveCount(0);
  await nav.getByRole('button', { name: 'Home' }).click();
  await page.getByTestId('ask-fab').click();
  const sheet = page.getByRole('dialog');
  await expect(sheet.getByRole('heading', { name: 'Ask Café' })).toBeVisible();
  await page.waitForTimeout(450);
  await page.screenshot({ path: `${SHOTS}/03-ask-sheet.png` });
  await page.getByTestId('sheet-scrim').click({ position: { x: 20, y: 20 } });
  await expect(page.getByRole('dialog')).toHaveCount(0);

  // Pushed route hides the tab bar; back returns.
  await page.getByText('Taco Tuesday').first().click();
  await expect(page).toHaveURL(/\/meal\/\d+/);
  await expect(nav).toHaveCount(0);
  await page.getByRole('button', { name: 'Back' }).click();
  await expect(nav).toBeVisible();

  // The user survives a reload.
  await page.reload();
  await expect(page.getByTestId('who-are-you')).toHaveCount(0);
});
