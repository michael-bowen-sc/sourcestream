# Production Environment Configuration

## Overview
Production environment serving real users. Strict controls and approval requirements.

## Access
- **Kubernetes Cluster**: sourcestream-production
- **Namespace**: sourcestream-production
- **URL**: https://sourcestream.example.com
- **Database**: sourcestream_production

## Deployment Rules
- **Manual approval required** from 2 reviewers minimum
- Code must be tagged with version (semantic versioning)
- All tests must pass
- Security scan must complete successfully
- Health checks must pass before marking complete
- Automated rollback on failure

## Required Secrets
- `KUBECONFIG_PRODUCTION`: Kubernetes config for production cluster
- `SLACK_WEBHOOK_URL`: Slack notifications
- `SNYK_TOKEN`: Container vulnerability scanning
- `PAGERDUTY_TOKEN`: Incident escalation
- `DATADOG_API_KEY`: APM and monitoring

## Reviewers (Required: 2)
- Release manager
- Engineering lead
- OSPO/Operations team

## Protection Rules
- Require status checks to pass before merge
- Require branches to be up to date
- Require code reviews (2 minimum)
- Dismiss stale pull request approvals
- Require conversation resolution before merge

## Concurrency
- Max 1 concurrent deployment
- Queue wait time: 5 minutes
- Timeout: 30 minutes

## Scaling
- Minimum replicas: 3 (high availability)
- Maximum replicas: 20 (handle peak load)
- Auto-scale on CPU 70%, Memory 75%

## Monitoring & Alerts
- Error rate < 0.1% (99.9% uptime)
- Response time p99 < 200ms
- Memory usage < 70%
- Database replication lag < 100ms
- Real-time Slack alerts for any errors

## Maintenance Windows
- Tuesday & Thursday 2-4 AM UTC (planned maintenance)
- No deployments during business hours (8 AM - 6 PM UTC)
- Emergency deployments: require incident lead approval

## Backup & Recovery
- Hourly database backups (retained 30 days)
- Point-in-time recovery capability
- RTO: 30 minutes
- RPO: 1 hour
- Regular disaster recovery drills (monthly)

## Compliance
- SSL/TLS for all connections
- Data encryption at rest (AES-256)
- Data encryption in transit (TLS 1.3)
- Regular security audits (quarterly)
- SOC 2 compliance maintained
- GDPR data retention policies enforced

## Incident Response
- 15 minute response SLA
- Escalate to on-call after 5 minutes
- PagerDuty incident tracking
- Post-incident review required
- Automated rollback available 24/7
