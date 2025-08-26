# AI-User Pair Programming Documentation

This document outlines guidelines and best practices for effective pair programming between AI tools and human developers on the SourceStream project.

## Core Principles

1. **Clear Communication**: Provide context, expectations, and specific requirements when working with AI
2. **Iterative Development**: Break complex tasks into smaller, manageable chunks
3. **Knowledge Sharing**: Document successful patterns and challenges for team learning
4. **Quality Verification**: Always review and test AI-generated code
5. **Context Awareness**: Always check current branch and project state before starting work

## Interaction Patterns

### 0. Pre-Work Context Check

**ALWAYS start by checking current context:**

1. Run `git status` and `git branch` to understand current state
2. Check which files are modified or staged
3. Review recent commits with `git log --oneline -5`
4. Understand the current feature branch and target merge branch
5. Review any existing pull requests or work in progress

### 1. Feature Planning

When starting a new feature:

1. Describe the feature and its requirements to the AI
2. Ask AI to outline implementation steps and potential challenges
3. Review and refine the plan together
4. Break down into actionable tasks

### 2. Code Generation

For optimal code generation:

1. Provide clear context about the codebase
2. Specify architectural patterns to follow
3. Define expected inputs/outputs and error handling
4. Include examples of similar code when available

### 3. Code Review

AI can help review code by:

1. Identifying potential bugs or edge cases
2. Suggesting performance improvements
3. Checking for security vulnerabilities
4. Ensuring consistency with project standards

### 4. Documentation

Collaborate with AI to maintain:

1. Technical documentation
2. API specifications
3. Development logs
4. Knowledge base of solutions

## Tools and Integration

- **IDE Integration**: Use AI assistants directly in VS Code
- **Version Control**: Include AI in code reviews via PR comments
- **Documentation**: Maintain AI-specific documentation in `/docs/ai-patterns/`

## Git Workflow Best Practices

### Branch Management

- Always work on feature branches, never directly on `main`
- Use conventional branch naming: `feat/feature-name`, `fix/bug-name`, `docs/update-name`
- Check current branch before starting work: `git branch --show-current`
- Ensure you're on the correct branch for the task at hand

### Before Starting Work

```bash
# Essential context commands
git status                    # Check working directory state
git branch                    # See all branches and current branch
git log --oneline -5         # Review recent commits
git remote -v                # Verify remote repository
```

### Handling Dirty Working Directory

If `git status` shows uncommitted changes (dirty branch), suggest these actions in order:

#### 1. **Review Changes First**

```bash
git diff                     # See unstaged changes
git diff --staged            # See staged changes
git status --porcelain       # Clean status output
```

#### 2. **Determine Action Based on Changes**

**If changes are related to current task:**

- Continue working and include them in the solution
- Stage and commit them as part of the work: `git add . && git commit -m "description"`

**If changes are unrelated work-in-progress:**

- Stash changes: `git stash push -m "WIP: description"`
- Work on the new task
- Restore later: `git stash pop`

**If changes are experimental/throwaway:**

- Offer to discard: `git checkout -- .` (unstaged) or `git reset --hard HEAD` (all changes)
- **Always confirm with user before discarding**

**If changes are incomplete feature work:**

- Suggest creating a WIP commit: `git add . && git commit -m "WIP: partial implementation"`
- Continue with new task
- Return to WIP commit later for completion

#### 3. **Safety Guidelines**

- **Never automatically discard changes** without user confirmation
- **Always explain what each command will do** before suggesting it
- **Prefer stashing over discarding** for safety
- **Ask user to clarify intent** if changes are ambiguous

### Commit Guidelines

- Follow conventional commit format: `type(scope): description`
- Make atomic commits with single logical changes
- Write descriptive commit messages explaining the "why"
- Stage related changes together

## Learning and Improvement

- Document successful prompt patterns
- Track areas where AI assistance was most valuable
- Identify knowledge gaps where AI needs more context
- Regularly update AI guidelines as the project evolves
- **Always verify git context before proposing solutions**
