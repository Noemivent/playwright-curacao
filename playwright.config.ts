import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 90_000,
  expect: { timeout: 15_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'https://www.lacuracaonline.com',
    locale: 'es-GT',
    viewport: { width: 1440, height: 900 },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  retries: process.env.CI ? 1 : 0,
  projects: [
    {
      name: 'chromium',
      testIgnore: /api\//,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      // Pruebas de API: sin navegador, contra Restful-Booker
      name: 'api',
      testDir: './tests/api',
      use: { baseURL: 'https://restful-booker.herokuapp.com' },
    },
  ],
});
