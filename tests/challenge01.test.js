const request = require('supertest');
const app = require('../app');

describe('Challenge 01 - Sequelize: GET /contacts', () => {
  test('devuelve 200 y JSON', async () => {
    const res = await request(app).get('/contacts');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('devuelve los 8 contactos sembrados', async () => {
    const res = await request(app).get('/contacts');

    expect(res.body).toHaveLength(8);

    const ids = res.body.map((contact) => contact.id).sort((a, b) => a - b);
    expect(ids).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  test('cada contacto incluye los campos basicos', async () => {
    const res = await request(app).get('/contacts');

    expect(res.body.length).toBeGreaterThan(0);

    for (const contact of res.body) {
      expect(contact).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          firstName: expect.any(String),
          lastName: expect.any(String),
          email: expect.any(String),
          phone: expect.any(String),
          companyId: expect.any(Number)
        })
      );
    }
  });

  test('incluye un contacto conocido con sus datos', async () => {
    const res = await request(app).get('/contacts');
    const laura = res.body.find((contact) => contact.id === 1);

    expect(laura).toBeDefined();
    expect(laura.firstName).toBe('Laura');
    expect(laura.lastName).toBe('Sánchez');
    expect(laura.companyId).toBe(1);
  });
});
