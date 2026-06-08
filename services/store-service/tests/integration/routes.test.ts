import fs from 'node:fs/promises';
import path from 'node:path';
import request from 'supertest';
import { app } from '../../src/app';
import { signAccessToken } from '../../src/lib/token';

const uploadsRoot = path.resolve(__dirname, '../../uploads');
const routeTestImagePath = path.join(uploadsRoot, 'store-images', 'route-test-image.jpg');

describe('routes', () => {
  afterEach(async () => {
    await fs.rm(routeTestImagePath, { force: true });
  });

  it('returns liveness data', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe('ok');
    expect(response.headers['x-request-id']).toBeTruthy();
  });

  it('serves uploaded files with a trailing slash after the filename', async () => {
    const imageBytes = Buffer.from([0xff, 0xd8, 0xff, 0xdb]);

    await fs.mkdir(path.dirname(routeTestImagePath), { recursive: true });
    await fs.writeFile(routeTestImagePath, imageBytes);

    const response = await request(app).get('/uploads/store-images/route-test-image.jpg/');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('image/jpeg');
    expect(response.body).toEqual(imageBytes);
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
