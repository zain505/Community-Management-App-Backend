# Auth Service

Reference implementation for the first microservice in this workspace.

## Responsibilities

- user authentication
- access/refresh token lifecycle
- auth-ready health endpoints

## Local Commands

```bash
npm run dev -w services/auth-service
npm run test -w services/auth-service
npm run prisma:migrate -w services/auth-service -- --name init
npm run prisma:seed -w services/auth-service
```

Store and product APIs have been moved to `services/store-service`.

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
