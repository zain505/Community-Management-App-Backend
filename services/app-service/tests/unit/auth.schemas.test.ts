import { loginBodySchema, registerBodySchema } from '../../src/modules/auth/auth.schemas';

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
      name: 'Admin Joe',
      mobileNumber: '+923001234567',
      password: 'StrongPass123',
      usertype: 2,
    });

    expect(result.success).toBe(false);
  });

  it('allows reserved admin words for admin signups', () => {
    const result = registerBodySchema.safeParse({
      name: 'Admin Joe',
      mobileNumber: '+923001234567',
      password: 'StrongPass123',
      usertype: 1,
    });

    expect(result.success).toBe(true);
  });
});
