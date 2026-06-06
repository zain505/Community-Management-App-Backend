import request from 'supertest';
import { app } from '../../src/app';
import { env } from '../../src/config/env';

describe('routes', () => {
  const defaultMobilePolicy = {
    android: {
      latestBuild: null,
      minimumSupportedBuild: null,
      recommendedBuild: null,
      forceUpdate: false,
      storeUrl: 'https://play.google.com/store/apps/details?id=com.zain505.awt',
      title: 'Update required',
      message: 'A newer version of the app is required to continue.',
    },
  };

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

  it('returns the default public mobile version policy without auth', async () => {
    const response = await request(app).get('/v1/mobile/version-policy');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(defaultMobilePolicy);
  });

  it('returns a configured blocking mobile version policy', async () => {
    const previousPolicy = {
      latestBuild: env.AWT_ANDROID_LATEST_BUILD,
      minimumSupportedBuild: env.AWT_ANDROID_MINIMUM_SUPPORTED_BUILD,
      recommendedBuild: env.AWT_ANDROID_RECOMMENDED_BUILD,
      forceUpdate: env.AWT_ANDROID_FORCE_UPDATE,
    };

    let response: request.Response;

    try {
      env.AWT_ANDROID_LATEST_BUILD = 8;
      env.AWT_ANDROID_MINIMUM_SUPPORTED_BUILD = 8;
      env.AWT_ANDROID_RECOMMENDED_BUILD = 8;
      env.AWT_ANDROID_FORCE_UPDATE = true;

      response = await request(app).get('/v1/mobile/version-policy');
    } finally {
      env.AWT_ANDROID_LATEST_BUILD = previousPolicy.latestBuild;
      env.AWT_ANDROID_MINIMUM_SUPPORTED_BUILD = previousPolicy.minimumSupportedBuild;
      env.AWT_ANDROID_RECOMMENDED_BUILD = previousPolicy.recommendedBuild;
      env.AWT_ANDROID_FORCE_UPDATE = previousPolicy.forceUpdate;
    }

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      android: {
        ...defaultMobilePolicy.android,
        latestBuild: 8,
        minimumSupportedBuild: 8,
        recommendedBuild: 8,
        forceUpdate: true,
      },
    });
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
