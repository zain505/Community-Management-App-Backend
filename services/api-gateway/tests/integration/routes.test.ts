import request from 'supertest';
import { app } from '../../src/app';

describe('routes', () => {
  it('accepts large auth payloads within the gateway body limit', async () => {
    const response = await request(app)
      .patch('/v1/auth/users/user-123/image')
      .send({
        image: `data:image/png;base64,${'A'.repeat(200 * 1024)}`,
      });

    expect(response.status).toBe(503);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('AUTH_SERVICE_UNAVAILABLE');
  });

  it('rejects payloads larger than the gateway body limit', async () => {
    const response = await request(app)
      .patch('/v1/auth/users/user-123/image')
      .send({
        image: `data:image/png;base64,${'A'.repeat(8 * 1024 * 1024)}`,
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

  it('reports auth-service unavailability', async () => {
    const response = await request(app).post('/v1/auth/register').send({});

    expect(response.status).toBe(503);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('AUTH_SERVICE_UNAVAILABLE');
  });

  it('reports store-service unavailability', async () => {
    const response = await request(app).get('/v1/stores');

    expect(response.status).toBe(503);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('STORE_SERVICE_UNAVAILABLE');
  });

  it('reports store-service unavailability for products', async () => {
    const response = await request(app).post('/v1/products').send({});

    expect(response.status).toBe(503);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('STORE_SERVICE_UNAVAILABLE');
  });

  it('reports app-service unavailability for announcements', async () => {
    const response = await request(app).post('/v1/announcements').send({});

    expect(response.status).toBe(503);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('APP_SERVICE_UNAVAILABLE');
  });

  it('reports newsfeed-service unavailability on the dedicated route', async () => {
    const response = await request(app).get('/v1/newsfeed');

    expect(response.status).toBe(503);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('NEWSFEED_SERVICE_UNAVAILABLE');
  });

  it('routes the legacy stores/newsfeed path to newsfeed-service', async () => {
    const response = await request(app).get('/v1/stores/newsfeed');

    expect(response.status).toBe(503);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('NEWSFEED_SERVICE_UNAVAILABLE');
  });
});
