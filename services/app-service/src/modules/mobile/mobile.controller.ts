import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getMobileVersionPolicy } from './mobile.service';

export function getVersionPolicy(_req: Request, res: Response): void {
  res.status(StatusCodes.OK).json(getMobileVersionPolicy());
}
