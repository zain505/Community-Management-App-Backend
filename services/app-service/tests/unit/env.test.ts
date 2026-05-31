import { isAllowedCorsOrigin } from '../../src/config/env';

describe('app-service CORS origins', () => {
  it.each([
    'capacitor://localhost',
    'ionic://localhost',
    'http://localhost',
    'https://localhost',
  ])('allows mobile app origin %s', (origin) => {
    expect(isAllowedCorsOrigin(origin)).toBe(true);
  });

  it('allows native socket clients without an origin header', () => {
    expect(isAllowedCorsOrigin(undefined)).toBe(true);
  });
});
