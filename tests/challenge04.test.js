const request = require('supertest');
const app = require('../app');

describe('Challenge 04 - Mongoose: GET /activities?type=', () => {
  test('sin filtro devuelve todas las actividades', async () => {
    const res = await request(app).get('/activities');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(res.body).toHaveLength(10);
  });

  test('con type=CALL devuelve solo llamadas', async () => {
    const res = await request(app).get('/activities').query({ type: 'CALL' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(4);

    for (const activity of res.body) {
      expect(activity.type).toBe('CALL');
    }
  });

  test('con type=EMAIL devuelve solo correos', async () => {
    const res = await request(app).get('/activities').query({ type: 'EMAIL' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(3);

    for (const activity of res.body) {
      expect(activity.type).toBe('EMAIL');
    }
  });

  test('el filtro no mezcla documentos de otros tipos', async () => {
    const res = await request(app).get('/activities').query({ type: 'CALL' });
    const types = new Set(res.body.map((activity) => activity.type));

    expect(types.has('EMAIL')).toBe(false);
    expect(types.has('MEETING')).toBe(false);
  });
});
