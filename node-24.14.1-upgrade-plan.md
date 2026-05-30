# Node 24.14.1 Upgrade Plan

## Short Answer

- Upgrading this repo from Node `20.14.0` to `24.14.1` is a low-to-medium risk change if we keep the current lockfile and do not combine it with major library upgrades.
- No installed package in the current `package-lock.json` declares a `node` engine range that excludes `24.14.1`.
- If we keep the existing `package-lock.json` and use `npm ci`, libraries will not automatically update just because Node changes.
- The repo still needs explicit Node 24 pinning in `package.json` and `infra/docker/Dockerfile`.

## Snapshot Taken

- Audit date: `2026-05-30`
- Local validation runtime used for this audit: `node v24.14.1`
- Local npm version used for this audit: `npm 11.11.0`
- Workspace layout: root + `5` services + `1` shared contracts package
- Prisma is used across all services, and generated clients are committed under `services/*/src/generated/prisma`

## Current Repo Findings

- Root engine is still `>=20.14.0` in `package.json`.
- Docker still builds on `node:20-bookworm-slim` in `infra/docker/Dockerfile`.
- No `.nvmrc`, `.node-version`, or repo-local Node pinning file was found.
- No in-repo CI config was found, so any external CI/CD or VPS build script that pins Node 20 must be updated separately.

## Impact Assessment

### Overall Risk

- Node runtime bump only: `Low to medium`
- Node runtime bump plus major dependency upgrades: `Medium to high`

### Why

- `npm.cmd run typecheck` passed on Node `24.14.1`.
- Lockfile scan found `0` installed packages with an `engines.node` range incompatible with `24.14.1`.
- The test suite mostly passed on Node `24.14.1`.
- The main blast radius is infrastructure and tooling, not business logic:
  - Docker image and any external CI/CD Node pin
  - Prisma client generation and runtime engines
  - dev tooling used in every service: `ts-node-dev`, `ts-node`, ESLint, Jest

## Validation Results On Node 24.14.1

| Check | Result | Notes |
| --- | --- | --- |
| `node -v` | Pass | `v24.14.1` |
| `npm.cmd -v` | Pass | `11.11.0` |
| `npm.cmd run typecheck` | Pass | All workspaces passed |
| `npm.cmd run lint` | Fail | ESLint scans generated Prisma declarations under `services/*/src/generated/prisma/**` while `.eslintrc.cjs` only ignores `dist/`, `coverage/`, and `node_modules/` |
| `npm.cmd test` | Mixed | All suites passed except `services/app-service/tests/unit/chat.service.test.ts` |

### Notes About The Observed Failures

- The lint failure does not look Node-24-specific. It is caused by generated Prisma files being included in lint scope.
- The failing app-service test also does not look Node-24-specific. It is date-sensitive:
  - `services/app-service/src/modules/chat/chat.constants.ts` defines chat retention as one month.
  - `services/app-service/tests/unit/chat.service.test.ts` uses a hard-coded message date of `2026-03-20T10:00:00.000Z`.
  - On the audit date `2026-05-30`, that fixture is older than one month, so the service correctly returns `CHAT_MESSAGE_NOT_FOUND` instead of `CHAT_MESSAGE_FORBIDDEN`.

## What Will Actually Update When We Move To Node 24

### If We Keep The Current Lockfile

- Node runtime: `20.14.0` -> `24.14.1`
- npm runtime on developer/CI machines will likely move with Node
- Docker base image: `node:20-bookworm-slim` -> a Node 24 image
- Library versions: `No automatic changes` if we keep `package-lock.json` and use `npm ci`

### If We Also Refresh Dependencies

- There are `39` unique external direct packages in the repo.
- `15` are already at their current npm latest release.
- `24` have newer releases available.
- Of those `24`, `19` are major-version jumps and should not be bundled into the Node runtime bump.

## Dependency Update Recommendations

### Required For Node 24 Compatibility

- No direct or transitive package update is strictly required for Node `24.14.1` based on the current lockfile scan.

### Recommended In The Same PR As The Node Bump

| Package | Current Installed | Recommended Target | Reason |
| --- | --- | --- | --- |
| `@types/node` | `22.19.13` | `24.12.4` | Align TypeScript Node types with the target runtime without jumping ahead to 25.x APIs |

### Optional Same-Major Refreshes

These are reasonable cleanup updates, but they are optional. Keep them in a separate commit from the runtime pin if you want easier rollback.

| Package | Current Installed | Latest | Update Type |
| --- | --- | --- | --- |
| `axios` | `1.13.6` | `1.16.1` | Minor |
| `helmet` | `8.1.0` | `8.2.0` | Minor |
| `mysql2` | `3.19.0` | `3.22.4` | Minor |
| `prettier` | `3.8.1` | `3.8.3` | Patch |
| `ts-jest` | `29.4.6` | `29.4.11` | Patch |

### Major Updates Available But Best Kept Out Of The Node Bump

| Package | Current Installed | Latest | Why Keep Separate |
| --- | --- | --- | --- |
| `@prisma/client` | `6.19.2` | `7.8.0` | Shared database client/runtime change across all services |
| `prisma` | `6.19.2` | `7.8.0` | Migration, generate, and engine changes across the monorepo |
| `express` | `4.22.1` | `5.2.1` | Router and middleware behavior changes |
| `zod` | `3.25.76` | `4.4.3` | Schema API and validation behavior changes |
| `redis` | `4.7.1` | `6.0.0` | Client API upgrade in cache-backed services |
| `pino` | `9.14.0` | `10.3.1` | Logging core upgrade |
| `pino-http` | `10.5.0` | `11.0.0` | HTTP logger middleware upgrade |
| `typescript` | `5.9.3` | `6.0.3` | Compiler and type-check behavior changes |
| `eslint` | `8.57.1` | `10.4.1` | Lint engine and config ecosystem changes |
| `@typescript-eslint/eslint-plugin` | `7.18.0` | `8.60.0` | Rule behavior changes |
| `@typescript-eslint/parser` | `7.18.0` | `8.60.0` | Parser behavior changes |
| `jest` | `29.7.0` | `30.4.2` | Test runner major upgrade |
| `@types/jest` | `29.5.14` | `30.0.0` | Test typing alignment with Jest 30 |
| `express-rate-limit` | `7.5.1` | `8.5.2` | Middleware behavior and typing changes |
| `bcryptjs` | `2.4.3` | `3.0.3` | Auth-path major dependency upgrade |
| `@types/bcryptjs` | `2.4.6` | `3.0.0` | Type alignment with bcryptjs 3 |
| `dotenv` | `16.6.1` | `17.4.2` | Environment bootstrap behavior could change |
| `@types/supertest` | `6.0.3` | `7.2.0` | Test type package major bump |

### Already At Latest

The remaining direct packages are already at their npm latest release in the current lockfile, including:

- `compression`
- `cookie-parser`
- `cors`
- `formidable`
- `http-status-codes`
- `jsonwebtoken`
- `socket.io`
- `supertest`
- `ts-node`
- `ts-node-dev`
- `@types/compression`
- `@types/cookie-parser`
- `@types/cors`
- `@types/express`
- `@types/jsonwebtoken`

## Recommended Execution Plan

### Phase 1: Runtime Pinning Only

1. Update `package.json` engine from `>=20.14.0` to one of:
   - strict exact pin: `24.14.1`
   - recommended team pin: `>=24.14.1 <25`
2. Add `.nvmrc` with `24.14.1`.
3. Update `infra/docker/Dockerfile` from `node:20-bookworm-slim` to `node:24.14.1-bookworm-slim`.
4. Update any external CI/CD, VPS bootstrap scripts, or hosting build settings that still install Node 20.

### Phase 2: Clean Validation Baseline

1. Keep dependency versions unchanged first.
2. Run a clean install on Node 24 using `npm ci`.
3. Re-run:
   - `npm run typecheck`
   - `npm run test`
   - `npm run lint`
4. Fix the two baseline issues before using the upgrade PR as a release gate:
   - exclude generated Prisma files from linting, or narrow the lint globs
   - make the chat retention unit test time-safe by mocking time or using a relative recent date

### Phase 3: Service Smoke Tests

After the baseline passes, manually smoke the runtime paths that are most sensitive to a Node bump:

1. `npm run dev`
2. `npm run prisma:generate`
3. `npm run prisma:migrate`
4. `npm run docker:up:app`
5. PM2 path:
   - `npm run pm2:start`
   - `npm run pm2:restart`

Focus checks:

- service boot for all 5 services
- Prisma client generation
- MySQL connectivity
- Redis-backed store/newsfeed caching
- file upload path in auth-service
- Socket.IO chat boot in app-service
- Docker healthchecks that use `fetch()`

### Phase 4: Production Rollout

1. Build and deploy a Node 24 image to staging first.
2. Run migrations in staging and confirm Prisma-generated clients still match runtime behavior.
3. Verify all `/health` endpoints.
4. Check logs for Prisma engine, Redis, and proxy errors.
5. Roll out production during a low-traffic window.

### Phase 5: Follow-Up Dependency Waves

Do these only after Node 24 is stable in production:

1. Low-risk refresh wave:
   - `@types/node`
   - optional same-major updates like `axios`, `mysql2`, `helmet`, `prettier`, `ts-jest`
2. Tooling major wave:
   - `typescript`
   - `eslint`
   - `@typescript-eslint/*`
   - `jest`
3. Runtime major wave:
   - `prisma`
   - `express`
   - `zod`
   - `redis`
   - `pino`
   - `pino-http`

## Rollback Plan

If Node 24 causes an unexpected runtime problem:

1. Revert the Node pin in `package.json`.
2. Revert the Docker image back to the current Node 20 base image.
3. Rebuild with the previous lockfile and redeploy.
4. Because this is a Node-only change, no database rollback should be needed unless a separate Prisma upgrade was bundled into the same release.

## Final Recommendation

- Proceed with a Node-only upgrade first.
- Do not mix the Node bump with Prisma 7, Express 5, TypeScript 6, ESLint 10, Jest 30, or Zod 4.
- Treat `@types/node` `24.12.4` as the only dependency change worth strongly considering in the same work item.
- Fix the existing lint scope issue and the date-sensitive chat unit test before calling the migration fully green.
