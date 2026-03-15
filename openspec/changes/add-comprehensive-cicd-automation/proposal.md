# Change: Add Comprehensive CI/CD Automation

## Why

The project currently lacks automated quality gates in CI/CD. Code quality verification (linting, testing) occurs only locally via pre-commit hooks. This creates several risks:

1. **Inconsistent Quality**: Developers can bypass local hooks or skip verification
2. **Late Bug Detection**: Integration issues discovered post-merge instead of pre-review
3. **No Staging Validation**: No automated deployment to staging environment
4. **Manual Release Process**: Deployment requires manual steps and coordination
5. **No Security Scanning**: Dependencies and code vulnerabilities not automatically checked
6. **Silent Failures**: No visibility when tests fail in specific conditions (different OS, Node/Go versions)

Automated CI/CD pipelines ensure every PR and merge undergoes consistent, comprehensive quality verification regardless of local environment differences.

## What Changes

### New Workflows

1. **on-pull-request.yml** - Triggered on PR open/update/reopen
   - Lint all code (Go, TypeScript, CSS, Markdown)
   - Run all tests (frontend unit + integration, backend unit)
   - Build both applications
   - Report results as PR checks

2. **on-merge-to-main.yml** - Triggered on merge to main
   - Build Docker images (backend, frontend)
   - Push to container registry (if configured)
   - Deploy to staging environment
   - Run smoke tests on staging deployment
   - Generate deployment summary

3. **scheduled-security.yml** - Daily/weekly automated checks
   - Go security: `go mod check`, Trivy scanning
   - Node security: `npm audit`, dependency scanning
   - SAST: Code quality scanning
   - Report issues as GitHub alerts

### Supporting Infrastructure

- Caching for npm/go dependencies (improve build time)
- Artifact storage for build outputs
- GitHub environment secrets for deployment credentials
- Status badges for repo health visibility

## Impact

**Affected specs:**
- ci-cd (new capability)
- deployment (affects deployment process)
- testing (test automation integration)

**Affected code:**
- `.github/workflows/` directory (new)
- Any future deployment configuration
- Test suite (must be CI-compatible)

**Team impact:**
- Developers: Faster feedback on PRs, no manual test runs
- DevOps: Standardized deployment process
- Project: Improved reliability, fewer production issues

## Success Criteria

✅ Every PR automatically lints, tests, and builds
✅ Tests pass on multiple Node/Go versions
✅ Merge to main automatically deploys to staging
✅ Build/test failures clearly visible in GitHub UI
✅ Security scanning detects vulnerabilities
✅ Build time < 15 minutes (with caching)
✅ All linting errors caught before merge

## Risks & Mitigation

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Tests fail in CI but pass locally | Medium | Use Docker containers, match OS/versions |
| Slow builds block development | Medium | Implement caching, parallelize jobs |
| Deployment fails, needs rollback | Low | Manual approval gate, health checks post-deploy |
| Secret exposure in logs | High | Use GitHub secret masking, audit log access |
| False positives from security scanning | Low | Establish baseline, whitelist known issues |

## Timeline

- **Phase 1** (2 days): PR validation workflow (lint, test, build)
- **Phase 2** (1 day): Merge & staging deployment workflow
- **Phase 3** (1 day): Security scanning workflow
- **Phase 4** (0.5 days): Testing & tuning
- **Total**: 4.5 days

## Breaking Changes

None. This is purely additive—new automation, no code changes required.

## Deployment Notes

- Workflows can be enabled progressively
- Initial implementation: PR validation only (low risk)
- Later phases: Enable after team familiarization
- No database/infrastructure changes needed
