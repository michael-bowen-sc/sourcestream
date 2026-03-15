#!/bin/bash

# Automated Rollback Script for SourceStream
# Reverts to previous stable deployment version
# Usage: ./scripts/rollback.sh [backend|frontend|all] [namespace]

set -e

COMPONENT="${1:-all}"
NAMESPACE="${2:-sourcestream-staging}"
ROLLBACK_REVISION=1  # Rollback to previous revision

echo "🔄 SourceStream Rollback Script"
echo "================================"
echo ""
echo "Component: $COMPONENT"
echo "Namespace: $NAMESPACE"
echo "Rollback revision: $ROLLBACK_REVISION (previous version)"
echo ""

# Function to rollback a deployment
rollback_deployment() {
    local deployment=$1
    local namespace=$2

    echo "Rolling back $deployment..."

    # Get current revision
    current_revision=$(kubectl rollout history deployment/$deployment -n $namespace | tail -1 | awk '{print $1}')
    echo "  Current revision: $current_revision"

    # Perform rollback
    kubectl rollout undo deployment/$deployment -n $namespace --to-revision=$ROLLBACK_REVISION

    # Wait for rollout
    kubectl rollout status deployment/$deployment -n $namespace --timeout=5m

    echo "  ✅ $deployment rolled back successfully"
}

# Function to verify rollback
verify_rollback() {
    local deployment=$1
    local namespace=$2

    echo ""
    echo "Verifying $deployment..."

    # Check pod status
    pod_status=$(kubectl get pods -n $namespace -l app=$deployment -o jsonpath='{.items[0].status.phase}')
    echo "  Pod status: $pod_status"

    # Check health endpoint
    pod_name=$(kubectl get pods -n $namespace -l app=$deployment -o jsonpath='{.items[0].metadata.name}')
    echo "  Checking health endpoint on $pod_name..."

    if [ "$deployment" = "backend" ]; then
        kubectl exec -n $namespace $pod_name -- curl -s http://localhost:8080/health || echo "  ⚠️  Health check failed"
    elif [ "$deployment" = "frontend" ]; then
        kubectl exec -n $namespace $pod_name -- curl -s http://localhost/health || echo "  ⚠️  Health check failed"
    fi
}

# Function to rollback all deployments
rollback_all() {
    echo "Rolling back all deployments..."
    echo ""

    rollback_deployment "backend" "$NAMESPACE"
    echo ""
    rollback_deployment "frontend" "$NAMESPACE"

    echo ""
    echo "Verifying rollbacks..."
    verify_rollback "backend" "$NAMESPACE"
    verify_rollback "frontend" "$NAMESPACE"
}

# Main rollback logic
case "$COMPONENT" in
    backend)
        rollback_deployment "backend" "$NAMESPACE"
        verify_rollback "backend" "$NAMESPACE"
        ;;
    frontend)
        rollback_deployment "frontend" "$NAMESPACE"
        verify_rollback "frontend" "$NAMESPACE"
        ;;
    all)
        rollback_all
        ;;
    *)
        echo "❌ Invalid component: $COMPONENT"
        echo "Usage: ./scripts/rollback.sh [backend|frontend|all] [namespace]"
        exit 1
        ;;
esac

echo ""
echo "✅ Rollback completed successfully"
echo ""
echo "To revert this rollback:"
echo "  kubectl rollout redo deployment/$COMPONENT -n $NAMESPACE"
echo ""
