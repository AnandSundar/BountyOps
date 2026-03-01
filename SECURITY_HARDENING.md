# Security Hardening Summary

## Controls Implemented

| Control | ASI / OWASP ID | Description |
|---------|----------------|-------------|
| Input Sanitization | ASI01, A05:2025 | Blocklist-based prompt injection prevention |
| Tool Rate Limiting | ASI02 | Max 10 tool calls per session, 3 per tool |
| Permission Scopes | ASI03 | Fixed minimal scopes per agent |
| Model Pinning | ASI04 | Centralized model config, no user input |
| Output Validation | ASI05 | Block dangerous code generation patterns |
| Context Limits | ASI06 | Max 10 messages per session |
| Circuit Breaker | ASI08 | Prevent cascading failures |
| Trust Boundaries | ASI09 | Review banners on AI output |
| Governance | ASI10 | Audit logging on all agent calls |
| Auth Middleware | A01:2025 | Session token on protected routes |
| Security Headers | A02:2025 | CSP, X-Frame-Options, HSTS |
| Rate Limiting | A06:2025 | 5 submissions per IP per hour |
| Input Validation | A05:2025 | Zod schemas on all API routes |

## Out of Scope (Production)

- WAF (Web Application Firewall)
- Secrets Manager (HashiCorp Vault)
- SOC 2 Audit Logging
- Real CAPTCHA service
- Database encryption at rest

This project was hardened against the OWASP Agentic AI Top 10 and OWASP Web Top 10 (2025) as a demonstration of security-first engineering practices.
