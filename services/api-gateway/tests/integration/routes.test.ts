import http, { type Server } from 'node:http';
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

  it('allows the production frontend origin through CORS', async () => {
    const response = await request(app).get('/health').set('origin', 'https://hzhtechco.site');

    expect(response.status).toBe(200);
    expect(response.headers['access-control-allow-origin']).toBe('https://hzhtechco.site');
  });

  it('allows mobile app origins through CORS', async () => {
    const response = await request(app).get('/health').set('origin', 'capacitor://localhost');

    expect(response.status).toBe(200);
    expect(response.headers['access-control-allow-origin']).toBe('capacitor://localhost');
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

  it('proxies store image uploads to store-service', async () => {
    const imageBytes = Buffer.from([0xff, 0xd8, 0xff, 0xdb]);
    const mockStoreService: Server = http.createServer((req, res) => {
      if (req.url === '/uploads/store-images/store-image.jpg') {
        res.statusCode = 200;
        res.setHeader('content-type', 'image/jpeg');
        res.end(imageBytes);
        return;
      }

      res.statusCode = 404;
      res.end();
    });

    await new Promise<void>((resolve) => {
      mockStoreService.listen(59999, '127.0.0.1', () => {
        resolve();
      });
    });

    try {
      const response = await request(app).get('/uploads/store-images/store-image.jpg');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('image/jpeg');
      expect(response.body).toEqual(imageBytes);
    } finally {
      await new Promise<void>((resolve, reject) => {
        mockStoreService.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });
    }
  });

  it('reports app-service unavailability for announcements', async () => {
    const response = await request(app).post('/v1/announcements').send({});

    expect(response.status).toBe(503);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('APP_SERVICE_UNAVAILABLE');
  });

  it('reports app-service unavailability for event management', async () => {
    const response = await request(app).post('/v1/event-management').send({});

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

  it('proxies socket.io handshake traffic to app-service', async () => {
    const mockAppService: Server = http.createServer((req, res) => {
      if (req.url?.startsWith('/socket.io/')) {
        res.statusCode = 200;
        res.setHeader('content-type', 'text/plain; charset=UTF-8');
        res.end('0{"sid":"socket-proxy-test","upgrades":["websocket"]}');
        return;
      }

      res.statusCode = 404;
      res.end();
    });

    await new Promise<void>((resolve) => {
      mockAppService.listen(59996, '127.0.0.1', () => {
        resolve();
      });
    });

    try {
      const response = await request(app)
        .get('/socket.io/?EIO=4&transport=polling')
        .set('origin', 'http://localhost:3000');

      expect(response.status).toBe(200);
      expect(response.text).toContain('"sid":"socket-proxy-test"');
      expect(response.headers['content-type']).toContain('text/plain');
    } finally {
      await new Promise<void>((resolve, reject) => {
        mockAppService.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });
    }
  });
});
