# App Service

Starter service scaffold cloned from `auth-service` for app-specific features.

## Responsibilities

- app-owned announcements
- user authentication
- access/refresh token lifecycle
- auth-ready health endpoints

## Local Commands

```bash
npm run dev -w services/app-service
npm run test -w services/app-service
npm run prisma:migrate -w services/app-service -- --name init
npm run prisma:seed -w services/app-service
```

This service now owns app-specific announcements while still keeping the cloned auth foundation.

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
