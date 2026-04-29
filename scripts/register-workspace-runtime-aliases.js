const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');

const rootDir = path.resolve(__dirname, '..');
const contractsDistEntryPath = path.join(rootDir, 'packages', 'contracts', 'dist', 'index.js');
const contractsSourceEntryPath = path.join(rootDir, 'packages', 'contracts', 'src', 'index.ts');
const contractsRuntimeEntryPath = fs.existsSync(contractsDistEntryPath)
  ? contractsDistEntryPath
  : contractsSourceEntryPath;
const originalResolveFilename = Module._resolveFilename;

Module._resolveFilename = function resolveWorkspaceRuntimeAlias(request, parent, isMain, options) {
  if (request === '@community/contracts') {
    return contractsRuntimeEntryPath;
  }

  return originalResolveFilename.call(this, request, parent, isMain, options);
};
