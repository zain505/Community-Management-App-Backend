const path = require('node:path');
const fs = require('node:fs');
const dotenv = require('dotenv');

const rootDir = __dirname;
const registerWorkspaceRuntimeAliases = '../../scripts/register-workspace-runtime-aliases.js';
const rootEnvironment = (process.env.APP_ENV || process.env.NODE_ENV || 'production')
  .trim()
  .toLowerCase();
const rootEnvPath = path.join(
  rootDir,
  `.env.${rootEnvironment === 'development' ? 'development' : 'production'}`,
);

if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
}

function getFirstEnvValue(...keys) {
  for (const key of keys) {
    const value = process.env[key];
    if (typeof value === 'string' && value.trim() !== '') {
      return value;
    }
  }

  return undefined;
}

function getEnvPort(key, fallbackPort) {
  const parsedPort = Number.parseInt(process.env[key] || '', 10);
  return Number.isFinite(parsedPort) ? parsedPort : fallbackPort;
}

const apiGatewayPort = getEnvPort('API_GATEWAY_PORT', 4000);
const authServicePort = getEnvPort('AUTH_SERVICE_PORT', 4100);
const storeServicePort = getEnvPort('STORE_SERVICE_PORT', 4200);
const newsfeedServicePort = getEnvPort('NEWSFEED_SERVICE_PORT', 4300);
const appServicePort = getEnvPort('APP_SERVICE_PORT', 4400);

function createServiceApp(name, relativeServiceDir, port, extraEnv = {}, databaseUrlKeys = []) {
  const serviceDir = path.join(rootDir, relativeServiceDir);
  const databaseUrl = getFirstEnvValue(...databaseUrlKeys);

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
      PUBLIC_BASE_URL: process.env.PUBLIC_BASE_URL || 'https://hzhtechco.site',
      ...extraEnv,
      ...(databaseUrl ? { DATABASE_URL: databaseUrl } : {}),
    },
  };
}

module.exports = {
  apps: [
    createServiceApp(
      'api-gateway',
      'services/api-gateway',
      apiGatewayPort,
      {
        // The gateway talks to the private services over loopback on the same VPS.
        TRUST_PROXY: process.env.TRUST_PROXY || '1',
        AUTH_SERVICE_URL: `http://127.0.0.1:${authServicePort}`,
        STORE_SERVICE_URL: `http://127.0.0.1:${storeServicePort}`,
        NEWSFEED_SERVICE_URL: `http://127.0.0.1:${newsfeedServicePort}`,
        APP_SERVICE_URL: `http://127.0.0.1:${appServicePort}`,
      },
      [
        'API_GATEWAY_DATABASE_URL',
        'GATEWAY_DATABASE_URL',
        'AUTH_SERVICE_DATABASE_URL',
        'AUTH_DATABASE_URL',
      ],
    ),
    createServiceApp('auth-service', 'services/auth-service', authServicePort, {}, [
      'AUTH_SERVICE_DATABASE_URL',
      'AUTH_DATABASE_URL',
    ]),
    createServiceApp(
      'store-service',
      'services/store-service',
      storeServicePort,
      {
        AUTH_SERVICE_BASE_URL: `http://127.0.0.1:${authServicePort}`,
        NEWSFEED_SERVICE_BASE_URL: `http://127.0.0.1:${newsfeedServicePort}`,
        REDIS_ENABLED: process.env.REDIS_ENABLED || 'false',
        REDIS_URL: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
      },
      ['STORE_SERVICE_DATABASE_URL', 'STORE_DATABASE_URL'],
    ),
    createServiceApp(
      'newsfeed-service',
      'services/newsfeed-service',
      newsfeedServicePort,
      {
        AUTH_SERVICE_BASE_URL: `http://127.0.0.1:${authServicePort}`,
        STORE_SERVICE_BASE_URL: `http://127.0.0.1:${storeServicePort}`,
        REDIS_ENABLED: process.env.REDIS_ENABLED || 'false',
        REDIS_URL: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
      },
      ['NEWSFEED_SERVICE_DATABASE_URL', 'NEWSFEED_DATABASE_URL'],
    ),
    createServiceApp(
      'app-service',
      'services/app-service',
      appServicePort,
      {
        AUTH_SERVICE_BASE_URL: `http://127.0.0.1:${authServicePort}`,
        NEWSFEED_SERVICE_BASE_URL: `http://127.0.0.1:${newsfeedServicePort}`,
      },
      ['APP_SERVICE_DATABASE_URL', 'APP_DATABASE_URL'],
    ),
  ],
};
