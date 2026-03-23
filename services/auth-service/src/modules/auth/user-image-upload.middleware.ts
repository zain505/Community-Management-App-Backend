import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../../shared/app-error';
import { userImageTempUploadDir } from './user-image-storage';
import { getUserImageExtension, parseBase64UserImage } from './user-image.utils';

const imageFieldName = 'image';

async function deleteFileIfPresent(filePath: string | null | undefined): Promise<void> {
  if (!filePath) {
    return;
  }

  try {
    await fs.unlink(filePath);
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;

    if (nodeError.code !== 'ENOENT') {
      throw error;
    }
  }
}

export async function parseUserImageUpload(req: Request, res: Response, next: NextFunction): Promise<void> {
  void res;

  const image = (req.body as { image?: unknown })[imageFieldName];

  if (typeof image !== 'string' || !image.trim()) {
    throw new AppError('Image is required', {
      statusCode: StatusCodes.BAD_REQUEST,
      code: 'IMAGE_REQUIRED',
    });
  }

  await fs.mkdir(userImageTempUploadDir, { recursive: true });
  const { buffer, mimetype } = parseBase64UserImage(image);
  const newFilename = `${randomUUID()}${getUserImageExtension(mimetype)}`;
  const filepath = path.join(userImageTempUploadDir, newFilename);

  try {
    await fs.writeFile(filepath, buffer);

    req.uploadedUserImage = {
      filepath,
      originalFilename: null,
      mimetype,
      newFilename,
      size: buffer.length,
    };

    next();
  } catch (error) {
    await deleteFileIfPresent(filepath);
    next(error);
  }
}
