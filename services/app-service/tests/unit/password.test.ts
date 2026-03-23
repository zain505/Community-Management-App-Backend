import { hashPassword, verifyPassword } from '../../src/lib/password';

describe('password helpers', () => {
  it('hashes and verifies password', async () => {
    const input = 'StrongPass123';
    const hash = await hashPassword(input);

    expect(hash).not.toEqual(input);
    await expect(verifyPassword(input, hash)).resolves.toBe(true);
    await expect(verifyPassword('invalid', hash)).resolves.toBe(false);
  });
});
