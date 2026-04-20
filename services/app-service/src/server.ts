import http from 'node:http';
import { app } from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { prisma } from './lib/prisma';
import { startChatRetentionScheduler } from './modules/chat/chat.retention';
import { CHAT_SOCKET_NAMESPACE } from './modules/chat/chat.constants';
import { setupChatSocketServer } from './modules/chat/chat.socket';
import { assertDatabaseConnection } from './modules/health/health.service';

async function bootstrap(): Promise<void> {
  await assertDatabaseConnection();
  const stopChatRetentionScheduler = startChatRetentionScheduler();
  const server = http.createServer(app);
  const chatSocketServer = setupChatSocketServer(server);

  server.listen(env.PORT, () => {
    logger.info({ port: env.PORT }, `${env.SERVICE_NAME} started`);
    console.log(`[CHAT_SOCKET_READY] Socket.IO listening at http://localhost:${env.PORT}${CHAT_SOCKET_NAMESPACE}`);
  });

  server.once('error', async (error: NodeJS.ErrnoException) => {
    logger.error({ err: error, port: env.PORT }, 'Failed to listen on configured port');
    stopChatRetentionScheduler();
    await chatSocketServer.close();
    await prisma.$disconnect();
    process.exit(1);
  });

  const shutdown = async (signal: string): Promise<void> => {
    logger.info({ signal }, 'Shutting down server');
    stopChatRetentionScheduler();
    await chatSocketServer.close();
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
