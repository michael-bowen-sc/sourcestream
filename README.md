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

### Frontend Components
- **React + TypeScript**: Modern frontend with Ant Design components
- **Responsive Design**: Mobile-friendly layout with consistent card heights
- **Real-time Updates**: Dynamic request tracking and status management

## Architecture

```
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
│       │   └── data/        # Mock data and types
├── proto/                # Protocol buffer definitions
└── docs/                 # Documentation
```

## Quick Start

### Backend
```bash
cd apps/backend
go run main.go
```

### Frontend
```bash
cd apps/frontend
npm run dev
```

### Database
```bash
cd apps/backend
./scripts/setup_db.sh
```

## Recent Updates

- **Modal Request System**: Moved action cards to header toolbar with comprehensive modal forms
- **Dashboard Pagination**: Added 4-row pagination to all dashboard cards for better performance
- **Consistent UI**: Fixed card heights and improved visual consistency across components
- **Database Integration**: Enhanced backend services with PostgreSQL repository pattern
