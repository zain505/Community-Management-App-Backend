jest.mock('../../src/modules/auth/auth.repository', () => ({
  authRepository: {
    findUserByMobileNumber: jest.fn(),
    createUser: jest.fn(),
    createRefreshToken: jest.fn(),
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

import { hashPassword, verifyPassword } from '../../src/lib/password';
import { decodeTokenExpiration, hashToken, signAccessToken, signRefreshToken } from '../../src/lib/token';
import { authRepository } from '../../src/modules/auth/auth.repository';
import { authService } from '../../src/modules/auth/auth.service';

const mockedAuthRepository = jest.mocked(authRepository);
const mockedHashPassword = jest.mocked(hashPassword);
const mockedVerifyPassword = jest.mocked(verifyPassword);
const mockedDecodeTokenExpiration = jest.mocked(decodeTokenExpiration);
const mockedHashToken = jest.mocked(hashToken);
const mockedSignAccessToken = jest.mocked(signAccessToken);
const mockedSignRefreshToken = jest.mocked(signRefreshToken);

function mockIssuedTokens(): void {
  mockedSignAccessToken.mockReturnValue('access-token');
  mockedSignRefreshToken.mockReturnValue({ token: 'refresh-token' } as never);
  mockedHashToken.mockReturnValue('hashed-refresh-token');
  mockedDecodeTokenExpiration.mockReturnValue(new Date('2026-03-22T00:00:00.000Z'));
  mockedAuthRepository.createRefreshToken.mockResolvedValue({} as never);
}

describe('auth service', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('includes usertype in the register response', async () => {
    mockedAuthRepository.findUserByMobileNumber.mockResolvedValue(null);
    mockedHashPassword.mockResolvedValue('hashed-password');
    mockedAuthRepository.createUser.mockResolvedValue({
      id: 'user-123',
      mobileNumber: '+923001234567',
      name: 'Test User',
      usertype: 2,
      createdAt: new Date('2026-03-15T09:00:00.000Z'),
    } as never);
    mockIssuedTokens();

    const result = await authService.register({
      name: 'Test User',
      mobileNumber: '+923001234567',
      password: 'StrongPass123',
      usertype: 2,
    });

    expect(result.user).toMatchObject({
      id: 'user-123',
      mobileNumber: '+923001234567',
      name: 'Test User',
      usertype: 2,
    });
  });

  it('includes usertype in the login response', async () => {
    mockedAuthRepository.findUserByMobileNumber.mockResolvedValue({
      id: 'user-456',
      mobileNumber: '+923009876543',
      name: 'Community Admin',
      usertype: 1,
      passwordHash: 'hashed-password',
      isActive: true,
      createdAt: new Date('2026-03-15T09:00:00.000Z'),
    } as never);
    mockedVerifyPassword.mockResolvedValue(true);
    mockIssuedTokens();

    const result = await authService.login({
      mobileNumber: '+923009876543',
      password: 'StrongPass123',
      usertype: 1,
    });

    expect(result.user).toMatchObject({
      id: 'user-456',
      mobileNumber: '+923009876543',
      name: 'Community Admin',
      usertype: 1,
    });
  });
});
