import type { Fields, File, Files } from 'formidable';
import formidable from 'formidable';
import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../../shared/app-error';
import { CHAT_ATTACHMENT_UPLOAD_MAX_FILE_SIZE_BYTES } from './chat.constants';
import { chatAttachmentTempUploadDir, ensureChatAttachmentUploadDirs } from './chat-attachment-storage';

function getSingleFieldValue(fields: Fields, fieldName: keyof Express.UploadedChatAttachmentFields): string | undefined {
  const value = fields[fieldName];

  if (Array.isArray(value)) {
    return typeof value[0] === 'string' ? value[0] : undefined;
  }

  return typeof value === 'string' ? value : undefined;
}

function getUploadedFile(files: Files): File | null {
  const value = files.file;

  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

function isTooLargeUploadError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const uploadError = error as {
    code?: unknown;
    httpCode?: unknown;
    message?: unknown;
  };

  return (
    uploadError.code === 1009 ||
    uploadError.httpCode === StatusCodes.REQUEST_TOO_LONG ||
    (typeof uploadError.message === 'string' && /maxfilesize/i.test(uploadError.message))
  );
}

export async function parseChatAttachmentUpload(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  void res;

  if (!req.is('multipart/form-data')) {
    throw new AppError('Chat attachment uploads must use multipart/form-data', {
      statusCode: StatusCodes.BAD_REQUEST,
      code: 'VALIDATION_ERROR',
    });
  }

  await ensureChatAttachmentUploadDirs();

  const form = formidable({
    uploadDir: chatAttachmentTempUploadDir,
    keepExtensions: true,
    allowEmptyFiles: false,
    minFileSize: 1,
    maxFiles: 1,
    maxFileSize: CHAT_ATTACHMENT_UPLOAD_MAX_FILE_SIZE_BYTES,
    filter: (part) => part.name === 'file',
  });

  try {
    const [fields, files] = await form.parse(req);
    const file = getUploadedFile(files);

    if (!file) {
      throw new AppError('Attachment file is required', {
        statusCode: StatusCodes.BAD_REQUEST,
        code: 'VALIDATION_ERROR',
      });
    }

    req.uploadedChatAttachment = {
      file,
      fields: {
        type: getSingleFieldValue(fields, 'type'),
        mimeType: getSingleFieldValue(fields, 'mimeType'),
        fileName: getSingleFieldValue(fields, 'fileName'),
        sizeBytes: getSingleFieldValue(fields, 'sizeBytes'),
        width: getSingleFieldValue(fields, 'width'),
        height: getSingleFieldValue(fields, 'height'),
        durationMillis: getSingleFieldValue(fields, 'durationMillis'),
      },
    };

    next();
  } catch (error) {
    if (isTooLargeUploadError(error)) {
      throw new AppError('Attachment exceeds the maximum allowed size', {
        statusCode: StatusCodes.REQUEST_TOO_LONG,
        code: 'CHAT_ATTACHMENT_TOO_LARGE',
      });
    }

    throw error;
  }
}
