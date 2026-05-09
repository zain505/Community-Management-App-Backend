import type {
  CreateNewsFeedPostRequest,
  NewsFeedAdminListQuery,
  NewsFeedDeleteResponse,
  NewsFeedListQuery,
  NewsFeedSyncRequest,
  ReviewNewsFeedPostRequest,
} from '@community/contracts';
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

export async function createNewsFeedPost(req: Request, res: Response): Promise<void> {
  const post = await newsFeedService.createNewsFeedPost(
    getAuthenticatedUserId(req),
    req.body as CreateNewsFeedPostRequest,
  );
  sendSuccess(res, StatusCodes.CREATED, post);
}

export async function listMyNewsFeedPosts(req: Request, res: Response): Promise<void> {
  const query = req.query as NewsFeedListQuery;
  const posts = await newsFeedService.listMyNewsFeedPosts(
    getAuthenticatedUserId(req),
    query.page,
    query.limit,
  );
  sendSuccess(res, StatusCodes.OK, posts);
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

export async function listUserSubmittedNewsFeed(req: Request, res: Response): Promise<void> {
  const query = req.query as NewsFeedAdminListQuery;
  const posts = await newsFeedService.listUserSubmittedNewsFeed(
    getAuthenticatedUserId(req),
    query.page,
    query.limit,
    query.status,
  );
  sendSuccess(res, StatusCodes.OK, posts);
}

export async function reviewNewsFeedPost(req: Request, res: Response): Promise<void> {
  const post = await newsFeedService.reviewNewsFeedPost(
    getAuthenticatedUserId(req),
    getNewsFeedId(req),
    (req.body as ReviewNewsFeedPostRequest).status,
  );
  sendSuccess(res, StatusCodes.OK, post);
}

export async function deleteMyNewsFeedPost(req: Request, res: Response): Promise<void> {
  const result = await newsFeedService.deleteMyNewsFeedPost(
    getAuthenticatedUserId(req),
    getNewsFeedId(req),
  );
  sendSuccess(res, StatusCodes.OK, result satisfies NewsFeedDeleteResponse);
}

export async function syncNewsFeed(req: Request, res: Response): Promise<void> {
  await newsFeedService.syncNewsFeed(req.body as NewsFeedSyncRequest);
  sendSuccess(res, StatusCodes.ACCEPTED, {
    message: 'Newsfeed sync accepted',
  });
}
