# Security and scope

This pre-release plugin controls only its two synthetic tools. It does not stop an agent using other OpenClaw tools, a malicious plugin, a privileged operator, or someone with database access. Host configuration, OpenClaw, Node and the operating system are trusted. Agent tool arguments are untrusted.

Never use customer data, bank credentials or real payment endpoints with the sandbox. Do not share your Gateway operator token. Report suspected vulnerabilities through [GitHub private vulnerability reporting](https://github.com/DGR-AI-Labs/dgr-openclaw/security/advisories/new), confirmed enabled on 2026-09-23. If that route becomes unavailable, request a private contact without posting exploit details or sensitive data in a public issue.

No auto-update or publication workflow is included. Source review, independent negative controls and exact-host testing are required for a qualified release. Claims are limited to the tested source, host and declared routes.
