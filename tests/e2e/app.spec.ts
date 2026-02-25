import { test, expect } from '@playwright/test';

test('onboarding to journal flow', async ({ page }) => {
  await page.goto('/onboarding');
  await page.getByRole('button', { name: 'Finish' }).click();
  await expect(page).toHaveURL(/journal/);
});

test('journal reflect and save', async ({ page }) => {
  await page.goto('/journal');
  await page.getByPlaceholder('Write your entry...').fill('Today felt overwhelming but I am trying.');
  await page.getByRole('button', { name: 'Reflect' }).click();
  await expect(page.getByText('Warm opening')).toBeVisible();
  await page.getByRole('button', { name: 'Save Entry' }).click();
});

test('mood and resources pages', async ({ page }) => {
  await page.goto('/mood');
  await expect(page.getByText('Patterns')).toBeVisible();
  await page.goto('/resources');
  await page.getByPlaceholder('Label').fill('988');
  await page.getByPlaceholder('Number / URL / text').fill('Call or text 988');
  await page.getByRole('button', { name: 'Add resource' }).click();
});

test('backup export button visible', async ({ page }) => {
  await page.goto('/settings');
  await expect(page.getByRole('button', { name: 'Export JSON' })).toBeVisible();
});
