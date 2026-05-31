import type {
  ChatMessageListQuery,
  CreateChatMessageRequest,
  UpdateChatMessageRequest,
} from '@community/contracts';
import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendSuccess } from '../../lib/http';
import { AppError } from '../../shared/app-error';
import { chatService } from './chat.service';

function getAuthenticatedUserId(req: Request): string {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError('Access token is required', {
      statusCode: StatusCodes.UNAUTHORIZED,
      code: 'UNAUTHORIZED',
    });
  }

  return userId;
}

function getChatMessageId(req: Request): string {
  return (req.params as { id: string }).id;
}

export async function listChatMessages(req: Request, res: Response): Promise<void> {
  const query = req.query as ChatMessageListQuery;
  const messages = await chatService.listMessages({
    before: query.before,
    limit: query.limit,
  });
  sendSuccess(res, StatusCodes.OK, messages);
}

export async function createChatMessage(req: Request, res: Response): Promise<void> {
  const message = await chatService.createMessage(
    getAuthenticatedUserId(req),
    req.body as CreateChatMessageRequest,
  );
  sendSuccess(res, StatusCodes.CREATED, message);
}

export async function uploadChatAttachment(req: Request, res: Response): Promise<void> {
  if (!req.uploadedChatAttachment) {
    throw new AppError('Attachment file is required', {
      statusCode: StatusCodes.BAD_REQUEST,
      code: 'VALIDATION_ERROR',
    });
  }

  const attachment = await chatService.uploadAttachment(
    getAuthenticatedUserId(req),
    req.uploadedChatAttachment,
  );
  sendSuccess(res, StatusCodes.CREATED, attachment);
}

export async function updateChatMessage(req: Request, res: Response): Promise<void> {
  const message = await chatService.updateMessage(
    getAuthenticatedUserId(req),
    getChatMessageId(req),
    req.body as UpdateChatMessageRequest,
  );
  sendSuccess(res, StatusCodes.OK, message);
}

export async function deleteChatMessage(req: Request, res: Response): Promise<void> {
  const deletedMessage = await chatService.deleteMessage(getAuthenticatedUserId(req), getChatMessageId(req));
  sendSuccess(res, StatusCodes.OK, deletedMessage);
}
