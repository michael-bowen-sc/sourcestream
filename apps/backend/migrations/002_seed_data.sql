-- Seed data for development and testing
-- Insert sample users, projects, and requests

-- Insert sample users
INSERT INTO users (id, corporate_id, github_username, email, full_name, department, role) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'CORP001', 'johndoe', 'john.doe@company.com', 'John Doe', 'Engineering', 'maintainer'),
('550e8400-e29b-41d4-a716-446655440002', 'CORP002', 'janesmith', 'jane.smith@company.com', 'Jane Smith', 'Product', 'contributor'),
('550e8400-e29b-41d4-a716-446655440003', 'CORP003', 'bobwilson', 'bob.wilson@company.com', 'Bob Wilson', 'Engineering', 'contributor'),
('550e8400-e29b-41d4-a716-446655440004', 'CORP004', 'alicejohnson', 'alice.johnson@company.com', 'Alice Johnson', 'Design', 'contributor'),
('550e8400-e29b-41d4-a716-446655440005', 'CORP005', 'mikebrown', 'mike.brown@company.com', 'Mike Brown', 'Engineering', 'maintainer');

-- Insert sample projects
INSERT INTO projects (id, name, description, url, license, owner_id, language, stars, forks) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'React Component Library', 'A comprehensive React component library for internal use', 'https://github.com/company/react-components', 'MIT', '550e8400-e29b-41d4-a716-446655440001', 'TypeScript', 245, 32),
('660e8400-e29b-41d4-a716-446655440002', 'API Gateway Service', 'Microservices API gateway with authentication and rate limiting', 'https://github.com/company/api-gateway', 'Apache-2.0', '550e8400-e29b-41d4-a716-446655440005', 'Go', 189, 28),
('660e8400-e29b-41d4-a716-446655440003', 'ML Training Pipeline', 'Machine learning model training and deployment pipeline', 'https://github.com/company/ml-pipeline', 'MIT', '550e8400-e29b-41d4-a716-446655440001', 'Python', 156, 19),
('660e8400-e29b-41d4-a716-446655440004', 'Design System', 'Company-wide design system and style guide', 'https://github.com/company/design-system', 'MIT', '550e8400-e29b-41d4-a716-446655440004', 'CSS', 98, 15),
('660e8400-e29b-41d4-a716-446655440005', 'Monitoring Dashboard', 'Real-time monitoring and alerting dashboard', 'https://github.com/company/monitoring', 'Apache-2.0', '550e8400-e29b-41d4-a716-446655440005', 'JavaScript', 134, 22);

-- Insert project contributors
INSERT INTO project_contributors (project_id, user_id, role, permissions) VALUES
-- React Component Library contributors
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'owner', ARRAY['admin', 'write', 'read']),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'contributor', ARRAY['write', 'read']),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'contributor', ARRAY['read']),

-- API Gateway contributors
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005', 'owner', ARRAY['admin', 'write', 'read']),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'maintainer', ARRAY['write', 'read']),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 'contributor', ARRAY['read']),

-- ML Pipeline contributors
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'owner', ARRAY['admin', 'write', 'read']),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'contributor', ARRAY['write', 'read']),

-- Design System contributors
('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'owner', ARRAY['admin', 'write', 'read']),
('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'contributor', ARRAY['write', 'read']),

-- Monitoring Dashboard contributors
('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 'owner', ARRAY['admin', 'write', 'read']),
('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 'maintainer', ARRAY['write', 'read']),
('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440003', 'contributor', ARRAY['read']);

-- Insert sample requests
INSERT INTO requests (id, type, title, description, status, requester_id, project_name, project_url, license, requested_role) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'project', 'New React Library', 'Request to create a new React component library for shared UI components', 'pending', '550e8400-e29b-41d4-a716-446655440002', 'React UI Kit', 'https://github.com/company/react-ui-kit', 'MIT', NULL),
('770e8400-e29b-41d4-a716-446655440002', 'pullrequest', 'Contribute to ML Framework', 'Request approval to contribute bug fixes to the ML training pipeline', 'approved', '550e8400-e29b-41d4-a716-446655440003', 'ML Training Pipeline', 'https://github.com/company/ml-pipeline/pull/123', NULL, NULL),
('770e8400-e29b-41d4-a716-446655440003', 'access', 'Access to Monitoring Dashboard', 'Request contributor access to the monitoring project for debugging production issues', 'pending', '550e8400-e29b-41d4-a716-446655440002', 'Monitoring Dashboard', NULL, NULL, 'contributor'),
('770e8400-e29b-41d4-a716-446655440004', 'project', 'Documentation Site', 'Request to create a documentation site for all internal projects', 'in_review', '550e8400-e29b-41d4-a716-446655440004', 'Docs Site', 'https://github.com/company/docs-site', 'MIT', NULL),
('770e8400-e29b-41d4-a716-446655440005', 'access', 'Design System Access', 'Request maintainer access to the design system for updating components', 'approved', '550e8400-e29b-41d4-a716-446655440003', 'Design System', NULL, NULL, 'maintainer');

-- Insert sample request comments
INSERT INTO request_comments (request_id, user_id, comment, is_internal) VALUES
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Approved - the bug fixes look good and follow our coding standards.', false),
('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005', 'This looks like a great initiative. Can you provide more details on the tech stack?', false),
('770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440004', 'Approved - Bob has shown good understanding of our design principles.', false);
