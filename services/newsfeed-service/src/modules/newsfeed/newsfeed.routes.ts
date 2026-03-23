import { Router } from 'express';
import { requireAuth } from '../../middleware/require-auth';
import { asyncHandler } from '../../shared/async-handler';
import { validate } from '../../middleware/validate';
import { likeNewsFeed, listNewsFeed, listSavedNewsFeed, saveNewsFeed, syncNewsFeed } from './newsfeed.controller';
import { listNewsFeedQuerySchema, newsFeedIdParamSchema, newsFeedSyncBodySchema } from './newsfeed.schemas';

const newsFeedRouter = Router();
const internalNewsFeedRouter = Router();

newsFeedRouter.get('/', validate({ query: listNewsFeedQuerySchema }), asyncHandler(listNewsFeed));
newsFeedRouter.get('/saved', requireAuth, validate({ query: listNewsFeedQuerySchema }), asyncHandler(listSavedNewsFeed));
newsFeedRouter.post('/:id/save', requireAuth, validate({ params: newsFeedIdParamSchema }), asyncHandler(saveNewsFeed));
newsFeedRouter.post('/:id/likes', requireAuth, validate({ params: newsFeedIdParamSchema }), asyncHandler(likeNewsFeed));
internalNewsFeedRouter.post('/sync', validate({ body: newsFeedSyncBodySchema }), asyncHandler(syncNewsFeed));

export { internalNewsFeedRouter, newsFeedRouter };
