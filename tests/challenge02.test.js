const request = require('supertest');
const app = require('../app');

describe('Challenge 02 - Mongoose: GET /activities', () => {
  test('devuelve 200 y un array JSON', async () => {
    const res = await request(app).get('/activities');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('devuelve las 10 actividades iniciales', async () => {
    const res = await request(app).get('/activities');

    expect(res.body).toHaveLength(10);
  });

  test('cada actividad tiene la estructura minima', async () => {
    const res = await request(app).get('/activities');

    expect(res.body.length).toBeGreaterThan(0);

    for (const activity of res.body) {
      expect(activity).toEqual(
        expect.objectContaining({
          _id: expect.any(String),
          type: expect.stringMatching(/^(CALL|EMAIL|MEETING)$/),
          description: expect.any(String),
          contactId: expect.any(Number),
          userId: expect.any(Number),
          metadata: expect.any(Object),
          createdAt: expect.any(String)
        })
      );
    }
  });

  test('incluye una actividad conocida', async () => {
    const res = await request(app).get('/activities');
    const call = res.body.find((activity) => activity._id === '650000000000000000000001');

    expect(call).toBeDefined();
    expect(call.type).toBe('CALL');
    expect(call.contactId).toBe(1);
    expect(call.userId).toBe(1);
  });
});
