import { parseTrustProxySetting } from '../../src/config/trust-proxy';

describe('parseTrustProxySetting', () => {
  it('defaults production to one trusted proxy hop', () => {
    expect(parseTrustProxySetting(undefined, 'production')).toBe(1);
  });

  it('defaults non-production environments to no trusted proxy', () => {
    expect(parseTrustProxySetting(undefined, 'development')).toBe(false);
    expect(parseTrustProxySetting(undefined, 'test')).toBe(false);
  });

  it('defaults PM2-managed non-production runtimes to loopback proxies', () => {
    expect(parseTrustProxySetting(undefined, 'development', { pm_id: '0' })).toBe('loopback');
  });

  it('parses boolean values', () => {
    expect(parseTrustProxySetting('true', 'production')).toBe(true);
    expect(parseTrustProxySetting('false', 'production')).toBe(false);
  });

  it('parses numeric hop counts', () => {
    expect(parseTrustProxySetting('2', 'production')).toBe(2);
  });

  it('parses comma-separated proxy entries', () => {
    expect(parseTrustProxySetting('loopback, linklocal', 'production')).toEqual([
      'loopback',
      'linklocal',
    ]);
  });
});
