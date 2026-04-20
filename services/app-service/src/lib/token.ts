import crypto from 'node:crypto';
import { StatusCodes } from 'http-status-codes';
import jwt, { JsonWebTokenError, type JwtPayload, type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../shared/app-error';

type TokenType = 'access' | 'refresh';

interface BaseClaims {
  sub: string;
  mobileNumber?: string;
}

interface RefreshClaims extends BaseClaims {
  jti: string;
}

function signToken(
  claims: BaseClaims | RefreshClaims,
  type: TokenType,
  options?: SignOptions,
): string {
  const secret = type === 'access' ? env.JWT_ACCESS_SECRET : env.JWT_REFRESH_SECRET;
  const expiresIn = (type === 'access' ? env.JWT_ACCESS_TTL : env.JWT_REFRESH_TTL) as SignOptions['expiresIn'];
  return jwt.sign(claims, secret, {
    expiresIn,
    ...options,
  });
}

export function signAccessToken(claims: BaseClaims): string {
  return signToken(claims, 'access');
}

export function signRefreshToken(claims: BaseClaims): { token: string; jti: string } {
  const jti = crypto.randomUUID();
  const token = signToken({ ...claims, jti }, 'refresh');
  return { token, jti };
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
}

export function verifyAccessTokenOrThrowAppError(token: string): JwtPayload {
  try {
    return verifyAccessToken(token);
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new AppError('Access token is invalid or expired', {
        statusCode: StatusCodes.UNAUTHORIZED,
        code: 'INVALID_ACCESS_TOKEN',
      });
    }

    throw error;
  }
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
}

export function decodeTokenExpiration(token: string): Date {
  const decoded = jwt.decode(token) as JwtPayload | null;

  if (!decoded?.exp) {
    throw new Error('Unable to decode token expiration');
  }

  return new Date(decoded.exp * 1000);
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
