import path from 'node:path';
import { existsSync } from 'node:fs';
import dotenv from 'dotenv';
import { z } from 'zod';

function resolveEnvFilePath(): string {
  const rootDir = path.resolve(__dirname, '../../../..');
  const appEnv = (process.env.APP_ENV || process.env.NODE_ENV || 'development')
    .trim()
    .toLowerCase();
  const environment = appEnv === 'production' ? 'production' : 'development';
  const envPath = path.join(rootDir, `.env.${environment}`);

  return existsSync(envPath) ? envPath : path.join(rootDir, '.env.development');
}

function applyEnvAlias(targetKey: string, sourceKeys: string[]): void {
  if (process.env[targetKey]?.trim()) {
    return;
  }

  const sourceKey = sourceKeys.find((key) => process.env[key]?.trim());
  if (sourceKey) {
    process.env[targetKey] = process.env[sourceKey];
  }
}

if (process.env.NODE_ENV !== 'test') {
  dotenv.config({
    path: resolveEnvFilePath(),
  });
}

applyEnvAlias('SERVICE_NAME', ['AUTH_SERVICE_NAME']);
applyEnvAlias('PORT', ['AUTH_SERVICE_PORT']);
applyEnvAlias('DATABASE_URL', ['AUTH_SERVICE_DATABASE_URL', 'AUTH_DATABASE_URL']);

const DEFAULT_PORT = 4100;
const DEFAULT_CORS_ORIGINS = [
  'http://hzhtechco.site',
  'https://hzhtechco.site',
  'http://www.hzhtechco.site',
  'https://www.hzhtechco.site',
  'http://localhost:3000',
  'http://localhost:5173',
].join(',');
const DEFAULT_PUBLIC_BASE_URL = 'http://localhost:3000';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  SERVICE_NAME: z.string().default('auth-service'),
  // PORT is usually injected by PM2 in production and falls back to 4100 locally.
  PORT: z.coerce.number().int().positive().default(DEFAULT_PORT),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  CORS_ORIGINS: z.string().default(DEFAULT_CORS_ORIGINS),
  PUBLIC_BASE_URL: z.string().url().default(DEFAULT_PUBLIC_BASE_URL),
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_TTL: z.string().default('15m'),
  JWT_REFRESH_TTL: z.string().default('7d'),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(8).max(15).default(12),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
  LOGIN_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(10),
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
