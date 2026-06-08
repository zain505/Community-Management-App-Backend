import fs from 'node:fs/promises';
import type { NextFunction, Request, Response } from 'express';
import type { Fields, File, Files } from 'formidable';
import formidable from 'formidable';
import { StatusCodes } from 'http-status-codes';
import { AppError } from './app-error';
import {
  deleteManagedImages,
  getImageTempUploadDir,
  maxStoredImageBytes,
  persistUploadedImage,
  type StoredImageKind,
} from './image-storage';

const imageFieldNames = ['image', 'file', 'storeImage', 'productImage'] as const;
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

function toSingleFieldValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function fieldsToBody(fields: Fields): Record<string, unknown> {
  const body: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(fields)) {
    const fieldValue = toSingleFieldValue(value);

    if (fieldValue === undefined) {
      continue;
    }

    if (key === 'products') {
      try {
        body[key] = JSON.parse(fieldValue);
      } catch {
        body[key] = fieldValue;
      }
      continue;
    }

    body[key] = fieldValue;
  }

  return body;
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

function registerUploadFailureCleanup(req: Request, res: Response): void {
  if (req.managedImageUploadCleanupRegistered) {
    return;
  }

  req.managedImageUploadCleanupRegistered = true;

  res.once('finish', () => {
    if (res.statusCode < 400 || !req.managedImageUploadUrls?.length) {
      return;
    }

    void deleteManagedImages(req.managedImageUploadUrls);
  });
}

export function parseImageUpload(kind: StoredImageKind) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.is('multipart/form-data')) {
      next();
      return;
    }

    const tempUploadDir = getImageTempUploadDir(kind);
    await fs.mkdir(tempUploadDir, { recursive: true });

    const form = formidable({
      uploadDir: tempUploadDir,
      keepExtensions: true,
      allowEmptyFiles: false,
      minFileSize: 1,
      maxFiles: 1,
      maxFileSize: maxStoredImageBytes,
      filter(part) {
        if (!imageFieldNames.includes(part.name as (typeof imageFieldNames)[number])) {
          return true;
        }

        return Boolean(part.mimetype?.toLowerCase().startsWith('image/'));
      },
    });

    let file: File | null = null;

    try {
      const [fields, files] = await form.parse(req);
      req.body = fieldsToBody(fields);
      file = firstFile(files);

      if (file) {
        const imageUrl = await persistUploadedImage(file, kind);
        req.body.image = imageUrl;
        req.managedImageUploadUrls = [...(req.managedImageUploadUrls ?? []), imageUrl];
        registerUploadFailureCleanup(req, res);
      }

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
  };
}
