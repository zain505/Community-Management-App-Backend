jest.mock('../../src/modules/auth/auth.service', () => ({
  authService: {
    changePassword: jest.fn(),
  },
}));

import request from 'supertest';
import { app } from '../../src/app';
import { signAccessToken } from '../../src/lib/token';
import { authService } from '../../src/modules/auth/auth.service';

const mockedAuthService = jest.mocked(authService);

describe('user password routes', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('allows a logged-in user to change their password', async () => {
    mockedAuthService.changePassword.mockResolvedValue({
      message: 'Password changed successfully',
    });

    const response = await request(app)
      .patch('/v1/auth/users/me/password')
      .set(
        'Authorization',
        `Bearer ${signAccessToken({ sub: 'user-123', mobileNumber: '+923001234567' })}`,
      )
      .send({
        currentPassword: 'OldPass123',
        newPassword: 'NewPass123',
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual({
      message: 'Password changed successfully',
    });
    expect(mockedAuthService.changePassword).toHaveBeenCalledWith({
      requesterId: 'user-123',
      currentPassword: 'OldPass123',
      newPassword: 'NewPass123',
    });
  });

  it('rejects invalid password change payloads', async () => {
    const response = await request(app)
      .patch('/v1/auth/users/me/password')
      .set(
        'Authorization',
        `Bearer ${signAccessToken({ sub: 'user-123', mobileNumber: '+923001234567' })}`,
      )
      .send({
        currentPassword: 'SamePass123',
        newPassword: 'SamePass123',
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('VALIDATION_ERROR');
    expect(mockedAuthService.changePassword).not.toHaveBeenCalled();
  });
});
