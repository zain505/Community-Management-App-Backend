import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { File } from 'formidable';
import { StatusCodes } from 'http-status-codes';
import { AppError } from './app-error';
import { toPublicAssetPath, toPublicAssetUrl } from './public-asset-url';

export const maxStoredImageBytes = 5 * 1024 * 1024;

export type StoredImageMimeType = 'image/gif' | 'image/jpeg' | 'image/png' | 'image/webp';

const pngSignature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const jpegSignature = [0xff, 0xd8, 0xff];
const gif87aSignature = [0x47, 0x49, 0x46, 0x38, 0x37, 0x61];
const gif89aSignature = [0x47, 0x49, 0x46, 0x38, 0x39, 0x61];
const webpRiffSignature = [0x52, 0x49, 0x46, 0x46];
const webpSignature = [0x57, 0x45, 0x42, 0x50];

export const newsFeedUploadsRootDir = path.resolve(__dirname, '../../uploads');
const newsFeedImageUploadDir = path.join(newsFeedUploadsRootDir, 'newsfeed-images');
export const newsFeedImageTempUploadDir = path.join(newsFeedUploadsRootDir, 'tmp', 'newsfeed-images');
const newsFeedImagePublicPathPrefix = '/uploads/newsfeed-images';

function createInvalidImageTypeError(): AppError {
  return new AppError('Only JPEG, PNG, WEBP, and GIF images are allowed', {
    statusCode: StatusCodes.BAD_REQUEST,
    code: 'INVALID_IMAGE_TYPE',
  });
}

function normalizeDeclaredMimeType(mimetype: string | null | undefined): StoredImageMimeType | null {
  const normalizedMimeType = mimetype?.trim().toLowerCase() ?? '';

  if (normalizedMimeType === 'image/jpg') {
    return 'image/jpeg';
  }

  if (
    normalizedMimeType !== 'image/gif' &&
    normalizedMimeType !== 'image/jpeg' &&
    normalizedMimeType !== 'image/png' &&
    normalizedMimeType !== 'image/webp'
  ) {
    return null;
  }

  return normalizedMimeType;
}

function hasSignature(buffer: Buffer, signature: number[], offset = 0): boolean {
  if (buffer.length < signature.length + offset) {
    return false;
  }

  return signature.every((byte, index) => buffer[index + offset] === byte);
}

function detectStoredImageMimeType(buffer: Buffer): StoredImageMimeType | null {
  if (hasSignature(buffer, pngSignature)) {
    return 'image/png';
  }

  if (hasSignature(buffer, jpegSignature)) {
    return 'image/jpeg';
  }

  if (hasSignature(buffer, gif87aSignature) || hasSignature(buffer, gif89aSignature)) {
    return 'image/gif';
  }

  if (hasSignature(buffer, webpRiffSignature) && hasSignature(buffer, webpSignature, 8)) {
    return 'image/webp';
  }

  return null;
}

function getStoredImageExtension(mimetype: StoredImageMimeType): string {
  switch (mimetype) {
    case 'image/png':
      return '.png';
    case 'image/webp':
      return '.webp';
    case 'image/gif':
      return '.gif';
    default:
      return '.jpg';
  }
}

function assertValidUploadedImage(buffer: Buffer, declaredMimeType: string | null | undefined): StoredImageMimeType {
  if (!buffer.length) {
    throw new AppError('Image file is required', {
      statusCode: StatusCodes.BAD_REQUEST,
      code: 'INVALID_IMAGE_UPLOAD',
    });
  }

  if (buffer.length > maxStoredImageBytes) {
    throw new AppError('Image must be 5 MB or smaller', {
      statusCode: StatusCodes.REQUEST_TOO_LONG,
      code: 'IMAGE_TOO_LARGE',
    });
  }

  const normalizedDeclaredMimeType = normalizeDeclaredMimeType(declaredMimeType);
  const detectedMimeType = detectStoredImageMimeType(buffer);

  if (!detectedMimeType || (normalizedDeclaredMimeType && normalizedDeclaredMimeType !== detectedMimeType)) {
    throw createInvalidImageTypeError();
  }

  return detectedMimeType;
}

export function buildNewsFeedImagePublicPath(filename: string): string {
  return `${newsFeedImagePublicPathPrefix}/${filename}`;
}

export function buildNewsFeedImagePublicUrl(filename: string): string {
  return toPublicAssetUrl(buildNewsFeedImagePublicPath(filename));
}

export function resolveNewsFeedImagePublicPath(publicPath: string): string | null {
  const assetPath = toPublicAssetPath(publicPath);

  if (!assetPath.startsWith(`${newsFeedImagePublicPathPrefix}/`)) {
    return null;
  }

  const relativePath = assetPath.slice('/uploads/'.length);
  return path.join(newsFeedUploadsRootDir, relativePath);
}

export async function persistUploadedImage(file: File): Promise<string> {
  const buffer = await fs.readFile(file.filepath);
  const mimetype = assertValidUploadedImage(buffer, file.mimetype);
  const filename = `${randomUUID()}${getStoredImageExtension(mimetype)}`;
  const destinationPath = path.join(newsFeedImageUploadDir, filename);

  await fs.mkdir(newsFeedImageUploadDir, { recursive: true });
  await fs.rename(file.filepath, destinationPath);

  return buildNewsFeedImagePublicUrl(filename);
}

export async function deleteManagedImages(imagePaths: Iterable<string>): Promise<void> {
  const uniquePaths = new Set(imagePaths);

  for (const imagePath of uniquePaths) {
    const resolvedPath = resolveNewsFeedImagePublicPath(imagePath);

    if (!resolvedPath) {
      continue;
    }

    try {
      await fs.unlink(resolvedPath);
    } catch (error) {
      const nodeError = error as NodeJS.ErrnoException;

      if (nodeError.code !== 'ENOENT') {
        throw error;
      }
    }
  }
}
