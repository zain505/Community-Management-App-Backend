export type TrustProxySetting = boolean | number | string | string[];

export function parseTrustProxySetting(
  value: string | undefined,
  nodeEnv: string,
  processEnv: NodeJS.ProcessEnv = process.env,
): TrustProxySetting {
  const normalizedValue = value?.trim();

  if (!normalizedValue) {
    if (nodeEnv === 'production') {
      return 1;
    }

    if (typeof processEnv.pm_id === 'string' && processEnv.pm_id.trim() !== '') {
      // PM2-managed gateways on the VPS commonly sit behind a same-host reverse proxy.
      return 'loopback';
    }

    return false;
  }

  const lowercaseValue = normalizedValue.toLowerCase();

  if (lowercaseValue === 'true') {
    return true;
  }

  if (lowercaseValue === 'false') {
    return false;
  }

  if (/^\d+$/.test(normalizedValue)) {
    return Number(normalizedValue);
  }

  if (normalizedValue.includes(',')) {
    return normalizedValue
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  return normalizedValue;
}
