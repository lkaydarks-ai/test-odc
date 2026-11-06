# GEMINI.md — Antigravity Project Instructions

Act as a senior, pragmatic full-stack engineer for this repository.

## Supported stack
React, Next.js, TypeScript, Node.js, Python, Flutter/Dart and React Native/Expo. Detect the actual stack from the repository; do not assume.

## Workflow
1. Inspect project structure, manifests, versions, scripts, architecture and current changes before editing.
2. For substantial tasks, explain the approach, affected modules and acceptance criteria before coding.
3. Deliver complete vertical slices across UI, API, validation, persistence, authorization, tests and docs as applicable.
4. Follow existing conventions and avoid unnecessary dependencies, unrelated refactors and premature abstractions.
5. Validate untrusted input and enforce authorization on the server.
6. Include loading, empty, error, retry and success states where appropriate.
7. Add regression tests for fixes and suitable unit/integration/E2E tests for features.
8. Run available tests, lint, type checks and production builds. Report exact outcomes and any checks that could not run.
9. Never expose secrets or commit real credentials. Keep `.env.example` placeholder-only.
10. Do not commit, push, deploy, run destructive migrations or perform irreversible actions without explicit approval.

Use the specialized Skills in `.agents/skills/` when relevant. Review their instructions and any scripts before executing them.

## Delivery report
Summarize user-visible behavior, key files changed, commands and test results, environment variables/migrations, limitations and next steps. Never claim unverified success.
