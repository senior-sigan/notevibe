FROM node:24-trixie-slim AS base

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --only=production

FROM base AS builder

WORKDIR /app

COPY . .

ARG API_URL
ENV VITE_API_URL=${API_URL:-/api}

RUN npm run build

FROM base AS runner

WORKDIR /app

COPY . .

RUN npm run dev

FROM nginx:stable-alpine AS server

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
