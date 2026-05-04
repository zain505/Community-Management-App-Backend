const { spawnSync } = require('node:child_process');

function resolveNpmInvocation() {
  const npmExecPath = process.env.npm_execpath;

  if (typeof npmExecPath === 'string' && npmExecPath.trim() !== '') {
    return {
      command: process.execPath,
      argsPrefix: [npmExecPath],
      shell: false,
    };
  }

  if (process.platform === 'win32') {
    return {
      command: 'npm.cmd',
      argsPrefix: [],
      shell: true,
    };
  }

  return {
    command: 'npm',
    argsPrefix: [],
    shell: false,
  };
}

const npmInvocation = resolveNpmInvocation();

function runScript(scriptName) {
  const result = spawnSync(
    npmInvocation.command,
    [...npmInvocation.argsPrefix, 'run', scriptName],
    {
      cwd: process.cwd(),
      env: process.env,
      shell: npmInvocation.shell,
      stdio: 'inherit',
    },
  );

  if (result.error) {
    throw result.error;
  }

  if (typeof result.status === 'number' && result.status !== 0) {
    process.exit(result.status);
  }

  if (result.signal) {
    process.kill(process.pid, result.signal);
  }
}

runScript('contracts:build');
runScript('prisma:generate');
runScript('build');
