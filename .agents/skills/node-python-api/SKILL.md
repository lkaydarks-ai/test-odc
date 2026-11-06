---
name: node-python-api
description: Implement or improve Node.js and Python backend services, REST APIs, authentication, validation, database access, integrations and tests.
---

# Node.js and Python backend engineering

- Detect runtime, framework, package manager, ORM, database and project conventions first.
- Keep route/controller handlers thin; put business rules in application/domain services.
- Validate params, query, headers and bodies with the project's schema approach.
- Enforce authentication and authorization on every protected operation, including object-level access.
- Use parameterized SQL or safe ORM methods. Add migrations for schema changes.
- Define consistent HTTP status codes and safe error responses; log useful context without secrets or personal data.
- Add pagination, filtering, sorting, rate limits, timeouts and idempotency when required.
- Handle async failures, retries and external API errors deliberately.
- Store secrets in environment variables or a secret manager; update `.env.example` with placeholders only.
- Add unit and integration tests, including unauthorized, invalid-input, not-found and conflict cases.
- For Python, follow existing tooling (uv/Poetry/pip, pytest, Ruff, mypy/pyright where configured).
- For Node.js, follow existing tooling (npm/pnpm/yarn, ESLint, Prettier, Vitest/Jest).
- Document API contracts and local setup. Run tests, lint, type checks and build/start validation.
