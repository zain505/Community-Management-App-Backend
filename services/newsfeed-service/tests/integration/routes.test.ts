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

  it('does not expose auth routes in newsfeed-service', async () => {
    const response = await request(app).post('/v1/auth/register').send({});

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('NOT_FOUND');
  });

  it('does not expose store routes in newsfeed-service', async () => {
    const response = await request(app).get('/v1/stores');

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('NOT_FOUND');
  });

  it('validates public newsfeed query params', async () => {
    const response = await request(app).get('/v1/newsfeed').query({
      limit: 0,
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('VALIDATION_ERROR');
  });

  it('validates internal sync payload', async () => {
    const response = await request(app).post('/internal/newsfeed/sync').send({});

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('VALIDATION_ERROR');
  });

  it('requires auth to like a newsfeed item', async () => {
    const response = await request(app).post('/v1/newsfeed/feed-1/likes').send({});

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('UNAUTHORIZED');
  });

  it('requires auth to save a newsfeed item', async () => {
    const response = await request(app).post('/v1/newsfeed/feed-1/save').send({});

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('UNAUTHORIZED');
  });

  it('requires auth to list saved newsfeed items', async () => {
    const response = await request(app).get('/v1/newsfeed/saved');

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('UNAUTHORIZED');
  });
});
