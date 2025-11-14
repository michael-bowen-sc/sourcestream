# Project Context

## Purpose

SourceStream is a comprehensive OSPO (Open Source Program Office) management platform designed to streamline and enhance the management of open source supported activities, policies, and procedures within enterprise environments. The platform helps organizations manage employee open source contributions with proper approvals, track project requests, catalog approved projects, and handle access control workflows.

## Tech Stack

### Backend

- **Language**: Go 1.21+
- **Framework**: gRPC with Protocol Buffers
- **Database**: PostgreSQL 14+ with SQL migrations
- **API Gateway**: grpc-gateway for REST endpoints
- **Ports**: gRPC (50051), REST Gateway (8080)

### Frontend

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Chakra UI v3
- **Icons**: React Icons (Feather Icons)
- **State Management**: React Context/Hooks
- **Port**: 5175 (development)

### Testing

- **Frontend**: Jest, React Testing Library, MSW (Mock Service Worker)
- **Backend**: Go testing framework with mock-based unit tests

### Infrastructure

- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **Local Development**: Tilt
- **Version Control**: Git with Conventional Commits

### Development Tools

- **Linting**: golangci-lint (Go), ESLint + Prettier (TypeScript), Stylelint (CSS), markdownlint
- **Git Hooks**: Husky with lint-staged
- **Node Version**: 20.19.4 LTS (managed via nvm)

## Project Conventions

### Code Style

**Go Backend:**

- Follow standard Go formatting (gofmt, goimports)
- Use golangci-lint configuration in `.golangci.yml`
- Package naming: lowercase, single word when possible
- Error handling: Always check and return errors explicitly
- Comments: Exported functions must have doc comments

**TypeScript/React Frontend:**

- ESLint with TypeScript rules
- Prettier for formatting
- Functional components with hooks
- TypeScript strict mode enabled
- Props interfaces exported from component files

### Naming Conventions

**Files:**

- Go: `snake_case.go` (e.g., `user_service.go`)
- TypeScript: `PascalCase.tsx` for components, `camelCase.ts` for utilities
- Tests: `*_test.go` (Go), `*.test.tsx` or `*.test.ts` (TypeScript)

**Variables/Functions:**

- Go: `PascalCase` (exported), `camelCase` (unexported)
- TypeScript: `camelCase` for functions/variables, `PascalCase` for types/interfaces/components

**Database:**

- Tables: `snake_case` plural (e.g., `users`, `approved_projects`)
- Columns: `snake_case` (e.g., `corporate_id`, `created_at`)
- Primary keys: `id` (UUID)
- Timestamps: `created_at`, `updated_at`

### Architecture Patterns

**Backend Patterns:**

- **Repository Pattern**: Separates data access logic from business logic
- **Service Layer Pattern**: Encapsulates business logic and coordinates between repositories
- **Domain Models**: Clear separation with models in `models/` package
- **Dependency Injection**: Services receive dependencies through constructors

**Frontend Patterns:**

- **Component Composition**: Small, focused, reusable components
- **Custom Hooks**: Shared logic extracted to hooks (e.g., `useRequests`)
- **Modal-Based Forms**: Complex actions use modal dialogs with state management
- **Pagination**: Dashboard cards limited to 4 visible rows with pagination controls

**API Design:**

- gRPC for internal service communication
- REST Gateway for web client compatibility
- Protocol Buffers for type-safe API contracts
- Consistent error handling with status codes

### Testing Strategy

**Frontend Testing:**

- **Unit Tests**: Individual component and hook testing
- **Integration Tests**: Full form submission flows with MSW mocking
- **Component Tests**: User interaction testing with React Testing Library
- **Coverage Goal**: Critical paths and business logic covered

**Backend Testing:**

- **Unit Tests**: Service and repository layer testing with mocks
- **Integration Tests**: Database interaction testing
- **Test Organization**: Tests alongside implementation files (`*_test.go`)

**Testing Principles:**

- Test behavior, not implementation
- Mock external dependencies (database, API calls)
- Use descriptive test names
- AAA pattern: Arrange, Act, Assert

### Git Workflow

**Branching Strategy:**

- `main` - production-ready code
- `feat/description` - new features (e.g., `feat/request-permission-form-improvements`)
- `fix/description` - bug fixes
- `docs/description` - documentation updates
- `refactor/description` - code refactoring
- `test/description` - test additions/updates

**Branch Protection:**

- No direct pushes to `main`
- Pull requests required for merging
- Pre-push hooks validate branch names

**Commit Conventions:**

- Follow Conventional Commits specification
- Format: `type(scope): description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Use commitizen for guided commits
- commitlint enforces conventions

**Pre-commit Hooks:**

- Lint markdown files
- Run lint-staged for changed files
- Format code with Prettier (frontend)

## Domain Context

### Key Entities

**Users:**

- Corporate employees with both corporate ID and GitHub username
- Roles: `user`, `ospo_admin`, `admin`
- Departments and organizational hierarchy

**Projects:**

- Open source projects (authored, contributed, or approved)
- Status tracking: `active`, `pending`, `approved`, `archived`
- Metadata: stars, forks, language, license

**Requests:**

- Types: `project` (new project), `access` (contributor access), `pullrequest` (PR approval), `permission` (contribution permission)
- Status: `pending`, `approved`, `rejected`
- Approval workflow with reviewer assignment

**Approved Projects:**

- Pre-vetted projects for contribution
- Contribution agreements: CLA, CCLA, DCO
- Allowed contribution types: bug-fix, feature, documentation

### Business Rules

1. **Request Permission**: Users must select from approved projects and provide business justification
2. **Approval Workflow**: OSPO admins review and approve/reject requests
3. **Project Tracking**: All projects linked to owner and contributors
4. **Access Control**: Role-based permissions for administrative functions

## Important Constraints

### Technical Constraints

- PostgreSQL 14+ required for database features
- Node.js 20.19.4 LTS required for frontend build
- Go 1.21+ required for backend compilation
- Protocol Buffers compiler required for code generation

### Business Constraints

- Corporate ID required for all users
- GitHub username mapping required for contribution tracking
- Approval required before external contributions
- Business justification required for contribution requests

### Security Constraints

- Corporate ID-based authentication
- Role-based access control (RBAC)
- Parameterized SQL queries to prevent injection
- Input validation at API gateway and service layers

## External Dependencies

### Required Services

- **PostgreSQL**: Primary data store
- **GitHub API**: User validation and project metadata (planned)
- **Corporate Auth Service**: Employee authentication (planned)

### Development Dependencies

- **Protocol Buffers Compiler** (`protoc`): API contract generation
- **gRPC Gateway**: REST API generation from protobuf
- **Docker**: Local containerization
- **Kubernetes**: Deployment orchestration (optional for local dev)
- **Tilt**: Local Kubernetes development automation

### External APIs (Planned)

- GitHub GraphQL API for repository data
- Corporate LDAP/SSO for authentication
- Email service for notifications
- Slack/Teams webhooks for approval notifications

## Migration Path

When modifying database schema:

1. Create new migration file: `migrations/XXX_description.sql`
2. Use sequential numbering (e.g., `004_`, `005_`)
3. Include both up and down migrations when possible
4. Test migrations on local database before committing
5. Document breaking changes in migration comments

## Performance Considerations

- Dashboard cards limited to 4 rows with pagination
- Database indexes on frequently queried columns (`corporate_id`, `github_username`, `status`)
- Connection pooling for database efficiency
- gRPC binary format for frontend-backend communication

## Future Architecture Notes

- Redis caching layer planned for session management
- Horizontal scaling ready (stateless services)
- Monitoring with Prometheus + Grafana (planned)
- Real-time notifications with WebSockets (planned)
