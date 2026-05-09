import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { StatusCodes } from 'http-status-codes';
import { AppError } from './app-error';

export const maxStoredImageBytes = 5 * 1024 * 1024;

export type StoredImageMimeType = 'image/gif' | 'image/jpeg' | 'image/png' | 'image/webp';

const supportedImageMimeTypes = new Set<StoredImageMimeType>([
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/webp',
]);
const base64Pattern = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
const base64DataUrlPattern = /^data:(?<mimetype>[^;,]+);base64,(?<payload>[\s\S]+)$/i;
const pngSignature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const jpegSignature = [0xff, 0xd8, 0xff];
const gif87aSignature = [0x47, 0x49, 0x46, 0x38, 0x37, 0x61];
const gif89aSignature = [0x47, 0x49, 0x46, 0x38, 0x39, 0x61];
const webpRiffSignature = [0x52, 0x49, 0x46, 0x46];
const webpSignature = [0x57, 0x45, 0x42, 0x50];

export const newsFeedUploadsRootDir = path.resolve(__dirname, '../../uploads');
const newsFeedImageUploadDir = path.join(newsFeedUploadsRootDir, 'newsfeed-images');
const newsFeedImagePublicPathPrefix = '/uploads/newsfeed-images';

function createInvalidImageUploadError(): AppError {
  return new AppError('Image must be a valid base64-encoded JPEG, PNG, WEBP, or GIF', {
    statusCode: StatusCodes.BAD_REQUEST,
    code: 'INVALID_IMAGE_UPLOAD',
  });
}

function createInvalidImageTypeError(): AppError {
  return new AppError('Only JPEG, PNG, WEBP, and GIF images are allowed', {
    statusCode: StatusCodes.BAD_REQUEST,
    code: 'INVALID_IMAGE_TYPE',
  });
}

function normalizeDeclaredMimeType(mimetype: string): StoredImageMimeType | null {
  const normalizedMimeType = mimetype.trim().toLowerCase();

  if (normalizedMimeType === 'image/jpg') {
    return 'image/jpeg';
  }

  if (!supportedImageMimeTypes.has(normalizedMimeType as StoredImageMimeType)) {
    return null;
  }

  return normalizedMimeType as StoredImageMimeType;
}

function hasSignature(buffer: Buffer, signature: number[], offset = 0): boolean {
  if (buffer.length < signature.length + offset) {
    return false;
  }

  return signature.every((byte, index) => buffer[index + offset] === byte);
}

function decodeBase64Payload(payload: string): Buffer {
  const normalizedPayload = payload.replace(/\s+/g, '');

  if (!normalizedPayload) {
    throw createInvalidImageUploadError();
  }

  if (!base64Pattern.test(normalizedPayload) || normalizedPayload.length % 4 === 1) {
    throw createInvalidImageUploadError();
  }

  const paddingLength = (4 - (normalizedPayload.length % 4)) % 4;
  const paddedPayload = normalizedPayload.padEnd(normalizedPayload.length + paddingLength, '=');
  const buffer = Buffer.from(paddedPayload, 'base64');

  if (!buffer.length) {
    throw createInvalidImageUploadError();
  }

  const normalizedWithoutPadding = normalizedPayload.replace(/=+$/, '');
  const decodedWithoutPadding = buffer.toString('base64').replace(/=+$/, '');

  if (decodedWithoutPadding !== normalizedWithoutPadding) {
    throw createInvalidImageUploadError();
  }

  if (buffer.length > maxStoredImageBytes) {
    throw new AppError('Image must be 5 MB or smaller', {
      statusCode: StatusCodes.REQUEST_TOO_LONG,
      code: 'IMAGE_TOO_LARGE',
    });
  }

  return buffer;
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

export function isBase64ImageInput(image: string): boolean {
  const trimmedImage = image.trim();

  if (!trimmedImage) {
    return false;
  }

  if (/^(?:https?:)?\/\//i.test(trimmedImage) || trimmedImage.startsWith('/')) {
    return false;
  }

  if (base64DataUrlPattern.test(trimmedImage)) {
    return true;
  }

  return trimmedImage.length >= 8 && base64Pattern.test(trimmedImage);
}

export function parseBase64Image(image: string): {
  buffer: Buffer;
  mimetype: StoredImageMimeType;
} {
  const trimmedImage = image.trim();
  const dataUrlMatch = base64DataUrlPattern.exec(trimmedImage);
  const declaredMimeType = dataUrlMatch?.groups?.mimetype
    ? normalizeDeclaredMimeType(dataUrlMatch.groups.mimetype)
    : null;
  const payload = dataUrlMatch?.groups?.payload ?? trimmedImage;

  if (dataUrlMatch?.groups?.mimetype && !declaredMimeType) {
    throw createInvalidImageTypeError();
  }

  const buffer = decodeBase64Payload(payload);
  const detectedMimeType = detectStoredImageMimeType(buffer);

  if (!detectedMimeType || (declaredMimeType && declaredMimeType !== detectedMimeType)) {
    throw createInvalidImageTypeError();
  }

  return {
    buffer,
    mimetype: detectedMimeType,
  };
}

export function buildNewsFeedImagePublicPath(filename: string): string {
  return `${newsFeedImagePublicPathPrefix}/${filename}`;
}

export function resolveNewsFeedImagePublicPath(publicPath: string): string | null {
  if (!publicPath.startsWith(`${newsFeedImagePublicPathPrefix}/`)) {
    return null;
  }

  const relativePath = publicPath.slice('/uploads/'.length);
  return path.join(newsFeedUploadsRootDir, relativePath);
}

export async function persistBase64Image(image: string): Promise<string> {
  const { buffer, mimetype } = parseBase64Image(image);

  await fs.mkdir(newsFeedImageUploadDir, { recursive: true });

  const filename = `${randomUUID()}${getStoredImageExtension(mimetype)}`;
  await fs.writeFile(path.join(newsFeedImageUploadDir, filename), buffer);

  return buildNewsFeedImagePublicPath(filename);
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
