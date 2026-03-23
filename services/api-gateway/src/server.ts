import { app } from './app';
import { env } from './config/env';
import { logger } from './config/logger';

async function bootstrap(): Promise<void> {
  const server = app.listen(env.PORT, () => {
    logger.info({ port: env.PORT }, `${env.SERVICE_NAME} started`);
  });
  server.once('error', (error: NodeJS.ErrnoException) => {
    logger.error({ err: error, port: env.PORT }, 'Failed to listen on configured port');
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
