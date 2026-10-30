// spec: specs/la-curacao-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('La Curacao Guatemala', () => {
  test('Agregar un producto al carrito desde la página de producto', async ({ page }) => {
    // 1. Abrir el primer producto de /guatemala/c/linea-blanca
    await page.goto('/guatemala/c/linea-blanca');
    await page.locator('a[href$="/p"]').first().click();
    await expect(page).toHaveURL(/\/p$/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // 2. Click en 'Agregar al carrito' (el primero, del producto principal)
    await page.getByRole('button', { name: 'Agregar al carrito' }).first().click();
    await expect(page.getByText('Tu producto se agregó al carrito.')).toBeVisible();
    await expect(page.getByRole('link', { name: /Ver mi carrito \(1\)/ })).toBeVisible();
  });
});
