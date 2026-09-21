const request = require('supertest');
const app = require('../app');

const ACTIVITY_ID = '650000000000000000000001';
const MISSING_ID = '64b7f0c2a1b2c3d4e5f60718';

describe('Challenge 08 - Mongoose: PUT /activities/:id', () => {
  test('actualiza una actividad y devuelve el documento actualizado', async () => {
    const res = await request(app)
      .put(`/activities/${ACTIVITY_ID}`)
      .send({ description: 'Llamada actualizada' });

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(res.body._id).toBe(ACTIVITY_ID);
    expect(res.body.description).toBe('Llamada actualizada');
  });

  test('el cambio queda persistido al consultar de nuevo', async () => {
    await request(app).put(`/activities/${ACTIVITY_ID}`).send({ description: 'Persistida' });

    const res = await request(app).get(`/activities/${ACTIVITY_ID}`);

    expect(res.status).toBe(200);
    expect(res.body.description).toBe('Persistida');
  });

  test('los campos no actualizados se conservan', async () => {
    await request(app).put(`/activities/${ACTIVITY_ID}`).send({ description: 'Solo descripcion' });

    const res = await request(app).get(`/activities/${ACTIVITY_ID}`);

    expect(res.body.type).toBe('CALL');
    expect(res.body.contactId).toBe(1);
    expect(res.body.userId).toBe(1);
    expect(res.body.metadata).toEqual({ duration: 420, result: 'INTERESTED' });
  });

  test('permite actualizar la metadata', async () => {
    const res = await request(app)
      .put(`/activities/${ACTIVITY_ID}`)
      .send({ metadata: { duration: 999, result: 'CLOSED' } });

    expect(res.status).toBe(200);
    expect(res.body.metadata).toEqual({ duration: 999, result: 'CLOSED' });

    const check = await request(app).get(`/activities/${ACTIVITY_ID}`);
    expect(check.body.metadata).toEqual({ duration: 999, result: 'CLOSED' });
  });

  test('devuelve 404 para un _id valido pero inexistente', async () => {
    const res = await request(app).put(`/activities/${MISSING_ID}`).send({ description: 'X' });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Activity not found' });
  });
});
