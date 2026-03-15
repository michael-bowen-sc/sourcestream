# SourceStream Development Container

Complete development environment for SourceStream with local Kubernetes (Kind) support.

## 🚀 Quick Start

### Option 1: GitHub Codespaces (Recommended for Open Source)

1. Click "Code" → "Codespaces" → "Create codespace on main"
2. Wait for container to build (first time takes 3-5 minutes)
3. Terminal automatically opens with environment ready

```bash
# Development environment is ready!
npm run dev              # Start frontend dev server
cd apps/backend && go run main.go  # Start backend
./scripts/k8s/validate.sh           # Deploy to local Kind cluster
```

### Option 2: Local Dev Container (VS Code)

**Prerequisites:**
- Docker Desktop (with Docker Compose)
- VS Code with Dev Containers extension

**Steps:**

1. Clone repository and open in VS Code
2. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
3. Select "Dev Containers: Reopen in Container"
4. Wait for build (3-5 minutes first time)
5. Terminal opens in dev container

### Option 3: Docker Compose (Manual)

```bash
cd .devcontainer
docker-compose up -d
docker-compose exec devcontainer bash
```

---

## 📦 What's Included

### Development Tools
- **Node.js 20** - Frontend development
- **Go 1.21** - Backend development
- **Protocol Buffers** - gRPC code generation
- **ESLint, Prettier** - Code formatting
- **Jest** - Testing

### Kubernetes Tools
- **Kind** - Local Kubernetes cluster
- **kubectl** - Kubernetes CLI
- **Helm** - Package manager (pre-installed)
- **Skaffold** - Development workflow (optional)

### Services
- **PostgreSQL 14** - Database
- **Docker-in-Docker** - Container support

---

## 🔧 Development Workflow

### 1. Start Services (First Time)

```bash
# Environment auto-initializes on container creation
# Verify Kind cluster is running:
kubectl get nodes

# Verify PostgreSQL is ready:
kubectl get svc postgres -n default

# Or directly:
docker ps  # See running containers
```

### 2. Start Backend

```bash
cd apps/backend

# Create database
./scripts/setup_db.sh

# Start server (gRPC on :50051, REST gateway on :8080)
go run main.go

# Or with hot reload (if installed)
# air
```

### 3. Start Frontend

In a new terminal:

```bash
cd apps/frontend

# Development server starts on http://localhost:5173
npm run dev
```

### 4. Deploy to Local Kubernetes

In a new terminal:

```bash
# Validate and deploy to Kind cluster
./scripts/k8s/validate.sh

# Or with specific images
./scripts/k8s/validate.sh \
  ghcr.io/michael-bowen-sc/sourcestream/backend:latest \
  ghcr.io/michael-bowen-sc/sourcestream/frontend:latest
```

### 5. Access Services

**Frontend:**
- Dev mode: http://localhost:5173
- Via K8s: `kubectl port-forward svc/frontend 3000:80 -n sourcestream-staging`

**Backend:**
- gRPC Gateway: http://localhost:8080
- gRPC: localhost:50051
- Via K8s: `kubectl port-forward svc/backend 8080:8080 -n sourcestream-staging`

**PostgreSQL:**
- Host: `postgres` (from other containers) or `localhost:5432`
- User: `sourcestream_user`
- Password: `password` (dev only!)
- Database: `sourcestream`

---

## 🐳 Kubernetes (Kind) Cluster

### Cluster Details

- **Name:** sourcestream
- **Nodes:** 1 control-plane + 2 workers
- **Networking:**
  - Frontend: port 80 → host 80
  - Backend HTTP: port 8080 → host 8080
  - Backend gRPC: port 50051 → host 50051
  - Kubernetes API: port 6443 → host 6443

### Common Kubernetes Commands

```bash
# Cluster info
kubectl cluster-info
kubectl get nodes
kubectl get namespaces

# Deployments
kubectl get deployments -n sourcestream-staging
kubectl get pods -n sourcestream-staging
kubectl get services -n sourcestream-staging

# Logs
kubectl logs -f deployment/backend -n sourcestream-staging
kubectl logs -f deployment/frontend -n sourcestream-staging

# Describe resources
kubectl describe pod <pod-name> -n sourcestream-staging
kubectl describe deployment backend -n sourcestream-staging

# Port forwarding
kubectl port-forward svc/backend 8080:8080 -n sourcestream-staging
kubectl port-forward svc/frontend 3000:80 -n sourcestream-staging

# Execute commands
kubectl exec -it <pod-name> -n sourcestream-staging -- bash

# Delete namespace (cleanup)
kubectl delete namespace sourcestream-staging
```

### Kubernetes Dashboard (Optional)

```bash
# Install Kubernetes Dashboard
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml

# Access dashboard
kubectl proxy
# Open http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/
```

---

## 🧪 Testing

### Frontend Tests

```bash
cd apps/frontend

# Run all tests
npm test

# Watch mode
npm test:watch

# Coverage report
npm test:coverage
```

### Backend Tests

```bash
cd apps/backend

# Run all tests
go test ./...

# With coverage
go test -cover ./...

# Specific package
go test ./services/
```

### Linting

```bash
# All linters
npm run lint:all

# Fix issues
npm run lint:all:fix

# Individual linters
npm run lint:go
npm run lint:ts
npm run lint:css
```

---

## 🚢 Building Docker Images

### Build Locally

```bash
# Backend
docker build -t sourcestream-backend:local apps/backend/

# Frontend
docker build -t sourcestream-frontend:local apps/frontend/

# Run locally
docker run -p 8080:8080 sourcestream-backend:local
docker run -p 3000:80 sourcestream-frontend:local
```

### Load into Kind Cluster

```bash
kind load docker-image sourcestream-backend:local --name sourcestream
kind load docker-image sourcestream-frontend:local --name sourcestream

# Deploy with local images
./scripts/k8s/validate.sh sourcestream-backend:local sourcestream-frontend:local
```

---

## 📝 Ports and Forwarding

| Service | Container | Host | Purpose |
|---------|-----------|------|---------|
| Frontend Dev | 5173 | 5173 | Vite dev server |
| Backend HTTP | 8080 | 8080 | gRPC-Gateway REST |
| Backend gRPC | 50051 | 50051 | gRPC binary protocol |
| PostgreSQL | 5432 | 5432 | Database |
| K8s API | 6443 | 6443 | Kubernetes API |
| K8s Dashboard | 8443 | 8443 | Dashboard UI |

---

## 🐛 Troubleshooting

### "Cannot connect to Docker daemon"

Docker-in-Docker requires docker.sock mount. Verify in devcontainer.json:

```json
"mounts": [
  "source=/var/run/docker.sock,target=/var/run/docker.sock,type=bind"
]
```

### "Kind cluster not found"

Recreate the cluster:

```bash
kind delete cluster --name sourcestream
kind create cluster --name sourcestream --config .devcontainer/kind-config.yaml
```

### "PostgreSQL connection refused"

Wait for database to start:

```bash
docker-compose logs postgres
# or
docker ps | grep postgres
```

### "Node modules are huge / slow"

Clear and reinstall:

```bash
rm -rf node_modules package-lock.json
npm ci --legacy-peer-deps
```

### "Port already in use"

Kill process using port:

```bash
# macOS/Linux
lsof -i :8080
kill -9 <PID>

# Or use different port
kubectl port-forward svc/backend 9000:8080 -n sourcestream-staging
```

---

## 📚 Useful Resources

- [Dev Containers Spec](https://containers.dev/)
- [Kind Documentation](https://kind.sigs.k8s.io/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [GitHub Codespaces](https://github.com/features/codespaces)

---

## 🤝 Contributing

When contributing changes to dev container setup:

1. Update `.devcontainer/Dockerfile` for tool changes
2. Update `post-create.sh` for setup changes
3. Test locally: `devcontainer up` or rebuild in VS Code
4. Document changes in this README

---

## 📋 Environment Variables

See `.devcontainer/docker-compose.yml` for all environment variables:

- `NODE_ENV=development`
- `GOPATH=/go`
- `GOROOT=/usr/local/go`
- Database credentials in `docker-compose.yml`

---

**Last Updated:** March 2026
**Maintained By:** SourceStream Team
