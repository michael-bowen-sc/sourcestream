# SourceStream Architecture Documentation

This document provides comprehensive architectural diagrams for the SourceStream platform, including database schema and system architecture.

## Database Schema

The SourceStream platform uses PostgreSQL as its primary database with the following entity relationships:

```mermaid
erDiagram
    users {
        UUID id PK
        VARCHAR corporate_id UK
        VARCHAR github_username UK
        VARCHAR email UK
        VARCHAR full_name
        VARCHAR department
        VARCHAR role
        BOOLEAN is_active
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    projects {
        UUID id PK
        VARCHAR name
        TEXT description
        VARCHAR url
        VARCHAR license
        VARCHAR status
        UUID owner_id FK
        VARCHAR language
        INTEGER stars
        INTEGER forks
        BOOLEAN is_public
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    project_contributors {
        UUID id PK
        UUID project_id FK
        UUID user_id FK
        VARCHAR role
        TEXT[] permissions
        TIMESTAMP joined_at
    }

    requests {
        UUID id PK
        VARCHAR type
        VARCHAR title
        TEXT description
        VARCHAR status
        UUID requester_id FK
        UUID reviewer_id FK
        UUID project_id FK
        VARCHAR project_name
        VARCHAR project_url
        VARCHAR license
        VARCHAR requested_role
        TIMESTAMP approved_at
        TIMESTAMP rejected_at
        TEXT rejection_reason
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    request_comments {
        UUID id PK
        UUID request_id FK
        UUID user_id FK
        TEXT comment
        BOOLEAN is_internal
        TIMESTAMP created_at
    }

    users ||--o{ projects : "owns"
    users ||--o{ project_contributors : "participates"
    projects ||--o{ project_contributors : "has contributors"
    users ||--o{ requests : "creates"
    users ||--o{ requests : "reviews"
    projects ||--o{ requests : "relates to"
    requests ||--o{ request_comments : "has comments"
    users ||--o{ request_comments : "writes"
```

## System Architecture

The SourceStream platform follows a microservices architecture with clear separation between frontend, backend, and database layers:

```mermaid
graph TB
    subgraph "Client Layer"
        WEB[Web Browser]
        MOBILE[Mobile App]
    end

    subgraph "Frontend Layer"
        REACT[React Frontend<br/>Port: 3000]
        NGINX[Nginx Reverse Proxy<br/>Port: 80/443]
    end

    subgraph "API Gateway Layer"
        GATEWAY[gRPC-Gateway<br/>REST API<br/>Port: 8080]
    end

    subgraph "Backend Services"
        GRPC[gRPC Server<br/>Port: 50051]

        subgraph "Service Layer"
            USER_SVC[User Service]
            PROJECT_SVC[Project Service]
            REQUEST_SVC[Request Service]
        end

        subgraph "Repository Layer"
            USER_REPO[User Repository]
            PROJECT_REPO[Project Repository]
            REQUEST_REPO[Request Repository]
        end
    end

    subgraph "Data Layer"
        POSTGRES[(PostgreSQL Database<br/>Port: 5432)]
    end

    subgraph "External Services"
        GITHUB[GitHub API]
        AUTH[Authentication Service]
    end

    %% Client connections
    WEB --> NGINX
    MOBILE --> NGINX

    %% Frontend connections
    NGINX --> REACT
    REACT --> GATEWAY

    %% API Gateway connections
    GATEWAY --> GRPC

    %% gRPC Service connections
    GRPC --> USER_SVC
    GRPC --> PROJECT_SVC
    GRPC --> REQUEST_SVC

    %% Service to Repository connections
    USER_SVC --> USER_REPO
    PROJECT_SVC --> PROJECT_REPO
    REQUEST_SVC --> REQUEST_REPO

    %% Repository to Database connections
    USER_REPO --> POSTGRES
    PROJECT_REPO --> POSTGRES
    REQUEST_REPO --> POSTGRES

    %% External service connections
    USER_SVC --> GITHUB
    USER_SVC --> AUTH

    %% Styling
    classDef frontend fill:#e1f5fe
    classDef backend fill:#f3e5f5
    classDef database fill:#e8f5e8
    classDef external fill:#fff3e0

    class WEB,MOBILE,REACT,NGINX frontend
    class GATEWAY,GRPC,USER_SVC,PROJECT_SVC,REQUEST_SVC,USER_REPO,PROJECT_REPO,REQUEST_REPO backend
    class POSTGRES database
    class GITHUB,AUTH external
```

## Component Flow Diagram

This diagram shows the typical request flow through the system:

```mermaid
sequenceDiagram
    participant Client as Web Client
    participant Gateway as gRPC Gateway
    participant gRPC as gRPC Server
    participant Service as Service Layer
    participant Repo as Repository
    participant DB as PostgreSQL
    participant GitHub as GitHub API

    Client->>Gateway: HTTP/REST Request
    Gateway->>gRPC: gRPC Call
    gRPC->>Service: Service Method

    alt Database Operation
        Service->>Repo: Repository Method
        Repo->>DB: SQL Query
        DB-->>Repo: Query Result
        Repo-->>Service: Domain Object
    end

    alt External API Call
        Service->>GitHub: GitHub API Request
        GitHub-->>Service: API Response
    end

    Service-->>gRPC: Service Response
    gRPC-->>Gateway: gRPC Response
    Gateway-->>Client: HTTP/JSON Response
```

## Technology Stack

### Frontend

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Chakra UI v3
- **Icons**: React Icons (Feather Icons)
- **Styling**: Chakra UI Design System
- **State Management**: React Context/Hooks

### Backend

- **Language**: Go 1.19+
- **gRPC Framework**: google.golang.org/grpc
- **REST Gateway**: grpc-gateway
- **Database ORM**: Standard database/sql
- **Protocol Buffers**: protoc compiler

### Database

- **Primary Database**: PostgreSQL 12+
- **Migration Tool**: Custom SQL migrations
- **Connection Pooling**: Built-in Go database/sql

### Infrastructure

- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **Reverse Proxy**: Nginx
- **Monitoring**: Prometheus + Grafana

## Key Design Patterns

1. **Repository Pattern**: Separates data access logic from business logic
2. **Service Layer Pattern**: Encapsulates business logic and coordinates between repositories
3. **gRPC + REST Gateway**: Provides both high-performance gRPC and web-friendly REST APIs
4. **Domain-Driven Design**: Clear separation of concerns with domain models
5. **Microservices Architecture**: Loosely coupled, independently deployable services

## Security Considerations

- **Authentication**: Corporate ID-based authentication with GitHub integration
- **Authorization**: Role-based access control (RBAC) with project-level permissions
- **Data Validation**: Input validation at both API gateway and service layers
- **Database Security**: Parameterized queries to prevent SQL injection
- **Transport Security**: TLS encryption for all external communications

## Scalability Features

- **Horizontal Scaling**: Stateless services can be scaled independently
- **Database Indexing**: Optimized indexes for common query patterns
- **Connection Pooling**: Efficient database connection management
- **Caching Strategy**: Ready for Redis integration for session and data caching
- **Load Balancing**: Nginx reverse proxy with upstream load balancing
