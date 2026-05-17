jest.mock('../../src/modules/auth/auth.service', () => ({
  authService: {
    deleteUserAccount: jest.fn(),
  },
}));

import request from 'supertest';
import { app } from '../../src/app';
import { signAccessToken } from '../../src/lib/token';
import { authService } from '../../src/modules/auth/auth.service';

const mockedAuthService = jest.mocked(authService);

describe('user delete routes', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('allows super admins to delete a user account', async () => {
    mockedAuthService.deleteUserAccount.mockResolvedValue({
      id: 'user-123',
      message: 'User account deleted',
    });

    const response = await request(app)
      .delete('/v1/auth/users/user-123')
      .set(
        'Authorization',
        `Bearer ${signAccessToken({ sub: 'super-123', mobileNumber: '+923000000001' })}`,
      );

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual({
      id: 'user-123',
      message: 'User account deleted',
    });
    expect(mockedAuthService.deleteUserAccount).toHaveBeenCalledWith({
      requesterId: 'super-123',
      userId: 'user-123',
    });
  });

  it('requires an access token to delete a user account', async () => {
    const response = await request(app).delete('/v1/auth/users/user-123');

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('UNAUTHORIZED');
    expect(mockedAuthService.deleteUserAccount).not.toHaveBeenCalled();
  });
});
