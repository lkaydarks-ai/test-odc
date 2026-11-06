---
name: security-review
description: Review application code for security and privacy risks, including auth, authorization, API validation, secrets, database access and file uploads.
---

# Security review

Review the relevant code and configuration for:
- Authentication and session/token handling; secure cookie flags and expiration.
- Authorization at route, resource and object level; IDOR/BOLA risks.
- Input validation, output encoding, XSS, CSRF, SSRF, injection and unsafe deserialization.
- SQL/NoSQL query safety and mass assignment.
- CORS, security headers, rate limiting, brute-force controls and abuse cases.
- File upload type/size/content validation, storage isolation and malware scanning needs.
- Secret exposure in source, logs, client bundles, mobile binaries and repository history.
- Dependency and supply-chain risks; unsafe scripts and excessive permissions.
- Sensitive data minimization, retention and logging.
- Production error handling, debug endpoints and default credentials.

For each finding, provide severity, affected location, realistic impact, evidence and a practical remediation. Distinguish confirmed vulnerabilities from hardening recommendations. Do not run destructive tests or access production systems without explicit authorization. Never print secret values.
