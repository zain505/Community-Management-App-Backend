jest.mock('../../src/modules/auth/auth.service', () => ({
  authService: {
    register: jest.fn(),
    login: jest.fn(),
    refresh: jest.fn(),
    logout: jest.fn(),
    getUserStatus: jest.fn(),
    updateUserActivation: jest.fn(),
    updateUserImage: jest.fn(),
  },
}));

import request from 'supertest';
import { app } from '../../src/app';
import { signAccessToken } from '../../src/lib/token';
import { authService } from '../../src/modules/auth/auth.service';

const mockedAuthService = jest.mocked(authService);

describe('user activation routes', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('allows super admins to update a user activation state', async () => {
    mockedAuthService.updateUserActivation.mockResolvedValue({
      id: 'user-123',
      mobileNumber: '+923001234567',
      name: 'Community Admin',
      profile: {
        image: null,
      },
      isActive: false,
      createdAt: '2026-03-15T09:00:00.000Z',
    });

    const response = await request(app)
      .patch('/v1/auth/users/user-123/status')
      .set(
        'Authorization',
        `Bearer ${signAccessToken({ sub: 'super-123', mobileNumber: '+923000000001' })}`,
      )
      .send({
        isActive: 0,
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toMatchObject({
      id: 'user-123',
      isActive: false,
    });
    expect(mockedAuthService.updateUserActivation).toHaveBeenCalledWith({
      requesterId: 'super-123',
      userId: 'user-123',
      isActive: false,
    });
  });

  it('rejects invalid activation payloads', async () => {
    const response = await request(app)
      .patch('/v1/auth/users/user-123/status')
      .set(
        'Authorization',
        `Bearer ${signAccessToken({ sub: 'super-123', mobileNumber: '+923000000001' })}`,
      )
      .send({
        isActive: 'inactive',
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('VALIDATION_ERROR');
    expect(mockedAuthService.updateUserActivation).not.toHaveBeenCalled();
  });
});
