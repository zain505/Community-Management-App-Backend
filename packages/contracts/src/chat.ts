export type ChatMessageType = 'text' | 'image' | 'audio';

export type ChatAttachmentType = Extract<ChatMessageType, 'image' | 'audio'>;

export interface ChatAttachment {
  id: string;
  type: ChatAttachmentType;
  url: string;
  downloadUrl?: string;
  mimeType: string;
  fileName: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  durationMillis: number | null;
}

export interface ChatMessage {
  id: string;
  type: ChatMessageType;
  content: string;
  attachments: ChatAttachment[];
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChatMessageRequest {
  content: string;
  type: ChatMessageType;
  attachments?: ChatAttachment[];
}

export interface UpdateChatMessageRequest {
  content: string;
}

export interface ChatMessageListQuery {
  before?: string;
  limit?: number;
}

export interface ChatPresence {
  onlineMembers: number;
}

export interface ChatConnectionSnapshot {
  messages: ChatMessage[];
  onlineMembers: number;
}

export interface ChatMessageDeleted {
  id: string;
  deletedAt: string;
}

export interface ChatRealtimeError {
  code: string;
  message: string;
}

export interface ChatRealtimeUpdateRequest extends UpdateChatMessageRequest {
  messageId: string;
}

export interface ChatRealtimeDeleteRequest {
  messageId: string;
}
