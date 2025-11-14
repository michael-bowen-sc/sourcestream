# Form Validation Capability

## Requirements

### Requirement: Client-Side Validation

The system SHALL validate form inputs on the client before submission.

#### Scenario: Validate required fields

- **WHEN** user submits form with missing required fields
- **THEN** validation errors are displayed
- **AND** error messages indicate which fields are required
- **AND** form submission is prevented

#### Scenario: Validate field formats

- **WHEN** user enters invalid format in field
- **THEN** validation error is displayed
- **AND** error message explains expected format
- **AND** form submission is prevented

#### Scenario: Real-time validation feedback

- **WHEN** user enters data in form fields
- **THEN** validation runs on field change or blur
- **AND** errors are displayed immediately
- **AND** errors clear when field becomes valid

### Requirement: Project Request Validation

The system SHALL validate project request forms with specific business rules.

#### Scenario: Validate project request title

- **WHEN** user submits project request
- **THEN** title must be present and 3-100 characters
- **AND** validation error is shown if title is missing or invalid length

#### Scenario: Validate project name

- **WHEN** user submits project request
- **THEN** project name must be present and at least 2 characters
- **AND** validation error is shown if project name is missing or too short

#### Scenario: Validate project URL

- **WHEN** user submits project request
- **THEN** project URL must be valid GitHub URL
- **AND** validation error is shown if URL is invalid or not GitHub
- **AND** URL format is validated using URL validation utility

#### Scenario: Validate license selection

- **WHEN** user submits project request
- **THEN** license must be selected
- **AND** validation error is shown if license is missing

### Requirement: Access Request Validation

The system SHALL validate access request forms.

#### Scenario: Validate access request title

- **WHEN** user submits access request
- **THEN** title must be present and 3-100 characters
- **AND** validation error is shown if title is invalid

#### Scenario: Validate project name for access

- **WHEN** user submits access request
- **THEN** project name must be present and at least 2 characters
- **AND** validation error is shown if project name is missing

#### Scenario: Validate role selection

- **WHEN** user submits access request
- **THEN** role must be selected
- **AND** validation error is shown if role is missing

### Requirement: Pull Request Request Validation

The system SHALL validate pull request approval request forms.

#### Scenario: Validate PR request title

- **WHEN** user submits PR approval request
- **THEN** title must be present and 3-100 characters
- **AND** validation error is shown if title is invalid

#### Scenario: Validate pull request URL

- **WHEN** user submits PR approval request
- **THEN** PR URL must be valid GitHub pull request URL
- **AND** validation error is shown if URL is invalid or not GitHub PR URL
- **AND** URL format is validated using GitHub PR URL validation

#### Scenario: Validate repository URL for PR

- **WHEN** user submits PR approval request
- **THEN** repository URL must be present and valid
- **AND** validation error is shown if repository URL is missing or invalid

### Requirement: Permission Request Validation

The system SHALL validate contribution permission request forms.

#### Scenario: Validate permission request title

- **WHEN** user submits permission request
- **THEN** title must be present
- **AND** validation error is shown if title is missing

#### Scenario: Validate approved project selection

- **WHEN** user submits permission request
- **THEN** approved project must be selected from catalog
- **AND** validation error is shown if no project is selected
- **AND** error message: "Please select an approved project"

#### Scenario: Validate business justification

- **WHEN** user submits permission request
- **THEN** business justification must be provided
- **AND** validation error is shown if business justification is missing
- **AND** error message: "Business justification is required"

### Requirement: URL Validation Utilities

The system SHALL provide reusable URL validation functions.

#### Scenario: Validate general URL format

- **WHEN** URL validation utility is called
- **THEN** URL format is validated using URL constructor
- **AND** valid URLs return true, invalid URLs return false

#### Scenario: Validate GitHub URL

- **WHEN** GitHub URL validation is called
- **THEN** URL must match GitHub domain pattern
- **AND** validation checks for github.com domain
- **AND** non-GitHub URLs return false

#### Scenario: Validate GitHub pull request URL

- **WHEN** GitHub PR URL validation is called
- **THEN** URL must match GitHub pull request pattern
- **AND** validation checks for /pull/ path segment
- **AND** non-PR URLs return false

### Requirement: Server-Side Validation

The system SHALL validate inputs on the server in addition to client validation.

#### Scenario: Server-side input validation

- **WHEN** request is submitted to backend
- **THEN** server validates all required fields
- **AND** server validates data formats and business rules
- **AND** validation errors are returned if validation fails

#### Scenario: Parameterized query protection

- **WHEN** database queries are executed
- **THEN** all user inputs are parameterized
- **AND** SQL injection is prevented
- **AND** type safety is maintained

### Requirement: Validation Error Display

The system SHALL display validation errors clearly to users.

#### Scenario: Display field-level errors

- **WHEN** validation error occurs
- **THEN** error is displayed near the relevant field
- **AND** error message is clear and actionable
- **AND** error styling distinguishes from normal text

#### Scenario: Clear errors on correction

- **WHEN** user corrects invalid field
- **THEN** error message is removed
- **AND** field is marked as valid
- **AND** form can be submitted when all fields are valid
