import path from 'node:path';

export const authUploadsRootDir = path.resolve(__dirname, '../../../uploads');
export const userImageUploadDir = path.join(authUploadsRootDir, 'user-images');
export const userImageTempUploadDir = path.join(authUploadsRootDir, 'tmp', 'user-images');
export const userImagePublicPathPrefix = '/uploads/user-images';

export function buildUserImagePublicPath(filename: string): string {
  return `${userImagePublicPathPrefix}/${filename}`;
}

export function resolveUserImagePublicPath(publicPath: string): string | null {
  if (!publicPath.startsWith(`${userImagePublicPathPrefix}/`)) {
    return null;
  }

  const relativePath = publicPath.slice('/uploads/'.length);
  return path.join(authUploadsRootDir, relativePath);
}
