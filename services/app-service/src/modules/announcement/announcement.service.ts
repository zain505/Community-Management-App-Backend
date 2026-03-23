import type {
  Announcement,
  CreateAnnouncementRequest,
  NewsFeedSyncEvent,
  UserStatus,
  UpdateAnnouncementRequest,
} from '@community/contracts';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../../shared/app-error';
import { authClient } from '../auth/auth-client';
import { newsFeedClient } from '../newsfeed/newsfeed.client';
import {
  buildAnnouncementCreatedEvent,
  buildAnnouncementDeletedEvent,
  buildAnnouncementUpdateActivitySync,
} from './announcement-newsfeed-events';
import { announcementRepository, type AnnouncementRecord } from './announcement.repository';

function toAnnouncement(announcement: AnnouncementRecord): Announcement {
  return {
    id: announcement.id,
    title: announcement.title,
    content: announcement.content,
    authorId: announcement.createdByUserId,
    authorName: announcement.authorName,
    createdAt: announcement.createdAt.toISOString(),
    updatedAt: announcement.updatedAt.toISOString(),
  };
}

function throwAnnouncementNotFound(): never {
  throw new AppError('Announcement not found', {
    statusCode: StatusCodes.NOT_FOUND,
    code: 'ANNOUNCEMENT_NOT_FOUND',
  });
}

function throwAnnouncementForbidden(): never {
  throw new AppError('You can only manage your own announcements', {
    statusCode: StatusCodes.FORBIDDEN,
    code: 'ANNOUNCEMENT_FORBIDDEN',
  });
}

async function getActiveUser(userId: string): Promise<UserStatus> {
  const user = await authClient.getUserStatus(userId);

  if (!user || !user.isActive) {
    throw new AppError('User is not active', {
      statusCode: StatusCodes.UNAUTHORIZED,
      code: 'USER_INACTIVE',
    });
  }

  return user;
}

async function syncNewsFeed(events?: NewsFeedSyncEvent[]): Promise<void> {
  await newsFeedClient.syncBestEffort({
    events: events && events.length > 0 ? events : undefined,
    refreshMetrics: undefined,
  });
}

export const announcementService = {
  async listAnnouncements(search?: string, page = 1): Promise<Announcement[]> {
    const announcements = await announcementRepository.list(search, page);
    return announcements.map(toAnnouncement);
  },

  async getAnnouncement(id: string): Promise<Announcement> {
    const announcement = await announcementRepository.findById(id);

    if (!announcement) {
      throwAnnouncementNotFound();
    }

    return toAnnouncement(announcement);
  },

  async createAnnouncement(userId: string, payload: CreateAnnouncementRequest): Promise<Announcement> {
    const user = await getActiveUser(userId);
    const announcement = await announcementRepository.create(userId, user.name, payload);
    await syncNewsFeed([buildAnnouncementCreatedEvent(announcement)]);
    return toAnnouncement(announcement);
  },

  async updateAnnouncement(
    userId: string,
    announcementId: string,
    payload: UpdateAnnouncementRequest,
  ): Promise<Announcement> {
    await getActiveUser(userId);
    const existingAnnouncement = await announcementRepository.findById(announcementId);

    if (!existingAnnouncement) {
      throwAnnouncementNotFound();
    }

    if (existingAnnouncement.createdByUserId !== userId) {
      throwAnnouncementForbidden();
    }

    const updatedAnnouncement = await announcementRepository.updateById(announcementId, payload);
    const newsFeedEvents = buildAnnouncementUpdateActivitySync({
      existingAnnouncement,
      updatedAnnouncement,
    });
    await syncNewsFeed(newsFeedEvents);
    return toAnnouncement(updatedAnnouncement);
  },

  async deleteAnnouncement(userId: string, announcementId: string): Promise<void> {
    await getActiveUser(userId);
    const existingAnnouncement = await announcementRepository.findById(announcementId);

    if (!existingAnnouncement) {
      throwAnnouncementNotFound();
    }

    if (existingAnnouncement.createdByUserId !== userId) {
      throwAnnouncementForbidden();
    }

    const deletedAnnouncement = await announcementRepository.deleteById(announcementId);
    await syncNewsFeed([buildAnnouncementDeletedEvent(deletedAnnouncement)]);
  },
};
