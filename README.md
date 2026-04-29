# Community App Backend Template

Microservices-ready Node.js starter using:
- Express + TypeScript
- MySQL + Prisma
- CORS + Helmet + Rate limiting
- Shared contracts package
- Docker Compose for local MySQL and the full backend stack

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

1. Install dependencies:

```bash
npm install
```

2. Create per-service env files from `services/*/.env.example`:

```bash
npm run env:setup
```

3. Review the generated `services/*/.env` files and replace the placeholder JWT secrets.

4. Start MySQL and make sure your service env files point at the matching port:

- Local MySQL on your machine: use `127.0.0.1:3306`
- Docker Compose MySQL: run `npm run docker:up` and use `127.0.0.1:3307`

5. Generate Prisma client and run migrations:

```bash
npm run prisma:generate
npm run prisma:deploy
```

6. Start all services in one command:

```bash
npm run dev
```

This starts `api-gateway`, `auth-service`, `store-service`, `newsfeed-service`, and `app-service`.
If one of those services is already running on its configured port, `npm run dev` reuses the healthy instance instead of failing with `EADDRINUSE`.
If a service `.env` file is missing, `npm run dev` now creates it from that service's `.env.example` before startup.
`npm run dev` also builds the shared `@community/contracts` package before launching services so a fresh checkout has the runtime contract files available.

## Run The Full Backend In Docker

If you want MySQL plus every backend service in containers, build and start the `app` profile:

```bash
npm run docker:up:app
```

This brings up:
- `mysql` on `3307`
- `adminer` on `8080`
- `api-gateway` on `4000`
- `auth-service` on `4100`
- `store-service` on `4200`
- `newsfeed-service` on `4300`
- `app-service` on `4400`

The full Docker stack uses the checked-in env files under `infra/docker/env/*.env`, so your existing `services/*/.env` files can stay tuned for local non-Docker development on `127.0.0.1:3306`. The Docker MySQL host port defaults to `3307` to avoid conflicts with a local MySQL service already using `3306`, and you can still override it with `MYSQL_PORT`. Update the placeholder JWT secrets there before using this outside local development.

Stop everything and remove the named volumes with:

```bash
npm run docker:down
```

## cPanel Deployment

This repository is not a single root Express app, so cPanel should not be pointed at `server.ts` and it should not run any Docker script.

Use this setup instead:

1. Keep the application root at the repository root.
2. Set the application startup file to `server.js`.
3. Run `npm install` from cPanel so the root `postinstall` script can:
   - build `packages/contracts/dist`
   - generate Prisma clients for the server platform
   - install the root-level runtime dependency mirror used by shared hosting environments that do not fully install workspace package dependencies
4. Restart the Node.js app from cPanel.

Important notes:
- The previous `Script exit code: 127` happened because cPanel was running `docker:up:app`, and shared Node.js hosting does not provide `docker compose`.
- cPanel may run `postinstall` from a `nodevenv/.../lib` directory instead of the repository root. The install wrapper now redirects that step back to the real project root before running workspace commands.
- The public app should be the `api-gateway`. The new root launcher starts the other services behind it on localhost-only URLs such as `127.0.0.1:4100` and `127.0.0.1:4200`.
- Keep each service `.env` file present under `services/*/.env`. The launcher overrides internal service URLs and the public gateway port automatically.
- Run Prisma migrations separately with `npm run prisma:deploy` after your database credentials are correct.

## Fresh Environment Troubleshooting

If you copied or moved the repository to a new folder and see `Cannot find module '@community/contracts/dist/index.js'`, remove existing installs and reinstall from the current project path so local `file:` dependencies are relinked correctly.

```bash
rm -rf node_modules services/*/node_modules packages/*/node_modules
npm install
```

On Windows PowerShell:

```powershell
Remove-Item -Recurse -Force node_modules, services\*\node_modules, packages\*\node_modules
npm install
```

If Prisma reports `Authentication failed against database server`, make sure MySQL is running and that each `services/*/.env` file has a `DATABASE_URL` with valid credentials for your machine. Local non-Docker development uses `root:root` on `127.0.0.1:3306`, while the included Docker MySQL setup uses `root:root` on `127.0.0.1:3307`.

## API Endpoints

`auth-service`
- `GET /health`
- `GET /ready`
- `POST /v1/auth/register`
  Admin signups (`usertype: 1`) are created inactive and must be activated by a super admin.
- `POST /v1/auth/login`
- `POST /v1/auth/refresh`
- `POST /v1/auth/logout`
- `PATCH /v1/auth/users/:id/status`
  Super-admin-only account activation toggle with `{ "isActive": true | false | 1 | 0 }`

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
- `.env.example` defaults and port
- Prisma schema and migrations

See [Service Checklist](services/auth-service/README.md) for standards to keep across services.

## Microservices Roadmap

1. Phase 1: `auth-service` and `store-service`.
2. Phase 2: `user-service`, `community-service`, `post-service`, `comment-service`.
3. Phase 3: `notification-service`, `search-service`, `api-gateway`.
4. Communication model: REST for sync flows, async events for side-effects.
5. Rule for all services: database-per-service, shared contracts, health endpoints, structured logging.
