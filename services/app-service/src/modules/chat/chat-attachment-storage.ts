import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { ChatAttachmentType } from '@community/contracts';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../../shared/app-error';

const extensionByMimeType: Record<string, string> = {
  'audio/m4a': '.m4a',
  'audio/mp4': '.m4a',
  'audio/webm': '.webm',
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

export const appUploadsRootDir = path.resolve(__dirname, '../../../uploads');
export const chatAttachmentUploadDir = path.join(appUploadsRootDir, 'chat');
export const chatAttachmentTempUploadDir = path.join(appUploadsRootDir, 'tmp', 'chat');
export const chatAttachmentPublicPathPrefix = '/uploads/chat';

export async function ensureChatAttachmentUploadDirs(): Promise<void> {
  await Promise.all([
    fs.mkdir(chatAttachmentUploadDir, { recursive: true }),
    fs.mkdir(chatAttachmentTempUploadDir, { recursive: true }),
  ]);
}

export function buildChatAttachmentPublicPath(filename: string): string {
  return `${chatAttachmentPublicPathPrefix}/${filename}`;
}

export function buildChatAttachmentDownloadPath(id: string): string {
  return `/v1/chat/attachments/${id}/download`;
}

export function buildStoredChatAttachmentFilename(type: ChatAttachmentType, mimeType: string): string {
  const extension = extensionByMimeType[mimeType];

  if (!extension) {
    throw new AppError('Attachment type is not supported', {
      statusCode: StatusCodes.BAD_REQUEST,
      code: 'CHAT_ATTACHMENT_INVALID_TYPE',
    });
  }

  return `${type}-${randomUUID()}${extension}`;
}

export async function deleteFileIfPresent(filePath: string | null | undefined): Promise<void> {
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
