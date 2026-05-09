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

  it('requires auth to create a user newsfeed post', async () => {
    const response = await request(app).post('/v1/newsfeed').send({
      title: 'Water outage notice',
      description: 'There will be a short outage tomorrow morning.',
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('UNAUTHORIZED');
  });

  it('requires auth to list the logged-in user newsfeed posts', async () => {
    const response = await request(app).get('/v1/newsfeed/mine');

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('UNAUTHORIZED');
  });

  it('requires auth to list submitted user newsfeed posts', async () => {
    const response = await request(app).get('/v1/newsfeed/submissions');

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('UNAUTHORIZED');
  });

  it('requires auth to review submitted user newsfeed posts', async () => {
    const response = await request(app).patch('/v1/newsfeed/feed-user-1/approval').send({
      status: 'APPROVED',
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('UNAUTHORIZED');
  });

  it('requires auth to delete a user newsfeed post', async () => {
    const response = await request(app).delete('/v1/newsfeed/feed-user-1');

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('UNAUTHORIZED');
  });
});
