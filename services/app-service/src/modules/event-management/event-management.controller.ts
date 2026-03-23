import type {
  CreateEventManagementRequest,
  EventManagementListQuery,
  UpdateEventManagementRequest,
} from '@community/contracts';
import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendSuccess } from '../../lib/http';
import { AppError } from '../../shared/app-error';
import { eventManagementService } from './event-management.service';

function getAuthenticatedUserId(req: Request): string {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError('Access token is required', {
      statusCode: StatusCodes.UNAUTHORIZED,
      code: 'UNAUTHORIZED',
    });
  }

  return userId;
}

function getEventManagementId(req: Request): string {
  return (req.params as { id: string }).id;
}

export async function listEventManagement(req: Request, res: Response): Promise<void> {
  const query = req.query as EventManagementListQuery;
  const events = await eventManagementService.list(query.search, query.page);
  sendSuccess(res, StatusCodes.OK, events);
}

export async function getEventManagement(req: Request, res: Response): Promise<void> {
  const eventManagement = await eventManagementService.getById(getEventManagementId(req));
  sendSuccess(res, StatusCodes.OK, eventManagement);
}

export async function createEventManagement(req: Request, res: Response): Promise<void> {
  const eventManagement = await eventManagementService.create(
    getAuthenticatedUserId(req),
    req.body as CreateEventManagementRequest,
  );
  sendSuccess(res, StatusCodes.CREATED, eventManagement);
}

export async function updateEventManagement(req: Request, res: Response): Promise<void> {
  const eventManagement = await eventManagementService.update(
    getAuthenticatedUserId(req),
    getEventManagementId(req),
    req.body as UpdateEventManagementRequest,
  );
  sendSuccess(res, StatusCodes.OK, eventManagement);
}

export async function deleteEventManagement(req: Request, res: Response): Promise<void> {
  await eventManagementService.delete(getAuthenticatedUserId(req), getEventManagementId(req));
  sendSuccess(res, StatusCodes.OK, {
    message: 'Event deleted',
  });
}
