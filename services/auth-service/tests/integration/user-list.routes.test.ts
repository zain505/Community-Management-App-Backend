jest.mock('../../src/modules/auth/auth.service', () => ({
  authService: {
    register: jest.fn(),
    login: jest.fn(),
    refresh: jest.fn(),
    logout: jest.fn(),
    getUserStatus: jest.fn(),
    listAllUsers: jest.fn(),
    updateUserActivation: jest.fn(),
    updateUserImage: jest.fn(),
  },
}));

import request from 'supertest';
import { app } from '../../src/app';
import { signAccessToken } from '../../src/lib/token';
import { authService } from '../../src/modules/auth/auth.service';

const mockedAuthService = jest.mocked(authService);

describe('user list routes', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('allows super admins to list all users', async () => {
    mockedAuthService.listAllUsers.mockResolvedValue([
      {
        id: 'user-123',
        mobileNumber: '+923001234567',
        name: 'Community User',
        usertype: 2,
        profile: {
          image: null,
        },
        isActive: true,
        createdAt: '2026-03-15T09:00:00.000Z',
      },
    ]);

    const response = await request(app)
      .get('/v1/auth/users')
      .set(
        'Authorization',
        `Bearer ${signAccessToken({ sub: 'super-123', mobileNumber: '+923000000001' })}`,
      );

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual([
      expect.objectContaining({
        id: 'user-123',
        usertype: 2,
        isActive: true,
      }),
    ]);
    expect(mockedAuthService.listAllUsers).toHaveBeenCalledWith('super-123');
  });

  it('requires an access token to list all users', async () => {
    const response = await request(app).get('/v1/auth/users');

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('UNAUTHORIZED');
    expect(mockedAuthService.listAllUsers).not.toHaveBeenCalled();
  });
});
