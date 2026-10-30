import { test, expect } from '@playwright/test';

// Pruebas de API contra Restful-Booker, una API pública hecha para practicar.
// Documentación: https://restful-booker.herokuapp.com/apidoc/index.html
// Usuario y contraseña de demo publicados por la propia API.
const DEMO_USER = { username: 'admin', password: 'password123' };

const nuevaReserva = {
  firstname: 'Noemi',
  lastname: 'QA',
  totalprice: 150,
  depositpaid: true,
  bookingdates: { checkin: '2026-11-01', checkout: '2026-11-05' },
  additionalneeds: 'Desayuno',
};

test.describe.serial('API Restful-Booker: ciclo de vida de una reserva', () => {
  let token: string;
  let bookingId: number;

  test('GET /ping responde que la API está viva', async ({ request }) => {
    const res = await request.get('/ping');
    expect(res.status()).toBe(201);
  });

  test('POST /auth devuelve un token con credenciales válidas', async ({ request }) => {
    const res = await request.post('/auth', { data: DEMO_USER });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.token).toBeTruthy();
    token = body.token;
  });

  test('POST /booking crea una reserva', async ({ request }) => {
    const res = await request.post('/booking', { data: nuevaReserva });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.bookingid).toEqual(expect.any(Number));
    expect(body.booking).toMatchObject(nuevaReserva);
    bookingId = body.bookingid;
  });

  test('GET /booking/:id devuelve la reserva creada', async ({ request }) => {
    const res = await request.get(`/booking/${bookingId}`);
    expect(res.status()).toBe(200);
    expect(await res.json()).toMatchObject(nuevaReserva);
  });

  test('PUT /booking/:id actualiza la reserva con token', async ({ request }) => {
    const actualizada = { ...nuevaReserva, totalprice: 200, additionalneeds: 'Cena' };
    const res = await request.put(`/booking/${bookingId}`, {
      data: actualizada,
      headers: { Cookie: `token=${token}` },
    });
    expect(res.status()).toBe(200);
    expect(await res.json()).toMatchObject({ totalprice: 200, additionalneeds: 'Cena' });
  });

  test('DELETE /booking/:id elimina la reserva y ya no existe', async ({ request }) => {
    const res = await request.delete(`/booking/${bookingId}`, {
      headers: { Cookie: `token=${token}` },
    });
    expect(res.status()).toBe(201);

    const despues = await request.get(`/booking/${bookingId}`);
    expect(despues.status()).toBe(404);
  });
});

test.describe('API Restful-Booker: casos negativos', () => {
  test('POST /auth con contraseña incorrecta no devuelve token', async ({ request }) => {
    const res = await request.post('/auth', { data: { ...DEMO_USER, password: 'incorrecta' } });
    const body = await res.json();
    expect(body.token).toBeUndefined();
    expect(body.reason).toBe('Bad credentials');
  });

  test('PUT /booking/:id sin token es rechazado con 403', async ({ request }) => {
    const res = await request.put('/booking/1', { data: nuevaReserva });
    expect(res.status()).toBe(403);
  });

  test('GET /booking/:id inexistente responde 404', async ({ request }) => {
    const res = await request.get('/booking/999999999');
    expect(res.status()).toBe(404);
  });
});
