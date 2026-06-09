const { spawn } = require('node:child_process');
const { existsSync, readFileSync } = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');
const dotenv = require('dotenv');

const rootDir = path.resolve(__dirname, '..');
const rootEnvironment = (process.env.APP_ENV || process.env.NODE_ENV || 'production')
  .trim()
  .toLowerCase();
const rootEnvPath = path.join(
  rootDir,
  `.env.${rootEnvironment === 'development' ? 'development' : 'production'}`,
);
const workspaceRuntimeAliasRegisterPath = path.join(
  rootDir,
  'scripts',
  'register-workspace-runtime-aliases.js',
);
const contractsEntryPath = path.join(rootDir, 'packages', 'contracts', 'dist', 'index.js');
const contractsSourceEntryPath = path.join(rootDir, 'packages', 'contracts', 'src', 'index.ts');
const installTimeOnlyDependencies = new Set(['prisma']);

if (!existsSync(rootEnvPath)) {
  console.error(`[production] Missing ${path.relative(rootDir, rootEnvPath)}.`);
  process.exit(1);
}

dotenv.config({ path: rootEnvPath });

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
    databaseUrlEnvKeys: ['AUTH_SERVICE_DATABASE_URL', 'AUTH_DATABASE_URL'],
    cwd: path.join(rootDir, 'services', 'auth-service'),
    compiledEntry: 'dist/server.js',
    env: {
      PORT: internalPorts.auth,
    },
  },
  {
    name: 'store-service',
    databaseUrlEnvKeys: ['STORE_SERVICE_DATABASE_URL', 'STORE_DATABASE_URL'],
    cwd: path.join(rootDir, 'services', 'store-service'),
    compiledEntry: 'dist/server.js',
    env: {
      PORT: internalPorts.store,
      AUTH_SERVICE_BASE_URL: `http://127.0.0.1:${internalPorts.auth}`,
      NEWSFEED_SERVICE_BASE_URL: `http://127.0.0.1:${internalPorts.newsfeed}`,
    },
  },
  {
    name: 'newsfeed-service',
    databaseUrlEnvKeys: ['NEWSFEED_SERVICE_DATABASE_URL', 'NEWSFEED_DATABASE_URL'],
    cwd: path.join(rootDir, 'services', 'newsfeed-service'),
    compiledEntry: 'dist/server.js',
    env: {
      PORT: internalPorts.newsfeed,
      AUTH_SERVICE_BASE_URL: `http://127.0.0.1:${internalPorts.auth}`,
      STORE_SERVICE_BASE_URL: `http://127.0.0.1:${internalPorts.store}`,
    },
  },
  {
    name: 'app-service',
    databaseUrlEnvKeys: ['APP_SERVICE_DATABASE_URL', 'APP_DATABASE_URL'],
    cwd: path.join(rootDir, 'services', 'app-service'),
    compiledEntry: 'dist/server.js',
    env: {
      PORT: internalPorts.app,
      AUTH_SERVICE_BASE_URL: `http://127.0.0.1:${internalPorts.auth}`,
      NEWSFEED_SERVICE_BASE_URL: `http://127.0.0.1:${internalPorts.newsfeed}`,
    },
  },
  {
    name: 'api-gateway',
    databaseUrlEnvKeys: [
      'API_GATEWAY_DATABASE_URL',
      'GATEWAY_DATABASE_URL',
      'AUTH_SERVICE_DATABASE_URL',
      'AUTH_DATABASE_URL',
    ],
    cwd: path.join(rootDir, 'services', 'api-gateway'),
    compiledEntry: 'dist/server.js',
    env: {
      PORT: publicPort,
      TRUST_PROXY: process.env.TRUST_PROXY || '1',
      AUTH_SERVICE_URL: `http://127.0.0.1:${internalPorts.auth}`,
      STORE_SERVICE_URL: `http://127.0.0.1:${internalPorts.store}`,
      NEWSFEED_SERVICE_URL: `http://127.0.0.1:${internalPorts.newsfeed}`,
      APP_SERVICE_URL: `http://127.0.0.1:${internalPorts.app}`,
    },
  },
];

let shuttingDown = false;
let remainingChildren = services.length;
let exitCode = 0;

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
    console.error(`[production] Failed to read ${filePath}.`);
    console.error(`[production] ${getErrorMessage(error)}`);
    process.exit(1);
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

  return null;
}

function isLocalDevelopmentDatabaseUrl(databaseUrl) {
  return /^mysql:\/\/root:root@(?:127\.0\.0\.1|localhost)(?::3306|:3306)?\//i.test(databaseUrl);
}

function shouldAllowLocalDevelopmentDatabaseUrls() {
  return (
    (process.env.NODE_ENV || 'production') === 'development' ||
    process.env.ALLOW_LOCAL_PRODUCTION_DATABASE_URLS === 'true'
  );
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
    `[production] ${service.name} is using a local development DATABASE_URL from ${resolvedDatabaseUrl.source}.`,
  );
  console.warn(
    `[production] Set one of ${service.databaseUrlEnvKeys.join(', ')} in ${path.relative(
      rootDir,
      rootEnvPath,
    )} before restarting.`,
  );
}

function warnAboutIgnoredRootDatabaseUrl() {
  const rootDatabaseUrl = getFirstNonEmptyValue(process.env.DATABASE_URL);

  if (!rootDatabaseUrl) {
    return;
  }

  console.warn(
    '[production] Ignoring root-level DATABASE_URL because each service resolves its own database connection.',
  );
  console.warn(
    '[production] Set service-specific *_DATABASE_URL variables in the root env file instead.',
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
    '[production] Refusing to start because one or more services still resolve to local development DATABASE_URL values.',
  );
  console.error(
    '[production] Update the affected service-specific *_DATABASE_URL variables in the root env file.',
  );

  for (const { service, resolvedDatabaseUrl } of invalidServices) {
    console.error(
      `[production] ${service.name} resolved DATABASE_URL from ${resolvedDatabaseUrl.source}.`,
    );
    console.error(
      `[production] Set one of ${service.databaseUrlEnvKeys.join(', ')} in ${path.relative(
        rootDir,
        rootEnvPath,
      )} before restarting.`,
    );
  }

  if (getFirstNonEmptyValue(process.env.DATABASE_URL)) {
    console.error(
      '[production] A root-level DATABASE_URL was provided, but each service owns its own database connection.',
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

  console.error('[production] Missing runtime dependencies for one or more services.');
  for (const entry of unresolvedDependencies) {
    console.error(
      `[production] ${entry.service} cannot resolve: ${entry.dependencies.join(', ')}.`,
    );
  }
  console.error(
    '[production] Run "npm install" from the repository root, then rebuild before restarting the services.',
  );
  process.exit(1);
}

function validateRuntimePrerequisites() {
  if (!existsSync(contractsEntryPath) && !existsSync(contractsSourceEntryPath)) {
    console.error('[production] Missing packages/contracts runtime sources.');
    console.error(
      '[production] Ensure the repository includes packages/contracts and rerun "npm install" from the repository root.',
    );
    process.exit(1);
  }

  for (const service of services) {
    const compiledEntryPath = path.join(service.cwd, service.compiledEntry);
    if (!existsSync(compiledEntryPath)) {
      console.error(`[production] Missing compiled service entry: ${compiledEntryPath}`);
      console.error(
        '[production] Run "npm run build" from the repository root before starting production services.',
      );
      process.exit(1);
    }
  }

  validateServiceRuntimeDependencies();
}

function resolveServiceLaunchTarget(service) {
  return {
    args: ['-r', workspaceRuntimeAliasRegisterPath, service.compiledEntry],
    env: {},
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
  console.log(`[production] Shutting down all services (${reason}).`);

  for (const service of services) {
    if (service.child && !service.child.killed) {
      service.child.kill('SIGTERM');
    }
  }
}

function handleChildExit(service, code, signal) {
  remainingChildren -= 1;
  const reason = signal ? `signal=${signal}` : `code=${code ?? 0}`;
  console.log(`[production] ${service.name} exited (${reason}).`);

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

  const child = spawn(process.execPath, launchTarget.args, {
    cwd: service.cwd,
    env: {
      ...inheritedChildEnv,
      NODE_ENV: process.env.NODE_ENV || 'production',
      ...launchTarget.env,
      ...service.env,
      ...(databaseUrlOverride ? { DATABASE_URL: databaseUrlOverride.value } : {}),
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

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

  console.log('[production] Starting Community Management backend services.');
  console.log(`[production] Public gateway port: ${publicPort}`);

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
