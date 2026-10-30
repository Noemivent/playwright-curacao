// spec: specs/la-curacao-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('La Curacao Guatemala', () => {
  test('Navegar a la categoría Celulares desde el home', async ({ page }) => {
    // 1. Abrir /guatemala/
    await page.goto('/guatemala/');
    await expect(page).toHaveTitle(/La Curacao Guatemala/);

    // 2. Click en el link 'Celulares' del home
    await page.getByRole('link', { name: 'Celulares', exact: true }).click();
    await expect(page).toHaveURL(/\/c\/telefonia\/celulares-y-telefonos\/celulares/);
    await expect(page).toHaveTitle(/Celulares/);
    await expect(page.getByText(/\d+ productos/).first()).toBeVisible();
  });
});
