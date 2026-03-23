import { app } from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { prisma } from './lib/prisma';
import { assertDatabaseConnection } from './modules/health/health.service';

async function bootstrap(): Promise<void> {
  await assertDatabaseConnection();

  const server = app.listen(env.PORT, () => {
    logger.info({ port: env.PORT }, `${env.SERVICE_NAME} started`);
  });
  server.once('error', async (error: NodeJS.ErrnoException) => {
    logger.error({ err: error, port: env.PORT }, 'Failed to listen on configured port');
    await prisma.$disconnect();
    process.exit(1);
  });

  const shutdown = async (signal: string): Promise<void> => {
    logger.info({ signal }, 'Shutting down server');
    server.close(async () => {
      await prisma.$disconnect();
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

bootstrap().catch(async (error) => {
  logger.error({ err: error }, 'Failed to bootstrap service');
  await prisma.$disconnect();
  process.exit(1);
});
