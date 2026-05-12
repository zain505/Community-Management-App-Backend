jest.mock('../../src/modules/auth/auth.service', () => ({
  authService: {
    resetUserPasswordByMobileNumber: jest.fn(),
  },
}));

import request from 'supertest';
import { app } from '../../src/app';
import { signAccessToken } from '../../src/lib/token';
import { authService } from '../../src/modules/auth/auth.service';

const mockedAuthService = jest.mocked(authService);

describe('admin password routes', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('allows super admins to reset a user password by mobile number', async () => {
    mockedAuthService.resetUserPasswordByMobileNumber.mockResolvedValue({
      message: 'Password reset successfully',
      mobileNumber: '+923001234567',
    });

    const response = await request(app)
      .post('/v1/auth/admin/users/password/reset')
      .set(
        'Authorization',
        `Bearer ${signAccessToken({ sub: 'super-123', mobileNumber: '+923000000001' })}`,
      )
      .send({
        mobileNumber: '+923001234567',
        newPassword: 'ResetPass123',
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual({
      message: 'Password reset successfully',
      mobileNumber: '+923001234567',
    });
    expect(mockedAuthService.resetUserPasswordByMobileNumber).toHaveBeenCalledWith({
      requesterId: 'super-123',
      mobileNumber: '+923001234567',
      newPassword: 'ResetPass123',
    });
  });

  it('requires an access token to reset a user password', async () => {
    const response = await request(app).post('/v1/auth/admin/users/password/reset').send({
      mobileNumber: '+923001234567',
      newPassword: 'ResetPass123',
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('UNAUTHORIZED');
    expect(mockedAuthService.resetUserPasswordByMobileNumber).not.toHaveBeenCalled();
  });
});
