import { app } from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { prisma } from './lib/prisma';
import { connectRedis, disconnectRedis } from './lib/redis';
import { assertDatabaseConnection } from './modules/health/health.service';

async function bootstrap(): Promise<void> {
  // env.PORT resolves process.env.PORT first, with the schema default as a local fallback.
  const PORT = env.PORT;
  const HOST = '0.0.0.0';
  await assertDatabaseConnection();
  await connectRedis();

  const server = app.listen(PORT, HOST, () => {
    logger.info({ host: HOST, port: PORT }, `${env.SERVICE_NAME} started`);
  });
  server.once('error', async (error: NodeJS.ErrnoException) => {
    logger.error({ err: error, host: HOST, port: PORT }, 'Failed to listen on configured port');
    await disconnectRedis();
    await prisma.$disconnect();
    process.exit(1);
  });

  const shutdown = async (signal: string): Promise<void> => {
    logger.info({ signal }, 'Shutting down server');
    server.close(async () => {
      await disconnectRedis();
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
  await disconnectRedis();
  await prisma.$disconnect();
  process.exit(1);
});
