const path = require('node:path');

const rootDir = __dirname;
const registerWorkspaceRuntimeAliases = '../../scripts/register-workspace-runtime-aliases.js';

function createServiceApp(name, relativeServiceDir, port, extraEnv = {}) {
  const serviceDir = path.join(rootDir, relativeServiceDir);

  return {
    name,
    cwd: serviceDir,
    // PM2 should run the compiled service entrypoint from dist in production.
    script: 'dist/server.js',
    interpreter: process.execPath,
    node_args: `-r ${registerWorkspaceRuntimeAliases}`,
    exec_mode: 'fork',
    instances: 1,
    autorestart: true,
    watch: false,
    env: {
      NODE_ENV: 'production',
      SERVICE_NAME: name,
      // PORT stays configurable per process so Nginx can proxy only the gateway.
      PORT: String(port),
      ...extraEnv,
    },
  };
}

module.exports = {
  apps: [
    createServiceApp('api-gateway', 'services/api-gateway', 4000, {
      // The gateway talks to the private services over loopback on the same VPS.
      TRUST_PROXY: process.env.TRUST_PROXY || '1',
      AUTH_SERVICE_URL: 'http://127.0.0.1:4100',
      STORE_SERVICE_URL: 'http://127.0.0.1:4200',
      NEWSFEED_SERVICE_URL: 'http://127.0.0.1:4300',
      APP_SERVICE_URL: 'http://127.0.0.1:4400',
    }),
    createServiceApp('auth-service', 'services/auth-service', 4100),
    createServiceApp('store-service', 'services/store-service', 4200, {
      AUTH_SERVICE_BASE_URL: 'http://127.0.0.1:4100',
      NEWSFEED_SERVICE_BASE_URL: 'http://127.0.0.1:4300',
    }),
    createServiceApp('newsfeed-service', 'services/newsfeed-service', 4300, {
      AUTH_SERVICE_BASE_URL: 'http://127.0.0.1:4100',
      STORE_SERVICE_BASE_URL: 'http://127.0.0.1:4200',
    }),
    createServiceApp('app-service', 'services/app-service', 4400, {
      AUTH_SERVICE_BASE_URL: 'http://127.0.0.1:4100',
      NEWSFEED_SERVICE_BASE_URL: 'http://127.0.0.1:4300',
    }),
  ],
};
