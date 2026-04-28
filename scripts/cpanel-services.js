const { spawn } = require('node:child_process');
const { existsSync } = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');

const rootDir = path.resolve(__dirname, '..');
const tsNodeRegisterPath = resolveTsNodeRegisterPath();
const contractsEntryPath = path.join(rootDir, 'packages', 'contracts', 'dist', 'index.js');

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
    cwd: path.join(rootDir, 'services', 'auth-service'),
    entry: 'src/server.ts',
    env: {
      PORT: internalPorts.auth,
    },
  },
  {
    name: 'store-service',
    cwd: path.join(rootDir, 'services', 'store-service'),
    entry: 'src/server.ts',
    env: {
      PORT: internalPorts.store,
      AUTH_SERVICE_BASE_URL: `http://127.0.0.1:${internalPorts.auth}`,
      NEWSFEED_SERVICE_BASE_URL: `http://127.0.0.1:${internalPorts.newsfeed}`,
    },
  },
  {
    name: 'newsfeed-service',
    cwd: path.join(rootDir, 'services', 'newsfeed-service'),
    entry: 'src/server.ts',
    env: {
      PORT: internalPorts.newsfeed,
      AUTH_SERVICE_BASE_URL: `http://127.0.0.1:${internalPorts.auth}`,
      STORE_SERVICE_BASE_URL: `http://127.0.0.1:${internalPorts.store}`,
    },
  },
  {
    name: 'app-service',
    cwd: path.join(rootDir, 'services', 'app-service'),
    entry: 'src/server.ts',
    env: {
      PORT: internalPorts.app,
      AUTH_SERVICE_BASE_URL: `http://127.0.0.1:${internalPorts.auth}`,
      NEWSFEED_SERVICE_BASE_URL: `http://127.0.0.1:${internalPorts.newsfeed}`,
    },
  },
  {
    name: 'api-gateway',
    cwd: path.join(rootDir, 'services', 'api-gateway'),
    entry: 'src/server.ts',
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

function validateRuntimePrerequisites() {
  if (!existsSync(contractsEntryPath)) {
    console.error('[cpanel] Missing packages/contracts/dist/index.js.');
    console.error('[cpanel] Run "npm install" so postinstall can build the shared contracts package.');
    process.exit(1);
  }

  for (const service of services) {
    const serviceEntryPath = path.join(service.cwd, service.entry);
    if (!existsSync(serviceEntryPath)) {
      console.error(`[cpanel] Missing service entry file: ${serviceEntryPath}`);
      process.exit(1);
    }
  }
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
  const child = spawn(process.execPath, ['-r', tsNodeRegisterPath, service.entry], {
    cwd: service.cwd,
    env: {
      ...process.env,
      NODE_ENV: process.env.NODE_ENV || 'production',
      TS_NODE_PROJECT: path.join(service.cwd, 'tsconfig.json'),
      ...service.env,
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

  console.log('[cpanel] Starting Community Management backend services.');
  console.log(`[cpanel] Public gateway port: ${publicPort}`);

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
