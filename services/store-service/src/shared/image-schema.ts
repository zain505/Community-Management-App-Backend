import { z } from 'zod';

function isUrl(value: string): boolean {
  return z.string().url().safeParse(value).success;
}

export const productImageSchema = z.string().trim().refine(isUrl, {
  message: 'Image must be a valid URL',
});
