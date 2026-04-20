export interface ChatMessage {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChatMessageRequest {
  content: string;
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
