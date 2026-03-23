#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const sourceServiceDir = path.resolve('services', 'auth-service');
const targetName = process.argv[2];

if (!targetName) {
  // eslint-disable-next-line no-console
  console.error('Usage: npm run create:service -- <service-name>');
  process.exit(1);
}

const targetDir = path.resolve('services', targetName);

await fs.access(sourceServiceDir);

try {
  await fs.access(targetDir);
  // eslint-disable-next-line no-console
  console.error(`Target already exists: ${targetDir}`);
  process.exit(1);
} catch {
  // Target does not exist, continue.
}

await fs.cp(sourceServiceDir, targetDir, {
  recursive: true,
  filter: (entry) => {
    return !entry.includes('node_modules') && !entry.includes('dist') && !entry.includes('coverage');
  },
});

const packageJsonPath = path.join(targetDir, 'package.json');
const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
packageJson.name = `@community/${targetName}`;
packageJson.description = `${targetName} microservice template using Express, TypeScript, and MySQL/Prisma.`;
await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf-8');

const envExamplePath = path.join(targetDir, '.env.example');
const envExample = await fs.readFile(envExamplePath, 'utf-8');
const updatedEnvExample = envExample.replace('PORT=4000', 'PORT=4100');
await fs.writeFile(envExamplePath, updatedEnvExample, 'utf-8');

// eslint-disable-next-line no-console
console.log(`Created service template at: ${targetDir}`);
