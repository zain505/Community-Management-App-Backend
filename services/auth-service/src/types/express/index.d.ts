declare namespace Express {
  interface UploadedUserImage {
    filepath: string;
    originalFilename: string | null;
    mimetype: string | null;
    newFilename: string;
    size: number;
  }

  interface AuthenticatedUser {
    id: string;
    mobileNumber?: string;
  }

  interface Request {
    requestId: string;
    user?: AuthenticatedUser;
    uploadedUserImage?: UploadedUserImage;
  }
}
