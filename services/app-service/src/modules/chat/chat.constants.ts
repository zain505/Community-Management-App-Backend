const BLOCKED_LANGUAGE_TERMS = [
  'asshole',
  'bastard',
  'bitch',
  'damn',
  'dick',
  'fuck',
  'motherfucker',
  'pussy',
  'shit',
  'slut',
];

export const CHAT_MESSAGE_DEFAULT_LIMIT = 50;
export const CHAT_MESSAGE_MAX_LIMIT = 100;
export const CHAT_MESSAGE_CLEANUP_INTERVAL_MS = 60 * 60 * 1000;
export const CHAT_SOCKET_NAMESPACE = '/chat';

const blockedLanguagePattern = new RegExp(
  `\\b(?:${BLOCKED_LANGUAGE_TERMS.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`,
  'i',
);

export function getChatRetentionCutoff(now = new Date()): Date {
  const cutoff = new Date(now);
  cutoff.setMonth(cutoff.getMonth() - 1);
  return cutoff;
}

export function hasBlockedLanguage(content: string): boolean {
  const normalizedContent = content
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  return blockedLanguagePattern.test(normalizedContent);
}
