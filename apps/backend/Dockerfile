# syntax=docker/dockerfile:1
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Copy go mod files for dependency layer caching
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build with optimizations
# -a: Force rebuild of packages (ensures static build)
# -installsuffix: Use different suffix for cgo packages
# -ldflags: Strip debug info for smaller binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \
    -a -installsuffix cgo \
    -ldflags="-w -s" \
    -o backend .

# Runtime stage
FROM alpine:3.19

# Install only essential runtime dependencies
RUN apk add --no-cache ca-certificates tzdata

# Create non-root user for security
RUN addgroup -g 1000 app && \
    adduser -D -u 1000 -G app app

WORKDIR /app

# Copy the binary from builder with correct permissions
COPY --from=builder --chown=app:app /app/backend .

# Copy migration files with correct permissions
COPY --from=builder --chown=app:app /app/migrations ./migrations

# Switch to non-root user
USER app

EXPOSE 50051
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:8080/health || exit 1

CMD ["./backend"]
