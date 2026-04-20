import { z } from 'zod';

const base64Pattern = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

function isBase64Image(value: string): boolean {
  const trimmedValue = value.trim();
  const dataUriMatch = trimmedValue.match(/^data:image\/[a-zA-Z0-9.+-]+;base64,(.+)$/);
  const base64Value = dataUriMatch ? dataUriMatch[1] : trimmedValue;

  return base64Value.length >= 8 && base64Pattern.test(base64Value);
}

function isUrl(value: string): boolean {
  return z.string().url().safeParse(value).success;
}

export const base64ImageSchema = z.string().trim().refine(isBase64Image, {
  message: 'Image must be a base64 string or data URI',
});

export const productImageSchema = z.string().trim().refine((value) => isUrl(value) || isBase64Image(value), {
  message: 'Image must be a valid URL or a base64 string/data URI',
});
