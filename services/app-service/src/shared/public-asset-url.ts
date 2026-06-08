import { env } from '../config/env';

const publicAssetPathPrefix = '/uploads/';

export function toPublicAssetUrl(value: string): string {
  if (!value.startsWith(publicAssetPathPrefix)) {
    return value;
  }

  try {
    return new URL(value, env.PUBLIC_BASE_URL).toString();
  } catch {
    return value;
  }
}

export function toPublicAssetPath(value: string): string {
  try {
    const parsedUrl = new URL(value);
    return parsedUrl.pathname;
  } catch {
    return value;
  }
}
