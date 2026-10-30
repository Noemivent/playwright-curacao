import { test, expect } from '@playwright/test';

test('Agregar un producto de Línea blanca al carrito y llegar a Pago', async ({ page }) => {
  // 1. Ir a la página principal de Guatemala
  await page.goto('/guatemala/');
  await expect(page).toHaveTitle(/La Curacao Guatemala/);

  // 2. Click en la categoría "Línea blanca"
  await page.getByRole('link', { name: 'Línea blanca' }).first().click();
  await expect(page).toHaveURL(/\/c\/linea-blanca/);

  // 3. Agregar el primer producto al carrito
  await page.getByRole('button', { name: 'Agregar al carrito' }).first().click();

  // El panel lateral confirma que se agregó
  await expect(page.getByText('Tu producto se agregó al carrito.')).toBeVisible();

  // 4. Click en "Ver mi carrito (1)"
  await page.getByRole('link', { name: /Ver mi carrito \(1\)/ }).click();
  await expect(page).toHaveURL(/\/checkout\/cart\//);

  // 5. Click en "Realizar pago"
  // El botón se ve antes de que el JavaScript del carrito termine de cargar,
  // así que reintentamos el click hasta que realmente navegue a Pago.
  await expect(async () => {
    await page.getByRole('button', { name: 'Realizar pago' }).click();
    await expect(page).toHaveURL(/\/checkout\/#shipping/, { timeout: 5_000 });
  }).toPass({ timeout: 30_000 });

  // Llegamos a la pantalla de Pago (paso de identificación/envío)
  await expect(page.getByText('Identifícate')).toBeVisible();
});
