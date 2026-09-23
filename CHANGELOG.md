# Changelog

## 0.1.0-beta.1 — release candidate

Publication date and registry availability are not yet established.

- Adds bounded synthetic invoice attachment and simulated USD payment tools through a shared JavaScript/SQLite gate.
- Enforces strict action/configuration validation, destination and amount policy, invoice evidence, durable replay checks, and transactional effects with decision records.
- Stops further actions after storage failures and reports ambiguous commits without automatic retry.
- Includes isolated installed-host tests, deliberate-bug controls, contribution guidance and public feedback routes.

Requires OpenClaw 2026.9.5 and Node >=24.16.0 <25. This is an experimental developer sandbox: no real funds, external payment service, refund tool, or protection of unrelated OpenClaw tools. Ledger consistency does not establish authenticity against an administrator.

Founder release approval is recorded. See [release review](docs/release-review.md) for remaining review, publisher and registry-installation checks.
