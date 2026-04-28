const { execFileSync } = require('node:child_process');

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function runScript(scriptName) {
  execFileSync(npmCommand, ['run', scriptName], {
    cwd: process.cwd(),
    stdio: 'inherit',
  });
}

runScript('contracts:build');
runScript('prisma:generate');
