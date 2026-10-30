// spec: specs/la-curacao-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('La Curacao Guatemala', () => {
  test('Navegar a Televisores desde el home', async ({ page }) => {
    // 1. Abrir /guatemala/
    await page.goto('/guatemala/');
    await expect(page).toHaveTitle(/La Curacao Guatemala/);

    // 2. Click en el link 'Televisores' del home
    await page.getByRole('link', { name: 'Televisores', exact: true }).click();
    await expect(page).toHaveURL(/\/c\/tecnologia\/tv-y-video/);

    // 3. Abrir la subcategoría /guatemala/c/tecnologia/tv-y-video/televisores
    await page.goto('/guatemala/c/tecnologia/tv-y-video/televisores');
    await expect(page).toHaveTitle(/Televisores/);
    // El nombre de la categoría visible está en el breadcrumb (el menú tiene items ocultos)
    await expect(page.locator('.breadcrumbs strong').filter({ hasText: 'Televisores' }).first()).toBeVisible();
    await expect(page.getByText(/\d+ productos/).first()).toBeVisible();
    await expect(page.locator('a[href$="/p"]').first()).toBeVisible();
  });
});
