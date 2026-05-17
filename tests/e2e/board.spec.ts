import { test, expect } from '@playwright/test';

test('board page loads with 4 kanban columns', async ({ page }) => {
  await page.goto('/');
  // Placeholder — real assertions added when BoardPage is built
  await expect(page).toHaveTitle(/react board/i);
});
