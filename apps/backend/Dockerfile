# syntax=docker/dockerfile:1
FROM golang:1.22-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./apps/backend/
WORKDIR /app/apps/backend
RUN go mod download

COPY . .

WORKDIR /app/apps/backend
RUN go build -o /usr/local/bin/backend .

FROM alpine/git as certs
RUN apk add --no-cache ca-certificates

FROM scratch
COPY --from=builder /usr/local/bin/backend /usr/local/bin/backend
COPY --from=certs /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

EXPOSE 50051
EXPOSE 8080

ENTRYPOINT ["/usr/local/bin/backend"]
