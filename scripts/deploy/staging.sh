#!/bin/bash

# Staging Deployment Script
# Usage: ./scripts/deploy/staging.sh <backend-image> <frontend-image>

set -e

BACKEND_IMAGE="${1:-ghcr.io/michael-bowen-sc/sourcestream/backend:latest}"
FRONTEND_IMAGE="${2:-ghcr.io/michael-bowen-sc/sourcestream/frontend:latest}"
NAMESPACE="sourcestream-staging"
KUBECONFIG="${KUBECONFIG:-$HOME/.kube/config}"

echo "🚀 Deploying to Staging"
echo "========================"
echo "Backend:  $BACKEND_IMAGE"
echo "Frontend: $FRONTEND_IMAGE"
echo "Namespace: $NAMESPACE"
echo ""

# Check if kubeconfig exists
if [ ! -f "$KUBECONFIG" ]; then
  echo "❌ Error: KUBECONFIG not found at $KUBECONFIG"
  echo "Please configure kubectl access to staging cluster"
  exit 1
fi

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
  echo "❌ Error: kubectl not found. Please install kubectl."
  exit 1
fi

# Verify cluster connection
echo "📋 Verifying cluster connection..."
if ! kubectl cluster-info > /dev/null 2>&1; then
  echo "❌ Error: Cannot connect to Kubernetes cluster"
  echo "Please verify KUBECONFIG is set correctly"
  exit 1
fi
echo "✓ Connected to cluster"
echo ""

# Create namespace if it doesn't exist
echo "📁 Ensuring namespace exists..."
kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f - > /dev/null
echo "✓ Namespace $NAMESPACE ready"
echo ""

# Update deployments with new images
echo "🔄 Updating deployments..."

# Update backend deployment
if kubectl get deployment backend -n "$NAMESPACE" > /dev/null 2>&1; then
  echo "  Updating backend deployment..."
  kubectl set image deployment/backend \
    backend="$BACKEND_IMAGE" \
    -n "$NAMESPACE" \
    --record
  kubectl rollout status deployment/backend -n "$NAMESPACE" --timeout=5m
  echo "  ✓ Backend updated"
else
  echo "  ⚠️ Backend deployment not found (first time? Create it manually)"
fi

# Update frontend deployment
if kubectl get deployment frontend -n "$NAMESPACE" > /dev/null 2>&1; then
  echo "  Updating frontend deployment..."
  kubectl set image deployment/frontend \
    frontend="$FRONTEND_IMAGE" \
    -n "$NAMESPACE" \
    --record
  kubectl rollout status deployment/frontend -n "$NAMESPACE" --timeout=5m
  echo "  ✓ Frontend updated"
else
  echo "  ⚠️ Frontend deployment not found (first time? Create it manually)"
fi

echo ""
echo "✅ Staging Deployment Complete"
echo ""

# Show deployment status
echo "📊 Deployment Status:"
echo "===================="
kubectl get deployments -n "$NAMESPACE"
echo ""

# Show pod status
echo "📦 Pod Status:"
echo "============="
kubectl get pods -n "$NAMESPACE"
echo ""

echo "🔗 Staging Environment:"
echo "======================"
echo "Get service info: kubectl get svc -n $NAMESPACE"
echo "View logs: kubectl logs -f deployment/backend -n $NAMESPACE"
echo "Check events: kubectl get events -n $NAMESPACE --sort-by='.lastTimestamp'"
