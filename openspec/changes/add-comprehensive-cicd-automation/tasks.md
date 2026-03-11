# Implementation Tasks: Add Comprehensive CI/CD Automation

## Phase 1: PR Validation Workflow (2 days)

### 1. Create on-pull-request.yml workflow

- [ ] 1.1 Create `.github/workflows/on-pull-request.yml` with matrix strategy
- [ ] 1.2 Add checkout step with fetch-depth: 0 for commit analysis
- [ ] 1.3 Add node setup (20.19.4) and go setup (1.23)
- [ ] 1.4 Implement linting job:
  - [ ] 1.4.1 Markdown lint: markdownlint-cli
  - [ ] 1.4.2 Go lint: golangci-lint
  - [ ] 1.4.3 TypeScript/ESLint
  - [ ] 1.4.4 CSS/Stylelint
- [ ] 1.5 Implement dependency caching:
  - [ ] 1.5.1 npm cache (key: package-lock.json)
  - [ ] 1.5.2 Go module cache (key: go.sum)
- [ ] 1.6 Implement frontend test job:
  - [ ] 1.6.1 Run `npm run test` with coverage
  - [ ] 1.6.2 Upload coverage reports
  - [ ] 1.6.3 Fail if coverage < 70%
- [ ] 1.7 Implement backend test job:
  - [ ] 1.7.1 Run `go test ./...` with coverage
  - [ ] 1.7.2 Fail if coverage < 60%
- [ ] 1.8 Implement build job:
  - [ ] 1.8.1 Frontend: `npm run build`
  - [ ] 1.8.2 Backend: `go build`

### 2. Test PR validation locally

- [ ] 2.1 Create feature branch: `feat/add-cicd-automation`
- [ ] 2.2 Commit workflow file
- [ ] 2.3 Create draft PR and verify workflow triggers
- [ ] 2.4 Check workflow execution in GitHub UI
- [ ] 2.5 Verify linting reports appear in PR checks
- [ ] 2.6 Verify test results appear in PR checks

### 3. Optimize for speed

- [ ] 3.1 Add caching to reduce build time
- [ ] 3.2 Parallelize independent jobs
- [ ] 3.3 Document expected build time
- [ ] 3.4 Create build failure troubleshooting guide

## Phase 2: Merge & Staging Deployment (1 day)

### 4. Create on-merge-to-main.yml workflow

- [ ] 4.1 Create `.github/workflows/on-merge-to-main.yml`
- [ ] 4.2 Trigger only on push to main
- [ ] 4.3 Add build Docker images job:
  - [ ] 4.3.1 Backend image build with tag
  - [ ] 4.3.2 Frontend image build with tag
  - [ ] 4.3.3 Tag with git SHA and 'latest'
- [ ] 4.4 Add container registry push (conditional):
  - [ ] 4.4.1 Login to registry (if configured)
  - [ ] 4.4.2 Push both images
  - [ ] 4.4.3 Generate image digest
- [ ] 4.5 Add staging deployment step:
  - [ ] 4.5.1 Apply Kubernetes manifests
  - [ ] 4.5.2 Wait for rollout
  - [ ] 4.5.3 Run health checks
- [ ] 4.6 Add smoke tests:
  - [ ] 4.6.1 Backend health check endpoint
  - [ ] 4.6.2 Frontend page load test
  - [ ] 4.6.3 API connectivity test
- [ ] 4.7 Notify team of deployment:
  - [ ] 4.7.1 Create GitHub deployment
  - [ ] 4.7.2 Post summary to PR that triggered merge

### 5. Set up deployment infrastructure

- [ ] 5.1 Document staging environment endpoint
- [ ] 5.2 Create deployment status checks
- [ ] 5.3 Set up rollback procedure documentation
- [ ] 5.4 Test deployment flow in staging

## Phase 3: Security Scanning (1 day)

### 6. Create scheduled-security.yml workflow

- [ ] 6.1 Create `.github/workflows/scheduled-security.yml`
- [ ] 6.2 Set schedule: daily at 02:00 UTC
- [ ] 6.3 Add Go security checks:
  - [ ] 6.3.1 `go mod check` for vulnerabilities
  - [ ] 6.3.2 Trivy container scan for backend image
- [ ] 6.4 Add Node.js security checks:
  - [ ] 6.4.1 `npm audit` for vulnerabilities
  - [ ] 6.4.2 Trivy container scan for frontend image
  - [ ] 6.4.3 Dependency outdated check
- [ ] 6.5 Add SAST scanning (optional):
  - [ ] 6.5.1 Semgrep or similar code quality scanning
  - [ ] 6.5.2 Report results as GitHub alerts

### 7. Test security workflows

- [ ] 7.1 Run security checks manually
- [ ] 7.2 Verify vulnerability detection
- [ ] 7.3 Create alerts/notifications for team

## Phase 4: Documentation & Testing (0.5 days)

### 8. Create workflow documentation

- [ ] 8.1 Create `docs/ci-cd.md` with:
  - [ ] 8.1.1 Workflow overview (what runs when)
  - [ ] 8.1.2 Build failure troubleshooting
  - [ ] 8.1.3 Deployment process
  - [ ] 8.1.4 Security scanning results interpretation
  - [ ] 8.1.5 Expected build times with/without cache
- [ ] 8.2 Document GitHub secrets needed
- [ ] 8.3 Add build status badge to README

### 9. Create health check endpoint (if missing)

- [ ] 9.1 Add `/health` endpoint to backend (if not exists)
- [ ] 9.2 Return JSON with service status
- [ ] 9.3 Include version info for tracking deployments

### 10. Final testing & validation

- [ ] 10.1 Create feature branch and test all workflows
- [ ] 10.2 Verify all checks pass
- [ ] 10.3 Test with intentional failures (bad lint, test failure)
- [ ] 10.4 Verify failures are clearly reported
- [ ] 10.5 Performance check: build time < 15 minutes
- [ ] 10.6 Create PR with full workflow demonstration

## Verification Checklist

- [ ] All workflows defined and committed
- [ ] Workflows trigger on correct events (PR, push, schedule)
- [ ] All linting checks pass in CI
- [ ] Test coverage enforced in CI
- [ ] Build succeeds in CI (matches local)
- [ ] Docker images built successfully
- [ ] Staging deployment works end-to-end
- [ ] Health checks pass on deployed services
- [ ] Security scanning runs and reports
- [ ] Team can see all checks in PR UI
- [ ] Build time acceptable (< 15 minutes)
- [ ] Documentation complete and accurate

## Blockers & Dependencies

- None. This is self-contained and can be implemented independently.

## Files to Create/Modify

**Create:**
- `.github/workflows/on-pull-request.yml`
- `.github/workflows/on-merge-to-main.yml`
- `.github/workflows/scheduled-security.yml`
- `docs/ci-cd.md`
- `docs/deployment.md` (if not exists)

**Modify:**
- `.github/workflows/ai-documentation.yml` (optional: align format)
- `README.md` (add build status badge)

**May need to update:**
- Backend `.env` for test environments
- Kubernetes manifests (if staging deployment added)
- Health check endpoint implementation
