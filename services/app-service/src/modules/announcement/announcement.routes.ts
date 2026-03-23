import { Router } from 'express';
import { requireAuth } from '../../middleware/require-auth';
import { asyncHandler } from '../../shared/async-handler';
import { validate } from '../../middleware/validate';
import {
  announcementIdParamSchema,
  createAnnouncementBodySchema,
  listAnnouncementsQuerySchema,
  updateAnnouncementBodySchema,
} from './announcement.schemas';
import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncement,
  listAnnouncements,
  updateAnnouncement,
} from './announcement.controller';

const announcementRouter = Router();

announcementRouter.get('/', validate({ query: listAnnouncementsQuerySchema }), asyncHandler(listAnnouncements));
announcementRouter.get('/:id', validate({ params: announcementIdParamSchema }), asyncHandler(getAnnouncement));
announcementRouter.post(
  '/',
  requireAuth,
  validate({ body: createAnnouncementBodySchema }),
  asyncHandler(createAnnouncement),
);
announcementRouter.patch(
  '/:id',
  requireAuth,
  validate({ params: announcementIdParamSchema, body: updateAnnouncementBodySchema }),
  asyncHandler(updateAnnouncement),
);
announcementRouter.delete(
  '/:id',
  requireAuth,
  validate({ params: announcementIdParamSchema }),
  asyncHandler(deleteAnnouncement),
);

export { announcementRouter };
