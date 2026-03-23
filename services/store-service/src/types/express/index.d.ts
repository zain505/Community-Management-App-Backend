declare namespace Express {
  interface AuthenticatedUser {
    id: string;
    mobileNumber?: string;
  }

  interface Request {
    requestId: string;
    user?: AuthenticatedUser;
  }
}
