#!/bin/bash

# Kubernetes Deployment Validation Script
# Usage: ./scripts/k8s/validate.sh [backend-image] [frontend-image]

set -e

BACKEND_IMAGE="${1:-ghcr.io/michael-bowen-sc/sourcestream/backend:latest}"
FRONTEND_IMAGE="${2:-ghcr.io/michael-bowen-sc/sourcestream/frontend:latest}"
NAMESPACE="sourcestream-staging"
CONTEXT="kind-sourcestream"

echo "🔍 Kubernetes Deployment Validation"
echo "===================================="
echo ""
echo "📋 Configuration:"
echo "  Backend Image:  $BACKEND_IMAGE"
echo "  Frontend Image: $FRONTEND_IMAGE"
echo "  Namespace:      $NAMESPACE"
echo "  Context:        $CONTEXT"
echo ""

# Verify kubectl is available
if ! command -v kubectl &> /dev/null; then
  echo "❌ kubectl not found. Please install kubectl."
  exit 1
fi

# Verify Kind cluster is running
echo "✓ Checking Kind cluster..."
if ! kind get clusters | grep -q sourcestream; then
  echo "❌ Kind cluster 'sourcestream' not found"
  echo "   Run: kind create cluster --name sourcestream --config .devcontainer/kind-config.yaml"
  exit 1
fi
echo "✓ Kind cluster 'sourcestream' is running"
echo ""

# Set context
kubectl config use-context $CONTEXT > /dev/null

# Check cluster connectivity
echo "✓ Verifying cluster connectivity..."
if ! kubectl cluster-info &> /dev/null; then
  echo "❌ Cannot connect to Kubernetes cluster"
  exit 1
fi
echo "✓ Cluster is accessible"
echo ""

# Create namespace
echo "📁 Creating namespace..."
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -
echo "✓ Namespace '$NAMESPACE' ready"
echo ""

# Apply Kubernetes manifests
echo "🚀 Deploying manifests..."
echo ""

echo "  Applying namespace..."
kubectl apply -f apps/kubernetes/namespace.yaml

echo "  Applying backend deployment..."
kubectl set image deployment/backend backend=$BACKEND_IMAGE \
  -n $NAMESPACE --dry-run=client -o yaml | kubectl apply -f - || \
kubectl apply -f apps/kubernetes/backend-deployment.yaml

echo "  Applying frontend deployment..."
kubectl set image deployment/frontend frontend=$FRONTEND_IMAGE \
  -n $NAMESPACE --dry-run=client -o yaml | kubectl apply -f - || \
kubectl apply -f apps/kubernetes/frontend-deployment.yaml

echo "  Applying services..."
kubectl apply -f apps/kubernetes/services.yaml

echo "✓ Manifests deployed"
echo ""

# Wait for deployments to be ready
echo "⏳ Waiting for deployments to be ready (timeout: 5 minutes)..."
echo ""

echo "  Backend:"
if kubectl rollout status deployment/backend -n $NAMESPACE --timeout=5m; then
  echo "  ✓ Backend ready"
else
  echo "  ❌ Backend deployment failed"
  exit 1
fi

echo ""
echo "  Frontend:"
if kubectl rollout status deployment/frontend -n $NAMESPACE --timeout=5m; then
  echo "  ✓ Frontend ready"
else
  echo "  ❌ Frontend deployment failed"
  exit 1
fi

echo ""
echo "✅ Deployment Validation Complete!"
echo ""

# Show deployment status
echo "📊 Deployment Status:"
echo "===================="
kubectl get deployments -n $NAMESPACE
echo ""

# Show pod status
echo "📦 Pod Status:"
echo "=============="
kubectl get pods -n $NAMESPACE
echo ""

# Show services
echo "🔌 Services:"
echo "============"
kubectl get services -n $NAMESPACE
echo ""

# Show service endpoints
echo "🔗 Service Endpoints:"
echo "===================="
BACKEND_IP=$(kubectl get service backend -n $NAMESPACE -o jsonpath='{.spec.clusterIP}')
FRONTEND_IP=$(kubectl get service frontend -n $NAMESPACE -o jsonpath='{.status.loadBalancer.ingress[0].ip}')

if [ -z "$FRONTEND_IP" ]; then
  FRONTEND_IP="Pending"
fi

echo "  Backend:  $BACKEND_IP:8080 (gRPC Gateway)"
echo "  Frontend: $FRONTEND_IP (LoadBalancer)"
echo ""

# Run basic health checks
echo "🏥 Health Checks:"
echo "================"

# Check backend health
echo "  Backend gRPC Gateway:"
BACKEND_POD=$(kubectl get pod -n $NAMESPACE -l app=backend -o jsonpath='{.items[0].metadata.name}' 2>/dev/null)
if [ -n "$BACKEND_POD" ]; then
  if kubectl exec -n $NAMESPACE $BACKEND_POD -- wget -q -O- http://localhost:8080/health &> /dev/null; then
    echo "    ✓ Health endpoint responding"
  else
    echo "    ⚠️ Health endpoint not responding (service may still be starting)"
  fi
else
  echo "    ⚠️ No backend pods found"
fi

# Check frontend availability
echo "  Frontend HTTP:"
FRONTEND_POD=$(kubectl get pod -n $NAMESPACE -l app=frontend -o jsonpath='{.items[0].metadata.name}' 2>/dev/null)
if [ -n "$FRONTEND_POD" ]; then
  if kubectl exec -n $NAMESPACE $FRONTEND_POD -- wget -q -O- http://localhost/ &> /dev/null; then
    echo "    ✓ HTTP endpoint responding"
  else
    echo "    ⚠️ HTTP endpoint not responding (service may still be starting)"
  fi
else
  echo "    ⚠️ No frontend pods found"
fi

echo ""
echo "📝 Next Steps:"
echo "============="
echo "  1. Check logs:"
echo "     kubectl logs -f deployment/backend -n $NAMESPACE"
echo "     kubectl logs -f deployment/frontend -n $NAMESPACE"
echo ""
echo "  2. Port forward for local testing:"
echo "     kubectl port-forward svc/backend 8080:8080 -n $NAMESPACE"
echo "     kubectl port-forward svc/frontend 3000:80 -n $NAMESPACE"
echo ""
echo "  3. Access dashboard:"
echo "     kubectl proxy"
echo "     Open http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/"
echo ""
echo "  4. Delete deployment (cleanup):"
echo "     kubectl delete namespace $NAMESPACE"
echo ""
