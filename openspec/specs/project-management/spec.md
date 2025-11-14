# Project Management Capability

## Requirements

### Requirement: Project Creation

The system SHALL allow users to create new open source projects.

#### Scenario: Create new project

- **WHEN** user provides project details (name, description, URL, license, owner ID)
- **THEN** a new project record is created with unique ID
- **THEN** project status is set to "pending"
- **AND** project is assigned to owner
- **AND** created_at and updated_at timestamps are set
- **AND** project is returned with success message

#### Scenario: Create project with metadata

- **WHEN** user creates project with language, stars, forks, and visibility settings
- **THEN** all metadata fields are stored
- **AND** default values are applied (stars=0, forks=0, is_public=true)

### Requirement: Project Retrieval

The system SHALL allow retrieval of projects by various criteria.

#### Scenario: Get project by ID

- **WHEN** project ID is provided
- **THEN** project details are returned
- **AND** details include name, description, URL, license, status, owner, and metadata

#### Scenario: Get authored projects

- **WHEN** user ID is provided
- **THEN** all projects owned by that user are returned
- **AND** projects include full details and metadata

#### Scenario: Get contributed projects

- **WHEN** user ID is provided
- **THEN** all projects where user is a contributor are returned
- **AND** contributor role and permissions are included

#### Scenario: Get approved projects

- **WHEN** user ID is provided
- **THEN** all approved projects accessible to user are returned
- **AND** projects include approval status and contribution agreements

#### Scenario: Get non-existent project

- **WHEN** invalid project ID is provided
- **THEN** error is returned indicating project not found

### Requirement: Project Status Management

The system SHALL track project status through lifecycle states.

#### Scenario: Project initial status

- **WHEN** project is created
- **THEN** status is set to "pending"
- **AND** status can be updated to "active", "approved", or "archived"

#### Scenario: Project status values

- **WHEN** project status is set
- **THEN** valid statuses are: "pending", "active", "approved", "archived"
- **AND** status determines project visibility and accessibility

### Requirement: Project Ownership

The system SHALL maintain project ownership relationships.

#### Scenario: Project owner assignment

- **WHEN** project is created
- **THEN** owner_id must reference valid user
- **AND** foreign key constraint enforces referential integrity

#### Scenario: Project owner deletion

- **WHEN** project owner is deleted
- **THEN** project is cascaded deleted (CASCADE)
- **AND** related contributors are also removed

### Requirement: Project Contributors

The system SHALL support many-to-many relationships between users and projects.

#### Scenario: Add project contributor

- **WHEN** user is added as contributor to project
- **THEN** relationship is created in project_contributors table
- **AND** contributor role and permissions are stored
- **AND** joined_at timestamp is recorded

#### Scenario: Contributor uniqueness

- **WHEN** contributor is added to project
- **THEN** user-project combination must be unique
- **AND** database constraint prevents duplicates

#### Scenario: Contributor roles

- **WHEN** contributor is added
- **THEN** role can be: "owner", "maintainer", "contributor"
- **AND** default role is "contributor"

#### Scenario: Contributor permissions

- **WHEN** contributor is added
- **THEN** permissions array stores allowed actions
- **AND** permissions are stored as TEXT array in database

### Requirement: Project Metadata

The system SHALL store comprehensive project metadata.

#### Scenario: Project metadata fields

- **WHEN** project is retrieved
- **THEN** metadata includes: language, stars, forks, is_public flag
- **AND** all fields are available for display and filtering

#### Scenario: Project timestamps

- **WHEN** project is created or updated
- **THEN** created_at and updated_at timestamps are maintained
- **AND** updated_at is automatically updated on changes

### Requirement: Project URL Validation

The system SHALL validate project URLs.

#### Scenario: Project URL storage

- **WHEN** project is created with URL
- **THEN** URL is stored and validated
- **AND** URL length is limited to 500 characters

### Requirement: Approved Projects Catalog

The system SHALL maintain a catalog of pre-approved projects for contributions.

#### Scenario: Get approved projects list

- **WHEN** approved projects list is requested
- **THEN** catalog of pre-approved projects is returned
- **AND** projects include repository URL, license, contribution type, and allowed contribution types

#### Scenario: Filter active approved projects

- **WHEN** approved projects list is requested with active_only flag
- **THEN** only active approved projects are returned
- **AND** inactive projects are excluded
