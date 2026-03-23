jest.mock('../../src/modules/auth/auth.service', () => ({
  authService: {
    register: jest.fn(),
    login: jest.fn(),
    refresh: jest.fn(),
    logout: jest.fn(),
    getUserStatus: jest.fn(),
    updateUserImage: jest.fn(),
  },
}));

import fs from 'node:fs/promises';
import path from 'node:path';
import request from 'supertest';
import { app } from '../../src/app';
import { signAccessToken } from '../../src/lib/token';
import { authService } from '../../src/modules/auth/auth.service';

const mockedAuthService = jest.mocked(authService);
const uploadsRoot = path.resolve(__dirname, '../../uploads');
const pngImageBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]);
const pngImageBase64 = `data:image/png;base64,${pngImageBuffer.toString('base64')}`;

async function removeUploadsDirectory(): Promise<void> {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      await fs.rm(uploadsRoot, { recursive: true, force: true });
      return;
    } catch (error) {
      const nodeError = error as NodeJS.ErrnoException;

      if (!['EBUSY', 'ENOTEMPTY', 'EPERM'].includes(nodeError.code ?? '')) {
        throw error;
      }

      if (attempt === 4) {
        return;
      }

      await new Promise((resolve) => {
        setTimeout(resolve, 100);
      });
    }
  }
}

describe('user image routes', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(async () => {
    await removeUploadsDirectory();
  });

  it('uploads a user image when request is valid', async () => {
    mockedAuthService.updateUserImage.mockResolvedValue({
      id: 'user-123',
      mobileNumber: '+923001234567',
      name: 'Community Admin',
      profile: {
        image: '/uploads/user-images/user-123-avatar.png',
      },
      createdAt: '2026-03-15T09:00:00.000Z',
    });

    const response = await request(app)
      .patch('/v1/auth/users/user-123/image')
      .set(
        'Authorization',
        `Bearer ${signAccessToken({ sub: 'user-123', mobileNumber: '+923001234567' })}`,
      )
      .send({
        image: pngImageBase64,
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.profile.image).toBe('/uploads/user-images/user-123-avatar.png');
    expect(mockedAuthService.updateUserImage).toHaveBeenCalledWith(
      expect.objectContaining({
        requesterId: 'user-123',
        userId: 'user-123',
        file: expect.objectContaining({
          mimetype: 'image/png',
          originalFilename: null,
        }),
      }),
    );
  });

  it('rejects unsupported image types', async () => {
    const response = await request(app)
      .patch('/v1/auth/users/user-123/image')
      .set(
        'Authorization',
        `Bearer ${signAccessToken({ sub: 'user-123', mobileNumber: '+923001234567' })}`,
      )
      .send({
        image: `data:text/plain;base64,${Buffer.from('plain-text').toString('base64')}`,
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('INVALID_IMAGE_TYPE');
    expect(mockedAuthService.updateUserImage).not.toHaveBeenCalled();
  });

  it('rejects images larger than 5 MB', async () => {
    const oversizedPng = Buffer.concat([pngImageBuffer.slice(0, 8), Buffer.alloc(5 * 1024 * 1024 + 1 - 8, 1)]);

    const response = await request(app)
      .patch('/v1/auth/users/user-123/image')
      .set(
        'Authorization',
        `Bearer ${signAccessToken({ sub: 'user-123', mobileNumber: '+923001234567' })}`,
      )
      .send({
        image: `data:image/png;base64,${oversizedPng.toString('base64')}`,
      });

    expect(response.status).toBe(413);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('IMAGE_TOO_LARGE');
    expect(mockedAuthService.updateUserImage).not.toHaveBeenCalled();
  });
});
