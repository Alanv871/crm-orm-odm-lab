const request = require('supertest');
const app = require('../app');

describe('Challenge 06 - Mongoose: POST /activities con metadata flexible', () => {
  test('crea una actividad CALL y persiste su metadata', async () => {
    const payload = {
      type: 'CALL',
      description: 'Follow-up',
      contactId: 1,
      userId: 1,
      metadata: { duration: 300, result: 'INTERESTED' }
    };

    const created = await request(app).post('/activities').send(payload);

    expect(created.status).toBe(201);
    expect(created.headers['content-type']).toMatch(/application\/json/);
    expect(created.body._id).toEqual(expect.any(String));

    const res = await request(app).get(`/activities/${created.body._id}`);

    expect(res.status).toBe(200);
    expect(res.body.type).toBe('CALL');
    expect(res.body.description).toBe('Follow-up');
    expect(res.body.contactId).toBe(1);
    expect(res.body.userId).toBe(1);
    expect(res.body.metadata).toEqual({ duration: 300, result: 'INTERESTED' });
  });

  test('crea una actividad EMAIL con una estructura de metadata distinta', async () => {
    const payload = {
      type: 'EMAIL',
      description: 'Proposal',
      contactId: 1,
      userId: 1,
      metadata: { subject: 'Commercial proposal', opened: true }
    };

    const created = await request(app).post('/activities').send(payload);

    expect(created.status).toBe(201);

    const res = await request(app).get(`/activities/${created.body._id}`);

    expect(res.status).toBe(200);
    expect(res.body.type).toBe('EMAIL');
    expect(res.body.metadata).toEqual({ subject: 'Commercial proposal', opened: true });
  });

  test('conserva metadata con estructuras anidadas', async () => {
    const payload = {
      type: 'MEETING',
      description: 'Kickoff',
      contactId: 2,
      userId: 2,
      metadata: { location: 'Sala 1', attendees: ['Ana', 'Bruno'] }
    };

    const created = await request(app).post('/activities').send(payload);
    const res = await request(app).get(`/activities/${created.body._id}`);

    expect(res.body.metadata).toEqual({ location: 'Sala 1', attendees: ['Ana', 'Bruno'] });
  });

  test('las actividades creadas aparecen en el listado', async () => {
    const created = await request(app)
      .post('/activities')
      .send({
        type: 'CALL',
        description: 'Listed call',
        contactId: 3,
        userId: 1,
        metadata: { duration: 60, result: 'NO_ANSWER' }
      });

    const res = await request(app).get('/activities');
    const found = res.body.find((activity) => activity._id === created.body._id);

    expect(found).toBeDefined();
    expect(found.metadata).toEqual({ duration: 60, result: 'NO_ANSWER' });
  });
});
