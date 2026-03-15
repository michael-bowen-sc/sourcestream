# Deployment Process

This document describes how SourceStream is deployed to staging and production environments.

## Deployment Environments

### Staging

- **Trigger**: Automatic on every merge to `main`
- **Endpoint**: `staging.sourcestream.internal` (or configured value)
- **Database**: Staging PostgreSQL instance (separate data)
- **Retention**: 7 days minimum
- **Rollback**: Automatic (previous deployment available)

**Purpose**: Validate changes in realistic environment before production

### Production

- **Trigger**: Manual deployment from GitHub releases
- **Endpoint**: `sourcestream.internal` (or configured value)
- **Database**: Production PostgreSQL (critical - backed up)
- **Retention**: Indefinite
- **Rollback**: Manual - revert to previous release tag

**Purpose**: Live service serving real users

## Automatic Staging Deployment

### Flow

```
Code merge to main
    ↓
Build Docker images (backend + frontend)
    ↓
Push to container registry
    ↓
Deploy to Kubernetes staging cluster
    ↓
Run health checks
    ↓
Notify team of deployment
```

### Triggering

Deployment is **automatic**. Simply merge a PR to `main`:

```bash
# Merge PR through GitHub UI, or:
git checkout main
git pull origin main

# Local merge (if not via GitHub):
git merge --ff-only origin/feat/my-feature
git push origin main
```

Within 2-3 minutes, new code will be live in staging.

### Monitoring Deployment

#### In GitHub UI

1. Go to repo → Actions tab
2. Look for "Build & Deploy to Staging" workflow
3. Click the running workflow
4. See job progress in real-time
5. View "Deployment Summary" for results

#### Via GitHub CLI

```bash
gh run list --workflow on-merge-to-main.yml --limit 5

# Watch specific run
gh run watch {{ run-id }}

# View deployment details
gh deployment list
```

#### Via Kubernetes (if accessible)

```bash
# Check deployment status
kubectl get deployment -n staging

# View recent pod activity
kubectl get pods -n staging --sort-by='.metadata.creationTimestamp'

# Check deployment logs
kubectl logs -n staging deployment/backend --tail=100

# Describe deployment for events
kubectl describe deployment backend -n staging
```

### Post-Deployment Checks

After deployment, verify:

1. **Health Endpoint**: `curl http://staging.sourcestream.internal:8080/health`
   ```json
   {
     "status": "healthy",
     "version": "1.0.0",
     "database": "ok"
   }
   ```

2. **Frontend Load**: Open `http://staging.sourcestream.internal:5173` in browser

3. **Basic Workflows**: Test key user flows manually
   - View dashboard
   - Submit request
   - Check request status

## Manual Production Deployment

### Prerequisites

- [ ] All tests passing in main branch
- [ ] Code reviewed and merged
- [ ] Staging deployment successful (24+ hours validation)
- [ ] Release notes prepared
- [ ] Rollback plan documented
- [ ] Team notified (if external-facing changes)

### Step 1: Create Release Tag

```bash
# Pull latest main
git checkout main
git pull origin main

# Create release (using Conventional Commits)
# Tag format: v1.2.3

git tag -a v1.2.3 -m "Release 1.2.3

## Features
- Feature X
- Feature Y

## Fixes
- Bug X

## Breaking Changes
None"

# Push tag (triggers production deployment)
git push origin v1.2.3
```

### Step 2: Verify Deployment

Deployment starts automatically when tag is pushed.

**Monitor in GitHub UI**:
```
Repo → Deployments → Latest deployment
```

**Check via CLI**:
```bash
gh deployment list

# Get details
gh deployment view {{ deployment-id }}
```

### Step 3: Post-Deployment Validation

1. **Check services are running**:
   ```bash
   curl http://sourcestream.internal:8080/health
   ```

2. **Verify features work**:
   - Test critical user flows manually
   - Check error logs for unusual errors
   - Monitor response times

3. **Run smoke tests**:
   ```bash
   scripts/e2e/smoke-tests.sh production
   ```

### Step 4: Communicate

If deployment is user-facing:

1. **Notify users** (via email/Slack/banner)
2. **Highlight new features** or changes
3. **Request feedback** if appropriate

## Rollback Procedure

### When to Rollback

- Critical bugs affecting production
- Service outage or degradation
- Significant performance regression
- Security issue requiring immediate revert

### How to Rollback

#### Option 1: Automatic Rollback (Fast)

If using GitOps/ArgoCD:
```bash
# Sync to previous stable tag
kubectl rollout undo deployment/backend -n production
kubectl rollout undo deployment/frontend -n production

# Verify rollback
kubectl rollout status deployment/backend -n production
```

#### Option 2: Manual Rollback (Safer)

1. **Identify previous good version**:
   ```bash
   git tag -l --sort=-version:refname | head -5
   # Output: v1.2.3, v1.2.2, v1.2.1, ...
   ```

2. **Re-deploy previous version**:
   ```bash
   git tag v1.2.2
   git push origin v1.2.2  # Triggers re-deployment
   ```

3. **Verify services are running**:
   ```bash
   curl http://sourcestream.internal:8080/health
   ```

4. **Document incident**:
   - What went wrong
   - When discovered
   - How rolled back
   - Resolution (code fix or different approach)

### Communication

Notify team of rollback and status:

```
🔄 Production Rollback

Version: v1.2.2 (from v1.2.3)
Reason: Critical bug in request approval flow
Time: 2:15 PM UTC
Status: ✅ Rollback complete, services healthy

Next Steps:
- Investigation ongoing in #incidents channel
- Will re-deploy v1.2.4 with fix by 3 PM UTC
```

## Container Image Management

### Image Naming Convention

```
registry.example.com/sourcestream/{{ service }}:{{ tag }}
```

**Services**:
- `backend` - Go gRPC service
- `frontend` - React application

**Tags**:
- `latest` - Most recent build
- `v1.2.3` - Stable release (matches git tag)
- `main-abc123` - Latest from main branch
- `staging-abc123` - For staging deployments

### Pushing Images

Images are automatically pushed on merge to main:

```yaml
# In .github/workflows/on-merge-to-main.yml
- name: Push to registry
  uses: docker/build-push-action@v4
  with:
    push: true
    registry: ghcr.io
    username: ${{ secrets.REGISTRY_USERNAME }}
    password: ${{ secrets.REGISTRY_PASSWORD }}
    tags: |
      ghcr.io/sourcestream/backend:latest
      ghcr.io/sourcestream/backend:${{ github.sha }}
```

### Cleaning Up Old Images

Periodically remove old images to save storage:

```bash
# List images older than 30 days
gh container-registry delete old

# Manual removal
docker rmi $(docker images --filter="before=sourcestream/backend:30d" -q)
```

## Database Deployments

### Schema Migrations

Migrations are managed via SQL files in `apps/backend/migrations/`:

1. **Create migration**:
   ```bash
   touch apps/backend/migrations/004_add_new_column.sql
   ```

2. **Write migration** (include both up and down):
   ```sql
   -- UP
   ALTER TABLE requests ADD COLUMN new_field VARCHAR(255);

   -- DOWN
   ALTER TABLE requests DROP COLUMN new_field;
   ```

3. **Test locally**:
   ```bash
   ./scripts/database/migrate.sh up
   # Verify schema
   ./scripts/database/migrate.sh down
   ```

4. **Deploy**:
   - Merge to main (PR tests run migrations)
   - Deploy to staging (runs migrations)
   - Deploy to production (migrations run)

### Zero-Downtime Migrations

For large tables:

1. **Add column as nullable** first
2. **Backfill data** in background job
3. **Add constraint/index** later
4. **Make column required** (if needed)

Example:
```sql
-- Step 1: Add nullable
ALTER TABLE users ADD COLUMN updated_at TIMESTAMP NULL;

-- Step 2: Application backfills existing rows
UPDATE users SET updated_at = NOW() WHERE updated_at IS NULL;

-- Step 3: Make NOT NULL
ALTER TABLE users ALTER COLUMN updated_at SET NOT NULL;
```

### Backup & Recovery

**Automated backups**:
- Production database: Daily backups, 30-day retention
- Staging database: Daily backups, 7-day retention

**Manual backup** (before critical operations):
```bash
pg_dump sourcestream > backup-$(date +%Y%m%d).sql
```

**Restore from backup**:
```bash
psql sourcestream < backup-20240311.sql
```

## Deployment Checklist

### Pre-Deployment

- [ ] All PR checks passing on main
- [ ] Code reviewed (at least 2 reviewers)
- [ ] CHANGELOG updated (if user-facing)
- [ ] Database migrations tested locally
- [ ] Performance acceptable (no new N+1 queries)
- [ ] No hardcoded secrets or credentials
- [ ] Error handling verified
- [ ] User documentation updated

### Deployment

- [ ] Create release tag with semantic versioning
- [ ] GitHub Actions workflow triggers
- [ ] Docker images build successfully
- [ ] Images push to registry
- [ ] Kubernetes deployment updates
- [ ] Pods start and become ready
- [ ] Health checks pass

### Post-Deployment

- [ ] Health endpoint returns 200
- [ ] Frontend loads without errors (console clean)
- [ ] Critical user flows work
- [ ] Error logs reviewed (no new errors)
- [ ] Performance metrics normal (latency, CPU, memory)
- [ ] Database queries performant (no slow queries)
- [ ] No pending database migrations

### Communication

- [ ] Team notified of deployment
- [ ] Change log posted (if appropriate)
- [ ] Customers notified of features (if external)
- [ ] Feature flags documented

## Troubleshooting Deployments

### Pods not starting

**Symptom**: Deployment stuck in "Pending" or "CrashLoopBackOff"

**Check**:
```bash
kubectl describe pod {{ pod-name }} -n production
kubectl logs {{ pod-name }} -n production --previous
```

**Common causes**:
- Image not found (wrong registry)
- Insufficient resources (CPU, memory)
- Missing environment variables
- Database connection issues

### Health check failing

**Symptom**: Deployment succeeds but services unhealthy

**Check**:
```bash
curl -v http://staging.sourcestream.internal:8080/health

# Check service logs
kubectl logs -n staging deployment/backend --tail=100
```

**Common causes**:
- Database unreachable
- Incorrect environment variables
- Port not exposed correctly
- Service dependency down

### Slow rollout

**Symptom**: Deployment taking > 10 minutes

**Check**:
```bash
kubectl get events -n staging --sort-by='.lastTimestamp'
```

**Common causes**:
- Large image download (slow registry)
- Slow application startup
- Resource constraints
- Network issues

### Rollback failed

**Symptom**: Rollback command didn't work

**Procedure**:
1. Check current deployment
2. Manually deploy previous version
3. Verify services health
4. Document what went wrong

```bash
# Manual deployment of specific version
kubectl set image deployment/backend \
  backend=registry.example.com/backend:v1.2.2 \
  -n production

# Verify
kubectl rollout status deployment/backend -n production
```

## Further Reading

- [Kubernetes deployment documentation](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
- [Docker best practices](https://docs.docker.com/develop/dev-best-practices/)
- [Zero-downtime database migrations](https://wiki.postgresql.org/wiki/Compatibility,_Optimization,_and_Performance)
- Project docs: `docs/architecture.md`, `docs/ci-cd.md`
