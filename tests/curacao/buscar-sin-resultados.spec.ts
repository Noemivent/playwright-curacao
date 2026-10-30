// spec: specs/la-curacao-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('La Curacao Guatemala', () => {
  test('Buscar un texto sin resultados', async ({ page }) => {
    // 1. Abrir /guatemala/, escribir 'xqzwvk123' en el combobox 'Search' y presionar Enter
    await page.goto('/guatemala/');
    const buscador = page.getByRole('combobox', { name: 'Search' });
    await buscador.fill('xqzwvk123');
    await buscador.press('Enter');

    await expect(page).toHaveURL(/\/search\/xqzwvk123/);
    await expect(page.getByText('0 productos')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Tu búsqueda no ha dado resultados.' })).toBeVisible();
  });
});
