export interface RegisterRequest {
    name: string;
    mobileNumber: string;
    password: string;
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
export interface AuthResponse {
    user: UserPublic;
    tokens: AuthTokens;
}
//# sourceMappingURL=auth.d.ts.map
