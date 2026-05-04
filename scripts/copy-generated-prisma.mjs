import { spawnSync } from 'node:child_process';
import { cpSync, existsSync } from 'node:fs';
import path from 'node:path';

const serviceDir = process.cwd();
const sourceDir = path.join(serviceDir, 'src', 'generated', 'prisma');
const targetDir = path.join(serviceDir, 'dist', 'generated', 'prisma');

if (!existsSync(sourceDir)) {
  console.error(`[copy-generated-prisma] Source directory not found: ${sourceDir}`);
  process.exit(1);
}

if (process.platform === 'win32') {
  const escapedSourceDir = sourceDir.replace(/'/g, "''");
  const escapedTargetDir = targetDir.replace(/'/g, "''");
  const result = spawnSync(
    'powershell.exe',
    [
      '-NoProfile',
      '-Command',
      `New-Item -ItemType Directory -Force -Path '${escapedTargetDir}' | Out-Null; Copy-Item -Path '${escapedSourceDir}\\*' -Destination '${escapedTargetDir}' -Recurse -Force`,
    ],
    { stdio: 'inherit' },
  );

  if (result.error) {
    throw result.error;
  }

  if ((result.status ?? 1) !== 0) {
    process.exit(result.status ?? 1);
  }
} else {
  cpSync(sourceDir, targetDir, { recursive: true, force: true });
}

console.log(`[copy-generated-prisma] Copied Prisma client to ${targetDir}`);
