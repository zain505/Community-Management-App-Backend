const { spawn } = require('node:child_process');

const isWindows = process.platform === 'win32';
const childEnv = {
  ...process.env,
  APP_ENV: 'production',
  NODE_ENV: process.env.NODE_ENV || 'production',
};

function getNpmRunArgs(scriptName) {
  if (isWindows) {
    return {
      command: 'cmd.exe',
      args: ['/d', '/s', '/c', `npm run ${scriptName}`],
    };
  }

  return {
    command: 'npm',
    args: ['run', scriptName],
  };
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      env: childEnv,
      stdio: 'inherit',
      shell: false,
    });

    child.on('error', reject);
    child.on('exit', (code, signal) => {
      if (signal) {
        reject(new Error(`${command} ${args.join(' ')} exited with signal ${signal}`));
        return;
      }

      if (code !== 0) {
        reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
        return;
      }

      resolve();
    });
  });
}

async function main() {
  const npmRunPrismaDeploy = getNpmRunArgs('prisma:deploy');
  await run(npmRunPrismaDeploy.command, npmRunPrismaDeploy.args);
  await run(process.execPath, ['./scripts/production-services.js']);
}

main().catch((error) => {
  console.error(`[production] ${error.message}`);
  process.exit(1);
});
