// spec: specs/la-curacao-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('La Curacao Guatemala', () => {
  test('Verificar totales del carrito y llegar a Pago', async ({ page }) => {
    // 1. Agregar el primer producto de Línea blanca al carrito y click en 'Ver mi carrito (1)'
    await page.goto('/guatemala/c/linea-blanca');
    await page.getByRole('button', { name: 'Agregar al carrito' }).first().click();
    await expect(page.getByText('Tu producto se agregó al carrito.')).toBeVisible();
    await page.getByRole('link', { name: /Ver mi carrito \(1\)/ }).click();
    await expect(page).toHaveURL(/\/checkout\/cart\//);

    const resumen = page.locator('.cart-summary');
    await expect(resumen.getByText('Precio', { exact: true })).toBeVisible();
    await expect(resumen.getByText('Total del pedido')).toBeVisible();

    // El total del pedido es igual al precio del producto (1 unidad, sin envío aún)
    const precioProducto = page.locator('#shopping-cart-table td.col.subtotal .price').first();
    const total = resumen.locator('tr.grand.totals .price');
    await expect(total).toHaveText(/Q[\d,]+\.\d{2}/);
    await expect(total).toHaveText(await precioProducto.innerText());

    // 2. Click en 'Realizar pago'
    // El botón se ve antes de que el JavaScript del carrito termine de cargar,
    // así que reintentamos el click hasta que realmente navegue a Pago.
    await expect(async () => {
      await page.getByRole('button', { name: 'Realizar pago' }).click();
      await expect(page).toHaveURL(/\/checkout\/#shipping/, { timeout: 5_000 });
    }).toPass({ timeout: 30_000 });

    // Llegamos a Pago sin enviar ningún formulario
    await expect(page.getByText('Identifícate')).toBeVisible();
  });
});
