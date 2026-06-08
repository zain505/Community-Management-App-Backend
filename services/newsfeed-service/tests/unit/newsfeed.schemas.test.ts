import {
  createNewsFeedPostBodySchema,
  listNewsFeedQuerySchema,
  listUserSubmittedNewsFeedQuerySchema,
  newsFeedIdParamSchema,
  newsFeedSyncBodySchema,
  reviewNewsFeedPostBodySchema,
} from '../../src/modules/newsfeed/newsfeed.schemas';

describe('newsfeed schemas', () => {
  it('defaults newsfeed pagination values', () => {
    const query = listNewsFeedQuerySchema.parse({});

    expect(query.page).toBe(1);
    expect(query.limit).toBe(20);
  });

  it('rejects oversized limit values', () => {
    const result = listNewsFeedQuerySchema.safeParse({
      limit: 51,
    });

    expect(result.success).toBe(false);
  });

  it('accepts a valid newsfeed id param', () => {
    const params = newsFeedIdParamSchema.parse({
      id: 'feed-1',
    });

    expect(params.id).toBe('feed-1');
  });

  it('accepts a valid sync payload', () => {
    const payload = newsFeedSyncBodySchema.parse({
      events: [
        {
          type: 'EVENT_MANAGEMENT_CREATED',
          title: 'New community event: Water supply meeting',
          description: 'Community Admin scheduled a community event at Main Hall.',
          image: 'http://localhost:3000/uploads/newsfeed-images/event.png',
        },
      ],
      refreshMetrics: ['POPULAR_STORE'],
    });

    expect(payload.events).toHaveLength(1);
    expect(payload.refreshMetrics).toEqual(['POPULAR_STORE']);
  });

  it('accepts a user newsfeed post body with an image', () => {
    const payload = createNewsFeedPostBodySchema.parse({
      title: 'Water outage notice',
      description: 'There will be a short outage tomorrow morning.',
      image: 'http://localhost:3000/uploads/newsfeed-images/post.png',
    });

    expect(payload.title).toBe('Water outage notice');
    expect(payload.image).toBe('http://localhost:3000/uploads/newsfeed-images/post.png');
  });

  it('defaults admin submission listing to pending posts', () => {
    const query = listUserSubmittedNewsFeedQuerySchema.parse({});

    expect(query.page).toBe(1);
    expect(query.limit).toBe(20);
    expect(query.status).toBe('PENDING');
  });

  it('rejects pending as a moderation action target status', () => {
    const result = reviewNewsFeedPostBodySchema.safeParse({
      status: 'PENDING',
    });

    expect(result.success).toBe(false);
  });
});
