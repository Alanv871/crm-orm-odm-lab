const request = require('supertest');
const app = require('../app');

describe('Challenge 05 - Sequelize: GET /companies/:id con contactos', () => {
  test('devuelve 200 con los datos de la compania', async () => {
    const res = await request(app).get('/companies/1');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(res.body).toEqual(
      expect.objectContaining({
        id: 1,
        name: 'Acme Technologies',
        industry: 'Technology',
        salesPersonId: 1
      })
    );
  });

  test('incluye los contactos de la compania', async () => {
    const res = await request(app).get('/companies/1');

    expect(Array.isArray(res.body.contacts)).toBe(true);
    expect(res.body.contacts).toHaveLength(3);

    const ids = res.body.contacts.map((contact) => contact.id).sort((a, b) => a - b);
    expect(ids).toEqual([1, 2, 3]);
  });

  test('los contactos pertenecen realmente a esa compania', async () => {
    const res = await request(app).get('/companies/2');

    expect(res.body.contacts).toHaveLength(2);

    for (const contact of res.body.contacts) {
      expect(contact.companyId).toBe(2);
      expect(contact).toEqual(
        expect.objectContaining({
          firstName: expect.any(String),
          lastName: expect.any(String)
        })
      );
    }
  });

  test('una compania sin contactos devuelve un array de contactos vacio', async () => {
    const created = await request(app)
      .post('/companies')
      .send({ name: 'Empty Corp', industry: 'Retail', salesPersonId: 1 });
    expect(created.status).toBe(201);

    const res = await request(app).get(`/companies/${created.body.id}`);

    expect(res.status).toBe(200);
    expect(res.body.contacts).toEqual([]);
  });

  test('devuelve 404 para una compania inexistente', async () => {
    const res = await request(app).get('/companies/9999');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Company not found' });
  });
});
