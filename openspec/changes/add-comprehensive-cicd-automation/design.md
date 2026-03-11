# CI/CD Automation Design Document

## Context

SourceStream currently lacks automated quality gates in CI/CD pipeline. Code verification happens only locally via pre-commit hooks, creating risk of quality degradation and late bug detection. The project is ready for comprehensive CI/CD automation to ensure consistent code quality regardless of developer environment.

## Goals

1. **Automate Quality Gates**: Every PR verified against linting, testing, and build standards
2. **Enable Fast Feedback**: Developers see results within 5-10 minutes of PR update
3. **Reduce Manual Work**: Remove manual testing and deployment coordination
4. **Improve Reliability**: Catch environment-specific issues (OS, version differences)
5. **Standardize Process**: Same checks everywhere, regardless of developer setup
6. **Enable Security Scanning**: Automated vulnerability detection

## Non-Goals

- Real-time CI feedback (acceptable to run on demand)
- Complete infrastructure as code (uses existing Kubernetes manifests)
- Multi-region deployment (single staging/production)
- Advanced performance optimization (basic caching sufficient)
- Custom deployment orchestration (use kubectl apply)

## Technical Decisions

### Decision 1: Use GitHub Actions vs. External CI System

**What**: Use GitHub Actions as the CI/CD platform rather than external systems (Jenkins, CircleCI, etc.)

**Why**:
- Native GitHub integration (no additional service setup)
- Generous free tier (2000 minutes/month, sufficient for this scale)
- Workflows stored in repo (version control, code review)
- No maintenance burden (GitHub manages the infrastructure)
- YAML-based (familiar format, readable)

**Alternatives Considered**:
- Jenkins: More powerful but requires self-hosted runner, more ops work
- CircleCI: Good option but external service dependency
- GitLab CI: Only applicable if moved to GitLab
- Buildkite: Overkill for current needs

**Trade-offs**:
- Less customizable than Jenkins (acceptable - standard tooling sufficient)
- Dependent on GitHub availability (acceptable - GitHub is enterprise-grade)

**References**: `.github/workflows/` directory

---

### Decision 2: Workflow Triggers & Events

**What**: Use three separate workflows triggered by different events:
1. `on-pull-request.yml` - PR open/update/reopen
2. `on-merge-to-main.yml` - Push to main
3. `scheduled-security.yml` - Cron schedule (daily)

**Why**:
- Clear separation of concerns (validation vs. deployment vs. security)
- Different SLAs (PR checks fast, security can run nightly)
- Easy to enable/disable each workflow independently
- Reduces context switching in workflow files

**Alternatives Considered**:
- Single monolithic workflow with conditional steps (harder to read, debug)
- Workflow-per-tool (too many files, redundant setup)

**Trade-offs**:
- More workflow files to maintain (offset by clarity)
- Duplicate some setup code (acceptable, can use actions)

---

### Decision 3: Build Matrix Strategy

**What**: Use matrix strategy to run tests against multiple Node/Go versions:
- Node: 20.19.4 (primary), 20.x latest (compatibility)
- Go: 1.23 (primary only initially)

**Why**:
- Catches version-specific bugs (e.g., TypeScript strict mode fails on older Node)
- Ensures compatibility with team's required versions
- Low cost (parallel execution, GitHub Actions handles distribution)

**Alternatives Considered**:
- Single version only (less coverage)
- Many versions (expensive, diminishing returns)

**Trade-offs**:
- Slightly longer build time (offset by parallelization)
- Must manage version compatibility in workflows

---

### Decision 4: Dependency Caching Strategy

**What**: Cache dependencies using GitHub Actions cache action:
- `npm ci` with cache key based on `package-lock.json`
- `go mod download` with cache key based on `go.sum`
- Separate caches per OS (ubuntu-latest)

**Why**:
- Significant build time reduction (50-70% faster with cache)
- Reduces npm/Go server load
- npm cache restores in seconds vs. minutes
- Go modules similarly improve

**Alternatives Considered**:
- No caching (each build installs from scratch)
- Docker layer caching (more complex, requires registry access)

**Trade-offs**:
- Cache can get stale (acceptable - invalidated by lock file changes)
- Uses GitHub cache storage quota (generous limits)

**Implementation**:
```yaml
- uses: actions/setup-node@v4
  with:
    node-version-file: '.nvmrc'
    cache: 'npm'  # Auto-caches based on lock file

- uses: actions/setup-go@v4
  with:
    go-version: '1.23'
    cache: true   # Auto-caches based on go.sum
```

---

### Decision 5: Test Coverage Enforcement

**What**: Enforce minimum test coverage thresholds in CI:
- Frontend: 70% coverage (components), 80% (hooks/utils)
- Backend: 60% baseline coverage

**Why**:
- Prevents coverage regression
- Encourages writing tests for new code
- Gradually improves code quality
- Thresholds are achievable (not too strict)

**Alternatives Considered**:
- No enforcement (coverage decreases over time)
- Very strict (100% - unrealistic, blocks development)
- No separate thresholds per category (one size fits all)

**Trade-offs**:
- May create friction for rapid development (acceptable tradeoff)
- Coverage metrics can be gamed (mitigated by code review)

**Implementation**:
- Jest: `--coverage --coverageReporters=json-summary` + threshold check
- Go: `go tool cover -func=coverage.out` + script to parse and verify

---

### Decision 6: Staging Deployment Approach

**What**: Deploy to staging via kubectl apply on Kubernetes cluster after merge to main

**Why**:
- Leverages existing infrastructure (Kubernetes manifests already created)
- Simple and declarative (kubectl apply is standard)
- No deployment tool lock-in (tools like Helm optional for future)
- Aligns with production deployment model (same tooling, processes)

**Alternatives Considered**:
- Helm for templating (overkill currently)
- Custom deployment scripts (less maintainable)
- ArgoCD for GitOps (additional complexity/infrastructure)

**Trade-offs**:
- Manual cluster access setup needed (one-time)
- No automatic rollback (mitigated by health checks)

**Implementation**:
```bash
kubectl set image deployment/backend \
  backend=registry.example.com/backend:$COMMIT_SHA \
  -n staging

kubectl rollout status deployment/backend -n staging --timeout=5m
```

---

### Decision 7: Health Checks for Deployment Verification

**What**: Run HTTP health checks after deployment to verify service availability

**Why**:
- Catches deployment failures early (before team uses staging)
- Simple, reliable verification (health endpoint)
- Can be reused for monitoring in production
- Provides clear signal: deployed = working

**Alternatives Considered**:
- Manual verification (slow, unreliable)
- No post-deploy checks (silent failures)
- Complex integration tests (slower, more fragile)

**Trade-offs**:
- Requires health endpoint implementation (good practice anyway)
- May catch transient issues (false positives mitigated by retry logic)

**Implementation**:
```bash
# Wait for backend to be healthy
for i in {1..30}; do
  curl -f http://staging-backend:8080/health && break
  sleep 2
done
```

---

### Decision 8: Security Scanning Tools

**What**: Use combination of:
- `go mod check` for Go vulnerabilities
- `npm audit` for Node.js vulnerabilities
- Trivy for container image scanning
- Semgrep (optional) for SAST

**Why**:
- `go mod check` and `npm audit` are official tools (trusted, zero-setup)
- Trivy is fast, accurate, and widely used for container scanning
- Semgrep provides static analysis (optional enhancement)
- Combination catches different vulnerability categories

**Alternatives Considered**:
- Snyk (paid, good but adds cost)
- GitHub dependabot (good but limited scope)
- Manual dependency review (not scalable)

**Trade-offs**:
- Multiple tools mean multiple result formats (acceptable)
- False positives from SAST (mitigated by whitelist)

---

### Decision 9: Workflow Output & Visibility

**What**: Make all workflow results visible through GitHub PR checks and deployment status

**Why**:
- Developers see results in familiar GitHub UI
- No context switching to external tools
- Clear pass/fail indication on PR (blocks merge if configured)
- History available in GitHub deployment tab
- Can integrate with GitHub branch protection rules

**Alternatives Considered**:
- Email notifications (less integrated, less visible)
- Slack webhooks only (requires channel polling)
- External dashboard (additional tool)

**Trade-offs**:
- Depends on GitHub UI (not customizable)
- Some information can be missed if not checking PR

**Implementation**: Use GitHub Actions status checks and deployment status API

---

### Decision 10: Secrets Management

**What**: Use GitHub environment secrets for sensitive credentials:
- Container registry credentials
- Kubernetes cluster access
- Database credentials (if needed)

**Why**:
- GitHub encrypts secrets at rest
- Secrets not visible in workflow logs
- Rotatable without changing code
- Scoped to specific environments

**Alternatives Considered**:
- Hardcoded credentials (security risk)
- .env file in repo (version control risk)
- External secrets manager (additional complexity)

**Trade-offs**:
- Must configure secrets in GitHub UI (one-time)
- Dependent on GitHub security practices (acceptable)

---

## Implementation Phases

### Phase 1: PR Validation (2 days)
- Focus: Fast, tight feedback loop
- Workflows: on-pull-request.yml
- Risk: Low (no deployments, visibility only)
- Team impact: Positive (quick feedback)

### Phase 2: Deployment Automation (1 day)
- Focus: Automated staging deployment
- Workflows: on-merge-to-main.yml
- Risk: Medium (affects staging)
- Team impact: Reduces manual steps

### Phase 3: Security Scanning (1 day)
- Focus: Automated vulnerability detection
- Workflows: scheduled-security.yml
- Risk: Low (informational, no blocks)
- Team impact: Proactive security

---

## Migration Path

1. **Week 1**: Enable on-pull-request.yml (required before merge)
2. **Week 2**: Enable on-merge-to-main.yml (auto-deploy to staging)
3. **Week 3+**: Enable scheduled-security.yml (background checks)

Can disable workflows independently if issues arise.

---

## Success Metrics

| Metric | Target | How Measured |
|--------|--------|--------------|
| Build time (with cache) | < 10 minutes | GitHub Actions log |
| PR feedback latency | < 5 minutes | PR checks visible |
| Coverage enforcement | 70%+ | Jest/Go coverage output |
| Test pass rate | > 95% | Failed runs / total runs |
| Deployment reliability | 100% successful | on-merge-to-main status |
| Security scanning accuracy | < 5% false positives | Alert review |

---

## Open Questions

1. **Staging cluster access**: How will CI runners authenticate to Kubernetes? (service account, kubeconfig, token?)
2. **Container registry**: Where will images be stored? (GitHub Container Registry, private registry, ECR?)
3. **Production deployment**: When to enable? (separate workflow, manual trigger, or CD?)
4. **Build matrix Node versions**: Should we test multiple versions or just primary? (start with primary, add matrix later)
5. **Slack/email notifications**: Want alerts beyond GitHub PR checks?

---

## References

- GitHub Actions documentation: https://docs.github.com/en/actions
- Existing workflow: `.github/workflows/ai-documentation.yml`
- Project conventions: `openspec/project.md`
- Kubernetes manifests: `apps/backend/kubernetes/`, `apps/frontend/kubernetes/`
- Test configuration: `apps/frontend/jest.config.js`, Go test standard library
