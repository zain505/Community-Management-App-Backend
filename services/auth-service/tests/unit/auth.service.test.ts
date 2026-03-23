jest.mock('../../src/modules/auth/auth.repository', () => ({
  authRepository: {
    findUserByMobileNumber: jest.fn(),
    findUserById: jest.fn(),
    createUser: jest.fn(),
    updateUserProfile: jest.fn(),
    createRefreshToken: jest.fn(),
    findRefreshTokenByHash: jest.fn(),
    revokeRefreshToken: jest.fn(),
    rotateRefreshToken: jest.fn(),
  },
}));

jest.mock('../../src/lib/password', () => ({
  verifyPassword: jest.fn(),
  hashPassword: jest.fn(),
}));

jest.mock('../../src/lib/token', () => ({
  decodeTokenExpiration: jest.fn(),
  hashToken: jest.fn(),
  signAccessToken: jest.fn(),
  signRefreshToken: jest.fn(),
  verifyRefreshToken: jest.fn(),
}));

import fs from 'node:fs/promises';
import path from 'node:path';
import { verifyPassword } from '../../src/lib/password';
import { decodeTokenExpiration, hashToken, signAccessToken, signRefreshToken } from '../../src/lib/token';
import { authRepository } from '../../src/modules/auth/auth.repository';
import { authService } from '../../src/modules/auth/auth.service';
import { buildUserImagePublicPath, userImageUploadDir } from '../../src/modules/auth/user-image-storage';

const mockedAuthRepository = jest.mocked(authRepository);
const mockedVerifyPassword = jest.mocked(verifyPassword);
const mockedDecodeTokenExpiration = jest.mocked(decodeTokenExpiration);
const mockedHashToken = jest.mocked(hashToken);
const mockedSignAccessToken = jest.mocked(signAccessToken);
const mockedSignRefreshToken = jest.mocked(signRefreshToken);
const uploadsRoot = path.resolve(__dirname, '../../uploads');

async function removeUploadsDirectory(): Promise<void> {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      await fs.rm(uploadsRoot, { recursive: true, force: true });
      return;
    } catch (error) {
      const nodeError = error as NodeJS.ErrnoException;

      if (!['EBUSY', 'ENOTEMPTY', 'EPERM'].includes(nodeError.code ?? '')) {
        throw error;
      }

      if (attempt === 4) {
        return;
      }

      await new Promise((resolve) => {
        setTimeout(resolve, 100);
      });
    }
  }
}

describe('auth service', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(async () => {
    await removeUploadsDirectory();
  });

  it('returns the managed user image as a base64 data URL on login', async () => {
    const imageBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]);
    const imageFileName = 'user-123-avatar.png';
    const imagePath = path.join(userImageUploadDir, imageFileName);

    await fs.mkdir(userImageUploadDir, { recursive: true });
    await fs.writeFile(imagePath, imageBuffer);

    mockedAuthRepository.findUserByMobileNumber.mockResolvedValue({
      id: 'user-123',
      mobileNumber: '+923001234567',
      name: 'Community Admin',
      profile: {
        image: buildUserImagePublicPath(imageFileName),
      },
      passwordHash: 'hashed-password',
      isActive: true,
      createdAt: new Date('2026-03-15T09:00:00.000Z'),
    } as never);

    mockedVerifyPassword.mockResolvedValue(true);
    mockedSignAccessToken.mockReturnValue('access-token');
    mockedSignRefreshToken.mockReturnValue({ token: 'refresh-token' } as never);
    mockedHashToken.mockReturnValue('hashed-refresh-token');
    mockedDecodeTokenExpiration.mockReturnValue(new Date('2026-03-22T00:00:00.000Z'));
    mockedAuthRepository.createRefreshToken.mockResolvedValue({} as never);

    const result = await authService.login({
      mobileNumber: '+923001234567',
      password: 'StrongPass123',
    });

    expect(result.tokens).toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });
    expect(result.user.profile.image).toBe(`data:image/png;base64,${imageBuffer.toString('base64')}`);
  });
});
