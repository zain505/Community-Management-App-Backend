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

describe('app-service mobile version policy config', () => {
  const invalidBuildValues = ['0', '-1', '1.5', 'abc'];

  afterEach(() => {
    delete process.env.AWT_ANDROID_LATEST_BUILD;
    jest.resetModules();
  });

  it.each(invalidBuildValues)('rejects invalid build value %s', (buildValue) => {
    process.env.AWT_ANDROID_LATEST_BUILD = buildValue;

    jest.isolateModules(() => {
      expect(() => {
        require('../../src/config/env');
      }).toThrow(/Invalid environment configuration: .*AWT_ANDROID_LATEST_BUILD/);
    });
  });
});
