#!/bin/bash
set -e

echo "🚀 Setting up SourceStream development environment..."

# Install npm dependencies
echo "📦 Installing npm dependencies..."
npm ci --legacy-peer-deps

# Create Kind cluster for Kubernetes validation
echo "🐳 Creating Kind cluster for local Kubernetes validation..."
if ! kind get clusters | grep -q sourcestream; then
    kind create cluster --name sourcestream --config .devcontainer/kind-config.yaml
    echo "✅ Kind cluster 'sourcestream' created"
else
    echo "✅ Kind cluster 'sourcestream' already exists"
fi

# Load Docker image info into Kind
echo "📝 Configuring kubectl for Kind cluster..."
kubectl cluster-info --context kind-sourcestream

# Create namespace for staging
echo "📁 Creating sourcestream-staging namespace..."
kubectl create namespace sourcestream-staging --dry-run=client -o yaml | kubectl apply -f -

# Pull GHCR images into Kind (if available)
echo "🔄 Attempting to pre-pull GHCR images into Kind cluster..."
kind load docker-image \
    ghcr.io/michael-bowen-sc/sourcestream/backend:latest \
    --name sourcestream 2>/dev/null || echo "⚠️ Backend image not available locally (will pull from registry)"

kind load docker-image \
    ghcr.io/michael-bowen-sc/sourcestream/frontend:latest \
    --name sourcestream 2>/dev/null || echo "⚠️ Frontend image not available locally (will pull from registry)"

# Verify Kubernetes setup
echo "✅ Kubernetes setup complete"
echo ""
echo "📊 Cluster status:"
kubectl get nodes
echo ""
echo "📦 Namespaces:"
kubectl get namespaces

echo ""
echo "✨ Development environment ready!"
echo ""
echo "📚 Next steps:"
echo "  1. Start backend: cd apps/backend && go run main.go"
echo "  2. Start frontend: cd apps/frontend && npm run dev"
echo "  3. Deploy to K8s: ./scripts/k8s/validate.sh"
echo "  4. View K8s dashboard: kubectl proxy (then http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/)"
