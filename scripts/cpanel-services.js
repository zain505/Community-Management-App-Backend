const { spawn } = require('node:child_process');
const { existsSync, readFileSync } = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');

const rootDir = path.resolve(__dirname, '..');
const workspaceRuntimeAliasRegisterPath = path.join(
  rootDir,
  'scripts',
  'register-workspace-runtime-aliases.js',
);
const contractsEntryPath = path.join(rootDir, 'packages', 'contracts', 'dist', 'index.js');
const contractsSourceEntryPath = path.join(rootDir, 'packages', 'contracts', 'src', 'index.ts');
const installTimeOnlyDependencies = new Set(['prisma']);
const inheritedChildEnv = { ...process.env };

delete inheritedChildEnv.DATABASE_URL;

const internalPorts = {
  auth: process.env.AUTH_SERVICE_PORT || '4100',
  store: process.env.STORE_SERVICE_PORT || '4200',
  newsfeed: process.env.NEWSFEED_SERVICE_PORT || '4300',
  app: process.env.APP_SERVICE_PORT || '4400',
};

const publicPort = process.env.PORT || process.env.API_GATEWAY_PORT || '4000';

const services = [
  {
    name: 'auth-service',
    envFile: path.join(rootDir, 'services', 'auth-service', '.env'),
    databaseUrlEnvKeys: ['AUTH_SERVICE_DATABASE_URL', 'AUTH_DATABASE_URL'],
    cwd: path.join(rootDir, 'services', 'auth-service'),
    sourceEntry: 'src/server.ts',
    compiledEntry: 'dist/server.js',
    env: {
      PORT: internalPorts.auth,
    },
  },
  {
    name: 'store-service',
    envFile: path.join(rootDir, 'services', 'store-service', '.env'),
    databaseUrlEnvKeys: ['STORE_SERVICE_DATABASE_URL', 'STORE_DATABASE_URL'],
    cwd: path.join(rootDir, 'services', 'store-service'),
    sourceEntry: 'src/server.ts',
    compiledEntry: 'dist/server.js',
    env: {
      PORT: internalPorts.store,
      AUTH_SERVICE_BASE_URL: `http://127.0.0.1:${internalPorts.auth}`,
      NEWSFEED_SERVICE_BASE_URL: `http://127.0.0.1:${internalPorts.newsfeed}`,
    },
  },
  {
    name: 'newsfeed-service',
    envFile: path.join(rootDir, 'services', 'newsfeed-service', '.env'),
    databaseUrlEnvKeys: ['NEWSFEED_SERVICE_DATABASE_URL', 'NEWSFEED_DATABASE_URL'],
    cwd: path.join(rootDir, 'services', 'newsfeed-service'),
    sourceEntry: 'src/server.ts',
    compiledEntry: 'dist/server.js',
    env: {
      PORT: internalPorts.newsfeed,
      AUTH_SERVICE_BASE_URL: `http://127.0.0.1:${internalPorts.auth}`,
      STORE_SERVICE_BASE_URL: `http://127.0.0.1:${internalPorts.store}`,
    },
  },
  {
    name: 'app-service',
    envFile: path.join(rootDir, 'services', 'app-service', '.env'),
    databaseUrlEnvKeys: ['APP_SERVICE_DATABASE_URL', 'APP_DATABASE_URL'],
    cwd: path.join(rootDir, 'services', 'app-service'),
    sourceEntry: 'src/server.ts',
    compiledEntry: 'dist/server.js',
    env: {
      PORT: internalPorts.app,
      AUTH_SERVICE_BASE_URL: `http://127.0.0.1:${internalPorts.auth}`,
      NEWSFEED_SERVICE_BASE_URL: `http://127.0.0.1:${internalPorts.newsfeed}`,
    },
  },
  {
    name: 'api-gateway',
    envFile: path.join(rootDir, 'services', 'api-gateway', '.env'),
    databaseUrlEnvKeys: [
      'API_GATEWAY_DATABASE_URL',
      'GATEWAY_DATABASE_URL',
      'AUTH_SERVICE_DATABASE_URL',
      'AUTH_DATABASE_URL',
    ],
    cwd: path.join(rootDir, 'services', 'api-gateway'),
    sourceEntry: 'src/server.ts',
    compiledEntry: 'dist/server.js',
    env: {
      PORT: publicPort,
      AUTH_SERVICE_BASE_URL: `http://127.0.0.1:${internalPorts.auth}`,
      STORE_SERVICE_BASE_URL: `http://127.0.0.1:${internalPorts.store}`,
      NEWSFEED_SERVICE_BASE_URL: `http://127.0.0.1:${internalPorts.newsfeed}`,
      APP_SERVICE_BASE_URL: `http://127.0.0.1:${internalPorts.app}`,
    },
  },
];

let shuttingDown = false;
let remainingChildren = services.length;
let exitCode = 0;

function resolveTsNodeRegisterPath() {
  try {
    return require.resolve('ts-node/register/transpile-only');
  } catch (error) {
    console.error('[cpanel] Missing ts-node runtime dependency.');
    console.error('[cpanel] Run "npm install" from the repository root before starting the app.');
    console.error(`[cpanel] ${getErrorMessage(error)}`);
    process.exit(1);
  }
}

function getErrorMessage(error) {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

function readJsonFile(filePath) {
  try {
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`[cpanel] Failed to read ${filePath}.`);
    console.error(`[cpanel] ${getErrorMessage(error)}`);
    process.exit(1);
  }
}

function parseEnvFile(filePath) {
  try {
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
  } catch {
    return {};
  }
}

function getFirstNonEmptyValue(...values) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim() !== '') {
      return value;
    }
  }

  return undefined;
}

function resolveNamedEnvironmentValue(keys) {
  for (const key of keys) {
    const value = process.env[key];
    if (typeof value === 'string' && value.trim() !== '') {
      return {
        key,
        value,
      };
    }
  }

  return null;
}

function resolveServiceDatabaseUrl(service) {
  const envOverride = resolveNamedEnvironmentValue(service.databaseUrlEnvKeys || []);

  if (envOverride) {
    return {
      source: envOverride.key,
      value: envOverride.value,
    };
  }

  const fileEntries = parseEnvFile(service.envFile);
  const fileValue = getFirstNonEmptyValue(fileEntries.DATABASE_URL);

  if (fileValue) {
    return {
      source: path.relative(rootDir, service.envFile),
      value: fileValue,
    };
  }

  return null;
}

function isLocalDevelopmentDatabaseUrl(databaseUrl) {
  return /^mysql:\/\/root:root@(?:127\.0\.0\.1|localhost)(?::3306|:3307)?\//i.test(databaseUrl);
}

function shouldAllowLocalDevelopmentDatabaseUrls() {
  return (process.env.NODE_ENV || 'production') === 'development';
}

function warnAboutSuspiciousProductionDatabaseUrl(service) {
  const resolvedDatabaseUrl = resolveServiceDatabaseUrl(service);
  if (!resolvedDatabaseUrl) {
    return;
  }

  if (!isLocalDevelopmentDatabaseUrl(resolvedDatabaseUrl.value)) {
    return;
  }

  console.warn(
    `[cpanel] ${service.name} is using a local development DATABASE_URL from ${resolvedDatabaseUrl.source}.`,
  );
  console.warn(
    `[cpanel] Set one of ${service.databaseUrlEnvKeys.join(', ')} in cPanel or update ${path.relative(
      rootDir,
      service.envFile,
    )} before restarting.`,
  );
}

function warnAboutIgnoredRootDatabaseUrl() {
  const rootDatabaseUrl = getFirstNonEmptyValue(process.env.DATABASE_URL);

  if (!rootDatabaseUrl) {
    return;
  }

  console.warn(
    '[cpanel] Ignoring root-level DATABASE_URL for npm start because each service resolves its own database connection.',
  );
  console.warn(
    '[cpanel] Set AUTH_SERVICE_DATABASE_URL, STORE_SERVICE_DATABASE_URL, NEWSFEED_SERVICE_DATABASE_URL, APP_SERVICE_DATABASE_URL, and optionally API_GATEWAY_DATABASE_URL in cPanel instead.',
  );
}

function validateProductionDatabaseUrls() {
  if (shouldAllowLocalDevelopmentDatabaseUrls()) {
    return;
  }

  const invalidServices = [];

  for (const service of services) {
    const resolvedDatabaseUrl = resolveServiceDatabaseUrl(service);
    if (!resolvedDatabaseUrl || !isLocalDevelopmentDatabaseUrl(resolvedDatabaseUrl.value)) {
      continue;
    }

    invalidServices.push({
      service,
      resolvedDatabaseUrl,
    });
  }

  if (invalidServices.length === 0) {
    return;
  }

  console.error(
    '[cpanel] Refusing to start because one or more services still resolve to local development DATABASE_URL values.',
  );
  console.error(
    '[cpanel] This usually means the service-specific *_DATABASE_URL variables are missing in cPanel.',
  );

  for (const { service, resolvedDatabaseUrl } of invalidServices) {
    console.error(
      `[cpanel] ${service.name} resolved DATABASE_URL from ${resolvedDatabaseUrl.source}.`,
    );
    console.error(
      `[cpanel] Set one of ${service.databaseUrlEnvKeys.join(', ')} in cPanel or update ${path.relative(
        rootDir,
        service.envFile,
      )} before restarting.`,
    );
  }

  if (getFirstNonEmptyValue(process.env.DATABASE_URL)) {
    console.error(
      '[cpanel] A root-level DATABASE_URL was provided, but npm start does not use it because each service owns its own database.',
    );
  }

  process.exit(1);
}

function validateServiceRuntimeDependencies() {
  const unresolvedDependencies = [];

  for (const service of services) {
    const packageJsonPath = path.join(service.cwd, 'package.json');
    const packageJson = readJsonFile(packageJsonPath);
    const dependencyNames = Object.keys(packageJson.dependencies || {}).filter(
      (dependencyName) => !installTimeOnlyDependencies.has(dependencyName),
    );
    const missingDependencies = dependencyNames.filter((dependencyName) => {
      if (
        dependencyName === '@community/contracts' &&
        (existsSync(contractsEntryPath) || existsSync(contractsSourceEntryPath))
      ) {
        return false;
      }

      try {
        require.resolve(dependencyName, { paths: [service.cwd, rootDir] });
        return false;
      } catch {
        return true;
      }
    });

    if (missingDependencies.length > 0) {
      unresolvedDependencies.push({
        service: service.name,
        dependencies: missingDependencies,
      });
    }
  }

  if (unresolvedDependencies.length === 0) {
    return;
  }

  console.error('[cpanel] Missing runtime dependencies for one or more services.');
  for (const entry of unresolvedDependencies) {
    console.error(
      `[cpanel] ${entry.service} cannot resolve: ${entry.dependencies.join(', ')}.`,
    );
  }
  console.error(
    '[cpanel] Redeploy the latest package.json/package-lock.json, then run "npm install" from the repository root in cPanel before restarting the app.',
  );
  console.error(
    '[cpanel] Some shared hosting installs only the root package dependencies, so the root manifest must stay in sync with service runtime dependencies.',
  );
  process.exit(1);
}

function validateRuntimePrerequisites() {
  if (!existsSync(contractsEntryPath) && !existsSync(contractsSourceEntryPath)) {
    console.error('[cpanel] Missing packages/contracts runtime sources.');
    console.error(
      '[cpanel] Ensure the repository includes packages/contracts and rerun "npm install" from the repository root.',
    );
    process.exit(1);
  }

  for (const service of services) {
    const compiledEntryPath = path.join(service.cwd, service.compiledEntry);
    const sourceEntryPath = path.join(service.cwd, service.sourceEntry);
    if (!existsSync(compiledEntryPath) && !existsSync(sourceEntryPath)) {
      console.error(
        `[cpanel] Missing service entry files: ${compiledEntryPath} and ${sourceEntryPath}`,
      );
      process.exit(1);
    }
  }

  validateServiceRuntimeDependencies();
}

function resolveServiceLaunchTarget(service) {
  const compiledEntryPath = path.join(service.cwd, service.compiledEntry);
  if (existsSync(compiledEntryPath)) {
    return {
      mode: 'compiled',
      args: ['-r', workspaceRuntimeAliasRegisterPath, service.compiledEntry],
      env: {},
    };
  }

  return {
    mode: 'ts-node',
    args: [
      '-r',
      resolveTsNodeRegisterPath(),
      '-r',
      workspaceRuntimeAliasRegisterPath,
      service.sourceEntry,
    ],
    env: {
      TS_NODE_PROJECT: path.join(service.cwd, 'tsconfig.json'),
    },
  };
}

function prefixOutput(serviceName, stream, input) {
  const reader = readline.createInterface({ input });

  reader.on('line', (line) => {
    if (!line.trim()) {
      return;
    }

    stream.write(`[${serviceName}] ${line}\n`);
  });

  return reader;
}

function stopAllChildren(reason) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  console.log(`[cpanel] Shutting down all services (${reason}).`);

  for (const service of services) {
    if (service.child && !service.child.killed) {
      service.child.kill('SIGTERM');
    }
  }
}

function handleChildExit(service, code, signal) {
  remainingChildren -= 1;
  const reason = signal ? `signal=${signal}` : `code=${code ?? 0}`;
  console.log(`[cpanel] ${service.name} exited (${reason}).`);

  if (!shuttingDown) {
    exitCode = code ?? 1;
    stopAllChildren(`${service.name} exit`);
  }

  if (remainingChildren === 0) {
    process.exit(exitCode);
  }
}

function startService(service) {
  const databaseUrlOverride = resolveNamedEnvironmentValue(service.databaseUrlEnvKeys || []);
  const launchTarget = resolveServiceLaunchTarget(service);

  if (launchTarget.mode === 'ts-node' && (process.env.NODE_ENV || 'production') !== 'development') {
    console.warn(
      `[cpanel] ${service.name} is falling back to ts-node because ${service.compiledEntry} is missing.`,
    );
    console.warn(
      `[cpanel] Run "npm install" again with the latest deploy so postinstall can build production files.`,
    );
  }

  const child = spawn(
    process.execPath,
    launchTarget.args,
    {
      cwd: service.cwd,
      env: {
        ...inheritedChildEnv,
        NODE_ENV: process.env.NODE_ENV || 'production',
        ...launchTarget.env,
        ...service.env,
        ...(databaseUrlOverride ? { DATABASE_URL: databaseUrlOverride.value } : {}),
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );

  service.child = child;

  const stdoutReader = prefixOutput(service.name, process.stdout, child.stdout);
  const stderrReader = prefixOutput(service.name, process.stderr, child.stderr);

  child.on('error', (error) => {
    process.stderr.write(`[${service.name}] Failed to start: ${getErrorMessage(error)}\n`);
  });

  child.on('exit', (code, signal) => {
    stdoutReader.close();
    stderrReader.close();
    handleChildExit(service, code, signal);
  });
}

function main() {
  validateRuntimePrerequisites();
  warnAboutIgnoredRootDatabaseUrl();
  validateProductionDatabaseUrls();

  console.log('[cpanel] Starting Community Management backend services.');
  console.log(`[cpanel] Public gateway port: ${publicPort}`);

  for (const service of services) {
    warnAboutSuspiciousProductionDatabaseUrl(service);
  }

  for (const service of services) {
    startService(service);
  }

  process.on('SIGINT', () => {
    exitCode = 0;
    stopAllChildren('SIGINT');
  });

  process.on('SIGTERM', () => {
    exitCode = 0;
    stopAllChildren('SIGTERM');
  });
}

main();
