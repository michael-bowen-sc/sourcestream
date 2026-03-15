# Staging Environment Configuration

## Overview
The staging environment is a pre-production environment that mirrors production configuration for testing.

## Access
- **Kubernetes Cluster**: sourcestream-staging
- **Namespace**: sourcestream-staging
- **URL**: https://staging.sourcestream.example.com
- **Database**: sourcestream_staging

## Deployment Rules
- Auto-deployment from main branch
- No approval required
- Health checks must pass before marking complete
- Logs retained for 7 days

## Required Secrets
- `KUBECONFIG_STAGING`: Kubernetes config for staging cluster
- `SLACK_WEBHOOK_URL`: Slack notifications
- `SNYK_TOKEN`: Container vulnerability scanning

## Reviewers
- Team leads
- On-call engineers

## Concurrency
- Production-like scaling (2-8 pods)
- Full database with test data
- Real external service calls

## Monitoring
- Error rate < 1%
- Response time p99 < 500ms
- Memory usage < 80%

## Maintenance
- Daily database backups
- Weekly dependency updates
- Monthly security audits
