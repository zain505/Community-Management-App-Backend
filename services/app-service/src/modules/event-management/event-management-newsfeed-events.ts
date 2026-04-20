import type { NewsFeedSyncEvent } from '@community/contracts';
import type { EventManagementRecord } from './event-management.repository';

const NEWSFEED_TITLE_MAX = 191;
const NEWSFEED_DESCRIPTION_MAX = 5_000;

type TrackedEventManagementField = 'title' | 'description' | 'image' | 'location' | 'startAt' | 'endAt';

interface BuildEventManagementUpdateActivitySyncParams {
  existingEventManagement: EventManagementRecord;
  updatedEventManagement: EventManagementRecord;
}

interface EventManagementFieldChangeDescriptor<
  K extends TrackedEventManagementField = TrackedEventManagementField,
> {
  field: K;
  hasChanged: (params: BuildEventManagementUpdateActivitySyncParams) => boolean;
  buildMetadata: (params: BuildEventManagementUpdateActivitySyncParams) => Record<string, unknown>;
}

interface EventManagementFieldChange<K extends TrackedEventManagementField = TrackedEventManagementField> {
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

function buildDescription(action: string, eventManagement: EventManagementRecord): string {
  return truncate(
    `${eventManagement.authorName} ${action} a community event at ${eventManagement.location}.`,
    NEWSFEED_DESCRIPTION_MAX,
  );
}

function toIsoString(value: Date | null): string | null {
  return value ? value.toISOString() : null;
}

function buildEventManagementMetadata(
  eventManagement: EventManagementRecord,
): Record<string, unknown> {
  return {
    eventManagementId: eventManagement.id,
    authorId: eventManagement.createdByUserId,
    authorName: eventManagement.authorName,
    image: eventManagement.image,
    location: eventManagement.location,
    startAt: eventManagement.startAt.toISOString(),
    endAt: toIsoString(eventManagement.endAt),
  };
}

const eventManagementFieldChangeDescriptors: EventManagementFieldChangeDescriptor[] = [
  {
    field: 'title',
    hasChanged: (params) => params.existingEventManagement.title !== params.updatedEventManagement.title,
    buildMetadata: (params) => ({
      previous: params.existingEventManagement.title,
      current: params.updatedEventManagement.title,
    }),
  },
  {
    field: 'description',
    hasChanged: (params) =>
      params.existingEventManagement.description !== params.updatedEventManagement.description,
    buildMetadata: (params) => ({
      previous: params.existingEventManagement.description,
      current: params.updatedEventManagement.description,
    }),
  },
  {
    field: 'image',
    hasChanged: (params) => params.existingEventManagement.image !== params.updatedEventManagement.image,
    buildMetadata: (params) => ({
      previous: params.existingEventManagement.image,
      current: params.updatedEventManagement.image,
    }),
  },
  {
    field: 'location',
    hasChanged: (params) => params.existingEventManagement.location !== params.updatedEventManagement.location,
    buildMetadata: (params) => ({
      previous: params.existingEventManagement.location,
      current: params.updatedEventManagement.location,
    }),
  },
  {
    field: 'startAt',
    hasChanged: (params) =>
      params.existingEventManagement.startAt.getTime() !== params.updatedEventManagement.startAt.getTime(),
    buildMetadata: (params) => ({
      previous: params.existingEventManagement.startAt.toISOString(),
      current: params.updatedEventManagement.startAt.toISOString(),
    }),
  },
  {
    field: 'endAt',
    hasChanged: (params) =>
      params.existingEventManagement.endAt?.getTime() !== params.updatedEventManagement.endAt?.getTime(),
    buildMetadata: (params) => ({
      previous: toIsoString(params.existingEventManagement.endAt),
      current: toIsoString(params.updatedEventManagement.endAt),
    }),
  },
];

function buildEventManagementFieldChanges(
  params: BuildEventManagementUpdateActivitySyncParams,
): EventManagementFieldChange[] {
  const changes: EventManagementFieldChange[] = [];

  for (const descriptor of eventManagementFieldChangeDescriptors) {
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

export function buildEventManagementCreatedEvent(
  eventManagement: EventManagementRecord,
): NewsFeedSyncEvent {
  return {
    type: 'EVENT_MANAGEMENT_CREATED',
    title: buildTitle('New community event: ', eventManagement.title),
    description: buildDescription('scheduled', eventManagement),
    metadata: buildEventManagementMetadata(eventManagement),
  };
}

export function buildEventManagementUpdateActivitySync(
  params: BuildEventManagementUpdateActivitySyncParams,
): NewsFeedSyncEvent[] {
  const changes = buildEventManagementFieldChanges(params);

  if (changes.length === 0) {
    return [];
  }

  return [
    {
      type: 'EVENT_MANAGEMENT_UPDATED',
      title: buildTitle('Event updated: ', params.updatedEventManagement.title),
      description: buildDescription('updated', params.updatedEventManagement),
      metadata: {
        ...buildEventManagementMetadata(params.updatedEventManagement),
        changedFields: changes.map((change) => change.field),
        changes: Object.fromEntries(changes.map((change) => [change.field, change.metadata])),
      },
    },
  ];
}

export function buildEventManagementDeletedEvent(
  eventManagement: EventManagementRecord,
): NewsFeedSyncEvent {
  return {
    type: 'EVENT_MANAGEMENT_DELETED',
    title: buildTitle('Event removed: ', eventManagement.title),
    description: buildDescription('removed', eventManagement),
    metadata: buildEventManagementMetadata(eventManagement),
  };
}
