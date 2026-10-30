// spec: specs/la-curacao-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('La Curacao Guatemala', () => {
  test('Buscar un producto existente (refrigeradora)', async ({ page }) => {
    // 1. Abrir /guatemala/, escribir 'refrigeradora' en el combobox 'Search' y presionar Enter
    await page.goto('/guatemala/');
    const buscador = page.getByRole('combobox', { name: 'Search' });
    await buscador.fill('refrigeradora');
    await buscador.press('Enter');

    await expect(page).toHaveURL(/\/search\/refrigeradora/);
    await expect(page.getByText(/Resultados de búsqueda para:\s*'?refrigeradora'?/i).first()).toBeVisible();
    await expect(page.getByText('resultados de "refrigeradora"')).toBeVisible();
    await expect(page.getByText(/\d+ productos/).first()).toBeVisible();
    await expect(page.locator('a[href$="/p"]').first()).toContainText(/Refrigeradora/i);
  });
});
