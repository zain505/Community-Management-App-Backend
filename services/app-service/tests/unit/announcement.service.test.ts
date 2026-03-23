jest.mock('../../src/modules/announcement/announcement.repository', () => ({
  announcementRepository: {
    list: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    updateById: jest.fn(),
    deleteById: jest.fn(),
  },
}));

jest.mock('../../src/modules/auth/auth-client', () => ({
  authClient: {
    getUserStatus: jest.fn(),
  },
}));

jest.mock('../../src/modules/newsfeed/newsfeed.client', () => ({
  newsFeedClient: {
    syncBestEffort: jest.fn(),
  },
}));

import { authClient } from '../../src/modules/auth/auth-client';
import { announcementRepository } from '../../src/modules/announcement/announcement.repository';
import { announcementService } from '../../src/modules/announcement/announcement.service';
import { newsFeedClient } from '../../src/modules/newsfeed/newsfeed.client';

const mockedAnnouncementRepository = jest.mocked(announcementRepository);
const mockedAuthClient = jest.mocked(authClient);
const mockedNewsFeedClient = jest.mocked(newsFeedClient);

function buildAnnouncementRecord(overrides: Record<string, unknown> = {}) {
  return {
    id: 'announcement-1',
    title: 'Road maintenance notice',
    content: 'Main street will be closed after 8pm.',
    authorName: 'Community Admin',
    createdAt: new Date('2026-03-15T10:00:00.000Z'),
    updatedAt: new Date('2026-03-15T10:00:00.000Z'),
    createdByUserId: 'user-123',
    ...overrides,
  } as never;
}

describe('announcement service', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('creates an announcement for an active user', async () => {
    mockedAuthClient.getUserStatus.mockResolvedValue({
      id: 'user-123',
      mobileNumber: '+923001234567',
      name: 'Community Admin',
      profile: {
        image: null,
      },
      isActive: true,
      createdAt: '2026-03-15T09:00:00.000Z',
    });
    mockedAnnouncementRepository.create.mockResolvedValue(buildAnnouncementRecord());

    const result = await announcementService.createAnnouncement('user-123', {
      title: 'Road maintenance notice',
      content: 'Main street will be closed after 8pm.',
    });

    expect(mockedAnnouncementRepository.create).toHaveBeenCalledWith(
      'user-123',
      'Community Admin',
      {
        title: 'Road maintenance notice',
        content: 'Main street will be closed after 8pm.',
      },
    );
    expect(mockedNewsFeedClient.syncBestEffort).toHaveBeenCalledWith({
      events: [
        {
          type: 'ANNOUNCEMENT_CREATED',
          title: 'New announcement: Road maintenance notice',
          description: 'Community Admin shared a community update. Main street will be closed after 8pm.',
          metadata: {
            announcementId: 'announcement-1',
            authorId: 'user-123',
            authorName: 'Community Admin',
          },
        },
      ],
      refreshMetrics: undefined,
    });
    expect(result.authorName).toBe('Community Admin');
  });

  it('rejects inactive users before creating announcements', async () => {
    mockedAuthClient.getUserStatus.mockResolvedValue(null);

    await expect(
      announcementService.createAnnouncement('missing-user', {
        title: 'Community meetup',
        content: 'Friday at 6pm.',
      }),
    ).rejects.toMatchObject({
      code: 'USER_INACTIVE',
      statusCode: 401,
    });
  });

  it('prevents users from updating announcements they do not own', async () => {
    mockedAuthClient.getUserStatus.mockResolvedValue({
      id: 'user-123',
      mobileNumber: '+923001234567',
      name: 'Community Admin',
      profile: {
        image: null,
      },
      isActive: true,
      createdAt: '2026-03-15T09:00:00.000Z',
    });
    mockedAnnouncementRepository.findById.mockResolvedValue(
      buildAnnouncementRecord({
        createdByUserId: 'another-user',
        authorName: 'Another User',
      }),
    );

    await expect(
      announcementService.updateAnnouncement('user-123', 'announcement-1', {
        title: 'Updated title',
      }),
    ).rejects.toMatchObject({
      code: 'ANNOUNCEMENT_FORBIDDEN',
      statusCode: 403,
    });
  });

  it('publishes announcement activity when an announcement is updated', async () => {
    mockedAuthClient.getUserStatus.mockResolvedValue({
      id: 'user-123',
      mobileNumber: '+923001234567',
      name: 'Community Admin',
      profile: {
        image: null,
      },
      isActive: true,
      createdAt: '2026-03-15T09:00:00.000Z',
    });
    mockedAnnouncementRepository.findById.mockResolvedValue(buildAnnouncementRecord());
    mockedAnnouncementRepository.updateById.mockResolvedValue(
      buildAnnouncementRecord({
        title: 'Updated road maintenance notice',
        content: 'Main street will be closed after 10pm.',
        updatedAt: new Date('2026-03-15T11:00:00.000Z'),
      }),
    );

    await announcementService.updateAnnouncement('user-123', 'announcement-1', {
      title: 'Updated road maintenance notice',
      content: 'Main street will be closed after 10pm.',
    });

    expect(mockedNewsFeedClient.syncBestEffort).toHaveBeenCalledWith({
      events: [
        {
          type: 'ANNOUNCEMENT_UPDATED',
          title: 'Announcement updated: Updated road maintenance notice',
          description: 'Community Admin updated a community announcement. Main street will be closed after 10pm.',
          metadata: {
            announcementId: 'announcement-1',
            authorId: 'user-123',
            authorName: 'Community Admin',
            changedFields: ['title', 'content'],
            changes: {
              title: {
                previous: 'Road maintenance notice',
                current: 'Updated road maintenance notice',
              },
              content: {
                previous: 'Main street will be closed after 8pm.',
                current: 'Main street will be closed after 10pm.',
              },
            },
          },
        },
      ],
      refreshMetrics: undefined,
    });
  });

  it('does not publish announcement activity when no meaningful announcement fields change', async () => {
    mockedAuthClient.getUserStatus.mockResolvedValue({
      id: 'user-123',
      mobileNumber: '+923001234567',
      name: 'Community Admin',
      profile: {
        image: null,
      },
      isActive: true,
      createdAt: '2026-03-15T09:00:00.000Z',
    });
    mockedAnnouncementRepository.findById.mockResolvedValue(buildAnnouncementRecord());
    mockedAnnouncementRepository.updateById.mockResolvedValue(
      buildAnnouncementRecord({
        updatedAt: new Date('2026-03-15T11:00:00.000Z'),
      }),
    );

    await announcementService.updateAnnouncement('user-123', 'announcement-1', {
      title: 'Road maintenance notice',
      content: 'Main street will be closed after 8pm.',
      updatedAt: '2026-03-15T11:00:00.000Z',
    } as never);

    expect(mockedNewsFeedClient.syncBestEffort).toHaveBeenCalledWith({
      events: undefined,
      refreshMetrics: undefined,
    });
  });

  it('publishes announcement activity when an announcement is deleted', async () => {
    mockedAuthClient.getUserStatus.mockResolvedValue({
      id: 'user-123',
      mobileNumber: '+923001234567',
      name: 'Community Admin',
      profile: {
        image: null,
      },
      isActive: true,
      createdAt: '2026-03-15T09:00:00.000Z',
    });
    mockedAnnouncementRepository.findById.mockResolvedValue(buildAnnouncementRecord());
    mockedAnnouncementRepository.deleteById.mockResolvedValue(buildAnnouncementRecord());

    await announcementService.deleteAnnouncement('user-123', 'announcement-1');

    expect(mockedAnnouncementRepository.deleteById).toHaveBeenCalledWith('announcement-1');
    expect(mockedNewsFeedClient.syncBestEffort).toHaveBeenCalledWith({
      events: [
        {
          type: 'ANNOUNCEMENT_DELETED',
          title: 'Announcement removed: Road maintenance notice',
          description: 'Community Admin removed a community announcement.',
          metadata: {
            announcementId: 'announcement-1',
            authorId: 'user-123',
            authorName: 'Community Admin',
          },
        },
      ],
      refreshMetrics: undefined,
    });
  });
});
