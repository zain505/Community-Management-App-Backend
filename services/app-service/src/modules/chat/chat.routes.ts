import { Router } from 'express';
import { requireAuth } from '../../middleware/require-auth';
import { asyncHandler } from '../../shared/async-handler';
import { validate } from '../../middleware/validate';
import {
  createChatMessage,
  deleteChatMessage,
  listChatMessages,
  updateChatMessage,
} from './chat.controller';
import {
  chatMessageIdParamSchema,
  createChatMessageBodySchema,
  listChatMessagesQuerySchema,
  updateChatMessageBodySchema,
} from './chat.schemas';

const chatRouter = Router();

chatRouter.get(
  '/messages',
  requireAuth,
  validate({ query: listChatMessagesQuerySchema }),
  asyncHandler(listChatMessages),
);
chatRouter.post(
  '/messages',
  requireAuth,
  validate({ body: createChatMessageBodySchema }),
  asyncHandler(createChatMessage),
);
chatRouter.patch(
  '/messages/:id',
  requireAuth,
  validate({ params: chatMessageIdParamSchema, body: updateChatMessageBodySchema }),
  asyncHandler(updateChatMessage),
);
chatRouter.delete(
  '/messages/:id',
  requireAuth,
  validate({ params: chatMessageIdParamSchema }),
  asyncHandler(deleteChatMessage),
);

export { chatRouter };
