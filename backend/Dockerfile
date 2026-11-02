# ─────────────────────────────────────────────────────────
# Stage 1 – deps: install production + dev deps
# ─────────────────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

# openssl is required by Prisma query engine on Alpine
RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/

# Install ALL deps (need devDeps for ts-node-dev / tsc)
RUN npm ci

# Generate Prisma client (bundles the musl binary defined in schema.prisma)
RUN npx prisma generate

# ─────────────────────────────────────────────────────────
# Stage 2 – builder: compile TypeScript → JavaScript
# ─────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache openssl

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY . .

RUN npm run build
# dist/ now contains compiled JS

# ─────────────────────────────────────────────────────────
# Stage 3 – runner: minimal production image
# ─────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# openssl must be present at runtime for Prisma query engine
RUN apk add --no-cache openssl

# Only copy production node_modules + compiled output
COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Re-generate Prisma client for this runtime layer
RUN npx prisma generate

# Expose backend port
EXPOSE 5000

# Run migrations then start the server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
