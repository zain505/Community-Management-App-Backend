declare namespace Express {
  interface UploadedChatAttachmentFields {
    type?: string;
    mimeType?: string;
    fileName?: string;
    sizeBytes?: string;
    width?: string;
    height?: string;
    durationMillis?: string;
  }

  interface UploadedChatAttachment {
    file: import('formidable').File;
    fields: UploadedChatAttachmentFields;
  }

  interface AuthenticatedUser {
    id: string;
    mobileNumber?: string;
  }

  interface Request {
    requestId: string;
    user?: AuthenticatedUser;
    uploadedChatAttachment?: UploadedChatAttachment;
  }
}
