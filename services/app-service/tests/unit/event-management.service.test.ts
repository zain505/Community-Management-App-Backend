jest.mock('../../src/modules/event-management/event-management.repository', () => ({
  eventManagementRepository: {
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
import { eventManagementRepository } from '../../src/modules/event-management/event-management.repository';
import { eventManagementService } from '../../src/modules/event-management/event-management.service';
import { newsFeedClient } from '../../src/modules/newsfeed/newsfeed.client';

const mockedEventManagementRepository = jest.mocked(eventManagementRepository);
const mockedAuthClient = jest.mocked(authClient);
const mockedNewsFeedClient = jest.mocked(newsFeedClient);

function buildEventManagementRecord(overrides: Record<string, unknown> = {}) {
  return {
    id: 'event-1',
    title: 'Community meetup',
    description: 'Residents are meeting in the main hall.',
    image: 'https://cdn.example.com/events/community-meetup.png',
    location: 'Main Hall',
    startAt: new Date('2026-03-20T18:00:00.000Z'),
    endAt: new Date('2026-03-20T20:00:00.000Z'),
    authorName: 'Community Admin',
    createdAt: new Date('2026-03-15T10:00:00.000Z'),
    updatedAt: new Date('2026-03-15T10:00:00.000Z'),
    createdByUserId: 'user-123',
    ...overrides,
  } as never;
}

describe('event management service', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('creates an event for an active user', async () => {
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
    mockedEventManagementRepository.create.mockResolvedValue(buildEventManagementRecord());

    const result = await eventManagementService.create('user-123', {
      title: 'Community meetup',
      description: 'Residents are meeting in the main hall.',
      image: 'https://cdn.example.com/events/community-meetup.png',
      location: 'Main Hall',
      startAt: '2026-03-20T18:00:00.000Z',
      endAt: '2026-03-20T20:00:00.000Z',
    });

    expect(mockedEventManagementRepository.create).toHaveBeenCalledWith(
      'user-123',
      'Community Admin',
      {
        title: 'Community meetup',
        description: 'Residents are meeting in the main hall.',
        image: 'https://cdn.example.com/events/community-meetup.png',
        location: 'Main Hall',
        startAt: '2026-03-20T18:00:00.000Z',
        endAt: '2026-03-20T20:00:00.000Z',
      },
    );
    expect(mockedNewsFeedClient.syncBestEffort).toHaveBeenCalledWith({
      events: [
        {
          type: 'EVENT_MANAGEMENT_CREATED',
          title: 'New community event: Community meetup',
          description: 'Community Admin scheduled a community event at Main Hall.',
          metadata: {
            eventManagementId: 'event-1',
            authorId: 'user-123',
            authorName: 'Community Admin',
            image: 'https://cdn.example.com/events/community-meetup.png',
            location: 'Main Hall',
            startAt: '2026-03-20T18:00:00.000Z',
            endAt: '2026-03-20T20:00:00.000Z',
          },
        },
      ],
      refreshMetrics: undefined,
    });
    expect(result.authorName).toBe('Community Admin');
  });

  it('rejects inactive users before creating events', async () => {
    mockedAuthClient.getUserStatus.mockResolvedValue(null);

    await expect(
      eventManagementService.create('missing-user', {
        title: 'Community meetup',
        description: 'Residents are meeting in the main hall.',
        image: 'https://cdn.example.com/events/community-meetup.png',
        location: 'Main Hall',
        startAt: '2026-03-20T18:00:00.000Z',
      }),
    ).rejects.toMatchObject({
      code: 'USER_INACTIVE',
      statusCode: 401,
    });
  });

  it('prevents users from updating events they do not own', async () => {
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
    mockedEventManagementRepository.findById.mockResolvedValue(
      buildEventManagementRecord({
        createdByUserId: 'another-user',
        authorName: 'Another User',
      }),
    );

    await expect(
      eventManagementService.update('user-123', 'event-1', {
        title: 'Updated title',
      }),
    ).rejects.toMatchObject({
      code: 'EVENT_MANAGEMENT_FORBIDDEN',
      statusCode: 403,
    });
  });

  it('rejects updates that make the event end before it starts', async () => {
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
    mockedEventManagementRepository.findById.mockResolvedValue(buildEventManagementRecord());

    await expect(
      eventManagementService.update('user-123', 'event-1', {
        startAt: '2026-03-20T21:00:00.000Z',
      }),
    ).rejects.toMatchObject({
      code: 'EVENT_MANAGEMENT_INVALID_TIME_RANGE',
      statusCode: 400,
    });
  });

  it('publishes event activity when an event is updated', async () => {
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
    mockedEventManagementRepository.findById.mockResolvedValue(buildEventManagementRecord());
    mockedEventManagementRepository.updateById.mockResolvedValue(
      buildEventManagementRecord({
        title: 'Community meetup updated',
        image: 'https://cdn.example.com/events/community-meetup-updated.png',
        location: 'Club House',
        updatedAt: new Date('2026-03-16T10:00:00.000Z'),
      }),
    );

    await eventManagementService.update('user-123', 'event-1', {
      title: 'Community meetup updated',
      image: 'https://cdn.example.com/events/community-meetup-updated.png',
      location: 'Club House',
    });

    expect(mockedNewsFeedClient.syncBestEffort).toHaveBeenCalledWith({
      events: [
        {
          type: 'EVENT_MANAGEMENT_UPDATED',
          title: 'Event updated: Community meetup updated',
          description: 'Community Admin updated a community event at Club House.',
          metadata: {
            eventManagementId: 'event-1',
            authorId: 'user-123',
            authorName: 'Community Admin',
            image: 'https://cdn.example.com/events/community-meetup-updated.png',
            location: 'Club House',
            startAt: '2026-03-20T18:00:00.000Z',
            endAt: '2026-03-20T20:00:00.000Z',
            changedFields: ['title', 'image', 'location'],
            changes: {
              title: {
                previous: 'Community meetup',
                current: 'Community meetup updated',
              },
              image: {
                previous: 'https://cdn.example.com/events/community-meetup.png',
                current: 'https://cdn.example.com/events/community-meetup-updated.png',
              },
              location: {
                previous: 'Main Hall',
                current: 'Club House',
              },
            },
          },
        },
      ],
      refreshMetrics: undefined,
    });
  });

  it('does not publish event activity when no meaningful event fields change', async () => {
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
    mockedEventManagementRepository.findById.mockResolvedValue(buildEventManagementRecord());
    mockedEventManagementRepository.updateById.mockResolvedValue(
      buildEventManagementRecord({
        updatedAt: new Date('2026-03-16T10:00:00.000Z'),
      }),
    );

    await eventManagementService.update('user-123', 'event-1', {
      title: 'Community meetup',
      description: 'Residents are meeting in the main hall.',
      image: 'https://cdn.example.com/events/community-meetup.png',
      location: 'Main Hall',
      updatedAt: '2026-03-16T10:00:00.000Z',
    } as never);

    expect(mockedNewsFeedClient.syncBestEffort).toHaveBeenCalledWith({
      events: undefined,
      refreshMetrics: undefined,
    });
  });

  it('deletes an event owned by the authenticated user', async () => {
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
    mockedEventManagementRepository.findById.mockResolvedValue(buildEventManagementRecord());
    mockedEventManagementRepository.deleteById.mockResolvedValue(buildEventManagementRecord());

    await eventManagementService.delete('user-123', 'event-1');

    expect(mockedEventManagementRepository.deleteById).toHaveBeenCalledWith('event-1');
    expect(mockedNewsFeedClient.syncBestEffort).toHaveBeenCalledWith({
      events: [
        {
          type: 'EVENT_MANAGEMENT_DELETED',
          title: 'Event removed: Community meetup',
          description: 'Community Admin removed a community event at Main Hall.',
          metadata: {
            eventManagementId: 'event-1',
            authorId: 'user-123',
            authorName: 'Community Admin',
            image: 'https://cdn.example.com/events/community-meetup.png',
            location: 'Main Hall',
            startAt: '2026-03-20T18:00:00.000Z',
            endAt: '2026-03-20T20:00:00.000Z',
          },
        },
      ],
      refreshMetrics: undefined,
    });
  });
});
