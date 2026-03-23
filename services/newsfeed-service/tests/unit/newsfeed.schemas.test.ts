import {
  listNewsFeedQuerySchema,
  newsFeedIdParamSchema,
  newsFeedSyncBodySchema,
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
          type: 'ANNOUNCEMENT_CREATED',
          title: 'New announcement: Water supply update',
          description: 'Community Admin shared a community update. Water service resumes at 4pm.',
        },
      ],
      refreshMetrics: ['POPULAR_STORE'],
    });

    expect(payload.events).toHaveLength(1);
    expect(payload.refreshMetrics).toEqual(['POPULAR_STORE']);
  });
});
