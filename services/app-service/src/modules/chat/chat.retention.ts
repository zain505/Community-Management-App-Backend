import { logger } from '../../config/logger';
import { CHAT_MESSAGE_CLEANUP_INTERVAL_MS } from './chat.constants';
import { chatService } from './chat.service';

function logCleanupError(error: unknown): void {
  logger.error({ err: error }, 'Failed to cleanup expired chat messages');
}

export function startChatRetentionScheduler(): () => void {
  void chatService.cleanupExpiredMessages(true).catch(logCleanupError);

  const interval = setInterval(() => {
    void chatService.cleanupExpiredMessages(true).catch(logCleanupError);
  }, CHAT_MESSAGE_CLEANUP_INTERVAL_MS);

  if (typeof interval.unref === 'function') {
    interval.unref();
  }

  return () => {
    clearInterval(interval);
  };
}
