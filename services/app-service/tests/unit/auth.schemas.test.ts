import { loginBodySchema, registerBodySchema } from '../../src/modules/auth/auth.schemas';

describe('auth schemas', () => {
  it('accepts a valid register payload', () => {
    const value = registerBodySchema.parse({
      name: 'Test User',
      mobileNumber: '+923001234567',
      password: 'StrongPass123',
    });

    expect(value.mobileNumber).toBe('+923001234567');
  });

  it('rejects short passwords', () => {
    const result = registerBodySchema.safeParse({
      name: 'Test User',
      mobileNumber: '+923001234567',
      password: 'short',
    });

    expect(result.success).toBe(false);
  });

  it('rejects invalid register mobile phone number', () => {
    const result = registerBodySchema.safeParse({
      name: 'Test User',
      mobileNumber: 'abc123',
      password: 'StrongPass123',
    });

    expect(result.success).toBe(false);
  });

  it('rejects invalid login mobile number', () => {
    const result = loginBodySchema.safeParse({
      mobileNumber: 'not-a-mobile-number',
      password: 'StrongPass123',
    });

    expect(result.success).toBe(false);
  });
});
