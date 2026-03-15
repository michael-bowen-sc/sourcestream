# GitHub Container Registry (GHCR) Setup Guide

This guide explains how the SourceStream CI/CD system uses GitHub Container Registry to store Docker images.

## Overview

The `on-merge-to-main.yml` workflow automatically builds and pushes Docker images to GitHub Container Registry (GHCR) whenever code is merged to the `main` branch.

### What Happens Automatically

1. **Build Docker Images**
   - Backend image built from `apps/backend/Dockerfile`
   - Frontend image built from `apps/frontend/Dockerfile`
   - Images cached for faster rebuilds

2. **Push to GHCR**
   - Images pushed to `ghcr.io/michael-bowen-sc/sourcestream`
   - Tagged with commit SHA (e.g., `abc1234def`)
   - Tagged with `latest` on main branch
   - Tagged with branch name (e.g., `main`)

3. **Verification**
   - Images verified by pulling and inspecting
   - Registry access logged

### No Additional Setup Required

GHCR integration uses GitHub's built-in authentication (GITHUB_TOKEN), so **no additional credentials need to be configured**. The workflow works automatically!

## Image Tags and Locations

### Backend Image
```
ghcr.io/michael-bowen-sc/sourcestream/backend:<sha>
ghcr.io/michael-bowen-sc/sourcestream/backend:main
ghcr.io/michael-bowen-sc/sourcestream/backend:latest
```

### Frontend Image
```
ghcr.io/michael-bowen-sc/sourcestream/frontend:<sha>
ghcr.io/michael-bowen-sc/sourcestream/frontend:main
ghcr.io/michael-bowen-sc/sourcestream/frontend:latest
```

## Accessing Images

### View in GitHub UI

1. Go to: https://github.com/michael-bowen-sc/sourcestream/pkgs/container
2. See all images and tags
3. View download instructions

### Pull Locally

```bash
# Authenticate to GHCR
gh auth token | docker login ghcr.io -u USERNAME --password-stdin

# Pull an image
docker pull ghcr.io/michael-bowen-sc/sourcestream/backend:latest
docker pull ghcr.io/michael-bowen-sc/sourcestream/frontend:latest
```

### Pull in Kubernetes

```bash
# Create image pull secret
kubectl create secret docker-registry ghcr \
  --docker-server=ghcr.io \
  --docker-username=USERNAME \
  --docker-password=$(gh auth token) \
  -n sourcestream-staging

# Reference in deployment
imagePullSecrets:
  - name: ghcr
```

## Image Tagging Strategy

Images are tagged automatically on every merge:

| Tag | When | Use Case |
|-----|------|----------|
| `<commit-sha>` | Always | Pin to exact commit |
| `main` | On main branch | Deploy current main |
| `latest` | On main branch | Latest production-ready |

### Example Tags
```
ghcr.io/michael-bowen-sc/sourcestream/backend:abc1234def5f
ghcr.io/michael-bowen-sc/sourcestream/backend:main
ghcr.io/michael-bowen-sc/sourcestream/backend:latest
```

## Workflow Details

### Build & Push Job

**File**: `.github/workflows/on-merge-to-main.yml`

**Key steps**:
1. Authenticate to GHCR using GITHUB_TOKEN
2. Build images with Docker Buildx
3. Push images with metadata tags
4. Cache layers for faster rebuilds

**Permissions required**:
```yaml
permissions:
  contents: read
  packages: write
```

These are automatically granted in GitHub Actions.

### Verify Job

**Purpose**: Confirm images were pushed successfully

**Steps**:
1. Pull each image from GHCR
2. Verify image exists and is accessible
3. Report success/failure

## Next Steps: Kubernetes Deployment

Once images are in GHCR, the next step is deploying to staging via Kubernetes.

### Prerequisites for Staging Deployment

1. **Kubernetes cluster access**
   - Add `K8S_KUBECONFIG` or `K8S_TOKEN` to GitHub Secrets

2. **Deployment manifests**
   - Create K8s deployment files in `apps/kubernetes/`

3. **Update workflow**
   - Uncomment deployment job in `on-merge-to-main.yml`

### Configure K8s Access

To enable automatic deployment to staging:

```bash
# Add kubeconfig as GitHub Secret
gh secret set K8S_KUBECONFIG --body "$(cat ~/.kube/config | base64)"

# Or add individual credentials
gh secret set K8S_TOKEN --body "your-service-account-token"
gh secret set K8S_SERVER --body "https://your-cluster:6443"
gh secret set K8S_CA --body "your-ca-certificate"
```

## Troubleshooting

### Images not appearing in GHCR

**Check**:
- Workflow ran successfully (check Actions tab)
- Build step completed without errors
- Push step shows "pushed" status

**Solution**:
```bash
# Check workflow logs
gh run view <run-id> --log
```

### Cannot pull image locally

**Error**: `denied: User does not have permission`

**Solution**:
```bash
# Re-authenticate
gh auth token | docker login ghcr.io -u USERNAME --password-stdin
docker pull ghcr.io/michael-bowen-sc/sourcestream/backend:latest
```

### Push fails with authentication error

**Check**:
- GitHub Token has `packages:write` permission
- Workflow has `packages: write` in permissions

**Solution**:
The workflow uses `GITHUB_TOKEN` which is automatically available. No manual setup needed.

## Security Notes

### Token Security
- `GITHUB_TOKEN` is automatically created and scoped to the workflow
- Token expires after the workflow completes
- No permanent credentials stored

### Image Privacy
- Container images stored in GitHub Packages
- Access controlled via repository permissions
- Public images if repository is public
- Private images if repository is private

### Best Practices
1. Always use commit SHA tag for production deployments (immutable)
2. Use `latest` tag for development/staging only
3. Review image contents before deployment
4. Keep images small (use multi-stage builds)
5. Scan images for vulnerabilities regularly

## References

- **GHCR Documentation**: https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry
- **GitHub Actions**: `.github/workflows/on-merge-to-main.yml`
- **Deployment Guide**: `docs/deployment.md`
- **Kubernetes Config**: `apps/kubernetes/` (future)

## Summary

✅ **GHCR Integration**: Active and automatic
- Images automatically built on merge
- Pushed to `ghcr.io/michael-bowen-sc/sourcestream`
- No additional setup required
- Ready for Kubernetes deployment

**Next**: Set up Kubernetes deployment to automatically deploy images to staging.
