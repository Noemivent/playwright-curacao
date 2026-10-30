// spec: specs/la-curacao-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

// Convierte "Q3,298.00" en 3298
const aNumero = (texto: string) => Number(texto.replace(/[^\d.]/g, ''));

test.describe('La Curacao Guatemala', () => {
  test('Cambiar la cantidad de un producto en el carrito', async ({ page }) => {
    // 1. Agregar el primer producto de Línea blanca al carrito y click en 'Ver mi carrito (1)'
    await page.goto('/guatemala/c/linea-blanca');
    await page.getByRole('button', { name: 'Agregar al carrito' }).first().click();
    await expect(page.getByText('Tu producto se agregó al carrito.')).toBeVisible();
    await page.getByRole('link', { name: /Ver mi carrito \(1\)/ }).click();
    await expect(page).toHaveURL(/\/checkout\/cart\//);

    const cantidad = page.getByRole('spinbutton', { name: 'Cantidad' });
    await expect(cantidad).toHaveValue('1');

    // 2. Guardar el 'Total del pedido', cambiar 'Cantidad' a 2 y presionar Enter
    const total = page.locator('.cart-summary tr.grand.totals .price');
    const totalInicial = aNumero(await total.innerText());

    // El JS del carrito carga tarde: reintentamos hasta que el carrito se recargue con 2
    await expect(async () => {
      await cantidad.fill('2');
      await cantidad.press('Enter');
      await expect(cantidad).toHaveValue('2', { timeout: 5_000 });
      await expect(page.locator('.counter-number').first()).toHaveText('2', { timeout: 5_000 });
    }).toPass({ timeout: 45_000 });

    await expect.poll(async () => aNumero(await total.innerText())).toBe(totalInicial * 2);
  });
});
