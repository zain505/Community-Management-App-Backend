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
export const CHAT_ATTACHMENT_IMAGE_MAX_SIZE_BYTES = 1 * 1024 * 1024;
export const CHAT_ATTACHMENT_AUDIO_MAX_SIZE_BYTES = 4 * 1024 * 1024;
export const CHAT_ATTACHMENT_AUDIO_MAX_DURATION_MS = 120_000;
export const CHAT_ATTACHMENT_UPLOAD_MAX_FILE_SIZE_BYTES = Math.max(
  CHAT_ATTACHMENT_IMAGE_MAX_SIZE_BYTES,
  CHAT_ATTACHMENT_AUDIO_MAX_SIZE_BYTES,
);
export const CHAT_ATTACHMENT_UPLOAD_EXPIRY_WINDOW_MS = 30 * 60 * 1000;

export const CHAT_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export const CHAT_AUDIO_MIME_TYPES = ['audio/m4a', 'audio/mp4', 'audio/webm'] as const;

const blockedLanguagePattern = new RegExp(
  `\\b(?:${BLOCKED_LANGUAGE_TERMS.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`,
  'i',
);

export function getChatRetentionCutoff(now = new Date()): Date {
  const cutoff = new Date(now);
  cutoff.setMonth(cutoff.getMonth() - 1);
  return cutoff;
}

export function getChatAttachmentExpiryDate(now = new Date()): Date {
  return new Date(now.getTime() + CHAT_ATTACHMENT_UPLOAD_EXPIRY_WINDOW_MS);
}

export function getExpiredChatAttachmentCutoff(now = new Date()): Date {
  return new Date(now.getTime() - CHAT_ATTACHMENT_UPLOAD_EXPIRY_WINDOW_MS);
}

export function hasBlockedLanguage(content: string): boolean {
  const normalizedContent = content
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  return blockedLanguagePattern.test(normalizedContent);
}
