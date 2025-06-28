# SourceStream Development Log

This document is a collaborative development journal maintained with AI assistance to track progress, challenges, solutions, and insights throughout the SourceStream project lifecycle.

---

**Date:** 2025-06-27
**Author:** Gemini

**Entry:**

*   **Feature:** Initial project setup.
*   **Progress:**
    *   Created `GEMINI.md` to provide project guidelines for the AI assistant.
    *   Created a `.gitignore` file for Go and TypeScript projects.
    *   Added `markdownlint-cli` with a basic configuration file.
    *   Created this `DEVLOG.md` file to track project progress.
*   **Challenges:**
    *   The initial attempt to create the `.gitignore` file using `gitignore-cli` and `gibo` failed. I had to fetch the content from GitHub directly.
*   **Solutions:**
    *   Used `web_fetch` to get the `.gitignore` content from the official GitHub repository.
*   **Insights:**
    *   Directly fetching files from reliable sources can be a more robust approach than relying on command-line tools that may not be installed or configured correctly.

---

**Date:** 2025-06-27
**Author:** Gemini

**Entry:**

*   **Feature:** Conventional Commits and Branching Strategy
*   **Progress:**
    *   Configured the project to use Conventional Commits with `commitizen` and `commitlint`.
    *   Added a `pre-commit` hook to lint markdown files.
    *   Added a `pre-push` hook to validate branch names.
    *   Created a `PULL_REQUEST_TEMPLATE.md`.
*   **Challenges:** None
*   **Solutions:** None
*   **Insights:** None

---

**Date:** 2025-06-27
**Author:** Gemini

**Entry:**

*   **Feature:** Branch Management Enhancements
*   **Progress:**
    *   Modified `pre-push` hook to prevent direct pushes to `main` branch.
    *   Added `.markdownlintignore` to exclude `node_modules` from linting.
    *   Updated `husky` hook scripts to remove deprecated lines.
*   **Challenges:**
    *   Initial `markdownlint` run linted `node_modules`.
    *   `husky` deprecation warnings.
*   **Solutions:**
    *   Added `.markdownlintignore`.
    *   Updated `husky` scripts.
*   **Insights:**
    *   It's important to configure linters to ignore irrelevant directories to avoid unnecessary warnings and improve performance.
    *   Keeping `husky` hooks up-to-date is crucial for maintaining a healthy development workflow.

---

**Date:** 2025-06-27
**Author:** Gemini

**Entry:**

*   **Feature:** Pull Request Template Fix
*   **Progress:**
    *   Modified `PULL_REQUEST_TEMPLATE.md` to use HTML checkboxes for better rendering in GitHub.
*   **Challenges:**
    *   Markdown checkboxes in PR template were not rendering correctly.
*   **Solutions:**
    *   Switched to HTML checkboxes in the template.
*   **Insights:**
    *   HTML elements can provide more consistent rendering in markdown across different platforms.

---

**Date:** 2025-06-27
**Author:** Gemini

**Entry:**

*   **Chore:** Add lint:md script
*   **Progress:**
    *   Added `lint:md` script to `package.json` to run `markdownlint`.
*   **Challenges:** None
*   **Solutions:** None
*   **Insights:** None

---

**Date:** 2025-06-27
**Author:** Gemini

**Entry:**

*   **Feature:** Monorepo Setup with Tilt and Kubernetes Integration
*   **Progress:**
    *   Initialized monorepo with `apps/` directory.
    *   Scaffolded Go backend with gRPC, gRPC-Gateway, and OpenAPI generation.
    *   Added Go unit and integration tests.
    *   Created Dockerfile for Go backend.
    *   Created Kubernetes manifests for Go backend.
    *   Scaffolded React frontend with Tailwind CSS, Ant Design, and gRPC-Web.
    *   Generated TypeScript gRPC-web client code.
    *   Created basic React component for frontend-backend interaction.
    *   Created Dockerfile for React frontend.
    *   Created Kubernetes manifests for React frontend.
    *   Created `Tiltfile` for local Kubernetes development.
*   **Challenges:**
    *   Installing `protoc` and its plugins.
    *   Correctly configuring `grpc-gateway` and `openapi-v2` generation.
    *   Ensuring correct paths for generated files.
    *   Setting up `tailwind.config.js` and `postcss.config.js` manually.
    *   Fixing `package.json` syntax errors due to escaping issues.
*   **Solutions:**
    *   Installed `protobuf` via `brew`.
    *   Used `go install` from within the `apps/backend` directory for Go plugins.
    *   Manually created `tailwind.config.js` and `postcss.config.js`.
    *   Carefully reviewed and corrected `package.json` escaping.
*   **Insights:**
    *   Setting up a monorepo with multiple languages and tools requires careful attention to detail and incremental testing.
    *   `protoc` and its plugins can be finicky with paths and flags.
    *   Manual configuration is sometimes necessary when automated tools fail.

---

**Date:** 2025-06-27
**Author:** Gemini

**Entry:**

*   **Fix:** Frontend Protobuf Import Paths
*   **Progress:**
    *   Corrected import paths for generated protobuf files in `apps/frontend/src/App.tsx`.
    *   Updated client instantiation to use `UserServiceClient`.
*   **Challenges:**
    *   Incorrect import paths for generated protobuf files.
*   **Solutions:**
    *   Updated import statements to match actual generated file names.
*   **Insights:**
    *   Always verify generated file names and adjust import paths accordingly.
