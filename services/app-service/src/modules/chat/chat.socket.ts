import type {
  ChatConnectionSnapshot,
  ChatMessage,
  ChatMessageDeleted,
  ChatPresence,
  ChatRealtimeDeleteRequest,
  ChatRealtimeError,
  ChatRealtimeUpdateRequest,
  CreateChatMessageRequest,
} from '@community/contracts';
import type { Server as HttpServer } from 'http';
import { Server as SocketIOServer, type Socket } from 'socket.io';
import { StatusCodes } from 'http-status-codes';
import { isAllowedCorsOrigin } from '../../config/env';
import { logger } from '../../config/logger';
import { verifyAccessTokenOrThrowAppError } from '../../lib/token';
import { AppError } from '../../shared/app-error';
import { authClient } from '../auth/auth-client';
import { CHAT_MESSAGE_DEFAULT_LIMIT, CHAT_SOCKET_NAMESPACE } from './chat.constants';
import {
  createChatMessageSocketSchema,
  deleteChatMessageSocketSchema,
  updateChatMessageSocketSchema,
} from './chat.schemas';
import { trackChatPresence, resetChatPresence, untrackChatPresence } from './chat.presence';
import { chatService } from './chat.service';

interface ServerToClientEvents {
  'chat:connected': (payload: ChatConnectionSnapshot) => void;
  'chat:error': (payload: ChatRealtimeError) => void;
  'chat:message:created': (payload: ChatMessage) => void;
  'chat:message:deleted': (payload: ChatMessageDeleted) => void;
  'chat:message:updated': (payload: ChatMessage) => void;
  'chat:presence': (payload: ChatPresence) => void;
}

interface ClientToServerEvents {
  'chat:message:create': (payload: CreateChatMessageRequest) => void;
  'chat:message:delete': (payload: ChatRealtimeDeleteRequest) => void;
  'chat:message:update': (payload: ChatRealtimeUpdateRequest) => void;
}

interface SocketData {
  userId: string;
  userName: string;
  presenceTracked: boolean;
}

type ChatSocket = Socket<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>;
type ChatNamespace = ReturnType<SocketIOServer<ClientToServerEvents, ServerToClientEvents>['of']>;
type ChatBootstrapSocket = Pick<ChatSocket, 'connected' | 'emit' | 'id'> & {
  data: Pick<SocketData, 'presenceTracked' | 'userId'>;
};

function extractBearerToken(authorization?: string): string | null {
  if (!authorization) {
    return null;
  }

  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}

function resolveSocketAccessToken(socket: ChatSocket): string | null {
  const authToken = socket.handshake.auth?.token;

  if (typeof authToken === 'string' && authToken.trim().length > 0) {
    return authToken.trim();
  }

  const headerToken = extractBearerToken(
    typeof socket.handshake.headers.authorization === 'string'
      ? socket.handshake.headers.authorization
      : undefined,
  );

  if (headerToken) {
    return headerToken;
  }

  const queryToken = socket.handshake.query.token;

  if (typeof queryToken === 'string' && queryToken.trim().length > 0) {
    return queryToken.trim();
  }

  return null;
}

function toSocketError(error: unknown): ChatRealtimeError {
  if (error instanceof AppError) {
    return {
      code: error.code,
      message: error.message,
    };
  }

  return {
    code: 'INTERNAL_ERROR',
    message: 'Something went wrong',
  };
}

async function authenticateSocket(socket: ChatSocket): Promise<void> {
  const accessToken = resolveSocketAccessToken(socket);

  if (!accessToken) {
    throw new AppError('Access token is required', {
      statusCode: StatusCodes.UNAUTHORIZED,
      code: 'UNAUTHORIZED',
    });
  }

  const payload = verifyAccessTokenOrThrowAppError(accessToken);
  const userId = payload.sub;

  if (typeof userId !== 'string') {
    throw new AppError('Access token is invalid', {
      statusCode: StatusCodes.UNAUTHORIZED,
      code: 'INVALID_ACCESS_TOKEN',
    });
  }

  const user = await authClient.getUserStatus(userId);

  if (!user || !user.isActive) {
    throw new AppError('User is not active', {
      statusCode: StatusCodes.UNAUTHORIZED,
      code: 'USER_INACTIVE',
    });
  }

  socket.data.userId = user.id;
  socket.data.userName = user.name;
  socket.data.presenceTracked = false;
}

export async function bootstrapChatConnection(
  socket: ChatBootstrapSocket,
  chatNamespace: Pick<ChatNamespace, 'emit'>,
): Promise<boolean> {
  const messages = await chatService.listMessages({ limit: CHAT_MESSAGE_DEFAULT_LIMIT });

  if (!socket.connected) {
    return false;
  }

  const presence = trackChatPresence(socket.data.userId, socket.id);
  socket.data.presenceTracked = true;
  chatNamespace.emit('chat:presence', presence);
  socket.emit('chat:connected', {
    messages,
    onlineMembers: presence.onlineMembers,
  });

  return true;
}

export function setupChatSocketServer(server: HttpServer): { close: () => Promise<void> } {
  const io = new SocketIOServer<ClientToServerEvents, ServerToClientEvents>(server, {
    cors: {
      credentials: true,
      origin(origin, callback) {
        if (isAllowedCorsOrigin(origin)) {
          callback(null, true);
          return;
        }

        logger.warn(
          { origin, namespace: CHAT_SOCKET_NAMESPACE },
          'Rejected chat socket origin during handshake',
        );
        callback(new Error('Origin is not allowed by CORS'));
      },
    },
  });

  const chatNamespace = io.of(CHAT_SOCKET_NAMESPACE);

  chatNamespace.use((socket, next) => {
    void authenticateSocket(socket)
      .then(() => next())
      .catch((error) => {
        const authError = toSocketError(error);
        logger.warn(
          {
            code: authError.code,
            message: authError.message,
            socketId: socket.id,
          },
          'Rejected chat socket connection during authentication',
        );
        const connectError = new Error(authError.message) as Error & { data?: ChatRealtimeError };
        connectError.data = authError;
        next(connectError);
      });
  });

  chatNamespace.on('connection', (socket) => {
    void bootstrapChatConnection(socket, chatNamespace)
      .then((isReady) => {
        if (!isReady) {
          return;
        }

        socket.on('chat:message:create', (payload) => {
          const parsedPayload = createChatMessageSocketSchema.safeParse(payload);

          if (!parsedPayload.success) {
            socket.emit('chat:error', {
              code: 'VALIDATION_ERROR',
              message: 'Invalid chat message payload',
            });
            return;
          }

          void chatService
            .createMessage(socket.data.userId, parsedPayload.data)
            .then((message) => {
              chatNamespace.emit('chat:message:created', message);
            })
            .catch((error) => {
              socket.emit('chat:error', toSocketError(error));
            });
        });

        socket.on('chat:message:update', (payload) => {
          const parsedPayload = updateChatMessageSocketSchema.safeParse(payload);

          if (!parsedPayload.success) {
            socket.emit('chat:error', {
              code: 'VALIDATION_ERROR',
              message: 'Invalid chat update payload',
            });
            return;
          }

          void chatService
            .updateMessage(socket.data.userId, parsedPayload.data.messageId, {
              content: parsedPayload.data.content,
            })
            .then((message) => {
              chatNamespace.emit('chat:message:updated', message);
            })
            .catch((error) => {
              socket.emit('chat:error', toSocketError(error));
            });
        });

        socket.on('chat:message:delete', (payload) => {
          const parsedPayload = deleteChatMessageSocketSchema.safeParse(payload);

          if (!parsedPayload.success) {
            socket.emit('chat:error', {
              code: 'VALIDATION_ERROR',
              message: 'Invalid chat delete payload',
            });
            return;
          }

          void chatService
            .deleteMessage(socket.data.userId, parsedPayload.data.messageId)
            .then((deletedMessage) => {
              chatNamespace.emit('chat:message:deleted', deletedMessage);
            })
            .catch((error) => {
              socket.emit('chat:error', toSocketError(error));
            });
        });
      })
      .catch((error) => {
        logger.error({ err: error, userId: socket.data.userId }, 'Failed to load chat snapshot');
        socket.emit('chat:error', toSocketError(error));
        socket.disconnect(true);
      });

    socket.on('disconnect', () => {
      if (!socket.data.presenceTracked) {
        return;
      }

      socket.data.presenceTracked = false;
      const nextPresence = untrackChatPresence(socket.data.userId, socket.id);
      chatNamespace.emit('chat:presence', nextPresence);
    });
  });

  return {
    close: async () => {
      resetChatPresence();
      await new Promise<void>((resolve) => {
        io.close(() => {
          resolve();
        });
      });
    },
  };
}
