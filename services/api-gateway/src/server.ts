import http from 'node:http';
import { app } from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { attachSocketIoUpgradeProxy } from './modules/proxy/socket-io-proxy';

async function bootstrap(): Promise<void> {
  // env.PORT resolves process.env.PORT first, with the schema default as a local fallback.
  const PORT = env.PORT;
  const HOST = '0.0.0.0';
  const server = http.createServer(app);
  attachSocketIoUpgradeProxy(server);

  server.listen(PORT, HOST, () => {
    logger.info({ host: HOST, port: PORT }, `${env.SERVICE_NAME} started`);
  });
  server.once('error', (error: NodeJS.ErrnoException) => {
    logger.error({ err: error, host: HOST, port: PORT }, 'Failed to listen on configured port');
    process.exit(1);
  });

  const shutdown = async (signal: string): Promise<void> => {
    logger.info({ signal }, 'Shutting down server');
    server.close(() => {
      process.exit(0);
    });
  };

  process.on('SIGINT', () => {
    void shutdown('SIGINT');
  });
  process.on('SIGTERM', () => {
    void shutdown('SIGTERM');
  });
}

bootstrap().catch((error) => {
  logger.error({ err: error }, 'Failed to bootstrap service');
  process.exit(1);
});
