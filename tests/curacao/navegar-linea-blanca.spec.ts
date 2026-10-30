// spec: specs/la-curacao-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('La Curacao Guatemala', () => {
  test('Navegar a la categoría Línea blanca desde el home', async ({ page }) => {
    // 1. Abrir /guatemala/
    await page.goto('/guatemala/');
    await expect(page).toHaveTitle(/La Curacao Guatemala/);

    // 2. Click en el link 'Línea blanca' del menú del home
    await page.getByRole('link', { name: 'Línea blanca' }).first().click();
    await expect(page).toHaveURL(/\/c\/linea-blanca/);
    await expect(page).toHaveTitle(/Línea Blanca/);
    // El nombre de la categoría visible está en el breadcrumb (el menú tiene items ocultos)
    await expect(page.locator('.breadcrumbs strong').filter({ hasText: 'Línea Blanca' }).first()).toBeVisible();
  });
});
