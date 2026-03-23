jest.mock('../../src/modules/event-management/event-management.service', () => ({
  eventManagementService: {
    list: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

import request from 'supertest';
import { app } from '../../src/app';
import { signAccessToken } from '../../src/lib/token';
import { eventManagementService } from '../../src/modules/event-management/event-management.service';

const mockedEventManagementService = jest.mocked(eventManagementService);

function getAccessToken(): string {
  return signAccessToken({
    sub: 'user-123',
  });
}

describe('event management routes', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('lists events', async () => {
    mockedEventManagementService.list.mockResolvedValue([
      {
        id: 'event-1',
        title: 'Community meetup',
        description: 'Residents are meeting in the main hall.',
        location: 'Main Hall',
        startAt: '2026-03-20T18:00:00.000Z',
        endAt: '2026-03-20T20:00:00.000Z',
        authorId: 'user-123',
        authorName: 'Community Admin',
        createdAt: '2026-03-15T10:00:00.000Z',
        updatedAt: '2026-03-15T10:00:00.000Z',
      },
    ]);

    const response = await request(app).get('/v1/event-management?search=meetup&page=2');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(1);
    expect(mockedEventManagementService.list).toHaveBeenCalledWith('meetup', 2);
  });

  it('gets a single event', async () => {
    mockedEventManagementService.getById.mockResolvedValue({
      id: 'event-1',
      title: 'Community meetup',
      description: 'Residents are meeting in the main hall.',
      location: 'Main Hall',
      startAt: '2026-03-20T18:00:00.000Z',
      endAt: '2026-03-20T20:00:00.000Z',
      authorId: 'user-123',
      authorName: 'Community Admin',
      createdAt: '2026-03-15T10:00:00.000Z',
      updatedAt: '2026-03-15T10:00:00.000Z',
    });

    const response = await request(app).get('/v1/event-management/event-1');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe('event-1');
    expect(mockedEventManagementService.getById).toHaveBeenCalledWith('event-1');
  });

  it('creates an event', async () => {
    mockedEventManagementService.create.mockResolvedValue({
      id: 'event-1',
      title: 'Community meetup',
      description: 'Residents are meeting in the main hall.',
      location: 'Main Hall',
      startAt: '2026-03-20T18:00:00.000Z',
      endAt: '2026-03-20T20:00:00.000Z',
      authorId: 'user-123',
      authorName: 'Community Admin',
      createdAt: '2026-03-15T10:00:00.000Z',
      updatedAt: '2026-03-15T10:00:00.000Z',
    });

    const response = await request(app)
      .post('/v1/event-management')
      .set('Authorization', `Bearer ${getAccessToken()}`)
      .send({
        title: 'Community meetup',
        description: 'Residents are meeting in the main hall.',
        location: 'Main Hall',
        startAt: '2026-03-20T18:00:00.000Z',
        endAt: '2026-03-20T20:00:00.000Z',
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe('event-1');
    expect(mockedEventManagementService.create).toHaveBeenCalledWith('user-123', {
      title: 'Community meetup',
      description: 'Residents are meeting in the main hall.',
      location: 'Main Hall',
      startAt: '2026-03-20T18:00:00.000Z',
      endAt: '2026-03-20T20:00:00.000Z',
    });
  });

  it('updates an event', async () => {
    mockedEventManagementService.update.mockResolvedValue({
      id: 'event-1',
      title: 'Updated community meetup',
      description: 'Residents are meeting in the main hall.',
      location: 'Main Hall',
      startAt: '2026-03-20T19:00:00.000Z',
      endAt: '2026-03-20T21:00:00.000Z',
      authorId: 'user-123',
      authorName: 'Community Admin',
      createdAt: '2026-03-15T10:00:00.000Z',
      updatedAt: '2026-03-15T11:00:00.000Z',
    });

    const response = await request(app)
      .patch('/v1/event-management/event-1')
      .set('Authorization', `Bearer ${getAccessToken()}`)
      .send({
        title: 'Updated community meetup',
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.title).toBe('Updated community meetup');
    expect(mockedEventManagementService.update).toHaveBeenCalledWith('user-123', 'event-1', {
      title: 'Updated community meetup',
    });
  });

  it('deletes an event', async () => {
    mockedEventManagementService.delete.mockResolvedValue(undefined);

    const response = await request(app)
      .delete('/v1/event-management/event-1')
      .set('Authorization', `Bearer ${getAccessToken()}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.message).toBe('Event deleted');
    expect(mockedEventManagementService.delete).toHaveBeenCalledWith('user-123', 'event-1');
  });

  it.each([
    ['POST', '/v1/event-management'],
    ['PATCH', '/v1/event-management/event-1'],
    ['DELETE', '/v1/event-management/event-1'],
  ])('requires access token for restricted event action %s %s', async (method, path) => {
    const response = await request(app)[method.toLowerCase() as 'post' | 'patch' | 'delete'](path).send({
      title: 'Community meetup',
      description: 'Residents are meeting in the main hall.',
      location: 'Main Hall',
      startAt: '2026-03-20T18:00:00.000Z',
      endAt: '2026-03-20T20:00:00.000Z',
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('UNAUTHORIZED');
  });

  it('returns validation errors for invalid event payloads', async () => {
    const response = await request(app)
      .post('/v1/event-management')
      .set('Authorization', `Bearer ${getAccessToken()}`)
      .send({
        title: '',
        description: 'Residents are meeting in the main hall.',
        location: 'Main Hall',
        startAt: '2026-03-20T20:00:00.000Z',
        endAt: '2026-03-20T18:00:00.000Z',
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('VALIDATION_ERROR');
    expect(response.body.message).toBe('Request validation failed');
    expect(response.body.details).toBeTruthy();
  });
});
