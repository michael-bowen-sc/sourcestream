# Gemini Project Guidelines

This document provides guidelines for the Gemini AI to follow when working on this project.

## Project Overview

* **Purpose:** [Briefly describe the purpose of this project.]
* **Tech Stack:** [List the main technologies, frameworks, and libraries used.]

## Linting

*   **Markdown:** Markdown files are automatically linted and fixed using `markdownlint` with a `pre-commit` hook managed by `husky`. I should still manually run `npx markdownlint --fix .` after making changes to markdown files to ensure they are clean.

## Branching Strategy

*   **Format:** Branch names must follow the conventional commit format, for example: `feat/new-feature`, `fix/bug-fix`, `docs/update-readme`.
*   **Validation:** A `pre-push` hook is in place to enforce this format.

## Commits

* **Message Format:** This project uses the [Conventional Commits](https://www.conventionalcommits.org/) specification. A `commit-msg` hook is in place to enforce this format.
* **DEVLOG.md:** All commits should include an update to the `DEVLOG.md` file to track progress, challenges, and solutions.
