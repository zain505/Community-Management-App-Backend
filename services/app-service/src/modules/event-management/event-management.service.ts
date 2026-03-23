import type {
  CreateEventManagementRequest,
  EventManagement,
  UpdateEventManagementRequest,
  UserStatus,
} from '@community/contracts';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../../shared/app-error';
import { authClient } from '../auth/auth-client';
import {
  eventManagementRepository,
  type EventManagementRecord,
} from './event-management.repository';

function toEventManagement(eventManagement: EventManagementRecord): EventManagement {
  return {
    id: eventManagement.id,
    title: eventManagement.title,
    description: eventManagement.description,
    location: eventManagement.location,
    startAt: eventManagement.startAt.toISOString(),
    endAt: eventManagement.endAt ? eventManagement.endAt.toISOString() : null,
    authorId: eventManagement.createdByUserId,
    authorName: eventManagement.authorName,
    createdAt: eventManagement.createdAt.toISOString(),
    updatedAt: eventManagement.updatedAt.toISOString(),
  };
}

function throwEventManagementNotFound(): never {
  throw new AppError('Event not found', {
    statusCode: StatusCodes.NOT_FOUND,
    code: 'EVENT_MANAGEMENT_NOT_FOUND',
  });
}

function throwEventManagementForbidden(): never {
  throw new AppError('You can only manage your own events', {
    statusCode: StatusCodes.FORBIDDEN,
    code: 'EVENT_MANAGEMENT_FORBIDDEN',
  });
}

function assertValidTimeRange(startAt: Date, endAt?: Date | null): void {
  if (endAt && endAt.getTime() < startAt.getTime()) {
    throw new AppError('Event end time must be after the start time', {
      statusCode: StatusCodes.BAD_REQUEST,
      code: 'EVENT_MANAGEMENT_INVALID_TIME_RANGE',
    });
  }
}

async function getActiveUser(userId: string): Promise<UserStatus> {
  const user = await authClient.getUserStatus(userId);

  if (!user || !user.isActive) {
    throw new AppError('User is not active', {
      statusCode: StatusCodes.UNAUTHORIZED,
      code: 'USER_INACTIVE',
    });
  }

  return user;
}

export const eventManagementService = {
  async list(search?: string, page = 1): Promise<EventManagement[]> {
    const events = await eventManagementRepository.list(search, page);
    return events.map(toEventManagement);
  },

  async getById(id: string): Promise<EventManagement> {
    const eventManagement = await eventManagementRepository.findById(id);

    if (!eventManagement) {
      throwEventManagementNotFound();
    }

    return toEventManagement(eventManagement);
  },

  async create(userId: string, payload: CreateEventManagementRequest): Promise<EventManagement> {
    const user = await getActiveUser(userId);
    assertValidTimeRange(
      new Date(payload.startAt),
      payload.endAt ? new Date(payload.endAt) : null,
    );

    const eventManagement = await eventManagementRepository.create(userId, user.name, payload);
    return toEventManagement(eventManagement);
  },

  async update(
    userId: string,
    eventManagementId: string,
    payload: UpdateEventManagementRequest,
  ): Promise<EventManagement> {
    await getActiveUser(userId);
    const existingEventManagement = await eventManagementRepository.findById(eventManagementId);

    if (!existingEventManagement) {
      throwEventManagementNotFound();
    }

    if (existingEventManagement.createdByUserId !== userId) {
      throwEventManagementForbidden();
    }

    const nextStartAt =
      payload.startAt !== undefined ? new Date(payload.startAt) : existingEventManagement.startAt;
    const nextEndAt =
      payload.endAt !== undefined
        ? payload.endAt
          ? new Date(payload.endAt)
          : null
        : existingEventManagement.endAt;

    assertValidTimeRange(nextStartAt, nextEndAt);

    const updatedEventManagement = await eventManagementRepository.updateById(eventManagementId, payload);
    return toEventManagement(updatedEventManagement);
  },

  async delete(userId: string, eventManagementId: string): Promise<void> {
    await getActiveUser(userId);
    const existingEventManagement = await eventManagementRepository.findById(eventManagementId);

    if (!existingEventManagement) {
      throwEventManagementNotFound();
    }

    if (existingEventManagement.createdByUserId !== userId) {
      throwEventManagementForbidden();
    }

    await eventManagementRepository.deleteById(eventManagementId);
  },
};
