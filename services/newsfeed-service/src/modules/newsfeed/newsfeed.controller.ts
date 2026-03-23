import type { NewsFeedListQuery, NewsFeedSyncRequest } from '@community/contracts';
import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendSuccess } from '../../lib/http';
import { AppError } from '../../shared/app-error';
import { newsFeedService } from './newsfeed.service';

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

function getNewsFeedId(req: Request): string {
  return (req.params as { id: string }).id;
}

export async function listNewsFeed(req: Request, res: Response): Promise<void> {
  const query = req.query as NewsFeedListQuery;
  const feed = await newsFeedService.listNewsFeed(query.page, query.limit);
  sendSuccess(res, StatusCodes.OK, feed);
}

export async function saveNewsFeed(req: Request, res: Response): Promise<void> {
  const savedFeed = await newsFeedService.saveNewsFeed(getAuthenticatedUserId(req), getNewsFeedId(req));
  sendSuccess(res, StatusCodes.OK, savedFeed);
}

export async function listSavedNewsFeed(req: Request, res: Response): Promise<void> {
  const query = req.query as NewsFeedListQuery;
  const savedFeeds = await newsFeedService.listSavedNewsFeed(getAuthenticatedUserId(req), query.page, query.limit);
  sendSuccess(res, StatusCodes.OK, savedFeeds);
}

export async function likeNewsFeed(req: Request, res: Response): Promise<void> {
  const newsFeed = await newsFeedService.likeNewsFeed(getAuthenticatedUserId(req), getNewsFeedId(req));
  sendSuccess(res, StatusCodes.OK, newsFeed);
}

export async function syncNewsFeed(req: Request, res: Response): Promise<void> {
  await newsFeedService.syncNewsFeed(req.body as NewsFeedSyncRequest);
  sendSuccess(res, StatusCodes.ACCEPTED, {
    message: 'Newsfeed sync accepted',
  });
}
