# SourceStream

SourceStream is a comprehensive platform designed to streamline and enhance the management of OSPO supported activities, policies and procedures. It offers robust tools for onboarding, cataloging, and reporting, ensuring seamless integration and workflow management.

## Features

### Dashboard & Request Management

- **Interactive Dashboard**: 4-column layout with project statistics and pending requests
- **Modal Request System**: Header toolbar with popup forms for project, pull request, and access requests
- **Pagination**: All dashboard cards support pagination with max 4 visible rows
- **State Management**: Unsaved changes protection with browser navigation blocking

### Backend Services

- **PostgreSQL Integration**: Full database schema with migrations and seed data
- **gRPC Services**: UserService, ProjectService, and RequestService with repository pattern
- **Request Management**: Complete CRUD operations for project requests and approvals
- **Comprehensive Testing**: Mock-based unit tests and integration tests for all service methods
- **API Validation**: Input validation and error handling at service and repository layers

### Frontend Components

- **React + TypeScript**: Modern frontend with Chakra UI components
- **Responsive Design**: Mobile-friendly layout with consistent card heights and uniform spacing
- **Real-time Updates**: Dynamic request tracking and status management
- **Comprehensive Testing**: Unit, integration, and component tests with Jest and React Testing Library
- **Form Validation**: Robust client-side validation with error handling and business rules

## Architecture

```text
sourcestream/
├── apps/
│   ├── backend/          # Go gRPC services
│   │   ├── services/     # Business logic layer
│   │   ├── repository/   # Data access layer
│   │   ├── models/       # Database models
│   │   └── migrations/   # SQL schema migrations
│   └── frontend/         # React TypeScript app
│       ├── src/
│       │   ├── components/  # Reusable UI components
│       │   ├── hooks/       # Custom React hooks
│       │   ├── utils/       # Validation and utility functions
│       │   ├── test/        # Test setup and mocks
│       │   └── data/        # Mock data and types
├── proto/                # Protocol buffer definitions
└── docs/                 # Documentation
```

## Prerequisites

- **Go** 1.21+
- **Node.js** 20.19.4+ (LTS) and npm 10+
- **PostgreSQL** 14+
- **Protocol Buffers** compiler (`protoc`)
- **nvm** (recommended for Node.js version management)

### Install Dependencies

```bash
# Install nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
# Restart terminal or source your profile

# Use project Node.js version
nvm use

# Install protoc (macOS)
brew install protobuf

# Install Go protobuf plugins
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
```

## Local Development Setup

### 1. Database Setup

```bash
# Install PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# Create database and user
createdb sourcestream
psql -d sourcestream -c "CREATE USER sourcestream_user WITH PASSWORD 'password';"
psql -d sourcestream -c "GRANT ALL PRIVILEGES ON DATABASE sourcestream TO sourcestream_user;"

# Run migrations
cd apps/backend
./scripts/setup_db.sh
```

### 2. Backend Setup

```bash
cd apps/backend

# Copy and configure environment file
cp .env.example .env
# Edit .env if needed (default values work for local development)

# Install Go dependencies
go mod download

# Generate protobuf files (if make is available)
make proto
# OR manually:
# protoc --go_out=. --go_opt=paths=source_relative \
#        --go-grpc_out=. --go-grpc_opt=paths=source_relative \
#        ../proto/*.proto

# Start backend server
go run main.go
```

Backend will be available at:

- gRPC: `localhost:50051`
- REST Gateway: `localhost:8080` (when enabled)

### 3. Frontend Setup

```bash
cd apps/frontend

# Ensure you're using the correct Node.js version
nvm use

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at: `http://localhost:5175`

### 4. Verify Setup

1. **Database**: Check that tables exist and contain seed data

   ```bash
   psql -d sourcestream -c "SELECT COUNT(*) FROM users;"
   ```

2. **Backend**: Test gRPC service

   ```bash
   curl -X POST http://localhost:8080/v1/users/profile \
     -H "Content-Type: application/json" \
     -d '{"user_id": "550e8400-e29b-41d4-a716-446655440001"}'
   ```

3. **Frontend**: Open browser to `http://localhost:5175` and verify dashboard loads

## Environment Configuration

### Backend (.env)

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

## Testing & Quality Assurance

### Frontend Testing

```bash
cd apps/frontend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Backend Testing

```bash
cd apps/backend

# Run all tests
go test ./...

# Run tests with coverage
go test -cover ./...

# Run specific service tests
go test ./services/
```

## Recent Updates

- **Comprehensive Testing Suite**: Added unit, integration, and component tests with Jest and Go testing
- **Form Validation**: Implemented robust client-side validation with error handling
- **Backend API Integration**: Connected frontend forms to backend services with real-time updates
- **Modal Request System**: Moved action cards to header toolbar with comprehensive modal forms
- **Dashboard Pagination**: Added 4-row pagination to all dashboard cards for better performance
- **Consistent UI**: Fixed card heights and improved visual consistency across components
- **Database Integration**: Enhanced backend services with PostgreSQL repository pattern
