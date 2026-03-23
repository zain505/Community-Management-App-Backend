jest.mock('../../src/modules/announcement/announcement.service', () => ({
  announcementService: {
    listAnnouncements: jest.fn(),
    getAnnouncement: jest.fn(),
    createAnnouncement: jest.fn(),
    updateAnnouncement: jest.fn(),
    deleteAnnouncement: jest.fn(),
  },
}));

import request from 'supertest';
import { app } from '../../src/app';
import { signAccessToken } from '../../src/lib/token';
import { announcementService } from '../../src/modules/announcement/announcement.service';

const mockedAnnouncementService = jest.mocked(announcementService);

function getAccessToken(): string {
  return signAccessToken({
    sub: 'user-123',
  });
}

describe('announcement routes', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('lists announcements', async () => {
    mockedAnnouncementService.listAnnouncements.mockResolvedValue([
      {
        id: 'announcement-1',
        title: 'Water supply update',
        content: 'Water service resumes at 4pm.',
        authorId: 'user-123',
        authorName: 'Community Admin',
        createdAt: '2026-03-15T10:00:00.000Z',
        updatedAt: '2026-03-15T10:00:00.000Z',
      },
    ]);

    const response = await request(app).get('/v1/announcements?search=Water&page=2');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(1);
    expect(mockedAnnouncementService.listAnnouncements).toHaveBeenCalledWith('Water', 2);
  });

  it('gets a single announcement', async () => {
    mockedAnnouncementService.getAnnouncement.mockResolvedValue({
      id: 'announcement-1',
      title: 'Water supply update',
      content: 'Water service resumes at 4pm.',
      authorId: 'user-123',
      authorName: 'Community Admin',
      createdAt: '2026-03-15T10:00:00.000Z',
      updatedAt: '2026-03-15T10:00:00.000Z',
    });

    const response = await request(app).get('/v1/announcements/announcement-1');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe('announcement-1');
    expect(mockedAnnouncementService.getAnnouncement).toHaveBeenCalledWith('announcement-1');
  });

  it('creates an announcement', async () => {
    mockedAnnouncementService.createAnnouncement.mockResolvedValue({
      id: 'announcement-1',
      title: 'Water supply update',
      content: 'Water service resumes at 4pm.',
      authorId: 'user-123',
      authorName: 'Community Admin',
      createdAt: '2026-03-15T10:00:00.000Z',
      updatedAt: '2026-03-15T10:00:00.000Z',
    });

    const response = await request(app)
      .post('/v1/announcements')
      .set('Authorization', `Bearer ${getAccessToken()}`)
      .send({
        title: 'Water supply update',
        content: 'Water service resumes at 4pm.',
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe('announcement-1');
    expect(mockedAnnouncementService.createAnnouncement).toHaveBeenCalledWith('user-123', {
      title: 'Water supply update',
      content: 'Water service resumes at 4pm.',
    });
  });

  it('updates an announcement', async () => {
    mockedAnnouncementService.updateAnnouncement.mockResolvedValue({
      id: 'announcement-1',
      title: 'Updated water supply update',
      content: 'Water service resumes at 5pm.',
      authorId: 'user-123',
      authorName: 'Community Admin',
      createdAt: '2026-03-15T10:00:00.000Z',
      updatedAt: '2026-03-15T11:00:00.000Z',
    });

    const response = await request(app)
      .patch('/v1/announcements/announcement-1')
      .set('Authorization', `Bearer ${getAccessToken()}`)
      .send({
        title: 'Updated water supply update',
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.title).toBe('Updated water supply update');
    expect(mockedAnnouncementService.updateAnnouncement).toHaveBeenCalledWith('user-123', 'announcement-1', {
      title: 'Updated water supply update',
    });
  });

  it('deletes an announcement', async () => {
    mockedAnnouncementService.deleteAnnouncement.mockResolvedValue(undefined);

    const response = await request(app)
      .delete('/v1/announcements/announcement-1')
      .set('Authorization', `Bearer ${getAccessToken()}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.message).toBe('Announcement deleted');
    expect(mockedAnnouncementService.deleteAnnouncement).toHaveBeenCalledWith('user-123', 'announcement-1');
  });

  it.each([
    ['POST', '/v1/announcements'],
    ['PATCH', '/v1/announcements/announcement-1'],
    ['DELETE', '/v1/announcements/announcement-1'],
  ])('requires access token for restricted announcement action %s %s', async (method, path) => {
    const response = await request(app)[method.toLowerCase() as 'post' | 'patch' | 'delete'](path).send({
      title: 'Water supply update',
      content: 'Water service resumes at 4pm.',
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('UNAUTHORIZED');
  });

  it('returns validation errors for invalid announcement payloads', async () => {
    const response = await request(app)
      .post('/v1/announcements')
      .set('Authorization', `Bearer ${getAccessToken()}`)
      .send({
        title: '',
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('VALIDATION_ERROR');
    expect(response.body.message).toBe('Request validation failed');
    expect(response.body.details).toBeTruthy();
  });
});
