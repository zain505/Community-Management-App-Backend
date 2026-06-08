import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const requestedEnv = (process.env.APP_ENV || process.env.NODE_ENV || 'development')
  .trim()
  .toLowerCase();
const environment = requestedEnv === 'production' ? 'production' : 'development';
const requiredRootEnvFiles = ['.env.development', '.env.production'];
const missingRootEnvFiles = requiredRootEnvFiles.filter(
  (fileName) => !existsSync(path.join(rootDir, fileName)),
);

if (missingRootEnvFiles.length > 0) {
  console.error(`[env:setup] Missing root env file(s): ${missingRootEnvFiles.join(', ')}.`);
  process.exit(1);
}

console.log(
  `[env:setup] Using .env.${environment}. Service-local .env files are no longer generated.`,
);
