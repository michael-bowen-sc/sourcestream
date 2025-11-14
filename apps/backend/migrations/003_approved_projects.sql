-- Add approved_projects table for managing pre-approved open source projects
-- that employees can request permission to contribute to

-- Approved projects table
CREATE TABLE approved_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    repository_url VARCHAR(500) NOT NULL UNIQUE,
    license VARCHAR(50) NOT NULL,
    contribution_type VARCHAR(10) NOT NULL CHECK (contribution_type IN ('CLA', 'CCLA', 'DCO')),
    maintainer_contact VARCHAR(255),
    approval_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    allowed_contribution_types TEXT[] DEFAULT ARRAY['bug-fix', 'feature', 'documentation', 'testing', 'maintenance'],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add business_justification field to requests table for contribution permission requests
ALTER TABLE requests ADD COLUMN business_justification TEXT;
ALTER TABLE requests ADD COLUMN approved_project_id UUID REFERENCES approved_projects(id) ON DELETE SET NULL;

-- Indexes for performance
CREATE INDEX idx_approved_projects_is_active ON approved_projects(is_active);
CREATE INDEX idx_approved_projects_name ON approved_projects(name);
CREATE INDEX idx_approved_projects_repository_url ON approved_projects(repository_url);
CREATE INDEX idx_requests_approved_project_id ON requests(approved_project_id);

-- Apply update trigger to approved_projects
CREATE TRIGGER update_approved_projects_updated_at BEFORE UPDATE ON approved_projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample approved projects
INSERT INTO approved_projects (name, description, repository_url, license, contribution_type, maintainer_contact, allowed_contribution_types) VALUES
('React', 'A JavaScript library for building user interfaces', 'https://github.com/facebook/react', 'MIT', 'CLA', 'react-team@meta.com', ARRAY['bug-fix', 'feature', 'documentation', 'testing']),
('Vue.js', 'The Progressive JavaScript Framework', 'https://github.com/vuejs/vue', 'MIT', 'DCO', 'team@vuejs.org', ARRAY['bug-fix', 'feature', 'documentation', 'testing', 'maintenance']),
('Angular', 'Deliver web apps with confidence', 'https://github.com/angular/angular', 'MIT', 'CLA', 'angular-team@google.com', ARRAY['bug-fix', 'feature', 'documentation', 'testing']),
('Node.js', 'Node.js JavaScript runtime', 'https://github.com/nodejs/node', 'MIT', 'DCO', 'nodejs-team@nodejs.org', ARRAY['bug-fix', 'feature', 'documentation', 'testing', 'maintenance']),
('TypeScript', 'TypeScript is a superset of JavaScript', 'https://github.com/microsoft/TypeScript', 'Apache-2.0', 'CLA', 'typescript@microsoft.com', ARRAY['bug-fix', 'feature', 'documentation', 'testing']),
('Kubernetes', 'Production-Grade Container Scheduling and Management', 'https://github.com/kubernetes/kubernetes', 'Apache-2.0', 'CLA', 'kubernetes-dev@googlegroups.com', ARRAY['bug-fix', 'feature', 'documentation', 'testing', 'maintenance']),
('Docker', 'Docker container platform', 'https://github.com/docker/docker-ce', 'Apache-2.0', 'DCO', 'docker-maintainers@docker.com', ARRAY['bug-fix', 'feature', 'documentation', 'testing']),
('Webpack', 'A bundler for javascript and friends', 'https://github.com/webpack/webpack', 'MIT', 'DCO', 'webpack-team@webpack.js.org', ARRAY['bug-fix', 'feature', 'documentation', 'testing', 'maintenance']);
