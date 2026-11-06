---
name: release-readiness
description: Prepare a web, backend or mobile application for deployment by checking environment configuration, migrations, tests, build, observability and rollback.
---

# Release readiness

- Identify target platform, deployment provider, runtime and current release process.
- Check production build, typecheck, lint and relevant test suites.
- Review environment variables and provide a placeholder-only `.env.example`; never reveal actual secrets.
- Verify database migrations, backup expectations, seed-data safety and rollback strategy.
- Check auth callbacks/domains, CORS, storage, background jobs, webhooks and external service configuration.
- Confirm logging/monitoring, health checks, error reporting and basic operational documentation.
- For web, review metadata, caching, redirects, HTTPS and asset handling.
- For mobile, review app identifiers, permissions, signing, version/build numbers and store-specific requirements.
- Do not deploy, publish, migrate production data or create a release unless the user explicitly asks.
- Finish with a go/no-go checklist and list of blockers. Never claim deployment succeeded unless verified.
