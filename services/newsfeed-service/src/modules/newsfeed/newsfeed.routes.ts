import { Router } from 'express';
import { requireAuth } from '../../middleware/require-auth';
import { asyncHandler } from '../../shared/async-handler';
import { validate } from '../../middleware/validate';
import {
  createNewsFeedPost,
  deleteMyNewsFeedPost,
  likeNewsFeed,
  listMyNewsFeedPosts,
  listNewsFeed,
  listSavedNewsFeed,
  listUserSubmittedNewsFeed,
  reviewNewsFeedPost,
  saveNewsFeed,
  syncNewsFeed,
} from './newsfeed.controller';
import {
  createNewsFeedPostBodySchema,
  listNewsFeedQuerySchema,
  listUserSubmittedNewsFeedQuerySchema,
  newsFeedIdParamSchema,
  newsFeedSyncBodySchema,
  reviewNewsFeedPostBodySchema,
} from './newsfeed.schemas';

const newsFeedRouter = Router();
const internalNewsFeedRouter = Router();

newsFeedRouter.get('/', validate({ query: listNewsFeedQuerySchema }), asyncHandler(listNewsFeed));
newsFeedRouter.post(
  '/',
  requireAuth,
  validate({ body: createNewsFeedPostBodySchema }),
  asyncHandler(createNewsFeedPost),
);
newsFeedRouter.get('/mine', requireAuth, validate({ query: listNewsFeedQuerySchema }), asyncHandler(listMyNewsFeedPosts));
newsFeedRouter.get(
  '/submissions',
  requireAuth,
  validate({ query: listUserSubmittedNewsFeedQuerySchema }),
  asyncHandler(listUserSubmittedNewsFeed),
);
newsFeedRouter.get('/saved', requireAuth, validate({ query: listNewsFeedQuerySchema }), asyncHandler(listSavedNewsFeed));
newsFeedRouter.post('/:id/save', requireAuth, validate({ params: newsFeedIdParamSchema }), asyncHandler(saveNewsFeed));
newsFeedRouter.post('/:id/likes', requireAuth, validate({ params: newsFeedIdParamSchema }), asyncHandler(likeNewsFeed));
newsFeedRouter.patch(
  '/:id/approval',
  requireAuth,
  validate({ params: newsFeedIdParamSchema, body: reviewNewsFeedPostBodySchema }),
  asyncHandler(reviewNewsFeedPost),
);
newsFeedRouter.delete('/:id', requireAuth, validate({ params: newsFeedIdParamSchema }), asyncHandler(deleteMyNewsFeedPost));
internalNewsFeedRouter.post('/sync', validate({ body: newsFeedSyncBodySchema }), asyncHandler(syncNewsFeed));

export { internalNewsFeedRouter, newsFeedRouter };
