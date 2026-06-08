import { StatusCodes } from 'http-status-codes';
import { AppError } from '../../shared/app-error';

export const maxUserImageBytes = 5 * 1024 * 1024;

export type UserImageMimeType = 'image/jpeg' | 'image/png';

const pngSignature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const jpegSignature = [0xff, 0xd8, 0xff];

export function normalizeUserImageMimeType(mimetype: string | null | undefined): UserImageMimeType | null {
  const normalizedMimeType = mimetype?.trim().toLowerCase() ?? '';

  if (normalizedMimeType === 'image/jpg') {
    return 'image/jpeg';
  }

  if (normalizedMimeType !== 'image/jpeg' && normalizedMimeType !== 'image/png') {
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

export function detectUserImageMimeType(buffer: Buffer): UserImageMimeType | null {
  if (hasSignature(buffer, pngSignature)) {
    return 'image/png';
  }

  if (hasSignature(buffer, jpegSignature)) {
    return 'image/jpeg';
  }

  return null;
}

export function assertValidUserImage(buffer: Buffer, declaredMimeType: string | null | undefined): UserImageMimeType {
  if (buffer.length > maxUserImageBytes) {
    throw new AppError('Image must be 5 MB or smaller', {
      statusCode: StatusCodes.REQUEST_TOO_LONG,
      code: 'IMAGE_TOO_LARGE',
    });
  }

  const normalizedDeclaredMimeType = normalizeUserImageMimeType(declaredMimeType);
  const detectedMimeType = detectUserImageMimeType(buffer);

  if (!detectedMimeType || (normalizedDeclaredMimeType && normalizedDeclaredMimeType !== detectedMimeType)) {
    throw new AppError('Only JPEG and PNG images are allowed', {
      statusCode: StatusCodes.BAD_REQUEST,
      code: 'INVALID_IMAGE_TYPE',
    });
  }

  return detectedMimeType;
}

export function getUserImageExtension(mimetype: string | null): string {
  return mimetype === 'image/png' ? '.png' : '.jpg';
}
