FROM node:24.14.1-bookworm-slim

WORKDIR /app

ENV CI=true

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json tsconfig.base.json ./
COPY packages/contracts/package.json packages/contracts/package.json
COPY services/api-gateway/package.json services/api-gateway/package.json
COPY services/app-service/package.json services/app-service/package.json
COPY services/auth-service/package.json services/auth-service/package.json
COPY services/newsfeed-service/package.json services/newsfeed-service/package.json
COPY services/store-service/package.json services/store-service/package.json

RUN npm ci

COPY . .

RUN chmod +x infra/docker/run-migrations.sh \
  && npm run prisma:generate \
  && npm run build

ENV NODE_ENV=production

CMD ["npm", "run", "start", "-w", "services/api-gateway"]
