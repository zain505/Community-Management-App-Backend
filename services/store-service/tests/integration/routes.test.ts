import request from 'supertest';
import { app } from '../../src/app';
import { signAccessToken } from '../../src/lib/token';

describe('routes', () => {
  it('returns liveness data', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe('ok');
    expect(response.headers['x-request-id']).toBeTruthy();
  });

  it('does not expose auth routes in store-service', async () => {
    const response = await request(app).post('/v1/auth/register').send({});

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('NOT_FOUND');
  });

  it('requires access token for protected store route', async () => {
    const response = await request(app).get('/v1/stores/me');

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('UNAUTHORIZED');
  });

  it('validates store payload before store creation', async () => {
    const accessToken = signAccessToken({
      sub: 'user_123',
    });

    const response = await request(app)
      .post('/v1/stores')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: '',
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('VALIDATION_ERROR');
  });

  it('does not expose newsfeed routes in store-service anymore', async () => {
    const response = await request(app).get('/v1/stores/newsfeed');

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('NOT_FOUND');
  });

  it('validates internal store snapshot params', async () => {
    const response = await request(app).get('/internal/stores/not-a-number/basic');

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('VALIDATION_ERROR');
  });
});
