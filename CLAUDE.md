# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SourceStream is a monorepo platform for managing OSPO-supported activities, policies, and procedures. It maps corporate identities to GitHub usernames with one-to-many relationships to approved open source projects. The architecture consists of:
- **Backend**: Go 1.21+ gRPC services with PostgreSQL repository pattern
- **Frontend**: React 19 + TypeScript with Chakra UI
- **Infrastructure**: Docker, Kubernetes, Tilt for local development

## Common Development Commands

### Frontend (React/TypeScript)
```bash
cd apps/frontend
npm install              # Install dependencies
npm run dev              # Start dev server (default: http://localhost:5173, may differ if port is in use)
npm test                 # Run all tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Generate coverage report
npm run lint            # Run ESLint
npm run build           # Build for production
```

### Backend (Go/gRPC)
```bash
cd apps/backend
go mod download         # Install Go dependencies
go run main.go          # Start servers:
                        #   - gRPC on :50051 (high-performance binary protocol)
                        #   - REST gateway on :8080 (HTTP JSON API via gRPC-Gateway)
go test ./...           # Run all tests
go test -cover ./...    # Run tests with coverage
go test ./services/     # Run specific package tests
make proto              # Generate protobuf files (if make available)
```

### Database
```bash
cd apps/backend
./scripts/setup_db.sh   # Create database and run migrations
# Manual PostgreSQL commands:
psql -d sourcestream -c "SELECT COUNT(*) FROM users;"  # Verify setup
```

### Monorepo Commands (from root)
```bash
npm run lint:all        # Run all linters (Go, TS, CSS, Markdown)
npm run lint:all:fix    # Autofix all linting issues
npm run format          # Format code with Prettier
npm run format:check    # Check formatting without modifying
npm run lint:md:fix     # Fix markdown files
npm run generate:ai-context  # Generate AI learning context
```

### Local Development (Kubernetes)
```bash
tilt up                 # Start local Kubernetes with hot-reload
tilt down               # Stop local Kubernetes
```

## Architecture Overview

### System Layers
- **Client Layer**: Web browser and mobile clients
- **Frontend**: React app served on port 5173 by default via Vite (dev) or via Nginx (prod)
- **API Gateway**: gRPC-Gateway REST API on port 8080
- **gRPC Server**: Core services on port 50051
- **Service Layer**: User, Project, Request services with business logic
- **Repository Layer**: Data access abstraction with PostgreSQL
- **Database**: PostgreSQL 14+ with migrations and seed data

### Key Services
- **UserService**: User profiles, authentication, GitHub integration
- **ProjectService**: Project management and contributor tracking
- **RequestService**: Project, PR, and access request handling

### Protocol & APIs
- Primary: gRPC (protobuf-based, high-performance)
- Secondary: REST via gRPC-Gateway (web-friendly)
- Client communication uses grpc-web for browser compatibility

## Repository Structure

```
sourcestream/
├── apps/backend/           # Go backend
│   ├── services/           # Business logic (User, Project, Request services)
│   ├── repository/         # Data access layer (repositories)
│   ├── models/             # Domain models
│   ├── migrations/         # SQL migrations
│   ├── pb/                 # Generated protobuf files
│   ├── config/             # Configuration
│   ├── scripts/            # Setup and migration scripts
│   ├── kubernetes/         # K8s manifests
│   └── main.go             # Server entry point
├── apps/frontend/          # React + TypeScript
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Validation and utilities
│   │   ├── test/           # Test setup and mocks
│   │   └── data/           # Mock data and types
│   └── package.json        # Frontend dependencies
├── proto/                  # Protocol buffer definitions (.proto files)
├── openspec/               # Specification system for planned changes
│   ├── project.md          # Project conventions
│   ├── AGENTS.md           # OpenSpec workflow for AI agents
│   └── specs/              # Capability specifications
├── docs/                   # Documentation
│   ├── architecture.md     # System architecture diagrams
│   ├── ai-patterns/        # AI development patterns
│   └── AI-PAIRING.md       # Guidance for AI-assisted development
├── scripts/                # Root-level scripts
├── .husky/                 # Git hooks (commitlint, branch naming, linting)
├── Tiltfile                # Tilt configuration for local K8s
├── package.json            # Monorepo root (workspaces: apps/*)
└── DEVLOG.md               # Development log tracking progress

```

## Database Schema

The system uses PostgreSQL with these primary tables:
- **users**: Profiles with corporate ID, GitHub username, email, department, role
- **projects**: Open source projects with metadata (name, URL, license, stats)
- **project_contributors**: Many-to-many relationships between users and projects
- **requests**: Project, PR, and access requests with status tracking
- **request_comments**: Comments on requests (internal and external)

See `docs/architecture.md` for detailed schema diagrams.

## Development Conventions

### Branching & Commits
- **Branch format**: `feat/name`, `fix/name`, `docs/name` (conventional commit types)
- **Commit messages**: Follow [Conventional Commits](https://www.conventionalcommits.org/) specification
- **Validation**: Pre-push and commit-msg hooks enforce these rules
- **DEVLOG tracking**: Update `DEVLOG.md` with progress, challenges, and solutions

### Linting & Formatting
- **Markdown**: `markdownlint` with husky pre-commit hooks
- **Go**: `golangci-lint` (configured in `.golangci.yml`)
- **TypeScript**: ESLint with React plugin
- **CSS**: Stylelint with standard config
- **All code**: Prettier formatting
- **Pre-commit hooks**: Run linters and fixers automatically via husky

### Testing Requirements
- **Frontend**: Jest + React Testing Library
- **Backend**: Go's built-in testing with mock-based unit and integration tests
- **Coverage**: Use `npm run test:coverage` and `go test -cover` to verify

## Specification & Change Planning

This project uses **OpenSpec** for spec-driven development:
- Check `openspec/AGENTS.md` for workflow details
- Use `openspec list` to see active changes
- Use `openspec list --specs` to see capability specifications
- Create proposals for: new features, breaking changes, architecture shifts, or performance work
- Skip proposals for: bug fixes, typos, dependency updates, config changes

Read `docs/AI-PAIRING.md` for collaborative AI development guidance.

## Environment Setup

### Prerequisites
- Go 1.21+
- Node.js 20.19.4+ (use `nvm use` to set from `.nvmrc`)
- PostgreSQL 14+
- `protoc` (Protocol Buffer compiler)
- Go protobuf plugins: `protoc-gen-go`, `protoc-gen-go-grpc`

### Backend Configuration
Create `apps/backend/.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=sourcestream_user
DB_PASSWORD=password
DB_NAME=sourcestream
DB_SSLMODE=disable
SERVER_PORT=50051
GATEWAY_PORT=8080
```

### Frontend Configuration
Frontend uses environment variables from `.env` files or inlines values. Check `apps/frontend` for specific requirements.

## Protobuf Workflow

Proto files are in `proto/` and generate Go/gRPC code:

1. Edit `.proto` files in `proto/`
2. Generate Go code from `apps/backend` directory:
   ```bash
   cd apps/backend
   # Option 1: Using make (if available)
   make proto

   # Option 2: Manual protoc command
   protoc --go_out=. --go_opt=paths=source_relative \
           --go-grpc_out=. --go-grpc_opt=paths=source_relative \
           ../proto/*.proto
   ```
3. Generated files appear in `apps/backend/pb/`
4. Commit both `.proto` source files and generated `.pb.go` files

## Testing & Verification

### Verify Local Setup
```bash
# Database
psql -d sourcestream -c "SELECT COUNT(*) FROM users;"

# Backend gRPC
curl -X POST http://localhost:8080/v1/users/profile \
  -H "Content-Type: application/json" \
  -d '{"user_id": "550e8400-e29b-41d4-a716-446655440001"}'

# Frontend (check console output for actual port - typically 5173)
open http://localhost:5173
```

## Troubleshooting

### Frontend Dev Server Port Not Opening
If `npm run dev` doesn't start on the expected port:
```bash
# Vite uses port 5173 by default. If that's in use, check what's running:
lsof -i :5173
# Kill the process or use a different directory in a new terminal
```

### Protobuf Generation Issues
If protobuf files don't generate or you get "protoc not found":
```bash
# Verify protoc is installed
protoc --version

# Install protoc (macOS)
brew install protobuf

# Install Go protobuf plugins
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

# Ensure $GOPATH/bin is in your PATH
export PATH="$PATH:$(go env GOPATH)/bin"
```

### Database Connection Issues
```bash
# Verify PostgreSQL is running
pg_isready -h localhost -p 5432

# Check database exists
psql -h localhost -U sourcestream_user -d sourcestream -c "SELECT 1;"

# If password prompt hangs, check .pgpass file permissions:
chmod 600 ~/.pgpass
```

### Build Failures with TypeScript
```bash
# Clear TypeScript cache and rebuild
cd apps/frontend
rm -rf dist/
npm run build

# If ESLint errors persist, verify TypeScript version matches Go generated types
npm list typescript
```

### gRPC Connection Errors
```bash
# Verify both gRPC and REST gateway are running
lsof -i :50051 -i :8080

# Test REST gateway manually
curl -X POST http://localhost:8080/v1/users/profile \
  -H "Content-Type: application/json" \
  -d '{"user_id": "550e8400-e29b-41d4-a716-446655440001"}'
```

## Key Technologies

- **Frontend**: React 19, TypeScript 5.8, Chakra UI 3, Tailwind CSS 4, Jest, Vite
- **Backend**: Go 1.21+, gRPC, gRPC-Gateway, google-protobuf
- **Database**: PostgreSQL 14+
- **Infrastructure**: Docker, Kubernetes, Tilt
- **Tools**: ESLint, Prettier, markdownlint, golangci-lint, Stylelint

## Notes for Future Work

1. **AI Collaboration**: Before starting work, check `docs/AI-PAIRING.md` for context checklist and git hygiene recommendations.
2. **Specification Review**: For planning or significant changes, consult `openspec/AGENTS.md` to understand when proposals are needed. This is the authoritative workflow for spec-driven development.
3. **Hot Reload**: Use Tilt (`tilt up`) for local Kubernetes development with live-reload for both backend and frontend (Kubernetes port 8080).
4. **Monorepo Structure**: Backend and frontend are separate npm workspaces. Always run commands from the specific `apps/*/` directory unless using monorepo-level scripts.
5. **Default Port Behavior**: Vite's dev server uses port 5173 by default, but may use higher ports if that's in use. The actual port is printed to console when the dev server starts.
