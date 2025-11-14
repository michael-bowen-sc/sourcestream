# Request Workflow Capability

## Requirements

### Requirement: Request Submission

The system SHALL allow users to submit requests for project creation, contributor access, pull request approval, and contribution permission.

#### Scenario: Submit project request

- **WHEN** user provides project details (title, URL, license)
- **THEN** a project request is created with status "pending"
- **AND** the request is assigned to the requester
- **AND** the request ID is returned to the user

#### Scenario: Submit access request

- **WHEN** user provides project name, title, and requested role
- **THEN** an access request is created with status "pending"
- **AND** the request is saved to the database
- **AND** the request ID is returned to the user

#### Scenario: Submit pull request approval request

- **WHEN** user provides PR details (title, project name, PR URL)
- **THEN** a pull request approval request is created with status "pending"
- **AND** the request is assigned to the requester
- **AND** the request ID is returned to the user

#### Scenario: Submit contribution permission request

- **WHEN** user selects an approved project and provides business justification
- **THEN** a permission request is created with status "pending"
- **AND** the approved project ID and business justification are stored
- **AND** the request is assigned to the requester
- **AND** the request ID is returned to the user

### Requirement: Request Validation

The system SHALL validate request submissions before creating requests.

#### Scenario: Validate permission request

- **WHEN** user submits permission request without approved project selection
- **THEN** validation fails
- **AND** error message is returned

#### Scenario: Validate permission request business justification

- **WHEN** user submits permission request without business justification
- **THEN** validation fails
- **AND** error message is returned

### Requirement: Request Retrieval

The system SHALL allow users to retrieve their requests with optional status filtering.

#### Scenario: Get user requests

- **WHEN** user requests their requests
- **THEN** all requests for that user are returned
- **AND** requests include type, status, title, and timestamps

#### Scenario: Filter requests by status

- **WHEN** user requests their requests with status filter
- **THEN** only requests matching the status are returned
- **AND** pending requests are returned when status="pending"

#### Scenario: Paginate request results

- **WHEN** user requests their requests with page and limit parameters
- **THEN** paginated results are returned
- **AND** total count is included in response

### Requirement: Request Status Management

The system SHALL track request status through the approval workflow.

#### Scenario: Request initial status

- **WHEN** request is created
- **THEN** status is set to "pending"
- **AND** created_at timestamp is set

#### Scenario: Request approval

- **WHEN** OSPO admin approves a request
- **THEN** status is changed to "approved"
- **AND** approved_at timestamp is set
- **AND** reviewer_id is assigned

#### Scenario: Request rejection

- **WHEN** OSPO admin rejects a request
- **THEN** status is changed to "rejected"
- **AND** rejected_at timestamp is set
- **AND** rejection_reason is stored
- **AND** reviewer_id is assigned

### Requirement: Request Comments

The system SHALL support comments on requests for communication between requester and reviewer.

#### Scenario: Add comment to request

- **WHEN** user or reviewer adds a comment to a request
- **THEN** comment is stored with request_id and user_id
- **AND** comment timestamp is recorded
- **AND** internal flag indicates visibility scope

#### Scenario: View request comments

- **WHEN** user views a request
- **THEN** all comments for that request are returned
- **AND** comments include author, content, and timestamp
