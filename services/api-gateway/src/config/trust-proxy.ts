export type TrustProxySetting = boolean | number | string | string[];

export function parseTrustProxySetting(
  value: string | undefined,
  nodeEnv: string,
): TrustProxySetting {
  const normalizedValue = value?.trim();

  if (!normalizedValue) {
    return nodeEnv === 'production' ? 1 : false;
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
