import { copyFileSync, existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const servicesDir = path.join(rootDir, 'services');

const serviceDirectories = readdirSync(servicesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => path.join(servicesDir, entry.name))
  .sort((left, right) => left.localeCompare(right));

let createdCount = 0;
const missingTemplates = [];

for (const serviceDirectory of serviceDirectories) {
  const envExamplePath = path.join(serviceDirectory, '.env.example');
  const envPath = path.join(serviceDirectory, '.env');
  const relativeEnvPath = path.relative(rootDir, envPath);
  const relativeEnvExamplePath = path.relative(rootDir, envExamplePath);

  if (!existsSync(envExamplePath)) {
    missingTemplates.push(path.relative(rootDir, serviceDirectory));
    continue;
  }

  if (existsSync(envPath)) {
    console.log(`[env:setup] Found ${relativeEnvPath}.`);
    continue;
  }

  copyFileSync(envExamplePath, envPath);
  createdCount += 1;
  console.log(`[env:setup] Created ${relativeEnvPath} from ${relativeEnvExamplePath}.`);
}

if (missingTemplates.length > 0) {
  console.warn(
    `[env:setup] Skipped ${missingTemplates.join(', ')} because .env.example is missing.`,
  );
}

if (createdCount > 0) {
  console.log(
    `[env:setup] Created ${createdCount} missing service env file(s). Replace placeholder secrets before production use.`,
  );
} else {
  console.log('[env:setup] All service env files are already present.');
}
