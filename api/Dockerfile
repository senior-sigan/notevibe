FROM node:24-trixie-slim AS base

FROM base AS deps

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --only=production

FROM base AS runner
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

ENV PORT=3000

CMD ["node", "src/index.ts"]
