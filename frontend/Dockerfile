# ─────────────────────────────────────────────────────────
# Stage 1 – builder: build the Vite/React app
# ─────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
# VITE_API_URL is injected at build time via docker-compose build args
ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build
# dist/ contains the compiled static assets

# ─────────────────────────────────────────────────────────
# Stage 2 – runner: Nginx serves the static build + proxies /api
# ─────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runner

# Remove default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built React app
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
