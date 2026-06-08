import { Router } from 'express';
import { requireAuth } from '../../middleware/require-auth';
import { validate } from '../../middleware/validate';
import { asyncHandler } from '../../shared/async-handler';
import { parseEventImageUpload } from './event-image-upload.middleware';
import {
  createEventManagement,
  deleteEventManagement,
  getEventManagement,
  listEventManagement,
  updateEventManagement,
} from './event-management.controller';
import {
  createEventManagementBodySchema,
  eventManagementIdParamSchema,
  listEventManagementQuerySchema,
  updateEventManagementBodySchema,
} from './event-management.schemas';

const eventManagementRouter = Router();

eventManagementRouter.get('/', validate({ query: listEventManagementQuerySchema }), asyncHandler(listEventManagement));
eventManagementRouter.get('/:id', validate({ params: eventManagementIdParamSchema }), asyncHandler(getEventManagement));
eventManagementRouter.post(
  '/',
  requireAuth,
  asyncHandler(parseEventImageUpload),
  validate({ body: createEventManagementBodySchema }),
  asyncHandler(createEventManagement),
);
eventManagementRouter.patch(
  '/:id',
  requireAuth,
  asyncHandler(parseEventImageUpload),
  validate({ params: eventManagementIdParamSchema, body: updateEventManagementBodySchema }),
  asyncHandler(updateEventManagement),
);
eventManagementRouter.delete(
  '/:id',
  requireAuth,
  validate({ params: eventManagementIdParamSchema }),
  asyncHandler(deleteEventManagement),
);

export { eventManagementRouter };
