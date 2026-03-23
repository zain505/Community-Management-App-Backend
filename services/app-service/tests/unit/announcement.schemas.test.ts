import {
  createAnnouncementBodySchema,
  updateAnnouncementBodySchema,
} from '../../src/modules/announcement/announcement.schemas';

describe('announcement schemas', () => {
  it('accepts a valid create payload', () => {
    const value = createAnnouncementBodySchema.parse({
      title: 'Community meetup',
      content: 'We are meeting this Friday at 6pm.',
    });

    expect(value.title).toBe('Community meetup');
  });

  it('rejects empty titles', () => {
    const result = createAnnouncementBodySchema.safeParse({
      title: '',
      content: 'See you there.',
    });

    expect(result.success).toBe(false);
  });

  it('requires at least one field for updates', () => {
    const result = updateAnnouncementBodySchema.safeParse({});

    expect(result.success).toBe(false);
  });
});
