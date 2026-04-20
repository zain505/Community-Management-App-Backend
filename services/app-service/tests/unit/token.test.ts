import jwt from 'jsonwebtoken';
import { signAccessToken, verifyAccessTokenOrThrowAppError } from '../../src/lib/token';

describe('token helpers', () => {
  it('returns the decoded payload for a valid access token', () => {
    const token = signAccessToken({
      sub: 'user-123',
      mobileNumber: '+923001234567',
    });

    const payload = verifyAccessTokenOrThrowAppError(token);

    expect(payload.sub).toBe('user-123');
    expect(payload.mobileNumber).toBe('+923001234567');
  });

  it('maps malformed access tokens to INVALID_ACCESS_TOKEN', () => {
    expect(() => verifyAccessTokenOrThrowAppError('not-a-jwt')).toThrow(
      expect.objectContaining({
        code: 'INVALID_ACCESS_TOKEN',
        statusCode: 401,
      }),
    );
  });

  it('maps expired access tokens to INVALID_ACCESS_TOKEN', () => {
    const expiredToken = jwt.sign(
      {
        sub: 'user-123',
      },
      process.env.JWT_ACCESS_SECRET as string,
      {
        expiresIn: -1,
      },
    );

    expect(() => verifyAccessTokenOrThrowAppError(expiredToken)).toThrow(
      expect.objectContaining({
        code: 'INVALID_ACCESS_TOKEN',
        statusCode: 401,
      }),
    );
  });
});
