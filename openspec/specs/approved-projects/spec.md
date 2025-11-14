# Approved Projects Capability

## Requirements

### Requirement: Approved Projects Catalog

The system SHALL maintain a catalog of pre-approved open source projects for employee contributions.

#### Scenario: Get approved projects list

- **WHEN** approved projects list is requested
- **THEN** catalog of pre-approved projects is returned
- **AND** projects include name, description, repository URL, license, and contribution type
- **AND** projects include allowed contribution types and maintainer contact

#### Scenario: Filter active approved projects

- **WHEN** approved projects list is requested with active_only flag
- **THEN** only active approved projects are returned
- **AND** inactive projects are excluded from results

#### Scenario: Approved project details

- **WHEN** approved project is retrieved
- **THEN** details include: ID, name, description, repository URL, license, contribution type, maintainer contact, approval date, active status, and allowed contribution types

### Requirement: Approved Project Contribution Types

The system SHALL support different contribution agreement types.

#### Scenario: Contribution type values

- **WHEN** approved project is created
- **THEN** contribution_type must be one of: "CLA", "CCLA", "DCO"
- **AND** database constraint enforces valid values

#### Scenario: Allowed contribution types

- **WHEN** approved project is created
- **THEN** allowed_contribution_types array specifies permitted contribution types
- **AND** valid types include: "bug-fix", "feature", "documentation", "testing", "maintenance"
- **AND** array is stored as TEXT[] in database

### Requirement: Approved Project Selection

The system SHALL allow users to select approved projects for contribution permission requests.

#### Scenario: Select approved project for permission request

- **WHEN** user submits contribution permission request
- **THEN** user must select from approved projects catalog
- **AND** selected project ID is stored with request
- **AND** project details are displayed to user

#### Scenario: Display approved project details

- **WHEN** user selects approved project
- **THEN** project details are displayed including repository URL, license, contribution type, and allowed contributions
- **AND** user can review project information before submitting request

### Requirement: Approved Project Status Management

The system SHALL track active status for approved projects.

#### Scenario: Approved project active by default

- **WHEN** approved project is created
- **THEN** is_active is set to true
- **AND** project is available for selection in permission requests

#### Scenario: Deactivate approved project

- **WHEN** approved project is deactivated
- **THEN** is_active is set to false
- **AND** project is excluded from active project lists
- **AND** existing requests referencing project remain valid

### Requirement: Approved Project Uniqueness

The system SHALL ensure repository URLs are unique across approved projects.

#### Scenario: Repository URL uniqueness

- **WHEN** approved project is created
- **THEN** repository_url must be unique across all approved projects
- **AND** database constraint enforces uniqueness

#### Scenario: Prevent duplicate repository URLs

- **WHEN** user attempts to create approved project with existing repository URL
- **THEN** creation fails
- **AND** error message indicates duplicate repository URL

### Requirement: Approved Project Timestamps

The system SHALL maintain timestamps for approved projects.

#### Scenario: Approved project timestamps

- **WHEN** approved project is created or updated
- **THEN** created_at, updated_at, and approval_date timestamps are maintained
- **AND** updated_at is automatically updated on changes via database trigger

### Requirement: Approved Project Indexing

The system SHALL maintain indexes for performance.

#### Scenario: Performance indexes

- **WHEN** approved projects are queried
- **THEN** indexes exist on is_active, name, and repository_url columns
- **AND** queries are optimized for common access patterns
