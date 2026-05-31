import { Router } from 'express';
import { requireAuth } from '../../middleware/require-auth';
import { asyncHandler } from '../../shared/async-handler';
import { validate } from '../../middleware/validate';
import {
  createChatMessage,
  deleteChatMessage,
  downloadChatAttachment,
  listChatMessages,
  uploadChatAttachment,
  updateChatMessage,
} from './chat.controller';
import { parseChatAttachmentUpload } from './chat-attachment-upload.middleware';
import {
  chatMessageIdParamSchema,
  createChatMessageBodySchema,
  listChatMessagesQuerySchema,
  updateChatMessageBodySchema,
} from './chat.schemas';

const chatRouter = Router();

chatRouter.post(
  '/attachments',
  requireAuth,
  asyncHandler(parseChatAttachmentUpload),
  asyncHandler(uploadChatAttachment),
);
chatRouter.get(
  '/attachments/:id/download',
  requireAuth,
  validate({ params: chatMessageIdParamSchema }),
  asyncHandler(downloadChatAttachment),
);
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
