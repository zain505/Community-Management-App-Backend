import path from 'node:path';
import dotenv from 'dotenv';
import { z } from 'zod';
import { parseTrustProxySetting } from './trust-proxy';

dotenv.config({
  path: process.env.ENV_FILE || path.resolve(__dirname, '../../.env'),
});

// Keep older BASE_URL env names working while the gateway standardizes on *_SERVICE_URL.
process.env.AUTH_SERVICE_URL ||= process.env.AUTH_SERVICE_BASE_URL;
process.env.STORE_SERVICE_URL ||= process.env.STORE_SERVICE_BASE_URL;
process.env.NEWSFEED_SERVICE_URL ||= process.env.NEWSFEED_SERVICE_BASE_URL;
process.env.APP_SERVICE_URL ||= process.env.APP_SERVICE_BASE_URL;

const DEFAULT_PORT = 4000;
const DEFAULT_CORS_ORIGINS = [
  'http://hzhtechco.site',
  'https://hzhtechco.site',
  'http://www.hzhtechco.site',
  'https://www.hzhtechco.site',
  'capacitor://localhost',
  'ionic://localhost',
  'http://localhost',
  'https://localhost',
  'http://localhost:3000',
  'http://localhost:5173',
].join(',');
const DEFAULT_AUTH_SERVICE_URL = 'http://127.0.0.1:4100';
const DEFAULT_STORE_SERVICE_URL = 'http://127.0.0.1:4200';
const DEFAULT_NEWSFEED_SERVICE_URL = 'http://127.0.0.1:4300';
const DEFAULT_APP_SERVICE_URL = 'http://127.0.0.1:4400';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  SERVICE_NAME: z.string().default('api-gateway'),
  // PORT is usually injected by PM2 in production and falls back to 4000 locally.
  PORT: z.coerce.number().int().positive().default(DEFAULT_PORT),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  CORS_ORIGINS: z.string().default(DEFAULT_CORS_ORIGINS),
  TRUST_PROXY: z.string().optional(),
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_TTL: z.string().default('15m'),
  JWT_REFRESH_TTL: z.string().default('7d'),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(8).max(15).default(12),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
  LOGIN_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(10),
  // These private URLs let the gateway call the other PM2-managed services on the same VPS.
  AUTH_SERVICE_URL: z.string().url().default(DEFAULT_AUTH_SERVICE_URL),
  STORE_SERVICE_URL: z.string().url().default(DEFAULT_STORE_SERVICE_URL),
  STORE_SERVICE_TIMEOUT_MS: z.coerce.number().int().positive().default(10_000),
  NEWSFEED_SERVICE_URL: z.string().url().default(DEFAULT_NEWSFEED_SERVICE_URL),
  APP_SERVICE_URL: z.string().url().default(DEFAULT_APP_SERVICE_URL),
  PROXY_TIMEOUT_MS: z.coerce.number().int().positive().default(10_000),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `${issue.path.join('.') || 'env'}: ${issue.message}`)
    .join('; ');
  throw new Error(`Invalid environment configuration: ${issues}`);
}

const rawEnv = parsed.data;

const corsOrigins = rawEnv.CORS_ORIGINS.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const developmentCorsOriginPatterns = [
  /^http:\/\/localhost(?::\d+)?$/i,
  /^https:\/\/localhost(?::\d+)?$/i,
  /^http:\/\/127\.0\.0\.1(?::\d+)?$/i,
  /^http:\/\/192\.168(?:\.\d{1,3}){2}(?::\d+)?$/i,
  /^http:\/\/10(?:\.\d{1,3}){3}(?::\d+)?$/i,
  /^exp:\/\/.+$/i,
];

export function isAllowedCorsOrigin(origin?: string | null): boolean {
  if (!origin) {
    return true;
  }

  if (
    rawEnv.NODE_ENV === 'development' &&
    developmentCorsOriginPatterns.some((pattern) => pattern.test(origin))
  ) {
    return true;
  }

  return corsOrigins.includes(origin);
}

export const env = {
  ...rawEnv,
  CORS_ORIGINS: corsOrigins,
  TRUST_PROXY: parseTrustProxySetting(rawEnv.TRUST_PROXY, rawEnv.NODE_ENV),
};
