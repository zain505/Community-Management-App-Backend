export const EVENT_NAMES = {
  USER_CREATED_V1: 'user.created.v1',
  AUTH_LOGIN_SUCCEEDED_V1: 'auth.login.succeeded.v1',
  AUTH_LOGOUT_SUCCEEDED_V1: 'auth.logout.succeeded.v1',
} as const;

export type EventName = (typeof EVENT_NAMES)[keyof typeof EVENT_NAMES];
