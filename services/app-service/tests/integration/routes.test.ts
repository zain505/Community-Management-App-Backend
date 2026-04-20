import request from 'supertest';
import { app } from '../../src/app';

describe('routes', () => {
  it('accepts large event payloads within the app-service body limit', async () => {
    const response = await request(app)
      .post('/v1/event-management')
      .send({
        title: 'Community meetup',
        description: 'Residents are meeting in the main hall.',
        image: `data:image/png;base64,${'A'.repeat(200 * 1024)}`,
        location: 'Main Hall',
        startAt: '2026-03-20T18:00:00.000Z',
      });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('UNAUTHORIZED');
  });

  it('rejects event payloads larger than the app-service body limit', async () => {
    const response = await request(app)
      .post('/v1/event-management')
      .send({
        title: 'Community meetup',
        description: 'Residents are meeting in the main hall.',
        image: `data:image/png;base64,${'A'.repeat(8 * 1024 * 1024)}`,
        location: 'Main Hall',
        startAt: '2026-03-20T18:00:00.000Z',
      });

    expect(response.status).toBe(413);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('PAYLOAD_TOO_LARGE');
  });

  it('returns liveness data', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe('ok');
    expect(response.headers['x-request-id']).toBeTruthy();
  });

  it('returns validation error on invalid register body', async () => {
    const response = await request(app).post('/v1/auth/register').send({
      mobileNumber: 'bad-phone-number',
      password: '123',
      name: '',
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('VALIDATION_ERROR');
  });

  it('does not expose store routes directly', async () => {
    const response = await request(app).get('/v1/stores');

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('NOT_FOUND');
  });
});
