// spec: specs/la-curacao-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('La Curacao Guatemala', () => {
  test('Ver el detalle de un producto de Línea blanca', async ({ page }) => {
    // 1. Abrir /guatemala/c/linea-blanca y hacer click en el primer producto del listado
    await page.goto('/guatemala/c/linea-blanca');
    await page.locator('a[href$="/p"]').first().click();
    await expect(page).toHaveURL(/\/p$/);

    // 2. Revisar la página de producto
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    // Solo se considera el precio visible (hay precios ocultos en otros elementos)
    await expect(page.locator('.price').filter({ hasText: /Q[\d,]+\.\d{2}/ }).filter({ visible: true }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Agregar al carrito' }).first()).toBeVisible();
  });
});
