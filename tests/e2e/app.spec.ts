import { expect, test } from '@playwright/test';

test('onboarding completes', async ({ page }) => {
  await page.goto('/onboarding');
  await page.getByRole('button', { name: 'Finish' }).click();
  await expect(page).toHaveURL(/journal/);
});

test('create journal entry, reflect, save, export buttons visible', async ({ page }) => {
  await page.goto('/journal');
  await page.getByLabel('Journal title').fill('Daily check-in');
  await page.getByLabel('Journal text').fill('Today felt overwhelming but I am trying.');
  await page.getByRole('button', { name: 'Reflect' }).click();
  await expect(page.getByText('Warm opening')).toBeVisible();
  await page.getByRole('button', { name: 'Save Entry' }).click();
  await expect(page.getByText('Daily check-in')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Export Entry (PDF)' })).toBeVisible();
});

test('mood page shows deterministic patterns', async ({ page }) => {
  await page.goto('/mood');
  await expect(page.getByText('Patterns (deterministic)')).toBeVisible();
});

test('resources add and edit works', async ({ page }) => {
  await page.goto('/resources');
  await page.getByLabel('Resource label').fill('988');
  await page.getByLabel('Resource value').fill('Call or text 988');
  await page.getByRole('button', { name: 'Add resource' }).click();
  await expect(page.getByText('Call or text 988')).toBeVisible();

  await page.getByRole('button', { name: /Edit 988/ }).click();
  await page.getByLabel('Resource notes').fill('24/7 support');
  await page.getByRole('button', { name: 'Save resource' }).click();
  await expect(page.getByText('24/7 support')).toBeVisible();
});

test('backup export and restore controls are present', async ({ page }) => {
  await page.goto('/settings');
  await expect(page.getByRole('button', { name: 'Export JSON' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Export encrypted' })).toBeVisible();
  await expect(page.locator('input[type="file"]')).toBeVisible();
});

test('breathing completion logging path and packet visibility', async ({ page }) => {
  await page.goto('/breathing');
  await page.getByRole('button', { name: 'Start' }).click();
  await page.waitForTimeout(1200);
  await page.getByRole('button', { name: 'Save completion' }).click();

  await page.goto('/packet');
  await expect(page.getByText('Breathing completions:')).toBeVisible();
});
