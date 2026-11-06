---
name: architecture-planning
description: Design or evaluate application architecture, data models, API boundaries, module structure and technical choices before implementation.
---

# Architecture planning

- Inspect the actual repository and identify the existing stack before recommending changes.
- Clarify product goals, users/roles, critical workflows, expected scale, integrations, hosting constraints and data sensitivity.
- Prefer the simplest architecture that meets requirements. Do not default to microservices.
- Define modules and responsibilities; keep domain rules independent from UI and transport concerns.
- Propose data entities, relationships, constraints, indexes and migration strategy.
- Define API contracts, validation, authentication, authorization, error format and pagination.
- For web/mobile clients, define navigation, state ownership, caching, offline behavior and API client boundaries.
- Address observability, backups, deployment environments, secrets and rollback.
- Compare alternatives with concise trade-offs. Separate required decisions from optional future improvements.
- Produce a staged implementation plan with acceptance criteria and test strategy.
- Do not generate a large scaffold until the plan is accepted when the task is substantial.
