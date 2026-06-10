export type UserType = 0 | 1 | 2;
export type AssignableUserType = 1 | 2;

export interface RegisterRequest {
  name: string;
  mobileNumber: string;
  password: string;
}

export interface UpdateUserActivationRequest {
  isActive: boolean;
}

export interface UpdateUserTypeRequest {
  usertype: AssignableUserType;
}

export interface UpdateUserNameRequest {
  name: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface AdminResetUserPasswordRequest {
  mobileNumber: string;
  newPassword: string;
}

export interface LoginRequest {
  mobileNumber: string;
  password: string;
}

export interface TokenRefreshRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserProfile {
  image: string | null;
}

export interface UserPublic {
  id: string;
  mobileNumber: string;
  name: string;
  usertype?: UserType;
  profile: UserProfile;
  createdAt: string;
}

export interface UserStatus {
  id: string;
  mobileNumber: string;
  name: string;
  profile: UserProfile;
  isActive: boolean;
  createdAt: string;
}

export interface ManagedUserStatus extends UserStatus {
  usertype: UserType;
}

export interface AuthResponse {
  user: UserPublic & { usertype: UserType };
  tokens: AuthTokens;
}

export interface RegisterResponse {
  user: ManagedUserStatus;
  tokens?: AuthTokens;
  requiresActivation: boolean;
}

export interface PasswordChangeResponse {
  message: string;
}

export interface AdminResetUserPasswordResponse {
  message: string;
  mobileNumber: string;
}

export interface DeleteUserResponse {
  id: string;
  message: string;
}
