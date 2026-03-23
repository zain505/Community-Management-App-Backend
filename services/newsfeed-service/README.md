# Store Service

Dedicated microservice for store and store-product management.

## Responsibilities

- store profile management (one store per authenticated user)
- store product management
- public store discovery/search
- health and readiness endpoints

## Local Commands

```bash
npm run dev -w services/store-service
npm run test -w services/store-service
npm run prisma:migrate -w services/store-service -- --name init
npm run prisma:seed -w services/store-service
```

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
