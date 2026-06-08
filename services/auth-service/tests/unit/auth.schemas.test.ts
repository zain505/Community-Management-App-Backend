import {
  adminResetUserPasswordBodySchema,
  changePasswordBodySchema,
  loginBodySchema,
  registerBodySchema,
  updateUserActivationBodySchema,
  updateUserNameBodySchema,
} from '../../src/modules/auth/auth.schemas';

describe('auth schemas', () => {
  it('accepts a valid register payload', () => {
    const value = registerBodySchema.parse({
      name: 'Test User',
      mobileNumber: '+923001234567',
      password: 'StrongPass123',
    });

    expect(value.mobileNumber).toBe('+923001234567');
    expect(value.usertype).toBe(2);
  });

  it('defaults missing login usertype to normal user', () => {
    const value = loginBodySchema.parse({
      mobileNumber: '+923001234567',
      password: 'StrongPass123',
    });

    expect(value.usertype).toBe(2);
  });

  it('accepts the seeded super admin login password', () => {
    const value = loginBodySchema.parse({
      mobileNumber: '+923074029959',
      password: 'root123',
      usertype: 0,
    });

    expect(value.password).toBe('root123');
    expect(value.usertype).toBe(0);
  });

  it('accepts a valid local mobile phone number', () => {
    const value = loginBodySchema.parse({
      mobileNumber: '03074029959',
      password: 'root123',
      usertype: 0,
    });

    expect(value.mobileNumber).toBe('03074029959');
  });

  it('rejects short passwords', () => {
    const result = registerBodySchema.safeParse({
      name: 'Test User',
      mobileNumber: '+923001234567',
      password: 'short',
      usertype: 2,
    });

    expect(result.success).toBe(false);
  });

  it('rejects invalid register mobile phone number', () => {
    const result = registerBodySchema.safeParse({
      name: 'Test User',
      mobileNumber: 'abc123',
      password: 'StrongPass123',
      usertype: 2,
    });

    expect(result.success).toBe(false);
  });

  it('rejects invalid login mobile number', () => {
    const result = loginBodySchema.safeParse({
      mobileNumber: 'not-a-mobile-number',
      password: 'StrongPass123',
      usertype: 2,
    });

    expect(result.success).toBe(false);
  });

  it('rejects register payloads with unsupported user types', () => {
    const result = registerBodySchema.safeParse({
      name: 'Test User',
      mobileNumber: '+923001234567',
      password: 'StrongPass123',
      usertype: 99,
    });

    expect(result.success).toBe(false);
  });

  it('rejects reserved admin words in normal user names', () => {
    const result = registerBodySchema.safeParse({
      name: 'John Admin',
      mobileNumber: '+923001234567',
      password: 'StrongPass123',
      usertype: 2,
    });

    expect(result.success).toBe(false);
  });

  it('allows reserved admin words for admin signups', () => {
    const result = registerBodySchema.safeParse({
      name: 'John Admin',
      mobileNumber: '+923001234567',
      password: 'StrongPass123',
      usertype: 1,
    });

    expect(result.success).toBe(true);
  });

  it('accepts numeric activation payloads and normalizes them to booleans', () => {
    const result = updateUserActivationBodySchema.parse({
      isActive: 0,
    });

    expect(result.isActive).toBe(false);
  });

  it('rejects invalid activation payloads', () => {
    const result = updateUserActivationBodySchema.safeParse({
      isActive: 'inactive',
    });

    expect(result.success).toBe(false);
  });

  it('accepts valid user name updates', () => {
    const result = updateUserNameBodySchema.parse({
      name: '  Test User  ',
    });

    expect(result.name).toBe('Test User');
  });

  it('accepts a valid change password payload', () => {
    const result = changePasswordBodySchema.parse({
      currentPassword: 'root123',
      newPassword: 'StrongPass123',
    });

    expect(result.currentPassword).toBe('root123');
    expect(result.newPassword).toBe('StrongPass123');
  });

  it('rejects using the same current and new password', () => {
    const result = changePasswordBodySchema.safeParse({
      currentPassword: 'StrongPass123',
      newPassword: 'StrongPass123',
    });

    expect(result.success).toBe(false);
  });

  it('accepts a valid admin password reset payload', () => {
    const result = adminResetUserPasswordBodySchema.parse({
      mobileNumber: '+923001234567',
      newPassword: 'StrongPass123',
    });

    expect(result.mobileNumber).toBe('+923001234567');
  });

  it('rejects empty user name updates', () => {
    const result = updateUserNameBodySchema.safeParse({
      name: '   ',
    });

    expect(result.success).toBe(false);
  });

});
