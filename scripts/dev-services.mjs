import { execFileSync, spawn } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import process from 'node:process';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const stateFilePath = path.join(rootDir, '.dev-services-state.json');

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function normalizeServiceSelector(value) {
  return value.trim().toLowerCase();
}

function parseCliOptions(argv) {
  let restartArg = null;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--restart') {
      const nextArg = argv[index + 1];

      if (nextArg && !nextArg.startsWith('--')) {
        restartArg = nextArg;
        index += 1;
      } else {
        restartArg = 'all';
      }
    } else if (arg.startsWith('--restart=')) {
      restartArg = arg.slice('--restart='.length) || 'all';
    }
  }

  return {
    restartSelectors: restartArg
      ? restartArg
          .split(',')
          .map((value) => normalizeServiceSelector(value))
          .filter(Boolean)
      : [],
  };
}

function loadServiceState() {
  try {
    return JSON.parse(readFileSync(stateFilePath, 'utf8'));
  } catch {
    return {};
  }
}

const persistedServiceState = loadServiceState();

function saveServiceState() {
  writeFileSync(stateFilePath, JSON.stringify(persistedServiceState, null, 2));
}

function setTrackedProcessId(service, pid) {
  if (pid === null) {
    delete persistedServiceState[service.workspace];
  } else {
    persistedServiceState[service.workspace] = {
      pid,
      port: service.port,
      name: service.name,
    };
  }

  saveServiceState();
}

function getWorkspaceDevCommand(workspace) {
  const npmCliPath =
    process.env.npm_execpath ||
    (process.platform === 'win32'
      ? path.join(path.dirname(process.execPath), 'node_modules', 'npm', 'bin', 'npm-cli.js')
      : null);

  if (npmCliPath && existsSync(npmCliPath)) {
    return {
      command: process.execPath,
      args: [npmCliPath, 'run', 'dev', '-w', workspace],
      shell: false,
    };
  }

  if (process.platform === 'win32') {
    return {
      command: process.env.ComSpec || 'cmd.exe',
      args: ['/d', '/s', '/c', `npm run dev -w ${workspace}`],
      shell: false,
    };
  }

  return {
    command: 'npm',
    args: ['run', 'dev', '-w', workspace],
    shell: false,
  };
}

const serviceConfigs = [
  {
    workspace: 'services/api-gateway',
    fallbackName: 'api-gateway',
    fallbackPort: 4000,
  },
  {
    workspace: 'services/auth-service',
    fallbackName: 'auth-service',
    fallbackPort: 4100,
  },
  {
    workspace: 'services/store-service',
    fallbackName: 'store-service',
    fallbackPort: 4200,
  },
  {
    workspace: 'services/newsfeed-service',
    fallbackName: 'newsfeed-service',
    fallbackPort: 4300,
  },
  {
    workspace: 'services/app-service',
    fallbackName: 'app-service',
    fallbackPort: 4400,
  },
];

function parseEnvFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8');
    const entries = {};

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

const services = serviceConfigs.map((config) => {
  const envPath = path.join(rootDir, config.workspace, '.env');
  const envData = parseEnvFile(envPath);
  const parsedPort = Number.parseInt(envData.PORT ?? '', 10);

  return {
    ...config,
    envPath,
    name: envData.SERVICE_NAME || config.fallbackName,
    port: Number.isFinite(parsedPort) ? parsedPort : config.fallbackPort,
    process: null,
    ready: false,
    shouldRestart: false,
    trackedProcessId: Number.isFinite(persistedServiceState[config.workspace]?.pid)
      ? persistedServiceState[config.workspace].pid
      : null,
  };
});

const cliOptions = parseCliOptions(process.argv.slice(2));

function getServiceSelectors(service) {
  return new Set([
    normalizeServiceSelector(service.name),
    normalizeServiceSelector(service.fallbackName),
    normalizeServiceSelector(service.workspace),
    normalizeServiceSelector(String(service.port)),
  ]);
}

function applyRestartSelectors(selectors) {
  if (selectors.length === 0) {
    return;
  }

  if (selectors.includes('all')) {
    for (const service of services) {
      service.shouldRestart = true;
    }
    return;
  }

  const unresolvedSelectors = new Set(selectors);

  for (const service of services) {
    const serviceSelectors = getServiceSelectors(service);
    if (selectors.some((selector) => serviceSelectors.has(selector))) {
      service.shouldRestart = true;
      for (const selector of serviceSelectors) {
        unresolvedSelectors.delete(selector);
      }
    }
  }

  const unresolved = selectors.filter((selector) => unresolvedSelectors.has(selector));
  if (unresolved.length > 0) {
    console.error(`[dev] Unknown restart target(s): ${unresolved.join(', ')}.`);
    console.error(
      `[dev] Available targets: ${services
        .map((service) => `${service.fallbackName} (${service.workspace}, port ${service.port})`)
        .join('; ')}.`,
    );
    process.exit(1);
  }
}

applyRestartSelectors(cliOptions.restartSelectors);

const duplicatePorts = [];
const portToService = new Map();
for (const service of services) {
  if (portToService.has(service.port)) {
    duplicatePorts.push({
      port: service.port,
      first: portToService.get(service.port),
      second: service.name,
    });
  } else {
    portToService.set(service.port, service.name);
  }
}

if (duplicatePorts.length > 0) {
  console.error('[dev] Port conflict detected. Each service must use a unique port.');
  for (const conflict of duplicatePorts) {
    console.error(
      `[dev] ${conflict.first} and ${conflict.second} both configured for port ${conflict.port}.`,
    );
  }
  process.exit(1);
}

console.log('[dev] Starting all services...');
for (const service of services) {
  console.log(
    `[dev] ${service.name}: workspace=${service.workspace} port=${service.port} env=${path.relative(
      rootDir,
      service.envPath,
    )}`,
  );
}

let shuttingDown = false;
let activeChildren = 0;
let exitCode = 0;
let readyCount = 0;

function getErrorMessage(error) {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

function announceReady(service, runtimePort) {
  if (service.ready) {
    return;
  }

  service.ready = true;
  readyCount += 1;
  console.log(`[dev] ${service.name} is up on port ${runtimePort}.`);

  if (readyCount === services.length) {
    console.log('[dev] All services are up.');
  }
}

function isConnectionRefused(error) {
  return error?.code === 'ECONNREFUSED' || error?.code === 'EHOSTUNREACH';
}

function isPortInUse(port) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host: '127.0.0.1', port });

    socket.once('connect', () => {
      socket.end();
      resolve(true);
    });

    socket.once('error', (error) => {
      resolve(!isConnectionRefused(error));
    });

    socket.setTimeout(1500, () => {
      socket.destroy();
      resolve(true);
    });
  });
}

async function isHealthyService(port) {
  try {
    const response = await fetch(`http://127.0.0.1:${port}/health`, {
      signal: AbortSignal.timeout(1500),
    });

    if (!response.ok) {
      return false;
    }

    const payload = await response.json();
    return payload?.success === true && payload?.data?.status === 'ok';
  } catch {
    return false;
  }
}

function getListeningProcessIds(port) {
  if (process.platform === 'win32') {
    const output = execFileSync('netstat', ['-ano', '-p', 'tcp'], {
      cwd: rootDir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    const processIds = new Set();

    for (const rawLine of output.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line.startsWith('TCP')) {
        continue;
      }

      const segments = line.split(/\s+/);
      if (segments.length < 5) {
        continue;
      }

      const localAddress = segments[1];
      const state = segments[3];
      const pid = Number.parseInt(segments[4], 10);

      if (state !== 'LISTENING' || !localAddress.endsWith(`:${port}`) || !Number.isFinite(pid)) {
        continue;
      }

      processIds.add(pid);
    }

    return [...processIds];
  }

  try {
    const output = execFileSync('lsof', ['-nP', `-iTCP:${port}`, '-sTCP:LISTEN', '-t'], {
      cwd: rootDir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    return output
      .split(/\r?\n/)
      .map((value) => Number.parseInt(value.trim(), 10))
      .filter((pid) => Number.isFinite(pid));
  } catch (error) {
    if (error?.status === 1) {
      return [];
    }

    throw error;
  }
}

async function waitForPortToStopListening(port, timeoutMs = 7000) {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    if (!(await isPortInUse(port))) {
      return true;
    }

    await sleep(250);
  }

  return !(await isPortInUse(port));
}

async function stopServiceOnPort(service) {
  const processIds = new Set();

  if (Number.isFinite(service.trackedProcessId)) {
    processIds.add(service.trackedProcessId);
  }

  try {
    for (const pid of getListeningProcessIds(service.port)) {
      if (pid !== process.pid) {
        processIds.add(pid);
      }
    }
  } catch (error) {
    if (processIds.size === 0) {
      console.error(
        `[dev] Unable to inspect which process is listening on port ${service.port}: ${getErrorMessage(error)}.`,
      );
      console.error(
        `[dev] Stop ${service.name} manually and rerun this command, or run "npm run dev" after clearing port ${service.port}.`,
      );
      return false;
    }
  }

  if (processIds.size === 0) {
    return true;
  }

  console.log(
    `[dev] Restart requested for ${service.name}; stopping PID(s) ${[...processIds].join(', ')} on port ${service.port}.`,
  );

  for (const pid of processIds) {
    try {
      process.kill(pid, 'SIGTERM');
    } catch (error) {
      if (error?.code !== 'ESRCH') {
        console.error(`[dev] Failed to stop PID ${pid}: ${getErrorMessage(error)}.`);
        return false;
      }
    }
  }

  if (await waitForPortToStopListening(service.port)) {
    return true;
  }

  console.warn(`[dev] ${service.name} did not stop after SIGTERM; forcing exit.`);

  for (const pid of processIds) {
    try {
      process.kill(pid, 'SIGKILL');
    } catch (error) {
      if (error?.code !== 'ESRCH') {
        console.error(`[dev] Failed to force-stop PID ${pid}: ${getErrorMessage(error)}.`);
        return false;
      }
    }
  }

  return waitForPortToStopListening(service.port, 5000);
}

async function prepareServices() {
  const blockedServices = [];
  const servicesToStart = [];

  for (const service of services) {
    const portInUse = await isPortInUse(service.port);

    if (service.shouldRestart && portInUse) {
      const stopped = await stopServiceOnPort(service);

      if (!stopped) {
        console.error(`[dev] ${service.name} could not be restarted because port ${service.port} stayed busy.`);
        process.exit(1);
      }

      servicesToStart.push(service);
      continue;
    }

    if (!portInUse) {
      servicesToStart.push(service);
      continue;
    }

    const healthy = await isHealthyService(service.port);
    if (healthy) {
      console.log(
        `[dev] ${service.name} already running on port ${service.port}; reusing existing instance.`,
      );
      announceReady(service, service.port);
      continue;
    }

    blockedServices.push(service);
  }

  if (blockedServices.length > 0) {
    console.error('[dev] Port conflict detected. Stop the existing process or change the service port.');
    for (const service of blockedServices) {
      console.error(`[dev] ${service.name} cannot start because port ${service.port} is already in use.`);
    }
    process.exit(1);
  }

  return servicesToStart;
}

function handleLogLine(service, line, isError = false) {
  if (line.trim().length === 0) {
    return;
  }

  const stream = isError ? process.stderr : process.stdout;
  stream.write(`[${service.name}] ${line}\n`);

  if (!line.includes(' started')) {
    return;
  }

  if (!line.includes(service.name)) {
    return;
  }

  const portMatch = line.match(/"port":\s*(\d+)/);
  const runtimePort = portMatch ? Number.parseInt(portMatch[1], 10) : service.port;
  announceReady(service, runtimePort);
}

function stopAll(signal) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  console.log(`[dev] Shutting down all services (${signal}).`);

  for (const service of services) {
    if (service.process && !service.process.killed) {
      service.process.kill('SIGTERM');
    }
  }
}

function handleChildExit(service, code, signal) {
  activeChildren -= 1;
  const reason = signal ? `signal=${signal}` : `code=${code ?? 0}`;
  console.log(`[dev] ${service.name} exited (${reason}).`);

  if (!shuttingDown) {
    exitCode = code ?? 1;
    stopAll(`${service.name} exit`);
  }

  if (activeChildren === 0) {
    process.exit(exitCode);
  }
}

async function main() {
  const servicesToStart = await prepareServices();
  activeChildren = servicesToStart.length;

  if (servicesToStart.length === 0) {
    if (readyCount === services.length) {
      console.log('[dev] All services are already up.');
      console.log('[dev] This launcher exits after health checks and does not attach to existing services.');
      console.log('[dev] Use "npm run dev -- --restart=auth-service" to refresh auth, or "--restart" for all services.');
    }
    process.exit(0);
  }

  for (const service of servicesToStart) {
    let child;
    try {
      const workspaceDevCommand = getWorkspaceDevCommand(service.workspace);
      child = spawn(workspaceDevCommand.command, workspaceDevCommand.args, {
        cwd: rootDir,
        shell: workspaceDevCommand.shell,
        stdio: ['inherit', 'pipe', 'pipe'],
      });
    } catch (error) {
      exitCode = 1;
      process.stderr.write(
        `[dev] Failed to spawn ${service.name}: ${getErrorMessage(error)}\n`,
      );
      stopAll(`${service.name} spawn error`);
      process.exit(exitCode);
    }

    service.process = child;
    service.trackedProcessId = child.pid ?? null;
    setTrackedProcessId(service, service.trackedProcessId);

    const stdoutReader = readline.createInterface({ input: child.stdout });
    stdoutReader.on('line', (line) => {
      handleLogLine(service, line);
    });

    const stderrReader = readline.createInterface({ input: child.stderr });
    stderrReader.on('line', (line) => {
      handleLogLine(service, line, true);
    });

    child.on('error', (error) => {
      process.stderr.write(`[${service.name}] Failed to start: ${error.message}\n`);
    });

    child.on('exit', (code, signal) => {
      service.trackedProcessId = null;
      setTrackedProcessId(service, null);
      stdoutReader.close();
      stderrReader.close();
      handleChildExit(service, code, signal);
    });
  }

  process.on('SIGINT', () => {
    exitCode = 0;
    stopAll('SIGINT');
  });

  process.on('SIGTERM', () => {
    exitCode = 0;
    stopAll('SIGTERM');
  });
}

main().catch((error) => {
  process.stderr.write(`[dev] Failed to start services: ${getErrorMessage(error)}\n`);
  process.exit(1);
});
