import type {
  AnnouncementListQuery,
  CreateAnnouncementRequest,
  UpdateAnnouncementRequest,
} from '@community/contracts';
import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendSuccess } from '../../lib/http';
import { AppError } from '../../shared/app-error';
import { announcementService } from './announcement.service';

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

function getAnnouncementId(req: Request): string {
  return (req.params as { id: string }).id;
}

export async function listAnnouncements(req: Request, res: Response): Promise<void> {
  const query = req.query as AnnouncementListQuery;
  const announcements = await announcementService.listAnnouncements(query.search, query.page);
  sendSuccess(res, StatusCodes.OK, announcements);
}

export async function getAnnouncement(req: Request, res: Response): Promise<void> {
  const announcement = await announcementService.getAnnouncement(getAnnouncementId(req));
  sendSuccess(res, StatusCodes.OK, announcement);
}

export async function createAnnouncement(req: Request, res: Response): Promise<void> {
  const announcement = await announcementService.createAnnouncement(
    getAuthenticatedUserId(req),
    req.body as CreateAnnouncementRequest,
  );
  sendSuccess(res, StatusCodes.CREATED, announcement);
}

export async function updateAnnouncement(req: Request, res: Response): Promise<void> {
  const announcement = await announcementService.updateAnnouncement(
    getAuthenticatedUserId(req),
    getAnnouncementId(req),
    req.body as UpdateAnnouncementRequest,
  );
  sendSuccess(res, StatusCodes.OK, announcement);
}

export async function deleteAnnouncement(req: Request, res: Response): Promise<void> {
  await announcementService.deleteAnnouncement(getAuthenticatedUserId(req), getAnnouncementId(req));
  sendSuccess(res, StatusCodes.OK, {
    message: 'Announcement deleted',
  });
}
