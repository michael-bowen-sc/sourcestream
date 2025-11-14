# User Management Capability

## Requirements

### Requirement: User Registration

The system SHALL allow registration of new contributors with corporate and GitHub identity.

#### Scenario: Register new contributor

- **WHEN** user provides corporate ID and GitHub username
- **THEN** a new user record is created with unique ID
- **AND** user is assigned default role "contributor"
- **AND** user is marked as active
- **AND** created_at and updated_at timestamps are set
- **AND** success message is returned

#### Scenario: Register with duplicate corporate ID

- **WHEN** user attempts to register with existing corporate ID
- **THEN** registration fails
- **AND** error message indicates duplicate corporate ID

#### Scenario: Register with duplicate GitHub username

- **WHEN** user attempts to register with existing GitHub username
- **THEN** registration fails
- **AND** error message indicates duplicate GitHub username

### Requirement: User Profile Retrieval

The system SHALL allow retrieval of user profiles by ID or corporate ID.

#### Scenario: Get user by ID

- **WHEN** user ID is provided
- **THEN** user profile is returned with all fields
- **AND** profile includes corporate ID, GitHub username, email, full name, department, role, and status

#### Scenario: Get user by corporate ID

- **WHEN** corporate ID is provided
- **THEN** user profile is returned
- **AND** profile includes all user information

#### Scenario: Get non-existent user

- **WHEN** invalid user ID is provided
- **THEN** error is returned indicating user not found

### Requirement: User Identity Management

The system SHALL maintain unique identities for corporate and GitHub accounts.

#### Scenario: Corporate ID uniqueness

- **WHEN** user is created
- **THEN** corporate_id must be unique across all users
- **AND** database constraint enforces uniqueness

#### Scenario: GitHub username uniqueness

- **WHEN** user is created
- **THEN** github_username must be unique across all users
- **AND** database constraint enforces uniqueness

#### Scenario: Email uniqueness

- **WHEN** user is created
- **THEN** email must be unique across all users
- **AND** database constraint enforces uniqueness

### Requirement: User Roles

The system SHALL support role-based access control with predefined roles.

#### Scenario: Default user role

- **WHEN** user is registered without specifying role
- **THEN** role is set to "contributor"
- **AND** user has standard contributor permissions

#### Scenario: User role types

- **WHEN** system assigns roles
- **THEN** valid roles are: "user", "contributor", "ospo_admin", "admin"
- **AND** role determines access level and permissions

### Requirement: User Status Management

The system SHALL track user active status for account management.

#### Scenario: User active by default

- **WHEN** user is registered
- **THEN** is_active is set to true
- **AND** user can access system features

#### Scenario: Deactivate user

- **WHEN** user account is deactivated
- **THEN** is_active is set to false
- **AND** user access is restricted

### Requirement: User Profile Fields

The system SHALL store comprehensive user profile information.

#### Scenario: User profile structure

- **WHEN** user profile is retrieved
- **THEN** profile includes: ID, corporate ID, GitHub username, email, full name, department, role, active status, and timestamps
- **AND** all required fields are present

#### Scenario: User profile timestamps

- **WHEN** user is created or updated
- **THEN** created_at and updated_at timestamps are maintained
- **AND** updated_at is automatically updated on changes
