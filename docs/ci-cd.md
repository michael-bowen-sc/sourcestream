# CI/CD Automation

SourceStream uses GitHub Actions for automated quality gates and deployment. This document explains the workflows and how to interpret results.

## Overview

Three workflows run automatically:

| Workflow | Trigger | Purpose | Duration |
|----------|---------|---------|----------|
| **on-pull-request.yml** | PR opened/updated | Lint, test, build validation | 5-10 min |
| **on-merge-to-main.yml** | Push to main | Build Docker images, deploy to staging | 10-15 min |
| **scheduled-security.yml** | Daily 2 AM UTC | Dependency & code quality scanning | 5 min |

## PR Validation Workflow

When you open or update a pull request, the following checks run automatically:

### Linting (2 min)

All code is checked for style violations:

- **Markdown**: `markdownlint`
- **Go**: `golangci-lint`
- **TypeScript/React**: `eslint`
- **CSS**: `stylelint`

**If linting fails**: Fix errors locally with:
```bash
npm run lint:all:fix
```

### Testing (5-7 min)

#### Frontend Tests
- Jest unit tests: `apps/frontend/src/**/*.test.tsx`
- Integration tests: `apps/frontend/src/__tests__/**/*.integration.test.tsx`
- Coverage threshold: **70%** (components), **80%** (hooks/utils)

**If tests fail**: Run locally and debug:
```bash
cd apps/frontend
npm test                    # Run all tests
npm test -- --watch        # Watch mode
npm test -- --coverage     # Check coverage
```

#### Backend Tests
- Go unit tests: `apps/backend/**/*_test.go`
- Database: PostgreSQL test container (auto-provisioned)
- Coverage threshold: **60%**

**If tests fail**: Run locally:
```bash
cd apps/backend
go test ./...                    # Run all tests
go test -v ./...                 # Verbose
go test -cover ./...             # Check coverage
```

### Build (3-5 min)

- Frontend: `npm run build` → verifies TypeScript compilation
- Backend: `go build` → verifies no compile errors

**If build fails**: Check errors locally:
```bash
cd apps/frontend && npm run build
cd apps/backend && go build -o ./bin/sourcestream-backend ./
```

### Status Check

All jobs must pass for the PR to be mergeable (if branch protection enabled).

**View results**:
1. Go to your PR on GitHub
2. Scroll to "Checks" section
3. Click each check to see details
4. Click "Details" to view workflow logs

## Merge to Main (Staging Deployment)

When code is merged to main, additional workflows run:

### Build Docker Images (5 min)

- Backend image: `sourcestream/backend:{{ commit-sha }}`
- Frontend image: `sourcestream/frontend:{{ commit-sha }}`

Both tagged with:
- `latest` - most recent build
- `main-{{ commit-sha }}` - source branch commit

**View images**:
```bash
docker images | grep sourcestream
```

### Push to Container Registry

**Status**: Configuration needed (see below)

Images are built but not yet pushed to registry. Once configured, they will be pushed to:
- GitHub Container Registry (ghcr.io)
- Or: Custom registry (AWS ECR, DockerHub, etc.)

### Deploy to Staging

**Status**: Configuration needed (see below)

Once container registry is configured, this will:
1. Push images to registry
2. Update Kubernetes deployment in staging
3. Wait for rollout (< 5 min)
4. Run health checks to verify deployment

## Security Scanning

Runs daily at 2 AM UTC (or on-demand):

### Dependency Audit
- **Go**: Checks for known vulnerabilities in modules
- **Node.js**: `npm audit` scans for CVEs
- **Level**: Flags moderate/high/critical issues

**View results**:
1. Go to Actions → scheduled-security.yml
2. Click latest run
3. See audit results in job logs

**Fix vulnerabilities**:
```bash
# Node.js
npm update                    # Update packages
npm audit fix                 # Auto-fix vulnerable packages

# Go
go get -u                    # Update modules
```

### Code Quality

- **Go vet**: Finds common Go mistakes
- **Type checking**: TypeScript strict mode verification
- **Semgrep**: Security-focused static analysis

### Container Scanning

- **Trivy**: Scans built images for vulnerabilities
- Reports layer-level issues
- Available in GitHub Security tab

## Common Issues & Troubleshooting

### Build Failed: "npm dependencies not installed"

**Cause**: `npm ci` failed
**Fix**: Verify locally:
```bash
npm ci
npm run build
```

### Test Failed: "Coverage below threshold"

**Cause**: New code without tests
**Fix**: Add tests or verify coverage:
```bash
cd apps/frontend
npm test -- --coverage
# Check `coverage/` directory for report
```

### Build Failed: "Protobuf files out of date"

**Cause**: `.proto` files changed but generated `.pb.go` files not updated
**Fix**: Regenerate:
```bash
cd apps/backend
make proto
# OR:
protoc --go_out=. --go_opt=paths=source_relative \
       --go-grpc_out=. --go-grpc_opt=paths=source_relative \
       ../proto/*.proto
```

### Test Failed: "Database connection timeout"

**Cause**: PostgreSQL container took too long to start
**Fix**: This is usually transient. Retry the workflow in GitHub UI:
1. Go to Actions tab
2. Find failed workflow run
3. Click "Re-run jobs"

### Workflow Stuck Running

**Cause**: Runner out of disk space or blocked
**Fix**: Cancel and restart:
1. Go to Actions tab
2. Click workflow name
3. Click "Cancel workflow"
4. Push a new commit to retrigger (or click "Re-run")

## Performance Optimization

### Build Time

**Typical time: 5-10 minutes**

- Dependencies cached (npm, Go modules)
- Faster on subsequent runs due to cache hits
- Cache invalidated when lock files change

**To improve locally**:
```bash
# Run only unit tests (skip integration)
npm test -- --testPathIgnorePatterns=integration

# Run linting on changed files only (with git pre-commit)
git diff --name-only HEAD | xargs npm run lint
```

### Parallelization

Jobs run in parallel:
- `lint` - all linting jobs together
- `test-frontend` - concurrently with `test-backend`
- `build` - concurrently with tests

Overall: ~5-10 min (not sequential 15+ min)

## Viewing Workflow Runs

### In GitHub UI

1. Go to repo → Actions tab
2. See all workflow runs
3. Click run to see details
4. Click job to see logs
5. Search logs with browser find (Ctrl+F)

### Via GitHub CLI

```bash
# List recent runs
gh run list

# View specific run
gh run view {{ run-id }} --log

# Watch workflow
gh run watch {{ run-id }}
```

## Debugging Failed Workflows

### Step 1: View Job Logs

Click "Details" on failed check to see:
- Which step failed
- Error output
- Context (files involved)

### Step 2: Reproduce Locally

Replicate the failed command:
```bash
# For linting failures
npm run lint:all:fix

# For test failures
npm test  # or go test ./...

# For build failures
npm run build  # or go build ./...
```

### Step 3: Commit Fix

Fix the issue, commit, and push. Workflow will re-run automatically.

## Deployment Configuration

### Container Registry Setup

For on-merge-to-main deployment to work, configure:

1. **GitHub Secrets** (Repo Settings → Secrets and variables → Actions):
   ```
   REGISTRY_URL=ghcr.io  # or your registry
   REGISTRY_USERNAME=YOUR_USERNAME
   REGISTRY_PASSWORD=YOUR_TOKEN
   ```

2. **Update workflow** (`.github/workflows/on-merge-to-main.yml`):
   ```yaml
   - name: Push to registry
     uses: docker/build-push-action@v4
     with:
       push: true
       registry: ${{ secrets.REGISTRY_URL }}
       username: ${{ secrets.REGISTRY_USERNAME }}
       password: ${{ secrets.REGISTRY_PASSWORD }}
   ```

### Kubernetes Deployment Setup

1. **Create deploy script** (`scripts/deploy/staging.sh`):
   ```bash
   #!/bin/bash
   kubectl set image deployment/backend \
     backend=registry.example.com/backend:$COMMIT_SHA \
     -n staging
   kubectl rollout status deployment/backend -n staging --timeout=5m
   ```

2. **Add GitHub Secret**:
   ```
   KUBECONFIG=<base64-encoded ~/.kube/config>
   ```

3. **Uncomment in workflow** (`.github/workflows/on-merge-to-main.yml`)

## Best Practices

### For Developers

1. **Run linting locally before pushing**:
   ```bash
   npm run lint:all:fix
   ```

2. **Run tests locally**:
   ```bash
   npm test && cd apps/backend && go test ./...
   ```

3. **Monitor PR checks**: Don't merge if checks are failing

4. **Keep commits clean**: Atomic commits are easier to debug if CI fails

### For CI/CD

1. **Keep workflows simple**: Each workflow has one primary purpose

2. **Use caching**: Reduces build times and server load

3. **Fail fast**: Lint check runs first (fastest)

4. **Parallelize**: Independent jobs run concurrently

5. **Report clearly**: GitHub UI shows results prominently

## Updating Workflows

### Adding New Tools

1. Edit `.github/workflows/on-pull-request.yml`
2. Add step in appropriate job
3. Commit and push to feature branch
4. Workflow will run on PR automatically
5. Test thoroughly before merging to main

### Example: Add TypeScript strict mode check

```yaml
- name: Type check TypeScript
  run: cd apps/frontend && npx tsc --noEmit --strict
```

### Example: Add Go test on specific versions

```yaml
strategy:
  matrix:
    go-version: ['1.22', '1.23']

- name: Set up Go
  uses: actions/setup-go@v4
  with:
    go-version: ${{ matrix.go-version }}
```

## Further Reading

- [GitHub Actions documentation](https://docs.github.com/en/actions)
- [Workflow syntax reference](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Security best practices](https://docs.github.com/en/actions/security-guides)
- Project guidelines: `CLAUDE.md`, `openspec/project.md`
