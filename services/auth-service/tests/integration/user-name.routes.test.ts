jest.mock('../../src/modules/auth/auth.service', () => ({
  authService: {
    register: jest.fn(),
    login: jest.fn(),
    refresh: jest.fn(),
    logout: jest.fn(),
    getUserStatus: jest.fn(),
    updateUserActivation: jest.fn(),
    updateUserImage: jest.fn(),
    updateUserName: jest.fn(),
  },
}));

import request from 'supertest';
import { app } from '../../src/app';
import { signAccessToken } from '../../src/lib/token';
import { authService } from '../../src/modules/auth/auth.service';

const mockedAuthService = jest.mocked(authService);

describe('user name routes', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('allows a logged-in user to update their own name', async () => {
    mockedAuthService.updateUserName.mockResolvedValue({
      id: 'user-123',
      mobileNumber: '+923001234567',
      name: 'Updated User',
      profile: {
        image: null,
      },
      createdAt: '2026-03-15T09:00:00.000Z',
    });

    const response = await request(app)
      .patch('/v1/auth/users/user-123/name')
      .set(
        'Authorization',
        `Bearer ${signAccessToken({ sub: 'user-123', mobileNumber: '+923001234567' })}`,
      )
      .send({
        name: 'Updated User',
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toMatchObject({
      id: 'user-123',
      name: 'Updated User',
    });
    expect(mockedAuthService.updateUserName).toHaveBeenCalledWith({
      requesterId: 'user-123',
      userId: 'user-123',
      name: 'Updated User',
    });
  });

  it('rejects invalid user name payloads', async () => {
    const response = await request(app)
      .patch('/v1/auth/users/user-123/name')
      .set(
        'Authorization',
        `Bearer ${signAccessToken({ sub: 'user-123', mobileNumber: '+923001234567' })}`,
      )
      .send({
        name: ' ',
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('VALIDATION_ERROR');
    expect(mockedAuthService.updateUserName).not.toHaveBeenCalled();
  });
});
