# Community App Backend Template

Microservices-ready Node.js starter using:
- Express + TypeScript
- MySQL + Prisma
- CORS + Helmet + Rate limiting
- Shared contracts package
- Docker Compose for local MySQL

## Workspace Layout

```text
.
|-- infra/docker
|-- packages/contracts
|-- scripts
`-- services
    |-- api-gateway
    |-- app-service
    |-- auth-service
    |-- newsfeed-service
    `-- store-service
```

## Quick Start

1. Copy `.env.example` to `.env` and set secure JWT secrets.
2. Make sure Docker Desktop is running, then start MySQL:

```bash
npm run docker:up
```

3. Install dependencies:

```bash
npm install
```

4. Generate Prisma client and run migrations:

```bash
npm run prisma:generate
npm run prisma:deploy
```

5. Start all services in one command:

```bash
npm run dev
```

This starts `api-gateway`, `auth-service`, `store-service`, `newsfeed-service`, and `app-service`.
If one of those services is already running on its configured port, `npm run dev` reuses the healthy instance instead of failing with `EADDRINUSE`.

## API Endpoints

`auth-service`
- `GET /health`
- `GET /ready`
- `POST /v1/auth/register`
- `POST /v1/auth/login`
- `POST /v1/auth/refresh`
- `POST /v1/auth/logout`

`store-service`
- `GET /health`
- `GET /ready`
- `GET /v1/stores` (public, supports `?search=`)
- `GET /v1/stores/me` (authenticated)
- `GET /v1/stores/me/products` (authenticated)
- `POST /v1/stores` (authenticated, one store per user)
- `PATCH /v1/stores/me` (authenticated)
- `DELETE /v1/stores/me` (authenticated)

## Testing and Quality

```bash
npm run lint
npm run typecheck
npm run test
```

## Clone Template for New Service

```bash
npm run create:service -- user-service
```

After cloning, adjust:
- service-specific routes/modules
- `.env` defaults and port
- Prisma schema and migrations

See [Service Checklist](services/auth-service/README.md) for standards to keep across services.

## Microservices Roadmap

1. Phase 1: `auth-service` and `store-service`.
2. Phase 2: `user-service`, `community-service`, `post-service`, `comment-service`.
3. Phase 3: `notification-service`, `search-service`, `api-gateway`.
4. Communication model: REST for sync flows, async events for side-effects.
5. Rule for all services: database-per-service, shared contracts, health endpoints, structured logging.
