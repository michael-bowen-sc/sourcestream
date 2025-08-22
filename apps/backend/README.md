# SourceStream Backend

PostgreSQL-based backend service for the SourceStream platform.

## Database Setup

### Prerequisites
- PostgreSQL 12+ installed and running
- Go 1.19+ installed

### Environment Variables
Create a `.env` file in the backend directory:

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=sourcestream
DB_SSLMODE=disable
```

### Database Migration

1. Create the database:
```sql
CREATE DATABASE sourcestream;
```

2. Run migrations:
```bash
# Connect to PostgreSQL and run the migration files
psql -h localhost -U postgres -d sourcestream -f migrations/001_initial_schema.sql
psql -h localhost -U postgres -d sourcestream -f migrations/002_seed_data.sql
```

### Running the Server

```bash
# Install dependencies
go mod tidy

# Run the server
go run main.go
```

The server will start:
- gRPC server on `:50051`
- REST gateway on `:8080`

## API Endpoints

### REST Endpoints (via gRPC-Gateway)
- `GET /v1/users/{id}` - Get user profile
- `POST /v1/users/register` - Register contributor
- `GET /v1/projects/authored/{user_id}` - Get authored projects
- `GET /v1/projects/contributed/{user_id}` - Get contributed projects
- `GET /v1/projects/approved/{user_id}` - Get approved projects
- `POST /v1/projects` - Create project
- `POST /v1/requests/project` - Submit project request
- `POST /v1/requests/pullrequest` - Submit PR approval request
- `POST /v1/requests/access` - Submit access request
- `GET /v1/requests/{user_id}` - Get user requests

## Database Schema

### Tables
- `users` - User profiles and authentication
- `projects` - Open source projects
- `project_contributors` - Many-to-many user-project relationships
- `requests` - Project, PR, and access requests
- `request_comments` - Comments on requests

### Key Features
- UUID primary keys
- Automatic timestamps with triggers
- Proper indexing for performance
- Foreign key constraints for data integrity
- JSONB arrays for permissions
