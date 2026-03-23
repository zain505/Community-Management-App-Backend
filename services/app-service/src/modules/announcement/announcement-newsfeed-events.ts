import type { NewsFeedSyncEvent } from '@community/contracts';
import type { AnnouncementRecord } from './announcement.repository';

const NEWSFEED_TITLE_MAX = 191;
const NEWSFEED_DESCRIPTION_MAX = 5_000;

type TrackedAnnouncementField = 'title' | 'content';

interface BuildAnnouncementUpdateActivitySyncParams {
  existingAnnouncement: AnnouncementRecord;
  updatedAnnouncement: AnnouncementRecord;
}

interface AnnouncementFieldChangeDescriptor<K extends TrackedAnnouncementField = TrackedAnnouncementField> {
  field: K;
  hasChanged: (params: BuildAnnouncementUpdateActivitySyncParams) => boolean;
  buildMetadata: (params: BuildAnnouncementUpdateActivitySyncParams) => Record<string, unknown>;
}

interface AnnouncementFieldChange<K extends TrackedAnnouncementField = TrackedAnnouncementField> {
  field: K;
  metadata: Record<string, unknown>;
}

function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 3).trimEnd()}...`;
}

function buildTitle(prefix: string, title: string): string {
  return truncate(`${prefix}${title}`, NEWSFEED_TITLE_MAX);
}

function buildDescription(prefix: string, content?: string): string {
  return truncate(content ? `${prefix}${content}` : prefix.trimEnd(), NEWSFEED_DESCRIPTION_MAX);
}

function buildAnnouncementMetadata(announcement: AnnouncementRecord): Record<string, unknown> {
  return {
    announcementId: announcement.id,
    authorId: announcement.createdByUserId,
    authorName: announcement.authorName,
  };
}

const announcementFieldChangeDescriptors: AnnouncementFieldChangeDescriptor[] = [
  {
    field: 'title',
    hasChanged: (params) => params.existingAnnouncement.title !== params.updatedAnnouncement.title,
    buildMetadata: (params) => ({
      previous: params.existingAnnouncement.title,
      current: params.updatedAnnouncement.title,
    }),
  },
  {
    field: 'content',
    hasChanged: (params) => params.existingAnnouncement.content !== params.updatedAnnouncement.content,
    buildMetadata: (params) => ({
      previous: params.existingAnnouncement.content,
      current: params.updatedAnnouncement.content,
    }),
  },
];

function buildAnnouncementFieldChanges(
  params: BuildAnnouncementUpdateActivitySyncParams,
): AnnouncementFieldChange[] {
  const changes: AnnouncementFieldChange[] = [];

  for (const descriptor of announcementFieldChangeDescriptors) {
    if (!descriptor.hasChanged(params)) {
      continue;
    }

    changes.push({
      field: descriptor.field,
      metadata: descriptor.buildMetadata(params),
    });
  }

  return changes;
}

export function buildAnnouncementCreatedEvent(announcement: AnnouncementRecord): NewsFeedSyncEvent {
  return {
    type: 'ANNOUNCEMENT_CREATED',
    title: buildTitle('New announcement: ', announcement.title),
    description: buildDescription(`${announcement.authorName} shared a community update. `, announcement.content),
    metadata: buildAnnouncementMetadata(announcement),
  };
}

export function buildAnnouncementUpdateActivitySync(
  params: BuildAnnouncementUpdateActivitySyncParams,
): NewsFeedSyncEvent[] {
  const changes = buildAnnouncementFieldChanges(params);

  if (changes.length === 0) {
    return [];
  }

  return [
    {
      type: 'ANNOUNCEMENT_UPDATED',
      title: buildTitle('Announcement updated: ', params.updatedAnnouncement.title),
      description: buildDescription(
        `${params.updatedAnnouncement.authorName} updated a community announcement. `,
        params.updatedAnnouncement.content,
      ),
      metadata: {
        ...buildAnnouncementMetadata(params.updatedAnnouncement),
        changedFields: changes.map((change) => change.field),
        changes: Object.fromEntries(changes.map((change) => [change.field, change.metadata])),
      },
    },
  ];
}

export function buildAnnouncementDeletedEvent(announcement: AnnouncementRecord): NewsFeedSyncEvent {
  return {
    type: 'ANNOUNCEMENT_DELETED',
    title: buildTitle('Announcement removed: ', announcement.title),
    description: buildDescription(`${announcement.authorName} removed a community announcement.`),
    metadata: buildAnnouncementMetadata(announcement),
  };
}
