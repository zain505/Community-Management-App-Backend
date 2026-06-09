const { existsSync } = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const rootDir = path.resolve(__dirname, '..');

function resolveNpmInvocation(args) {
  if (process.env.npm_execpath) {
    return {
      command: process.execPath,
      args: [process.env.npm_execpath, ...args],
    };
  }

  return {
    command: process.platform === 'win32' ? 'npm.cmd' : 'npm',
    args,
  };
}

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: rootDir,
    stdio: 'inherit',
    shell: false,
  });

  if (result.error) {
    console.error(`[postinstall] Failed to run ${command} ${args.join(' ')}:`, result.error.message);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run(process.execPath, [path.join(rootDir, 'scripts', 'setup-service-envs.mjs')]);

const contractsPackage = path.join(rootDir, 'packages', 'contracts', 'package.json');
if (existsSync(contractsPackage)) {
  const npm = resolveNpmInvocation(['run', 'build', '-w', 'packages/contracts']);
  run(npm.command, npm.args);
} else {
  console.warn('[postinstall] Skipping contracts build because packages/contracts is missing.');
}
