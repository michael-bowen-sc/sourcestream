# syntax=docker/dockerfile:1
FROM node:20-alpine AS builder

WORKDIR /app

# Copy only package files first for better caching
COPY package.json package-lock.json ./apps/frontend/
WORKDIR /app/apps/frontend

# Use npm ci for reproducible, faster installs
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build with optimizations
RUN npm run build

# Runtime stage with nginx
FROM nginx:alpine

# Create non-root user for security
RUN addgroup -g 101 -S nginx && \
    adduser -S -D -H -u 101 -h /var/cache/nginx -s /sbin/nologin -G nginx -g nginx nginx

# Copy built files from builder
COPY --from=builder --chown=nginx:nginx /app/apps/frontend/dist /usr/share/nginx/html

# Copy optimized nginx config
COPY .devcontainer/nginx.conf /etc/nginx/nginx.conf

# Create cache and log directories with correct permissions
RUN mkdir -p /var/cache/nginx && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx

# Switch to non-root user
USER nginx

EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
