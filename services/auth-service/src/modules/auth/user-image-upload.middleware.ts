import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { NextFunction, Request, Response } from 'express';
import type { File, Files } from 'formidable';
import formidable from 'formidable';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../../shared/app-error';
import { userImageTempUploadDir } from './user-image-storage';
import {
  assertValidUserImage,
  getUserImageExtension,
  maxUserImageBytes,
} from './user-image.utils';

const imageFieldNames = ['image', 'file', 'avatar'] as const;
const formidableFileTooLargeCodes = new Set([1009, 1016]);

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

function firstFile(files: Files): File | null {
  for (const fieldName of imageFieldNames) {
    const candidate = files[fieldName];

    if (Array.isArray(candidate)) {
      const file = candidate[0];

      if (file) {
        return file;
      }

      continue;
    }

    if (candidate) {
      return candidate;
    }
  }

  return null;
}

function isFormidableFileTooLargeError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    formidableFileTooLargeCodes.has(Number((error as { code?: unknown }).code))
  );
}

export async function parseUserImageUpload(req: Request, res: Response, next: NextFunction): Promise<void> {
  void res;

  if (!req.is('multipart/form-data')) {
    throw new AppError('Profile image uploads must use multipart/form-data', {
      statusCode: StatusCodes.BAD_REQUEST,
      code: 'IMAGE_UPLOAD_REQUIRES_MULTIPART',
    });
  }

  await fs.mkdir(userImageTempUploadDir, { recursive: true });

  const form = formidable({
    uploadDir: userImageTempUploadDir,
    keepExtensions: true,
    allowEmptyFiles: false,
    minFileSize: 1,
    maxFiles: 1,
    maxFileSize: maxUserImageBytes,
    filter(part) {
      return imageFieldNames.includes(part.name as (typeof imageFieldNames)[number]);
    },
  });

  let file: File | null = null;

  try {
    const [, files] = await form.parse(req);
    file = firstFile(files);

    if (!file) {
      throw new AppError('Image is required', {
        statusCode: StatusCodes.BAD_REQUEST,
        code: 'IMAGE_REQUIRED',
      });
    }

    const buffer = await fs.readFile(file.filepath);
    const mimetype = assertValidUserImage(buffer, file.mimetype);

    if (file.size > maxUserImageBytes) {
      throw new AppError('Image must be 5 MB or smaller', {
        statusCode: StatusCodes.REQUEST_TOO_LONG,
        code: 'IMAGE_TOO_LARGE',
      });
    }

    const newFilename = `${randomUUID()}${getUserImageExtension(mimetype)}`;
    const filepath = path.join(userImageTempUploadDir, newFilename);

    await fs.rename(file.filepath, filepath);

    req.uploadedUserImage = {
      filepath,
      originalFilename: file.originalFilename ?? null,
      mimetype,
      newFilename,
      size: file.size,
    };

    next();
  } catch (error) {
    await deleteFileIfPresent(file?.filepath);

    if (isFormidableFileTooLargeError(error)) {
      next(new AppError('Image must be 5 MB or smaller', {
        statusCode: StatusCodes.REQUEST_TOO_LONG,
        code: 'IMAGE_TOO_LARGE',
      }));
      return;
    }

    next(error);
  }
}
