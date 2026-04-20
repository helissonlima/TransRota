FROM node:20-bullseye AS builder
WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/api/package.json ./apps/api/

RUN npm ci

COPY packages/shared ./packages/shared
COPY apps/api ./apps/api

RUN npm run build -w @transrota/shared
RUN npm run prisma:generate -w @transrota/api
RUN npm run build -w @transrota/api

FROM node:20-bullseye AS runner
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends postgresql-client && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/shared ./packages/shared
COPY --from=builder /app/apps/api ./apps/api

EXPOSE 3001
CMD ["npm", "run", "start", "-w", "@transrota/api"]
