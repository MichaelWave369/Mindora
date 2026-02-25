import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('home has no critical a11y violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  const critical = results.violations.filter((violation) => violation.impact === 'critical');
  expect(critical).toEqual([]);
});

test('journal has no critical a11y violations', async ({ page }) => {
  await page.goto('/journal');
  const results = await new AxeBuilder({ page }).analyze();
  const critical = results.violations.filter((violation) => violation.impact === 'critical');
  expect(critical).toEqual([]);
});
