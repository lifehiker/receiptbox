# Stage 1: dependencies
FROM node:20-slim AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
# --ignore-scripts prevents prisma generate from running before schema.prisma is copied
RUN npm ci --ignore-scripts

# Stage 2: build
FROM node:20-slim AS builder
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Provide build-time defaults so the build succeeds with no env vars configured.
ENV DATABASE_URL="file:/tmp/build.db"
ENV AUTH_SECRET="build-time-placeholder-secret"
ENV NEXT_PUBLIC_APP_URL="http://localhost:3000"
RUN npx prisma generate
RUN npm run build

# Stage 3: runner
FROM node:20-slim AS runner
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NODE_ENV=production
# Default env so the app works with no Coolify env vars configured.
ENV DATABASE_URL="file:/data/app.db"
ENV AUTH_SECRET="receiptbox-default-secret-override-in-production"
ENV NEXT_PUBLIC_APP_URL=""
ENV UPLOAD_DIR="/data/uploads"
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN mkdir -p /data /data/uploads && chown -R nextjs:nodejs /data

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
# Copy full node_modules so the Prisma CLI has all transitive deps available.
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

USER nextjs
EXPOSE 3000
CMD ["sh", "-c", "node node_modules/prisma/build/index.js db push --skip-generate && echo 'DB ready' && node server.js"]
