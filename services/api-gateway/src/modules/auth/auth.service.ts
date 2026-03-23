import type {
  AuthResponse,
  AuthTokens,
  LoginRequest,
  RegisterRequest,
  UserProfile,
  UserPublic,
} from '@community/contracts';
import { StatusCodes } from 'http-status-codes';
import { decodeTokenExpiration, hashToken, signAccessToken, signRefreshToken, verifyRefreshToken } from '../../lib/token';
import { verifyPassword, hashPassword } from '../../lib/password';
import { AppError } from '../../shared/app-error';
import { authRepository } from './auth.repository';

function toUserPublic(user: { id: string; mobileNumber: string; name: string; createdAt: Date }): UserPublic {
  const profile: UserProfile = {
    image: null,
  };

  return {
    id: user.id,
    mobileNumber: user.mobileNumber,
    name: user.name,
    profile,
    createdAt: user.createdAt.toISOString(),
  };
}

async function issueTokens(user: { id: string; mobileNumber: string }): Promise<AuthTokens> {
  const accessToken = signAccessToken({
    sub: user.id,
    mobileNumber: user.mobileNumber,
  });

  const refresh = signRefreshToken({
    sub: user.id,
    mobileNumber: user.mobileNumber,
  });

  await authRepository.createRefreshToken({
    tokenHash: hashToken(refresh.token),
    expiresAt: decodeTokenExpiration(refresh.token),
    userId: user.id,
  });

  return {
    accessToken,
    refreshToken: refresh.token,
  };
}

export const authService = {
  async register(payload: RegisterRequest): Promise<AuthResponse> {
    const existing = await authRepository.findUserByMobileNumber(payload.mobileNumber);

    if (existing) {
      throw new AppError('Mobile phone number is already in use', {
        statusCode: StatusCodes.CONFLICT,
        code: 'MOBILE_PHONE_IN_USE',
      });
    }

    const user = await authRepository.createUser({
      mobileNumber: payload.mobileNumber,
      name: payload.name,
      passwordHash: await hashPassword(payload.password),
    });

    const tokens = await issueTokens(user);

    return {
      user: toUserPublic(user),
      tokens,
    };
  },

  async login(payload: LoginRequest): Promise<AuthResponse> {
    const user = await authRepository.findUserByMobileNumber(payload.mobileNumber);

    if (!user || !user.isActive) {
      throw new AppError('Invalid mobile number or password', {
        statusCode: StatusCodes.UNAUTHORIZED,
        code: 'INVALID_CREDENTIALS',
      });
    }

    const passwordMatches = await verifyPassword(payload.password, user.passwordHash);

    if (!passwordMatches) {
      throw new AppError('Invalid mobile number or password', {
        statusCode: StatusCodes.UNAUTHORIZED,
        code: 'INVALID_CREDENTIALS',
      });
    }

    const tokens = await issueTokens(user);

    return {
      user: toUserPublic(user),
      tokens,
    };
  },

  async refresh(refreshToken: string): Promise<AuthResponse> {
    const tokenPayload = verifyRefreshToken(refreshToken);
    const userId = tokenPayload.sub;

    if (typeof userId !== 'string') {
      throw new AppError('Invalid refresh token', {
        statusCode: StatusCodes.UNAUTHORIZED,
        code: 'INVALID_REFRESH_TOKEN',
      });
    }

    const hashedToken = hashToken(refreshToken);
    const existingRefreshToken = await authRepository.findRefreshTokenByHash(hashedToken);

    if (!existingRefreshToken || existingRefreshToken.revokedAt || existingRefreshToken.expiresAt < new Date()) {
      throw new AppError('Refresh token is invalid or expired', {
        statusCode: StatusCodes.UNAUTHORIZED,
        code: 'INVALID_REFRESH_TOKEN',
      });
    }

    const user = await authRepository.findUserById(userId);

    if (!user || !user.isActive) {
      throw new AppError('User is not active', {
        statusCode: StatusCodes.UNAUTHORIZED,
        code: 'USER_INACTIVE',
      });
    }

    const accessToken = signAccessToken({
      sub: user.id,
      mobileNumber: user.mobileNumber,
    });
    const rotatedRefresh = signRefreshToken({
      sub: user.id,
      mobileNumber: user.mobileNumber,
    });

    await authRepository.rotateRefreshToken({
      currentTokenId: existingRefreshToken.id,
      newTokenHash: hashToken(rotatedRefresh.token),
      newExpiresAt: decodeTokenExpiration(rotatedRefresh.token),
      userId: user.id,
    });

    return {
      user: toUserPublic(user),
      tokens: {
        accessToken,
        refreshToken: rotatedRefresh.token,
      },
    };
  },

  async logout(refreshToken: string): Promise<void> {
    try {
      verifyRefreshToken(refreshToken);
    } catch {
      return;
    }

    const existingRefreshToken = await authRepository.findRefreshTokenByHash(hashToken(refreshToken));

    if (!existingRefreshToken || existingRefreshToken.revokedAt) {
      return;
    }

    await authRepository.revokeRefreshToken(existingRefreshToken.id);
  },
};
