import {
  createEventManagementBodySchema,
  updateEventManagementBodySchema,
} from '../../src/modules/event-management/event-management.schemas';

describe('event management schemas', () => {
  it('accepts a valid create payload', () => {
    const value = createEventManagementBodySchema.parse({
      title: 'Community meetup',
      description: 'Residents are meeting in the main hall.',
      location: 'Main Hall',
      startAt: '2026-03-20T18:00:00.000Z',
      endAt: '2026-03-20T20:00:00.000Z',
    });

    expect(value.title).toBe('Community meetup');
  });

  it('rejects invalid time ranges', () => {
    const result = createEventManagementBodySchema.safeParse({
      title: 'Community meetup',
      description: 'Residents are meeting in the main hall.',
      location: 'Main Hall',
      startAt: '2026-03-20T20:00:00.000Z',
      endAt: '2026-03-20T18:00:00.000Z',
    });

    expect(result.success).toBe(false);
  });

  it('requires at least one field for updates', () => {
    const result = updateEventManagementBodySchema.safeParse({});

    expect(result.success).toBe(false);
  });
});
