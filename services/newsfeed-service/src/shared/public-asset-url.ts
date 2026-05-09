import { env } from '../config/env';

const publicAssetPathPrefix = '/uploads/';

export function toPublicAssetUrl(value: string): string {
  if (!env.PUBLIC_BASE_URL || !value.startsWith(publicAssetPathPrefix)) {
    return value;
  }

  try {
    return new URL(value, env.PUBLIC_BASE_URL).toString();
  } catch {
    return value;
  }
}
