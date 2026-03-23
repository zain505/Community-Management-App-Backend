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

import request from 'supertest';
import { app } from '../../src/app';
import { authService } from '../../src/modules/auth/auth.service';

const mockedAuthService = jest.mocked(authService);

describe('internal auth routes', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns user status for service-to-service lookups', async () => {
    mockedAuthService.getUserStatus.mockResolvedValue({
      id: 'user-123',
      mobileNumber: '+923001234567',
      name: 'Community Admin',
      profile: {
        image: null,
      },
      isActive: true,
      createdAt: '2026-03-15T09:00:00.000Z',
    });

    const response = await request(app).get('/internal/auth/users/user-123/status');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toMatchObject({
      id: 'user-123',
      name: 'Community Admin',
      isActive: true,
    });
    expect(mockedAuthService.getUserStatus).toHaveBeenCalledWith('user-123');
  });
});
