const request = require('supertest');
const app = require('../app');

describe('Health Check', () => {
  test('GET /health responde 200 con status UP', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(res.body).toEqual({ status: 'UP' });
  });
});
