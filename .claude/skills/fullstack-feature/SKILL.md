---
name: fullstack-feature
description: Plan and implement a complete full-stack feature across frontend, API, database and tests. Use for new features, CRUD workflows, integrations and end-to-end product tasks.
---

# Full-stack feature delivery

1. Inspect the codebase, architecture, scripts, dependencies, conventions and current git diff.
2. Restate the feature as user-visible behavior. Identify roles, permissions, data, edge cases and acceptance criteria.
3. Map the vertical slice: UI/screen → client state/data layer → API contract → server use case → persistence → tests.
4. Present a short plan for non-trivial work. Identify uncertainties; ask only blocking questions.
5. Implement using existing conventions. Avoid unrelated refactors and unnecessary dependencies.
6. Validate input at every trust boundary. Enforce authorization on the server.
7. Add loading, empty, error, success and retry states where relevant.
8. Add/update unit, integration and end-to-end tests at the appropriate layers.
9. Run tests, lint, typecheck and build commands discovered in the repository. Never invent results.
10. Review the diff for regressions, secrets, debug code, accessibility, migrations and documentation.
11. Report files changed, behavior delivered, checks and outcomes, required environment variables and remaining risks.

Do not claim a feature is complete if any essential layer is stubbed, mocked without disclosure, or unverified.
