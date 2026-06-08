#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const require = createRequire(import.meta.url);

const serviceConfigs = {
  'api-gateway': {
    cwd: path.join(rootDir, 'services', 'api-gateway'),
    aliases: {
      SERVICE_NAME: ['API_GATEWAY_SERVICE_NAME'],
      PORT: ['API_GATEWAY_PORT'],
      DATABASE_URL: [
        'API_GATEWAY_DATABASE_URL',
        'GATEWAY_DATABASE_URL',
        'AUTH_SERVICE_DATABASE_URL',
        'AUTH_DATABASE_URL',
      ],
      AUTH_SERVICE_URL: ['AUTH_SERVICE_BASE_URL'],
      STORE_SERVICE_URL: ['STORE_SERVICE_BASE_URL'],
      NEWSFEED_SERVICE_URL: ['NEWSFEED_SERVICE_BASE_URL'],
      APP_SERVICE_URL: ['APP_SERVICE_BASE_URL'],
    },
  },
  'auth-service': {
    cwd: path.join(rootDir, 'services', 'auth-service'),
    aliases: {
      SERVICE_NAME: ['AUTH_SERVICE_NAME'],
      PORT: ['AUTH_SERVICE_PORT'],
      DATABASE_URL: ['AUTH_SERVICE_DATABASE_URL', 'AUTH_DATABASE_URL'],
    },
  },
  'store-service': {
    cwd: path.join(rootDir, 'services', 'store-service'),
    aliases: {
      SERVICE_NAME: ['STORE_SERVICE_NAME'],
      PORT: ['STORE_SERVICE_PORT'],
      DATABASE_URL: ['STORE_SERVICE_DATABASE_URL', 'STORE_DATABASE_URL'],
      AUTH_SERVICE_BASE_URL: ['AUTH_SERVICE_URL'],
      NEWSFEED_SERVICE_BASE_URL: ['NEWSFEED_SERVICE_URL'],
    },
  },
  'newsfeed-service': {
    cwd: path.join(rootDir, 'services', 'newsfeed-service'),
    aliases: {
      SERVICE_NAME: ['NEWSFEED_SERVICE_NAME'],
      PORT: ['NEWSFEED_SERVICE_PORT'],
      DATABASE_URL: ['NEWSFEED_SERVICE_DATABASE_URL', 'NEWSFEED_DATABASE_URL'],
      AUTH_SERVICE_BASE_URL: ['AUTH_SERVICE_URL'],
      STORE_SERVICE_BASE_URL: ['STORE_SERVICE_URL'],
    },
  },
  'app-service': {
    cwd: path.join(rootDir, 'services', 'app-service'),
    aliases: {
      SERVICE_NAME: ['APP_SERVICE_NAME'],
      PORT: ['APP_SERVICE_PORT'],
      DATABASE_URL: ['APP_SERVICE_DATABASE_URL', 'APP_DATABASE_URL'],
      AUTH_SERVICE_BASE_URL: ['AUTH_SERVICE_URL'],
      NEWSFEED_SERVICE_BASE_URL: ['NEWSFEED_SERVICE_URL'],
    },
  },
};

function getRootEnvName() {
  const requestedEnv = (process.env.APP_ENV || process.env.NODE_ENV || 'development')
    .trim()
    .toLowerCase();

  return requestedEnv === 'production' ? 'production' : 'development';
}

function parseEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return {};
  }

  const entries = {};
  const content = readFileSync(filePath, 'utf8');

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    const separator = line.indexOf('=');
    if (separator === -1) {
      continue;
    }

    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    entries[key] = value;
  }

  return entries;
}

function isPresent(value) {
  return typeof value === 'string' && value.trim() !== '';
}

function applyAliases(env, aliases) {
  for (const [targetKey, sourceKeys] of Object.entries(aliases)) {
    if (isPresent(env[targetKey])) {
      continue;
    }

    const sourceKey = sourceKeys.find((key) => isPresent(env[key]));
    if (sourceKey) {
      env[targetKey] = env[sourceKey];
    }
  }
}

function resolveLaunchTarget(command, commandArgs) {
  if (command === 'prisma') {
    return {
      command: process.execPath,
      args: [require.resolve('prisma/build/index.js'), ...commandArgs],
      shell: false,
    };
  }

  if (command === 'ts-node') {
    return {
      command: process.execPath,
      args: [require.resolve('ts-node/dist/bin.js'), ...commandArgs],
      shell: false,
    };
  }

  return {
    command,
    args: commandArgs,
    shell: process.platform === 'win32',
  };
}

const [, , serviceName, command, ...commandArgs] = process.argv;
const serviceConfig = serviceConfigs[serviceName];

if (!serviceConfig || !command) {
  console.error('Usage: node scripts/run-with-service-env.mjs <service-name> <command> [...args]');
  console.error(`Available services: ${Object.keys(serviceConfigs).join(', ')}`);
  process.exit(1);
}

const rootEnvPath = path.join(rootDir, `.env.${getRootEnvName()}`);
if (!existsSync(rootEnvPath)) {
  console.error(`[env] Missing ${path.relative(rootDir, rootEnvPath)}.`);
  process.exit(1);
}

const childEnv = {
  ...parseEnvFile(rootEnvPath),
  ...process.env,
};
applyAliases(childEnv, serviceConfig.aliases);

const launchTarget = resolveLaunchTarget(command, commandArgs);
const child = spawn(launchTarget.command, launchTarget.args, {
  cwd: serviceConfig.cwd,
  env: childEnv,
  stdio: 'inherit',
  shell: launchTarget.shell,
});

child.on('error', (error) => {
  console.error(`[env] Failed to run ${command}: ${error.message}`);
  process.exit(1);
});

child.on('exit', (code, signal) => {
  if (signal) {
    console.error(`[env] ${command} exited with signal ${signal}.`);
    process.exit(1);
  }

  process.exit(code ?? 0);
});
