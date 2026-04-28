const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

function getCandidateRoots() {
  const candidates = new Set();

  function addCandidate(dir) {
    if (!dir) {
      return;
    }

    candidates.add(path.resolve(dir));
  }

  if (process.env.npm_package_json) {
    addCandidate(path.dirname(process.env.npm_package_json));
  }

  addCandidate(process.env.INIT_CWD);
  addCandidate(process.env.PWD);
  addCandidate(process.cwd());

  const normalizedCwd = (process.cwd() || '').replace(/\\/g, '/');
  const marker = '/nodevenv/';
  const markerIndex = normalizedCwd.indexOf(marker);

  if (markerIndex !== -1) {
    const prefix = normalizedCwd.slice(0, markerIndex);
    const suffix = normalizedCwd.slice(markerIndex + marker.length).split('/').filter(Boolean);

    if (suffix.length >= 3 && /^\d+$/.test(suffix[suffix.length - 2]) && suffix[suffix.length - 1] === 'lib') {
      addCandidate(path.join(prefix, ...suffix.slice(0, -2)));
    }
  }

  return [...candidates];
}

function isWorkspaceRoot(dir) {
  try {
    const packageJsonPath = path.join(dir, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    return Array.isArray(packageJson.workspaces) && fs.existsSync(path.join(dir, 'scripts', 'postinstall-runner.js'));
  } catch {
    return false;
  }
}

const rootDir = getCandidateRoots().find(isWorkspaceRoot);

if (!rootDir) {
  console.error('[postinstall] Unable to resolve project root for workspace install.');
  process.exit(1);
}

execFileSync(process.execPath, [path.join(rootDir, 'scripts', 'postinstall-runner.js')], {
  cwd: rootDir,
  stdio: 'inherit',
});
