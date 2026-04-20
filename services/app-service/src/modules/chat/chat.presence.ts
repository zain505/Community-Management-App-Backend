import type { ChatPresence } from '@community/contracts';

const onlineConnectionsByUserId = new Map<string, Set<string>>();

function buildPresence(): ChatPresence {
  return {
    onlineMembers: onlineConnectionsByUserId.size,
  };
}

export function trackChatPresence(userId: string, connectionId: string): ChatPresence {
  const existingConnections = onlineConnectionsByUserId.get(userId) ?? new Set<string>();
  existingConnections.add(connectionId);
  onlineConnectionsByUserId.set(userId, existingConnections);
  return buildPresence();
}

export function untrackChatPresence(userId: string, connectionId: string): ChatPresence {
  const existingConnections = onlineConnectionsByUserId.get(userId);

  if (!existingConnections) {
    return buildPresence();
  }

  existingConnections.delete(connectionId);

  if (existingConnections.size === 0) {
    onlineConnectionsByUserId.delete(userId);
  }

  return buildPresence();
}

export function resetChatPresence(): void {
  onlineConnectionsByUserId.clear();
}
