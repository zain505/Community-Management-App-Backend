jest.mock('../../src/modules/auth/auth.repository', () => ({
  authRepository: {
    findUserByMobileNumber: jest.fn(),
    findUserById: jest.fn(),
    findAllUsers: jest.fn(),
    createUser: jest.fn(),
    deleteUserById: jest.fn(),
    updateUserActiveStatus: jest.fn(),
    updateUserPasswordHashAndRevokeTokens: jest.fn(),
    updateUserName: jest.fn(),
    updateUserProfile: jest.fn(),
    createRefreshToken: jest.fn(),
    findRefreshTokenByHash: jest.fn(),
    revokeRefreshToken: jest.fn(),
    revokeActiveRefreshTokensByUserId: jest.fn(),
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
import { hashPassword, verifyPassword } from '../../src/lib/password';
import { decodeTokenExpiration, hashToken, signAccessToken, signRefreshToken } from '../../src/lib/token';
import { authRepository } from '../../src/modules/auth/auth.repository';
import { authService } from '../../src/modules/auth/auth.service';
import { buildUserImagePublicPath, userImageUploadDir } from '../../src/modules/auth/user-image-storage';

const mockedAuthRepository = jest.mocked(authRepository);
const mockedHashPassword = jest.mocked(hashPassword);
const mockedVerifyPassword = jest.mocked(verifyPassword);
const mockedDecodeTokenExpiration = jest.mocked(decodeTokenExpiration);
const mockedHashToken = jest.mocked(hashToken);
const mockedSignAccessToken = jest.mocked(signAccessToken);
const mockedSignRefreshToken = jest.mocked(signRefreshToken);
const uploadsRoot = path.resolve(__dirname, '../../uploads');

function mockIssuedTokens(): void {
  mockedSignAccessToken.mockReturnValue('access-token');
  mockedSignRefreshToken.mockReturnValue({ token: 'refresh-token' } as never);
  mockedHashToken.mockReturnValue('hashed-refresh-token');
  mockedDecodeTokenExpiration.mockReturnValue(new Date('2026-03-22T00:00:00.000Z'));
  mockedAuthRepository.createRefreshToken.mockResolvedValue({} as never);
}

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

  it('creates admin signups as inactive until a super admin activates them', async () => {
    mockedAuthRepository.findUserByMobileNumber.mockResolvedValue(null);
    mockedHashPassword.mockResolvedValue('hashed-password');
    mockedAuthRepository.createUser.mockResolvedValue({
      id: 'admin-123',
      mobileNumber: '+923001234567',
      name: 'Community Admin',
      usertype: 1,
      profile: {
        image: null,
      },
      passwordHash: 'hashed-password',
      isActive: false,
      createdAt: new Date('2026-03-15T09:00:00.000Z'),
    } as never);

    const result = await authService.register({
      name: 'Community Admin',
      mobileNumber: '+923001234567',
      password: 'StrongPass123',
      usertype: 1,
    });

    expect(mockedAuthRepository.createUser).toHaveBeenCalledWith(
      expect.objectContaining({
        usertype: 1,
        isActive: false,
      }),
    );
    expect(result).toMatchObject({
      requiresActivation: true,
      user: {
        id: 'admin-123',
        usertype: 1,
        isActive: false,
      },
    });
    expect(result.tokens).toBeUndefined();
    expect(mockedAuthRepository.createRefreshToken).not.toHaveBeenCalled();
  });

  it('creates normal user signups as inactive until a super admin activates them', async () => {
    mockedAuthRepository.findUserByMobileNumber.mockResolvedValue(null);
    mockedHashPassword.mockResolvedValue('hashed-password');
    mockedAuthRepository.createUser.mockResolvedValue({
      id: 'user-456',
      mobileNumber: '+923009876543',
      name: 'Community User',
      usertype: 2,
      profile: {
        image: null,
      },
      passwordHash: 'hashed-password',
      isActive: false,
      createdAt: new Date('2026-03-15T09:00:00.000Z'),
    } as never);

    const result = await authService.register({
      name: 'Community User',
      mobileNumber: '+923009876543',
      password: 'StrongPass123',
      usertype: 2,
    });

    expect(mockedAuthRepository.createUser).toHaveBeenCalledWith(
      expect.objectContaining({
        usertype: 2,
        isActive: false,
      }),
    );
    expect(result).toMatchObject({
      requiresActivation: true,
      user: {
        id: 'user-456',
        usertype: 2,
        isActive: false,
      },
    });
    expect(result.tokens).toBeUndefined();
    expect(mockedAuthRepository.createRefreshToken).not.toHaveBeenCalled();
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
      usertype: 1,
      profile: {
        image: buildUserImagePublicPath(imageFileName),
      },
      passwordHash: 'hashed-password',
      isActive: true,
      createdAt: new Date('2026-03-15T09:00:00.000Z'),
    } as never);

    mockedVerifyPassword.mockResolvedValue(true);
    mockIssuedTokens();

    const result = await authService.login({
      mobileNumber: '+923001234567',
      password: 'StrongPass123',
      usertype: 1,
    });

    expect(result.tokens).toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });
    expect(result.user.usertype).toBe(1);
    expect(result.user.profile.image).toBe(`data:image/png;base64,${imageBuffer.toString('base64')}`);
  });

  it('rejects login when the supplied user type does not match the stored user type', async () => {
    mockedAuthRepository.findUserByMobileNumber.mockResolvedValue({
      id: 'user-123',
      mobileNumber: '+923001234567',
      name: 'Community Admin',
      usertype: 1,
      profile: {
        image: null,
      },
      passwordHash: 'hashed-password',
      isActive: true,
      createdAt: new Date('2026-03-15T09:00:00.000Z'),
    } as never);

    mockedVerifyPassword.mockResolvedValue(true);

    await expect(
      authService.login({
        mobileNumber: '+923001234567',
        password: 'StrongPass123',
        usertype: 2,
      }),
    ).rejects.toMatchObject({
      code: 'INVALID_CREDENTIALS',
      statusCode: 401,
    });
  });

  it('allows a logged-in user to change their password', async () => {
    mockedAuthRepository.findUserById.mockResolvedValue({
      id: 'user-123',
      mobileNumber: '+923001234567',
      name: 'Community User',
      usertype: 2,
      profile: {
        image: null,
      },
      passwordHash: 'hashed-password',
      isActive: true,
      createdAt: new Date('2026-03-15T09:00:00.000Z'),
    } as never);
    mockedVerifyPassword.mockResolvedValue(true);
    mockedHashPassword.mockResolvedValue('new-hashed-password');
    mockedAuthRepository.updateUserPasswordHashAndRevokeTokens.mockResolvedValue({
      id: 'user-123',
      mobileNumber: '+923001234567',
      name: 'Community User',
      usertype: 2,
      profile: {
        image: null,
      },
      passwordHash: 'new-hashed-password',
      isActive: true,
      createdAt: new Date('2026-03-15T09:00:00.000Z'),
    } as never);

    const result = await authService.changePassword({
      requesterId: 'user-123',
      currentPassword: 'OldPass123',
      newPassword: 'NewPass123',
    });

    expect(mockedVerifyPassword).toHaveBeenCalledWith('OldPass123', 'hashed-password');
    expect(mockedHashPassword).toHaveBeenCalledWith('NewPass123');
    expect(mockedAuthRepository.updateUserPasswordHashAndRevokeTokens).toHaveBeenCalledWith({
      userId: 'user-123',
      passwordHash: 'new-hashed-password',
    });
    expect(result).toEqual({
      message: 'Password changed successfully',
    });
  });

  it('rejects password changes when the current password is incorrect', async () => {
    mockedAuthRepository.findUserById.mockResolvedValue({
      id: 'user-123',
      mobileNumber: '+923001234567',
      name: 'Community User',
      usertype: 2,
      profile: {
        image: null,
      },
      passwordHash: 'hashed-password',
      isActive: true,
      createdAt: new Date('2026-03-15T09:00:00.000Z'),
    } as never);
    mockedVerifyPassword.mockResolvedValue(false);

    await expect(
      authService.changePassword({
        requesterId: 'user-123',
        currentPassword: 'WrongPass123',
        newPassword: 'NewPass123',
      }),
    ).rejects.toMatchObject({
      code: 'INVALID_CURRENT_PASSWORD',
      statusCode: 400,
    });

    expect(mockedHashPassword).not.toHaveBeenCalled();
    expect(mockedAuthRepository.updateUserPasswordHashAndRevokeTokens).not.toHaveBeenCalled();
  });

  it('allows active super admins to deactivate user accounts', async () => {
    mockedAuthRepository.findUserById
      .mockResolvedValueOnce({
        id: 'super-123',
        mobileNumber: '+923000000001',
        name: 'Super Admin',
        usertype: 0,
        profile: {
          image: null,
        },
        passwordHash: 'hashed-password',
        isActive: true,
        createdAt: new Date('2026-03-15T09:00:00.000Z'),
      } as never)
      .mockResolvedValueOnce({
        id: 'user-456',
        mobileNumber: '+923009876543',
        name: 'Community User',
        usertype: 2,
        profile: {
          image: null,
        },
        passwordHash: 'hashed-password',
        isActive: true,
        createdAt: new Date('2026-03-15T09:00:00.000Z'),
      } as never);
    mockedAuthRepository.updateUserActiveStatus.mockResolvedValue({
      id: 'user-456',
      mobileNumber: '+923009876543',
      name: 'Community User',
      usertype: 2,
      profile: {
        image: null,
      },
      passwordHash: 'hashed-password',
      isActive: false,
      createdAt: new Date('2026-03-15T09:00:00.000Z'),
    } as never);
    mockedAuthRepository.revokeActiveRefreshTokensByUserId.mockResolvedValue({ count: 2 } as never);

    const result = await authService.updateUserActivation({
      requesterId: 'super-123',
      userId: 'user-456',
      isActive: false,
    });

    expect(mockedAuthRepository.updateUserActiveStatus).toHaveBeenCalledWith('user-456', false);
    expect(mockedAuthRepository.revokeActiveRefreshTokensByUserId).toHaveBeenCalledWith('user-456');
    expect(result).toMatchObject({
      id: 'user-456',
      isActive: false,
    });
  });

  it('allows active super admins to reset a user password by mobile number', async () => {
    mockedAuthRepository.findUserById.mockResolvedValueOnce({
      id: 'super-123',
      mobileNumber: '+923000000001',
      name: 'Super Admin',
      usertype: 0,
      profile: {
        image: null,
      },
      passwordHash: 'hashed-password',
      isActive: true,
      createdAt: new Date('2026-03-15T09:00:00.000Z'),
    } as never);
    mockedAuthRepository.findUserByMobileNumber.mockResolvedValue({
      id: 'user-456',
      mobileNumber: '+923009876543',
      name: 'Community User',
      usertype: 2,
      profile: {
        image: null,
      },
      passwordHash: 'existing-hash',
      isActive: true,
      createdAt: new Date('2026-03-15T09:00:00.000Z'),
    } as never);
    mockedVerifyPassword.mockResolvedValue(false);
    mockedHashPassword.mockResolvedValue('reset-hash');
    mockedAuthRepository.updateUserPasswordHashAndRevokeTokens.mockResolvedValue({
      id: 'user-456',
      mobileNumber: '+923009876543',
      name: 'Community User',
      usertype: 2,
      profile: {
        image: null,
      },
      passwordHash: 'reset-hash',
      isActive: true,
      createdAt: new Date('2026-03-15T09:00:00.000Z'),
    } as never);

    const result = await authService.resetUserPasswordByMobileNumber({
      requesterId: 'super-123',
      mobileNumber: '+923009876543',
      newPassword: 'ResetPass123',
    });

    expect(mockedVerifyPassword).toHaveBeenCalledWith('ResetPass123', 'existing-hash');
    expect(mockedHashPassword).toHaveBeenCalledWith('ResetPass123');
    expect(mockedAuthRepository.updateUserPasswordHashAndRevokeTokens).toHaveBeenCalledWith({
      userId: 'user-456',
      passwordHash: 'reset-hash',
    });
    expect(result).toEqual({
      message: 'Password reset successfully',
      mobileNumber: '+923009876543',
    });
  });

  it('allows active super admins to delete another user account', async () => {
    mockedAuthRepository.findUserById
      .mockResolvedValueOnce({
        id: 'super-123',
        mobileNumber: '+923000000001',
        name: 'Super Admin',
        usertype: 0,
        profile: {
          image: null,
        },
        passwordHash: 'hashed-password',
        isActive: true,
        createdAt: new Date('2026-03-15T09:00:00.000Z'),
      } as never)
      .mockResolvedValueOnce({
        id: 'user-456',
        mobileNumber: '+923009876543',
        name: 'Community User',
        usertype: 2,
        profile: {
          image: null,
        },
        passwordHash: 'hashed-password',
        isActive: true,
        createdAt: new Date('2026-03-15T09:00:00.000Z'),
      } as never);
    mockedAuthRepository.deleteUserById.mockResolvedValue({
      id: 'user-456',
      mobileNumber: '+923009876543',
      name: 'Community User',
      usertype: 2,
      profile: {
        image: null,
      },
      passwordHash: 'hashed-password',
      isActive: true,
      createdAt: new Date('2026-03-15T09:00:00.000Z'),
    } as never);

    const result = await authService.deleteUserAccount({
      requesterId: 'super-123',
      userId: 'user-456',
    });

    expect(mockedAuthRepository.deleteUserById).toHaveBeenCalledWith('user-456');
    expect(result).toEqual({
      id: 'user-456',
      message: 'User account deleted',
    });
  });

  it('rejects password resets from non-super-admin users', async () => {
    mockedAuthRepository.findUserById.mockResolvedValue({
      id: 'admin-123',
      mobileNumber: '+923001234567',
      name: 'Community Admin',
      usertype: 1,
      profile: {
        image: null,
      },
      passwordHash: 'hashed-password',
      isActive: true,
      createdAt: new Date('2026-03-15T09:00:00.000Z'),
    } as never);

    await expect(
      authService.resetUserPasswordByMobileNumber({
        requesterId: 'admin-123',
        mobileNumber: '+923009876543',
        newPassword: 'ResetPass123',
      }),
    ).rejects.toMatchObject({
      code: 'SUPER_ADMIN_REQUIRED',
      statusCode: 403,
    });

    expect(mockedAuthRepository.findUserByMobileNumber).not.toHaveBeenCalled();
    expect(mockedAuthRepository.updateUserPasswordHashAndRevokeTokens).not.toHaveBeenCalled();
  });

  it('rejects attempts by a super admin to delete their own account', async () => {
    mockedAuthRepository.findUserById.mockResolvedValueOnce({
      id: 'super-123',
      mobileNumber: '+923000000001',
      name: 'Super Admin',
      usertype: 0,
      profile: {
        image: null,
      },
      passwordHash: 'hashed-password',
      isActive: true,
      createdAt: new Date('2026-03-15T09:00:00.000Z'),
    } as never);

    await expect(
      authService.deleteUserAccount({
        requesterId: 'super-123',
        userId: 'super-123',
      }),
    ).rejects.toMatchObject({
      code: 'SELF_DELETE_FORBIDDEN',
      statusCode: 403,
    });

    expect(mockedAuthRepository.findUserById).toHaveBeenCalledTimes(1);
    expect(mockedAuthRepository.deleteUserById).not.toHaveBeenCalled();
  });

  it('allows a logged-in user to update their own name', async () => {
    mockedAuthRepository.findUserById.mockResolvedValue({
      id: 'user-123',
      mobileNumber: '+923001234567',
      name: 'Old Name',
      usertype: 2,
      profile: {
        image: null,
      },
      passwordHash: 'hashed-password',
      isActive: true,
      createdAt: new Date('2026-03-15T09:00:00.000Z'),
    } as never);
    mockedAuthRepository.updateUserName.mockResolvedValue({
      id: 'user-123',
      mobileNumber: '+923001234567',
      name: 'New Name',
      usertype: 2,
      profile: {
        image: null,
      },
      passwordHash: 'hashed-password',
      isActive: true,
      createdAt: new Date('2026-03-15T09:00:00.000Z'),
    } as never);

    const result = await authService.updateUserName({
      requesterId: 'user-123',
      userId: 'user-123',
      name: ' New Name ',
    });

    expect(mockedAuthRepository.updateUserName).toHaveBeenCalledWith('user-123', 'New Name');
    expect(result).toMatchObject({
      id: 'user-123',
      name: 'New Name',
    });
  });

  it('rejects user name updates for another user account', async () => {
    await expect(
      authService.updateUserName({
        requesterId: 'user-123',
        userId: 'user-456',
        name: 'New Name',
      }),
    ).rejects.toMatchObject({
      code: 'USER_NAME_FORBIDDEN',
      statusCode: 403,
    });

    expect(mockedAuthRepository.findUserById).not.toHaveBeenCalled();
    expect(mockedAuthRepository.updateUserName).not.toHaveBeenCalled();
  });

  it('rejects reserved admin words in normal user name updates', async () => {
    mockedAuthRepository.findUserById.mockResolvedValue({
      id: 'user-123',
      mobileNumber: '+923001234567',
      name: 'Community User',
      usertype: 2,
      profile: {
        image: null,
      },
      passwordHash: 'hashed-password',
      isActive: true,
      createdAt: new Date('2026-03-15T09:00:00.000Z'),
    } as never);

    await expect(
      authService.updateUserName({
        requesterId: 'user-123',
        userId: 'user-123',
        name: 'Super Admin',
      }),
    ).rejects.toMatchObject({
      code: 'INVALID_USER_NAME',
      statusCode: 400,
    });

    expect(mockedAuthRepository.updateUserName).not.toHaveBeenCalled();
  });

  it('allows active super admins to list all users', async () => {
    mockedAuthRepository.findUserById.mockResolvedValueOnce({
      id: 'super-123',
      mobileNumber: '+923000000001',
      name: 'Super Admin',
      usertype: 0,
      profile: {
        image: null,
      },
      passwordHash: 'hashed-password',
      isActive: true,
      createdAt: new Date('2026-03-15T09:00:00.000Z'),
    } as never);
    mockedAuthRepository.findAllUsers.mockResolvedValue([
      {
        id: 'user-456',
        mobileNumber: '+923009876543',
        name: 'Community User',
        usertype: 2,
        profile: {
          image: null,
        },
        isActive: true,
        createdAt: new Date('2026-03-16T09:00:00.000Z'),
      },
      {
        id: 'admin-789',
        mobileNumber: '+923008888888',
        name: 'Community Admin',
        usertype: 1,
        profile: {
          image: null,
        },
        isActive: false,
        createdAt: new Date('2026-03-14T09:00:00.000Z'),
      },
    ] as never);

    const result = await authService.listAllUsers('super-123');

    expect(mockedAuthRepository.findAllUsers).toHaveBeenCalledTimes(1);
    expect(result).toEqual([
      {
        id: 'user-456',
        mobileNumber: '+923009876543',
        name: 'Community User',
        usertype: 2,
        profile: {
          image: null,
        },
        isActive: true,
        createdAt: '2026-03-16T09:00:00.000Z',
      },
      {
        id: 'admin-789',
        mobileNumber: '+923008888888',
        name: 'Community Admin',
        usertype: 1,
        profile: {
          image: null,
        },
        isActive: false,
        createdAt: '2026-03-14T09:00:00.000Z',
      },
    ]);
  });

  it('rejects activation changes from non-super-admin users', async () => {
    mockedAuthRepository.findUserById.mockResolvedValue({
      id: 'admin-123',
      mobileNumber: '+923001234567',
      name: 'Community Admin',
      usertype: 1,
      profile: {
        image: null,
      },
      passwordHash: 'hashed-password',
      isActive: true,
      createdAt: new Date('2026-03-15T09:00:00.000Z'),
    } as never);

    await expect(
      authService.updateUserActivation({
        requesterId: 'admin-123',
        userId: 'user-456',
        isActive: true,
      }),
    ).rejects.toMatchObject({
      code: 'SUPER_ADMIN_REQUIRED',
      statusCode: 403,
    });

    expect(mockedAuthRepository.updateUserActiveStatus).not.toHaveBeenCalled();
  });

  it('rejects user listing from non-super-admin users', async () => {
    mockedAuthRepository.findUserById.mockResolvedValue({
      id: 'admin-123',
      mobileNumber: '+923001234567',
      name: 'Community Admin',
      usertype: 1,
      profile: {
        image: null,
      },
      passwordHash: 'hashed-password',
      isActive: true,
      createdAt: new Date('2026-03-15T09:00:00.000Z'),
    } as never);

    await expect(authService.listAllUsers('admin-123')).rejects.toMatchObject({
      code: 'SUPER_ADMIN_REQUIRED',
      statusCode: 403,
    });

    expect(mockedAuthRepository.findAllUsers).not.toHaveBeenCalled();
  });
});
