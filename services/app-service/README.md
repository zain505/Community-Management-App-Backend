# App Service

Starter service scaffold cloned from `auth-service` for app-specific features.

## Responsibilities

- app-owned announcements
- user authentication
- access/refresh token lifecycle
- public mobile app version policy
- auth-ready health endpoints

## Local Commands

```bash
npm run dev -w services/app-service
npm run test -w services/app-service
npm run prisma:migrate -w services/app-service -- --name init
npm run prisma:seed -w services/app-service
```

This service now owns app-specific announcements while still keeping the cloned auth foundation.

## Mobile Version Policy

`GET /v1/mobile/version-policy` is public and returns the AWT mobile app update policy.
The Android build values come from environment configuration:

- `AWT_ANDROID_LATEST_BUILD`
- `AWT_ANDROID_MINIMUM_SUPPORTED_BUILD`
- `AWT_ANDROID_RECOMMENDED_BUILD`
- `AWT_ANDROID_FORCE_UPDATE`
- `AWT_ANDROID_STORE_URL`
- `AWT_ANDROID_UPDATE_TITLE`
- `AWT_ANDROID_UPDATE_MESSAGE`

Build values are optional, but when present they must be positive integers. The mobile
client should block only when `installedBuild < minimumSupportedBuild`.

Release workflow:

1. Release the new Play Store build.
2. Wait until it is live for users.
3. Raise `AWT_ANDROID_MINIMUM_SUPPORTED_BUILD`.

## Service Checklist (Use for New Services)

- Keep `GET /health` and `GET /ready`.
- Keep centralized error envelope:
  `{ success: false, code, message, details?, requestId }`.
- Validate all request bodies/params/query using `zod`.
- Keep request ID middleware and structured logging.
- Enforce per-route rate limits for sensitive endpoints.
- Keep repository layer separate from business service layer.
- Use service-owned database schema; do not share tables across services.
- Add unit + route-level integration tests.
- Keep API DTOs and event names in `packages/contracts`.
