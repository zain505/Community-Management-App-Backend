import path from 'node:path';
import { toPublicAssetPath, toPublicAssetUrl } from '../../shared/public-asset-url';

export const authUploadsRootDir = path.resolve(__dirname, '../../../uploads');
export const userImageUploadDir = path.join(authUploadsRootDir, 'user-images');
export const userImageTempUploadDir = path.join(authUploadsRootDir, 'tmp', 'user-images');
export const userImagePublicPathPrefix = '/uploads/user-images';

export function buildUserImagePublicPath(filename: string): string {
  return toPublicAssetUrl(`${userImagePublicPathPrefix}/${filename}`);
}

export function resolveUserImagePublicPath(publicPath: string): string | null {
  const assetPath = toPublicAssetPath(publicPath);

  if (!assetPath.startsWith(`${userImagePublicPathPrefix}/`)) {
    return null;
  }

  const relativePath = assetPath.slice('/uploads/'.length);
  return path.join(authUploadsRootDir, relativePath);
}
