const request = require('supertest');
const app = require('../app');

describe('Challenge 07 - Sequelize: PUT /contacts/:id', () => {
  test('actualiza un contacto y devuelve el registro actualizado', async () => {
    const res = await request(app)
      .put('/contacts/1')
      .send({ firstName: 'Laura Elena', phone: '+52 55 9999 0000' });

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(res.body).toEqual(
      expect.objectContaining({
        id: 1,
        firstName: 'Laura Elena',
        phone: '+52 55 9999 0000'
      })
    );
  });

  test('el cambio queda persistido al consultar de nuevo', async () => {
    await request(app).put('/contacts/2').send({ email: 'miguel.nuevo@acme.test' });

    const res = await request(app).get('/contacts/2');

    expect(res.status).toBe(200);
    expect(res.body.email).toBe('miguel.nuevo@acme.test');
  });

  test('los campos no enviados se conservan', async () => {
    await request(app).put('/contacts/3').send({ phone: '+52 55 8888 0000' });

    const res = await request(app).get('/contacts/3');

    expect(res.body.phone).toBe('+52 55 8888 0000');
    expect(res.body.firstName).toBe('Sofía');
    expect(res.body.lastName).toBe('Ramírez');
    expect(res.body.companyId).toBe(1);
  });

  test('devuelve 404 para un contacto inexistente', async () => {
    const res = await request(app).put('/contacts/9999').send({ firstName: 'Nadie' });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Contact not found' });
  });
});
