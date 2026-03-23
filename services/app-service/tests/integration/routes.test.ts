import request from 'supertest';
import { app } from '../../src/app';

describe('routes', () => {
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
