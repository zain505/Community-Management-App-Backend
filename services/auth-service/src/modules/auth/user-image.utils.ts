import { StatusCodes } from 'http-status-codes';
import { AppError } from '../../shared/app-error';

export const maxUserImageBytes = 5 * 1024 * 1024;

export type UserImageMimeType = 'image/jpeg' | 'image/png';

const supportedUserImageMimeTypes = new Set<UserImageMimeType>(['image/jpeg', 'image/png']);
const base64DataUrlPattern = /^data:(?<mimetype>[^;,]+);base64,(?<payload>[\s\S]+)$/i;
const pngSignature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const jpegSignature = [0xff, 0xd8, 0xff];

function createInvalidImageUploadError(): AppError {
  return new AppError('Image must be a valid base64-encoded JPEG or PNG', {
    statusCode: StatusCodes.BAD_REQUEST,
    code: 'INVALID_IMAGE_UPLOAD',
  });
}

function normalizeDeclaredMimeType(mimetype: string): UserImageMimeType | null {
  const normalizedMimeType = mimetype.trim().toLowerCase();

  if (normalizedMimeType === 'image/jpg') {
    return 'image/jpeg';
  }

  if (!supportedUserImageMimeTypes.has(normalizedMimeType as UserImageMimeType)) {
    return null;
  }

  return normalizedMimeType as UserImageMimeType;
}

function hasSignature(buffer: Buffer, signature: number[]): boolean {
  if (buffer.length < signature.length) {
    return false;
  }

  return signature.every((byte, index) => buffer[index] === byte);
}

function decodeBase64Payload(payload: string): Buffer {
  const normalizedPayload = payload.replace(/\s+/g, '');

  if (!normalizedPayload) {
    throw createInvalidImageUploadError();
  }

  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(normalizedPayload) || normalizedPayload.length % 4 === 1) {
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

  if (buffer.length > maxUserImageBytes) {
    throw new AppError('Image must be 5 MB or smaller', {
      statusCode: StatusCodes.REQUEST_TOO_LONG,
      code: 'IMAGE_TOO_LARGE',
    });
  }

  return buffer;
}

export function detectUserImageMimeType(buffer: Buffer): UserImageMimeType | null {
  if (hasSignature(buffer, pngSignature)) {
    return 'image/png';
  }

  if (hasSignature(buffer, jpegSignature)) {
    return 'image/jpeg';
  }

  return null;
}

export function parseBase64UserImage(image: string): { buffer: Buffer; mimetype: UserImageMimeType } {
  const trimmedImage = image.trim();
  const dataUrlMatch = base64DataUrlPattern.exec(trimmedImage);
  const declaredMimeType = dataUrlMatch?.groups?.mimetype
    ? normalizeDeclaredMimeType(dataUrlMatch.groups.mimetype)
    : null;
  const payload = dataUrlMatch?.groups?.payload ?? trimmedImage;

  if (dataUrlMatch?.groups?.mimetype && !declaredMimeType) {
    throw new AppError('Only JPEG and PNG images are allowed', {
      statusCode: StatusCodes.BAD_REQUEST,
      code: 'INVALID_IMAGE_TYPE',
    });
  }

  const buffer = decodeBase64Payload(payload);
  const detectedMimeType = detectUserImageMimeType(buffer);

  if (!detectedMimeType || (declaredMimeType && declaredMimeType !== detectedMimeType)) {
    throw new AppError('Only JPEG and PNG images are allowed', {
      statusCode: StatusCodes.BAD_REQUEST,
      code: 'INVALID_IMAGE_TYPE',
    });
  }

  return {
    buffer,
    mimetype: detectedMimeType,
  };
}

export function getUserImageExtension(mimetype: string | null): string {
  return mimetype === 'image/png' ? '.png' : '.jpg';
}

export function toBase64DataUrl(buffer: Buffer, mimetype: UserImageMimeType): string {
  return `data:${mimetype};base64,${buffer.toString('base64')}`;
}
