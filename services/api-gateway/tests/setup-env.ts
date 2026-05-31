const mysqlPort = process.env.MYSQL_PORT ?? '3306';

process.env.NODE_ENV = 'test';
process.env.PORT = '4000';
process.env.LOG_LEVEL = 'info';
process.env.CORS_ORIGINS = [
  'http://hzhtechco.site',
  'https://hzhtechco.site',
  'http://www.hzhtechco.site',
  'https://www.hzhtechco.site',
  'capacitor://localhost',
  'ionic://localhost',
  'http://localhost',
  'https://localhost',
  'http://localhost:3000',
  'http://localhost:5173',
].join(',');
process.env.DATABASE_URL = `mysql://root:root@127.0.0.1:${mysqlPort}/auth_db`;
process.env.JWT_ACCESS_SECRET = '12345678901234567890123456789012';
process.env.JWT_REFRESH_SECRET = '12345678901234567890123456789012';
process.env.JWT_ACCESS_TTL = '15m';
process.env.JWT_REFRESH_TTL = '7d';
process.env.BCRYPT_SALT_ROUNDS = '8';
process.env.RATE_LIMIT_WINDOW_MS = '60000';
process.env.RATE_LIMIT_MAX = '100';
process.env.LOGIN_RATE_LIMIT_MAX = '10';
process.env.AUTH_SERVICE_URL = 'http://127.0.0.1:59997';
process.env.STORE_SERVICE_URL = 'http://127.0.0.1:59999';
process.env.STORE_SERVICE_TIMEOUT_MS = '200';
process.env.NEWSFEED_SERVICE_URL = 'http://127.0.0.1:59998';
process.env.APP_SERVICE_URL = 'http://127.0.0.1:59996';
process.env.PROXY_TIMEOUT_MS = '200';
