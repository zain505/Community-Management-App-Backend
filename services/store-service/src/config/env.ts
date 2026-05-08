import path from 'node:path';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({
  path: process.env.ENV_FILE || path.resolve(__dirname, '../../.env'),
});

const DEFAULT_PORT = 4200;
const DEFAULT_CORS_ORIGINS = [
  'http://hzhtechco.site',
  'https://hzhtechco.site',
  'http://www.hzhtechco.site',
  'https://www.hzhtechco.site',
  'http://localhost:3000',
  'http://localhost:5173',
].join(',');
const DEFAULT_AUTH_SERVICE_BASE_URL = 'http://127.0.0.1:4100';
const DEFAULT_NEWSFEED_SERVICE_BASE_URL = 'http://127.0.0.1:4300';
const DEFAULT_REDIS_URL = 'redis://127.0.0.1:6379';

const booleanFlagSchema = z.preprocess((value) => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalizedValue = value.trim().toLowerCase();

    if (['true', '1', 'yes', 'on'].includes(normalizedValue)) {
      return true;
    }

    if (['false', '0', 'no', 'off'].includes(normalizedValue)) {
      return false;
    }
  }

  return value;
}, z.boolean());

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  SERVICE_NAME: z.string().default('store-service'),
  // PORT is usually injected by PM2 in production and falls back to 4200 locally.
  PORT: z.coerce.number().int().positive().default(DEFAULT_PORT),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  CORS_ORIGINS: z.string().default(DEFAULT_CORS_ORIGINS),
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_TTL: z.string().default('15m'),
  JWT_REFRESH_TTL: z.string().default('7d'),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(8).max(15).default(12),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
  LOGIN_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(10),
  // Internal service URLs stay on loopback when PM2 runs the services behind Nginx.
  AUTH_SERVICE_BASE_URL: z.string().url().default(DEFAULT_AUTH_SERVICE_BASE_URL),
  AUTH_SERVICE_TIMEOUT_MS: z.coerce.number().int().positive().default(10_000),
  NEWSFEED_SERVICE_BASE_URL: z.string().url().default(DEFAULT_NEWSFEED_SERVICE_BASE_URL),
  NEWSFEED_SERVICE_TIMEOUT_MS: z.coerce.number().int().positive().default(10_000),
  REDIS_ENABLED: booleanFlagSchema.default(false),
  REDIS_URL: z.string().url().default(DEFAULT_REDIS_URL),
  REDIS_CONNECT_TIMEOUT_MS: z.coerce.number().int().positive().default(2_000),
  STORE_LIST_CACHE_TTL_SECONDS: z.coerce.number().int().positive().default(60),
  STORE_SEARCH_SYNC_DEBOUNCE_SECONDS: z.coerce.number().int().positive().default(15),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `${issue.path.join('.') || 'env'}: ${issue.message}`)
    .join('; ');
  throw new Error(`Invalid environment configuration: ${issues}`);
}

const rawEnv = parsed.data;

export const env = {
  ...rawEnv,
  CORS_ORIGINS: rawEnv.CORS_ORIGINS.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
};
