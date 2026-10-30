// spec: specs/la-curacao-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('La Curacao Guatemala', () => {
  test('Eliminar un producto del carrito', async ({ page }) => {
    // 1. Agregar el primer producto de Línea blanca al carrito y click en 'Ver mi carrito (1)'
    await page.goto('/guatemala/c/linea-blanca');
    await page.getByRole('button', { name: 'Agregar al carrito' }).first().click();
    await expect(page.getByText('Tu producto se agregó al carrito.')).toBeVisible();
    await page.getByRole('link', { name: /Ver mi carrito \(1\)/ }).click();
    await expect(page).toHaveURL(/\/checkout\/cart\//);
    await expect(page.getByRole('spinbutton', { name: 'Cantidad' })).toHaveValue('1');

    // 2. Click en el link 'Eliminar' del producto
    // El link usa data-post (JS), así que reintentamos hasta que el carrito quede vacío
    const vacio = page.getByText('No tienes ningún producto en tu bolsa.');
    await expect(async () => {
      if (!(await vacio.isVisible())) await page.locator('a.action-delete').first().click();
      await expect(vacio).toBeVisible({ timeout: 8_000 });
    }).toPass({ timeout: 45_000 });
    await expect(page.getByRole('link', { name: 'aquí' })).toBeVisible();
  });
});
