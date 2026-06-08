jest.mock('../../src/modules/newsfeed/newsfeed.service', () => ({
  newsFeedService: {
    createNewsFeedPost: jest.fn(),
    listMyNewsFeedPosts: jest.fn(),
    listUserSubmittedNewsFeed: jest.fn(),
    reviewNewsFeedPost: jest.fn(),
    deleteMyNewsFeedPost: jest.fn(),
    listNewsFeed: jest.fn(),
    likeNewsFeed: jest.fn(),
    syncNewsFeed: jest.fn(),
  },
}));

import fs from 'node:fs/promises';
import path from 'node:path';
import request from 'supertest';
import { app } from '../../src/app';
import { signAccessToken } from '../../src/lib/token';
import { newsFeedService } from '../../src/modules/newsfeed/newsfeed.service';

const mockedNewsFeedService = jest.mocked(newsFeedService);
const uploadsRoot = path.resolve(__dirname, '../../uploads');
const newsFeedImageUrl = 'http://localhost:3000/uploads/newsfeed-images/post-image.png';
const pngImageBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]);

function getAccessToken(userId = 'user-123'): string {
  return signAccessToken({
    sub: userId,
  });
}

describe('user newsfeed routes', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(async () => {
    await fs.rm(uploadsRoot, { recursive: true, force: true });
  });

  it('creates a user-submitted newsfeed post', async () => {
    mockedNewsFeedService.createNewsFeedPost.mockResolvedValue({
      id: 'feed-user-1',
      type: 'USER_POST',
      source: 'USER_POST',
      approvalStatus: 'PENDING',
      title: 'Water outage notice',
      description: 'There will be a short outage tomorrow morning.',
      image: newsFeedImageUrl,
      authorUserId: 'user-123',
      likesCount: 0,
      createdAt: '2026-03-19T12:00:00.000Z',
    } as never);

    const response = await request(app)
      .post('/v1/newsfeed')
      .set('Authorization', `Bearer ${getAccessToken()}`)
      .field('title', 'Water outage notice')
      .field('description', 'There will be a short outage tomorrow morning.')
      .attach('image', pngImageBuffer, {
        filename: 'post.png',
        contentType: 'image/png',
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe('feed-user-1');
    expect(response.body.data.image).toBe(newsFeedImageUrl);
    expect(mockedNewsFeedService.createNewsFeedPost).toHaveBeenCalledWith('user-123', {
      title: 'Water outage notice',
      description: 'There will be a short outage tomorrow morning.',
      image: expect.stringContaining('/uploads/newsfeed-images/'),
    });
  });

  it('lists the logged-in user posts across approval states', async () => {
    mockedNewsFeedService.listMyNewsFeedPosts.mockResolvedValue({
      items: [
        {
          id: 'feed-user-1',
          type: 'USER_POST',
          source: 'USER_POST',
          approvalStatus: 'DISAPPROVED',
          title: 'Water outage notice',
          description: 'There will be a short outage tomorrow morning.',
          authorUserId: 'user-123',
          likesCount: 0,
          createdAt: '2026-03-19T12:00:00.000Z',
        },
      ],
      page: 1,
      limit: 20,
      hasMore: false,
    } as never);

    const response = await request(app)
      .get('/v1/newsfeed/mine')
      .set('Authorization', `Bearer ${getAccessToken()}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.items).toHaveLength(1);
    expect(mockedNewsFeedService.listMyNewsFeedPosts).toHaveBeenCalledWith('user-123', 1, 20);
  });

  it('lists pending user-submitted posts for admins', async () => {
    mockedNewsFeedService.listUserSubmittedNewsFeed.mockResolvedValue({
      items: [],
      page: 1,
      limit: 20,
      hasMore: false,
    });

    const response = await request(app)
      .get('/v1/newsfeed/submissions')
      .set('Authorization', `Bearer ${getAccessToken('admin-123')}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(mockedNewsFeedService.listUserSubmittedNewsFeed).toHaveBeenCalledWith(
      'admin-123',
      1,
      20,
      'PENDING',
    );
  });

  it('updates approval status for a submitted post', async () => {
    mockedNewsFeedService.reviewNewsFeedPost.mockResolvedValue({
      id: 'feed-user-1',
      type: 'USER_POST',
      source: 'USER_POST',
      approvalStatus: 'APPROVED',
      title: 'Water outage notice',
      description: 'There will be a short outage tomorrow morning.',
      image: '/uploads/newsfeed-images/post-image.png',
      authorUserId: 'user-123',
      likesCount: 0,
      createdAt: '2026-03-19T12:00:00.000Z',
    } as never);

    const response = await request(app)
      .patch('/v1/newsfeed/feed-user-1/approval')
      .set('Authorization', `Bearer ${getAccessToken('admin-123')}`)
      .send({
        status: 'APPROVED',
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.approvalStatus).toBe('APPROVED');
    expect(mockedNewsFeedService.reviewNewsFeedPost).toHaveBeenCalledWith(
      'admin-123',
      'feed-user-1',
      'APPROVED',
    );
  });

  it('deletes a user-owned newsfeed post', async () => {
    mockedNewsFeedService.deleteMyNewsFeedPost.mockResolvedValue({
      id: 'feed-user-1',
      message: 'Newsfeed post deleted',
    } as never);

    const response = await request(app)
      .delete('/v1/newsfeed/feed-user-1')
      .set('Authorization', `Bearer ${getAccessToken()}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual({
      id: 'feed-user-1',
      message: 'Newsfeed post deleted',
    });
    expect(mockedNewsFeedService.deleteMyNewsFeedPost).toHaveBeenCalledWith(
      'user-123',
      'feed-user-1',
    );
  });
});
