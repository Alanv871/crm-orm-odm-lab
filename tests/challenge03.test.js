const request = require('supertest');
const app = require('../app');

describe('Challenge 03 - Sequelize: GET /companies?industry=', () => {
  test('sin filtro devuelve todas las companias', async () => {
    const res = await request(app).get('/companies');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(res.body).toHaveLength(4);
  });

  test('con industry=Technology devuelve solo companias de Technology', async () => {
    const res = await request(app).get('/companies').query({ industry: 'Technology' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);

    for (const company of res.body) {
      expect(company.industry).toBe('Technology');
    }
  });

  test('el filtro no devuelve companias de otras industrias', async () => {
    const res = await request(app).get('/companies').query({ industry: 'Technology' });
    const names = res.body.map((company) => company.name).sort();

    expect(names).toEqual(['Acme Technologies', 'Globex Software']);
    expect(names).not.toContain('Initech Finance');
    expect(names).not.toContain('Umbrella Health');
  });

  test('con otra industria devuelve solo esa industria', async () => {
    const res = await request(app).get('/companies').query({ industry: 'Finance' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].industry).toBe('Finance');
  });

  test('con una industria inexistente devuelve un array vacio', async () => {
    const res = await request(app).get('/companies').query({ industry: 'Unknown' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});
