# AI Collaboration Capability

## Requirements

### Requirement: AI Assistant Integration

The project SHALL maintain documentation and patterns for effective AI-human collaboration.

#### Scenario: AI agent follows git workflow

- **WHEN** AI agent starts work
- **THEN** it checks git status and branch
- **AND** it handles dirty working directory appropriately
- **AND** it verifies correct branch before proceeding

#### Scenario: AI agent creates specs

- **WHEN** AI agent creates capability specs
- **THEN** it follows OpenSpec format requirements
- **AND** it validates with `openspec validate --strict`
- **AND** it checks for existing capabilities before creating new ones

#### Scenario: AI agent implements changes

- **WHEN** AI agent implements changes
- **THEN** it follows tasks.md checklist sequentially
- **AND** it references architecture decisions from design.md
- **AND** it adheres to project conventions from project.md

### Requirement: Pre-Work Context Checking

The system SHALL require AI agents to check project context before starting work.

#### Scenario: Check git status

- **WHEN** AI agent begins task
- **THEN** it runs `git status` to check working directory
- **AND** it identifies modified, staged, and untracked files
- **AND** it determines appropriate action based on file state

#### Scenario: Verify branch

- **WHEN** AI agent begins task
- **THEN** it checks current branch with `git branch --show-current`
- **AND** it ensures not working directly on `main` branch
- **AND** it uses conventional branch naming (feat/, fix/, docs/, refactor/)

#### Scenario: Review recent commits

- **WHEN** AI agent begins task
- **THEN** it reviews recent commits with `git log --oneline -5`
- **AND** it understands current project state
- **AND** it identifies related work in progress

### Requirement: Dirty Working Directory Handling

The system SHALL provide protocols for handling uncommitted changes.

#### Scenario: Handle related changes

- **WHEN** uncommitted changes are related to current task
- **THEN** AI agent continues working and includes them
- **AND** changes are staged and committed as part of solution

#### Scenario: Handle unrelated WIP

- **WHEN** uncommitted changes are unrelated work-in-progress
- **THEN** AI agent suggests stashing with descriptive message
- **AND** changes can be restored later with `git stash pop`

#### Scenario: Handle experimental changes

- **WHEN** uncommitted changes are experimental or throwaway
- **THEN** AI agent offers to discard changes
- **AND** user confirmation is required before discarding
- **AND** AI agent never automatically discards without confirmation

### Requirement: AI Collaboration Documentation

The project SHALL maintain comprehensive documentation for AI collaboration patterns.

#### Scenario: AI pairing guidelines

- **WHEN** AI agent needs collaboration guidance
- **THEN** it references `docs/AI-PAIRING.md` for core principles
- **AND** guidelines include git workflow, branch management, and commit conventions

#### Scenario: AI pattern examples

- **WHEN** AI agent needs prompt examples
- **THEN** it references `docs/ai-patterns/prompts/examples.md`
- **AND** examples cover code generation, review, and architecture design

#### Scenario: AI collaboration templates

- **WHEN** documenting AI interactions
- **THEN** templates from `docs/ai-patterns/devlog-template.md` are used
- **AND** entries follow consistent format with date, author, and structured sections

### Requirement: OpenSpec Integration

The system SHALL integrate AI collaboration patterns with OpenSpec workflow.

#### Scenario: AI agent creates change proposals

- **WHEN** AI agent creates OpenSpec change proposals
- **THEN** it follows AI collaboration pre-work checklist
- **AND** it uses incremental development patterns
- **AND** it documents decisions in design.md when needed

#### Scenario: AI agent implements from specs

- **WHEN** AI agent implements changes from specs
- **THEN** it follows tasks.md sequentially
- **AND** it references architecture decisions
- **AND** it verifies implementation matches spec scenarios

#### Scenario: AI agent validates specs

- **WHEN** AI agent creates or modifies specs
- **THEN** it runs `openspec validate --strict`
- **AND** it fixes validation errors before proceeding
- **AND** it ensures all requirements have scenarios

### Requirement: Knowledge Sharing

The system SHALL document successful AI collaboration patterns for team learning.

#### Scenario: Document successful patterns

- **WHEN** AI collaboration succeeds
- **THEN** patterns are documented in `docs/ai-patterns/`
- **AND** examples are added to prompt templates
- **AND** insights are shared in DEVLOG.md entries

#### Scenario: Document challenges

- **WHEN** AI collaboration encounters challenges
- **THEN** challenges are documented with solutions
- **AND** patterns are updated to prevent recurrence
- **AND** team knowledge base is enhanced

### Requirement: Quality Verification

The system SHALL require verification of AI-generated work.

#### Scenario: Code review

- **WHEN** AI agent generates code
- **THEN** code is reviewed for bugs, performance, and alignment
- **AND** code follows project conventions
- **AND** tests are included for new functionality

#### Scenario: Spec validation

- **WHEN** AI agent creates specs
- **THEN** specs are validated with OpenSpec tools
- **AND** scenarios are tested for completeness
- **AND** requirements follow SHALL/MUST format
