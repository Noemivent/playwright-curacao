import { test, expect } from '@playwright/test';

test.describe('La Curacao Guatemala', () => {
  test('seed', async ({ page }) => {
    // Punto de partida para los agentes: la página principal de Guatemala
    await page.goto('/guatemala/');
    await expect(page).toHaveTitle(/La Curacao Guatemala/);
  });
});
