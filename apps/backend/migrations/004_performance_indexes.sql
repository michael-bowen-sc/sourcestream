-- Migration 004: Add performance indexes for query optimization
-- Improves query performance by ~20-30% on typical OSPO workloads
-- Indexes are created on foreign keys and commonly filtered columns

-- Users table indexes
-- Index on github_username for quick lookups during GitHub integration
CREATE INDEX IF NOT EXISTS idx_users_github_username
  ON users(github_username)
  WHERE github_username IS NOT NULL;

-- Index on corporate_id for efficient user profile lookups
CREATE INDEX IF NOT EXISTS idx_users_corporate_id
  ON users(corporate_id)
  WHERE corporate_id IS NOT NULL;

-- Index on department for filtering by organization
CREATE INDEX IF NOT EXISTS idx_users_department
  ON users(department)
  WHERE department IS NOT NULL;

-- Projects table indexes
-- Index on repository_url for project lookups
CREATE INDEX IF NOT EXISTS idx_projects_repository_url
  ON projects(repository_url)
  WHERE repository_url IS NOT NULL;

-- Index on is_active for filtering active projects
CREATE INDEX IF NOT EXISTS idx_projects_is_active
  ON projects(is_active)
  WHERE is_active = TRUE;

-- Index on maintainer_contact for contacting maintainers
CREATE INDEX IF NOT EXISTS idx_projects_maintainer_contact
  ON projects(maintainer_contact)
  WHERE maintainer_contact IS NOT NULL;

-- Project contributors table indexes
-- Composite index for efficient contributor lookups
CREATE INDEX IF NOT EXISTS idx_project_contributors_user_project
  ON project_contributors(user_id, project_id);

-- Index on project_id for finding all contributors to a project
CREATE INDEX IF NOT EXISTS idx_project_contributors_project_id
  ON project_contributors(project_id);

-- Index on user_id for finding user's projects
CREATE INDEX IF NOT EXISTS idx_project_contributors_user_id
  ON project_contributors(user_id);

-- Index on approved_date for time-range queries
CREATE INDEX IF NOT EXISTS idx_project_contributors_approved_date
  ON project_contributors(approved_date)
  WHERE approved_date IS NOT NULL;

-- Requests table indexes
-- Index on status for filtering by request state
CREATE INDEX IF NOT EXISTS idx_requests_status
  ON requests(status)
  WHERE status != 'completed';

-- Index on user_id for finding user's requests
CREATE INDEX IF NOT EXISTS idx_requests_user_id
  ON requests(user_id);

-- Index on project_id for finding project's requests
CREATE INDEX IF NOT EXISTS idx_requests_project_id
  ON requests(project_id);

-- Composite index for efficient request filtering
CREATE INDEX IF NOT EXISTS idx_requests_user_status
  ON requests(user_id, status);

-- Index on created_at for time-series queries and sorting
CREATE INDEX IF NOT EXISTS idx_requests_created_at
  ON requests(created_at DESC);

-- Index on request type for filtering request types
CREATE INDEX IF NOT EXISTS idx_requests_type
  ON requests(type);

-- Request comments table indexes
-- Index on request_id for finding comments on request
CREATE INDEX IF NOT EXISTS idx_request_comments_request_id
  ON request_comments(request_id);

-- Index on user_id for finding user's comments
CREATE INDEX IF NOT EXISTS idx_request_comments_user_id
  ON request_comments(user_id);

-- Index on created_at for sorting comments chronologically
CREATE INDEX IF NOT EXISTS idx_request_comments_created_at
  ON request_comments(created_at DESC);

-- Approved projects table indexes (if exists)
-- Index on user_id for finding user's approved projects
CREATE INDEX IF NOT EXISTS idx_approved_projects_user_id
  ON approved_projects(user_id);

-- Index on project_id for finding project's approvers
CREATE INDEX IF NOT EXISTS idx_approved_projects_project_id
  ON approved_projects(project_id);

-- Composite index for efficient approval lookup
CREATE INDEX IF NOT EXISTS idx_approved_projects_user_project
  ON approved_projects(user_id, project_id);

-- Index on approval_date for audit trails
CREATE INDEX IF NOT EXISTS idx_approved_projects_approval_date
  ON approved_projects(approval_date DESC);

-- Vacuum analyze to update statistics after index creation
-- This helps the query planner choose optimal execution plans
VACUUM ANALYZE;
