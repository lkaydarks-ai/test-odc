---
name: testing-debugging
description: Reproduce bugs, diagnose root causes, write regression tests and verify fixes across frontend, backend and mobile applications.
---

# Testing and debugging

1. Reproduce the issue before changing code. Capture exact steps, expected vs actual behavior and relevant logs.
2. Inspect recent diffs and trace the failing data/state across boundaries.
3. Form a falsifiable root-cause hypothesis; avoid random edits and symptom-only patches.
4. Write or identify a regression test that fails before the fix when practical.
5. Make the smallest safe correction.
6. Run the focused test first, then relevant integration, lint, typecheck and build checks.
7. For UI issues, verify responsive states and accessibility; for APIs, verify validation/auth/error paths; for mobile, verify lifecycle and platform differences.
8. Do not remove, skip or weaken tests to hide failures.
9. If the environment cannot run a test (missing simulator, database, credentials), state that limitation and provide the exact manual verification needed.
10. Report root cause, fix, tests run and remaining uncertainty.
