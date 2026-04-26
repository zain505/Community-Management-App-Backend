import { cpSync, existsSync, rmSync } from 'node:fs';
import path from 'node:path';

const serviceDir = process.cwd();
const sourceDir = path.join(serviceDir, 'src', 'generated', 'prisma');
const targetDir = path.join(serviceDir, 'dist', 'generated', 'prisma');

if (!existsSync(sourceDir)) {
  console.error(`[copy-generated-prisma] Source directory not found: ${sourceDir}`);
  process.exit(1);
}

rmSync(targetDir, { recursive: true, force: true });
cpSync(sourceDir, targetDir, { recursive: true });

console.log(`[copy-generated-prisma] Copied Prisma client to ${targetDir}`);
